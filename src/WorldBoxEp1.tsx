import { CloseUpBima, CloseUpUdin } from './WorldBoxCutscenes';
import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PressStart2P';
import { whoosh, ding, mouseClick } from '@remotion/sfx';
import { WORD_SUBS } from './wbEp1Words';

const { fontFamily } = loadFont();

const COLS = 44;
const ROWS = 26;

type TileCell = { x: number; y: number; t: number; v: number };
const ISLAND_CELLS: TileCell[] = [];
const GRASS_SPOTS: { x: number; y: number }[] = [];

for (let gy = 0; gy < ROWS; gy++) {
  for (let gx = 0; gx < COLS; gx++) {
    const nx = (gx - 21.5) / 18.2;
    const ny = (gy - 12.5) / 10.2;
    const ang = Math.atan2(ny, nx);
    const wave = 0.13 * Math.sin(ang * 3 + 0.8) + 0.08 * Math.cos(ang * 5 - 0.5) + 0.04 * Math.sin(gx * 0.6 + gy * 0.4);
    const d = Math.sqrt(nx * nx + ny * ny) + wave;
    let t = 0;
    if (d <= 0.62) t = 4;
    else if (d <= 0.82) t = 3;
    else if (d <= 0.93) t = 2;
    else if (d <= 1.05) t = 1;
    if (t > 0) {
      ISLAND_CELLS.push({ x: gx * 10, y: gy * 10, t, v: random(`tv-${gx}-${gy}`) });
      if ((t === 3 || t === 4) && gx > 6 && gx < 37 && gy > 4 && gy < 21) {
        GRASS_SPOTS.push({ x: gx * 10 + 5, y: gy * 10 + 5 });
      }
    }
  }
}

type TreeData = { x: number; y: number; smartChopFrame: number; dumbChopFrame: number; size: number };
const ISLAND_TREES: TreeData[] = [];
for (let i = 0; i < 38; i++) {
  const pick = GRASS_SPOTS[Math.floor(random(`tr-idx-${i}`) * GRASS_SPOTS.length)];
  const inVillage = pick.x > 110 && pick.x < 345 && pick.y > 70 && pick.y < 190;
  ISLAND_TREES.push({
    x: pick.x,
    y: pick.y,
    smartChopFrame: inVillage ? 90 + Math.floor(random(`scf-${i}`) * 230) : 9999,
    dumbChopFrame: i < 33 ? 95 + Math.floor(random(`dcf-${i}`) * 330) : 9999,
    size: 0.88 + random(`ts-${i}`) * 0.28,
  });
}
ISLAND_TREES.sort((a, b) => a.y - b.y);

const SMART_HOUSES = [
  { x: 128, y: 86, at: 105 },
  { x: 172, y: 86, at: 155 },
  { x: 216, y: 86, at: 205 },
  { x: 128, y: 134, at: 255 },
  { x: 172, y: 134, at: 320 },
  { x: 128, y: 178, at: 380 },
  { x: 172, y: 178, at: 440 },
  { x: 216, y: 178, at: 495 },
];

const RAINDROPS = Array.from({ length: 34 }, (_, i) => ({
  x: random(`rx-${i}`) * 100,
  y: random(`ry-${i}`) * 100,
  sp: 13 + random(`rsp-${i}`) * 10,
}));

const PixelIcon: React.FC<{ type: 'bulb' | 'wheat' | 'fire' | 'panic' | 'question' | 'hungry' | 'skull' | 'crown' | 'sun'; size?: number }> = ({ type, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" shapeRendering="crispEdges">
    {type === 'crown' && (
      <>
        <rect x="1" y="7" width="10" height="3" fill="#facc15" />
        <rect x="1" y="3" width="2" height="4" fill="#facc15" />
        <rect x="5" y="2" width="2" height="5" fill="#fde047" />
        <rect x="9" y="3" width="2" height="4" fill="#facc15" />
        <rect x="2" y="8" width="2" height="1" fill="#ef4444" />
        <rect x="8" y="8" width="2" height="1" fill="#38bdf8" />
      </>
    )}
    {type === 'bulb' && (
      <>
        <rect x="3" y="1" width="6" height="5" fill="#fde047" />
        <rect x="4" y="6" width="4" height="2" fill="#facc15" />
        <rect x="4" y="8" width="4" height="2" fill="#64748b" />
        <rect x="4" y="2" width="2" height="2" fill="#ffffff" />
      </>
    )}
    {type === 'wheat' && (
      <>
        <rect x="5" y="2" width="2" height="9" fill="#ca8a04" />
        <rect x="3" y="2" width="2" height="2" fill="#fde047" />
        <rect x="7" y="3" width="2" height="2" fill="#fde047" />
        <rect x="3" y="5" width="2" height="2" fill="#facc15" />
        <rect x="7" y="6" width="2" height="2" fill="#facc15" />
      </>
    )}
    {type === 'fire' && (
      <>
        <rect x="3" y="5" width="6" height="6" fill="#ef4444" />
        <rect x="4" y="2" width="4" height="5" fill="#f97316" />
        <rect x="5" y="6" width="2" height="4" fill="#fde047" />
      </>
    )}
    {type === 'panic' && (
      <>
        <rect x="5" y="1" width="2" height="6" fill="#dc2626" />
        <rect x="5" y="9" width="2" height="2" fill="#dc2626" />
      </>
    )}
    {type === 'question' && (
      <>
        <rect x="3" y="1" width="6" height="2" fill="#1e293b" />
        <rect x="7" y="3" width="2" height="2" fill="#1e293b" />
        <rect x="5" y="5" width="2" height="2" fill="#1e293b" />
        <rect x="5" y="9" width="2" height="2" fill="#1e293b" />
      </>
    )}
    {type === 'hungry' && (
      <>
        <rect x="2" y="4" width="6" height="4" fill="#b45309" />
        <rect x="8" y="5" width="3" height="2" fill="#e2e8f0" />
        <rect x="2" y="2" width="2" height="2" fill="#dc2626" />
        <rect x="8" y="8" width="2" height="2" fill="#dc2626" />
        <rect x="4" y="4" width="4" height="4" fill="#ef4444" />
      </>
    )}
    {type === 'skull' && (
      <>
        <rect x="2" y="2" width="8" height="6" fill="#f8fafc" />
        <rect x="3" y="8" width="6" height="2" fill="#e2e8f0" />
        <rect x="3" y="4" width="2" height="2" fill="#0f172a" />
        <rect x="7" y="4" width="2" height="2" fill="#0f172a" />
      </>
    )}
    {type === 'sun' && (
      <>
        <rect x="3" y="3" width="6" height="6" fill="#fde047" />
        <rect x="5" y="0" width="2" height="2" fill="#facc15" />
        <rect x="5" y="10" width="2" height="2" fill="#facc15" />
        <rect x="0" y="5" width="2" height="2" fill="#facc15" />
        <rect x="10" y="5" width="2" height="2" fill="#facc15" />
      </>
    )}
  </svg>
);
const SvgTree: React.FC<{ x: number; y: number; chopFrame: number; frame: number; dry: boolean; size: number; sway: number }> = ({ x, y, chopFrame, frame, dry, size, sway }) => {
  const felled = frame >= chopFrame;
  const chopping = frame >= chopFrame - 18 && frame < chopFrame;
  const justFelled = frame >= chopFrame && frame < chopFrame + 16;
  const shakeX = chopping ? Math.sin(frame * 2.2) * 2.5 : 0;
  const fallAge = frame - chopFrame;

  return (
    <g transform={`translate(${x}, ${y}) scale(${size})`}>
      {felled ? (
        <>
          <rect x="-5" y="-1" width="10" height="4" fill="#451a03" />
          <rect x="-4" y="-4" width="8" height="4" fill="#78350f" />
          <rect x="-3" y="-4" width="6" height="2" fill="#d97706" />
          {justFelled && (
            <g opacity={Math.max(0, 1 - fallAge / 16)}>
              <rect x={-9 - fallAge * 0.7} y={-8 - fallAge * 0.4} width="3" height="3" fill="#d97706" />
              <rect x={6 + fallAge * 0.8} y={-10 - fallAge * 0.3} width="3" height="3" fill="#22c55e" />
              <rect x={-2 + fallAge * 0.3} y={-12 - fallAge * 0.6} width="4" height="4" fill="#f8fafc" />
            </g>
          )}
        </>
      ) : (
        <>
          <ellipse cx="0" cy="2" rx="8" ry="3" fill="rgba(15,23,42,0.28)" />
          <rect x="-2" y="-5" width="4" height="7" fill="#78350f" />
          <g transform={`translate(${sway + shakeX}, 0)`}>
            <rect x="-8" y="-13" width="16" height="9" fill={dry ? '#854d0e' : '#166534'} />
            <rect x="-6" y="-18" width="12" height="7" fill={dry ? '#a16207' : '#15803d'} />
            <rect x="-4" y="-21" width="8" height="4" fill={dry ? '#ca8a04' : '#22c55e'} />
            <rect x="-3" y="-19" width="3" height="3" fill={dry ? '#eab308' : '#4ade80'} />
          </g>
        </>
      )}
    </g>
  );
};

const SvgHouse: React.FC<{ x: number; y: number; roof: string; tilted?: boolean; scale?: number; smokeFrame?: number; builtAge?: number }> = ({ x, y, roof, tilted = false, scale = 1, smokeFrame, builtAge = 99 }) => (
  <g transform={`translate(${x}, ${y}) rotate(${tilted ? 11 : 0}) scale(${scale})`}>
    <rect x="-12" y="2" width="24" height="4" fill="rgba(15,23,42,0.3)" />
    <rect x="-11" y="-11" width="22" height="14" fill="#0f172a" />
    <rect x="-10" y="-10" width="20" height="12" fill="#d97706" />
    <rect x="-10" y="-10" width="20" height="2" fill="#92400e" />
    <rect x="-3" y="-4" width="6" height="6" fill="#451a03" />
    <rect x="4" y="-7" width="4" height="4" fill="#fef08a" />
    {smokeFrame !== undefined && (
      <>
        <rect x="6" y="-23" width="4" height="7" fill="#64748b" />
        <rect x={6 + Math.sin(smokeFrame * 0.1) * 2.5} y={-27 - (smokeFrame % 16)} width="4" height="4" fill="#f8fafc" opacity={0.68 - (smokeFrame % 16) / 24} />
      </>
    )}
    <rect x="-14" y="-16" width="28" height="7" fill="#0f172a" />
    <rect x="-13" y="-15" width="26" height="5" fill={roof} />
    <rect x="-10" y="-19" width="20" height="4" fill={roof} />
    <rect x="-6" y="-21" width="12" height="2" fill="#f8fafc" opacity="0.3" />
    {builtAge >= 0 && builtAge < 18 && (
      <g opacity={1 - builtAge / 18}>
        <rect x={-16 - builtAge * 0.5} y={-2 - builtAge * 0.3} width="5" height="5" fill="#f8fafc" />
        <rect x={12 + builtAge * 0.5} y={-4 - builtAge * 0.4} width="5" height="5" fill="#f8fafc" />
        <rect x={-2} y={-24 - builtAge * 0.5} width="4" height="4" fill="#fde047" />
      </g>
    )}
  </g>
);

const SvgStatue: React.FC<{ x: number; y: number; scale: number }> = ({ x, y, scale }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    <ellipse cx="0" cy="4" rx="18" ry="6" fill="rgba(15,23,42,0.35)" />
    <rect x="-17" y="-6" width="34" height="10" fill="#0f172a" />
    <rect x="-16" y="-5" width="32" height="8" fill="#475569" />
    <rect x="-14" y="-35" width="28" height="31" fill="#0f172a" />
    <rect x="-13" y="-34" width="26" height="29" fill="#94a3b8" />
    <rect x="-10" y="-32" width="8" height="25" fill="#cbd5e1" opacity="0.5" />
    <rect x="-10" y="-26" width="20" height="4" fill="#475569" />
    <rect x="-3" y="-22" width="6" height="10" fill="#64748b" />
    <rect x="-7" y="-10" width="14" height="3" fill="#334155" />
  </g>
);

const SvgFire: React.FC<{ x: number; y: number; frame: number; scale: number }> = ({ x, y, frame, scale }) => {
  const f1 = Math.sin(frame * 0.7) * 2;
  const f2 = Math.cos(frame * 0.9) * 2.5;
  const glow = 0.24 + Math.sin(frame * 0.5) * 0.08;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <ellipse cx="0" cy="2" rx="22" ry="9" fill="#f97316" opacity={glow} />
      <rect x="-15" y="0" width="30" height="6" fill="#451a03" />
      <rect x="-11" y="-3" width="22" height="4" fill="#78350f" />
      <rect x="-12" y={-12 + f1} width="24" height="13" fill="#dc2626" />
      <rect x="-9" y={-19 + f2} width="18" height="15" fill="#f97316" />
      <rect x="-6" y={-24 - f1} width="5" height="9" fill="#f97316" />
      <rect x="2" y={-22 + f1} width="4" height="8" fill="#fb923c" />
      <rect x="-5" y={-14 - f1} width="10" height="11" fill="#fde047" />
      {[0, 1, 2, 3].map((i) => {
        const lift = (frame * 2.2 + i * 11) % 38;
        return (
          <rect
            key={`sp-${i}`}
            x={-11 + i * 7 + Math.sin(frame * 0.28 + i) * 5}
            y={-18 - lift}
            width="2.6"
            height="2.6"
            fill={i % 2 === 0 ? '#fde047' : '#fb923c'}
            opacity={Math.max(0, 1 - lift / 38)}
          />
        );
      })}
      {[0, 1, 2].map((i) => {
        const lift = (frame * 1.4 + i * 16) % 44;
        return (
          <rect
            key={`sm-${i}`}
            x={-6 + Math.sin((frame + i * 20) * 0.12) * 8}
            y={-26 - lift}
            width={10 + i * 2}
            height={7}
            fill="#1e293b"
            opacity={Math.max(0, 0.72 - lift / 52)}
          />
        );
      })}
    </g>
  );
};

const SvgCitizen: React.FC<{
  x: number; y: number; shirt: string; step: number; flip?: boolean; isLeader?: boolean; carry?: 'wood' | 'wheat'; bubble?: 'bulb' | 'wheat' | 'fire' | 'panic' | 'question' | 'hungry' | 'skull';
}> = ({ x, y, shirt, step, flip = false, isLeader = false, carry, bubble }) => {
  const s = Math.sin(step);
  const bob = Math.abs(s) * 2.5;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="2" rx="4.5" ry="1.8" fill="rgba(15,23,42,0.35)" />
      <g transform={`translate(0, ${-bob}) scale(${flip ? -1 : 1}, 1)`}>
        <rect x="-3" y={s > 0 ? -3 : -1} width="2" height="3" fill="#0f172a" />
        <rect x="1" y={s < 0 ? -3 : -1} width="2" height="3" fill="#0f172a" />
        <rect x="-4.5" y="-9.5" width="9" height="7.5" fill="#0f172a" />
        <rect x="-3.5" y="-8.5" width="7" height="6" fill={shirt} />
        <rect x="-3.5" y="-14.5" width="7" height="6" fill="#0f172a" />
        <rect x="-2.8" y="-13.8" width="5.6" height="4.8" fill="#fed7aa" />
        <rect x="-3" y="-15" width="6" height="2" fill="#451a03" />
        <rect x="1" y="-12" width="1.4" height="1.4" fill="#0f172a" />
        {carry === 'wood' && <rect x="2" y="-8" width="7" height="3" fill="#92400e" />}
        {carry === 'wheat' && <rect x="2" y="-9" width="5" height="4" fill="#facc15" />}
        {isLeader && (
          <>
            <rect x="-4" y="-18" width="8" height="3" fill="#facc15" />
            <rect x="-4" y="-20" width="2" height="2" fill="#fde047" />
            <rect x="-1" y="-21" width="2" height="3" fill="#fde047" />
            <rect x="2" y="-20" width="2" height="2" fill="#fde047" />
          </>
        )}
      </g>
      {bubble && (
        <g transform="translate(4, -30)">
          <rect x="0" y="0" width="14" height="13" rx="2" fill="#ffffff" stroke="#0f172a" strokeWidth="1.2" />
          <g transform="translate(2, 1.5)"><PixelIcon type={bubble} size={10} /></g>
        </g>
      )}
    </g>
  );
};

const SMART_PATHS = [
  [[108, 113], [160, 113], [248, 113], [264, 113], [264, 155], [248, 155], [160, 113]],
  [[126, 156], [248, 156], [248, 86], [172, 113], [126, 113]],
  [[250, 92], [266, 114], [266, 168], [248, 168], [248, 113]],
];

const SMART_CITIZENS = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  pathIdx: i % SMART_PATHS.length,
  offset: (i * 0.17) % 1,
  speed: 0.0022 + random(`smc-${i}`) * 0.0012,
  jx: (random(`sjx-${i}`) - 0.5) * 10,
  jy: (random(`sjy-${i}`) - 0.5) * 10,
}));

const DUMB_CITIZENS = Array.from({ length: 24 }, (_, i) => {
  const edge = i % 4;
  const fleeX = edge === 0 ? 75 + random(`fx-${i}`) * 35 : edge === 1 ? 330 + random(`fx-${i}`) * 35 : 110 + random(`fx-${i}`) * 220;
  const fleeY = edge === 2 ? 52 + random(`fy-${i}`) * 20 : edge === 3 ? 190 + random(`fy-${i}`) * 22 : 70 + random(`fy-${i}`) * 120;
  return {
    id: i,
    ax: 100 + random(`da-${i}`) * 240, ay: 70 + random(`day-${i}`) * 120,
    bx: 100 + random(`db-${i}`) * 240, by: 70 + random(`dby-${i}`) * 120,
    cx: 100 + random(`dc-${i}`) * 240, cy: 70 + random(`dcy-${i}`) * 120,
    fleeX, fleeY,
    speed: 0.015 + random(`ds-${i}`) * 0.014,
    phase: random(`dp-${i}`) * 10,
    dieAt: 645 + Math.floor(random(`dd-${i}`) * 255),
  };
});

function walkPath(pts: number[][], t: number) {
  const segs = pts.length - 1;
  const s = ((t % 1) + 1) % 1 * segs;
  const i = Math.floor(s);
  const f = s - i;
  const [x1, y1] = pts[i];
  const [x2, y2] = pts[i + 1];
  return { x: x1 + (x2 - x1) * f, y: y1 + (y2 - y1) * f, flip: x2 < x1 };
}
const getWordColor = (word: string) => {
  const clean = word.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (['pintar', 'bima', 'gandum', 'lumbung', 'rapi', 'aman'].includes(clean)) return '#38bdf8';
  if (['bodoh', 'udin', 'kelaparan', 'menyusut', 'drastis', 'membakar', 'bencana', 'kemarau'].includes(clean)) return '#f87171';
  if (['seratus', '100', 'lima', 'puluh', '50', 'patung', 'raksasa', 'kedelapan', 'kedua', 'belas'].includes(clean)) return '#fde047';
  return '#ffffff';
};

export const WorldBoxEp1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sec = frame / fps;

  const year = Math.min(12, Math.floor(interpolate(frame, [0, 625, 1040], [1, 8, 12.9], { extrapolateRight: 'clamp' })));

  const smartPop = year < 6
    ? Math.floor(interpolate(frame, [0, 500], [100, 114], { extrapolateRight: 'clamp' }))
    : Math.floor(interpolate(frame, [500, 1150], [114, 135], { extrapolateRight: 'clamp' }));

  const dumbPop = year < 8
    ? 100
    : Math.floor(interpolate(frame, [635, 955], [100, 54], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));

  const drought = interpolate(frame, [615, 645, 935, 965], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const isDry = drought > 0.45;
  const isRaining = frame >= 940 && frame <= 1005;
  const fireActive = frame >= 990;
  const fireScale = fireActive ? spring({ frame: frame - 990, fps, config: { damping: 8 } }) : 0;
  const fireSpread2 = frame >= 1012 ? spring({ frame: frame - 1012, fps, config: { damping: 9 } }) : 0;
  const fireSpread3 = frame >= 1030 ? spring({ frame: frame - 1030, fps, config: { damping: 9 } }) : 0;

  const statueScale = interpolate(frame, [160, 580], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const spawnFlash = interpolate(frame, [0, 22, 62], [0, 1, 0], { extrapolateRight: 'clamp' });

  // Cutscene Bima berakhir tepat sebelum narasi pindah ke Kubu Bodoh (frame 275 - 412)
  const showBimaCut = frame >= 275 && frame <= 412;
  const showUdinCut = frame >= 1055;
  const cutActive = showBimaCut || showUdinCut;
  const bimaPop = showBimaCut ? spring({ frame: frame - 275, fps, config: { damping: 12 } }) : 0;
  const udinPop = showUdinCut ? spring({ frame: frame - 1055, fps, config: { damping: 12 } }) : 0;

  const lastWordEnd = WORD_SUBS.length > 0 ? WORD_SUBS[WORD_SUBS.length - 1].e : 39.2;
  const cliffFrame = Math.min(1195, Math.ceil((lastWordEnd + 0.12) * fps));
  const showCliff = frame >= cliffFrame;
  const cliffIn = showCliff ? spring({ frame: frame - cliffFrame, fps, config: { damping: 10 } }) : 0;

  const activeWordIdx = WORD_SUBS.findIndex((item) => sec >= item.s && sec < item.e);
  const activeWord = activeWordIdx >= 0 ? WORD_SUBS[activeWordIdx] : null;
  const wordPop = activeWord
    ? spring({ frame: Math.max(0, frame - Math.floor(activeWord.s * fps)), fps, config: { damping: 11, stiffness: 280, mass: 0.5 } })
    : 0;

  const shoreWave = Math.sin(frame * 0.14) * 0.22 + 0.78;
  const treeSway = Math.sin(frame * 0.08) * 0.9;

  const renderBaseTiles = (showRoads: boolean) => (
    <g>
      {ISLAND_CELLS.map((c, idx) => {
        let fill = '#38bdf8';
        let op = 1;
        if (c.t === 1) {
          fill = c.v > 0.72 ? '#7dd3fc' : '#38bdf8';
          op = shoreWave;
        } else if (c.t === 2) {
          fill = c.v > 0.8 ? '#fef08a' : '#fde047';
        } else if (c.t === 3) {
          fill = isDry ? (c.v > 0.75 ? '#ca8a04' : '#b48a3e') : (c.v > 0.78 ? '#86efac' : '#4ade80');
        } else if (c.t === 4) {
          fill = isDry ? (c.v > 0.75 ? '#a16207' : '#926c2a') : (c.v > 0.78 ? '#16a34a' : '#22c55e');
        }
        return <rect key={idx} x={c.x} y={c.y} width="10.4" height="10.4" fill={fill} opacity={op} />;
      })}
      <rect x="85" y="75" width="22" height="14" fill="#64748b" />
      <rect x="92" y="68" width="14" height="10" fill="#cbd5e1" />
      {showRoads && (
        <g opacity="0.88">
          <rect x="122" y="109" width="148" height="9" fill="#d97706" />
          <rect x="246" y="80" width="9" height="104" fill="#d97706" />
        </g>
      )}
    </g>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#1d4ed8', overflow: 'hidden' }}>
      <Audio src={staticFile('vo_wb_ep1.mp3')} volume={1} />
      <Audio src={staticFile('bgm_wb.wav')} volume={0.28} />
      <Sequence from={5} durationInFrames={30}><Audio src={staticFile('sfx_wb_spawn.wav')} volume={0.55} /></Sequence>
      {[95, 145, 195, 240].map((fr) => (<Sequence key={`ch-${fr}`} from={fr} durationInFrames={15}><Audio src={staticFile('sfx_wb_chop.wav')} volume={0.34} /></Sequence>))}
      {[105, 155, 205, 255, 320, 440, 495].map((fr) => (<Sequence key={`bd-${fr}`} from={fr} durationInFrames={10}><Audio src={staticFile('sfx_wb_build.wav')} volume={0.38} /></Sequence>))}
      <Sequence from={275} durationInFrames={35}><Audio src={whoosh} volume={0.45} /></Sequence>
      <Sequence from={408} durationInFrames={35}><Audio src={whoosh} volume={0.35} /></Sequence>
      <Sequence from={510} durationInFrames={20}><Audio src={staticFile('sfx_wb_statue.wav')} volume={0.5} /></Sequence>
      <Sequence from={620} durationInFrames={50}><Audio src={staticFile('sfx_wb_drought.wav')} volume={0.25} /></Sequence>
      <Sequence from={625} durationInFrames={25}><Audio src={mouseClick} volume={0.35} /></Sequence>
      {[690, 750, 810, 870].map((fr) => (<Sequence key={`dt-${fr}`} from={fr} durationInFrames={12}><Audio src={staticFile('sfx_wb_death.wav')} volume={0.28} /></Sequence>))}
      <Sequence from={940} durationInFrames={70}><Audio src={staticFile('sfx_wb_rain.wav')} volume={0.25} /></Sequence>
      <Sequence from={990} durationInFrames={265}><Audio src={staticFile('sfx_wb_fire.wav')} volume={0.22} /></Sequence>
      <Sequence from={1055} durationInFrames={40}><Audio src={whoosh} volume={0.5} /></Sequence>
      <Sequence from={cliffFrame} durationInFrames={60}><Audio src={ding} volume={0.55} /></Sequence>

      <AbsoluteFill style={{
        backgroundImage: 'radial-gradient(#38bdf8 4px, transparent 4px)',
        backgroundSize: '46px 46px',
        backgroundPosition: `${(frame * 0.8) % 46}px ${(frame * 0.35) % 46}px`,
        opacity: 0.38,
      }} />

      {/* === PULAU ATAS: PULAU PINTAR === */}
      <div style={{ position: 'absolute', top: 205, left: 75, width: 930, height: 520 }}>
        <svg width="100%" height="100%" viewBox="0 0 440 260" shapeRendering="crispEdges">
          {renderBaseTiles(year >= 3)}

          {year >= 4 && (
            <g>
              <rect x="270" y="96" width="68" height="72" fill="#92400e" />
              {[0, 1, 2, 3].map((r) => [0, 1, 2, 3].map((c) => (
                <rect key={`${r}-${c}`} x={275 + c * 15} y={101 + r * 16} width="10" height="10" fill={isDry ? '#ca8a04' : '#fde047'} />
              )))}
              <SvgHouse x={294} y={84} roof="#f59e0b" scale={0.95} builtAge={frame - 280} />
            </g>
          )}

          {ISLAND_TREES.map((tr, i) => (
            <SvgTree key={i} x={tr.x} y={tr.y} chopFrame={tr.smartChopFrame} frame={frame} dry={isDry} size={tr.size} sway={treeSway} />
          ))}

          {SMART_HOUSES.filter((h) => frame >= h.at).map((h, idx) => (
            <SvgHouse
              key={idx}
              x={h.x}
              y={h.y}
              roof="#2563eb"
              scale={spring({ frame: frame - h.at, fps, config: { damping: 10 } })}
              smokeFrame={idx % 2 === 0 ? frame + idx * 9 : undefined}
              builtAge={frame - h.at}
            />
          ))}

          {year >= 11 && (
            <>
              <g transform="translate(105, 62)"><rect x="-7" y="-22" width="14" height="24" fill="#94a3b8" /><rect x="-9" y="-26" width="18" height="6" fill="#64748b" /><rect x="2" y="-34" width="8" height="5" fill="#38bdf8" /></g>
              <g transform="translate(334, 62)"><rect x="-7" y="-22" width="14" height="24" fill="#94a3b8" /><rect x="-9" y="-26" width="18" height="6" fill="#64748b" /><rect x="2" y="-34" width="8" height="5" fill="#38bdf8" /></g>
            </>
          )}

          {SMART_CITIZENS.map((c) => {
            const p = walkPath(SMART_PATHS[c.pathIdx], c.offset + frame * c.speed);
            return (
              <SvgCitizen
                key={c.id}
                x={p.x + c.jx}
                y={p.y + c.jy}
                shirt="#2563eb"
                step={frame * 0.35 + c.id}
                flip={p.flip}
                carry={c.id % 3 === 0 ? 'wood' : year >= 4 && c.id % 4 === 0 ? 'wheat' : undefined}
                bubble={c.id === 2 && year >= 4 && year <= 6 ? 'wheat' : undefined}
              />
            );
          })}

          {(() => {
            const bp = walkPath([[215, 113], [262, 113], [262, 148], [215, 148]], frame * 0.003);
            return <SvgCitizen x={bp.x} y={bp.y} shirt="#1e40af" step={frame * 0.28} flip={bp.flip} isLeader bubble={year >= 3 && year <= 6 ? 'bulb' : undefined} />;
          })()}

          <rect x={((frame * 0.45) % 480) - 40} y="42" width="38" height="12" fill="#ffffff" opacity="0.28" />
          {spawnFlash > 0 && <rect x="40" y="30" width="360" height="200" rx="50" fill="#7dd3fc" opacity={spawnFlash * 0.55} />}
        </svg>
      </div>

      {!cutActive && (
        <div style={{
          position: 'absolute', top: 726, left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#0f172a', border: '3px solid #38bdf8', borderRadius: 12,
          padding: '6px 18px', fontFamily, fontSize: 15, color: '#38bdf8', zIndex: 25,
        }}>
          PULAU PINTAR
        </div>
      )}

      {/* === GARIS PEMISAH VS === */}
      <div style={{
        position: 'absolute', top: 798, left: 0, right: 0, height: 10, opacity: cutActive ? 0 : 1,
        backgroundColor: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 25,
      }}>
        <div style={{
          backgroundColor: '#1e293b', border: '4px solid #facc15', borderRadius: 14,
          padding: '6px 20px', fontFamily, fontSize: 22, color: '#facc15', boxShadow: '0 4px 0 #0f172a',
        }}>
          VS
        </div>
      </div>

      {/* === PULAU BAWAH: PULAU BODOH === */}
      <div style={{ position: 'absolute', top: 850, left: 75, width: 930, height: 520 }}>
        <svg width="100%" height="100%" viewBox="0 0 440 260" shapeRendering="crispEdges">
          {renderBaseTiles(false)}

          {ISLAND_TREES.map((tr, i) => (
            <SvgTree key={i} x={tr.x} y={tr.y} chopFrame={tr.dumbChopFrame} frame={frame} dry={isDry} size={tr.size} sway={treeSway} />
          ))}

          {year >= 3 && (
            <>
              <SvgHouse x={315} y={96} roof="#dc2626" tilted scale={0.85} builtAge={frame - 180} />
              <SvgHouse x={300} y={178} roof="#dc2626" tilted scale={0.82} builtAge={frame - 220} />
            </>
          )}

          {statueScale > 0.08 && <SvgStatue x={218} y={128} scale={statueScale * 1.15} />}
          {fireActive && <SvgFire x={224} y={154} frame={frame} scale={fireScale * 1.35} />}
          {fireSpread2 > 0.05 && <SvgFire x={186} y={168} frame={frame + 12} scale={fireSpread2 * 1.05} />}
          {fireSpread3 > 0.05 && <SvgFire x={256} y={166} frame={frame + 24} scale={fireSpread3 * 1.0} />}

          {DUMB_CITIZENS.map((c) => {
            const deadAge = frame - c.dieAt;
            const isDead = year >= 8 && deadAge > 0 && c.id > 12;
            if (isDead) {
              if (deadAge < 32) {
                return (
                  <g key={`ghost-${c.id}`} transform={`translate(${c.bx}, ${c.by - deadAge * 0.9})`} opacity={1 - deadAge / 32}>
                    <PixelIcon type="skull" size={11} />
                  </g>
                );
              }
              return null;
            }
            const t = (frame * c.speed + c.phase) % 3;
            let px = c.ax, py = c.ay, flip = false;
            if (t < 1) { px = c.ax + (c.bx - c.ax) * t; py = c.ay + (c.by - c.ay) * t; flip = c.bx < c.ax; }
            else if (t < 2) { px = c.bx + (c.cx - c.bx) * (t - 1); py = c.by + (c.cy - c.by) * (t - 1); flip = c.cx < c.bx; }
            else { px = c.cx + (c.ax - c.cx) * (t - 2); py = c.cy + (c.ay - c.cy) * (t - 2); flip = c.ax < c.cx; }

            if (fireActive) {
              const fleeP = Math.min(1, (frame - 990) / (30 + (c.id % 5) * 6));
              px = px + (c.fleeX - px) * fleeP + Math.sin(frame * 0.45 + c.id) * 5;
              py = py + (c.fleeY - py) * fleeP + Math.cos(frame * 0.4 + c.id) * 4;
              flip = c.fleeX < 224;
            }

            let bub: 'panic' | 'hungry' | 'question' | undefined = undefined;
            if (fireActive && c.id % 3 === 0) bub = 'panic';
            else if (isDry && c.id % 3 === 0) bub = 'hungry';
            else if (year < 6 && c.id % 5 === 0) bub = 'question';

            return <SvgCitizen key={c.id} x={px} y={py} shirt="#dc2626" step={frame * (fireActive ? 0.65 : 0.4) + c.id} flip={flip} bubble={bub} />;
          })}

          {(() => {
            const up = walkPath([[185, 146], [235, 146], [220, 172], [180, 165]], frame * (fireActive ? 0.012 : 0.006));
            return <SvgCitizen x={up.x} y={up.y} shirt="#991b1b" step={frame * 0.5} flip={up.flip} isLeader bubble={fireActive ? 'fire' : isDry ? 'skull' : 'question'} />;
          })()}

          <rect x={((frame * 0.35 + 180) % 480) - 40} y="188" width="42" height="12" fill="#ffffff" opacity="0.25" />
          {spawnFlash > 0 && <rect x="40" y="30" width="360" height="200" rx="50" fill="#fca5a5" opacity={spawnFlash * 0.55} />}
        </svg>
      </div>

      {!cutActive && (
        <div style={{
          position: 'absolute', top: 1370, left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#0f172a', border: '3px solid #f87171', borderRadius: 12,
          padding: '6px 18px', fontFamily, fontSize: 15, color: '#f87171', zIndex: 25,
        }}>
          PULAU BODOH • {dumbPop}
        </div>
      )}

      {/* Efek Cuaca Kemarau, Banner Event & Hujan */}
      {drought > 0 && (
        <AbsoluteFill style={{ background: `radial-gradient(circle at 80% 15%, rgba(253, 224, 71, ${drought * 0.34}), rgba(245, 158, 11, ${drought * 0.16}))`, pointerEvents: 'none', zIndex: 28 }} />
      )}
      {isDry && !cutActive && (
        <div style={{
          position: 'absolute', top: 204, left: '50%', transform: 'translateX(-50%)',
          backgroundColor: 'rgba(120, 53, 15, 0.92)', border: '3px solid #fde047',
          borderRadius: 12, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8, zIndex: 32,
        }}>
          <PixelIcon type="sun" size={18} />
          <span style={{ fontFamily, fontSize: 12, color: '#fde047' }}>KEMARAU PANJANG!</span>
        </div>
      )}
      {fireActive && !cutActive && (
        <div style={{
          position: 'absolute', top: 848, left: '50%', transform: 'translateX(-50%)',
          backgroundColor: 'rgba(127, 29, 29, 0.94)', border: '3px solid #fb923c',
          borderRadius: 12, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8, zIndex: 32,
        }}>
          <PixelIcon type="fire" size={18} />
          <span style={{ fontFamily, fontSize: 12, color: '#fde047' }}>KEBAKARAN!</span>
        </div>
      )}
      {isRaining && !cutActive && (
        <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 29 }}>
          {RAINDROPS.map((r, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${(r.x - frame * 0.4 + 200) % 100}%`,
              top: `${(r.y + frame * r.sp * 0.28) % 100}%`,
              width: 3, height: 24, backgroundColor: '#bae6fd', opacity: 0.6, transform: 'rotate(10deg)',
            }} />
          ))}
        </AbsoluteFill>
      )}

      {/* Backdrop Gelap + 2 Adegan Cutscene Close-Up */}
      {cutActive && <AbsoluteFill style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', opacity: Math.min(1, Math.max(bimaPop, udinPop)), zIndex: 35 }} />}
      {showBimaCut && (
        <AbsoluteFill style={{ transform: `scale(${bimaPop})`, zIndex: 38 }}>
          <CloseUpBima frame={frame} localFrame={frame - 275} />
        </AbsoluteFill>
      )}
      {showUdinCut && (
        <AbsoluteFill style={{ transform: `scale(${udinPop})`, zIndex: 38 }}>
          <CloseUpUdin frame={frame} localFrame={frame - 1055} />
        </AbsoluteFill>
      )}

      {/* === HUD TETAP ZONA AMAN TIKTOK === */}
      <div style={{
        position: 'absolute', top: 82, left: '50%', transform: 'translateX(-50%)',
        padding: '6px 18px', borderRadius: 20, backgroundColor: 'rgba(15, 23, 42, 0.82)',
        border: '2px solid rgba(250, 204, 21, 0.6)', fontFamily: 'sans-serif',
        fontSize: 22, fontWeight: 'bold', color: '#f8fafc', zIndex: 45,
      }}>
        @dysesat
      </div>

      <div style={{
        position: 'absolute', top: 138, left: 85, right: 85,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 45,
      }}>
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.92)', border: '3px solid #facc15',
          borderRadius: 14, padding: '10px 16px', fontFamily, fontSize: 17, color: '#facc15',
        }}>
          TAHUN: {year}
        </div>
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.92)', border: '3px solid #38bdf8',
          borderRadius: 14, padding: '10px 16px', fontFamily, fontSize: 15, color: '#38bdf8',
        }}>
          PINTAR: {smartPop}
        </div>
      </div>

      {/* === SUBTITLE POP-UP PER KATA === */}
      {activeWord && !showCliff && (
        <div style={{
          position: 'absolute', top: 1435, left: 70, right: 70,
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 55,
          pointerEvents: 'none',
        }}>
          <div style={{
            fontFamily,
            fontSize: activeWord.w.length > 10 ? 32 : 40,
            color: getWordColor(activeWord.w),
            textAlign: 'center',
            padding: '12px 24px',
            borderRadius: 16,
            backgroundColor: 'rgba(15, 23, 42, 0.82)',
            border: `3px solid ${getWordColor(activeWord.w)}`,
            textShadow: '4px 4px 0 #0f172a, -3px -3px 0 #0f172a, 3px -3px 0 #0f172a, -3px 3px 0 #0f172a',
            transform: `scale(${0.65 + wordPop * 0.35}) rotate(${activeWordIdx % 2 === 0 ? -2 : 2}deg)`,
          }}>
            {activeWord.w.toUpperCase()}
          </div>
        </div>
      )}

      {showCliff && (
        <div style={{
          position: 'absolute', top: 1435, left: 95, right: 95,
          backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '4px solid #facc15',
          borderRadius: 16, padding: '16px 20px', textAlign: 'center',
          fontFamily, fontSize: 21, color: '#facc15', boxShadow: '0 10px 28px rgba(0,0,0,0.6)', transform: `scale(${cliffIn * (1 + Math.sin(frame * 0.22) * 0.025)})`, zIndex: 55,
          display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12,
        }}>
          <span>BERSAMBUNG KE EPISODE 2</span>
          <PixelIcon type="fire" size={24} />
        </div>
      )}
    </AbsoluteFill>
  );
};
