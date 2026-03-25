import { put } from '@vercel/blob';

export const config = { api: { bodyParser: { sizeLimit: '6mb' } } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { eventId, photo } = req.body;
    if (!eventId || !photo || !photo.id || !photo.url) {
      return res.status(400).json({ error: 'Missing eventId, photo.id, or photo.url' });
    }

    // Convert data URL to buffer
    const matches = photo.url.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ error: 'Invalid data URL' });
    }
    const contentType = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');

    // Upload photo to Vercel Blob
    const blob = await put(`photos/${eventId}/${photo.id}.jpg`, buffer, {
      access: 'public',
      contentType: contentType,
      addRandomSuffix: false
    });

    // Save photo metadata (with cloud URL and face descriptors)
    const meta = {
      id: photo.id,
      url: blob.url,
      faces: photo.faces || 0,
      faceData: photo.faceData || [],
      name: photo.name || '',
      size: photo.size || 0,
      uploadedAt: new Date().toISOString()
    };

    await put(`meta/${eventId}/${photo.id}.json`, JSON.stringify(meta), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false
    });

    return res.status(200).json({ ok: true, url: blob.url, photoId: photo.id });
  } catch (err) {
    console.error('save-photo error:', err);
    return res.status(500).json({ error: err.message });
  }
}
