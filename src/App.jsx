import { useState, useRef, useCallback, useEffect } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap');

  :root {
    --thunder: #FFD700;
    --thunder-bright: #FFF176;
    --storm: #1a0a2e;
    --storm-mid: #0d0618;
    --storm-deep: #060310;
    --lightning: #c084fc;
    --lightning-bright: #e879f9;
    --rain: #38bdf8;
    --danger: #f87171;
    --success: #4ade80;
    --text: #e2e8f0;
    --text-muted: #94a3b8;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; }

  body {
    background: var(--storm-deep);
    font-family: 'Rajdhani', sans-serif;
    color: var(--text);
    overflow-x: hidden;
    min-height: 100vh;
  }

  @keyframes lightningFlash {
    0%, 88%, 100% { opacity: 0; }
    90%, 95% { opacity: 0.07; }
    93%, 98% { opacity: 0.03; }
  }
  @keyframes boltFlicker {
    0%   { opacity: 1;   transform: scaleY(1); }
    30%  { opacity: 0.7; transform: scaleY(0.97); }
    60%  { opacity: 1;   transform: scaleY(1.02); }
    100% { opacity: 1;   transform: scaleY(1); }
  }
  @keyframes thunderPulse {
    0%,100% { box-shadow: 0 0 15px #FFD70055, inset 0 0 10px #FFD70008; border-color: #FFD70066; }
    50%     { box-shadow: 0 0 40px #FFD700aa, inset 0 0 20px #FFD70018; border-color: #FFD700cc; }
  }
  @keyframes stormScan {
    0%   { transform: translateY(-4px); opacity: 0; }
    5%   { opacity: 0.6; }
    95%  { opacity: 0.6; }
    100% { transform: translateY(100vh); opacity: 0; }
  }
  @keyframes electricBorder {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes float {
    0%,100% { transform: translateY(0px); }
    50%     { transform: translateY(-8px); }
  }
  @keyframes particleDrift {
    0%   { transform: translateY(100vh); opacity: 0; }
    8%   { opacity: 1; }
    92%  { opacity: 1; }
    100% { transform: translateY(-80px); opacity: 0; }
  }
  @keyframes progressShine {
    0%   { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
  }
  @keyframes spinRing {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes pulse {
    0%,100% { opacity: 1; }
    50%     { opacity: 0.4; }
  }

  /* ── Background ── */
  .app-bg {
    position: fixed; inset: 0; z-index: 0; overflow: hidden; pointer-events: none;
  }
  .storm-layer {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse at 20% 15%, #1e0a3a44 0%, transparent 55%),
      radial-gradient(ellipse at 80% 85%, #0a1a3a44 0%, transparent 55%),
      radial-gradient(ellipse at 50% 50%, #0d0618 0%, #060310 100%);
  }
  .lightning-bg {
    position: absolute; inset: 0;
    background: #c084fc;
    animation: lightningFlash 6s infinite;
  }
  .scan-line {
    position: absolute; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, #FFD70033, #FFD700aa, #FFD70033, transparent);
    animation: stormScan 9s linear infinite;
    box-shadow: 0 0 10px #FFD700;
  }
  .scan-line-2 {
    animation-delay: -4.5s; animation-duration: 13s;
    background: linear-gradient(90deg, transparent, #c084fc22, #c084fc66, #c084fc22, transparent);
    box-shadow: 0 0 8px #c084fc;
  }
  .bolt-side {
    position: absolute; top: 0; width: 2px; height: 100%;
    background: linear-gradient(180deg, transparent, #FFD70055 30%, #FFD700bb 50%, #FFD70055 70%, transparent);
    animation: boltFlicker 3.5s ease-in-out infinite;
  }
  .bolt-left  { left: 7%;  animation-delay: 0s; }
  .bolt-right { right: 7%; animation-delay: 1.8s; }

  .particle {
    position: absolute;
    border-radius: 50%;
    animation: particleDrift linear infinite;
  }

  /* ── Layout ── */
  .main-content {
    position: relative; z-index: 1;
    min-height: 100vh;
    display: flex; flex-direction: column; align-items: center;
    padding: 40px 20px 60px;
    max-width: 860px; margin: 0 auto;
  }

  /* ── Header ── */
  .header { text-align: center; margin-bottom: 48px; animation: float 4s ease-in-out infinite; }
  .logo-icon {
    font-size: 60px; display: block; margin-bottom: 12px;
    filter: drop-shadow(0 0 18px #FFD700) drop-shadow(0 0 40px #FFD70077);
  }
  .title {
    font-family: 'Orbitron', monospace;
    font-size: clamp(1.8rem, 5vw, 3.2rem);
    font-weight: 900; letter-spacing: 0.15em; text-transform: uppercase;
    background: linear-gradient(135deg, #FFD700, #FFF176, #FFD700, #c084fc);
    background-size: 300% 300%;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    animation: electricBorder 4s ease infinite;
    filter: drop-shadow(0 0 18px #FFD70077);
  }
  .subtitle {
    font-size: 0.95rem; letter-spacing: 0.3em;
    color: var(--text-muted); text-transform: uppercase; margin-top: 6px;
  }

  /* ── Tabs ── */
  .tab-container {
    display: flex; gap: 4px;
    background: #0d0618aa;
    border: 1px solid #FFD70033; border-radius: 12px;
    padding: 4px; margin-bottom: 28px;
    width: 100%; max-width: 420px;
    backdrop-filter: blur(10px);
  }
  .tab {
    flex: 1; padding: 12px 20px;
    background: transparent; border: none; border-radius: 8px;
    font-family: 'Orbitron', monospace; font-size: 0.7rem; letter-spacing: 0.1em;
    color: var(--text-muted); cursor: pointer; transition: all 0.3s; text-transform: uppercase;
  }
  .tab.active {
    background: linear-gradient(135deg, #FFD70022, #c084fc22);
    color: var(--thunder);
    box-shadow: 0 0 20px #FFD70033;
    border: 1px solid #FFD70066;
  }
  .tab:hover:not(.active) { color: var(--text); background: #ffffff0a; }

  /* ── Card ── */
  .card {
    width: 100%;
    background: linear-gradient(135deg, #0d061888, #1a0a2e66);
    border: 1px solid #FFD70033; border-radius: 20px;
    padding: 32px; backdrop-filter: blur(16px);
    position: relative; overflow: hidden;
    animation: thunderPulse 4s ease-in-out infinite;
  }
  .card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, #FFD70077, transparent);
  }
  .corner { position: absolute; width: 18px; height: 18px; border-color: #FFD700aa; border-style: solid; opacity: 0.7; }
  .corner.tl { top:12px; left:12px;  border-width: 2px 0 0 2px; }
  .corner.tr { top:12px; right:12px; border-width: 2px 2px 0 0; }
  .corner.bl { bottom:12px; left:12px;  border-width: 0 0 2px 2px; }
  .corner.br { bottom:12px; right:12px; border-width: 0 2px 2px 0; }

  /* ── Fields ── */
  .field-group { margin-bottom: 22px; }
  .field-label {
    font-family: 'Orbitron', monospace; font-size: 0.62rem;
    letter-spacing: 0.2em; color: var(--thunder); text-transform: uppercase;
    margin-bottom: 8px; display: flex; align-items: center; gap: 8px;
  }
  .field-label::before {
    content: ''; width: 3px; height: 11px;
    background: var(--thunder); box-shadow: 0 0 6px var(--thunder); border-radius: 2px;
  }

  textarea, input[type="text"], input[type="password"] {
    width: 100%;
    background: #06031088; border: 1px solid #FFD70033; border-radius: 10px;
    padding: 12px 15px; color: var(--text);
    font-family: 'Rajdhani', sans-serif; font-size: 1rem; line-height: 1.5;
    resize: vertical; transition: all 0.3s; outline: none;
  }
  textarea:focus, input:focus {
    border-color: #FFD70099;
    box-shadow: 0 0 18px #FFD70033, inset 0 0 8px #FFD70011;
    background: #0d061888;
  }
  textarea::placeholder, input::placeholder { color: #ffffff2e; font-style: italic; }

  /* ── Image Upload ── */
  .upload-zone {
    width: 100%; min-height: 150px;
    border: 2px dashed #FFD70044; border-radius: 12px;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;
    cursor: pointer; transition: all 0.3s; background: #06031066; overflow: hidden;
  }
  .upload-zone:hover, .upload-zone.over { border-color: #FFD700aa; background: #FFD70011; box-shadow: 0 0 28px #FFD70022; }
  .upload-icon { font-size: 2.2rem; }
  .upload-text { font-family: 'Orbitron', monospace; font-size: 0.65rem; letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase; }
  .preview-img { width: 100%; max-height: 180px; object-fit: cover; border-radius: 8px; }

  /* ── Enhance btn ── */
  .enhance-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; margin-top: 8px;
    background: linear-gradient(135deg, #c084fc22, #e879f922);
    border: 1px solid #c084fc55; border-radius: 8px;
    color: var(--lightning-bright);
    font-family: 'Orbitron', monospace; font-size: 0.62rem; letter-spacing: 0.08em;
    cursor: pointer; transition: all 0.3s; text-transform: uppercase;
  }
  .enhance-btn:hover:not(:disabled) { background: linear-gradient(135deg,#c084fc33,#e879f933); box-shadow: 0 0 18px #c084fc33; border-color: #c084fc99; }
  .enhance-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* ── Settings grid ── */
  .settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 22px; }
  .setting-item label {
    font-family: 'Orbitron', monospace; font-size: 0.58rem; letter-spacing: 0.12em;
    color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 6px;
  }
  select {
    width: 100%; background: #06031088; border: 1px solid #FFD70033; border-radius: 8px;
    padding: 10px 12px; color: var(--text);
    font-family: 'Rajdhani', sans-serif; font-size: 0.95rem;
    cursor: pointer; outline: none; appearance: none; transition: all 0.3s;
  }
  select:focus { border-color: #FFD70099; box-shadow: 0 0 12px #FFD70033; }

  /* ── Generate button ── */
  .generate-btn {
    width: 100%; padding: 17px 30px;
    background: linear-gradient(135deg, #FFD700, #f59e0b, #FFD700);
    background-size: 200% 200%;
    animation: electricBorder 3s ease infinite;
    border: none; border-radius: 12px;
    font-family: 'Orbitron', monospace; font-size: 0.85rem;
    font-weight: 700; letter-spacing: 0.18em; color: #0d0618;
    cursor: pointer; text-transform: uppercase;
    position: relative; overflow: hidden; transition: all 0.3s;
    box-shadow: 0 0 28px #FFD70077, 0 4px 18px #00000055;
  }
  .generate-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 0 50px #FFD700aa, 0 8px 28px #00000077; }
  .generate-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; animation: none; background: #3f3f46; box-shadow: none; color: #71717a; }
  .generate-btn::after {
    content: ''; position: absolute;
    top: -50%; left: -60%; width: 35%; height: 200%;
    background: linear-gradient(90deg, transparent, #ffffff44, transparent);
    transform: skewX(-20deg); transition: left 0.5s;
  }
  .generate-btn:hover:not(:disabled)::after { left: 120%; }

  /* ── Progress ── */
  .progress-box {
    margin-top: 22px; padding: 18px;
    background: #06031088; border: 1px solid #FFD70033; border-radius: 12px;
  }
  .progress-label {
    font-family: 'Orbitron', monospace; font-size: 0.6rem; letter-spacing: 0.15em;
    color: var(--thunder); margin-bottom: 10px;
    display: flex; justify-content: space-between; align-items: center;
  }
  .progress-bar { height: 6px; background: #1a0a2e; border-radius: 3px; overflow: hidden; }
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #FFD700, #FFF176, #c084fc, #FFD700);
    background-size: 200% 100%;
    border-radius: 3px;
    animation: progressShine 1.5s linear infinite;
    transition: width 0.4s ease;
    box-shadow: 0 0 12px #FFD700;
  }
  .dots { display: flex; gap: 5px; align-items: center; margin-top: 10px; }
  .dot { width: 5px; height: 5px; border-radius: 50%; background: var(--thunder); animation: pulse 0.8s ease-in-out infinite; }
  .dot:nth-child(2) { animation-delay: 0.25s; }
  .dot:nth-child(3) { animation-delay: 0.5s; }
  .status-text { font-size: 0.82rem; color: var(--text-muted); margin-left: 6px; }

  /* ── Result ── */
  .result-box { margin-top: 22px; border: 1px solid #4ade8055; border-radius: 14px; overflow: hidden; background: #06031088; }
  .result-header {
    padding: 12px 18px; background: #4ade8011; border-bottom: 1px solid #4ade8033;
    font-family: 'Orbitron', monospace; font-size: 0.62rem; letter-spacing: 0.12em;
    color: var(--success); text-transform: uppercase; display: flex; align-items: center; gap: 8px;
  }
  video { width: 100%; display: block; max-height: 380px; background: #000; }
  .result-actions { padding: 12px 18px; display: flex; gap: 10px; }
  .download-btn {
    flex: 1; padding: 11px 18px;
    background: linear-gradient(135deg, #4ade8022, #22c55e22);
    border: 1px solid #4ade8055; border-radius: 10px;
    color: var(--success);
    font-family: 'Orbitron', monospace; font-size: 0.62rem; letter-spacing: 0.08em;
    cursor: pointer; text-transform: uppercase; transition: all 0.3s;
    display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none;
  }
  .download-btn:hover { background: linear-gradient(135deg,#4ade8033,#22c55e33); box-shadow: 0 0 18px #4ade8033; border-color: #4ade8099; }

  /* ── Error ── */
  .error-box {
    margin-top: 14px; padding: 14px 16px;
    background: #f8717111; border: 1px solid #f8717144; border-radius: 10px;
    color: var(--danger); font-size: 0.88rem; display: flex; align-items: flex-start; gap: 10px;
  }

  /* ── Info note ── */
  .info-note {
    padding: 11px 15px; background: #38bdf811;
    border: 1px solid #38bdf833; border-radius: 10px;
    color: var(--rain); font-size: 0.82rem; line-height: 1.5; margin-bottom: 18px;
  }
  .info-note a { color: var(--thunder); text-decoration: none; }
  .info-note a:hover { text-decoration: underline; }

  /* ── Retry hint ── */
  .retry-hint { font-size: 0.78rem; color: var(--text-muted); margin-top: 6px; }

  @media (max-width: 580px) {
    .settings-grid { grid-template-columns: 1fr; }
    .card { padding: 18px; }
  }
`;

const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 12}s`,
  dur: `${9 + Math.random() * 10}s`,
  size: Math.random() > 0.5 ? 3 : 2,
  color: Math.random() > 0.5 ? "#FFD700" : "#c084fc",
}));

function Background() {
  return (
    <div className="app-bg">
      <div className="storm-layer" />
      <div className="lightning-bg" />
      <div className="scan-line" />
      <div className="scan-line scan-line-2" />
      <div className="bolt-side bolt-left" />
      <div className="bolt-side bolt-right" />
      {PARTICLES.map(p => (
        <div key={p.id} className="particle" style={{
          left: p.left, bottom: "-10px",
          animationDelay: p.delay, animationDuration: p.dur,
          width: p.size, height: p.size,
          background: p.color, boxShadow: `0 0 5px ${p.color}`,
        }} />
      ))}
    </div>
  );
}

const STATUS_MSGS = [
  "Charging the storm core...",
  "Connecting to AI servers...",
  "Summoning thunder diffusion...",
  "Rendering temporal frames...",
  "Upscaling with lightning...",
  "Almost done...",
];

export default function App() {
  const [tab, setTab]               = useState("t2v");
  const [prompt, setPrompt]         = useState("");
  const [negPrompt, setNegPrompt]   = useState("low quality, blurry, distorted, watermark");
  const [hfToken, setHfToken]       = useState("");
  const [imageFile, setImageFile]   = useState(null);
  const [imagePreview, setImgPrev]  = useState(null);
  const [steps, setSteps]           = useState("25");
  const [duration, setDuration]     = useState("3");
  const [resolution, setResolution] = useState("704x400");
  const [loading, setLoading]       = useState(false);
  const [progress, setProgress]     = useState(0);
  const [statusMsg, setStatusMsg]   = useState("");
  const [result, setResult]         = useState(null);
  const [error, setError]           = useState("");
  const [enhancing, setEnhancing]   = useState(false);
  const [dragover, setDragover]     = useState(false);

  const fileRef   = useRef();
  const timerRef  = useRef();
  const msgIdx    = useRef(0);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const startProgress = () => {
    msgIdx.current = 0;
    setProgress(4);
    setStatusMsg(STATUS_MSGS[0]);
    timerRef.current = setInterval(() => {
      setProgress(p => {
        const n = p + Math.random() * 3 + 0.8;
        return n >= 88 ? 88 : n;
      });
      msgIdx.current = Math.min(msgIdx.current + 1, STATUS_MSGS.length - 1);
      setStatusMsg(STATUS_MSGS[msgIdx.current]);
    }, 2000);
  };

  const stopProgress = (success) => {
    clearInterval(timerRef.current);
    setProgress(success ? 100 : 0);
    if (success) setStatusMsg("Storm complete! ⚡");
  };

  /* ── Enhance prompt via Claude (works fine from artifact) ── */
  const enhancePrompt = async () => {
    if (!prompt.trim()) return;
    setEnhancing(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 300,
          messages: [{
            role: "user",
            content: `You are a video prompt expert for LTX-2 AI video generator. Enhance this prompt to be more detailed and cinematic for better results. Return ONLY the enhanced prompt, nothing else:\n\n${prompt}`,
          }],
        }),
      });
      const data = await res.json();
      if (data.content?.[0]?.text) setPrompt(data.content[0].text.trim());
    } catch { setError("Prompt enhancement failed."); }
    setEnhancing(false);
  };

  /* ── Image upload ── */
  const handleFile = useCallback((e) => {
    e.preventDefault(); setDragover(false);
    const file = e.dataTransfer?.files?.[0] ?? e.target?.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = ev => setImgPrev(ev.target.result);
    reader.readAsDataURL(file);
  }, []);

  /* ── Generate ── */
  const generate = async () => {
    if (!prompt.trim()) { setError("⚡ Enter a prompt!"); return; }
    if (tab === "i2v" && !imageFile) { setError("⚡ Upload a reference image!"); return; }

    setError(""); setResult(null); setLoading(true);
    startProgress();

    try {
      const [w, h] = resolution.split("x").map(Number);
      let imageBase64 = null;

      if (tab === "i2v" && imageFile) {
        imageBase64 = await new Promise(res => {
          const r = new FileReader();
          r.onload = ev => res(ev.target.result.split(",")[1]);
          r.readAsDataURL(imageFile);
        });
      }

      // ✅ Call OUR OWN Vercel API route — no CORS issues!
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          negativePrompt: negPrompt,
          steps,
          width: w,
          height: h,
          numFrames: parseInt(duration) * 8,
          hfToken,
          mode: tab,
          imageBase64,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(err.error || `Server error ${res.status}`);
      }

      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      stopProgress(true);
      setResult({ url });
    } catch (e) {
      stopProgress(false);
      setError(e.message);
    }

    setLoading(false);
  };

  return (
    <>
      <style>{STYLES}</style>
      <Background />

      <div className="main-content">
        {/* Header */}
        <div className="header">
          <span className="logo-icon">⚡</span>
          <div className="title">LTX — 2</div>
          <div className="subtitle">Thunder Video Generator</div>
        </div>

        {/* Tabs */}
        <div className="tab-container">
          <button className={`tab ${tab === "t2v" ? "active" : ""}`} onClick={() => setTab("t2v")}>⚡ Text → Video</button>
          <button className={`tab ${tab === "i2v" ? "active" : ""}`} onClick={() => setTab("i2v")}>🌩 Image → Video</button>
        </div>

        <div className="card">
          <div className="corner tl"/><div className="corner tr"/>
          <div className="corner bl"/><div className="corner br"/>

          {/* Token (optional) */}
          <div className="field-group">
            <div className="field-label">HuggingFace Token <span style={{color:"#4ade80",fontSize:"0.55rem"}}>(OPTIONAL)</span></div>
            <input
              type="password"
              placeholder="hf_xxxx  —  leave empty to use free tier"
              value={hfToken}
              onChange={e => setHfToken(e.target.value)}
            />
            <div className="info-note" style={{marginTop:10}}>
              🌩 Token optional — free tier works but may be slower. Get one at{" "}
              <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noreferrer">huggingface.co/settings/tokens</a>.
              API calls go through your own Vercel backend — <strong>100% secure</strong>.
            </div>
          </div>

          {/* Image upload (i2v only) */}
          {tab === "i2v" && (
            <div className="field-group">
              <div className="field-label">Reference Image</div>
              <div
                className={`upload-zone ${dragover ? "over" : ""}`}
                onClick={() => fileRef.current.click()}
                onDragOver={e => { e.preventDefault(); setDragover(true); }}
                onDragLeave={() => setDragover(false)}
                onDrop={handleFile}
              >
                {imagePreview
                  ? <img src={imagePreview} className="preview-img" alt="preview" />
                  : (<><span className="upload-icon">🌩</span><span className="upload-text">Drop image or click to upload</span></>)}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleFile} />
            </div>
          )}

          {/* Prompt */}
          <div className="field-group">
            <div className="field-label">Prompt</div>
            <textarea
              rows={4}
              placeholder={tab === "t2v"
                ? "A lightning storm over a cyberpunk city at night, neon reflections on wet streets, cinematic camera pan..."
                : "The character slowly looks at the camera with glowing eyes, dramatic wind effect, cinematic lighting..."}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
            />
            <button className="enhance-btn" onClick={enhancePrompt} disabled={enhancing || !prompt.trim()}>
              {enhancing ? "⚡ Enhancing..." : "✨ AI Enhance Prompt"}
            </button>
          </div>

          {/* Negative */}
          <div className="field-group">
            <div className="field-label">Negative Prompt</div>
            <input type="text" value={negPrompt} onChange={e => setNegPrompt(e.target.value)} />
          </div>

          {/* Settings */}
          <div className="settings-grid">
            <div className="setting-item">
              <label>Inference Steps</label>
              <select value={steps} onChange={e => setSteps(e.target.value)}>
                <option value="10">10 — Fastest</option>
                <option value="20">20 — Balanced</option>
                <option value="25">25 — Quality ★</option>
                <option value="40">40 — Best</option>
              </select>
            </div>
            <div className="setting-item">
              <label>Duration</label>
              <select value={duration} onChange={e => setDuration(e.target.value)}>
                <option value="2">2 seconds</option>
                <option value="3">3 seconds ★</option>
                <option value="5">5 seconds</option>
              </select>
            </div>
            <div className="setting-item">
              <label>Resolution</label>
              <select value={resolution} onChange={e => setResolution(e.target.value)}>
                <option value="480x272">480×272 — Fast</option>
                <option value="704x400">704×400 — HD ★</option>
                <option value="768x432">768×432 — Full HD</option>
              </select>
            </div>
            <div className="setting-item">
              <label>Mode</label>
              <select>
                <option>Distilled (Fast)</option>
                <option>Standard</option>
              </select>
            </div>
          </div>

          {/* Generate */}
          <button className="generate-btn" onClick={generate} disabled={loading}>
            {loading ? "⚡ GENERATING STORM..." : "⚡ GENERATE VIDEO"}
          </button>

          {/* Progress */}
          {loading && (
            <div className="progress-box">
              <div className="progress-label">
                <span>RENDERING</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="dots">
                <div className="dot"/><div className="dot"/><div className="dot"/>
                <span className="status-text">{statusMsg}</span>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="error-box">
              <span>⚡</span>
              <div>
                <strong>Storm Error:</strong> {error}
                {error.includes("503") && <div className="retry-hint">Model is warming up — wait 30s and try again.</div>}
              </div>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="result-box">
              <div className="result-header">✅ Video Generated Successfully</div>
              <video controls autoPlay loop src={result.url} />
              <div className="result-actions">
                <a className="download-btn" href={result.url} download="ltx2-video.mp4">⬇ Download Video</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
