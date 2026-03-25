import { list, head } from '@vercel/blob';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { qr, id } = req.query;
    let eventId = id;

    // If QR code provided, look up the event ID
    if (qr && !eventId) {
      const qrBlobs = await list({ prefix: `qr/${qr}.json` });
      if (qrBlobs.blobs.length === 0) {
        return res.status(404).json({ error: 'Event not found for QR code' });
      }
      // Fetch the QR mapping to get eventId
      const qrResp = await fetch(qrBlobs.blobs[0].url);
      const qrData = await qrResp.json();
      eventId = qrData.eventId;
    }

    if (!eventId) {
      return res.status(400).json({ error: 'Provide qr or id parameter' });
    }

    // Load event metadata
    const eventBlobs = await list({ prefix: `events/${eventId}.json` });
    if (eventBlobs.blobs.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    const eventResp = await fetch(eventBlobs.blobs[0].url);
    const eventData = await eventResp.json();

    // Load all photo metadata for this event
    const metaBlobs = await list({ prefix: `meta/${eventId}/` });
    const photos = [];
    for (const blob of metaBlobs.blobs) {
      try {
        const metaResp = await fetch(blob.url);
        const meta = await metaResp.json();
        photos.push(meta);
      } catch (e) {
        console.warn('Failed to load photo meta:', blob.pathname, e);
      }
    }

    // Sort by uploadedAt descending
    photos.sort((a, b) => (b.uploadedAt || '').localeCompare(a.uploadedAt || ''));

    return res.status(200).json({
      event: eventData,
      photos: photos
    });
  } catch (err) {
    console.error('get-event error:', err);
    return res.status(500).json({ error: err.message });
  }
}
