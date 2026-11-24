import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PressStart2P';
import { whoosh, ding } from '@remotion/sfx';
import { WORD_SUBS_PS, PS_TIMING } from './planetSurvWords';
import { CloseUpUdinPlanet } from './PlanetSurvivalCutscene';

const { fontFamily } = loadFont();

const getWordColor = (word: string) => {
  const c = word.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (['bumi', 'planet', 'astronot', 'mars', 'jupiter', 'nyaman'].includes(c)) return '#38bdf8';
  if (['merkurius', 'venus', 'gosong', 'beku', 'asam', 'remuk', 'badai', 'hancur', 'ngeri'].includes(c)) return '#f87171';
  if (['dua', 'detik', 'menit', 'satu', 'delapan', 'puluh', 'tahun', 'empat', 'ratus'].includes(c)) return '#fde047';
  return '#ffffff';
};

type UdinMode = 'normal' | 'mercHot' | 'mercCold' | 'crush' | 'mars' | 'fall' | 'relief';

const Udin2D: React.FC<{
  x: number; y: number; mode: UdinMode; frame: number;
  crushT?: number; blueT?: number; warpScale?: number; fallShrink?: number;
}> = ({ x, y, mode, frame, crushT = 0, blueT = 0, warpScale = 1, fallShrink = 1 }) => {
  const isHot = mode === 'mercHot', isCold = mode === 'mercCold', isFall = mode === 'fall';
  const isPanic = isHot || isFall, isRelief = mode === 'relief', isCrush = mode === 'crush', isMars = mode === 'mars';
  const sx = (isCrush ? 1 + crushT * 0.56 : 1) * warpScale * fallShrink;
  const sy = (isCrush ? 1 - crushT * 0.58 : 1) * warpScale * fallShrink;
  const rot = isFall ? (frame * 11) % 360 : warpScale < 0.96 ? (1 - warpScale) * 320 : 0;
  const shiv = isCold ? Math.sin(frame * 1.9) * 1.9 : isMars ? Math.sin(frame * 1.6) * (0.9 + blueT * 1.7) : isCrush ? Math.sin(frame * 1.9) * 1.4 : 0;
  const bob = isHot ? Math.abs(Math.sin(frame * 0.52)) * -3.5 : mode === 'normal' ? Math.sin(frame * 0.22) * 1.5 : 0;
  const fl = isPanic ? Math.sin(frame * 0.72) * 20 : 0;
  const waveArm = mode === 'normal' ? -135 + Math.sin(frame * 0.32) * 24 : 0;
  const skin = isHot || isCrush ? '#fb7185' : isCold ? '#7dd3fc' : isMars ? (blueT > 0.45 ? '#93c5fd' : '#c4b5fd') : '#fed7aa';
  const blink = (mode === 'normal' || isRelief) && frame % 90 > 85;

  return (
    <g transform={`translate(${x + shiv}, ${y + bob + (isCrush ? crushT * 9.5 : isRelief ? 6 : 0)}) rotate(${rot}) scale(${sx}, ${sy})`}>
      {!isFall && warpScale > 0.5 && <ellipse cx="0" cy={isRelief ? 7 : 14} rx={isRelief ? 13 : 9} ry="3" fill="rgba(15,23,42,0.34)" />}
      {isRelief ? (
        <>
          <rect x="-12" y="2" width="10" height="5" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.2" />
          <rect x="2" y="2" width="10" height="5" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.2" />
          <rect x="-13" y="2" width="3" height="5" fill="#f8fafc" stroke="#0f172a" strokeWidth="0.9" />
          <rect x="10" y="2" width="3" height="5" fill="#f8fafc" stroke="#0f172a" strokeWidth="0.9" />
        </>
      ) : (
        <>
          <g transform={`translate(-3, 4) rotate(${isFall ? Math.sin(frame * 0.75) * 34 : mode === 'normal' ? Math.sin(frame * 0.22) * 6 : 0})`}><rect x="-2" y="0" width="4" height="10" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.2" /></g>
          <g transform={`translate(3, 4) rotate(${isFall ? -Math.sin(frame * 0.75) * 34 : mode === 'normal' ? -Math.sin(frame * 0.22) * 6 : 0})`}><rect x="-2" y="0" width="4" height="10" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.2" /></g>
        </>
      )}
      <rect x="-7" y="-8" width="14" height="13" fill="#dc2626" stroke="#0f172a" strokeWidth="1.4" />
      {isMars ? (
        <>
          <g transform="translate(-7, -6) rotate(-52)"><rect x="-1.5" y="-1" width="4.2" height="9" fill="#dc2626" stroke="#0f172a" strokeWidth="1.1" /><rect x="-1.5" y="6.5" width="4.2" height="3.2" fill={skin} stroke="#0f172a" strokeWidth="1" /></g>
          <g transform="translate(7, -6) rotate(52)"><rect x="-2.7" y="-1" width="4.2" height="9" fill="#dc2626" stroke="#0f172a" strokeWidth="1.1" /><rect x="-2.7" y="6.5" width="4.2" height="3.2" fill={skin} stroke="#0f172a" strokeWidth="1" /></g>
        </>
      ) : (
        <>
          <g transform={`translate(-7, -6) rotate(${isPanic ? 132 + fl : isCold ? -24 : isCrush ? 108 : isRelief ? 28 : 8})`}><rect x="-2.5" y="0" width="4.5" height="8" fill="#dc2626" stroke="#0f172a" strokeWidth="1.2" /><rect x="-2.5" y="7" width="4.5" height="3.5" fill={skin} stroke="#0f172a" strokeWidth="1" /></g>
          <g transform={`translate(7, -6) rotate(${isPanic ? -132 - fl : isCold ? 24 : isCrush ? -108 : isRelief ? -28 : waveArm})`}><rect x="-2" y="0" width="4.5" height="8" fill="#dc2626" stroke="#0f172a" strokeWidth="1.2" /><rect x="-2" y="7" width="4.5" height="3.5" fill={skin} stroke="#0f172a" strokeWidth="1" /></g>
        </>
      )}
      <rect x="-6" y="-19" width="12" height="11" fill={skin} stroke="#0f172a" strokeWidth="1.4" />
      <rect x="-6" y="-21" width="12" height="4" fill="#29150b" />
      {blink ? (<><rect x="-3.5" y="-14" width="3" height="1.2" fill="#0f172a" /><rect x="1.5" y="-14" width="3" height="1.2" fill="#0f172a" /></>) : (<><rect x="-3" y="-15" width="2" height="2" fill="#0f172a" /><rect x="2" y="-15" width="2" height="2" fill="#0f172a" /></>)}
      {isMars ? (
        <><ellipse cx="-4.6" cy="-11.2" rx="2.5" ry="2.2" fill={blueT > 0.45 ? '#60a5fa' : '#a78bfa'} stroke="#0f172a" strokeWidth="0.7" /><ellipse cx="4.6" cy="-11.2" rx="2.5" ry="2.2" fill={blueT > 0.45 ? '#60a5fa' : '#a78bfa'} stroke="#0f172a" strokeWidth="0.7" /><rect x="-2.2" y="-11.6" width="4.4" height="1.4" fill="#0f172a" /></>
      ) : isRelief ? (<rect x="-2" y="-11" width="4" height="1.5" fill="#15803d" />) : (isPanic || isCrush || isCold) ? (<rect x="-2" y="-11.5" width="4" height="2.6" fill="#7f1d1d" />) : null}
      {(isHot || isCrush) && [-4, 4].map((hx, i) => { const hp = ((frame + i * 10) % 20) / 20; return <rect key={i} x={hx} y={-26 - hp * 10} width="2.8" height="3.5" fill="#ffffff" opacity={Math.sin(hp * Math.PI) * 0.85} />; })}
      {isMars && (<g transform={`translate(0, ${-31 + Math.sin(frame * 0.3) * 1.8})`}><rect x="-17" y="-8" width="34" height="10" rx="2" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.2" /><text x="0" y="-1" textAnchor="middle" fill="#38bdf8" fontSize="5.2" fontWeight="bold" fontFamily="monospace">O2: 0%</text></g>)}
      {isCold && (<g><rect x="-11" y="-23" width="22" height="38" fill="#bae6fd" fillOpacity="0.38" stroke="#e0f2fe" strokeWidth="1.6" /><line x1="-8" y1="-16" x2="-2" y2="-20" stroke="#ffffff" strokeWidth="1.5" opacity="0.88" /><line x1="2" y1="2" x2="8" y2="-4" stroke="#ffffff" strokeWidth="1.4" opacity="0.78" /></g>)}
    </g>
  );
};
const PixelTree: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    <ellipse cx="0" cy="36" rx="16" ry="4" fill="rgba(15,23,42,0.26)" />
    <rect x="-4" y="4" width="8" height="32" fill="#78350f" stroke="#0f172a" strokeWidth="1.4" />
    <rect x="-18" y="-14" width="36" height="20" fill="#15803d" stroke="#0f172a" strokeWidth="1.5" />
    <rect x="-13" y="-26" width="26" height="15" fill="#16a34a" stroke="#0f172a" strokeWidth="1.4" />
    <rect x="-7" y="-33" width="14" height="9" fill="#22c55e" stroke="#0f172a" strokeWidth="1.3" />
  </g>
);

const PixelCloud: React.FC<{ x: number; y: number; w?: number }> = ({ x, y, w = 44 }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect x="0" y="6" width={w} height="10" fill="#f0f9ff" opacity="0.94" />
    <rect x={w * 0.18} y="0" width={w * 0.56} height="9" fill="#ffffff" />
  </g>
);

const PixelBird: React.FC<{ x: number; y: number; frame: number }> = ({ x, y, frame }) => {
  const wing = Math.sin(frame * 0.45) > 0 ? -2.5 : 1.5;
  return <g transform={`translate(${x}, ${y})`} stroke="#0f172a" strokeWidth="1.4" fill="none"><polyline points={`-5,${wing} 0,0 5,${wing}`} /></g>;
};

const MiniPlanetBadge: React.FC<{ x: number; y: number; r: number; fill: string; stripe?: string; label?: string; scale?: number }> = ({ x, y, r, fill, stripe, label, scale = 1 }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    <circle cx="0" cy="0" r={r + 2.2} fill="rgba(15,23,42,0.55)" />
    <circle cx="0" cy="0" r={r} fill={fill} stroke="#0f172a" strokeWidth="1.4" />
    {stripe && <rect x={-r + 2} y="-2" width={(r - 2) * 2} height="3.4" fill={stripe} opacity="0.8" />}
    <circle cx={-r * 0.35} cy={-r * 0.35} r={r * 0.25} fill="#ffffff" opacity="0.45" />
    {label && (
      <g transform={`translate(0, ${r + 9})`}>
        <rect x="-24" y="-6.5" width="48" height="10" rx="2.5" fill="rgba(15,23,42,0.88)" stroke={fill} strokeWidth="1" />
        <text x="0" y="0.6" textAnchor="middle" fill="#ffffff" fontSize="5" fontWeight="bold" fontFamily="monospace">{label}</text>
      </g>
    )}
  </g>
);

const PlanetStageBg: React.FC<{
  stage: string; frame: number; localF: number; mercNightT: number;
  crushT: number; boltActive: boolean; boltSide: number;
}> = ({ stage, frame, localF, mercNightT, crushT, boltActive, boltSide }) => {
  if (stage === 'earth' || stage === 'back') {
    return (
      <g>
        <rect width="270" height="202" fill="url(#earthSky)" />
        <circle cx="226" cy="40" r="22" fill="#fde047" opacity="0.28" />
        <circle cx="226" cy="40" r="14" fill="#fde047" stroke="#f59e0b" strokeWidth="2" />
        <PixelCloud x={((18 + frame * 0.22) % 310) - 45} y={66} w={42} />
        <PixelCloud x={((152 + frame * 0.14) % 310) - 45} y={84} w={48} />
        <PixelBird x={((frame * 1.15) % 310) - 20} y={54 + Math.sin(frame * 0.1) * 4} frame={frame} />
        <PixelBird x={((frame * 1.15 + 32) % 310) - 20} y={62 + Math.cos(frame * 0.1) * 3} frame={frame + 6} />
        <polygon points="0,204 0,174 52,158 118,178 188,156 270,176 270,204" fill="#166534" />
        <polygon points="0,204 28,184 96,170 164,188 232,172 270,186 270,204" fill="#15803d" />
        <rect y="198" width="270" height="132" fill="#22c55e" />
        <rect y="196" width="270" height="5" fill="#4ade80" />
        <polygon points="116,198 154,198 172,330 98,330" fill="#d6d3d1" opacity="0.55" />
        {[[26,226,'#fde047'],[68,266,'#f472b6'],[206,232,'#ffffff'],[236,278,'#fde047'],[50,298,'#ffffff'],[216,304,'#f472b6']].map(([fx,fy,fc],i)=>(
          <g key={i}><rect x={Number(fx)} y={Number(fy)} width="4" height="4" fill={String(fc)} stroke="#0f172a" strokeWidth="0.7" /><rect x={Number(fx) + 1} y={Number(fy) + 4} width="2" height="3" fill="#15803d" /></g>
        ))}
        <PixelTree x={42} y={206} scale={1} />
        <PixelTree x={226} y={210} scale={0.92} />
      </g>
    );
  }
  if (stage === 'mercury') {
    const sunY = interpolate(mercNightT, [0, 1], [76, 224]);
    return (
      <g>
        <rect width="270" height="202" fill="url(#mercDaySky)" />
        <g opacity={1 - mercNightT * 0.92}><circle cx="135" cy={sunY} r="58" fill="#fb923c" opacity="0.28" /><circle cx="135" cy={sunY} r="42" fill="#fde047" stroke="#f97316" strokeWidth="3" /></g>
        <rect width="270" height="202" fill="url(#mercNightSky)" opacity={mercNightT} />
        <g opacity={mercNightT}>{[[26,28],[68,54],[104,24],[158,48],[198,26],[240,62],[48,96],[222,102],[132,74]].map(([sx,sy],i)=>(<rect key={i} x={sx} y={sy} width="3" height="3" fill="#e0f2fe" opacity={0.45 + ((frame + i * 7) % 10) / 16} />))}</g>
        <polygon points="0,204 0,168 38,154 74,174 114,158 158,176 202,150 244,170 270,160 270,204" fill="#7c2d12" />
        <polygon points="0,204 0,168 38,154 74,174 114,158 158,176 202,150 244,170 270,160 270,204" fill="#1e293b" opacity={mercNightT} />
        <rect y="198" width="270" height="132" fill="#9a3412" />
        <rect y="198" width="270" height="132" fill="#1e3a8a" opacity={mercNightT * 0.92} />
        <rect y="196" width="270" height="5" fill={mercNightT > 0.5 ? '#7dd3fc' : '#fb923c'} />
        {[[46,246,22,7],[214,236,24,7],[188,284,18,6],[68,292,16,5]].map(([cx,cy,rx,ry],i)=>(
          <g key={i}><ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={mercNightT > 0.5 ? '#0f172a' : '#7c2d12'} stroke={mercNightT > 0.5 ? '#38bdf8' : '#ea580c'} strokeWidth="1.4" /><ellipse cx={cx} cy={cy + 1.5} rx={rx * 0.65} ry={ry * 0.55} fill={mercNightT > 0.5 ? '#1e293b' : '#431407'} /></g>
        ))}
        {mercNightT < 0.5 ? [0,1,2,3,4].map((i)=>(<rect key={i} x={24 + i * 54 + Math.sin(frame * 0.4 + i) * 4} y={290 - ((frame * 3 + i * 36) % 130)} width="14" height="2.2" fill="#fef08a" opacity={0.48 * (1 - mercNightT * 2)} />)) : [0,1,2,3,4,5,6,7,8].map((i)=>(<rect key={i} x={(i * 34 + Math.sin(frame * 0.15 + i) * 8) % 270} y={(frame * 3.8 + i * 42) % 320} width="3.5" height="3.5" fill="#e0f2fe" opacity={0.88 * ((mercNightT - 0.5) * 2)} />))}
      </g>
    );
  }
  if (stage === 'venus') {
    const pressY = interpolate(crushT, [0, 1], [186, 224]) + Math.sin(frame * 0.8) * 1.4;
    return (
      <g>
        <rect width="270" height="205" fill="url(#venusSky)" />
        <g opacity="0.65" fill="#a16207">
          <rect x={((frame * 0.7) % 320) - 55} y="46" width="76" height="14" rx="6" />
          <rect x={((frame * 0.7) % 320) - 42} y="38" width="46" height="10" rx="5" />
          <rect x={230 - ((frame * 0.55) % 310)} y="88" width="84" height="15" rx="6" />
        </g>
        <polygon points="0,202 24,154 68,202" fill="#422006" />
        <polygon points="184,202 222,144 268,202" fill="#422006" />
        <rect x="219" y="144" width="6" height="5" fill="#f97316" />
        <rect y="198" width="270" height="132" fill="#713f12" />
        <rect y="196" width="270" height="5" fill="#ca8a04" />
        <polyline points="18,274 44,268 62,280" fill="none" stroke="#f97316" strokeWidth="2.5" opacity="0.85" />
        <polyline points="198,256 226,262 248,252" fill="none" stroke="#f97316" strokeWidth="2.5" opacity="0.85" />
        {Array.from({ length: 22 }).map((_, i) => {
          const rx = (i * 19 + frame * 2.6 + (i % 3) * 11) % 270;
          const ry = (frame * 13 + i * 31) % 305;
          return <line key={i} x1={rx} y1={ry} x2={rx - 3.5} y2={ry + 12} stroke="#bef264" strokeWidth="2" opacity="0.82" />;
        })}
        {[28, 76, 174, 224, 248].map((sx, i) => {
          const p = ((frame + i * 7) % 14) / 14;
          return <ellipse key={i} cx={sx} cy={255 + (i % 3) * 18} rx={2 + p * 6} ry={1 + p * 2} fill="none" stroke="#bef264" strokeWidth="1.2" opacity={1 - p} />;
        })}
        <g opacity={0.82 + Math.sin(frame * 0.5) * 0.16}>
          <rect x="86" y={pressY} width="98" height="5" fill="#ef4444" stroke="#0f172a" strokeWidth="1.2" />
          {[104, 135, 166].map((px, i) => (
            <polygon key={i} points={`${px - 6},${pressY + 6} ${px + 6},${pressY + 6} ${px},${pressY + 15}`} fill="#ef4444" stroke="#0f172a" strokeWidth="1.1" />
          ))}
        </g>
      </g>
    );
  }
  if (stage === 'mars') {
    return (
      <g>
        <rect width="270" height="202" fill="url(#marsSky)" />
        <circle cx="212" cy="48" r="14" fill="#fef3c7" opacity="0.22" />
        <circle cx="212" cy="48" r="8" fill="#fef3c7" opacity="0.92" />
        <polygon points="0,202 0,162 42,162 56,180 116,180 132,154 184,154 198,182 270,170 270,202" fill="#7c2d12" />
        <polygon points="0,202 18,176 76,176 90,190 166,190 184,172 246,172 270,188 270,202" fill="#9a3412" />
        <rect y="198" width="270" height="132" fill="#c2410c" />
        <rect y="196" width="270" height="5" fill="#fb923c" />
        {[[56,266,22,6],[214,248,18,5],[196,294,14,4]].map(([cx,cy,rx,ry],i)=>(<ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill="#7c2d12" stroke="#ea580c" strokeWidth="1.2" />))}
        <polygon points="24,234 32,224 42,234" fill="#7c2d12" stroke="#0f172a" strokeWidth="1.1" />
        <polygon points="228,278 238,266 248,278" fill="#7c2d12" stroke="#0f172a" strokeWidth="1.1" />
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x={((frame * (7 + (i % 3) * 2) + i * 44) % 330) - 60} y={104 + i * 19} width={34 + (i % 3) * 14} height="2.5" fill="#fed7aa" opacity={0.34 + (i % 3) * 0.1} />
        ))}
      </g>
    );
  }
  const sc = (localF * 7.2) % 130;
  return (
    <g>
      <rect width="270" height="330" fill="#7c2d12" />
      {[-1, 0, 1, 2, 3].map((b) => (
        <g key={b} transform={`translate(0, ${b * 130 - sc})`}>
          <path d="M0,0 Q68,14 135,0 T270,0 L270,38 Q202,24 135,38 T0,38 Z" fill="#ea580c" />
          <path d="M0,34 Q68,20 135,34 T270,34 L270,66 Q202,80 135,66 T0,66 Z" fill="#fdba74" />
          <path d="M0,62 Q68,76 135,62 T270,62 L270,100 Q202,86 135,100 T0,100 Z" fill="#c2410c" />
          <path d="M0,96 Q68,84 135,96 T270,96 L270,134 Q202,146 135,134 T0,134 Z" fill="#9a3412" />
          <g transform={`translate(${b % 2 === 0 ? 196 : 74}, 80)`}>
            <ellipse cx="0" cy="0" rx="38" ry="15" fill="#b91c1c" opacity="0.9" />
            <ellipse cx="0" cy="0" rx="24" ry="9" fill="#ef4444" opacity="0.88" />
            <ellipse cx="0" cy="0" rx="11" ry="4" fill="#fca5a5" opacity="0.75" />
          </g>
        </g>
      ))}
      {[18, 56, 98, 146, 188, 224, 254].map((lx, i) => (<rect key={i} x={lx} y={330 - ((frame * 21 + i * 64) % 360)} width="2.6" height="36" fill="#fef08a" opacity="0.56" />))}
      {boltActive && (
        <g>
          <rect width="270" height="330" fill="#fef08a" opacity="0.18" />
          {boltSide % 2 === 0 ? (
            <polygon points="204,84 215,84 198,154 217,154 185,250 196,170 179,170" fill="#fef08a" stroke="#ffffff" strokeWidth="1.5" />
          ) : (
            <polygon points="56,92 67,92 52,162 69,162 41,254 50,176 35,176" fill="#fef08a" stroke="#ffffff" strokeWidth="1.5" />
          )}
        </g>
      )}
    </g>
  );
};
export const PlanetSurvival: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sec = frame / fps;
  const { tEarthStat, tPortal, tMerc, tMercNight, tVenus, tMars, tJup, tBack, tCutStart, tCutEnd, tChoice, cliffFrame } = PS_TIMING;
  const stage = frame < tMerc ? 'earth' : frame < tVenus ? 'mercury' : frame < tMars ? 'venus' : frame < tJup ? 'mars' : frame < tBack ? 'jupiter' : 'back';
  const localF = stage === 'mercury' ? frame - tMerc : stage === 'venus' ? frame - tVenus : stage === 'mars' ? frame - tMars : stage === 'jupiter' ? frame - tJup : stage === 'back' ? frame - tBack : frame;

  const mercNightT = stage === 'mercury' ? interpolate(frame, [tMercNight - 4, tMercNight + 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const mercCold = mercNightT > 0.5;

  const cutStart = tCutStart;
  const cutEnd = Math.min(tChoice - 6, Math.max(cutStart + 86, tCutEnd));
  const showCut = frame >= cutStart && frame <= cutEnd;
  const cutIn = showCut ? spring({ frame: frame - cutStart, fps, config: { damping: 12 } }) : 0;
  const cutScaleOut = showCut ? interpolate(frame, [cutEnd - 4, cutEnd], [1, 0.84], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 1;
  const cutOutFlash = frame >= cutEnd - 2 && frame <= cutEnd + 3 ? interpolate(frame, [cutEnd - 2, cutEnd, cutEnd + 3], [0, 0.92, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;

  const showCliff = frame >= cliffFrame;
  const cliffIn = showCliff ? spring({ frame: frame - cliffFrame, fps, config: { damping: 10 } }) : 0;
  const activeIdx = WORD_SUBS_PS.findIndex((x) => sec >= x.s && sec < x.e);
  const activeWord = activeIdx >= 0 ? WORD_SUBS_PS[activeIdx] : null;
  const wordPop = activeWord ? spring({ frame: Math.max(0, frame - Math.floor(activeWord.s * fps)), fps, config: { damping: 11, stiffness: 280, mass: 0.5 } }) : 0;

  const meta: Record<string, { name: string; time: string; hudStat: string; sub: string; border: string; col: string }> = {
    earth:   { name: 'BUMI', time: '~80 TAHUN', hudStat: 'SUHU: +25°C', sub: 'AMAN & NYAMAN', border: '#4ade80', col: '#4ade80' },
    mercury: { name: 'MERKURIUS', time: '~2 DETIK', hudStat: mercCold ? 'SUHU: -180°C' : 'SUHU: +400°C', sub: mercCold ? 'MALAM: -180°C!' : 'SIANG: +400°C!', border: mercCold ? '#38bdf8' : '#fb923c', col: mercCold ? '#38bdf8' : '#fde047' },
    venus:   { name: 'VENUS', time: '< 1 DETIK', hudStat: 'SUHU: +465°C', sub: 'TEKANAN 92x BUMI', border: '#eab308', col: '#f87171' },
    mars:    { name: 'MARS', time: '~2 MENIT', hudStat: 'SUHU: -60°C', sub: 'TANPA OKSIGEN', border: '#f97316', col: '#38bdf8' },
    jupiter: { name: 'JUPITER', time: '< 1 DETIK', hudStat: 'NO DARATAN!', sub: 'BADAI RAKSASA', border: '#ef4444', col: '#f87171' },
    back:    { name: 'BUMI', time: 'SELAMAT!', hudStat: 'SUHU: +25°C', sub: 'PALING NYAMAN', border: '#4ade80', col: '#4ade80' },
  };
  const cur = meta[stage];
  const shake = stage === 'venus' || stage === 'jupiter' ? Math.sin(frame * 2.5) * 3.5 : 0;
  const crushT = stage === 'venus' ? interpolate(localF, [10, 92], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const blueT = stage === 'mars' ? interpolate(localF, [14, 102], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;

  const jupDur = Math.max(40, tBack - tJup);
  const marsDur = Math.max(40, tJup - tMars);
  const jupSuckT = stage === 'jupiter' ? interpolate(localF, [Math.max(15, jupDur - 48), jupDur - 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const udinX = stage === 'jupiter' ? 135 + Math.sin(frame * 0.25) * 16 + jupSuckT * 36 : 135;
  const udinY = stage === 'jupiter' ? 172 + Math.sin(frame * 0.3) * 20 - jupSuckT * 18 : 244;
  const fallShrink = stage === 'jupiter' ? 1 - jupSuckT * 0.42 : 1;

  const jupBolts = [tJup + 18, tJup + Math.floor(jupDur * 0.5), tJup + Math.floor(jupDur * 0.8)].filter((b) => b < tBack - 10);
  const boltIdx = jupBolts.findIndex((b) => frame >= b && frame < b + 5);
  const boltActive = stage === 'jupiter' && boltIdx >= 0;

  const transitions = [tMerc, tVenus, tMars, tJup, tBack];
  const portStart = Math.min(tPortal, tMerc - 32);
  let warpScale = 1, portalFlash = 0;
  for (const tr of transitions) {
    if (frame >= tr - 10 && frame < tr) warpScale = Math.min(warpScale, interpolate(frame, [tr - 10, tr], [1, 0.14], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
    else if (frame >= tr && frame < tr + 8) warpScale = Math.min(warpScale, interpolate(frame, [tr, tr + 8], [0.18, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
    if (frame >= tr - 2 && frame <= tr + 3) portalFlash = Math.max(portalFlash, interpolate(frame, [tr - 2, tr, tr + 3], [0, 0.65, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  }
  const isPortal = (frame >= portStart && frame < tMerc + 10) || transitions.some((tr) => Math.abs(frame - tr) < 11);
  const udinMode: UdinMode = stage === 'earth' ? 'normal' : stage === 'mercury' ? (mercCold ? 'mercCold' : 'mercHot') : stage === 'venus' ? 'crush' : stage === 'mars' ? 'mars' : stage === 'jupiter' ? 'fall' : 'relief';
  const introAlpha = stage === 'earth' ? interpolate(frame, [0, 8, tEarthStat - 8, tEarthStat], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const earthStatAlpha = stage === 'earth' ? interpolate(frame, [tEarthStat - 2, tEarthStat + 6, portStart - 4, portStart + 4], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const showChoices = stage === 'back' && !showCut && frame >= tChoice - 6;
  const choicePop = showChoices ? spring({ frame: Math.max(0, frame - (tChoice - 6)), fps, config: { damping: 11, stiffness: 210 } }) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a', overflow: 'hidden', transform: `translate(${shake}px, ${-shake * 0.5}px)` }}>
      <Audio src={staticFile('vo_planet_surv.mp3')} volume={1} />
      <Audio src={staticFile('bgm_planet_surv.wav')} volume={0.21} />
      {[portStart, tVenus - 8, tMars - 8, tJup - 8, tBack - 8].map((pf, idx) => (
        <Sequence key={`p-${idx}-${pf}`} from={Math.max(0, pf)} durationInFrames={20}><Audio src={staticFile('sfx_ps_portal.wav')} volume={0.26} /></Sequence>
      ))}
      <Sequence from={tMerc + 6} durationInFrames={28}><Audio src={staticFile('sfx_ps_sizzle.wav')} volume={0.34} /></Sequence>
      <Sequence from={tMercNight + 2} durationInFrames={26}><Audio src={staticFile('sfx_ps_freeze.wav')} volume={0.34} /></Sequence>
      <Sequence from={tVenus + 8} durationInFrames={34}><Audio src={staticFile('sfx_ps_crush.wav')} volume={0.38} /></Sequence>
      <Sequence from={tMars + 4} durationInFrames={Math.min(180, marsDur)}><Audio src={staticFile('sfx_ps_wind.wav')} volume={0.24} /></Sequence>
      <Sequence from={tJup + 4} durationInFrames={Math.min(180, jupDur)}><Audio src={staticFile('sfx_ps_storm.wav')} volume={0.25} /></Sequence>
      {jupBolts.map((bf, idx) => (<Sequence key={`th-${idx}-${bf}`} from={bf} durationInFrames={22}><Audio src={staticFile('sfx_ps_thunder.wav')} volume={0.42} /></Sequence>))}
      <Sequence from={cutStart} durationInFrames={28}><Audio src={whoosh} volume={0.36} /></Sequence>
      <Sequence from={Math.max(0, cutEnd - 3)} durationInFrames={28}><Audio src={whoosh} volume={0.32} /></Sequence>
      <Sequence from={cliffFrame} durationInFrames={45}><Audio src={ding} volume={0.45} /></Sequence>
      <AbsoluteFill style={{ backgroundImage: 'radial-gradient(#38bdf8 3px, transparent 3px)', backgroundSize: '44px 44px', opacity: 0.2 }} />

      <div style={{ position: 'absolute', top: 230, left: 60, right: 60, height: 1160, border: `8px solid ${cur.border}`, borderRadius: 28, overflow: 'hidden', boxShadow: '0 22px 54px rgba(0,0,0,0.85)', zIndex: 15 }}>
        <svg width="100%" height="100%" viewBox="0 0 270 330" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="earthSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0284c7" /><stop offset="100%" stopColor="#7dd3fc" /></linearGradient>
            <linearGradient id="mercDaySky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#431407" /><stop offset="55%" stopColor="#c2410c" /><stop offset="100%" stopColor="#f97316" /></linearGradient>
            <linearGradient id="mercNightSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#020617" /><stop offset="100%" stopColor="#0f172a" /></linearGradient>
            <linearGradient id="venusSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#713f12" /><stop offset="55%" stopColor="#ca8a04" /><stop offset="100%" stopColor="#eab308" /></linearGradient>
            <linearGradient id="marsSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#431407" /><stop offset="55%" stopColor="#9a3412" /><stop offset="100%" stopColor="#ea580c" /></linearGradient>
          </defs>
          <PlanetStageBg stage={stage} frame={frame} localF={localF} mercNightT={mercNightT} crushT={crushT} boltActive={boltActive} boltSide={boltIdx} />
          {introAlpha > 0.05 && (
            <g opacity={introAlpha}>
              {[{ fill: '#fb923c', r: 9, phase: 0 }, { fill: '#eab308', r: 10, phase: 1.55 }, { fill: '#f97316', r: 8.5, phase: 3.1 }, { fill: '#ef4444', r: 12, stripe: '#fdba74', phase: 4.65 }].map((pl, idx) => {
                const ang = frame * 0.055 + pl.phase;
                return <MiniPlanetBadge key={idx} x={135 + Math.cos(ang) * 76} y={148 + Math.sin(ang) * 16} r={pl.r} fill={pl.fill} stripe={pl.stripe} />;
              })}
            </g>
          )}
          {stage === 'jupiter' && (
            <g transform={`translate(${udinX}, ${udinY}) rotate(${frame * 14})`} opacity="0.72" fill="none" stroke="#fef08a">
              <path d="M-26,-6 A28,12 0 0,1 26,-6" strokeWidth="2.2" />
              <path d="M24,8 A26,11 0 0,1 -24,8" strokeWidth="2" />
            </g>
          )}
          {isPortal && (
            <g transform={`translate(${udinX}, ${udinY - 4}) rotate(${frame * 10}) scale(${0.86 + Math.sin(frame * 0.5) * 0.14})`}>
              <rect x="-24" y="-24" width="48" height="48" fill="#9333ea" stroke="#0f172a" strokeWidth="2" opacity="0.92" />
              <rect x="-15" y="-15" width="30" height="30" fill="#d946ef" stroke="#0f172a" strokeWidth="1.5" />
              <rect x="-6" y="-6" width="12" height="12" fill="#ffffff" />
            </g>
          )}
          <Udin2D x={udinX} y={udinY} mode={udinMode} frame={frame} crushT={crushT} blueT={blueT} warpScale={warpScale} fallShrink={fallShrink} />
          {stage === 'back' && !showCut && (
            <g transform={`translate(135, ${214 + Math.sin(frame * 0.22) * 3})`}>
              <rect x="-22" y="-10" width="44" height="12" rx="3" fill="rgba(15,23,42,0.84)" stroke="#4ade80" strokeWidth="1.2" />
              <text x="0" y="-2" textAnchor="middle" fill="#4ade80" fontSize="6" fontWeight="bold" fontFamily="monospace">FIUH...</text>
            </g>
          )}
          {showChoices && (
            <g>
              {[{ x: 42, y: 122, r: 13, fill: '#fb923c', label: 'MERKURIUS' }, { x: 104, y: 106, r: 14, fill: '#eab308', label: 'VENUS' }, { x: 166, y: 106, r: 13, fill: '#f97316', label: 'MARS' }, { x: 228, y: 122, r: 16, fill: '#ef4444', stripe: '#fdba74', label: 'JUPITER' }].map((pl, idx) => (
                <MiniPlanetBadge key={pl.label} x={pl.x} y={pl.y + Math.sin(frame * 0.22 + idx * 1.1) * 4} r={pl.r} fill={pl.fill} stripe={pl.stripe} label={pl.label} scale={choicePop} />
              ))}
            </g>
          )}
          {stage === 'mars' && blueT > 0.25 && (
            <g opacity={(blueT - 0.25) * 1.15}>
              <rect x="0" y="0" width="270" height="330" fill="none" stroke="#bae6fd" strokeWidth="18" opacity="0.65" />
              <polygon points="0,0 56,0 32,20 18,46 0,58" fill="#e0f2fe" opacity="0.72" />
              <polygon points="270,0 214,0 238,20 252,46 270,58" fill="#e0f2fe" opacity="0.72" />
              <polygon points="0,330 58,330 32,308 18,284 0,270" fill="#e0f2fe" opacity="0.72" />
              <polygon points="270,330 212,330 238,308 252,284 270,270" fill="#e0f2fe" opacity="0.72" />
            </g>
          )}
          {portalFlash > 0.02 && <rect width="270" height="330" fill="#e879f9" opacity={portalFlash} />}
        </svg>
        {introAlpha > 0.02 && (
          <div style={{ position: 'absolute', top: 34, left: 24, right: 24, textAlign: 'center', opacity: introAlpha, zIndex: 30 }}>
            <div style={{ fontFamily, fontSize: 28, lineHeight: 1.45, color: '#fde047', textShadow: '5px 5px 0 #0f172a, -3px -3px 0 #0f172a, 3px -3px 0 #0f172a, -3px 3px 0 #0f172a' }}>BERAPA LAMA TAHAN<br />DI PLANET LAIN?</div>
            <div style={{ display: 'inline-block', marginTop: 14, padding: '8px 16px', borderRadius: 12, backgroundColor: 'rgba(15,23,42,0.88)', border: '3px solid #f87171', fontFamily, fontSize: 13, color: '#ffffff' }}>TANPA BAJU ASTRONOT!</div>
          </div>
        )}
        {earthStatAlpha > 0.02 && (
          <div style={{ position: 'absolute', top: 28, left: '50%', transform: `translateX(-50%) scale(${0.92 + earthStatAlpha * 0.08})`, textAlign: 'center', opacity: earthStatAlpha, zIndex: 30, width: '90%' }}>
            <div style={{ fontFamily, fontSize: 13, color: '#ffffff', textShadow: '3px 3px 0 #0f172a', marginBottom: 8 }}>BERTAHAN HIDUP:</div>
            <div style={{ fontFamily, fontSize: 40, color: '#4ade80', textShadow: '6px 6px 0 #0f172a, -3px -3px 0 #0f172a, 3px -3px 0 #0f172a, -3px 3px 0 #0f172a' }}>~80 TAHUN</div>
            <div style={{ display: 'inline-block', marginTop: 10, padding: '8px 16px', borderRadius: 12, backgroundColor: 'rgba(15,23,42,0.88)', border: '3px solid #4ade80', fontFamily, fontSize: 14, color: '#ffffff' }}>AMAN &amp; NYAMAN</div>
          </div>
        )}
        {stage !== 'earth' && stage !== 'back' && !showCut && (
          <div style={{ position: 'absolute', top: 24, left: '50%', transform: `translateX(-50%) scale(${1 + Math.sin(frame * 0.4) * 0.04})`, textAlign: 'center', zIndex: 30, width: '90%' }}>
            <div style={{ fontFamily, fontSize: 13, color: '#ffffff', textShadow: '3px 3px 0 #0f172a', marginBottom: 8 }}>BERTAHAN HIDUP:</div>
            <div style={{ fontFamily, fontSize: 40, color: cur.col, textShadow: '6px 6px 0 #0f172a, -3px -3px 0 #0f172a, 3px -3px 0 #0f172a, -3px 3px 0 #0f172a' }}>{cur.time}</div>
            <div style={{ display: 'inline-block', marginTop: 10, padding: '8px 16px', borderRadius: 12, backgroundColor: 'rgba(15,23,42,0.88)', border: `3px solid ${cur.border}`, fontFamily, fontSize: 14, color: '#ffffff' }}>{cur.sub}</div>
          </div>
        )}
      </div>

      {showCut && <AbsoluteFill style={{ backgroundColor: 'rgba(15, 23, 42, 0.72)', zIndex: 35 }} />}
      {showCut && <AbsoluteFill style={{ transform: `scale(${(0.88 + cutIn * 0.12) * cutScaleOut})`, zIndex: 38 }}><CloseUpUdinPlanet frame={frame} localFrame={frame - cutStart} /></AbsoluteFill>}
      {cutOutFlash > 0.02 && <div style={{ position: 'absolute', top: 230, left: 60, right: 60, height: 1160, borderRadius: 28, backgroundColor: '#ffffff', opacity: cutOutFlash, zIndex: 40, pointerEvents: 'none' }} />}

      <div style={{ position: 'absolute', top: 68, left: '50%', transform: 'translateX(-50%)', padding: '5px 18px', borderRadius: 20, backgroundColor: 'rgba(15, 23, 42, 0.85)', border: '2px solid rgba(250, 204, 21, 0.65)', fontFamily: 'sans-serif', fontSize: 21, fontWeight: 'bold', color: '#f8fafc', zIndex: 45 }}>@dysesat</div>
      <div style={{ position: 'absolute', top: 114, left: 60, right: 60, textAlign: 'center', zIndex: 45 }}>
        <div style={{ display: 'inline-block', backgroundColor: 'rgba(15, 23, 42, 0.94)', border: '3px solid #facc15', borderRadius: 14, padding: '9px 18px', fontFamily, fontSize: 15, color: '#fde047', textShadow: '2px 2px 0 #0f172a' }}>BERTAHAN HIDUP DI PLANET LAIN!</div>
      </div>
      <div style={{ position: 'absolute', top: 170, left: 65, right: 65, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 45 }}>
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.94)', border: `3px solid ${cur.border}`, borderRadius: 14, padding: '9px 15px', fontFamily, fontSize: 13, color: '#ffffff' }}>PLANET: <span style={{ color: cur.col }}>{cur.name}</span></div>
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.94)', border: `3px solid ${cur.border}`, borderRadius: 14, padding: '9px 15px', fontFamily, fontSize: 13, color: cur.col }}>{cur.hudStat}</div>
      </div>

      {activeWord && !showCliff && (
        <div style={{ position: 'absolute', top: 1435, left: 70, right: 70, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ fontFamily, fontSize: activeWord.w.length > 10 ? 32 : 40, color: getWordColor(activeWord.w), textAlign: 'center', padding: '12px 24px', borderRadius: 16, backgroundColor: 'rgba(15, 23, 42, 0.84)', border: `3px solid ${getWordColor(activeWord.w)}`, textShadow: '4px 4px 0 #0f172a, -3px -3px 0 #0f172a, 3px -3px 0 #0f172a, -3px 3px 0 #0f172a', transform: `scale(${0.65 + wordPop * 0.35}) rotate(${activeIdx % 2 === 0 ? -2 : 2}deg)` }}>{activeWord.w.toUpperCase()}</div>
        </div>
      )}
      {showCliff && (
        <div style={{ position: 'absolute', top: 1435, left: 65, right: 65, backgroundColor: 'rgba(15, 23, 42, 0.96)', border: '4px solid #facc15', borderRadius: 16, padding: '16px 20px', textAlign: 'center', fontFamily, fontSize: 16, lineHeight: 1.5, color: '#facc15', boxShadow: '0 10px 28px rgba(0,0,0,0.65)', transform: `scale(${cliffIn * (1 + Math.sin(frame * 0.22) * 0.025)})`, zIndex: 55 }}>
          WAJIB PINDAH PLANET, PILIH MANA?<br /><span style={{ color: '#38bdf8', fontSize: 15 }}>TULIS DI KOMENTAR!</span>
        </div>
      )}
    </AbsoluteFill>
  );
};
