import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PressStart2P';
import { whoosh, ding } from '@remotion/sfx';
import { WORD_SUBS_EP2 } from './wbEp2Words';
import { CloseUpUdinGold, CloseUpBimaForge } from './WorldBoxEp2Cutscenes';

const { fontFamily } = loadFont();

type TileCell = { x: number; y: number; t: number; v: number };
const ISLAND_CELLS: TileCell[] = [];
const GRASS_SPOTS: { x: number; y: number }[] = [];
for (let gy = 0; gy < 26; gy++) {
  for (let gx = 0; gx < 44; gx++) {
    const nx = (gx - 21.5) / 18.2;
    const ny = (gy - 12.5) / 10.2;
    const ang = Math.atan2(ny, nx);
    const wave = 0.13 * Math.sin(ang * 3 + 0.8) + 0.08 * Math.cos(ang * 5 - 0.5) + 0.04 * Math.sin(gx * 0.6 + gy * 0.4);
    const d = Math.sqrt(nx * nx + ny * ny) + wave;
    const t = d <= 0.62 ? 4 : d <= 0.82 ? 3 : d <= 0.93 ? 2 : d <= 1.05 ? 1 : 0;
    if (t > 0) {
      ISLAND_CELLS.push({ x: gx * 10, y: gy * 10, t, v: random(`tv2-${gx}-${gy}`) });
      if ((t === 3 || t === 4) && gx > 6 && gx < 37 && gy > 4 && gy < 21) GRASS_SPOTS.push({ x: gx * 10 + 5, y: gy * 10 + 5 });
    }
  }
}

const ISLAND_TREES = Array.from({ length: 34 }, (_, i) => {
  const p = GRASS_SPOTS[Math.floor(random(`tr-idx-${i}`) * GRASS_SPOTS.length)];
  const inV = p.x > 110 && p.x < 345 && p.y > 70 && p.y < 190;
  return { x: p.x, y: p.y, smartAlive: !inV, dumbBurnAt: i < 26 ? 0 : 35 + Math.floor(random(`db-${i}`) * 150), size: 0.9 + random(`ts-${i}`) * 0.25 };
}).sort((a, b) => a.y - b.y);

const SMART_HOUSES = [[128, 86], [172, 86], [216, 86], [128, 134], [128, 178], [172, 178], [216, 178]];
const Ep2Icon: React.FC<{ type: 'fire' | 'gold' | 'anvil' | 'panic' | 'question' | 'skull' | 'ship'; size?: number }> = ({ type, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" shapeRendering="crispEdges">
    {type === 'fire' && <><rect x="3" y="5" width="6" height="6" fill="#ef4444" /><rect x="4" y="2" width="4" height="5" fill="#f97316" /><rect x="5" y="6" width="2" height="4" fill="#fde047" /></>}
    {type === 'gold' && <><rect x="2" y="5" width="8" height="4" fill="#ca8a04" /><rect x="3" y="4" width="6" height="3" fill="#facc15" /><rect x="4" y="4" width="3" height="2" fill="#fef08a" /></>}
    {type === 'anvil' && <><rect x="1" y="3" width="10" height="3" fill="#94a3b8" /><rect x="4" y="6" width="4" height="3" fill="#64748b" /><rect x="2" y="9" width="8" height="2" fill="#475569" /></>}
    {type === 'panic' && <><rect x="5" y="1" width="2" height="6" fill="#dc2626" /><rect x="5" y="9" width="2" height="2" fill="#dc2626" /></>}
    {type === 'question' && <><rect x="3" y="1" width="6" height="2" fill="#1e293b" /><rect x="7" y="3" width="2" height="2" fill="#1e293b" /><rect x="5" y="5" width="2" height="2" fill="#1e293b" /><rect x="5" y="9" width="2" height="2" fill="#1e293b" /></>}
    {type === 'skull' && <><rect x="2" y="2" width="8" height="6" fill="#f8fafc" /><rect x="3" y="8" width="6" height="2" fill="#e2e8f0" /><rect x="3" y="4" width="2" height="2" fill="#0f172a" /><rect x="7" y="4" width="2" height="2" fill="#0f172a" /></>}
    {type === 'ship' && <><rect x="2" y="8" width="8" height="3" fill="#78350f" /><rect x="5" y="2" width="2" height="6" fill="#92400e" /><rect x="7" y="2" width="4" height="5" fill="#38bdf8" /></>}
  </svg>
);

const SvgFire2: React.FC<{ x: number; y: number; frame: number; scale: number }> = ({ x, y, frame, scale }) => {
  const f1 = Math.sin(frame * 0.75) * 2;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <ellipse cx="0" cy="2" rx="18" ry="7" fill="#f97316" opacity="0.24" />
      <rect x="-12" y={-12 + f1} width="24" height="13" fill="#dc2626" />
      <rect x="-9" y={-19 - f1} width="18" height="15" fill="#f97316" />
      <rect x="-5" y={-14 + f1} width="10" height="10" fill="#fde047" />
      {[0, 1].map((i) => {
        const l = (frame * 1.5 + i * 18) % 38;
        return <rect key={i} x={-5 + Math.sin(frame * 0.14 + i) * 6} y={-22 - l} width="9" height="6" fill="#1e293b" opacity={Math.max(0, 0.7 - l / 42)} />;
      })}
    </g>
  );
};
const SvgHouse2: React.FC<{ x: number; y: number; roof: string; stone?: boolean; tilted?: boolean; scale?: number; smoke?: number }> = ({ x, y, roof, stone = false, tilted = false, scale = 1, smoke }) => (
  <g transform={`translate(${x}, ${y}) rotate(${tilted ? 11 : 0}) scale(${scale})`}>
    <rect x="-12" y="2" width="24" height="4" fill="rgba(15,23,42,0.3)" />
    <rect x="-11" y="-11" width="22" height="14" fill="#0f172a" /><rect x="-10" y="-10" width="20" height="12" fill={stone ? '#cbd5e1' : '#d97706'} />
    <rect x="-3" y="-4" width="6" height="6" fill="#451a03" /><rect x="4" y="-7" width="4" height="4" fill="#fef08a" />
    {smoke !== undefined && <rect x={6 + Math.sin(smoke * 0.1) * 2} y={-25 - (smoke % 15)} width="4" height="4" fill="#f8fafc" opacity={0.65 - (smoke % 15) / 22} />}
    <rect x="-14" y="-16" width="28" height="7" fill="#0f172a" /><rect x="-13" y="-15" width="26" height="5" fill={roof} /><rect x="-10" y="-19" width="20" height="4" fill={roof} />
  </g>
);

const SvgCastle: React.FC<{ x: number; y: number; scale: number; frame: number }> = ({ x, y, scale, frame }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    <ellipse cx="0" cy="6" rx="26" ry="7" fill="rgba(15,23,42,0.38)" />
    <rect x="-22" y="-22" width="44" height="27" fill="#0f172a" /><rect x="-20" y="-20" width="40" height="23" fill="#cbd5e1" />
    <rect x="-24" y="-32" width="12" height="35" fill="#94a3b8" stroke="#0f172a" strokeWidth="1.5" />
    <rect x="12" y="-32" width="12" height="35" fill="#94a3b8" stroke="#0f172a" strokeWidth="1.5" />
    <rect x="-10" y="-36" width="20" height="20" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1.5" /><rect x="-6" y="-8" width="12" height="11" fill="#451a03" />
    <rect x="-1" y="-46" width="2" height="11" fill="#0f172a" /><rect x="1" y="-46" width={10 + Math.sin(frame * 0.3) * 1.5} height="6" fill="#2563eb" />
  </g>
);

const SvgWarship: React.FC<{ x: number; y: number; scale: number; frame: number }> = ({ x, y, scale, frame }) => (
  <g transform={`translate(${x}, ${y + Math.sin(frame * 0.16) * 2.2}) scale(${scale})`}>
    <rect x="-20" y="6" width="40" height="4" fill="#bae6fd" opacity="0.65" />
    <rect x="-18" y="-2" width="36" height="9" fill="#78350f" stroke="#0f172a" strokeWidth="1.5" /><rect x="-13" y="-6" width="26" height="5" fill="#92400e" />
    <rect x="-1" y="-28" width="3" height="24" fill="#451a03" />
    <rect x="2" y="-26" width="16" height="16" fill="#2563eb" stroke="#0f172a" strokeWidth="1.5" /><rect x="6" y="-22" width="6" height="6" fill="#fde047" />
    <rect x="-11" y="-22" width="10" height="12" fill="#f8fafc" stroke="#0f172a" strokeWidth="1.2" />
  </g>
);
const SvgCitizen2: React.FC<{ x: number; y: number; shirt: string; step: number; flip?: boolean; isLeader?: boolean; carry?: 'gold' | 'iron'; bubble?: 'fire' | 'gold' | 'anvil' | 'panic' | 'question' | 'skull' | 'ship' }> = ({ x, y, shirt, step, flip = false, isLeader = false, carry, bubble }) => {
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
        {carry === 'iron' && <rect x="2" y="-9" width="6" height="4" fill="#94a3b8" stroke="#0f172a" strokeWidth="0.8" />}
        {isLeader && <><rect x="-4" y="-18" width="8" height="3" fill="#facc15" /><rect x="-1" y="-21" width="2" height="3" fill="#fde047" /></>}
      </g>
      {bubble && <g transform="translate(4, -30)"><rect x="0" y="0" width="14" height="13" rx="2" fill="#fff" stroke="#0f172a" strokeWidth="1.2" /><g transform="translate(2, 1.5)"><Ep2Icon type={bubble} size={10} /></g></g>}
    </g>
  );
};

const SMART_PATHS = [[[104, 84], [126, 113], [202, 113], [248, 113], [248, 155], [160, 113]], [[126, 156], [248, 156], [248, 86], [172, 113], [104, 84]], [[248, 113], [264, 156], [220, 206], [248, 156]]];
const SMART_CITIZENS = Array.from({ length: 24 }, (_, i) => ({ id: i, pathIdx: i % 3, offset: (i * 0.17) % 1, speed: 0.0024 + random(`s2-${i}`) * 0.0012, jx: (random(`s2x-${i}`) - 0.5) * 10, jy: (random(`s2y-${i}`) - 0.5) * 10 }));
const DUMB_GOLD_PATH = [[102, 86], [146, 112], [208, 132], [146, 118], [102, 86]];
const DUMB_CITIZENS = Array.from({ length: 20 }, (_, i) => ({ id: i, ax: 110 + random(`d2a-${i}`) * 220, ay: 72 + random(`d2ay-${i}`) * 118, bx: 110 + random(`d2b-${i}`) * 220, by: 72 + random(`d2by-${i}`) * 118, offset: (i * 0.19) % 1, speed: 0.004 + random(`d2s-${i}`) * 0.003, dieAt: 45 + Math.floor(random(`d2d-${i}`) * 195) }));

function walkP(pts: number[][], t: number) {
  const segs = pts.length - 1, s = (((t % 1) + 1) % 1) * segs, i = Math.floor(s), f = s - i;
  const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
  return { x: x1 + (x2 - x1) * f, y: y1 + (y2 - y1) * f, flip: x2 < x1 };
}

const getWordColor = (word: string) => {
  const c = word.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (['pintar', 'bima', 'benteng', 'besi', 'kastil', 'megah', 'kapal', 'perang', 'cerdas'].includes(c)) return '#38bdf8';
  if (['bodoh', 'udin', 'kebakaran', 'mengamuk', 'membakar', 'tersisa', 'menggigit'].includes(c)) return '#f87171';
  if (['emas', 'gua', 'raksasa', 'patung', 'ketiga', 'belas', 'kedua', 'puluh', 'lima', 'enam'].includes(c)) return '#fde047';
  return '#ffffff';
};
export const WorldBoxEp2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sec = frame / fps;

  const year = Math.min(25, Math.floor(interpolate(frame, [0, 310, 720, 990], [13, 16, 22, 25.9], { extrapolateRight: 'clamp' })));
  const smartPop = Math.floor(interpolate(frame, [0, 1150], [135, 185], { extrapolateRight: 'clamp' }));
  const dumbPop = frame < 260 ? Math.floor(interpolate(frame, [0, 250], [54, 36], { extrapolateRight: 'clamp' })) : Math.floor(interpolate(frame, [260, 1100], [36, 40], { extrapolateRight: 'clamp' }));

  const fireLevel = interpolate(frame, [0, 220, 290], [1, 1, 0], { extrapolateRight: 'clamp' });
  const charLevel = interpolate(frame, [0, 220], [0.25, 1], { extrapolateRight: 'clamp' });
  const caveOpen = frame >= 270;
  const cavePop = caveOpen ? spring({ frame: frame - 270, fps, config: { damping: 10 } }) : 0;
  const goldStatue = interpolate(frame, [380, 680], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const hasForge = frame >= 690, hasWalls = frame >= 730, hasCastle = frame >= 880, hasShip = frame >= 975;
  const shipPop = hasShip ? spring({ frame: frame - 975, fps, config: { damping: 10 } }) : 0;

  const showUdinCut = frame >= 455 && frame <= 665, showBimaCut = frame >= 745 && frame <= 925;
  const cutActive = showUdinCut || showBimaCut;
  const udinPop = showUdinCut ? spring({ frame: frame - 455, fps, config: { damping: 12 } }) : 0;
  const bimaPop = showBimaCut ? spring({ frame: frame - 745, fps, config: { damping: 12 } }) : 0;

  const lastEnd = WORD_SUBS_EP2.length > 0 ? WORD_SUBS_EP2[WORD_SUBS_EP2.length - 1].e : 39.2;
  const cliffFrame = Math.min(1195, Math.ceil((lastEnd + 0.12) * fps));
  const showCliff = frame >= cliffFrame;
  const cliffIn = showCliff ? spring({ frame: frame - cliffFrame, fps, config: { damping: 10 } }) : 0;
  const activeIdx = WORD_SUBS_EP2.findIndex((x) => sec >= x.s && sec < x.e);
  const activeWord = activeIdx >= 0 ? WORD_SUBS_EP2[activeIdx] : null;
  const wordPop = activeWord ? spring({ frame: Math.max(0, frame - Math.floor(activeWord.s * fps)), fps, config: { damping: 11, stiffness: 280, mass: 0.5 } }) : 0;
  const shoreWave = Math.sin(frame * 0.14) * 0.22 + 0.78;

  const renderTiles = (isDumb: boolean) => (
    <g>
      {ISLAND_CELLS.map((c, idx) => {
        let fill = '#38bdf8', op = 1;
        if (c.t === 1) { fill = c.v > 0.72 ? '#7dd3fc' : '#38bdf8'; op = shoreWave; }
        else if (c.t === 2) fill = c.v > 0.8 ? '#fef08a' : '#fde047';
        else if (c.t === 3) fill = isDumb && charLevel > 0.45 ? (c.v > 0.7 ? '#78716c' : '#57534e') : (c.v > 0.78 ? '#86efac' : '#4ade80');
        else if (c.t === 4) fill = isDumb && charLevel > 0.45 ? (c.v > 0.7 ? '#57534e' : '#44403c') : (c.v > 0.78 ? '#16a34a' : '#22c55e');
        return <rect key={idx} x={c.x} y={c.y} width="10.4" height="10.4" fill={fill} opacity={op} />;
      })}
      <rect x="82" y="68" width="28" height="20" fill="#475569" /><rect x="88" y="62" width="18" height="12" fill="#94a3b8" />
      {!isDumb && <><rect x="90" y="74" width="12" height="14" fill="#0f172a" /><rect x="86" y="68" width="4" height="4" fill="#fde047" opacity={Math.sin(frame * 0.3) > 0 ? 1 : 0.4} /><rect x="122" y="109" width="148" height="9" fill="#94a3b8" opacity="0.85" /><rect x="246" y="80" width="9" height="104" fill="#94a3b8" opacity="0.85" /></>}
    </g>
  );
  return (
    <AbsoluteFill style={{ backgroundColor: '#1d4ed8', overflow: 'hidden' }}>
      <Audio src={staticFile('vo_wb_ep2.mp3')} volume={1} />
      <Audio src={staticFile('bgm_wb_ep2.wav')} volume={0.24} />
      <Sequence from={0} durationInFrames={280}><Audio src={staticFile('sfx_wb2_fire.wav')} volume={0.24} /></Sequence>
      {[65, 130, 195].map((fr) => <Sequence key={`d-${fr}`} from={fr} durationInFrames={10}><Audio src={staticFile('sfx_wb2_death.wav')} volume={0.24} /></Sequence>)}
      <Sequence from={270} durationInFrames={28}><Audio src={staticFile('sfx_wb2_cave.wav')} volume={0.42} /></Sequence>
      <Sequence from={455} durationInFrames={35}><Audio src={whoosh} volume={0.4} /></Sequence>
      {[510, 565, 620].map((fr) => <Sequence key={`c-${fr}`} from={fr} durationInFrames={12}><Audio src={staticFile('sfx_wb2_coin.wav')} volume={0.32} /></Sequence>)}
      <Sequence from={660} durationInFrames={35}><Audio src={whoosh} volume={0.35} /></Sequence>
      <Sequence from={745} durationInFrames={35}><Audio src={whoosh} volume={0.4} /></Sequence>
      {[775, 835, 885].map((fr) => <Sequence key={`a-${fr}`} from={fr} durationInFrames={18}><Audio src={staticFile('sfx_wb2_anvil.wav')} volume={0.32} /></Sequence>)}
      <Sequence from={920} durationInFrames={35}><Audio src={whoosh} volume={0.35} /></Sequence>
      <Sequence from={975} durationInFrames={70}><Audio src={staticFile('sfx_wb2_ship.wav')} volume={0.38} /></Sequence>
      <Sequence from={cliffFrame} durationInFrames={60}><Audio src={ding} volume={0.5} /></Sequence>

      <AbsoluteFill style={{ backgroundImage: 'radial-gradient(#38bdf8 4px, transparent 4px)', backgroundSize: '46px 46px', backgroundPosition: `${(frame * 0.8) % 46}px ${(frame * 0.35) % 46}px`, opacity: 0.38 }} />

      <div style={{ position: 'absolute', top: 205, left: 75, width: 930, height: 520 }}>
        <svg width="100%" height="100%" viewBox="0 0 440 260" shapeRendering="crispEdges">
          {renderTiles(false)}
          <rect x="270" y="96" width="68" height="72" fill="#92400e" />
          {[0, 1, 2, 3].map((r) => [0, 1, 2, 3].map((c) => <rect key={`${r}-${c}`} x={275 + c * 15} y={101 + r * 16} width="10" height="10" fill="#fde047" />))}
          <SvgHouse2 x={294} y={84} roof="#f59e0b" stone={hasWalls} scale={0.95} />
          {hasWalls && <g opacity={spring({ frame: frame - 730, fps, config: { damping: 12 } })}><rect x="108" y="64" width="234" height="6" fill="#94a3b8" stroke="#0f172a" strokeWidth="1" /><rect x="108" y="190" width="234" height="6" fill="#94a3b8" stroke="#0f172a" strokeWidth="1" /><rect x="108" y="64" width="6" height="132" fill="#94a3b8" stroke="#0f172a" strokeWidth="1" /><rect x="336" y="64" width="6" height="132" fill="#94a3b8" stroke="#0f172a" strokeWidth="1" /></g>}
          {ISLAND_TREES.map((tr, i) => tr.smartAlive ? <g key={i} transform={`translate(${tr.x}, ${tr.y}) scale(${tr.size})`}><rect x="-2" y="-5" width="4" height="7" fill="#78350f" /><rect x="-8" y="-13" width="16" height="9" fill="#166534" /><rect x="-6" y="-18" width="12" height="7" fill="#15803d" /><rect x="-4" y="-21" width="8" height="4" fill="#22c55e" /></g> : null)}
          {SMART_HOUSES.map(([hx, hy], idx) => <SvgHouse2 key={idx} x={hx} y={hy} roof="#2563eb" stone={hasWalls} smoke={idx % 2 === 0 ? frame + idx * 8 : undefined} />)}
          {hasForge && <SvgHouse2 x={106} y={126} roof="#475569" stone smoke={frame * 1.4} scale={spring({ frame: frame - 690, fps, config: { damping: 10 } })} />}
          {hasCastle && <SvgCastle x={176} y={136} frame={frame} scale={spring({ frame: frame - 880, fps, config: { damping: 10 } })} />}
          <g transform="translate(105, 62)"><rect x="-7" y="-22" width="14" height="24" fill="#94a3b8" /><rect x="2" y="-32" width="8" height="5" fill="#38bdf8" /></g>
          <g transform="translate(334, 62)"><rect x="-7" y="-22" width="14" height="24" fill="#94a3b8" /><rect x="2" y="-32" width="8" height="5" fill="#38bdf8" /></g>
          {hasShip && <g><rect x="210" y="198" width="24" height="28" fill="#78350f" stroke="#0f172a" strokeWidth="1.5" /><rect x="214" y="202" width="16" height="20" fill="#b45309" /><SvgWarship x={256} y={230} scale={shipPop * 1.08} frame={frame} /></g>}
          {SMART_CITIZENS.map((c) => { const p = walkP(SMART_PATHS[c.pathIdx], c.offset + frame * c.speed); return <SvgCitizen2 key={c.id} x={p.x + c.jx} y={p.y + c.jy} shirt="#2563eb" step={frame * 0.35 + c.id} flip={p.flip} carry={c.id % 3 === 0 ? 'iron' : undefined} bubble={hasShip && c.id === 1 ? 'ship' : hasForge && c.id === 3 ? 'anvil' : undefined} />; })}
          {(() => { const bp = walkP([[192, 113], [248, 113], [248, 152], [192, 152]], frame * 0.003); return <SvgCitizen2 x={bp.x} y={bp.y} shirt="#1e40af" step={frame * 0.3} flip={bp.flip} isLeader bubble={hasShip ? 'ship' : hasForge ? 'anvil' : undefined} />; })()}
        </svg>
      </div>
      {!cutActive && <div style={{ position: 'absolute', top: 726, left: '50%', transform: 'translateX(-50%)', backgroundColor: '#0f172a', border: '3px solid #38bdf8', borderRadius: 12, padding: '6px 18px', fontFamily, fontSize: 15, color: '#38bdf8', zIndex: 25 }}>PULAU PINTAR</div>}
      <div style={{ position: 'absolute', top: 798, left: 0, right: 0, height: 10, opacity: cutActive ? 0 : 1, backgroundColor: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 25 }}>
        <div style={{ backgroundColor: '#1e293b', border: '4px solid #facc15', borderRadius: 14, padding: '6px 20px', fontFamily, fontSize: 22, color: '#facc15', boxShadow: '0 4px 0 #0f172a' }}>VS</div>
      </div>
      <div style={{ position: 'absolute', top: 850, left: 75, width: 930, height: 520 }}>
        <svg width="100%" height="100%" viewBox="0 0 440 260" shapeRendering="crispEdges">
          {renderTiles(true)}
          {caveOpen && <g transform={`translate(96, 80) scale(${cavePop})`}><rect x="-14" y="-12" width="28" height="22" fill="#0f172a" /><rect x="-10" y="0" width="20" height="10" fill="#ca8a04" /><rect x="-7" y="-3" width="14" height="7" fill="#facc15" />{Math.sin(frame * 0.45) > 0 ? <rect x="-4" y="-8" width="4" height="4" fill="#fef08a" /> : <rect x="4" y="-6" width="4" height="4" fill="#fff" />}</g>}
          {ISLAND_TREES.map((tr, i) => <g key={i} transform={`translate(${tr.x}, ${tr.y}) scale(${tr.size})`}>{frame >= tr.dumbBurnAt ? <rect x="-4" y="-3" width="8" height="4" fill="#292524" /> : <><rect x="-2" y="-5" width="4" height="7" fill="#78350f" /><rect x="-8" y="-13" width="16" height="9" fill="#854d0e" /><rect x="-5" y="-19" width="10" height="7" fill="#a16207" /></>}</g>)}
          {frame < 180 && <SvgHouse2 x={315} y={96} roof="#dc2626" tilted scale={0.85} />}
          <SvgHouse2 x={300} y={178} roof="#991b1b" tilted scale={0.82} />
          <g transform="translate(218, 128) scale(1.18)"><ellipse cx="0" cy="4" rx="18" ry="6" fill="rgba(15,23,42,0.35)" /><rect x="-16" y="-5" width="32" height="8" fill="#475569" /><rect x="-14" y="-35" width="28" height="31" fill="#0f172a" /><rect x="-13" y="-34" width="26" height="29" fill={goldStatue > 0.45 ? '#ca8a04' : '#94a3b8'} /><rect x="-10" y="-32" width="9" height="25" fill={goldStatue > 0.45 ? '#facc15' : '#cbd5e1'} /><rect x="-10" y="-26" width="20" height="4" fill={goldStatue > 0.45 ? '#854d0e' : '#475569'} />{goldStatue > 0.65 && Math.sin(frame * 0.4) > 0 && <rect x="6" y="-30" width="5" height="5" fill="#fef08a" />}</g>
          {fireLevel > 0.05 && [[224, 154], [182, 168], [262, 164], [308, 102], [150, 124], [258, 114]].map(([fx, fy], idx) => <SvgFire2 key={idx} x={fx} y={fy} frame={frame + idx * 9} scale={fireLevel * 1.15} />)}
          {DUMB_CITIZENS.map((c) => {
            const deadAge = frame - c.dieAt;
            if (c.id > 12 && deadAge > 0) return deadAge < 30 ? <g key={`g-${c.id}`} transform={`translate(${c.ax}, ${c.ay - deadAge * 0.9})`} opacity={1 - deadAge / 30}><Ep2Icon type="skull" size={11} /></g> : null;
            if (caveOpen) { const p = walkP(DUMB_GOLD_PATH, c.offset + frame * c.speed); return <SvgCitizen2 key={c.id} x={p.x + (c.id % 3 - 1) * 7} y={p.y + (c.id % 2) * 6} shirt="#dc2626" step={frame * 0.45 + c.id} flip={p.flip} carry="gold" bubble={c.id % 4 === 0 ? (goldStatue > 0.5 ? 'gold' : 'question') : undefined} />; }
            const t = (frame * 0.02 + c.offset) % 2, px = t < 1 ? c.ax + (c.bx - c.ax) * t : c.bx + (c.ax - c.bx) * (t - 1), py = t < 1 ? c.ay + (c.by - c.ay) * t : c.by + (c.ay - c.by) * (t - 1);
            return <SvgCitizen2 key={c.id} x={px} y={py} shirt="#dc2626" step={frame * 0.65 + c.id} flip={t >= 1} bubble={c.id % 3 === 0 ? 'panic' : undefined} />;
          })}
          {(() => { const up = caveOpen ? walkP([[118, 94], [198, 134], [140, 138]], frame * 0.005) : walkP([[175, 148], [240, 152], [210, 178]], frame * 0.012); return <SvgCitizen2 x={up.x} y={up.y} shirt="#991b1b" step={frame * 0.5} flip={up.flip} isLeader carry={caveOpen ? 'gold' : undefined} bubble={caveOpen ? 'question' : 'fire'} />; })()}
        </svg>
      </div>
      {!cutActive && <div style={{ position: 'absolute', top: 1370, left: '50%', transform: 'translateX(-50%)', backgroundColor: '#0f172a', border: '3px solid #f87171', borderRadius: 12, padding: '6px 18px', fontFamily, fontSize: 15, color: '#f87171', zIndex: 25 }}>PULAU BODOH • {dumbPop}</div>}
      {!cutActive && fireLevel > 0.3 && <div style={{ position: 'absolute', top: 848, left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(127, 29, 29, 0.94)', border: '3px solid #fb923c', borderRadius: 12, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8, zIndex: 32 }}><Ep2Icon type="fire" size={18} /><span style={{ fontFamily, fontSize: 12, color: '#fde047' }}>KEBAKARAN BESAR!</span></div>}
      {!cutActive && caveOpen && frame < 455 && <div style={{ position: 'absolute', top: 848, left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(113, 63, 18, 0.94)', border: '3px solid #fde047', borderRadius: 12, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8, zIndex: 32 }}><Ep2Icon type="gold" size={18} /><span style={{ fontFamily, fontSize: 12, color: '#fde047' }}>GUA EMAS DITEMUKAN!</span></div>}
      {!cutActive && hasShip && <div style={{ position: 'absolute', top: 204, left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(15, 23, 42, 0.94)', border: '3px solid #38bdf8', borderRadius: 12, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8, zIndex: 32 }}><Ep2Icon type="ship" size={18} /><span style={{ fontFamily, fontSize: 12, color: '#38bdf8' }}>KAPAL PERANG!</span></div>}
      {cutActive && <AbsoluteFill style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', opacity: Math.min(1, Math.max(udinPop, bimaPop)), zIndex: 35 }} />}
      {showUdinCut && <AbsoluteFill style={{ transform: `scale(${udinPop})`, zIndex: 38 }}><CloseUpUdinGold frame={frame} localFrame={frame - 455} /></AbsoluteFill>}
      {showBimaCut && <AbsoluteFill style={{ transform: `scale(${bimaPop})`, zIndex: 38 }}><CloseUpBimaForge frame={frame} localFrame={frame - 745} /></AbsoluteFill>}
      <div style={{ position: 'absolute', top: 82, left: '50%', transform: 'translateX(-50%)', padding: '6px 18px', borderRadius: 20, backgroundColor: 'rgba(15, 23, 42, 0.82)', border: '2px solid rgba(250, 204, 21, 0.6)', fontFamily: 'sans-serif', fontSize: 22, fontWeight: 'bold', color: '#f8fafc', zIndex: 45 }}>@dysesat</div>
      <div style={{ position: 'absolute', top: 138, left: 85, right: 85, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 45 }}>
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.92)', border: '3px solid #facc15', borderRadius: 14, padding: '10px 16px', fontFamily, fontSize: 17, color: '#facc15' }}>TAHUN: {year}</div>
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.92)', border: '3px solid #38bdf8', borderRadius: 14, padding: '10px 16px', fontFamily, fontSize: 15, color: '#38bdf8' }}>PINTAR: {smartPop}</div>
      </div>
      {activeWord && !showCliff && <div style={{ position: 'absolute', top: 1435, left: 70, right: 70, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 55, pointerEvents: 'none' }}><div style={{ fontFamily, fontSize: activeWord.w.length > 10 ? 32 : 40, color: getWordColor(activeWord.w), textAlign: 'center', padding: '12px 24px', borderRadius: 16, backgroundColor: 'rgba(15, 23, 42, 0.82)', border: `3px solid ${getWordColor(activeWord.w)}`, textShadow: '4px 4px 0 #0f172a, -3px -3px 0 #0f172a, 3px -3px 0 #0f172a, -3px 3px 0 #0f172a', transform: `scale(${0.65 + wordPop * 0.35}) rotate(${activeIdx % 2 === 0 ? -2 : 2}deg)` }}>{activeWord.w.toUpperCase()}</div></div>}
      {showCliff && <div style={{ position: 'absolute', top: 1435, left: 95, right: 95, backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '4px solid #facc15', borderRadius: 16, padding: '16px 20px', textAlign: 'center', fontFamily, fontSize: 21, color: '#facc15', boxShadow: '0 10px 28px rgba(0,0,0,0.6)', transform: `scale(${cliffIn * (1 + Math.sin(frame * 0.22) * 0.025)})`, zIndex: 55, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12 }}><span>BERSAMBUNG KE EPISODE 3</span><Ep2Icon type="ship" size={26} /></div>}
    </AbsoluteFill>
  );
};
