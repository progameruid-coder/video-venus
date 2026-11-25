import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PressStart2P';
import { whoosh, ding } from '@remotion/sfx';
import { WORD_SUBS_MD, MD_TIMING } from './marianaDiveWords';
import { CloseUpUdinMariana } from './MarianaDiveCutscene';

const { fontFamily } = loadFont();
const getWordColor = (w: string) => {
  const c = w.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (['laut','menyelam','meter','pantai','daratan','aman','titanic','angkasa'].includes(c)) return '#38bdf8';
  if (['hancur','terjepit','gelap','gulita','dingin','monster','tekanan','mariana','remuk','serem'].includes(c)) return '#f87171';
  if (['empat','puluh','tiga','ratus','dua','seribu','delapan','sebelas','lima','sekejap'].includes(c)) return '#fde047';
  return '#ffffff';
};
type DiveMode = 'boat' | 'dive' | 'swim' | 'tight' | 'scared' | 'crush' | 'beach';

const UdinDive2D: React.FC<{ x: number; y: number; mode: DiveMode; frame: number; crushT?: number; diveRot?: number }> = ({ x, y, mode, frame, crushT = 0, diveRot = 0 }) => {
  const isSwim = mode === 'swim' || mode === 'tight' || mode === 'scared';
  const isCrush = mode === 'crush', isBeach = mode === 'beach', isBoat = mode === 'boat', isDive = mode === 'dive';
  const sx = isCrush ? 1 + crushT * 0.56 : 1, sy = isCrush ? 1 - crushT * 0.58 : 1;
  const rot = isDive ? diveRot : isSwim ? Math.sin(frame * 0.16) * 7 : 0;
  const shiv = mode === 'scared' ? Math.sin(frame * 1.9) * 1.5 : isCrush ? Math.sin(frame * 2.1) * 1.7 : mode === 'tight' ? Math.sin(frame * 1.2) * 0.8 : 0;
  const bob = isSwim ? Math.sin(frame * 0.22) * 3.2 : isBeach ? Math.sin(frame * 0.18) * 1.1 : 0;
  const kick = isSwim ? Math.sin(frame * 0.45) * 20 : 0;
  const skin = isCrush ? '#fb7185' : mode === 'scared' ? '#93c5fd' : mode === 'tight' ? '#c4b5fd' : '#fed7aa';
  const blink = (isBoat || isBeach) && frame % 85 > 80;
  return (
    <g transform={`translate(${x + shiv}, ${y + bob + (isCrush ? crushT * 10 : isBeach ? 6 : 0)}) rotate(${rot}) scale(${sx}, ${sy})`}>
      {isBeach && <ellipse cx="0" cy="7" rx="13" ry="3" fill="rgba(15,23,42,0.3)" />}
      {isBeach ? (
        <><rect x="-12" y="2" width="10" height="5" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.2" /><rect x="2" y="2" width="10" height="5" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.2" /><rect x="-13" y="2" width="3" height="5" fill="#f8fafc" stroke="#0f172a" strokeWidth="0.9" /><rect x="10" y="2" width="3" height="5" fill="#f8fafc" stroke="#0f172a" strokeWidth="0.9" /></>
      ) : (
        <><g transform={`translate(-3, 4) rotate(${kick})`}><rect x="-2" y="0" width="4" height="10" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.2" /></g><g transform={`translate(3, 4) rotate(${-kick})`}><rect x="-2" y="0" width="4" height="10" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.2" /></g></>
      )}
      <rect x="-7" y="-8" width="14" height="13" fill="#dc2626" stroke="#0f172a" strokeWidth="1.4" />
      {mode === 'tight' ? (
        <><polygon points="-7,-6 -11,-2 -2,0 -1,-4" fill="#dc2626" stroke="#0f172a" strokeWidth="1.1" /><polygon points="7,-6 11,-2 2,0 1,-4" fill="#dc2626" stroke="#0f172a" strokeWidth="1.1" /><rect x="-3.5" y="-4" width="7" height="3.5" rx="1" fill={skin} stroke="#0f172a" strokeWidth="1" /><circle cx="0" cy="-2" r={4 + Math.sin(frame * 0.55) * 1.8} fill="none" stroke="#ef4444" strokeWidth="1.3" opacity="0.88" /></>
      ) : (
        <>
          <g transform={`translate(-7, -6) rotate(${isDive ? 165 : (mode === 'scared' || isCrush) ? 132 + Math.sin(frame * 0.7) * 18 : mode === 'swim' ? 32 + Math.sin(frame * 0.35) * 26 : isBeach ? 26 + Math.sin(frame * 0.2) * 8 : 8})`}><rect x="-2.5" y="0" width="4.5" height="8" fill="#dc2626" stroke="#0f172a" strokeWidth="1.2" /><rect x="-2.5" y="7" width="4.5" height="3.5" fill={skin} stroke="#0f172a" strokeWidth="1" /></g>
          <g transform={`translate(7, -6) rotate(${isDive ? -165 : (mode === 'scared' || isCrush) ? -132 - Math.sin(frame * 0.7) * 18 : mode === 'swim' ? -32 - Math.sin(frame * 0.35) * 26 : isBeach ? -26 - Math.sin(frame * 0.2) * 8 : -130 + Math.sin(frame * 0.3) * 22})`}><rect x="-2" y="0" width="4.5" height="8" fill="#dc2626" stroke="#0f172a" strokeWidth="1.2" /><rect x="-2" y="7" width="4.5" height="3.5" fill={skin} stroke="#0f172a" strokeWidth="1" /></g>
        </>
      )}
      <rect x="-6" y="-19" width="12" height="11" fill={skin} stroke="#0f172a" strokeWidth="1.4" />
      <rect x="-6" y="-21" width="12" height="4" fill="#29150b" />
      {!isBeach && (
        <g transform={`translate(0, ${isBoat ? -20 : -16})`}>
          <rect x="-6.5" y="1" width="13" height="2" fill="#0f172a" />
          <rect x="-5.5" y="-1" width="5" height="4.5" rx="1" fill="#38bdf8" stroke="#0f172a" strokeWidth="1" />
          <rect x="0.5" y="-1" width="5" height="4.5" rx="1" fill="#38bdf8" stroke="#0f172a" strokeWidth="1" />
          <rect x="-4.5" y="0" width="2" height="1.5" fill="#e0f2fe" /><rect x="1.5" y="0" width="2" height="1.5" fill="#e0f2fe" />
        </g>
      )}
      {(isBoat || isBeach) && (blink ? (<><rect x="-3.5" y="-14" width="3" height="1.2" fill="#0f172a" /><rect x="1.5" y="-14" width="3" height="1.2" fill="#0f172a" /></>) : (<><rect x="-3" y="-15" width="2" height="2" fill="#0f172a" /><rect x="2" y="-15" width="2" height="2" fill="#0f172a" /></>))}
      {isBeach ? (<rect x="-2" y="-11" width="4" height="1.5" fill="#15803d" />) : (mode === 'scared' || isCrush || mode === 'tight') ? (<rect x="-2" y="-11.5" width="4" height="2.6" fill="#7f1d1d" />) : null}
      {(isSwim || isCrush) && [-3, 3].map((bx, i) => { const bp = ((frame + i * 11) % 22) / 22; return <circle key={i} cx={bx + Math.sin(frame * 0.3 + i) * 2} cy={-24 - bp * 20} r={1.6 + bp * 1.4} fill="none" stroke="#bae6fd" strokeWidth="1" opacity={Math.sin(bp * Math.PI) * 0.85} />; })}
    </g>
  );
};
const ChoiceOrb: React.FC<{ x: number; y: number; kind: 'space' | 'sea'; label: string; scale: number; frame: number }> = ({ x, y, kind, label, scale, frame }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    <circle cx="0" cy="0" r="24" fill="rgba(15,23,42,0.65)" />
    <circle cx="0" cy="0" r="21" fill={kind === 'space' ? '#1e1b4b' : '#0c4a6e'} stroke={kind === 'space' ? '#a855f7' : '#38bdf8'} strokeWidth="2.2" />
    {kind === 'space' ? (
      <><circle cx="-9" cy="-9" r="1.5" fill="#fef08a" /><circle cx="10" cy="-7" r="1.2" fill="#ffffff" /><circle cx="0" cy="1" r="8" fill="#f97316" stroke="#0f172a" strokeWidth="1.2" /><ellipse cx="0" cy="1" rx="14" ry="4" fill="none" stroke="#fde047" strokeWidth="1.8" transform="rotate(-18)" /></>
    ) : (
      <><path d="M-18,3 Q-9,-3 0,3 T18,3 L18,16 A20,20 0 0,1 -18,16 Z" fill="#0284c7" opacity="0.7" /><circle cx="5" cy="-6" r="3" fill="#fde047" opacity={0.7 + Math.sin(frame * 0.4) * 0.3} /><ellipse cx="-4" cy="4" rx="7" ry="4.5" fill="#4c1d95" stroke="#0f172a" strokeWidth="1.1" /><circle cx="-1" cy="3" r="1.3" fill="#ef4444" /></>
    )}
    <g transform="translate(0, 31)"><rect x="-38" y="-7" width="76" height="12" rx="3" fill="rgba(15,23,42,0.92)" stroke={kind === 'space' ? '#a855f7' : '#38bdf8'} strokeWidth="1.2" /><text x="0" y="1" textAnchor="middle" fill="#ffffff" fontSize="5.4" fontWeight="bold" fontFamily="monospace">{label}</text></g>
  </g>
);
const MarianaStageBg: React.FC<{ stage: string; frame: number; localF: number; anglerT: number; crushT: number }> = ({ stage, frame, localF, anglerT, crushT }) => {
  if (stage === 'surface') {
    const bw = Math.sin(frame * 0.16) * 2.5;
    return (
      <g>
        <rect width="270" height="205" fill="url(#mdSky)" />
        <circle cx="224" cy="40" r="20" fill="#fde047" opacity="0.28" /><circle cx="224" cy="40" r="13" fill="#fde047" stroke="#f59e0b" strokeWidth="2" />
        <g transform={`translate(${((20 + frame * 0.2) % 310) - 45}, 76)`}><rect x="0" y="6" width="42" height="9" fill="#f0f9ff" /><rect x="8" y="0" width="24" height="8" fill="#ffffff" /></g>
        <rect y="200" width="270" height="130" fill="url(#md40)" />
        <path d={`M0,202 Q34,${195 + bw} 68,202 T136,202 T204,202 T270,202`} fill="none" stroke="#e0f2fe" strokeWidth="3.5" />
        <g transform={`translate(135, ${198 + bw})`}><rect x="-28" y="-6" width="56" height="9" fill="#7f1d1d" stroke="#0f172a" strokeWidth="1.4" /><rect x="-26" y="-8" width="52" height="3.5" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1.2" /></g>
      </g>
    );
  }
  if (stage === 'z40') {
    return (
      <g>
        <rect width="270" height="330" fill="url(#md40)" />
        {[24, 92, 168].map((rx, i) => (<polygon key={i} points={`${rx},0 ${rx + 36},0 ${rx + 78},240 ${rx + 18},240`} fill="#e0f2fe" opacity={0.14 + Math.sin(frame * 0.08 + i) * 0.04} />))}
        <rect y="276" width="270" height="54" fill="#fde68a" /><rect y="274" width="270" height="5" fill="#fef08a" />
        <path d="M22,276 L22,248 M22,262 L12,254 M22,258 L32,250" stroke="#f472b6" strokeWidth="5" strokeLinecap="round" />
        <path d="M214,276 L214,244 M214,262 L202,252 M214,256 L226,248" stroke="#fb923c" strokeWidth="5" strokeLinecap="round" />
        <path d="M64,276 L64,256 M64,264 L72,258" stroke="#a855f7" strokeWidth="4.5" strokeLinecap="round" />
        {[[40,148,'#fde047',1.4],[180,242,'#fb923c',-1.2],[100,126,'#f472b6',1.1]].map(([fx,fy,fc,sp],i)=>(
          <g key={i} transform={`translate(${((Number(fx) + frame * Number(sp) + 300) % 300) - 15}, ${Number(fy) + Math.sin(frame * 0.2 + i) * 4}) scale(${Number(sp) > 0 ? 1 : -1}, 1)`}>
            <ellipse cx="0" cy="0" rx="7" ry="4" fill={String(fc)} stroke="#0f172a" strokeWidth="1.1" /><polygon points="-6,0 -11,-4 -11,4" fill={String(fc)} stroke="#0f172a" strokeWidth="1" /><circle cx="3" cy="-1" r="1" fill="#0f172a" />
          </g>
        ))}
      </g>
    );
  }
  if (stage === 'z332') {
    const pPulse = Math.sin(frame * 0.35) * 4;
    return (
      <g>
        <rect width="270" height="330" fill="url(#md332)" />
        {Array.from({ length: 14 }).map((_, i) => (<circle key={i} cx={(i * 23 + Math.sin(frame * 0.1 + i) * 6) % 270} cy={330 - ((frame * (3 + (i % 3)) + i * 38) % 340)} r={1.8 + (i % 3)} fill="none" stroke="#7dd3fc" strokeWidth="1" opacity="0.55" />))}
        <g opacity="0.78" fill="#fde047" stroke="#0f172a" strokeWidth="1">
          <polygon points={`${72 + pPulse},192 ${86 + pPulse},202 ${72 + pPulse},212`} />
          <polygon points={`${198 - pPulse},192 ${184 - pPulse},202 ${198 - pPulse},212`} />
        </g>
      </g>
    );
  }
  if (stage === 'z1000') {
    const krakIn = interpolate(localF, [0, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const ky = interpolate(krakIn, [0, 1], [248, 166]) + Math.sin(frame * 0.1) * 4;
    const tw = Math.sin(frame * 0.14) * 10, tw2 = Math.cos(frame * 0.16) * 9;
    return (
      <g>
        <rect width="270" height="330" fill="url(#md1000)" />
        {Array.from({ length: 16 }).map((_, i) => (<circle key={i} cx={(i * 31 + frame * 0.6) % 270} cy={(i * 43 + frame * 1.4) % 330} r={i % 3 === 0 ? 2 : 1.2} fill="#38bdf8" opacity={0.25 + ((frame + i * 7) % 12) / 20} />))}
        <g transform={`translate(135, ${ky})`} opacity={krakIn * 0.96}>
          <path d={`M-32,12 Q${-88 + tw},22 ${-108 + tw2},-26 Q${-112 + tw},-48 ${-94 + tw2},-42 Q${-84 + tw},4 -28,32 Z`} fill="#030712" stroke="#312e81" strokeWidth="1.8" />
          <path d={`M32,12 Q${86 - tw},20 ${100 - tw2},-24 Q${104 - tw},-46 ${88 - tw2},-40 Q${78 - tw},4 28,32 Z`} fill="#030712" stroke="#312e81" strokeWidth="1.8" />
          <path d={`M-26,30 Q${-78 - tw2},64 ${-96 + tw},116 Q${-66 - tw},78 -16,44 Z`} fill="#030712" stroke="#312e81" strokeWidth="1.6" />
          <path d={`M26,30 Q${76 + tw2},64 ${92 - tw},116 Q${62 + tw},78 16,44 Z`} fill="#030712" stroke="#312e81" strokeWidth="1.6" />
          <path d={`M-14,36 Q${-36 + tw},92 ${-44 - tw2},142 Q${-16 + tw},98 -4,44 Z`} fill="#030712" stroke="#312e81" strokeWidth="1.5" />
          <path d={`M14,36 Q${36 - tw},92 ${44 + tw2},142 Q${16 - tw},98 4,44 Z`} fill="#030712" stroke="#312e81" strokeWidth="1.5" />
          <path d="M-46,24 C-56,-34 -34,-76 0,-80 C34,-76 56,-34 46,24 Q0,44 -46,24 Z" fill="#030712" stroke="#312e81" strokeWidth="2.2" />
          <path d="M-36,16 C-42,-28 -24,-62 0,-66 C24,-62 42,-28 36,16" fill="none" stroke="#4c1d95" strokeWidth="2" opacity="0.48" />
          {anglerT > 0.02 && (
            <g opacity={anglerT}>
              <circle cx="-18" cy="-8" r={11 + Math.sin(frame * 0.45) * 2} fill="#ef4444" opacity="0.34" />
              <circle cx="18" cy="-8" r={11 + Math.sin(frame * 0.45) * 2} fill="#ef4444" opacity="0.34" />
              <polygon points="-28,-13 -10,-6 -24,-2" fill="#fde047" stroke="#ef4444" strokeWidth="1.2" />
              <polygon points="28,-13 10,-6 24,-2" fill="#fde047" stroke="#ef4444" strokeWidth="1.2" />
              <circle cx="-18" cy="-7" r="2.2" fill="#7f1d1d" /><circle cx="18" cy="-7" r="2.2" fill="#7f1d1d" />
            </g>
          )}
        </g>
        {anglerT > 0.05 && [[34,158,'#38bdf8'],[212,174,'#4ade80'],[44,274,'#fde047']].map(([ex,ey,ec],i)=>(
          <g key={i} transform={`translate(${Number(ex)}, ${Number(ey) + Math.sin(frame * 0.2 + i) * 3})`} opacity={anglerT * (0.65 + Math.sin(frame * 0.35 + i * 2) * 0.35)}>
            <circle cx="-5" cy="0" r="4.5" fill={String(ec)} opacity="0.32" /><circle cx="5" cy="0" r="4.5" fill={String(ec)} opacity="0.32" />
            <circle cx="-5" cy="0" r="2" fill={String(ec)} /><circle cx="5" cy="0" r="2" fill={String(ec)} />
          </g>
        ))}
      </g>
    );
  }
  if (stage === 'z3800') {
    const sp = ((localF + 62) % 70) / 70;
    return (
      <g>
        <rect width="270" height="330" fill="url(#md3800)" />
        <polygon points={`135,0 ${135 + Math.sin(frame * 0.09) * 85 - 42},330 ${135 + Math.sin(frame * 0.09) * 85 + 42},330`} fill="#4ade80" opacity="0.11" />
        <circle cx="135" cy="10" r={22 + sp * 295} fill="none" stroke="#4ade80" strokeWidth="2.4" opacity={(1 - sp) * 0.7} />
        <circle cx="135" cy="10" r={10 + sp * 225} fill="none" stroke="#4ade80" strokeWidth="1.3" opacity={(1 - sp) * 0.42} />
        <rect y="286" width="270" height="44" fill="#0f172a" />
        <g transform="translate(18, 246)" opacity="0.92">
          <polygon points="0,42 18,12 186,16 196,42" fill="#1e293b" stroke="#020617" strokeWidth="1.8" />
          <rect x="46" y="-4" width="106" height="18" fill="#334155" stroke="#020617" strokeWidth="1.4" />
          <rect x="64" y="-26" width="16" height="22" fill="#7f1d1d" stroke="#020617" strokeWidth="1.4" />
          <rect x="108" y="-24" width="16" height="20" fill="#7f1d1d" stroke="#020617" strokeWidth="1.4" transform="rotate(14, 116, -4)" />
          {[58, 76, 94, 112, 130].map((px, i) => (<circle key={i} cx={px} cy="5" r="2.2" fill="#38bdf8" opacity="0.45" />))}
          <text x="24" y="30" fill="#94a3b8" fontSize="6.5" fontWeight="bold" fontFamily="monospace" opacity="0.65">TITANIC</text>
        </g>
        {Array.from({ length: 10 }).map((_, i) => (<circle key={i} cx={(i * 29 + frame * 0.5) % 270} cy={(i * 37 + frame) % 280} r="1.4" fill="#94a3b8" opacity="0.4" />))}
      </g>
    );
  }
  if (stage === 'z11k') {
    const pressIn = interpolate(localF, [6, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const pul = Math.sin(frame * 0.75) * 4.5;
    const topY = interpolate(pressIn, [0, 1], [116, 162]) + crushT * 24 + pul;
    const sideX = interpolate(pressIn, [0, 1], [38, 72]) + crushT * 16 + pul;
    return (
      <g>
        <rect width="270" height="330" fill="url(#md11k)" />
        <polygon points="0,0 56,0 44,96 66,188 48,274 72,330 0,330" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
        <polygon points="270,0 214,0 226,96 204,188 222,274 198,330 270,330" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
        <rect y="286" width="270" height="44" fill="#020617" />
        <g opacity={pressIn * (0.78 + Math.sin(frame * 0.65) * 0.2)}>
          {[104, 135, 166].map((px, i) => (<g key={i}><rect x={px - 2.5} y={topY - 12} width="5" height="12" fill="#ef4444" stroke="#0f172a" strokeWidth="1" /><polygon points={`${px - 7},${topY} ${px + 7},${topY} ${px},${topY + 11}`} fill="#ef4444" stroke="#0f172a" strokeWidth="1.1" /></g>))}
          <rect x={sideX - 12} y="213" width="12" height="5" fill="#ef4444" stroke="#0f172a" strokeWidth="1" /><polygon points={`${sideX},208 ${sideX},223 ${sideX + 11},215.5`} fill="#ef4444" stroke="#0f172a" strokeWidth="1.1" />
          <rect x={270 - sideX} y="213" width="12" height="5" fill="#ef4444" stroke="#0f172a" strokeWidth="1" /><polygon points={`${270 - sideX},208 ${270 - sideX},223 ${259 - sideX},215.5`} fill="#ef4444" stroke="#0f172a" strokeWidth="1.1" />
        </g>
        <rect x="0" y="0" width="270" height="330" fill="none" stroke="#dc2626" strokeWidth="14" opacity={0.22 + crushT * 0.35 + Math.sin(frame * 0.5) * 0.12} />
        {crushT > 0.5 && (<g stroke="#fca5a5" strokeWidth="1.5" fill="none" opacity={(crushT - 0.5) * 1.4}><polyline points="0,42 22,52 14,72 34,82" /><polyline points="270,58 248,68 256,88 238,98" /><polyline points="0,286 24,274 36,290" /><polyline points="270,278 246,268 236,284" /></g>)}
      </g>
    );
  }
  return (
    <g>
      <rect width="270" height="175" fill="url(#mdSky)" />
      <circle cx="224" cy="40" r="20" fill="#fde047" opacity="0.28" /><circle cx="224" cy="40" r="13" fill="#fde047" stroke="#f59e0b" strokeWidth="2" />
      <g transform={`translate(${((16 + frame * 0.18) % 310) - 45}, 74)`}><rect x="0" y="6" width="42" height="9" fill="#f0f9ff" /><rect x="8" y="0" width="24" height="8" fill="#ffffff" /></g>
      <rect y="162" width="270" height="52" fill="#0284c7" />
      <path d={`M0,206 Q68,${198 + Math.sin(frame * 0.15) * 3} 135,204 T270,202 L270,330 L0,330 Z`} fill="#e0f2fe" opacity="0.82" />
      <path d="M0,214 Q70,204 140,212 T270,210 L270,330 L0,330 Z" fill="#fde68a" />
      <g transform="translate(14, 126)"><path d="M8,108 Q16,66 20,26 L28,28 Q22,68 18,108 Z" fill="#92400e" stroke="#0f172a" strokeWidth="1.4" /><path d="M24,28 Q4,14 -6,24 Q6,26 20,34 Z" fill="#16a34a" stroke="#0f172a" strokeWidth="1.3" /><path d="M24,26 Q42,8 56,20 Q42,24 28,32 Z" fill="#22c55e" stroke="#0f172a" strokeWidth="1.3" /></g>
      <g transform={`translate(${210 + Math.sin(frame * 0.14) * 14}, ${268 + Math.abs(Math.sin(frame * 0.55)) * -1.2})`}>
        <ellipse cx="0" cy="5" rx="9" ry="2.2" fill="rgba(15,23,42,0.28)" />
        {[-1, 1].map((d) => [0, 1, 2].map((i) => {
          const st = Math.sin(frame * 0.75 + i * 2 + (d > 0 ? 1 : 0)) * 1.6;
          return <polyline key={`${d}-${i}`} points={`${d * (5 + i)},${1 + i} ${d * (9 + i)},${i + st} ${d * (11.5 + i)},${3.5 + i + st}`} fill="none" stroke="#991b1b" strokeWidth="1.2" strokeLinecap="round" />;
        }))}
        <ellipse cx="0" cy="0" rx="7.5" ry="4.6" fill="#ef4444" stroke="#0f172a" strokeWidth="1.1" />
        <circle cx="-3" cy="-6" r="1.7" fill="#ffffff" stroke="#0f172a" strokeWidth="0.8" /><circle cx="3" cy="-6" r="1.7" fill="#ffffff" stroke="#0f172a" strokeWidth="0.8" />
        <circle cx="-3" cy="-6" r="0.8" fill="#0f172a" /><circle cx="3" cy="-6" r="0.8" fill="#0f172a" />
        <g transform={`translate(-6.5, -2) rotate(${-15 + Math.sin(frame * 0.6) * 14})`}><path d="M0,0 C-4,-1 -6,-5 -3,-7.5 L-1,-4 L1,-7 C4,-5 3,-1 0,0 Z" fill="#dc2626" stroke="#0f172a" strokeWidth="0.9" /></g>
        <g transform={`translate(6.5, -2) rotate(${15 - Math.sin(frame * 0.6) * 14})`}><path d="M0,0 C4,-1 6,-5 3,-7.5 L1,-4 L-1,-7 C-4,-5 -3,-1 0,0 Z" fill="#dc2626" stroke="#0f172a" strokeWidth="0.9" /></g>
      </g>
    </g>
  );
};
export const MarianaDive: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sec = frame / fps;
  const { t40, t332, t1000, tAngler, t3800, t11k, tBack, tCutEnd, tChoice, cliffFrame } = MD_TIMING;
  const stage = frame < t40 ? 'surface' : frame < t332 ? 'z40' : frame < t1000 ? 'z332' : frame < t3800 ? 'z1000' : frame < t11k ? 'z3800' : frame < tBack ? 'z11k' : 'back';
  const localF = stage === 'z40' ? frame - t40 : stage === 'z332' ? frame - t332 : stage === 'z1000' ? frame - t1000 : stage === 'z3800' ? frame - t3800 : stage === 'z11k' ? frame - t11k : frame;
  const depthFrac = interpolate(frame, [0, t40, t332, t1000, t3800, t11k, t11k + 45], [0, 0.14, 0.34, 0.56, 0.78, 0.94, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cutStart = tBack, cutEnd = tCutEnd;
  const showCut = frame >= cutStart && frame <= cutEnd;
  const cutIn = showCut ? spring({ frame: frame - cutStart, fps, config: { damping: 12 } }) : 0;
  const cutOutFlash = frame >= cutEnd - 2 && frame <= cutEnd + 3 ? interpolate(frame, [cutEnd - 2, cutEnd, cutEnd + 3], [0, 0.92, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const showCliff = frame >= cliffFrame;
  const cliffIn = showCliff ? spring({ frame: frame - cliffFrame, fps, config: { damping: 10 } }) : 0;
  const activeIdx = WORD_SUBS_MD.findIndex((x) => sec >= x.s && sec < x.e);
  const activeWord = activeIdx >= 0 ? WORD_SUBS_MD[activeIdx] : null;
  const wordPop = activeWord ? spring({ frame: Math.max(0, frame - Math.floor(activeWord.s * fps)), fps, config: { damping: 11, stiffness: 280, mass: 0.5 } }) : 0;
  const meta: Record<string, { depth: string; press: string; big: string; sub: string; border: string; col: string }> = {
    surface: { depth: '0M', press: 'TEKANAN: 1x', big: '0 METER', sub: 'PERMUKAAN LAUT', border: '#38bdf8', col: '#38bdf8' },
    z40:     { depth: '40M', press: 'TEKANAN: 5x', big: '40 METER', sub: 'ZONA AMAN SCUBA', border: '#4ade80', col: '#4ade80' },
    z332:    { depth: '332M', press: 'TEKANAN: 34x', big: '332 METER', sub: 'REKOR MANUSIA', border: '#facc15', col: '#fde047' },
    z1000:   { depth: '1.000M', press: 'GELAP TOTAL!', big: '1.000 METER', sub: 'ZONA MONSTER LAUT', border: '#a855f7', col: '#c084fc' },
    z3800:   { depth: '3.800M', press: 'TEKANAN: 380x', big: '3.800 METER', sub: 'BANGKAI TITANIC', border: '#38bdf8', col: '#38bdf8' },
    z11k:    { depth: '11.000M', press: 'TEKANAN: 1.100x', big: '11.000 METER', sub: 'PALUNG MARIANA!', border: '#ef4444', col: '#f87171' },
    back:    { depth: '0M', press: 'TEKANAN: 1x', big: 'SELAMAT!', sub: 'DARATAN AMAN', border: '#4ade80', col: '#4ade80' },
  };
  const cur = meta[stage];
  const shake = stage === 'z11k' ? Math.sin(frame * 2.6) * 3.8 : 0;
  const crushT = stage === 'z11k' ? interpolate(localF, [12, 95], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const anglerT = stage === 'z1000' ? interpolate(frame, [tAngler - 4, tAngler + 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const boatBob = stage === 'surface' ? Math.sin(frame * 0.16) * 2.5 : 0;
  const isDiving = stage === 'surface' && frame >= t40 - 12;
  const diveT = isDiving ? interpolate(frame, [t40 - 12, t40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const udinX = isDiving ? 135 + diveT * 52 : 135;
  const diveRot = diveT * 135;
  const udinMode: DiveMode = isDiving ? 'dive' : stage === 'surface' ? 'boat' : stage === 'z40' ? 'swim' : stage === 'z332' ? 'tight' : stage === 'z1000' || stage === 'z3800' ? 'scared' : stage === 'z11k' ? 'crush' : 'beach';
  const udinY = stage === 'surface' ? (isDiving ? 186 + boatBob - Math.sin(diveT * Math.PI) * 38 + diveT * 26 : 186 + boatBob) : stage === 'z11k' ? 218 : stage === 'back' ? 248 : 204;
  const isSplash = stage === 'surface' && frame >= t40 - 4;
  const introAlpha = stage === 'surface' ? interpolate(frame, [0, 8, t40 - 14, t40 - 4], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const showChoices = stage === 'back' && !showCut && frame >= tChoice - 6;
  const choicePop = showChoices ? spring({ frame: Math.max(0, frame - (tChoice - 6)), fps, config: { damping: 11, stiffness: 210 } }) : 0;
  const sonarTimes = [t3800 + 8, t3800 + 78].filter((t) => t < t11k - 24);
  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a', overflow: 'hidden', transform: `translate(${shake}px, ${-shake * 0.5}px)` }}>
      <Audio src={staticFile('vo_mariana_dive.mp3')} volume={1} />
      <Audio src={staticFile('bgm_mariana_dive.wav')} volume={0.21} />
      <Sequence from={Math.max(0, t40 - 4)} durationInFrames={22}><Audio src={staticFile('sfx_md_splash.wav')} volume={0.36} /></Sequence>
      <Sequence from={t40 + 14} durationInFrames={25}><Audio src={staticFile('sfx_md_bubble.wav')} volume={0.28} /></Sequence>
      <Sequence from={t332 + 4} durationInFrames={25}><Audio src={staticFile('sfx_md_bubble.wav')} volume={0.30} /></Sequence>
      <Sequence from={t1000} durationInFrames={Math.max(1, Math.min(176, t3800 - t1000))}><Audio src={staticFile('sfx_md_deep.wav')} volume={0.22} /></Sequence>
      <Sequence from={tAngler} durationInFrames={24}><Audio src={staticFile('sfx_md_angler.wav')} volume={0.34} /></Sequence>
      <Sequence from={t3800} durationInFrames={Math.max(1, Math.min(176, t11k - t3800))}><Audio src={staticFile('sfx_md_deep.wav')} volume={0.22} /></Sequence>
      {sonarTimes.map((sf, i) => (<Sequence key={`sn-${i}`} from={sf} durationInFrames={32}><Audio src={staticFile('sfx_md_sonar.wav')} volume={0.30} /></Sequence>))}
      <Sequence from={t11k} durationInFrames={Math.max(1, Math.min(176, tBack - t11k))}><Audio src={staticFile('sfx_md_deep.wav')} volume={0.24} /></Sequence>
      <Sequence from={t11k + 12} durationInFrames={36}><Audio src={staticFile('sfx_md_crush.wav')} volume={0.38} /></Sequence>
      <Sequence from={cutStart} durationInFrames={28}><Audio src={whoosh} volume={0.36} /></Sequence>
      <Sequence from={Math.max(0, cutEnd - 3)} durationInFrames={28}><Audio src={whoosh} volume={0.32} /></Sequence>
      <Sequence from={cliffFrame} durationInFrames={45}><Audio src={ding} volume={0.45} /></Sequence>
      <AbsoluteFill style={{ backgroundImage: 'radial-gradient(#38bdf8 3px, transparent 3px)', backgroundSize: '44px 44px', opacity: 0.2 }} />
      <div style={{ position: 'absolute', top: 230, left: 60, right: 60, height: 1160, border: `8px solid ${cur.border}`, borderRadius: 28, overflow: 'hidden', boxShadow: '0 22px 54px rgba(0,0,0,0.85)', zIndex: 15 }}>
        <svg width="100%" height="100%" viewBox="0 0 270 330" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="mdSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0284c7" /><stop offset="100%" stopColor="#bae6fd" /></linearGradient>
            <linearGradient id="md40" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#06b6d4" /><stop offset="100%" stopColor="#0284c7" /></linearGradient>
            <linearGradient id="md332" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0369a1" /><stop offset="100%" stopColor="#1e3a8a" /></linearGradient>
            <linearGradient id="md1000" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0f172a" /><stop offset="100%" stopColor="#020617" /></linearGradient>
            <linearGradient id="md3800" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#020617" /><stop offset="100%" stopColor="#090d1f" /></linearGradient>
            <linearGradient id="md11k" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#020617" /><stop offset="100%" stopColor="#000000" /></linearGradient>
          </defs>
          <MarianaStageBg stage={stage} frame={frame} localF={localF} anglerT={anglerT} crushT={crushT} />
          <UdinDive2D x={udinX} y={udinY} mode={udinMode} frame={frame} crushT={crushT} diveRot={diveRot} />
          {stage === 'surface' && (<g transform={`translate(135, ${198 + boatBob})`}><polygon points="-34,0 34,0 24,14 -24,14" fill="#ef4444" stroke="#0f172a" strokeWidth="1.8" /><rect x="-28" y="-3" width="56" height="4.5" fill="#f8fafc" stroke="#0f172a" strokeWidth="1.3" /><path d="M-36,12 Q-18,9 0,12 T36,12" fill="none" stroke="#bae6fd" strokeWidth="2.2" opacity="0.85" /></g>)}
          {isSplash && (<g opacity={interpolate(frame, [t40 - 4, t40], [1, 0.3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}>{[-18, -9, 0, 9, 18].map((sx, i) => (<circle key={i} cx={187 + sx} cy={198 - (frame - (t40 - 4)) * 5 - (i % 2) * 4} r={3.6 - (i % 2)} fill="#e0f2fe" />))}</g>)}
          {stage === 'z40' && localF < 12 && (<g opacity={1 - localF / 12}>{[-22, -10, 4, 16, 26].map((bx, i) => (<circle key={i} cx={135 + bx} cy={180 - localF * 5 - (i % 3) * 8} r={2.2 + (i % 2) * 1.4} fill="none" stroke="#e0f2fe" strokeWidth="1.2" />))}</g>)}
          {stage !== 'back' && (
            <g transform="translate(250, 102)">
              <rect x="0" y="0" width="9" height="164" rx="4.5" fill="rgba(15,23,42,0.78)" stroke="#94a3b8" strokeWidth="1.2" />
              <rect x="1.5" y="1.5" width="6" height={Math.max(6, depthFrac * 161)} rx="3" fill={cur.border} />
              <circle cx="4.5" cy={4 + depthFrac * 156} r="4.5" fill="#ffffff" stroke="#0f172a" strokeWidth="1.4" />
            </g>
          )}
          {showChoices && (
            <g>
              <g transform={`translate(135, ${214 + Math.sin(frame * 0.24) * 3}) scale(${choicePop})`}>
                <rect x="-10" y="-12" width="20" height="14" rx="4" fill="rgba(15,23,42,0.9)" stroke="#facc15" strokeWidth="1.4" />
                <text x="0" y="-2.5" textAnchor="middle" fill="#fde047" fontSize="9" fontWeight="bold" fontFamily="monospace">?</text>
              </g>
              <ChoiceOrb x={74} y={114 + Math.sin(frame * 0.22) * 4} kind="space" label="LUAR ANGKASA" scale={choicePop} frame={frame} />
              <ChoiceOrb x={196} y={114 + Math.sin(frame * 0.22 + 1.5) * 4} kind="sea" label="DASAR LAUT" scale={choicePop} frame={frame} />
              <g transform={`translate(135, 114) scale(${choicePop})`}><rect x="-11" y="-8" width="22" height="16" rx="4" fill="#ef4444" stroke="#0f172a" strokeWidth="1.4" /><text x="0" y="2.5" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold" fontFamily="monospace">VS</text></g>
            </g>
          )}
        </svg>
        {introAlpha > 0.02 && (
          <div style={{ position: 'absolute', top: 34, left: 24, right: 24, textAlign: 'center', opacity: introAlpha, zIndex: 30 }}>
            <div style={{ fontFamily, fontSize: 27, lineHeight: 1.45, color: '#fde047', textShadow: '5px 5px 0 #0f172a, -3px -3px 0 #0f172a, 3px -3px 0 #0f172a, -3px 3px 0 #0f172a' }}>SEBERAPA DALAM<br />BISA MENYELAM?</div>
            <div style={{ display: 'inline-block', marginTop: 14, padding: '8px 16px', borderRadius: 12, backgroundColor: 'rgba(15,23,42,0.88)', border: '3px solid #f87171', fontFamily, fontSize: 13, color: '#ffffff' }}>SEBELUM TUBUH HANCUR!</div>
          </div>
        )}
        {stage !== 'surface' && stage !== 'back' && !showCut && (
          <div style={{ position: 'absolute', top: 24, left: '50%', transform: `translateX(-50%) scale(${1 + Math.sin(frame * 0.4) * 0.04})`, textAlign: 'center', zIndex: 30, width: '90%' }}>
            <div style={{ fontFamily, fontSize: 13, color: '#ffffff', textShadow: '3px 3px 0 #0f172a', marginBottom: 8 }}>KEDALAMAN:</div>
            <div style={{ fontFamily, fontSize: 36, color: cur.col, textShadow: '6px 6px 0 #0f172a, -3px -3px 0 #0f172a, 3px -3px 0 #0f172a, -3px 3px 0 #0f172a' }}>{cur.big}</div>
            <div style={{ display: 'inline-block', marginTop: 10, padding: '8px 16px', borderRadius: 12, backgroundColor: 'rgba(15,23,42,0.88)', border: `3px solid ${cur.border}`, fontFamily, fontSize: 14, color: '#ffffff' }}>{cur.sub}</div>
          </div>
        )}
      </div>
      {showCut && <div style={{ position: 'absolute', top: 230, left: 60, right: 60, height: 1160, borderRadius: 28, backgroundColor: '#0f172a', zIndex: 35 }} />}
      {showCut && <AbsoluteFill style={{ transform: `scale(${0.94 + cutIn * 0.06})`, transformOrigin: '50% 42%', zIndex: 38 }}><CloseUpUdinMariana frame={frame} localFrame={frame - cutStart} /></AbsoluteFill>}
      {cutOutFlash > 0.02 && <div style={{ position: 'absolute', top: 230, left: 60, right: 60, height: 1160, borderRadius: 28, backgroundColor: '#ffffff', opacity: cutOutFlash, zIndex: 40, pointerEvents: 'none' }} />}
      <div style={{ position: 'absolute', top: 68, left: '50%', transform: 'translateX(-50%)', padding: '5px 18px', borderRadius: 20, backgroundColor: 'rgba(15, 23, 42, 0.85)', border: '2px solid rgba(250, 204, 21, 0.65)', fontFamily: 'sans-serif', fontSize: 21, fontWeight: 'bold', color: '#f8fafc', zIndex: 45 }}>@dysesat</div>
      <div style={{ position: 'absolute', top: 114, left: 60, right: 60, textAlign: 'center', zIndex: 45 }}>
        <div style={{ display: 'inline-block', backgroundColor: 'rgba(15, 23, 42, 0.94)', border: '3px solid #facc15', borderRadius: 14, padding: '9px 18px', fontFamily, fontSize: 15, color: '#fde047', textShadow: '2px 2px 0 #0f172a' }}>MENYELAM KE PALUNG MARIANA!</div>
      </div>
      <div style={{ position: 'absolute', top: 170, left: 65, right: 65, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 45 }}>
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.94)', border: `3px solid ${cur.border}`, borderRadius: 14, padding: '9px 15px', fontFamily, fontSize: 13, color: '#ffffff' }}>DALAM: <span style={{ color: cur.col }}>{cur.depth}</span></div>
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.94)', border: `3px solid ${cur.border}`, borderRadius: 14, padding: '9px 15px', fontFamily, fontSize: 13, color: cur.col }}>{cur.press}</div>
      </div>
      {activeWord && !showCliff && (
        <div style={{ position: 'absolute', top: 1435, left: 70, right: 70, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ fontFamily, fontSize: activeWord.w.length > 10 ? 32 : 40, color: getWordColor(activeWord.w), textAlign: 'center', padding: '12px 24px', borderRadius: 16, backgroundColor: 'rgba(15, 23, 42, 0.84)', border: `3px solid ${getWordColor(activeWord.w)}`, textShadow: '4px 4px 0 #0f172a, -3px -3px 0 #0f172a, 3px -3px 0 #0f172a, -3px 3px 0 #0f172a', transform: `scale(${0.65 + wordPop * 0.35}) rotate(${activeIdx % 2 === 0 ? -2 : 2}deg)` }}>{activeWord.w.toUpperCase()}</div>
        </div>
      )}
      {showCliff && (
        <div style={{ position: 'absolute', top: 1435, left: 65, right: 65, backgroundColor: 'rgba(15, 23, 42, 0.96)', border: '4px solid #facc15', borderRadius: 16, padding: '16px 20px', textAlign: 'center', fontFamily, fontSize: 15, lineHeight: 1.5, color: '#facc15', boxShadow: '0 10px 28px rgba(0,0,0,0.65)', transform: `scale(${cliffIn * (1 + Math.sin(frame * 0.22) * 0.025)})`, zIndex: 55 }}>
          LEBIH SEREM LUAR ANGKASA ATAU DASAR LAUT?<br /><span style={{ color: '#38bdf8', fontSize: 15 }}>TULIS DI KOMENTAR!</span>
        </div>
      )}
    </AbsoluteFill>
  );
};
