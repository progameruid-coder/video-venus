import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PressStart2P';
import { whoosh, ding } from '@remotion/sfx';
import { WORD_SUBS_EP4 } from './wbEp4Words';
import { CloseUpBattle, CloseUpFinaleSplit } from './WorldBoxEp4Cutscenes';

const { fontFamily } = loadFont();

type TileCell = { x: number; y: number; t: number; v: number };
const ISLAND_CELLS: TileCell[] = [];
const GRASS_SPOTS: { x: number; y: number }[] = [];
for (let gy = 0; gy < 26; gy++) {
  for (let gx = 0; gx < 44; gx++) {
    const nx = (gx - 21.5) / 18.2, ny = (gy - 12.5) / 10.2, ang = Math.atan2(ny, nx);
    const wave = 0.13 * Math.sin(ang * 3 + 0.8) + 0.08 * Math.cos(ang * 5 - 0.5) + 0.04 * Math.sin(gx * 0.6 + gy * 0.4);
    const d = Math.sqrt(nx * nx + ny * ny) + wave;
    const t = d <= 0.62 ? 4 : d <= 0.82 ? 3 : d <= 0.93 ? 2 : d <= 1.05 ? 1 : 0;
    if (t > 0) {
      ISLAND_CELLS.push({ x: gx * 10, y: gy * 10, t, v: random(`tv4-${gx}-${gy}`) });
      if ((t === 3 || t === 4) && gx > 6 && gx < 37 && gy > 4 && gy < 21) GRASS_SPOTS.push({ x: gx * 10 + 5, y: gy * 10 + 5 });
    }
  }
}
const SMART_TREES = Array.from({ length: 34 }, (_, i) => {
  const p = GRASS_SPOTS[Math.floor(random(`tr-idx-${i}`) * GRASS_SPOTS.length)];
  return { x: p.x, y: p.y, alive: !(p.x > 100 && p.x < 348 && p.y > 58 && p.y < 198), size: 0.9 + random(`ts-${i}`) * 0.25 };
}).filter((tr) => tr.alive).sort((a, b) => a.y - b.y);
const SMART_HOUSES = [[128, 86], [172, 86], [216, 86], [128, 134], [128, 178], [172, 178], [216, 178]];
const Ep4Icon: React.FC<{ type: 'dragon' | 'cannon' | 'trophy' | 'fire' | 'panic' | 'gold'; size?: number }> = ({ type, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" shapeRendering="crispEdges">
    {type === 'dragon' && <><rect x="2" y="3" width="7" height="6" fill="#dc2626" /><rect x="8" y="5" width="3" height="3" fill="#b91c1c" /><rect x="5" y="4" width="2" height="2" fill="#fde047" /></>}
    {type === 'cannon' && <><rect x="2" y="4" width="8" height="4" fill="#334155" /><rect x="3" y="8" width="6" height="3" fill="#78350f" /><rect x="9" y="5" width="2" height="2" fill="#f97316" /></>}
    {type === 'trophy' && <><rect x="3" y="2" width="6" height="4" fill="#facc15" /><rect x="5" y="6" width="2" height="2" fill="#eab308" /><rect x="3" y="8" width="6" height="2" fill="#ca8a04" /></>}
    {type === 'fire' && <><rect x="3" y="5" width="6" height="6" fill="#ef4444" /><rect x="4" y="2" width="4" height="5" fill="#f97316" /><rect x="5" y="6" width="2" height="4" fill="#fde047" /></>}
    {type === 'panic' && <><rect x="5" y="1" width="2" height="6" fill="#dc2626" /><rect x="5" y="9" width="2" height="2" fill="#dc2626" /></>}
    {type === 'gold' && <><rect x="2" y="5" width="8" height="4" fill="#ca8a04" /><rect x="3" y="4" width="6" height="3" fill="#facc15" /></>}
  </svg>
);

const SvgHouse4: React.FC<{ x: number; y: number; roof: string; stone?: boolean; tilted?: boolean; scale?: number; goldTrim?: boolean }> = ({ x, y, roof, stone = true, tilted = false, scale = 1, goldTrim = false }) => (
  <g transform={`translate(${x}, ${y}) rotate(${tilted ? 11 : 0}) scale(${scale})`}>
    <rect x="-11" y="-11" width="22" height="14" fill="#0f172a" /><rect x="-10" y="-10" width="20" height="12" fill={stone ? '#cbd5e1' : '#d97706'} />
    <rect x="-3" y="-4" width="6" height="6" fill="#451a03" /><rect x="4" y="-7" width="4" height="4" fill="#fef08a" />
    <rect x="-14" y="-16" width="28" height="7" fill="#0f172a" /><rect x="-13" y="-15" width="26" height="5" fill={roof} /><rect x="-10" y="-19" width="20" height="4" fill={roof} />
    {goldTrim && <rect x="-10" y="-20" width="20" height="2" fill="#facc15" />}
  </g>
);

const SvgWindmill4: React.FC<{ x: number; y: number; frame: number }> = ({ x, y, frame }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect x="-9" y="-14" width="18" height="17" fill="#cbd5e1" stroke="#0f172a" strokeWidth="1.5" />
    <rect x="-3" y="-4" width="6" height="7" fill="#451a03" /><polygon points="-11,-14 0,-23 11,-14" fill="#2563eb" stroke="#0f172a" strokeWidth="1.5" />
    <g transform={`translate(0, -13) rotate(${(frame * 2.4) % 360})`}><rect x="-14" y="-1.5" width="28" height="3" fill="#78350f" /><rect x="-1.5" y="-14" width="3" height="28" fill="#78350f" /><rect x="4" y="-4" width="9" height="3" fill="#f8fafc" /><rect x="-13" y="1" width="9" height="3" fill="#f8fafc" /></g>
  </g>
);

const SvgLighthouse: React.FC<{ x: number; y: number; scale: number; frame: number }> = ({ x, y, scale, frame }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    <polygon points="0,-32 34,-44 34,-20" fill="#fef08a" opacity={0.28 + Math.sin(frame * 0.25) * 0.14} />
    <rect x="-7" y="-28" width="14" height="30" fill="#f8fafc" stroke="#0f172a" strokeWidth="1.5" />
    <rect x="-7" y="-20" width="14" height="6" fill="#2563eb" /><rect x="-7" y="-8" width="14" height="6" fill="#2563eb" />
    <rect x="-6" y="-34" width="12" height="7" fill="#fde047" stroke="#0f172a" strokeWidth="1.4" />
    <polygon points="-8,-34 0,-41 8,-34" fill="#dc2626" stroke="#0f172a" strokeWidth="1.4" />
  </g>
);
const SvgCastle4: React.FC<{ x: number; y: number; frame: number }> = ({ x, y, frame }) => (
  <g transform={`translate(${x}, ${y}) scale(1.12)`}>
    <ellipse cx="0" cy="-14" rx="30" ry="22" fill="#fde047" opacity={0.2 + Math.sin(frame * 0.3) * 0.08} />
    <rect x="-22" y="-22" width="44" height="27" fill="#0f172a" /><rect x="-20" y="-20" width="40" height="23" fill="#facc15" />
    <rect x="-24" y="-32" width="12" height="35" fill="#eab308" stroke="#0f172a" strokeWidth="1.5" />
    <rect x="12" y="-32" width="12" height="35" fill="#eab308" stroke="#0f172a" strokeWidth="1.5" />
    <rect x="-10" y="-36" width="20" height="20" fill="#fef08a" stroke="#0f172a" strokeWidth="1.5" /><rect x="-6" y="-8" width="12" height="11" fill="#451a03" />
    <rect x="-1" y="-46" width="2" height="11" fill="#0f172a" /><rect x="1" y="-46" width={11 + Math.sin(frame * 0.3) * 1.5} height="6" fill="#2563eb" />
  </g>
);

const SvgCannon4: React.FC<{ x: number; y: number; frame: number; offset: number; fireUp: boolean; tx?: number; ty?: number }> = ({ x, y, frame, offset, fireUp, tx = x, ty = y - 90 }) => {
  const p = (frame + offset) % 24;
  const dx = tx - x, dy = ty - y, t = Math.min(1, p / 16);
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-10" y="-12" width="20" height="16" fill="#64748b" stroke="#0f172a" strokeWidth="1.5" />
      <rect x="-7" y="-16" width="14" height="6" fill="#1e293b" /><rect x="-3" y="-20" width="6" height="11" fill="#0f172a" />
      {fireUp && (
        <g>
          {p < 6 && <rect x="-6" y="-26" width="12" height="8" fill="#fde047" opacity={1 - p / 6} />}
          {p < 17 && <rect x={dx * t - 3} y={-18 + (dy + 18) * t - 3} width="6" height="6" fill="#0f172a" stroke="#f97316" strokeWidth="1.2" />}
          {p >= 16 && p < 22 && <rect x={dx - 6} y={dy - 6} width="12" height="12" fill="#fde047" opacity={1 - (p - 16) / 6} />}
        </g>
      )}
    </g>
  );
};

const SvgWarship4: React.FC<{ x: number; y: number; frame: number; flip?: boolean }> = ({ x, y, frame, flip = false }) => (
  <g transform={`translate(${x}, ${y + Math.sin(frame * 0.16) * 2}) scale(${flip ? -1.08 : 1.08}, 1.08)`}>
    <rect x="-24" y="6" width="46" height="3.5" fill="#bae6fd" opacity="0.7" />
    <polygon points="-22,-2 24,-2 17,7 -17,7" fill="#451a03" stroke="#0f172a" strokeWidth="1.4" />
    <rect x="-19" y="-3" width="38" height="5" fill="#92400e" /><rect x="-20" y="-9" width="11" height="7" fill="#78350f" stroke="#0f172a" strokeWidth="1.2" />
    <polygon points="18,-3 30,-8 28,-5 18,0" fill="#78350f" stroke="#0f172a" strokeWidth="1" />
    <rect x="-2" y="-30" width="3" height="27" fill="#451a03" />
    <polygon points="1,-27 16,-23 18,-11 1,-10" fill="#2563eb" stroke="#0f172a" strokeWidth="1.4" /><rect x="6" y="-21" width="5" height="5" fill="#fde047" />
    <polygon points="15,-22 26,-7 15,-8" fill="#f8fafc" stroke="#0f172a" strokeWidth="1.1" />
    <rect x="-2" y="-33" width={9 + Math.sin(frame * 0.35) * 2} height="4" fill="#38bdf8" stroke="#0f172a" strokeWidth="0.8" />
  </g>
);

const SvgDragonMap4: React.FC<{ x: number; y: number; frame: number; flip?: boolean }> = ({ x, y, frame, flip = false }) => {
  const fl = Math.sin(frame * 0.48) * 8;
  return (
    <g transform={`translate(${x}, ${y}) scale(${flip ? -1.35 : 1.35}, 1.35)`}>
      <ellipse cx="0" cy="24" rx="22" ry="7" fill="rgba(15,23,42,0.45)" />
      <polygon points={`-4,-4 -26,${-18 + fl} -22,${2 + fl} -8,6`} fill="#991b1b" stroke="#0f172a" strokeWidth="1.5" />
      <polygon points={`-4,6 -22,${20 - fl} -16,${8 - fl} -2,10`} fill="#7f1d1d" stroke="#0f172a" strokeWidth="1.5" />
      <rect x="-12" y="-7" width="22" height="14" fill="#dc2626" stroke="#0f172a" strokeWidth="1.5" /><rect x="-6" y="-9" width="12" height="3" fill="#facc15" />
      <rect x="8" y="-9" width="15" height="12" fill="#dc2626" stroke="#0f172a" strokeWidth="1.5" /><rect x="10" y="-13" width="4" height="5" fill="#facc15" /><rect x="16" y="-7" width="4" height="4" fill="#fde047" />
      <rect x="22" y="-6" width={16 + Math.sin(frame * 0.8) * 4} height="8" fill="#f97316" /><rect x="22" y="-4" width="10" height="4" fill="#fde047" />
    </g>
  );
};
const SvgCitizen4: React.FC<{ x: number; y: number; shirt: string; step: number; flip?: boolean; isLeader?: boolean; bubble?: 'dragon' | 'cannon' | 'trophy' | 'fire' | 'panic' | 'gold' }> = ({ x, y, shirt, step, flip = false, isLeader = false, bubble }) => {
  const s = Math.sin(step);
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="2" rx="4.5" ry="1.8" fill="rgba(15,23,42,0.35)" />
      <g transform={`translate(0, ${-Math.abs(s) * 2.4}) scale(${flip ? -1 : 1}, 1)`}>
        <rect x="-3" y={s > 0 ? -3 : -1} width="2" height="3" fill="#0f172a" /><rect x="1" y={s < 0 ? -3 : -1} width="2" height="3" fill="#0f172a" />
        <rect x="-4.5" y="-9.5" width="9" height="7.5" fill="#0f172a" /><rect x="-3.5" y="-8.5" width="7" height="6" fill={shirt} />
        <rect x="-3.5" y="-14.5" width="7" height="6" fill="#0f172a" /><rect x="-2.8" y="-13.8" width="5.6" height="4.8" fill="#fed7aa" />
        <rect x="-3" y="-15" width="6" height="2" fill="#451a03" />
        {isLeader && <><rect x="-4" y="-18" width="8" height="3" fill="#facc15" /><rect x="-1" y="-21" width="2" height="3" fill="#fde047" /></>}
      </g>
      {bubble && <g transform="translate(4, -30)"><rect x="0" y="0" width="14" height="13" rx="2" fill="#fff" stroke="#0f172a" strokeWidth="1.2" /><g transform="translate(2, 1.5)"><Ep4Icon type={bubble} size={10} /></g></g>}
    </g>
  );
};

const SvgFwBurst: React.FC<{ x: number; y: number; frame: number; color: string }> = ({ x, y, frame, color }) => {
  const p = (frame % 32) / 32;
  return (
    <g transform={`translate(${x}, ${y})`} opacity={1 - p}>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => {
        const a = (k / 8) * Math.PI * 2;
        return <rect key={k} x={Math.cos(a) * p * 22 - 2} y={Math.sin(a) * p * 22 - 2} width="4" height="4" fill={k % 2 === 0 ? color : '#ffffff'} />;
      })}
    </g>
  );
};

const SMART_PATHS = [[[126, 113], [248, 113], [248, 160], [160, 113]], [[220, 198], [220, 155], [176, 155], [220, 198]], [[126, 156], [248, 156], [248, 86], [172, 113]]];
const SMART_CITIZENS = Array.from({ length: 26 }, (_, i) => ({ id: i, pathIdx: i % 3, offset: (i * 0.17) % 1, speed: 0.0024 + random(`s4-${i}`) * 0.0012, jx: (random(`s4x-${i}`) - 0.5) * 9, jy: (random(`s4y-${i}`) - 0.5) * 9 }));
const DUMB_CITIZENS = Array.from({ length: 12 }, (_, i) => ({ id: i, ax: 120 + random(`d4a-${i}`) * 200, ay: 82 + random(`d4ay-${i}`) * 102, bx: 120 + random(`d4b-${i}`) * 200, by: 82 + random(`d4by-${i}`) * 102, offset: (i * 0.21) % 1, speed: 0.006 + random(`d4s-${i}`) * 0.004 }));

function walkP(pts: number[][], t: number) {
  const segs = pts.length - 1, s = (((t % 1) + 1) % 1) * segs, i = Math.floor(s), f = s - i;
  const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
  return { x: x1 + (x2 - x1) * f, y: y1 + (y2 - y1) * f, flip: x2 < x1 };
}

const getWordColor = (word: string) => {
  const c = word.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (['pintar', 'bima', 'meriam', 'menang', 'telak', 'megah', 'kerajaan', 'tiga', 'ratus', 'sepuluh'].includes(c)) return '#38bdf8';
  if (['bodoh', 'udin', 'naga', 'api', 'mengamuk', 'menyerang', 'menghancurkan', 'dua', 'belas'].includes(c)) return '#f87171';
  if (['emas', 'kastil', 'patung', 'selamat', 'lima', 'puluh', 'terakhir', 'selesai'].includes(c)) return '#fde047';
  return '#ffffff';
};
export const WorldBoxEp4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sec = frame / fps;

  const year = Math.min(50, Math.floor(interpolate(frame, [0, 265, 595, 655], [39, 42, 46, 50.9], { extrapolateRight: 'clamp' })));
  const smartPop = frame < 270 ? 248 : frame < 410 ? Math.floor(interpolate(frame, [270, 405], [248, 215], { extrapolateRight: 'clamp' })) : Math.floor(interpolate(frame, [595, 690], [215, 310], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const dumbPop = frame < 235 ? Math.floor(interpolate(frame, [0, 230], [51, 18], { extrapolateRight: 'clamp' })) : Math.floor(interpolate(frame, [235, 750], [18, 12], { extrapolateRight: 'clamp' }));

  const dragonOnDumb = frame < 268;
  const dragonOnSmart = frame >= 270 && frame < 408;
  const celebration = frame >= 615;
  const quake = (frame < 120 || dragonOnSmart) ? Math.sin(frame * 2.1) * 2.5 : 0;

  const showBattleCut = frame >= 405 && frame <= 615;
  const showSplitCut = frame >= 785 && frame <= 1005;
  const showWinner = frame >= 1020;
  const cutActive = showBattleCut || showSplitCut;
  const battlePop = showBattleCut ? spring({ frame: frame - 405, fps, config: { damping: 12 } }) : 0;
  const splitPop = showSplitCut ? spring({ frame: frame - 785, fps, config: { damping: 12 } }) : 0;
  const winPop = showWinner ? spring({ frame: frame - 1020, fps, config: { damping: 11 } }) : 0;

  const lastEnd = WORD_SUBS_EP4.length > 0 ? WORD_SUBS_EP4[WORD_SUBS_EP4.length - 1].e : 36.2;
  const cliffFrame = Math.min(1110, Math.ceil((lastEnd + 0.12) * fps));
  const showCliff = frame >= cliffFrame;
  const cliffIn = showCliff ? spring({ frame: frame - cliffFrame, fps, config: { damping: 10 } }) : 0;
  const activeIdx = WORD_SUBS_EP4.findIndex((x) => sec >= x.s && sec < x.e);
  const activeWord = activeIdx >= 0 ? WORD_SUBS_EP4[activeIdx] : null;
  const wordPop = activeWord ? spring({ frame: Math.max(0, frame - Math.floor(activeWord.s * fps)), fps, config: { damping: 11, stiffness: 280, mass: 0.5 } }) : 0;
  const shoreWave = Math.sin(frame * 0.14) * 0.22 + 0.78;

  const renderTiles = (isDumb: boolean) => (
    <g>
      {ISLAND_CELLS.map((c, idx) => {
        let fill = '#38bdf8', op = 1;
        if (c.t === 1) { fill = c.v > 0.72 ? '#7dd3fc' : '#38bdf8'; op = shoreWave; }
        else if (c.t === 2) fill = c.v > 0.8 ? '#fef08a' : '#fde047';
        else if (c.t === 3) fill = isDumb ? (c.v > 0.7 ? '#57534e' : '#44403c') : (c.v > 0.78 ? '#86efac' : '#4ade80');
        else if (c.t === 4) fill = isDumb ? (c.v > 0.7 ? '#44403c' : '#292524') : (c.v > 0.78 ? '#16a34a' : '#22c55e');
        return <rect key={idx} x={c.x} y={c.y} width="10.4" height="10.4" fill={fill} opacity={op} />;
      })}
      <rect x="82" y="68" width="28" height="20" fill="#475569" /><rect x="88" y="62" width="18" height="12" fill="#94a3b8" />
      {!isDumb && <><rect x="90" y="74" width="12" height="14" fill="#0f172a" /><rect x="122" y="109" width="148" height="9" fill="#94a3b8" opacity="0.88" /><rect x="246" y="80" width="9" height="104" fill="#94a3b8" opacity="0.88" /></>}
    </g>
  );
  return (
    <AbsoluteFill style={{ backgroundColor: '#1d4ed8', overflow: 'hidden', transform: `translate(${quake}px, ${-quake * 0.5}px)` }}>
      <Audio src={staticFile('vo_wb_ep4.mp3')} volume={1} />
      <Audio src={staticFile('bgm_wb_ep4.wav')} volume={0.23} />
      <Sequence from={10} durationInFrames={135}><Audio src={staticFile('sfx_wb4_roar.wav')} volume={0.18} /></Sequence>
      <Sequence from={275} durationInFrames={130}><Audio src={staticFile('sfx_wb4_roar.wav')} volume={0.18} /></Sequence>
      {[300, 345, 435, 480, 520].map((fr) => <Sequence key={`cn-${fr}`} from={fr} durationInFrames={16}><Audio src={staticFile('sfx_wb4_cannon.wav')} volume={0.28} /></Sequence>)}
      <Sequence from={405} durationInFrames={35}><Audio src={whoosh} volume={0.4} /></Sequence>
      <Sequence from={562} durationInFrames={36}><Audio src={staticFile('sfx_wb4_boom.wav')} volume={0.34} /></Sequence>
      <Sequence from={610} durationInFrames={35}><Audio src={whoosh} volume={0.35} /></Sequence>
      {[650, 710, 820, 900, 1055].map((fr) => <Sequence key={`fw-${fr}`} from={fr} durationInFrames={18}><Audio src={staticFile('sfx_wb4_fw.wav')} volume={0.24} /></Sequence>)}
      <Sequence from={785} durationInFrames={35}><Audio src={whoosh} volume={0.4} /></Sequence>
      <Sequence from={1020} durationInFrames={40}><Audio src={staticFile('sfx_wb4_win.wav')} volume={0.38} /></Sequence>
      <Sequence from={cliffFrame} durationInFrames={50}><Audio src={ding} volume={0.45} /></Sequence>

      <AbsoluteFill style={{ backgroundImage: 'radial-gradient(#38bdf8 4px, transparent 4px)', backgroundSize: '46px 46px', backgroundPosition: `${(frame * 0.8) % 46}px ${(frame * 0.35) % 46}px`, opacity: 0.38 }} />

      {/* === PULAU ATAS: PULAU PINTAR === */}
      <div style={{ position: 'absolute', top: 205, left: 75, width: 930, height: 520 }}>
        <svg width="100%" height="100%" viewBox="0 0 440 260" shapeRendering="crispEdges">
          {renderTiles(false)}
          <rect x="270" y="96" width="68" height="72" fill="#92400e" />
          {[0, 1, 2, 3].map((r) => [0, 1, 2, 3].map((c) => <rect key={`${r}-${c}`} x={275 + c * 15} y={101 + r * 16} width="10" height="10" fill="#fde047" />))}
          <SvgWindmill4 x={298} y={82} frame={frame} />
          <g><rect x="102" y="58" width="244" height="6" fill="#94a3b8" stroke="#0f172a" strokeWidth="1" /><rect x="102" y="194" width="104" height="6" fill="#94a3b8" stroke="#0f172a" strokeWidth="1" /><rect x="238" y="194" width="108" height="6" fill="#94a3b8" stroke="#0f172a" strokeWidth="1" /><rect x="102" y="58" width="6" height="142" fill="#94a3b8" stroke="#0f172a" strokeWidth="1" /><rect x="340" y="58" width="6" height="142" fill="#94a3b8" stroke="#0f172a" strokeWidth="1" /></g>
          {SMART_TREES.map((tr, i) => <g key={i} transform={`translate(${tr.x}, ${tr.y}) scale(${tr.size})`}><rect x="-2" y="-5" width="4" height="7" fill="#78350f" /><rect x="-8" y="-13" width="16" height="9" fill="#166534" /><rect x="-6" y="-18" width="12" height="7" fill="#15803d" /><rect x="-4" y="-21" width="8" height="4" fill="#22c55e" /></g>)}
          {SMART_HOUSES.map(([hx, hy], idx) => <SvgHouse4 key={idx} x={hx} y={hy} roof="#2563eb" goldTrim />)}
          <SvgHouse4 x={220} y={134} roof="#475569" />
          <SvgCastle4 x={176} y={136} frame={frame} />
          {celebration && <SvgLighthouse x={356} y={178} scale={spring({ frame: frame - 615, fps, config: { damping: 10 } })} frame={frame} />}
          <SvgCannon4 x={152} y={208} frame={frame} offset={0} fireUp={dragonOnSmart} tx={interpolate(frame, [270, 340, 405], [220, 175, 215])} ty={interpolate(frame, [270, 320, 405], [220, 115, 102])} />
          <SvgCannon4 x={302} y={208} frame={frame} offset={12} fireUp={dragonOnSmart} tx={interpolate(frame, [270, 340, 405], [220, 175, 215])} ty={interpolate(frame, [270, 320, 405], [220, 115, 102])} />
          <rect x="210" y="198" width="24" height="24" fill="#78350f" stroke="#0f172a" strokeWidth="1.5" />
          <SvgWarship4 x={268} y={226} frame={frame} flip />
          {celebration && <SvgWarship4 x={112} y={224} frame={frame + 14} />}
          {dragonOnSmart && [[146, 128], [202, 118]].map(([fx, fy], i) => <g key={i} transform={`translate(${fx}, ${fy})`}><rect x="-6" y="-8" width="12" height="9" fill="#ef4444" /><rect x="-4" y="-11" width="8" height="8" fill="#f97316" /><rect x="-2" y="-7" width="4" height="5" fill="#fde047" /></g>)}
          {SMART_CITIZENS.map((c) => { const p = walkP(SMART_PATHS[c.pathIdx], c.offset + frame * c.speed); return <SvgCitizen4 key={c.id} x={p.x + c.jx} y={p.y + c.jy} shirt="#2563eb" step={frame * 0.38 + c.id} flip={p.flip} bubble={dragonOnSmart && c.id % 6 === 0 ? 'cannon' : celebration && c.id % 7 === 0 ? 'trophy' : undefined} />; })}
          {(() => { const bp = walkP([[192, 113], [248, 113], [248, 152], [192, 152]], frame * 0.003); return <SvgCitizen4 x={bp.x} y={bp.y} shirt="#1e40af" step={frame * 0.3} flip={bp.flip} isLeader bubble={celebration ? 'trophy' : 'cannon'} />; })()}
          {dragonOnSmart && <SvgDragonMap4 x={interpolate(frame, [270, 340, 405], [220, 175, 215])} y={interpolate(frame, [270, 320, 405], [250, 115, 102])} frame={frame} flip={frame > 340} />}
          {celebration && <><SvgFwBurst x={76} y={44} frame={frame} color="#fde047" /><SvgFwBurst x={364} y={42} frame={frame + 16} color="#38bdf8" /><SvgFwBurst x={386} y={118} frame={frame + 8} color="#f472b6" /></>}
        </svg>
      </div>
      {!cutActive && !showWinner && <div style={{ position: 'absolute', top: 726, left: '50%', transform: 'translateX(-50%)', backgroundColor: '#0f172a', border: '3px solid #38bdf8', borderRadius: 12, padding: '6px 18px', fontFamily, fontSize: 15, color: '#38bdf8', zIndex: 25 }}>PULAU PINTAR</div>}
      <div style={{ position: 'absolute', top: 798, left: 0, right: 0, height: 10, opacity: cutActive || showWinner ? 0 : 1, backgroundColor: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 25 }}>
        <div style={{ backgroundColor: '#1e293b', border: '4px solid #facc15', borderRadius: 14, padding: '6px 20px', fontFamily, fontSize: 22, color: '#facc15', boxShadow: '0 4px 0 #0f172a' }}>VS</div>
      </div>

      {/* === PULAU BAWAH: PULAU BODOH === */}
      <div style={{ position: 'absolute', top: 850, left: 75, width: 930, height: 520 }}>
        <svg width="100%" height="100%" viewBox="0 0 440 260" shapeRendering="crispEdges">
          {renderTiles(true)}
          <g transform="translate(96, 80)"><rect x="-15" y="-13" width="30" height="24" fill="#0f172a" /><rect x="-10" y="2" width="20" height="8" fill="#7c2d12" /></g>
          {/* Gubuk Terakhir Hangus di Frame 105 */}
          {frame < 105 ? <SvgHouse4 x={300} y={178} roof="#991b1b" stone={false} tilted scale={0.82} /> : <rect x="288" y="176" width="24" height="6" fill="#1c1917" />}
          {/* Patung Emas Moai Tetap Utuh Berkilau */}
          <g transform="translate(218, 128) scale(1.18)">
            <ellipse cx="0" cy="-16" rx="22" ry="18" fill="#fde047" opacity={0.18 + Math.sin(frame * 0.3) * 0.08} />
            <ellipse cx="0" cy="4" rx="18" ry="6" fill="rgba(15,23,42,0.35)" /><rect x="-16" y="-5" width="32" height="8" fill="#475569" />
            <rect x="-14" y="-35" width="28" height="31" fill="#0f172a" /><rect x="-13" y="-34" width="26" height="29" fill="#ca8a04" />
            <rect x="-10" y="-32" width="9" height="25" fill="#facc15" /><rect x="-10" y="-26" width="20" height="4" fill="#854d0e" />
            {Math.sin(frame * 0.4) > 0 && <rect x="6" y="-30" width="5" height="5" fill="#fef08a" />}
          </g>
          {frame < 280 && [[296, 174], [156, 152], [262, 114]].map(([fx, fy], idx) => <g key={idx} transform={`translate(${fx}, ${fy})`}><rect x="-7" y="-9" width="14" height="10" fill="#ef4444" /><rect x="-5" y="-13" width="10" height="9" fill="#f97316" /><rect x="-2" y="-8" width="4" height="5" fill="#fde047" /></g>)}{[[35, 148, 138], [80, 268, 124], [125, 294, 168], [170, 174, 154], [210, 244, 118]].map(([st, sx, sy], idx) => { const a = frame - st; return a > 0 && a < 34 ? <g key={`sk-${idx}`} transform={`translate(${sx}, ${sy - a * 0.85})`} opacity={1 - a / 34}><rect x="-4" y="-4" width="8" height="6" fill="#f8fafc" /><rect x="-3" y="2" width="6" height="2" fill="#e2e8f0" /><rect x="-3" y="-2" width="2" height="2" fill="#0f172a" /><rect x="1" y="-2" width="2" height="2" fill="#0f172a" /></g> : null; })}
          {DUMB_CITIZENS.map((c) => {
            if (frame >= 260) {
              const ang = (c.id / 12) * Math.PI * 2 + Math.sin(frame * 0.04 + c.id) * 0.3;
              const gx = 218 + Math.cos(ang) * (32 + (c.id % 2) * 10), gy = 136 + Math.sin(ang) * (20 + (c.id % 2) * 8);
              return <SvgCitizen4 key={c.id} x={gx} y={gy} shirt="#dc2626" step={frame * 0.45 + c.id} flip={gx > 218} bubble={c.id % 4 === 0 ? 'gold' : undefined} />;
            }
            const t = (frame * 0.025 + c.offset) % 2, px = t < 1 ? c.ax + (c.bx - c.ax) * t : c.bx + (c.ax - c.bx) * (t - 1), py = t < 1 ? c.ay + (c.by - c.ay) * t : c.by + (c.ay - c.by) * (t - 1);
            return <SvgCitizen4 key={c.id} x={px} y={py} shirt="#dc2626" step={frame * 0.7 + c.id} flip={t >= 1} bubble={c.id % 4 === 0 ? 'panic' : undefined} />;
          })}
          <SvgCitizen4 x={196} y={144} shirt="#991b1b" step={frame * 0.45} isLeader bubble={frame < 260 ? 'panic' : 'gold'} />
          {dragonOnDumb && <SvgDragonMap4 x={interpolate(frame, [0, 145, 268], [135, 285, 220])} y={interpolate(frame, [0, 145, 268], [110, 152, -28])} frame={frame} flip={frame > 145} />}
        </svg>
      </div>
      {!cutActive && !showWinner && <div style={{ position: 'absolute', top: 1370, left: '50%', transform: 'translateX(-50%)', backgroundColor: '#0f172a', border: '3px solid #f87171', borderRadius: 12, padding: '6px 18px', fontFamily, fontSize: 15, color: '#f87171', zIndex: 25 }}>PULAU BODOH • {dumbPop}</div>}
      {!cutActive && !showWinner && dragonOnDumb && <div style={{ position: 'absolute', top: 848, left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(127, 29, 29, 0.95)', border: '3px solid #fb923c', borderRadius: 12, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8, zIndex: 32 }}><Ep4Icon type="dragon" size={18} /><span style={{ fontFamily, fontSize: 12, color: '#fde047' }}>NAGA MENGAMUK!</span></div>}
      {!cutActive && !showWinner && dragonOnSmart && <div style={{ position: 'absolute', top: 204, left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(127, 29, 29, 0.95)', border: '3px solid #fb923c', borderRadius: 12, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8, zIndex: 32 }}><Ep4Icon type="cannon" size={18} /><span style={{ fontFamily, fontSize: 12, color: '#fde047' }}>NAGA MENYERANG!</span></div>}
      {!cutActive && !showWinner && celebration && <div style={{ position: 'absolute', top: 204, left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '3px solid #facc15', borderRadius: 12, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8, zIndex: 32 }}><Ep4Icon type="trophy" size={18} /><span style={{ fontFamily, fontSize: 12, color: '#fde047' }}>NAGA KALAH!</span></div>}

      {cutActive && <AbsoluteFill style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', opacity: Math.min(1, Math.max(battlePop, splitPop)), zIndex: 35 }} />}
      {showBattleCut && <AbsoluteFill style={{ transform: `scale(${battlePop})`, zIndex: 38 }}><CloseUpBattle frame={frame} localFrame={frame - 405} /></AbsoluteFill>}
      {showSplitCut && <AbsoluteFill style={{ transform: `scale(${splitPop})`, zIndex: 38 }}><CloseUpFinaleSplit frame={frame} localFrame={frame - 785} /></AbsoluteFill>}

      {/* PAPAN SKOR PEMENANG SIMULASI 50 TAHUN */}
      {showWinner && (
        <AbsoluteFill style={{ backgroundColor: 'rgba(15, 23, 42, 0.72)', zIndex: 40, justifyContent: 'center', alignItems: 'center' }}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
            const cy = ((frame * 6 + i * 115) % 1350) + 120;
            const cx = 100 + i * 82 + Math.sin(frame * 0.1 + i) * 28;
            return <div key={i} style={{ position: 'absolute', top: cy, left: cx, width: 16, height: 16, backgroundColor: ['#facc15', '#38bdf8', '#f87171', '#4ade80'][i % 4], transform: `rotate(${frame * 5 + i * 30}deg)` }} />;
          })}
          <div style={{ marginTop: -120, width: 880, backgroundColor: '#0f172a', border: '8px solid #facc15', borderRadius: 28, padding: '38px 34px', textAlign: 'center', boxShadow: '0 24px 60px rgba(0,0,0,0.9)', transform: `scale(${winPop})` }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}><svg width="84" height="84" viewBox="0 0 16 16" shapeRendering="crispEdges"><rect x="1" y="3" width="3" height="5" fill="#eab308" /><rect x="2" y="4" width="2" height="3" fill="#0f172a" /><rect x="12" y="3" width="3" height="5" fill="#eab308" /><rect x="12" y="4" width="2" height="3" fill="#0f172a" /><rect x="4" y="2" width="8" height="7" fill="#facc15" /><rect x="5" y="3" width="2" height="4" fill="#fef08a" /><rect x="5" y="9" width="6" height="2" fill="#eab308" /><rect x="7" y="11" width="2" height="2" fill="#ca8a04" /><rect x="4" y="13" width="8" height="2" fill="#ca8a04" /><rect x="13" y="1" width="2" height="2" fill="#ffffff" /></svg></div>
            <div style={{ fontFamily, fontSize: 20, color: '#fde047', letterSpacing: 1 }}>HASIL AKHIR TAHUN KE-50</div>
            <div style={{ fontFamily, fontSize: 34, color: '#38bdf8', marginTop: 22, lineHeight: 1.4, textShadow: '4px 4px 0 #1e3a8a' }}>PEMENANG:<br />PULAU PINTAR!</div>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 32, gap: 20 }}>
              <div style={{ flex: 1, backgroundColor: '#1e293b', border: '4px solid #38bdf8', borderRadius: 16, padding: '18px 12px' }}>
                <div style={{ fontFamily, fontSize: 15, color: '#38bdf8' }}>PULAU PINTAR</div>
                <div style={{ fontFamily, fontSize: 36, color: '#ffffff', marginTop: 14 }}>310</div>
              </div>
              <div style={{ flex: 1, backgroundColor: '#1e293b', border: '4px solid #f87171', borderRadius: 16, padding: '18px 12px' }}>
                <div style={{ fontFamily, fontSize: 15, color: '#f87171' }}>PULAU BODOH</div>
                <div style={{ fontFamily, fontSize: 36, color: '#ffffff', marginTop: 14 }}>12</div>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}
      <div style={{ position: 'absolute', top: 82, left: '50%', transform: 'translateX(-50%)', padding: '6px 18px', borderRadius: 20, backgroundColor: 'rgba(15, 23, 42, 0.82)', border: '2px solid rgba(250, 204, 21, 0.6)', fontFamily: 'sans-serif', fontSize: 22, fontWeight: 'bold', color: '#f8fafc', zIndex: 45 }}>@dysesat</div>
      <div style={{ position: 'absolute', top: 138, left: 85, right: 85, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 45 }}>
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.92)', border: '3px solid #facc15', borderRadius: 14, padding: '10px 16px', fontFamily, fontSize: 17, color: '#facc15' }}>TAHUN: {year}</div>
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.92)', border: '3px solid #38bdf8', borderRadius: 14, padding: '10px 16px', fontFamily, fontSize: 15, color: '#38bdf8' }}>PINTAR: {smartPop}</div>
      </div>

      {activeWord && !showCliff && <div style={{ position: 'absolute', top: 1435, left: 70, right: 70, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 55, pointerEvents: 'none' }}><div style={{ fontFamily, fontSize: activeWord.w.length > 10 ? 32 : 40, color: getWordColor(activeWord.w), textAlign: 'center', padding: '12px 24px', borderRadius: 16, backgroundColor: 'rgba(15, 23, 42, 0.82)', border: `3px solid ${getWordColor(activeWord.w)}`, textShadow: '4px 4px 0 #0f172a, -3px -3px 0 #0f172a, 3px -3px 0 #0f172a, -3px 3px 0 #0f172a', transform: `scale(${0.65 + wordPop * 0.35}) rotate(${activeIdx % 2 === 0 ? -2 : 2}deg)` }}>{activeWord.w.toUpperCase()}</div></div>}

      {showCliff && (
        <div style={{ position: 'absolute', top: 1435, left: 75, right: 75, backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '4px solid #facc15', borderRadius: 16, padding: '16px 20px', textAlign: 'center', fontFamily, fontSize: 19, color: '#facc15', boxShadow: '0 10px 28px rgba(0,0,0,0.6)', transform: `scale(${cliffIn * (1 + Math.sin(frame * 0.22) * 0.025)})`, zIndex: 55, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
          <Ep4Icon type="trophy" size={24} />
          <span>TAMAT • NEXT SIMULASI APA?</span>
        </div>
      )}
    </AbsoluteFill>
  );
};
