import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PressStart2P';
import { whoosh, ding } from '@remotion/sfx';
import { WORD_SUBS_EP3 } from './wbEp3Words';
import { CloseUpBarter, CloseUpDragon } from './WorldBoxEp3Cutscenes';

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
      ISLAND_CELLS.push({ x: gx * 10, y: gy * 10, t, v: random(`tv3-${gx}-${gy}`) });
      if ((t === 3 || t === 4) && gx > 6 && gx < 37 && gy > 4 && gy < 21) GRASS_SPOTS.push({ x: gx * 10 + 5, y: gy * 10 + 5 });
    }
  }
}
const SMART_TREES = Array.from({ length: 34 }, (_, i) => {
  const p = GRASS_SPOTS[Math.floor(random(`tr-idx-${i}`) * GRASS_SPOTS.length)];
  return { x: p.x, y: p.y, alive: !(p.x > 100 && p.x < 348 && p.y > 58 && p.y < 198), size: 0.9 + random(`ts-${i}`) * 0.25 };
}).filter((tr) => tr.alive).sort((a, b) => a.y - b.y);

const SMART_HOUSES = [[128, 86], [172, 86], [216, 86], [128, 134], [128, 178], [172, 178], [216, 178]];
const Ep3Icon: React.FC<{ type: 'ship' | 'gold' | 'bread' | 'cannon' | 'dragon' | 'fire' | 'panic' | 'bulb'; size?: number }> = ({ type, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" shapeRendering="crispEdges">
    {type === 'ship' && <><rect x="2" y="8" width="8" height="3" fill="#78350f" /><rect x="5" y="2" width="2" height="6" fill="#92400e" /><rect x="7" y="2" width="4" height="5" fill="#38bdf8" /></>}
    {type === 'gold' && <><rect x="2" y="5" width="8" height="4" fill="#ca8a04" /><rect x="3" y="4" width="6" height="3" fill="#facc15" /></>}
    {type === 'bread' && <><rect x="2" y="4" width="8" height="5" fill="#d97706" /><rect x="3" y="3" width="6" height="3" fill="#f59e0b" /></>}
    {type === 'cannon' && <><rect x="2" y="4" width="8" height="4" fill="#334155" /><rect x="3" y="8" width="6" height="3" fill="#78350f" /><rect x="9" y="5" width="2" height="2" fill="#f97316" /></>}
    {type === 'dragon' && <><rect x="2" y="3" width="7" height="6" fill="#dc2626" /><rect x="8" y="5" width="3" height="3" fill="#b91c1c" /><rect x="5" y="4" width="2" height="2" fill="#fde047" /></>}
    {type === 'fire' && <><rect x="3" y="5" width="6" height="6" fill="#ef4444" /><rect x="4" y="2" width="4" height="5" fill="#f97316" /><rect x="5" y="6" width="2" height="4" fill="#fde047" /></>}
    {type === 'panic' && <><rect x="5" y="1" width="2" height="6" fill="#dc2626" /><rect x="5" y="9" width="2" height="2" fill="#dc2626" /></>}
    {type === 'bulb' && <><rect x="3" y="1" width="6" height="5" fill="#fde047" /><rect x="4" y="6" width="4" height="3" fill="#64748b" /></>}
  </svg>
);

const SvgHouse3: React.FC<{ x: number; y: number; roof: string; stone?: boolean; tilted?: boolean; scale?: number; goldTrim?: boolean }> = ({ x, y, roof, stone = true, tilted = false, scale = 1, goldTrim = false }) => (
  <g transform={`translate(${x}, ${y}) rotate(${tilted ? 11 : 0}) scale(${scale})`}>
    <rect x="-11" y="-11" width="22" height="14" fill="#0f172a" /><rect x="-10" y="-10" width="20" height="12" fill={stone ? '#cbd5e1' : '#d97706'} />
    <rect x="-3" y="-4" width="6" height="6" fill="#451a03" /><rect x="4" y="-7" width="4" height="4" fill="#fef08a" />
    <rect x="-14" y="-16" width="28" height="7" fill="#0f172a" /><rect x="-13" y="-15" width="26" height="5" fill={roof} /><rect x="-10" y="-19" width="20" height="4" fill={roof} />
    {goldTrim && <rect x="-10" y="-20" width="20" height="2" fill="#facc15" />}
  </g>
);
const SvgWindmill: React.FC<{ x: number; y: number; frame: number }> = ({ x, y, frame }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect x="-9" y="-14" width="18" height="17" fill="#cbd5e1" stroke="#0f172a" strokeWidth="1.5" />
    <rect x="-3" y="-4" width="6" height="7" fill="#451a03" />
    <polygon points="-11,-14 0,-23 11,-14" fill="#2563eb" stroke="#0f172a" strokeWidth="1.5" />
    <g transform={`translate(0, -13) rotate(${(frame * 2.4) % 360})`}>
      <rect x="-14" y="-1.5" width="28" height="3" fill="#78350f" /><rect x="-1.5" y="-14" width="3" height="28" fill="#78350f" />
      <rect x="4" y="-4" width="9" height="3" fill="#f8fafc" /><rect x="-13" y="1" width="9" height="3" fill="#f8fafc" />
      <rect x="-4" y="-13" width="3" height="9" fill="#f8fafc" /><rect x="1" y="4" width="3" height="9" fill="#f8fafc" />
    </g>
  </g>
);

const SvgCastle3: React.FC<{ x: number; y: number; gold: boolean; frame: number }> = ({ x, y, gold, frame }) => (
  <g transform={`translate(${x}, ${y}) scale(${gold ? 1.12 : 1})`}>
    {gold && <ellipse cx="0" cy="-14" rx="30" ry="22" fill="#fde047" opacity={0.18 + Math.sin(frame * 0.3) * 0.08} />}
    <rect x="-22" y="-22" width="44" height="27" fill="#0f172a" /><rect x="-20" y="-20" width="40" height="23" fill={gold ? '#facc15' : '#cbd5e1'} />
    <rect x="-24" y="-32" width="12" height="35" fill={gold ? '#eab308' : '#94a3b8'} stroke="#0f172a" strokeWidth="1.5" />
    <rect x="12" y="-32" width="12" height="35" fill={gold ? '#eab308' : '#94a3b8'} stroke="#0f172a" strokeWidth="1.5" />
    <rect x="-10" y="-36" width="20" height="20" fill={gold ? '#fef08a' : '#e2e8f0'} stroke="#0f172a" strokeWidth="1.5" />
    <rect x="-6" y="-8" width="12" height="11" fill="#451a03" />
    <rect x="-1" y="-46" width="2" height="11" fill="#0f172a" /><rect x="1" y="-46" width={11 + Math.sin(frame * 0.3) * 1.5} height="6" fill="#2563eb" />
  </g>
);
const SvgCannon: React.FC<{ x: number; y: number; scale: number; frame: number; offset: number }> = ({ x, y, scale, frame, offset }) => {
  const puff = (frame + offset) % 70;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <rect x="-10" y="-12" width="20" height="16" fill="#64748b" stroke="#0f172a" strokeWidth="1.5" />
      <rect x="-7" y="-16" width="14" height="6" fill="#1e293b" /><rect x="-3" y="-12" width="6" height="11" fill="#0f172a" />
      {puff < 22 && (
        <g>
          {puff < 8 && <rect x="-5" y="1" width="10" height="7" fill={puff < 4 ? '#fde047' : '#f8fafc'} opacity={1 - puff / 8} />}
          {puff < 15 && <rect x="-3" y={4 + puff * 2.1} width="6" height="6" rx="2" fill="#0f172a" />}
          {puff >= 15 && <ellipse cx="0" cy="36" rx={(puff - 14) * 2.4} ry="4" fill="#e0f2fe" opacity={1 - (puff - 15) / 7} />}
        </g>
      )}
    </g>
  );
};

const SvgWarship3: React.FC<{ x: number; y: number; frame: number; goldCargo?: boolean; flip?: boolean }> = ({ x, y, frame, goldCargo = false, flip = false }) => (
  <g transform={`translate(${x}, ${y + Math.sin(frame * 0.16) * 2}) scale(${flip ? -1.12 : 1.12}, 1.12)`}>
    <rect x="-24" y="6" width="46" height="3.5" fill="#bae6fd" opacity="0.7" />
    <rect x="-32" y="7" width="8" height="2.5" fill="#e0f2fe" opacity="0.6" />
    <polygon points="-22,-2 24,-2 17,7 -17,7" fill="#451a03" stroke="#0f172a" strokeWidth="1.4" />
    <rect x="-19" y="-3" width="38" height="5" fill="#92400e" />
    <rect x="-20" y="-9" width="11" height="7" fill="#78350f" stroke="#0f172a" strokeWidth="1.2" />
    <polygon points="18,-3 30,-8 28,-5 18,0" fill="#78350f" stroke="#0f172a" strokeWidth="1" />
    <rect x="-8" y="0" width="3" height="2.5" fill="#0f172a" /><rect x="0" y="0" width="3" height="2.5" fill="#0f172a" /><rect x="8" y="0" width="3" height="2.5" fill="#0f172a" />
    {goldCargo && <><rect x="-12" y="-7" width="8" height="5" fill="#facc15" stroke="#0f172a" strokeWidth="1" /><rect x="6" y="-7" width="8" height="5" fill="#fde047" stroke="#0f172a" strokeWidth="1" /></>}
    <rect x="-2" y="-30" width="3" height="27" fill="#451a03" />
    <polygon points="1,-27 16,-23 18,-11 1,-10" fill="#2563eb" stroke="#0f172a" strokeWidth="1.4" />
    <rect x="6" y="-21" width="5" height="5" fill="#fde047" />
    <polygon points="15,-22 26,-7 15,-8" fill="#f8fafc" stroke="#0f172a" strokeWidth="1.1" />
    <rect x="-2" y="-33" width={9 + Math.sin(frame * 0.35) * 2} height="4" fill="#38bdf8" stroke="#0f172a" strokeWidth="0.8" />
  </g>
);

const SvgDragonMap: React.FC<{ x: number; y: number; frame: number; scale: number }> = ({ x, y, frame, scale }) => {
  const fl = Math.sin(frame * 0.45) * 8;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <ellipse cx="0" cy="24" rx="22" ry="7" fill="rgba(15,23,42,0.45)" />
      <polygon points={`-4,-4 -26,${-18 + fl} -22,${2 + fl} -8,6`} fill="#991b1b" stroke="#0f172a" strokeWidth="1.5" />
      <polygon points={`-4,6 -22,${20 - fl} -16,${8 - fl} -2,10`} fill="#7f1d1d" stroke="#0f172a" strokeWidth="1.5" />
      <polygon points="-24,0 -10,-4 -10,5" fill="#b91c1c" stroke="#0f172a" strokeWidth="1.2" />
      <rect x="-12" y="-7" width="22" height="14" fill="#dc2626" stroke="#0f172a" strokeWidth="1.5" />
      <rect x="-6" y="-9" width="12" height="3" fill="#facc15" />
      <rect x="8" y="-9" width="15" height="12" fill="#dc2626" stroke="#0f172a" strokeWidth="1.5" />
      <rect x="10" y="-13" width="4" height="5" fill="#facc15" /><rect x="16" y="-7" width="4" height="4" fill="#fde047" />
      <ellipse cx={32 + Math.sin(frame * 0.8) * 3} cy="-3" rx="12" ry="6" fill="#f97316" />
      <ellipse cx="28" cy="-3" rx="7" ry="3.5" fill="#fde047" />
    </g>
  );
};

const SvgCitizen3: React.FC<{ x: number; y: number; shirt: string; step: number; flip?: boolean; isLeader?: boolean; carry?: 'gold' | 'bread' | 'sword'; bubble?: 'ship' | 'gold' | 'bread' | 'cannon' | 'dragon' | 'fire' | 'panic' | 'bulb' }> = ({ x, y, shirt, step, flip = false, isLeader = false, carry, bubble }) => {
  const s = Math.sin(step);
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="2" rx="4.5" ry="1.8" fill="rgba(15,23,42,0.35)" />
      <g transform={`translate(0, ${-Math.abs(s) * 2.4}) scale(${flip ? -1 : 1}, 1)`}>
        <rect x="-3" y={s > 0 ? -3 : -1} width="2" height="3" fill="#0f172a" /><rect x="1" y={s < 0 ? -3 : -1} width="2" height="3" fill="#0f172a" />
        <rect x="-4.5" y="-9.5" width="9" height="7.5" fill="#0f172a" /><rect x="-3.5" y="-8.5" width="7" height="6" fill={shirt} />
        <rect x="-3.5" y="-14.5" width="7" height="6" fill="#0f172a" /><rect x="-2.8" y="-13.8" width="5.6" height="4.8" fill="#fed7aa" />
        <rect x="-3" y="-15" width="6" height="2" fill="#451a03" />
        {carry === 'gold' && <rect x="2" y="-9" width="6" height="4" fill="#facc15" stroke="#0f172a" strokeWidth="0.8" />}
        {carry === 'bread' && <rect x="2" y="-9" width="6" height="4" fill="#d97706" stroke="#0f172a" strokeWidth="0.8" />}
        {carry === 'sword' && <rect x="4" y="-14" width="2.5" height="9" fill="#e2e8f0" stroke="#0f172a" strokeWidth="0.6" />}
        {isLeader && <><rect x="-4" y="-18" width="8" height="3" fill="#facc15" /><rect x="-1" y="-21" width="2" height="3" fill="#fde047" /></>}
      </g>
      {bubble && <g transform="translate(4, -30)"><rect x="0" y="0" width="14" height="13" rx="2" fill="#fff" stroke="#0f172a" strokeWidth="1.2" /><g transform="translate(2, 1.5)"><Ep3Icon type={bubble} size={10} /></g></g>}
    </g>
  );
};
const SMART_PATHS = [[[126, 113], [248, 113], [248, 160], [160, 113]], [[220, 198], [220, 155], [176, 155], [220, 198]], [[126, 156], [248, 156], [248, 86], [172, 113]]];
const SMART_CITIZENS = Array.from({ length: 24 }, (_, i) => ({ id: i, pathIdx: i % 3, offset: (i * 0.17) % 1, speed: 0.0024 + random(`s3-${i}`) * 0.0012, jx: (random(`s3x-${i}`) - 0.5) * 9, jy: (random(`s3y-${i}`) - 0.5) * 9 }));
const DUMB_CITIZENS = Array.from({ length: 22 }, (_, i) => ({ id: i, ax: 112 + random(`d3a-${i}`) * 215, ay: 78 + random(`d3ay-${i}`) * 112, bx: 112 + random(`d3b-${i}`) * 215, by: 78 + random(`d3by-${i}`) * 112, offset: (i * 0.19) % 1, speed: 0.0045 + random(`d3s-${i}`) * 0.003 }));

function walkP(pts: number[][], t: number) {
  const segs = pts.length - 1, s = (((t % 1) + 1) % 1) * segs, i = Math.floor(s), f = s - i;
  const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
  return { x: x1 + (x2 - x1) * f, y: y1 + (y2 - y1) * f, flip: x2 < x1 };
}

const getWordColor = (word: string) => {
  const c = word.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (['pintar', 'bima', 'kapal', 'perang', 'cerdas', 'kerajaan', 'megah', 'meriam', 'menara'].includes(c)) return '#38bdf8';
  if (['bodoh', 'udin', 'naga', 'api', 'raksasa', 'membangunkan', 'berperang'].includes(c)) return '#f87171';
  if (['emas', 'roti', 'patung', 'gua', 'harta', 'untung', 'enam', 'delapan', 'ketiga', 'kedua'].includes(c)) return '#fde047';
  return '#ffffff';
};

export const WorldBoxEp3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sec = frame / fps;

  const year = Math.min(38, Math.floor(interpolate(frame, [0, 340, 620, 910], [26, 29, 34, 38.9], { extrapolateRight: 'clamp' })));
  const smartPop = Math.floor(interpolate(frame, [0, 600, 1100], [185, 206, 248], { extrapolateRight: 'clamp' }));
  const dumbPop = frame < 550 ? 40 : frame < 920 ? Math.floor(interpolate(frame, [550, 880], [40, 64], { extrapolateRight: 'clamp' })) : Math.floor(interpolate(frame, [920, 1180], [64, 51], { extrapolateRight: 'clamp' }));

  const hasGoldCastle = frame >= 605;
  const hasCannons = frame >= 685;
  const caveCracks = frame >= 835;
  const dragonOut = frame >= 910;
  const quake = frame >= 885 && frame < 985 ? Math.sin(frame * 2.4) * 4 : 0;

  const showBarterCut = frame >= 340 && frame <= 565;
  const showDragonCut = frame >= 965;
  const cutActive = showBarterCut || showDragonCut;
  const barterPop = showBarterCut ? spring({ frame: frame - 340, fps, config: { damping: 12 } }) : 0;
  const dragonPop = showDragonCut ? spring({ frame: frame - 965, fps, config: { damping: 11 } }) : 0;

  const lastEnd = WORD_SUBS_EP3.length > 0 ? WORD_SUBS_EP3[WORD_SUBS_EP3.length - 1].e : 38.5;
  const cliffFrame = Math.min(1065, Math.ceil((lastEnd + 0.12) * fps));
  const showCliff = frame >= cliffFrame;
  const cliffIn = showCliff ? spring({ frame: frame - cliffFrame, fps, config: { damping: 10 } }) : 0;
  const activeIdx = WORD_SUBS_EP3.findIndex((x) => sec >= x.s && sec < x.e);
  const activeWord = activeIdx >= 0 ? WORD_SUBS_EP3[activeIdx] : null;
  const wordPop = activeWord ? spring({ frame: Math.max(0, frame - Math.floor(activeWord.s * fps)), fps, config: { damping: 11, stiffness: 280, mass: 0.5 } }) : 0;
  const shoreWave = Math.sin(frame * 0.14) * 0.22 + 0.78;
  const renderTiles = (isDumb: boolean) => (
    <g>
      {ISLAND_CELLS.map((c, idx) => {
        let fill = '#38bdf8', op = 1;
        if (c.t === 1) { fill = c.v > 0.72 ? '#7dd3fc' : '#38bdf8'; op = shoreWave; }
        else if (c.t === 2) fill = c.v > 0.8 ? '#fef08a' : '#fde047';
        else if (c.t === 3) fill = isDumb ? (c.v > 0.7 ? '#78716c' : '#57534e') : (c.v > 0.78 ? '#86efac' : '#4ade80');
        else if (c.t === 4) fill = isDumb ? (c.v > 0.7 ? '#57534e' : '#44403c') : (c.v > 0.78 ? '#16a34a' : '#22c55e');
        return <rect key={idx} x={c.x} y={c.y} width="10.4" height="10.4" fill={fill} opacity={op} />;
      })}
      <rect x="82" y="68" width="28" height="20" fill="#475569" /><rect x="88" y="62" width="18" height="12" fill="#94a3b8" />
      {!isDumb && <><rect x="90" y="74" width="12" height="14" fill="#0f172a" /><rect x="122" y="109" width="148" height="9" fill="#94a3b8" opacity="0.88" /><rect x="246" y="80" width="9" height="104" fill="#94a3b8" opacity="0.88" /></>}
    </g>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#1d4ed8', overflow: 'hidden', transform: `translate(${quake}px, ${-quake * 0.5}px)` }}>
      <Audio src={staticFile('vo_wb_ep3.mp3')} volume={1} />
      <Audio src={staticFile('bgm_wb_ep3.wav')} volume={0.23} />
      <Sequence from={65} durationInFrames={40}><Audio src={staticFile('sfx_wb3_horn.wav')} volume={0.34} /></Sequence>
      <Sequence from={340} durationInFrames={35}><Audio src={whoosh} volume={0.4} /></Sequence>
      {[380, 445, 505].map((fr) => <Sequence key={`dl-${fr}`} from={fr} durationInFrames={16}><Audio src={staticFile('sfx_wb3_deal.wav')} volume={0.3} /></Sequence>)}
      <Sequence from={560} durationInFrames={35}><Audio src={whoosh} volume={0.35} /></Sequence>
      <Sequence from={605} durationInFrames={14}><Audio src={staticFile('sfx_wb3_coin.wav')} volume={0.34} /></Sequence>
      {[705, 775].map((fr) => <Sequence key={`cn-${fr}`} from={fr} durationInFrames={18}><Audio src={staticFile('sfx_wb3_cannon.wav')} volume={0.28} /></Sequence>)}
      <Sequence from={885} durationInFrames={68}><Audio src={staticFile('sfx_wb3_quake.wav')} volume={0.28} /></Sequence>
      <Sequence from={925} durationInFrames={200}><Audio src={staticFile('sfx_wb3_roar.wav')} volume={0.17} /></Sequence>
      <Sequence from={965} durationInFrames={35}><Audio src={whoosh} volume={0.42} /></Sequence>
      <Sequence from={cliffFrame} durationInFrames={60}><Audio src={ding} volume={0.5} /></Sequence>

      <AbsoluteFill style={{ backgroundImage: 'radial-gradient(#38bdf8 4px, transparent 4px)', backgroundSize: '46px 46px', backgroundPosition: `${(frame * 0.8) % 46}px ${(frame * 0.35) % 46}px`, opacity: 0.38 }} />

      {/* === PULAU ATAS: PULAU PINTAR === */}
      <div style={{ position: 'absolute', top: 205, left: 75, width: 930, height: 520 }}>
        <svg width="100%" height="100%" viewBox="0 0 440 260" shapeRendering="crispEdges">
          {renderTiles(false)}
          <rect x="270" y="96" width="68" height="72" fill="#92400e" />
          {[0, 1, 2, 3].map((r) => [0, 1, 2, 3].map((c) => <rect key={`${r}-${c}`} x={275 + c * 15} y={101 + r * 16} width="10" height="10" fill="#fde047" />))}
          <SvgWindmill x={298} y={82} frame={frame} />
          <g><rect x="102" y="58" width="244" height="6" fill="#94a3b8" stroke="#0f172a" strokeWidth="1" /><rect x="102" y="194" width="104" height="6" fill="#94a3b8" stroke="#0f172a" strokeWidth="1" /><rect x="238" y="194" width="108" height="6" fill="#94a3b8" stroke="#0f172a" strokeWidth="1" /><rect x="102" y="58" width="6" height="142" fill="#94a3b8" stroke="#0f172a" strokeWidth="1" /><rect x="340" y="58" width="6" height="142" fill="#94a3b8" stroke="#0f172a" strokeWidth="1" /></g>
          {SMART_TREES.map((tr, i) => <g key={i} transform={`translate(${tr.x}, ${tr.y}) scale(${tr.size})`}><rect x="-2" y="-5" width="4" height="7" fill="#78350f" /><rect x="-8" y="-13" width="16" height="9" fill="#166534" /><rect x="-6" y="-18" width="12" height="7" fill="#15803d" /><rect x="-4" y="-21" width="8" height="4" fill="#22c55e" /></g>)}
          {SMART_HOUSES.map(([hx, hy], idx) => <SvgHouse3 key={idx} x={hx} y={hy} roof="#2563eb" goldTrim={frame >= 605 + idx * 10} />)}
          <SvgHouse3 x={220} y={134} roof="#475569" />
          <SvgCastle3 x={176} y={136} gold={hasGoldCastle} frame={frame} />
          {hasCannons && <><SvgCannon x={152} y={208} scale={spring({ frame: frame - 685, fps, config: { damping: 10 } })} frame={frame} offset={0} /><SvgCannon x={302} y={208} scale={spring({ frame: frame - 700, fps, config: { damping: 10 } })} frame={frame} offset={35} /></>}
          <rect x="210" y="198" width="24" height="24" fill="#78350f" stroke="#0f172a" strokeWidth="1.5" />
          {frame < 55 && <SvgWarship3 x={265 + frame * 3.1} y={226 + frame * 0.3} frame={frame} />}
          {frame >= 560 && <SvgWarship3 x={interpolate(frame, [560, 635], [405, 268], { extrapolateRight: 'clamp' })} y={226} frame={frame} goldCargo flip />}{frame >= 630 && <g transform="translate(215, 206)"><rect x="0" y="0" width="9" height="6" fill="#facc15" stroke="#0f172a" strokeWidth="1" /><rect x="6" y="-4" width="8" height="5" fill="#fde047" stroke="#0f172a" strokeWidth="1" /></g>}
          {SMART_CITIZENS.map((c) => { const p = walkP(SMART_PATHS[c.pathIdx], c.offset + frame * c.speed); return <SvgCitizen3 key={c.id} x={p.x + c.jx} y={p.y + c.jy} shirt="#2563eb" step={frame * 0.35 + c.id} flip={p.flip} carry={hasGoldCastle && c.id % 3 === 0 ? 'gold' : undefined} bubble={hasCannons && c.id === 2 ? 'cannon' : hasGoldCastle && c.id === 4 ? 'gold' : undefined} />; })}
          {frame >= 565 && (() => { const bp = walkP([[192, 113], [248, 113], [248, 152], [192, 152]], frame * 0.003); return <SvgCitizen3 x={bp.x} y={bp.y} shirt="#1e40af" step={frame * 0.3} flip={bp.flip} isLeader bubble={hasCannons ? 'cannon' : 'gold'} />; })()}
        </svg>
      </div>
      {!cutActive && <div style={{ position: 'absolute', top: 726, left: '50%', transform: 'translateX(-50%)', backgroundColor: '#0f172a', border: '3px solid #38bdf8', borderRadius: 12, padding: '6px 18px', fontFamily, fontSize: 15, color: '#38bdf8', zIndex: 25 }}>PULAU PINTAR</div>}
      <div style={{ position: 'absolute', top: 798, left: 0, right: 0, height: 10, opacity: cutActive ? 0 : 1, backgroundColor: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 25 }}>
        <div style={{ backgroundColor: '#1e293b', border: '4px solid #facc15', borderRadius: 14, padding: '6px 20px', fontFamily, fontSize: 22, color: '#facc15', boxShadow: '0 4px 0 #0f172a' }}>VS</div>
      </div>

      {/* === PULAU BAWAH: PULAU BODOH === */}
      <div style={{ position: 'absolute', top: 850, left: 75, width: 930, height: 520 }}>
        <svg width="100%" height="100%" viewBox="0 0 440 260" shapeRendering="crispEdges">
          {renderTiles(true)}
          {/* Gua Emas -> Retak Merah Lava di Tahun 38 */}
          <g transform="translate(96, 80)">
            <ellipse cx="0" cy="2" rx="22" ry="15" fill={caveCracks ? '#ef4444' : '#fde047'} opacity={0.25 + Math.sin(frame * 0.4) * 0.12} />
            <rect x="-15" y="-13" width="30" height="24" fill="#0f172a" />
            <rect x="-11" y="-1" width="22" height="11" fill={caveCracks ? '#ea580c' : '#ca8a04'} />
            <rect x="-8" y="-4" width="16" height="8" fill={caveCracks ? '#fde047' : '#facc15'} />
          </g>
          <SvgHouse3 x={300} y={178} roof="#991b1b" stone={false} tilted scale={0.82} />
          {/* Patung Emas */}
          <g transform="translate(218, 128) scale(1.18)">
            <ellipse cx="0" cy="4" rx="18" ry="6" fill="rgba(15,23,42,0.35)" /><rect x="-16" y="-5" width="32" height="8" fill="#475569" />
            <rect x="-14" y="-35" width="28" height="31" fill="#0f172a" /><rect x="-13" y="-34" width="26" height="29" fill="#ca8a04" />
            <rect x="-10" y="-32" width="9" height="25" fill="#facc15" /><rect x="-10" y="-26" width="20" height="4" fill="#854d0e" />
          </g>
          {/* Keranjang Roti Hasil Barter */}
          {frame >= 550 && <g transform="translate(174, 154)"><rect x="-10" y="-5" width="20" height="10" fill="#92400e" stroke="#0f172a" strokeWidth="1.2" /><rect x="-7" y="-9" width="14" height="6" fill="#f59e0b" /></g>}
          {/* Kapal Perang Pulau Pintar Merapat di Pantai Utara Pulau Bodoh */}
          {frame >= 58 && frame < 555 && (
            <SvgWarship3
              x={frame < 125 ? interpolate(frame, [58, 125], [405, 310]) : frame > 495 ? interpolate(frame, [495, 555], [310, 415]) : 310}
              y={frame < 125 ? interpolate(frame, [58, 125], [22, 56]) : 56}
              frame={frame} goldCargo={frame > 340} flip={frame < 490}
            />
          )}
          {/* Pasukan Biru & Leader Bima Mendarat (Frame 115 - 520) */}
          {frame >= 115 && frame <= 520 && (
            <g>
              {[[272, 74], [294, 78], [312, 86]].map(([sx, sy], i) => (
                <SvgCitizen3 key={i} x={sx + Math.sin(frame * 0.08 + i) * 6} y={sy + Math.min(20, (frame - 115) * 0.4)} shirt="#2563eb" step={frame * 0.35 + i} carry={frame > 340 ? 'gold' : 'sword'} />
              ))}
              <SvgCitizen3 x={282} y={Math.min(112, 74 + (frame - 115) * 0.5)} shirt="#1e40af" step={frame * 0.3} isLeader bubble={frame > 180 ? 'bulb' : 'ship'} />
            </g>
          )}
          {/* Warga Bodoh: Panik -> Makan Roti & Gali Gua -> Lari dari Naga */}
          {DUMB_CITIZENS.map((c) => {
            const t = (frame * (dragonOut ? 0.025 : c.speed) + c.offset) % 2;
            let px = t < 1 ? c.ax + (c.bx - c.ax) * t : c.bx + (c.ax - c.bx) * (t - 1);
            let py = t < 1 ? c.ay + (c.by - c.ay) * t : c.by + (c.ay - c.by) * (t - 1);
            if (frame >= 565 && frame < 910 && (c.id === 0 || c.id === 3 || c.id === 6)) { const sp = [[98, 108], [122, 98], [84, 104]][c.id / 3]; px = sp[0] + Math.sin(frame * 0.14 + c.id) * 4; py = sp[1] + Math.cos(frame * 0.14 + c.id) * 3; } else if (frame >= 565 && frame < 910 && c.id % 3 === 1) { const a = c.id * 0.9 + Math.sin(frame * 0.05 + c.id) * 0.5; px = 194 + Math.cos(a) * 32; py = 148 + Math.sin(a) * 18; }
            const bub = dragonOut ? (c.id % 5 === 0 ? 'panic' : undefined) : frame >= 565 && c.id % 4 === 0 ? 'bread' : frame >= 100 && frame < 340 && c.id % 3 === 0 ? 'panic' : undefined;
            return <SvgCitizen3 key={c.id} x={px} y={py} shirt="#dc2626" step={frame * (dragonOut ? 0.7 : 0.45) + c.id} flip={t >= 1} carry={frame >= 565 && !dragonOut && c.id % 3 === 0 ? 'bread' : undefined} bubble={bub} />;
          })}
          {(() => { const up = walkP([[116, 98], [186, 144], [142, 134]], frame * 0.006); return <SvgCitizen3 x={up.x} y={up.y} shirt="#991b1b" step={frame * 0.5} flip={up.flip} isLeader bubble={dragonOut ? 'panic' : frame >= 565 ? 'bread' : 'gold'} />; })()}
          {/* Naga Api Terbang Keluar dari Gua di Peta */}
          {dragonOut && [[122, 92], [156, 106], [192, 118]].map(([fx, fy], idx) => frame >= 920 + idx * 12 ? <g key={`df-${idx}`} transform={`translate(${fx}, ${fy})`}><rect x="-6" y="-8" width="12" height="9" fill="#ef4444" /><rect x="-4" y="-11" width="8" height="8" fill="#f97316" /><rect x="-2" y="-7" width="4" height="5" fill="#fde047" /></g> : null)}
          {dragonOut && (
            <SvgDragonMap
              x={interpolate(frame, [910, 968], [98, 255], { extrapolateRight: 'clamp' })}
              y={interpolate(frame, [910, 968], [82, 128], { extrapolateRight: 'clamp' })}
              frame={frame}
              scale={spring({ frame: frame - 910, fps, config: { damping: 9 } }) * 1.35}
            />
          )}
        </svg>
      </div>
      {!cutActive && <div style={{ position: 'absolute', top: 1370, left: '50%', transform: 'translateX(-50%)', backgroundColor: '#0f172a', border: '3px solid #f87171', borderRadius: 12, padding: '6px 18px', fontFamily, fontSize: 15, color: '#f87171', zIndex: 25 }}>PULAU BODOH • {dumbPop}</div>}
      {!cutActive && frame >= 65 && frame < 335 && <div style={{ position: 'absolute', top: 848, left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(15, 23, 42, 0.94)', border: '3px solid #38bdf8', borderRadius: 12, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8, zIndex: 32 }}><Ep3Icon type="ship" size={18} /><span style={{ fontFamily, fontSize: 12, color: '#38bdf8' }}>PENDARATAN!</span></div>}
      {!cutActive && hasCannons && frame < 880 && <div style={{ position: 'absolute', top: 204, left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(15, 23, 42, 0.94)', border: '3px solid #facc15', borderRadius: 12, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8, zIndex: 32 }}><Ep3Icon type="cannon" size={18} /><span style={{ fontFamily, fontSize: 12, color: '#fde047' }}>KERAJAAN EMAS!</span></div>}
      {!cutActive && dragonOut && <div style={{ position: 'absolute', top: 848, left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(127, 29, 29, 0.95)', border: '3px solid #fb923c', borderRadius: 12, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8, zIndex: 32 }}><Ep3Icon type="dragon" size={18} /><span style={{ fontFamily, fontSize: 12, color: '#fde047' }}>NAGA API!</span></div>}

      {cutActive && <AbsoluteFill style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', opacity: Math.min(1, Math.max(barterPop, dragonPop)), zIndex: 35 }} />}
      {showBarterCut && <AbsoluteFill style={{ transform: `scale(${barterPop})`, zIndex: 38 }}><CloseUpBarter frame={frame} localFrame={frame - 340} /></AbsoluteFill>}
      {showDragonCut && <AbsoluteFill style={{ transform: `scale(${dragonPop})`, zIndex: 38 }}><CloseUpDragon frame={frame} localFrame={frame - 965} /></AbsoluteFill>}

      <div style={{ position: 'absolute', top: 82, left: '50%', transform: 'translateX(-50%)', padding: '6px 18px', borderRadius: 20, backgroundColor: 'rgba(15, 23, 42, 0.82)', border: '2px solid rgba(250, 204, 21, 0.6)', fontFamily: 'sans-serif', fontSize: 22, fontWeight: 'bold', color: '#f8fafc', zIndex: 45 }}>@dysesat</div>
      <div style={{ position: 'absolute', top: 138, left: 85, right: 85, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 45 }}>
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.92)', border: '3px solid #facc15', borderRadius: 14, padding: '10px 16px', fontFamily, fontSize: 17, color: '#facc15' }}>TAHUN: {year}</div>
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.92)', border: '3px solid #38bdf8', borderRadius: 14, padding: '10px 16px', fontFamily, fontSize: 15, color: '#38bdf8' }}>PINTAR: {smartPop}</div>
      </div>

      {activeWord && !showCliff && <div style={{ position: 'absolute', top: 1435, left: 70, right: 70, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 55, pointerEvents: 'none' }}><div style={{ fontFamily, fontSize: activeWord.w.length > 10 ? 32 : 40, color: getWordColor(activeWord.w), textAlign: 'center', padding: '12px 24px', borderRadius: 16, backgroundColor: 'rgba(15, 23, 42, 0.82)', border: `3px solid ${getWordColor(activeWord.w)}`, textShadow: '4px 4px 0 #0f172a, -3px -3px 0 #0f172a, 3px -3px 0 #0f172a, -3px 3px 0 #0f172a', transform: `scale(${0.65 + wordPop * 0.35}) rotate(${activeIdx % 2 === 0 ? -2 : 2}deg)` }}>{activeWord.w.toUpperCase()}</div></div>}
      {showCliff && <div style={{ position: 'absolute', top: 1435, left: 95, right: 95, backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '4px solid #facc15', borderRadius: 16, padding: '16px 20px', textAlign: 'center', fontFamily, fontSize: 21, color: '#facc15', boxShadow: '0 10px 28px rgba(0,0,0,0.6)', transform: `scale(${cliffIn * (1 + Math.sin(frame * 0.22) * 0.025)})`, zIndex: 55, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12 }}><span>BERSAMBUNG KE EPISODE 4</span><Ep3Icon type="dragon" size={26} /></div>}
    </AbsoluteFill>
  );
};
