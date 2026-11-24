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

const Udin2D: React.FC<{ x: number; y: number; mode: UdinMode; frame: number; crushT?: number; blueT?: number; warpScale?: number }> = ({ x, y, mode, frame, crushT = 0, blueT = 0, warpScale = 1 }) => {
  const isHot = mode === 'mercHot', isCold = mode === 'mercCold', isFall = mode === 'fall';
  const isPanic = isHot || isFall, isRelief = mode === 'relief', isCrush = mode === 'crush', isMars = mode === 'mars';
  const sx = (isCrush ? 1 + crushT * 0.52 : 1) * warpScale;
  const sy = (isCrush ? 1 - crushT * 0.56 : 1) * warpScale;
  const rot = isFall ? Math.sin(frame * 0.24) * 32 : warpScale < 0.98 ? (1 - warpScale) * 280 : 0;
  const shiv = isCold ? Math.sin(frame * 1.9) * 1.9 : isMars ? Math.sin(frame * 1.5) * (0.8 + blueT * 1.5) : isCrush ? Math.sin(frame * 1.8) * 1.2 : 0;
  const bob = isHot ? Math.abs(Math.sin(frame * 0.5)) * -3.2 : mode === 'normal' ? Math.sin(frame * 0.16) * 0.9 : 0;
  const fl = isPanic ? Math.sin(frame * 0.72) * 18 : 0;
  const skin = isHot || isCrush ? '#fb7185' : isCold ? '#7dd3fc' : isMars ? (blueT > 0.5 ? '#93c5fd' : '#d8b4fe') : '#fed7aa';
  const blink = (mode === 'normal' || isRelief) && (frame % 90) > 85;
  return (
    <g transform={`translate(${x + shiv}, ${y + bob + (isCrush ? crushT * 9 : isRelief ? 6 : 0)}) rotate(${rot}) scale(${sx}, ${sy})`}>
      {!isFall && warpScale > 0.5 && <ellipse cx="0" cy={isRelief ? 7 : 14} rx={isRelief ? 13 : 9} ry="3" fill="rgba(15,23,42,0.34)" />}
      {isRelief ? (
        <><rect x="-12" y="2" width="10" height="5" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.2" /><rect x="2" y="2" width="10" height="5" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.2" /><rect x="-13" y="2" width="3" height="5" fill="#f8fafc" stroke="#0f172a" strokeWidth="0.9" /><rect x="10" y="2" width="3" height="5" fill="#f8fafc" stroke="#0f172a" strokeWidth="0.9" /></>
      ) : (
        <><g transform={`translate(-3, 4) rotate(${isFall ? Math.sin(frame * 0.7) * 28 : 0})`}><rect x="-2" y="0" width="4" height="10" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.2" /></g><g transform={`translate(3, 4) rotate(${isFall ? -Math.sin(frame * 0.7) * 28 : 0})`}><rect x="-2" y="0" width="4" height="10" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.2" /></g></>
      )}
      <rect x="-7" y="-8" width="14" height="13" fill="#dc2626" stroke="#0f172a" strokeWidth="1.4" />
      {isMars ? (
        <><rect x="-11" y="-8" width="5" height="4" fill="#dc2626" stroke="#0f172a" strokeWidth="1.1" /><rect x="-10" y="-12" width="4" height="4" fill={skin} stroke="#0f172a" strokeWidth="1" /><rect x="6" y="-8" width="5" height="4" fill="#dc2626" stroke="#0f172a" strokeWidth="1.1" /><rect x="6" y="-12" width="4" height="4" fill={skin} stroke="#0f172a" strokeWidth="1" /></>
      ) : (
        <><g transform={`translate(-7, -6) rotate(${isPanic ? 132 + fl : isCold ? -24 : isCrush ? 105 : isRelief ? 28 : 0})`}><rect x="-2.5" y="0" width="4.5" height="8" fill="#dc2626" stroke="#0f172a" strokeWidth="1.2" /><rect x="-2.5" y="7" width="4.5" height="3.5" fill={skin} stroke="#0f172a" strokeWidth="1" /></g><g transform={`translate(7, -6) rotate(${isPanic ? -132 - fl : isCold ? 24 : isCrush ? -105 : isRelief ? -28 : 0})`}><rect x="-2" y="0" width="4.5" height="8" fill="#dc2626" stroke="#0f172a" strokeWidth="1.2" /><rect x="-2" y="7" width="4.5" height="3.5" fill={skin} stroke="#0f172a" strokeWidth="1" /></g></>
      )}
      <rect x="-6" y="-19" width="12" height="11" fill={skin} stroke="#0f172a" strokeWidth="1.4" />
      <rect x="-6" y="-21" width="12" height="4" fill="#29150b" />
      {blink ? <><rect x="-3.5" y="-14" width="3" height="1.2" fill="#0f172a" /><rect x="1.5" y="-14" width="3" height="1.2" fill="#0f172a" /></> : <><rect x="-3" y="-15" width="2" height="2" fill="#0f172a" /><rect x="2" y="-15" width="2" height="2" fill="#0f172a" /></>}
      {isMars ? <><circle cx="-4.2" cy="-11" r="2.1" fill="#f472b6" /><circle cx="4.2" cy="-11" r="2.1" fill="#f472b6" /><rect x="-2" y="-11.5" width="4" height="1.4" fill="#0f172a" /></> : isRelief ? <rect x="-2" y="-11" width="4" height="1.5" fill="#15803d" /> : (isPanic || isCrush || isCold) ? <rect x="-2" y="-11.5" width="4" height="2.6" fill="#7f1d1d" /> : null}
      {(isHot || isCrush) && [-4, 4].map((hx, i) => { const hp = ((frame + i * 10) % 20) / 20; return <rect key={i} x={hx} y={-26 - hp * 10} width="2.8" height="3.5" fill="#ffffff" opacity={Math.sin(hp * Math.PI) * 0.8} />; })}
      {isCold && <g><rect x="-11" y="-23" width="22" height="38" fill="#bae6fd" fillOpacity="0.34" stroke="#e0f2fe" strokeWidth="1.6" /><line x1="-8" y1="-16" x2="-2" y2="-20" stroke="#ffffff" strokeWidth="1.5" opacity="0.85" /><line x1="2" y1="2" x2="8" y2="-4" stroke="#ffffff" strokeWidth="1.4" opacity="0.75" /></g>}
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
  <g transform={`translate(${x}, ${y})`}><rect x="0" y="6" width={w} height="10" fill="#f0f9ff" opacity="0.94" /><rect x={w * 0.18} y="0" width={w * 0.56} height="9" fill="#ffffff" /></g>
);

const PlanetStageBg: React.FC<{ stage: string; frame: number; localF: number; mercNightT: number }> = ({ stage, frame, localF, mercNightT }) => {
  if (stage === 'earth' || stage === 'back') {
    return (
      <g>
        <rect width="270" height="202" fill="url(#earthSky)" />
        <circle cx="226" cy="40" r="22" fill="#fde047" opacity="0.28" /><circle cx="226" cy="40" r="14" fill="#fde047" stroke="#f59e0b" strokeWidth="2" />
        <PixelCloud x={((18 + frame * 0.18) % 310) - 45} y={66} w={42} /><PixelCloud x={((152 + frame * 0.12) % 310) - 45} y={84} w={48} />
        <polygon points="0,204 0,174 52,158 118,178 188,156 270,176 270,204" fill="#166534" />
        <polygon points="0,204 28,184 96,170 164,188 232,172 270,186 270,204" fill="#15803d" />
        <rect y="198" width="270" height="132" fill="#22c55e" /><rect y="196" width="270" height="5" fill="#4ade80" />
        <polygon points="116,198 154,198 172,330 98,330" fill="#d6d3d1" opacity="0.55" />
        {[[26,226,'#fde047'],[68,266,'#f472b6'],[206,232,'#ffffff'],[236,278,'#fde047'],[50,298,'#ffffff'],[216,304,'#f472b6']].map(([fx,fy,fc],i)=>(
          <g key={i}><rect x={Number(fx)} y={Number(fy)} width="4" height="4" fill={String(fc)} stroke="#0f172a" strokeWidth="0.7" /><rect x={Number(fx)+1} y={Number(fy)+4} width="2" height="3" fill="#15803d" /></g>
        ))}
        <PixelTree x={42} y={206} scale={1} /><PixelTree x={226} y={210} scale={0.92} />
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
        <g opacity={mercNightT}>{[[26,28],[68,54],[104,24],[158,48],[198,26],[240,62],[48,96],[222,102],[132,74]].map(([sx,sy],i)=><rect key={i} x={sx} y={sy} width="3" height="3" fill="#e0f2fe" opacity={0.45+((frame+i*7)%10)/16} />)}</g>
        <polygon points="0,204 0,168 38,154 74,174 114,158 158,176 202,150 244,170 270,160 270,204" fill="#7c2d12" />
        <polygon points="0,204 0,168 38,154 74,174 114,158 158,176 202,150 244,170 270,160 270,204" fill="#1e293b" opacity={mercNightT} />
        <rect y="198" width="270" height="132" fill="#9a3412" /><rect y="198" width="270" height="132" fill="#1e3a8a" opacity={mercNightT * 0.92} />
        <rect y="196" width="270" height="5" fill={mercNightT > 0.5 ? '#7dd3fc' : '#fb923c'} />
        {[[46,246,22,7],[214,236,24,7],[188,284,18,6],[68,292,16,5]].map(([cx,cy,rx,ry],i)=>(
          <g key={i}><ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={mercNightT>0.5?'#0f172a':'#7c2d12'} stroke={mercNightT>0.5?'#38bdf8':'#ea580c'} strokeWidth="1.4" /><ellipse cx={cx} cy={cy+1.5} rx={rx*0.65} ry={ry*0.55} fill={mercNightT>0.5?'#1e293b':'#431407'} /></g>
        ))}
        {mercNightT < 0.5 ? [0,1,2,3,4].map((i)=><rect key={i} x={24+i*54+Math.sin(frame*0.4+i)*4} y={290-((frame*3+i*36)%130)} width="14" height="2.2" fill="#fef08a" opacity={0.48*(1-mercNightT*2)} />) : [0,1,2,3,4,5,6].map((i)=><rect key={i} x={(i*42+Math.sin(frame*0.15+i)*8)%270} y={(frame*3.5+i*48)%320} width="3.5" height="3.5" fill="#e0f2fe" opacity={0.85*((mercNightT-0.5)*2)} />)}
      </g>
    );
  }
  if (stage === 'venus') {
    return (
      <g>
        <rect width="270" height="205" fill="url(#venusSky)" />
        <g opacity="0.65" fill="#a16207"><rect x={((frame*0.7)%320)-55} y="46" width="76" height="14" rx="6" /><rect x={((frame*0.7)%320)-42} y="38" width="46" height="10" rx="5" /><rect x={230-((frame*0.55)%310)} y="88" width="84" height="15" rx="6" /></g>
        <polygon points="0,202 24,154 68,202" fill="#422006" /><polygon points="184,202 222,144 268,202" fill="#422006" /><rect x="219" y="144" width="6" height="5" fill="#f97316" />
        <rect y="198" width="270" height="132" fill="#713f12" /><rect y="196" width="270" height="5" fill="#ca8a04" />
        <polyline points="18,274 44,268 62,280" fill="none" stroke="#f97316" strokeWidth="2.5" opacity="0.85" /><polyline points="198,256 226,262 248,252" fill="none" stroke="#f97316" strokeWidth="2.5" opacity="0.85" />
        {[0,1,2,3,4,5,6,7,8,9].map((i)=>{ const rx=(i*29+frame*2.4)%270, ry=(frame*12+i*37)%305; return <line key={i} x1={rx} y1={ry} x2={rx-3} y2={ry+11} stroke="#bef264" strokeWidth="2" opacity="0.82" />; })}
        <g opacity={0.75 + Math.sin(frame * 0.4) * 0.2}>
          <rect x="86" y={176 + (frame % 16)} width="98" height="4" fill="#ef4444" stroke="#0f172a" strokeWidth="1" />
          {[104, 135, 166].map((px, i) => <polygon key={i} points={`${px-6},${182+(frame%16)} ${px+6},${182+(frame%16)} ${px},${191+(frame%16)}`} fill="#ef4444" stroke="#0f172a" strokeWidth="1.1" />)}
        </g>
      </g>
    );
  }
  if (stage === 'mars') {
    return (
      <g>
        <rect width="270" height="202" fill="url(#marsSky)" />
        <circle cx="212" cy="48" r="14" fill="#fef3c7" opacity="0.22" /><circle cx="212" cy="48" r="8" fill="#fef3c7" opacity="0.92" />
        <polygon points="0,202 0,162 42,162 56,180 116,180 132,154 184,154 198,182 270,170 270,202" fill="#7c2d12" />
        <polygon points="0,202 18,176 76,176 90,190 166,190 184,172 246,172 270,188 270,202" fill="#9a3412" />
        <rect y="198" width="270" height="132" fill="#c2410c" /><rect y="196" width="270" height="5" fill="#fb923c" />
        {[[56,266,22,6],[214,248,18,5],[196,294,14,4]].map(([cx,cy,rx,ry],i)=><ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill="#7c2d12" stroke="#ea580c" strokeWidth="1.2" />)}
        <polygon points="24,234 32,224 42,234" fill="#7c2d12" stroke="#0f172a" strokeWidth="1.1" /><polygon points="228,278 238,266 248,278" fill="#7c2d12" stroke="#0f172a" strokeWidth="1.1" />
        {[0,1,2,3,4,5].map((i)=><rect key={i} x={((frame*8+i*58)%320)-50} y={122+i*34} width="44" height="2.5" fill="#fed7aa" opacity="0.45" />)}
      </g>
    );
  }
  const sc = (localF * 6.5) % 130, bp = frame % 24;
  return (
    <g>
      <rect width="270" height="330" fill="#7c2d12" />
      {[-1,0,1,2,3].map((b)=>(
        <g key={b} transform={`translate(0, ${b*130 - sc})`}>
          <path d="M0,0 Q68,14 135,0 T270,0 L270,38 Q202,24 135,38 T0,38 Z" fill="#ea580c" />
          <path d="M0,34 Q68,20 135,34 T270,34 L270,66 Q202,80 135,66 T0,66 Z" fill="#fdba74" />
          <path d="M0,62 Q68,76 135,62 T270,62 L270,100 Q202,86 135,100 T0,100 Z" fill="#c2410c" />
          <path d="M0,96 Q68,84 135,96 T270,96 L270,134 Q202,146 135,134 T0,134 Z" fill="#9a3412" />
          <g transform={`translate(${b%2===0?196:68}, 80)`}><ellipse cx="0" cy="0" rx="34" ry="14" fill="#b91c1c" opacity="0.88" /><ellipse cx="0" cy="0" rx="22" ry="8" fill="#ef4444" opacity="0.85" /><ellipse cx="0" cy="0" rx="10" ry="3.5" fill="#fca5a5" opacity="0.7" /></g>
        </g>
      ))}
      {[20,66,112,168,214,248].map((lx,i)=><rect key={i} x={lx} y={330-((frame*18+i*72)%360)} width="2.5" height="32" fill="#fef08a" opacity="0.52" />)}
      {bp < 4 && <g><rect width="270" height="330" fill="#fef08a" opacity="0.14" /><polygon points="204,88 214,88 198,154 216,154 186,246 196,170 180,170" fill="#fef08a" stroke="#ffffff" strokeWidth="1.4" /></g>}
      {bp >= 12 && bp < 15 && <g><rect width="270" height="330" fill="#fef08a" opacity="0.12" /><polygon points="56,96 66,96 52,162 68,162 42,252 50,176 36,176" fill="#fef08a" stroke="#ffffff" strokeWidth="1.4" /></g>}
    </g>
  );
};

export const PlanetSurvival: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sec = frame / fps;
  const { tPortal, tMerc, tVenus, tMars, tJup, tBack, tCutStart, tCutEnd, cliffFrame } = PS_TIMING;
  const stage = frame < tMerc ? 'earth' : frame < tVenus ? 'mercury' : frame < tMars ? 'venus' : frame < tJup ? 'mars' : frame < tBack ? 'jupiter' : 'back';
  const localF = stage === 'mercury' ? frame - tMerc : stage === 'venus' ? frame - tVenus : stage === 'mars' ? frame - tMars : stage === 'jupiter' ? frame - tJup : frame;
  const mercDur = Math.max(90, tVenus - tMerc);
  const mercNightT = stage === 'mercury' ? interpolate(localF, [Math.floor(mercDur * 0.42), Math.floor(mercDur * 0.62)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const cutStart = tBack + 12, cutEnd = Math.min(cliffFrame - 28, Math.max(tCutEnd + 42, tCutStart + 135));
  const showCut = frame >= cutStart && frame <= cutEnd;
  const cutIn = showCut ? spring({ frame: frame - cutStart, fps, config: { damping: 12 } }) : 0;
  const cutOut = showCut ? interpolate(frame, [cutEnd - 8, cutEnd], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const cutAlpha = cutIn * cutOut;
  const showCliff = frame >= cliffFrame;
  const cliffIn = showCliff ? spring({ frame: frame - cliffFrame, fps, config: { damping: 10 } }) : 0;
  const activeIdx = WORD_SUBS_PS.findIndex((x) => sec >= x.s && sec < x.e);
  const activeWord = activeIdx >= 0 ? WORD_SUBS_PS[activeIdx] : null;
  const wordPop = activeWord ? spring({ frame: Math.max(0, frame - Math.floor(activeWord.s * fps)), fps, config: { damping: 11, stiffness: 280, mass: 0.5 } }) : 0;
  const mercCold = mercNightT > 0.5;
  const meta: Record<string, { name: string; time: string; hudStat: string; sub: string; border: string; col: string }> = {
    earth:   { name: 'BUMI',      time: '~80 TAHUN', hudStat: 'SUHU: +25°C',  sub: 'AMAN & NYAMAN', border: '#4ade80', col: '#4ade80' },
    mercury: { name: 'MERKURIUS', time: '~2 DETIK',  hudStat: mercCold ? 'SUHU: -180°C' : 'SUHU: +400°C', sub: mercCold ? 'MALAM: -180°C!' : 'SIANG: +400°C!', border: mercCold ? '#38bdf8' : '#fb923c', col: mercCold ? '#38bdf8' : '#fde047' },
    venus:   { name: 'VENUS',     time: '< 1 DETIK', hudStat: 'SUHU: +465°C', sub: 'TEKANAN 92x BUMI', border: '#eab308', col: '#f87171' },
    mars:    { name: 'MARS',      time: '~2 MENIT',  hudStat: 'SUHU: -60°C',  sub: 'TANPA OKSIGEN', border: '#f97316', col: '#38bdf8' },
    jupiter: { name: 'JUPITER',   time: '< 1 DETIK', hudStat: 'NO DARATAN!',  sub: 'BADAI RAKSASA', border: '#ef4444', col: '#f87171' },
    back:    { name: 'BUMI',      time: 'SELAMAT!',  hudStat: 'SUHU: +25°C',  sub: 'PALING NYAMAN', border: '#4ade80', col: '#4ade80' },
  };
  const cur = meta[stage];
  const shake = stage === 'venus' || stage === 'jupiter' ? Math.sin(frame * 2.4) * 3.2 : 0;
  const crushT = stage === 'venus' ? interpolate(localF, [12, 95], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const blueT = stage === 'mars' ? interpolate(localF, [18, 105], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const udinMode: UdinMode = stage === 'earth' ? 'normal' : stage === 'mercury' ? (mercCold ? 'mercCold' : 'mercHot') : stage === 'venus' ? 'crush' : stage === 'mars' ? 'mars' : stage === 'jupiter' ? 'fall' : 'relief';
  const udinY = stage === 'jupiter' ? 168 + Math.sin(frame * 0.22) * 18 : 244;
  const portStart = Math.min(tPortal, tMerc - 34);
  const isPortal = (frame >= portStart && frame < tMerc + 12) || Math.abs(frame - tVenus) < 11 || Math.abs(frame - tMars) < 11 || Math.abs(frame - tJup) < 11 || Math.abs(frame - tBack) < 12;
  const warpScale = frame >= tMerc - 14 && frame < tMerc ? interpolate(frame, [tMerc - 14, tMerc], [1, 0.18], { extrapolateRight: 'clamp' }) : 1;
  const introAlpha = stage === 'earth' ? interpolate(frame, [0, 10, portStart - 6, portStart + 4], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a', overflow: 'hidden', transform: `translate(${shake}px, ${-shake * 0.5}px)` }}>
      <Audio src={staticFile('vo_planet_surv.mp3')} volume={1} />
      <Audio src={staticFile('bgm_planet_surv.wav')} volume={0.21} />
      {[portStart, tVenus - 8, tMars - 8, tJup - 8, tBack - 8].map((pf) => <Sequence key={`p-${pf}`} from={Math.max(0, pf)} durationInFrames={20}><Audio src={staticFile('sfx_ps_portal.wav')} volume={0.26} /></Sequence>)}
      <Sequence from={tMerc + 8} durationInFrames={28}><Audio src={staticFile('sfx_ps_sizzle.wav')} volume={0.34} /></Sequence>
      <Sequence from={tVenus + 8} durationInFrames={30}><Audio src={staticFile('sfx_ps_crush.wav')} volume={0.38} /></Sequence>
      <Sequence from={tMars + 6} durationInFrames={36}><Audio src={staticFile('sfx_ps_wind.wav')} volume={0.32} /></Sequence>
      <Sequence from={tJup + 6} durationInFrames={36}><Audio src={staticFile('sfx_ps_storm.wav')} volume={0.38} /></Sequence>
      <Sequence from={cutStart} durationInFrames={30}><Audio src={whoosh} volume={0.36} /></Sequence>
      <Sequence from={cutEnd - 4} durationInFrames={30}><Audio src={whoosh} volume={0.32} /></Sequence>
      <Sequence from={cliffFrame} durationInFrames={50}><Audio src={ding} volume={0.45} /></Sequence>
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
          <PlanetStageBg stage={stage} frame={frame} localF={localF} mercNightT={mercNightT} />
          {isPortal && <g transform={`translate(135, ${udinY - 4}) rotate(${frame * 9}) scale(${0.85 + Math.sin(frame * 0.5) * 0.14})`}><rect x="-22" y="-22" width="44" height="44" fill="#9333ea" stroke="#0f172a" strokeWidth="2" opacity="0.9" /><rect x="-14" y="-14" width="28" height="28" fill="#d946ef" stroke="#0f172a" strokeWidth="1.5" /><rect x="-6" y="-6" width="12" height="12" fill="#ffffff" /></g>}
          <Udin2D x={135} y={udinY} mode={udinMode} frame={frame} crushT={crushT} blueT={blueT} warpScale={warpScale} />
          {stage === 'mars' && blueT > 0.35 && <rect x="0" y="0" width="270" height="330" fill="none" stroke="#bae6fd" strokeWidth="14" opacity={(blueT - 0.35) * 0.75} />}
        </svg>
        {introAlpha > 0.02 && (
          <div style={{ position: 'absolute', top: 34, left: 24, right: 24, textAlign: 'center', opacity: introAlpha, zIndex: 30 }}>
            <div style={{ fontFamily, fontSize: 28, lineHeight: 1.45, color: '#fde047', textShadow: '5px 5px 0 #0f172a, -3px -3px 0 #0f172a, 3px -3px 0 #0f172a, -3px 3px 0 #0f172a' }}>BERAPA LAMA TAHAN<br />DI PLANET LAIN?</div>
            <div style={{ display: 'inline-block', marginTop: 14, padding: '8px 16px', borderRadius: 12, backgroundColor: 'rgba(15,23,42,0.88)', border: '3px solid #f87171', fontFamily, fontSize: 13, color: '#ffffff' }}>TANPA BAJU ASTRONOT!</div>
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
      {showCut && <AbsoluteFill style={{ backgroundColor: 'rgba(15, 23, 42, 0.58)', opacity: cutAlpha, zIndex: 35 }} />}
      {showCut && <AbsoluteFill style={{ transform: `scale(${0.88 + cutIn * 0.12})`, opacity: cutAlpha, zIndex: 38 }}><CloseUpUdinPlanet frame={frame} localFrame={frame - cutStart} /></AbsoluteFill>}
      <div style={{ position: 'absolute', top: 68, left: '50%', transform: 'translateX(-50%)', padding: '5px 18px', borderRadius: 20, backgroundColor: 'rgba(15, 23, 42, 0.85)', border: '2px solid rgba(250, 204, 21, 0.65)', fontFamily: 'sans-serif', fontSize: 21, fontWeight: 'bold', color: '#f8fafc', zIndex: 45 }}>@dysesat</div>
      <div style={{ position: 'absolute', top: 114, left: 60, right: 60, textAlign: 'center', zIndex: 45 }}><div style={{ display: 'inline-block', backgroundColor: 'rgba(15, 23, 42, 0.94)', border: '3px solid #facc15', borderRadius: 14, padding: '9px 18px', fontFamily, fontSize: 15, color: '#fde047', textShadow: '2px 2px 0 #0f172a' }}>BERTAHAN HIDUP DI PLANET LAIN!</div></div>
      <div style={{ position: 'absolute', top: 170, left: 65, right: 65, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 45 }}>
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.94)', border: `3px solid ${cur.border}`, borderRadius: 14, padding: '9px 15px', fontFamily, fontSize: 13, color: '#ffffff' }}>PLANET: <span style={{ color: cur.col }}>{cur.name}</span></div>
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.94)', border: `3px solid ${cur.border}`, borderRadius: 14, padding: '9px 15px', fontFamily, fontSize: 13, color: cur.col }}>{cur.hudStat}</div>
      </div>
      {activeWord && !showCliff && <div style={{ position: 'absolute', top: 1435, left: 70, right: 70, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 55, pointerEvents: 'none' }}><div style={{ fontFamily, fontSize: activeWord.w.length > 10 ? 32 : 40, color: getWordColor(activeWord.w), textAlign: 'center', padding: '12px 24px', borderRadius: 16, backgroundColor: 'rgba(15, 23, 42, 0.84)', border: `3px solid ${getWordColor(activeWord.w)}`, textShadow: '4px 4px 0 #0f172a, -3px -3px 0 #0f172a, 3px -3px 0 #0f172a, -3px 3px 0 #0f172a', transform: `scale(${0.65 + wordPop * 0.35}) rotate(${activeIdx % 2 === 0 ? -2 : 2}deg)` }}>{activeWord.w.toUpperCase()}</div></div>}
      {showCliff && <div style={{ position: 'absolute', top: 1435, left: 65, right: 65, backgroundColor: 'rgba(15, 23, 42, 0.96)', border: '4px solid #facc15', borderRadius: 16, padding: '16px 20px', textAlign: 'center', fontFamily, fontSize: 16, lineHeight: 1.5, color: '#facc15', boxShadow: '0 10px 28px rgba(0,0,0,0.65)', transform: `scale(${cliffIn * (1 + Math.sin(frame * 0.22) * 0.025)})`, zIndex: 55 }}>WAJIB PINDAH PLANET, PILIH MANA?<br /><span style={{ color: '#38bdf8', fontSize: 15 }}>TULIS DI KOMENTAR!</span></div>}
    </AbsoluteFill>
  );
};
