import React from 'react';
import { interpolate } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PressStart2P';

const { fontFamily } = loadFont();
type B3 = { x: number; y: number; w: number; h: number; dx?: number; dy?: number; f: string; t: string; s: string; sw?: number };
const Box3D: React.FC<B3> = ({ x, y, w, h, dx = 8, dy = 6, f, t, s, sw = 1.8 }) => (
  <g stroke="#0f172a" strokeWidth={sw} strokeLinejoin="round">
    <polygon points={`${x},${y} ${x + dx},${y - dy} ${x + w + dx},${y - dy} ${x + w},${y}`} fill={t} />
    <polygon points={`${x + w},${y} ${x + w + dx},${y - dy} ${x + w + dx},${y + h - dy} ${x + w},${y + h}`} fill={s} />
    <rect x={x} y={y} width={w} height={h} fill={f} />
  </g>
);

export const CloseUpUdinNoSleep: React.FC<{ frame: number; localFrame: number }> = ({ frame, localFrame }) => {
  const zoom = interpolate(localFrame, [0, 145], [1, 1.055], { extrapolateRight: 'clamp' });
  const breath = Math.sin(frame * 0.14);
  const bubbleR = 3.2 + (breath + 1) * 2.1;
  const ringOn = (frame % 24) < 16;
  const aShake = ringOn ? Math.sin(frame * 2.8) * 3 : 0;
  const aJump = ringOn ? -Math.abs(Math.sin(frame * 1.4)) * 3.5 : 0;
  const bellRot = ringOn ? Math.sin(frame * 2.5) * 14 : 0;
  const rWave = (frame % 12) / 12;
  return (
    <div style={{ position: 'absolute', top: 230, left: 60, right: 60, height: 1160, backgroundColor: '#0f172a', border: '8px solid #4ade80', borderRadius: 28, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.88)', zIndex: 38 }}>
      <svg width="100%" height="100%" viewBox="0 0 240 310" preserveAspectRatio="xMidYMid slice" style={{ transform: `scale(${zoom})`, transformOrigin: '50% 54%' }}>
        <defs>
          <linearGradient id="nsWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fef3c7" /><stop offset="100%" stopColor="#fde68a" /></linearGradient>
          <linearGradient id="nsSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#38bdf8" /><stop offset="100%" stopColor="#e0f2fe" /></linearGradient>
          <linearGradient id="nsBlk" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#1d4ed8" /></linearGradient>
        </defs>
        <rect width="240" height="205" fill="url(#nsWall)" />
        <rect y="198" width="240" height="8" fill="#d97706" stroke="#0f172a" strokeWidth="1.4" />
        <rect y="206" width="240" height="104" fill="#b45309" />
        <g transform="translate(18, 28)">
          <rect width="42" height="50" rx="3" fill="#1e1b4b" stroke="#78350f" strokeWidth="3" />
          <circle cx="21" cy="24" r="9" fill="#f97316" /><ellipse cx="21" cy="24" rx="15" ry="4" fill="none" stroke="#fde047" strokeWidth="1.8" transform="rotate(-18, 21, 24)" />
          <circle cx="10" cy="12" r="1.4" fill="#ffffff" /><circle cx="33" cy="38" r="1.4" fill="#fef08a" />
        </g>
        <rect x="142" y="20" width="82" height="90" rx="4" fill="url(#nsSky)" stroke="#78350f" strokeWidth="3.5" />
        <circle cx="196" cy="46" r="11" fill="#fde047" stroke="#f59e0b" strokeWidth="1.5" />
        <line x1="183" y1="20" x2="183" y2="110" stroke="#78350f" strokeWidth="2.4" /><line x1="142" y1="65" x2="224" y2="65" stroke="#78350f" strokeWidth="2.4" />
        <path d="M138,18 L158,18 Q150,62 146,114 L138,114 Z" fill="#60a5fa" stroke="#0f172a" strokeWidth="1.5" />
        <path d="M228,18 L208,18 Q216,62 220,114 L228,114 Z" fill="#60a5fa" stroke="#0f172a" strokeWidth="1.5" />
        <polygon points="148,110 218,110 162,258 64,258" fill="#fef08a" opacity="0.18" />
        <rect x="6" y="108" width="152" height="78" rx="9" fill="#92400e" stroke="#0f172a" strokeWidth="2" />
        <rect x="14" y="116" width="136" height="58" rx="5" fill="#b45309" stroke="#78350f" strokeWidth="1.4" />
        <rect x="6" y="180" width="154" height="106" rx="10" fill="#e2e8f0" stroke="#0f172a" strokeWidth="2" />
        <ellipse cx="82" cy="168" rx="62" ry="27" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
        <path d="M32,170 Q82,186 132,170" fill="none" stroke="#cbd5e1" strokeWidth="2.4" />
        <Box3D x={166} y={194} w={58} h={86} dx={8} dy={6} f="#92400e" t="#b45309" s="#78350f" sw={2} />
        <rect x="173" y="204" width="44" height="22" rx="2" fill="#78350f" stroke="#0f172a" strokeWidth="1.4" />
        <circle cx="195" cy="215" r="2.8" fill="#fde047" stroke="#0f172a" strokeWidth="1" />
        <g transform="translate(174, 180)">
          <rect x="0" y="0" width="12" height="13" rx="2" fill="#f8fafc" stroke="#0f172a" strokeWidth="1.5" />
          <path d="M12,3 Q16,3 16,6.5 Q16,10 12,10" fill="none" stroke="#0f172a" strokeWidth="1.5" />
          <ellipse cx="6" cy="1" rx="5" ry="1.8" fill="#78350f" />
        </g>
        <g transform={`translate(82, ${166 + breath * 1.2}) rotate(-6)`}>
          <circle cx="-28" cy="-22" r="6.5" fill="#fed7aa" stroke="#0f172a" strokeWidth="1.8" />
          <circle cx="28" cy="-22" r="6.5" fill="#fdba74" stroke="#0f172a" strokeWidth="1.8" />
          <rect x="-27" y="-50" width="54" height="52" rx="14" fill="#fed7aa" stroke="#0f172a" strokeWidth="2" />
          <path d="M16,-48 C24,-46 27,-38 27,-12 C27,-2 18,2 2,2 L27,2 L27,-48 Z" fill="#fdba74" opacity="0.55" />
          <path d="M-29,-34 C-31,-56 -14,-64 2,-62 C20,-64 32,-52 29,-32 L22,-38 L14,-31 L5,-40 L-6,-32 L-16,-40 L-24,-31 Z" fill="#29150b" stroke="#0f172a" strokeWidth="2" strokeLinejoin="round" />
          <path d="M-18,-54 Q0,-59 16,-53" fill="none" stroke="#5c2d16" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M-19,-30 Q-12,-33 -5,-29" fill="none" stroke="#29150b" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M5,-29 Q12,-33 19,-30" fill="none" stroke="#29150b" strokeWidth="2.4" strokeLinecap="round" />
          <ellipse cx="-13" cy="-14" rx="7.5" ry="2.6" fill="#4338ca" opacity="0.42" />
          <ellipse cx="13" cy="-14" rx="7.5" ry="2.6" fill="#4338ca" opacity="0.42" />
          <path d="M-20,-22 Q-13,-16 -6,-22" fill="none" stroke="#0f172a" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M6,-22 Q13,-16 20,-22" fill="none" stroke="#0f172a" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M-1,-14 Q1,-12 -1,-10" fill="none" stroke="#c2410c" strokeWidth="1.5" strokeLinecap="round" />
          <ellipse cx="0" cy="-6" rx="4.2" ry="3" fill="#7f1d1d" stroke="#0f172a" strokeWidth="1.5" />
          <circle cx={4 + bubbleR * 0.65} cy={-10 + bubbleR * 0.15} r={bubbleR} fill="#bae6fd" fillOpacity="0.74" stroke="#0284c7" strokeWidth="1.3" />
          <circle cx={3 + bubbleR * 0.4} cy={-10 - bubbleR * 0.2} r={Math.max(1.1, bubbleR * 0.25)} fill="#ffffff" />
        </g>
        <g transform={`translate(0, ${breath * 2})`}>
          <rect x="54" y="168" width="56" height="22" rx="10" fill="#dc2626" stroke="#0f172a" strokeWidth="1.8" />
          <path d="M8,186 Q82,170 158,188 L158,288 L8,288 Z" fill="url(#nsBlk)" stroke="#0f172a" strokeWidth="2" />
          <path d="M8,186 Q82,170 158,188 L158,203 Q82,186 8,201 Z" fill="#93c5fd" stroke="#0f172a" strokeWidth="1.7" />
          <path d="M32,222 Q74,214 114,226 M48,246 Q94,238 136,248" fill="none" stroke="#1e40af" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
          <g transform="translate(46, 185) rotate(-12)">
            <ellipse cx="0" cy="0" rx="10" ry="7.5" fill="#fed7aa" stroke="#0f172a" strokeWidth="1.8" />
            <line x1="-3" y1="-2" x2="-3" y2="5" stroke="#c2410c" strokeWidth="1.2" /><line x1="2" y1="-2" x2="2" y2="5" stroke="#c2410c" strokeWidth="1.2" />
          </g>
          <g transform="translate(118, 185) rotate(12)">
            <ellipse cx="0" cy="0" rx="10" ry="7.5" fill="#fed7aa" stroke="#0f172a" strokeWidth="1.8" />
            <line x1="-2" y1="-2" x2="-2" y2="5" stroke="#c2410c" strokeWidth="1.2" /><line x1="3" y1="-2" x2="3" y2="5" stroke="#c2410c" strokeWidth="1.2" />
          </g>
        </g>
        {[0, 1, 2].map((i) => {
          const p = ((frame + i * 18) % 54) / 54;
          return <text key={i} x={106 + p * 24 + Math.sin(p * 6) * 4} y={114 - p * 68} fill="#38bdf8" stroke="#0f172a" strokeWidth="1" fontSize={10 + p * 8} fontWeight="bold" fontFamily="monospace" opacity={Math.sin(p * Math.PI)}>Z</text>;
        })}
        <g transform={`translate(${204 + aShake}, ${174 + aJump})`}>
          <line x1="-10" y1="12" x2="-13" y2="19" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
          <line x1="10" y1="12" x2="13" y2="19" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
          <g transform={`translate(-13, -15) rotate(${-32 + bellRot})`}><path d="M-8,2 A8,8 0 0,1 8,2 Z" fill="#facc15" stroke="#0f172a" strokeWidth="1.6" /></g>
          <g transform={`translate(13, -15) rotate(${32 - bellRot})`}><path d="M-8,2 A8,8 0 0,1 8,2 Z" fill="#facc15" stroke="#0f172a" strokeWidth="1.6" /></g>
          <line x1="0" y1="-12" x2={bellRot * 0.2} y2="-21" stroke="#0f172a" strokeWidth="2" />
          <circle cx={bellRot * 0.2} cy="-22" r="2.5" fill="#94a3b8" stroke="#0f172a" strokeWidth="1.2" />
          <circle cx="0" cy="0" r="16" fill="#ef4444" stroke="#0f172a" strokeWidth="2" />
          <circle cx="0" cy="0" r="12" fill="#ffffff" stroke="#0f172a" strokeWidth="1.4" />
          <line x1="0" y1="0" x2="0" y2="-8" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="0" y1="0" x2="6" y2="-3" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="0" cy="0" r="1.8" fill="#0f172a" />
          {ringOn && (
            <g fill="none" stroke="#ef4444" strokeWidth="2" opacity={1 - rWave}>
              <path d={`M${-24 - rWave * 10},-24 Q${-32 - rWave * 10},-16 ${-24 - rWave * 10},-8`} />
              <path d={`M${24 + rWave * 10},-24 Q${32 + rWave * 10},-16 ${24 + rWave * 10},-8`} />
            </g>
          )}
        </g>
      </svg>
      <div style={{ position: 'absolute', bottom: 22, left: 22, right: 22, backgroundColor: 'rgba(15, 23, 42, 0.94)', border: '4px solid #4ade80', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontFamily, fontSize: 18, color: '#4ade80', lineHeight: 1.3 }}>TIDUR BALAS DENDAM!</div>
          <div style={{ fontFamily, fontSize: 11, color: '#fde047', marginTop: 9 }}>ALARM KERAS TIDAK MEMPAN</div>
        </div>
        <div style={{ fontFamily, fontSize: 17, color: '#38bdf8', padding: '8px 12px', borderRadius: 10, border: '2px solid #38bdf8', backgroundColor: 'rgba(56, 189, 248, 0.14)' }}>PULES!</div>
      </div>
    </div>
  );
};
