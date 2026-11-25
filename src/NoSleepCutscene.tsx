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
  const bubbleR = 5.5 + (breath + 1) * 4;
  const ringOn = (frame % 24) < 16;
  const aShake = ringOn ? Math.sin(frame * 2.8) * 3.2 : 0;
  const aJump = ringOn ? -Math.abs(Math.sin(frame * 1.4)) * 3.8 : 0;
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
        <g transform="translate(20, 34)">
          <rect width="42" height="50" rx="3" fill="#1e1b4b" stroke="#78350f" strokeWidth="3" />
          <circle cx="21" cy="24" r="9" fill="#f97316" /><ellipse cx="21" cy="24" rx="15" ry="4" fill="none" stroke="#fde047" strokeWidth="1.8" transform="rotate(-18, 21, 24)" />
          <circle cx="10" cy="12" r="1.4" fill="#ffffff" /><circle cx="33" cy="38" r="1.4" fill="#fef08a" />
        </g>
        <rect x="150" y="24" width="74" height="88" rx="4" fill="url(#nsSky)" stroke="#78350f" strokeWidth="3.5" />
        <circle cx="204" cy="48" r="11" fill="#fde047" stroke="#f59e0b" strokeWidth="1.5" />
        <line x1="187" y1="24" x2="187" y2="112" stroke="#78350f" strokeWidth="2.5" /><line x1="150" y1="68" x2="224" y2="68" stroke="#78350f" strokeWidth="2.5" />
        <polygon points="150,112 224,112 162,258 64,258" fill="#fef08a" opacity="0.18" />
        <rect x="10" y="114" width="146" height="76" rx="8" fill="#92400e" stroke="#0f172a" strokeWidth="2" />
        <rect x="18" y="122" width="130" height="56" rx="5" fill="#b45309" stroke="#78350f" strokeWidth="1.4" />
        <rect x="8" y="182" width="152" height="104" rx="10" fill="#e2e8f0" stroke="#0f172a" strokeWidth="2" />
        <ellipse cx="86" cy="176" rx="56" ry="26" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
        <path d="M40,178 Q86,192 132,178" fill="none" stroke="#cbd5e1" strokeWidth="2.2" />
        <Box3D x={168} y={194} w={56} h={84} dx={8} dy={6} f="#92400e" t="#b45309" s="#78350f" sw={2} />
        <rect x="175" y="204" width="42" height="22" rx="2" fill="#78350f" stroke="#0f172a" strokeWidth="1.4" />
        <circle cx="196" cy="215" r="2.8" fill="#fde047" stroke="#0f172a" strokeWidth="1" />
        <g transform={`translate(0, ${breath * 2.2})`}>
          <rect x="64" y="176" width="42" height="16" rx="4" fill="#dc2626" stroke="#0f172a" strokeWidth="1.8" />
          <path d="M12,196 Q84,178 156,198 L156,286 L12,286 Z" fill="url(#nsBlk)" stroke="#0f172a" strokeWidth="2" />
          <path d="M12,196 Q84,178 156,198 L156,210 Q84,192 12,208 Z" fill="#93c5fd" stroke="#0f172a" strokeWidth="1.6" />
          <g transform="translate(116, 224) rotate(14)">
            <rect x="-17" y="-32" width="34" height="64" rx="16" fill="#f8fafc" stroke="#0f172a" strokeWidth="2" />
            <path d="M-15,-10 L15,-10 M-15,10 L15,10" stroke="#bae6fd" strokeWidth="3" />
          </g>
          <g transform="translate(86, 206) rotate(-14)">
            <Box3D x={-8} y={0} w={30} h={13} dx={5} dy={4} f="#dc2626" t="#ef4444" s="#991b1b" sw={1.7} />
            <Box3D x={22} y={0} w={11} h={13} dx={4} dy={3.5} f="#fed7aa" t="#ffedd5" s="#fdba74" sw={1.7} />
          </g>
        </g>
        <g transform={`translate(84, ${174 + breath * 1.4}) rotate(-8)`}>
          <Box3D x={-28} y={-50} w={56} h={52} dx={10} dy={7} f="#fed7aa" t="#ffedd5" s="#fdba74" sw={2} />
          <Box3D x={-30} y={-61} w={60} h={14} dx={10} dy={7} f="#29150b" t="#451a03" s="#170a04" sw={2} />
          <rect x="-25" y="-47" width="11" height="9" fill="#29150b" stroke="#0f172a" strokeWidth="1.3" />
          <rect x="-5" y="-47" width="9" height="7" fill="#29150b" stroke="#0f172a" strokeWidth="1.3" />
          <rect x="13" y="-47" width="12" height="10" fill="#29150b" stroke="#0f172a" strokeWidth="1.3" />
          <ellipse cx="-13" cy="-21" rx="9" ry="5" fill="#4338ca" opacity="0.42" />
          <ellipse cx="13" cy="-21" rx="9" ry="5" fill="#4338ca" opacity="0.42" />
          <path d="M-21,-26 Q-13,-18 -5,-26" fill="none" stroke="#0f172a" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M5,-26 Q13,-18 21,-26" fill="none" stroke="#0f172a" strokeWidth="2.8" strokeLinecap="round" />
          <rect x="-21" y="-36" width="16" height="3.5" fill="#29150b" /><rect x="5" y="-36" width="16" height="3.5" fill="#29150b" />
          <ellipse cx="1" cy="-9" rx="5.5" ry="4" fill="#7f1d1d" stroke="#0f172a" strokeWidth="1.6" />
          <circle cx={6 + bubbleR * 0.4} cy="-9" r={bubbleR} fill="#bae6fd" fillOpacity="0.72" stroke="#0284c7" strokeWidth="1.4" />
          <circle cx={4 + bubbleR * 0.25} cy={-9 - bubbleR * 0.35} r={Math.max(1.4, bubbleR * 0.24)} fill="#ffffff" />
        </g>
        {[0, 1, 2].map((i) => {
          const p = ((frame + i * 18) % 54) / 54;
          return <text key={i} x={112 + p * 26 + Math.sin(p * 6) * 4} y={116 - p * 68} fill="#38bdf8" stroke="#0f172a" strokeWidth="1" fontSize={10 + p * 8} fontWeight="bold" fontFamily="monospace" opacity={Math.sin(p * Math.PI)}>Z</text>;
        })}
        <g transform={`translate(${198 + aShake}, ${174 + aJump})`}>
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
