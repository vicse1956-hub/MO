// api/generate.js - Vercel Serverless Function (Node.js)
// This runs on the SERVER - no CORS issues!

export default async function handler(req, res) {
  // Allow all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prompt, negativePrompt, steps, width, height, numFrames, hfToken, mode, imageBase64 } = req.body;

  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  const token = hfToken || process.env.HF_TOKEN || '';
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    // Use HuggingFace Inference API - works fine from server side
    const MODEL = 'Lightricks/LTX-Video';
    const hfRes = await fetch(`router.huggingface.co/hf-inference/models/${MODEL}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          negative_prompt: negativePrompt || 'low quality, blurry, distorted',
          num_inference_steps: parseInt(steps) || 25,
          width: parseInt(width) || 704,
          height: parseInt(height) || 400,
          num_frames: parseInt(numFrames) || 24,
          guidance_scale: 3.5,
          ...(imageBase64 ? { image: imageBase64 } : {}),
        },
      }),
    });

    if (!hfRes.ok) {
      const errText = await hfRes.text();
      let errJson = {};
      try { errJson = JSON.parse(errText); } catch {}

      // Model loading - tell client to retry
      if (hfRes.status === 503) {
        return res.status(503).json({
          error: 'Model is loading on HuggingFace servers. Please wait 20-30 seconds and try again.',
          estimated_time: errJson.estimated_time || 30,
        });
      }

      return res.status(hfRes.status).json({
        error: errJson.error || `HuggingFace API error: ${hfRes.status}`,
      });
    }

    // Stream the video blob back to client
    const videoBuffer = await hfRes.arrayBuffer();
    const contentType = hfRes.headers.get('content-type') || 'video/mp4';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', videoBuffer.byteLength);
    res.status(200).send(Buffer.from(videoBuffer));

  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: `Server error: ${err.message}` });
  }
}
