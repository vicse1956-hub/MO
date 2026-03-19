export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prompt, negativePrompt, steps, width, height, numFrames, hfToken } = req.body;

  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  const token = hfToken || process.env.HF_TOKEN || '';
  if (!token) return res.status(401).json({ error: 'HuggingFace token required! App mein token daalo.' });

  try {
    const hfRes = await fetch(
      'https://api-inference.huggingface.co/models/Lightricks/LTX-Video',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            negative_prompt: negativePrompt || 'low quality, blurry, distorted',
            num_inference_steps: parseInt(steps) || 25,
            width: parseInt(width) || 704,
            height: parseInt(height) || 400,
            num_frames: parseInt(numFrames) || 24,
            guidance_scale: 3.5,
          },
        }),
      }
    );

    if (!hfRes.ok) {
      const errText = await hfRes.text();
      let errJson = {};
      try { errJson = JSON.parse(errText); } catch {}
      if (hfRes.status === 503) {
        return res.status(503).json({ error: 'Model load ho raha hai. 30 second wait karo aur try karo.' });
      }
      return res.status(hfRes.status).json({
        error: errJson.error || errText.slice(0, 300) || 'HuggingFace error',
      });
    }

    const videoBuffer = await hfRes.arrayBuffer();
    res.setHeader('Content-Type', hfRes.headers.get('content-type') || 'video/mp4');
    res.status(200).send(Buffer.from(videoBuffer));

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
