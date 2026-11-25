import React from 'react';
import { interpolate } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PressStart2P';

const { fontFamily } = loadFont();

const Box3D: React.FC<{
  x: number; y: number; w: number; h: number;
  dx?: number; dy?: number; front: string; top: string; side: string; sw?: number;
}> = ({ x, y, w, h, dx = 8, dy = 6, front, top, side, sw = 1.8 }) => (
  <g stroke="#0f172a" strokeWidth={sw} strokeLinejoin="round">
    <polygon points={`${x},${y} ${x + dx},${y - dy} ${x + w + dx},${y - dy} ${x + w},${y}`} fill={top} />
    <polygon points={`${x + w},${y} ${x + w + dx},${y - dy} ${x + w + dx},${y + h - dy} ${x + w},${y + h}`} fill={side} />
    <rect x={x} y={y} width={w} height={h} fill={front} />
  </g>
);
export const CloseUpUdinMariana: React.FC<{ frame: number; localFrame: number }> = ({ frame, localFrame }) => {
  const zoom = interpolate(localFrame, [0, 145], [1, 1.055], { extrapolateRight: 'clamp' });
  const bounce = Math.sin(frame * 0.22);
  const shiver = Math.sin(frame * 1.2) * 0.9;
  const headTilt = Math.sin(frame * 0.18) * 2.8;
  const legSwing = Math.sin(frame * 0.24) * 5;
  const waveX = Math.sin(frame * 0.14) * 6;
  const crabX = 182 + Math.sin(frame * 0.16) * 10;
  const clawSnap = Math.sin(frame * 0.65) * 18;
  const blink = (frame % 64) > 58;
  const pupilJit = Math.sin(frame * 0.45) * 1.3;
  return (
    <div style={{ position: 'absolute', top: 230, left: 60, right: 60, height: 1160, backgroundColor: '#0f172a', border: '8px solid #4ade80', borderRadius: 28, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.88)', zIndex: 38 }}>
      <svg width="100%" height="100%" viewBox="0 0 240 310" preserveAspectRatio="xMidYMid slice" style={{ transform: `scale(${zoom})`, transformOrigin: '50% 56%' }}>
        <defs>
          <linearGradient id="mdCutSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0284c7" /><stop offset="100%" stopColor="#bae6fd" /></linearGradient>
          <linearGradient id="mdCutSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0369a1" /><stop offset="100%" stopColor="#06b6d4" /></linearGradient>
          <linearGradient id="mdCutSand" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fde68a" /><stop offset="100%" stopColor="#f59e0b" /></linearGradient>
        </defs>
        <rect width="240" height="145" fill="url(#mdCutSky)" />
        <circle cx="198" cy="36" r="24" fill="#fde047" opacity="0.28" />
        <circle cx="198" cy="36" r="14" fill="#fde047" stroke="#f59e0b" strokeWidth="2" />
        <g transform={`translate(${18 + localFrame * 0.1}, 26)`}><rect x="0" y="6" width="38" height="9" rx="4" fill="#f0f9ff" /><rect x="8" y="0" width="22" height="9" rx="4" fill="#ffffff" /></g>
        <g transform={`translate(${118 - localFrame * 0.08}, 42)`}><rect x="0" y="6" width="42" height="9" rx="4" fill="#f0f9ff" /><rect x="10" y="0" width="22" height="9" rx="4" fill="#ffffff" /></g>
        <rect y="128" width="240" height="62" fill="url(#mdCutSea)" />
        {[140, 156, 170].map((wy, i) => (<rect key={i} x={((i * 58 + frame * (0.4 + i * 0.15)) % 260) - 20} y={wy} width="32" height="3" rx="1.5" fill="#e0f2fe" opacity="0.6" />))}
        <path d={`M0,182 Q60,${172 + waveX * 0.4} 120,180 T240,176 L240,310 L0,310 Z`} fill="#e0f2fe" opacity="0.85" />
        <path d="M0,190 Q64,178 130,188 T240,184 L240,310 L0,310 Z" fill="url(#mdCutSand)" />
        <path d="M0,214 Q115,204 240,218 L240,310 L0,310 Z" fill="#fbbf24" opacity="0.4" />
        <g transform="translate(8, 72)">
          <path d="M8,136 Q18,86 24,38 L34,40 Q26,88 20,136 Z" fill="#92400e" stroke="#0f172a" strokeWidth="1.6" />
          <path d="M28,40 Q4,22 -8,34 Q6,36 22,46 Z" fill="#16a34a" stroke="#0f172a" strokeWidth="1.5" />
          <path d="M28,38 Q48,14 68,26 Q50,32 32,44 Z" fill="#22c55e" stroke="#0f172a" strokeWidth="1.5" />
          <path d="M26,38 Q18,12 40,8 Q34,24 30,38 Z" fill="#4ade80" stroke="#0f172a" strokeWidth="1.5" />
          <circle cx="24" cy="44" r="4.5" fill="#78350f" stroke="#0f172a" strokeWidth="1.2" />
          <circle cx="31" cy="45" r="4.5" fill="#78350f" stroke="#0f172a" strokeWidth="1.2" />
        </g>
        <ellipse cx="42" cy="248" rx="7" ry="4" fill="#f9a8d4" stroke="#0f172a" strokeWidth="1.2" />
        <ellipse cx="206" cy="212" rx="6" ry="3.5" fill="#fef08a" stroke="#0f172a" strokeWidth="1.2" />
        <g transform={`translate(${108 + shiver}, ${232 + bounce * 1.3})`}>
          <ellipse cx="6" cy="14" rx="54" ry="12" fill="#0284c7" opacity="0.35" />
          <ellipse cx="4" cy="10" rx="36" ry="8" fill="rgba(15,23,42,0.28)" />
          <g transform={`translate(-14, 0) rotate(${12 + legSwing})`}><Box3D x={-8} y={0} w={16} h={18} dx={5} dy={4} front="#1d4ed8" top="#3b82f6" side="#1e3a8a" sw={1.8} /><rect x="-8" y="13" width="16" height="6" fill="#f8fafc" stroke="#0f172a" strokeWidth="1.5" /></g>
          <g transform={`translate(14, 0) rotate(${-12 - legSwing})`}><Box3D x={-8} y={0} w={16} h={18} dx={5} dy={4} front="#1d4ed8" top="#3b82f6" side="#1e3a8a" sw={1.8} /><rect x="-8" y="13" width="16" height="6" fill="#f8fafc" stroke="#0f172a" strokeWidth="1.5" /></g>
          <Box3D x={-19} y={-28} w={38} h={29} dx={9} dy={6} front="#dc2626" top="#ef4444" side="#991b1b" sw={1.9} />
          <rect x="-17" y="-12" width="34" height="11" fill="#7f1d1d" opacity="0.32" />
          <path d="M-12,-28 L-10,-16 M8,-28 L10,-18" stroke="#bae6fd" strokeWidth="1.6" opacity="0.6" />
          <g transform="translate(-19, -20) rotate(22)"><Box3D x={-16} y={0} w={16} h={10} dx={4} dy={3} front="#dc2626" top="#ef4444" side="#991b1b" sw={1.6} /><Box3D x={-23} y={0} w={8} h={10} dx={3} dy={2.5} front="#fed7aa" top="#ffedd5" side="#fdba74" sw={1.6} /></g>
          <Box3D x={19} y={-22} w={18} h={10} dx={5} dy={4} front="#dc2626" top="#ef4444" side="#991b1b" sw={1.7} />
          <g transform={`translate(36, ${-32 + bounce * 1.4}) rotate(${-12 + bounce * 4})`}>
            <rect x="-4" y="6" width="28" height="4" fill="#0f172a" />
            <rect x="-2" y="0" width="13" height="14" rx="3" fill="#38bdf8" stroke="#0f172a" strokeWidth="1.8" />
            <rect x="13" y="0" width="13" height="14" rx="3" fill="#38bdf8" stroke="#0f172a" strokeWidth="1.8" />
            <rect x="1" y="3" width="7" height="8" rx="1.5" fill="#e0f2fe" opacity="0.85" />
            <rect x="16" y="3" width="7" height="8" rx="1.5" fill="#e0f2fe" opacity="0.85" />
            <polyline points="2,3 6,7 3,11" fill="none" stroke="#0f172a" strokeWidth="1.4" />
            <polyline points="17,10 21,6 19,3" fill="none" stroke="#0f172a" strokeWidth="1.4" />
          </g>
          <Box3D x={36} y={-23} w={10} h={11} dx={4} dy={3} front="#fed7aa" top="#ffedd5" side="#fdba74" sw={1.7} />
          <g transform={`translate(0, -28) rotate(${headTilt})`}>
            <Box3D x={-29} y={-56} w={58} h={56} dx={11} dy={8} front="#fed7aa" top="#ffedd5" side="#fdba74" sw={2} />
            <Box3D x={-31} y={-67} w={62} h={14} dx={11} dy={8} front="#29150b" top="#451a03" side="#170a04" sw={2} />
            <rect x="-26" y="-53" width="10" height="9" fill="#29150b" stroke="#0f172a" strokeWidth="1.3" />
            <rect x="-6" y="-53" width="8" height="7" fill="#29150b" stroke="#0f172a" strokeWidth="1.3" />
            <rect x="14" y="-53" width="12" height="10" fill="#29150b" stroke="#0f172a" strokeWidth="1.3" />
            <path d="M12,-66 Q20,-58 14,-48 Q24,-52 28,-42" fill="none" stroke="#15803d" strokeWidth="4" strokeLinecap="round" />
            {blink ? (
              <g stroke="#0f172a" strokeWidth="3" fill="none"><line x1="-20" y1="-34" x2="-6" y2="-34" /><line x1="6" y1="-34" x2="20" y2="-34" /></g>
            ) : (
              <>
                <rect x="-21" y="-42" width="16" height="18" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
                <rect x="5" y="-42" width="16" height="18" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
                <rect x={-16 + pupilJit} y="-35" width="7" height="7" fill="#0f172a" />
                <rect x={10 - pupilJit} y="-35" width="7" height="7" fill="#0f172a" />
                <rect x={-15 + pupilJit} y="-34" width="3" height="3" fill="#ffffff" />
                <rect x={11 - pupilJit} y="-34" width="3" height="3" fill="#ffffff" />
              </>
            )}
            <g transform="translate(-13, -46) rotate(-10)"><rect x="-9" y="-2" width="18" height="4" fill="#29150b" /></g>
            <g transform="translate(13, -46) rotate(10)"><rect x="-9" y="-2" width="18" height="4" fill="#29150b" /></g>
            <rect x="-10" y="-17" width="20" height={8 + (frame % 12 < 6 ? 2 : 0)} rx="3" fill="#7f1d1d" stroke="#0f172a" strokeWidth="1.8" />
            <rect x="-7" y="-17" width="14" height="3" fill="#ffffff" />
            <polygon points="-22,-25 -19,-18 -12,-18 -18,-13 -15,-6 -22,-10 -29,-6 -26,-13 -32,-18 -25,-18" fill="#fb923c" stroke="#0f172a" strokeWidth="1.3" />
            <circle cx="-23.5" cy="-16" r="1" fill="#0f172a" /><circle cx="-20.5" cy="-16" r="1" fill="#0f172a" />
            {[-24, 2, 24].map((wx, i) => { const p = ((frame + i * 9) % 24) / 24; return <ellipse key={i} cx={wx} cy={-48 + p * 54} rx="2" ry="3.2" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.7" opacity={Math.sin(p * Math.PI)} />; })}
          </g>
        </g>
        <g transform={`translate(${crabX}, ${244 + Math.abs(Math.sin(frame * 0.55)) * -1.4})`}>
          <ellipse cx="0" cy="7" rx="13" ry="3.2" fill="rgba(15,23,42,0.28)" />
          {[-1, 1].map((d) => [0, 1, 2].map((i) => {
            const st = Math.sin(frame * 0.7 + i * 2.1 + (d > 0 ? 1 : 0)) * 2.2;
            return <polyline key={`${d}-${i}`} points={`${d * (7 + i)},${1 + i * 1.4} ${d * (13 + i)},${-0.5 + i * 1.6 + st} ${d * (16 + i)},${4.5 + i * 1.2 + st}`} fill="none" stroke="#991b1b" strokeWidth="1.7" strokeLinecap="round" />;
          }))}
          <ellipse cx="0" cy="0" rx="10.5" ry="6.5" fill="#ef4444" stroke="#0f172a" strokeWidth="1.4" />
          <line x1="-4" y1="-5" x2="-4.5" y2="-9" stroke="#0f172a" strokeWidth="1.5" /><line x1="4" y1="-5" x2="4.5" y2="-9" stroke="#0f172a" strokeWidth="1.5" />
          <circle cx="-4.5" cy="-10" r="2.3" fill="#ffffff" stroke="#0f172a" strokeWidth="1" /><circle cx="4.5" cy="-10" r="2.3" fill="#ffffff" stroke="#0f172a" strokeWidth="1" />
          <circle cx="-4.5" cy="-10" r="1.1" fill="#0f172a" /><circle cx="4.5" cy="-10" r="1.1" fill="#0f172a" />
          <g transform={`translate(-9, -3) rotate(${-16 + clawSnap * 0.7})`}><path d="M0,0 C-5,-1 -8,-6 -4,-10 L-2,-5 L1,-9 C5,-6 4,-1 0,0 Z" fill="#dc2626" stroke="#0f172a" strokeWidth="1.2" /></g>
          <g transform={`translate(9, -3) rotate(${16 - clawSnap * 0.7})`}><path d="M0,0 C5,-1 8,-6 4,-10 L2,-5 L-1,-9 C-5,-6 -4,-1 0,0 Z" fill="#dc2626" stroke="#0f172a" strokeWidth="1.2" /></g>
        </g>
      </svg>
      <div style={{ position: 'absolute', bottom: 22, left: 22, right: 22, backgroundColor: 'rgba(15, 23, 42, 0.94)', border: '4px solid #4ade80', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontFamily, fontSize: 19, color: '#4ade80', lineHeight: 1.3 }}>DARATAN PALING AMAN!</div>
          <div style={{ fontFamily, fontSize: 11, color: '#fde047', marginTop: 9 }}>BASAH KUYUP + KACAMATA RETAK</div>
        </div>
        <div style={{ fontFamily, fontSize: 18, color: '#f87171', padding: '8px 12px', borderRadius: 10, border: '2px solid #f87171', backgroundColor: 'rgba(239, 68, 68, 0.14)' }}>KAPOK!</div>
      </div>
    </div>
  );
};
