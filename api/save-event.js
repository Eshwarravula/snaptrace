import { put, list } from '@vercel/blob';

export const config = { api: { bodyParser: { sizeLimit: '1mb' } } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const event = req.body;
    if (!event || !event.id || !event.qrCode) {
      return res.status(400).json({ error: 'Missing event id or qrCode' });
    }

    // Save event metadata as JSON blob
    const eventData = {
      id: event.id,
      name: event.name,
      date: event.date,
      qrCode: event.qrCode,
      createdAt: event.createdAt || new Date().toISOString(),
      photoCount: event.photoCount || 0
    };

    await put(`events/${event.id}.json`, JSON.stringify(eventData), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false
    });

    // Save QR code → event ID mapping for guest lookup
    await put(`qr/${event.qrCode}.json`, JSON.stringify({ eventId: event.id }), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('save-event error:', err);
    return res.status(500).json({ error: err.message });
  }
}
