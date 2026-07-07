export function Background() {
  return (
    <div className="bg-container">
      <div className="polka-dots" />
      <div className="bg-shapes">
        <div className="bg-shape shape-star shape-1">⭐</div>
        <div className="bg-shape shape-star shape-2">💥</div>
        <div className="bg-shape shape-star shape-3">🎨</div>
        <div className="bg-shape shape-star shape-4">✏️</div>
        <div className="bg-shape shape-star shape-5">🌈</div>
      </div>
      <svg className="bg-squiggle-top" viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path d="M0,30 Q180,60 360,30 Q540,0 720,30 Q900,60 1080,30 Q1260,0 1440,30 L1440,0 L0,0 Z" fill="rgba(255,71,87,0.06)" />
      </svg>
      <svg className="bg-squiggle-bottom" viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path d="M0,30 Q180,60 360,30 Q540,0 720,30 Q900,60 1080,30 Q1260,0 1440,30 L1440,60 L0,60 Z" fill="rgba(30,144,255,0.06)" />
      </svg>
    </div>
  );
}
