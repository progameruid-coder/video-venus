import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PressStart2P';
import { whoosh, ding, mouseClick } from '@remotion/sfx';
import { WORD_SUBS } from './wbEp1Words';

const { fontFamily } = loadFont();

const COLS = 44;
const ROWS = 26;

type TileCell = { x: number; y: number; t: number };
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
      ISLAND_CELLS.push({ x: gx * 10, y: gy * 10, t });
      if ((t === 3 || t === 4) && gx > 6 && gx < 37 && gy > 4 && gy < 21) {
        GRASS_SPOTS.push({ x: gx * 10 + 5, y: gy * 10 + 5 });
      }
    }
  }
}

type TreeData = { x: number; y: number; smartChop: number; dumbChop: number; size: number };
const ISLAND_TREES: TreeData[] = [];
for (let i = 0; i < 38; i++) {
  const pick = GRASS_SPOTS[Math.floor(random(`tr-idx-${i}`) * GRASS_SPOTS.length)];
  const inVillage = pick.x > 110 && pick.x < 345 && pick.y > 70 && pick.y < 190;
  ISLAND_TREES.push({
    x: pick.x,
    y: pick.y,
    smartChop: inVillage ? 2 + Math.floor(random(`sc-${i}`) * 3) : 99,
    dumbChop: i < 33 ? 2 + Math.floor(random(`dc-${i}`) * 4) : 99,
    size: 0.88 + random(`ts-${i}`) * 0.28,
  });
}
ISLAND_TREES.sort((a, b) => a.y - b.y);

const SMART_HOUSES = [
  [128, 86], [172, 86], [216, 86],
  [128, 134], [172, 134],
  [128, 178], [172, 178], [216, 178],
];

const RAINDROPS = Array.from({ length: 28 }, (_, i) => ({
  x: random(`rx-${i}`) * 100,
  y: random(`ry-${i}`) * 100,
  sp: 12 + random(`rsp-${i}`) * 10,
}));

const PixelIcon: React.FC<{ type: 'bulb' | 'wheat' | 'fire' | 'panic' | 'question' | 'hungry' | 'skull' | 'crown'; size?: number }> = ({ type, size = 18 }) => (
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
  </svg>
);
const SvgTree: React.FC<{ x: number; y: number; felled: boolean; dry: boolean; size: number; sway: number }> = ({ x, y, felled, dry, size, sway }) => (
  <g transform={`translate(${x}, ${y}) scale(${size})`}>
    {felled ? (
      <>
        <rect x="-5" y="-1" width="10" height="4" fill="#451a03" />
        <rect x="-4" y="-4" width="8" height="4" fill="#78350f" />
        <rect x="-3" y="-4" width="6" height="2" fill="#d97706" />
      </>
    ) : (
      <>
        <ellipse cx="0" cy="2" rx="8" ry="3" fill="rgba(15,23,42,0.28)" />
        <rect x="-2" y="-5" width="4" height="7" fill="#78350f" />
        <g transform={`translate(${sway}, 0)`}>
          <rect x="-8" y="-13" width="16" height="9" fill={dry ? '#854d0e' : '#166534'} />
          <rect x="-6" y="-18" width="12" height="7" fill={dry ? '#a16207' : '#15803d'} />
          <rect x="-4" y="-21" width="8" height="4" fill={dry ? '#ca8a04' : '#22c55e'} />
          <rect x="-3" y="-19" width="3" height="3" fill={dry ? '#eab308' : '#4ade80'} />
        </g>
      </>
    )}
  </g>
);

const SvgHouse: React.FC<{ x: number; y: number; roof: string; tilted?: boolean; scale?: number; smokeFrame?: number }> = ({ x, y, roof, tilted = false, scale = 1, smokeFrame }) => (
  <g transform={`translate(${x}, ${y}) rotate(${tilted ? 11 : 0}) scale(${scale})`}>
    <rect x="-12" y="2" width="24" height="4" fill="rgba(15,23,42,0.3)" />
    <rect x="-10" y="-10" width="20" height="13" fill="#d97706" />
    <rect x="-10" y="-10" width="20" height="2" fill="#92400e" />
    <rect x="-3" y="-4" width="6" height="7" fill="#451a03" />
    <rect x="4" y="-7" width="4" height="4" fill="#bae6fd" />
    {smokeFrame !== undefined && (
      <>
        <rect x="6" y="-23" width="4" height="7" fill="#64748b" />
        <rect x={6 + Math.sin(smokeFrame * 0.1) * 2} y={-27 - (smokeFrame % 16)} width="4" height="4" fill="#f8fafc" opacity={0.65 - (smokeFrame % 16) / 26} />
      </>
    )}
    <rect x="-13" y="-15" width="26" height="6" fill={roof} />
    <rect x="-10" y="-19" width="20" height="4" fill={roof} />
    <rect x="-6" y="-21" width="12" height="2" fill="#f8fafc" opacity="0.25" />
  </g>
);

const SvgStatue: React.FC<{ x: number; y: number; scale: number }> = ({ x, y, scale }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    <ellipse cx="0" cy="4" rx="18" ry="6" fill="rgba(15,23,42,0.35)" />
    <rect x="-16" y="-5" width="32" height="9" fill="#475569" />
    <rect x="-13" y="-34" width="26" height="30" fill="#94a3b8" />
    <rect x="-10" y="-32" width="8" height="26" fill="#cbd5e1" opacity="0.5" />
    <rect x="-10" y="-26" width="20" height="4" fill="#475569" />
    <rect x="-3" y="-22" width="6" height="10" fill="#64748b" />
    <rect x="-7" y="-10" width="14" height="3" fill="#334155" />
  </g>
);

const SvgFire: React.FC<{ x: number; y: number; frame: number; scale: number }> = ({ x, y, frame, scale }) => {
  const f1 = Math.sin(frame * 0.7) * 2;
  const f2 = Math.cos(frame * 0.9) * 2.5;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <rect x="-15" y="0" width="30" height="6" fill="#451a03" />
      <rect x="-11" y="-3" width="22" height="4" fill="#78350f" />
      <rect x="-12" y={-12 + f1} width="24" height="13" fill="#dc2626" />
      <rect x="-9" y={-19 + f2} width="18" height="15" fill="#f97316" />
      <rect x="-6" y={-24 - f1} width="5" height="9" fill="#f97316" />
      <rect x="2" y={-22 + f1} width="4" height="8" fill="#fb923c" />
      <rect x="-5" y={-14 - f1} width="10" height="11" fill="#fde047" />
      {[0, 1, 2, 3].map((i) => {
        const lift = (frame * 2.1 + i * 11) % 36;
        return (
          <rect
            key={`sp-${i}`}
            x={-10 + i * 7 + Math.sin(frame * 0.25 + i) * 4}
            y={-18 - lift}
            width="2.5"
            height="2.5"
            fill={i % 2 === 0 ? '#fde047' : '#fb923c'}
            opacity={Math.max(0, 1 - lift / 36)}
          />
        );
      })}
      {[0, 1, 2].map((i) => {
        const lift = (frame * 1.4 + i * 16) % 42;
        return (
          <rect
            key={`sm-${i}`}
            x={-6 + Math.sin((frame + i * 20) * 0.12) * 8}
            y={-26 - lift}
            width={10 + i * 2}
            height={7}
            fill="#1e293b"
            opacity={Math.max(0, 0.7 - lift / 50)}
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
  const bob = Math.abs(s) * 2.4;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="2" rx="4.5" ry="1.8" fill="rgba(15,23,42,0.35)" />
      <g transform={`translate(0, ${-bob}) scale(${flip ? -1 : 1}, 1)`}>
        <rect x="-3" y={s > 0 ? -3 : -1} width="2" height="3" fill="#0f172a" />
        <rect x="1" y={s < 0 ? -3 : -1} width="2" height="3" fill="#0f172a" />
        <rect x="-4" y="-9" width="8" height="7" fill={shirt} />
        <rect x="-3" y="-14" width="6" height="5" fill="#fed7aa" />
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
  [[95, 114], [160, 114], [250, 114], [295, 114], [295, 155], [250, 155], [160, 114]],
  [[130, 178], [216, 178], [250, 178], [250, 86], [172, 86], [130, 86]],
  [[285, 92], [325, 115], [325, 160], [275, 160], [250, 114]],
];

const SMART_CITIZENS = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  pathIdx: i % SMART_PATHS.length,
  offset: (i * 0.17) % 1,
  speed: 0.0022 + random(`smc-${i}`) * 0.0012,
  jx: (random(`sjx-${i}`) - 0.5) * 14,
  jy: (random(`sjy-${i}`) - 0.5) * 14,
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
    dieAt: 680 + Math.floor(random(`dd-${i}`) * 240),
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
const CloseUpBima: React.FC<{ frame: number }> = ({ frame }) => {
  const talk = Math.abs(Math.sin(frame * 0.38)) > 0.45;
  const armWave = Math.sin(frame * 0.22) * 5;
  const workerX = 148 + Math.sin(frame * 0.08) * 22;
  const workerBob = Math.abs(Math.sin(frame * 0.35)) * 3;
  const wheatSway = Math.sin(frame * 0.2) * 2;
  return (
    <div style={{
      position: 'absolute', top: 215, left: 65, right: 65, height: 1170,
      backgroundColor: '#0f172a', border: '8px solid #38bdf8', borderRadius: 28,
      overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.85)', zIndex: 38,
    }}>
      <svg width="100%" height="100%" viewBox="0 0 240 310" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges">
        {/* Langit Cerah & Awan Bergerak */}
        <rect width="240" height="108" fill="#38bdf8" />
        <rect x={(20 + frame * 0.2) % 240} y="18" width="40" height="11" fill="#e0f2fe" />
        <rect x={(150 + frame * 0.15) % 240} y="34" width="46" height="13" fill="#e0f2fe" />

        {/* Padang Rumput & Garis Cakrawala */}
        <rect y="108" width="240" height="202" fill="#4ade80" />
        <rect y="108" width="240" height="16" fill="#22c55e" />

        {/* Pohon Pinus Latar */}
        {[122, 198, 224].map((tx, idx) => (
          <g key={idx} transform={`translate(${tx}, 118)`}>
            <rect x="-3" y="-6" width="6" height="10" fill="#78350f" />
            <rect x="-12" y="-22" width="24" height="16" fill="#166534" />
            <rect x="-8" y="-32" width="16" height="12" fill="#15803d" />
            <rect x="-4" y="-38" width="8" height="7" fill="#22c55e" />
          </g>
        ))}

        {/* Rumah Rapi Bercerobong Asap */}
        <rect x="14" y="84" width="78" height="48" fill="#d97706" />
        <rect x="14" y="84" width="78" height="5" fill="#92400e" />
        <rect x="68" y="48" width="12" height="22" fill="#64748b" />
        <rect x={71 + Math.sin(frame * 0.12) * 3} y={40 - (frame % 26)} width="8" height="7" fill="#f8fafc" opacity={0.7 - (frame % 26) / 38} />
        <rect x="8" y="68" width="90" height="20" fill="#2563eb" />
        <rect x="18" y="58" width="70" height="12" fill="#1d4ed8" />
        <rect x="44" y="104" width="18" height="28" fill="#451a03" />
        <rect x="22" y="96" width="14" height="14" fill="#bae6fd" />

        {/* Jalan Setapak & Pekerja Membawa Kayu (Tanpa Tertutup Gelembung) */}
        <rect x="0" y="146" width="240" height="18" fill="#eab308" opacity="0.45" />
        <g transform={`translate(${workerX}, ${154 - workerBob})`}>
          <ellipse cx="0" cy="8" rx="10" ry="3" fill="rgba(15,23,42,0.3)" />
          <rect x="-8" y="-12" width="16" height="18" fill="#2563eb" />
          <rect x="-7" y="-24" width="14" height="12" fill="#fed7aa" />
          <rect x="-7" y="-27" width="14" height="5" fill="#451a03" />
          <rect x="3" y="-20" width="2.5" height="2.5" fill="#0f172a" />
          <rect x="6" y="-8" width="16" height="6" fill="#78350f" />
          <rect x="6" y="-8" width="16" height="2" fill="#b45309" />
        </g>

        {/* Kebun Gandum Berpagar di Tanah Bawah Kanan */}
        <g transform="translate(122, 206)">
          <rect x="0" y="0" width="108" height="60" fill="#78350f" />
          <rect x="4" y="4" width="100" height="52" fill="#92400e" />
          {/* Pagar Kayu Atas Kebun */}
          {[0, 18, 36, 54, 72, 90, 102].map((fx) => (
            <rect key={fx} x={fx} y="-8" width="5" height="12" fill="#b45309" />
          ))}
          <rect x="0" y="-5" width="108" height="3" fill="#d97706" />
          {/* Tangkai Gandum Bergoyang */}
          {[0, 1, 2, 3, 4, 5].map((c) => (
            <g key={c} transform={`translate(${10 + c * 16 + wheatSway}, 10)`}>
              <rect x="2" y="2" width="4" height="16" fill="#ca8a04" />
              <rect x="0" y="0" width="8" height="8" fill="#fde047" />
              <rect x="2" y="24" width="4" height="16" fill="#ca8a04" />
              <rect x="0" y="22" width="8" height="8" fill="#facc15" />
            </g>
          ))}
        </g>

        {/* KARAKTER CLOSE-UP: LEADER BIMA */}
        <g transform="translate(76, 224)">
          <ellipse cx="0" cy="48" rx="34" ry="9" fill="rgba(15,23,42,0.35)" />
          <rect x="-16" y="26" width="12" height="22" fill="#1e293b" />
          <rect x="4" y="26" width="12" height="22" fill="#1e293b" />
          <rect x="-24" y="-24" width="48" height="52" fill="#1d4ed8" />
          <rect x="-18" y="-24" width="36" height="50" fill="#2563eb" />
          {/* Sabuk & Kerah Emas */}
          <rect x="-24" y="10" width="48" height="6" fill="#0f172a" />
          <rect x="-5" y="9" width="10" height="8" fill="#facc15" />
          {/* Tangan Memegang Cetak Biru */}
          <rect x="-34" y="-14" width="12" height="26" fill="#fed7aa" />
          <rect x="-46" y="-8" width="24" height="20" fill="#93c5fd" stroke="#1e3a8a" strokeWidth="2" />
          <rect x="-42" y="-3" width="16" height="3" fill="#ffffff" />
          <rect x="-42" y="3" width="12" height="3" fill="#ffffff" />
          {/* Tangan Menunjuk ke Kebun */}
          <g transform={`translate(24, -14) rotate(${12 + armWave})`}>
            <rect x="0" y="0" width="22" height="10" fill="#fed7aa" />
          </g>
          {/* Kepala Detail */}
          <rect x="-22" y="-66" width="44" height="42" fill="#fed7aa" />
          <rect x="-24" y="-74" width="48" height="14" fill="#3b2110" />
          <rect x="-14" y="-56" width="10" height="3" fill="#3b2110" />
          <rect x="5" y="-56" width="10" height="3" fill="#3b2110" />
          <rect x="-12" y="-50" width="7" height="8" fill="#0f172a" />
          <rect x="6" y="-50" width="7" height="8" fill="#0f172a" />
          <rect x="-10" y="-49" width="2" height="2" fill="#ffffff" />
          <rect x="8" y="-49" width="2" height="2" fill="#ffffff" />
          <rect x="-7" y="-35" width="14" height={talk ? 7 : 3} fill="#7f1d1d" />
          {/* Mahkota Emas */}
          <rect x="-20" y="-84" width="40" height="12" fill="#facc15" />
          <rect x="-20" y="-94" width="10" height="10" fill="#fde047" />
          <rect x="-5" y="-97" width="10" height="13" fill="#fde047" />
          <rect x="10" y="-94" width="10" height="10" fill="#fde047" />
          <rect x="-14" y="-80" width="6" height="4" fill="#ef4444" />
          <rect x="8" y="-80" width="6" height="4" fill="#38bdf8" />
        </g>

        {/* Gelembung Ide di Atas Kanan Bima */}
        <g transform={`translate(114, ${64 + Math.sin(frame * 0.25) * 3})`}>
          <rect x="0" y="0" width="38" height="34" rx="5" fill="#ffffff" stroke="#0f172a" strokeWidth="3" />
          <g transform="translate(7, 5)"><PixelIcon type="bulb" size={24} /></g>
        </g>
      </svg>

      <div style={{
        position: 'absolute', bottom: 24, left: 24, right: 24,
        backgroundColor: 'rgba(15, 23, 42, 0.92)', border: '4px solid #38bdf8',
        borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <PixelIcon type="crown" size={32} />
          <div>
            <div style={{ fontFamily, fontSize: 19, color: '#facc15' }}>LEADER BIMA</div>
            <div style={{ fontFamily, fontSize: 12, color: '#38bdf8', marginTop: 8 }}>PULAU PINTAR</div>
          </div>
        </div>
        <PixelIcon type="wheat" size={32} />
      </div>
    </div>
  );
};

const CloseUpUdin: React.FC<{ frame: number }> = ({ frame }) => {
  const shake = Math.sin(frame * 1.4) * 3;
  const flail = Math.sin(frame * 0.8) * 18;
  const runnerX = ((frame * 4.5) % 270) - 20;
  const runnerBob = Math.abs(Math.sin(frame * 0.6)) * 4;
  return (
    <div style={{
      position: 'absolute', top: 215, left: 65, right: 65, height: 1170,
      backgroundColor: '#0f172a', border: '8px solid #ef4444', borderRadius: 28,
      overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.85)', zIndex: 38,
    }}>
      <svg width="100%" height="100%" viewBox="0 0 240 310" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges">
        {/* Langit Gelap Asap & Tanah Kering */}
        <rect width="240" height="114" fill="#7c2d12" />
        <rect y="72" width="240" height="42" fill="#9a3412" />
        <rect y="114" width="240" height="196" fill="#a16207" />
        <rect y="114" width="240" height="16" fill="#854d0e" />

        {/* Patung Batu Raksasa Miring & Retak di Latar Belakang */}
        <g transform="translate(182, 134) rotate(8)">
          <rect x="-24" y="-68" width="48" height="70" fill="#94a3b8" />
          <rect x="-18" y="-64" width="12" height="62" fill="#cbd5e1" opacity="0.4" />
          <rect x="-16" y="-52" width="32" height="8" fill="#475569" />
          <rect x="-5" y="-42" width="10" height="20" fill="#64748b" />
          <rect x="10" y="-34" width="4" height="14" fill="#334155" />
        </g>

        {/* Pagar Kayu Rusak Pemisah Latar */}
        {[12, 42, 72, 102, 132, 198, 224].map((fx) => (
          <rect key={fx} x={fx} y="136" width="6" height="18" fill="#78350f" />
        ))}
        <rect x="0" y="142" width="142" height="4" fill="#92400e" />

        {/* Warga Panik Berlari di Jalur Tanah Depan Pagar (Bersih, Tidak Menabrak Patung) */}
        <g transform={`translate(${runnerX}, ${178 - runnerBob})`}>
          <ellipse cx="0" cy="10" rx="10" ry="3" fill="rgba(15,23,42,0.35)" />
          <rect x="-7" y="-12" width="14" height="18" fill="#dc2626" />
          <rect x="-6" y="-23" width="12" height="11" fill="#fed7aa" />
          <rect x="-13" y="-20" width="6" height="12" fill="#fed7aa" />
          <rect x="7" y="-20" width="6" height="12" fill="#fed7aa" />
        </g>

        {/* Kobaran Api & Bara Besar di Sisi Kanan Bawah */}
        <g transform="translate(178, 250) scale(2.6)">
          <SvgFire x={0} y={0} frame={frame} scale={1} />
        </g>

        {/* KARAKTER CLOSE-UP: LEADER UDIN PANIK */}
        <g transform={`translate(${74 + shake}, 226)`}>
          <ellipse cx="0" cy="48" rx="34" ry="9" fill="rgba(15,23,42,0.4)" />
          <rect x="-16" y="26" width="12" height="22" fill="#1e293b" />
          <rect x="4" y="26" width="12" height="22" fill="#1e293b" />
          <rect x="-24" y="-24" width="48" height="52" fill="#b91c1c" />
          <rect x="-18" y="-24" width="36" height="50" fill="#dc2626" />
          <rect x="-24" y="10" width="48" height="5" fill="#450a0a" />
          {/* Tangan Panik & Obor Menyala */}
          <g transform={`translate(-24, -14) rotate(${-55 + flail})`}>
            <rect x="-12" y="-18" width="12" height="28" fill="#fed7aa" />
          </g>
          <g transform={`translate(24, -14) rotate(${45 - flail})`}>
            <rect x="0" y="-18" width="12" height="28" fill="#fed7aa" />
            <rect x="3" y="-36" width="6" height="20" fill="#78350f" />
            <rect x="0" y="-46" width="12" height="12" fill="#f97316" />
            <rect x="3" y="-43" width="6" height="7" fill="#fde047" />
          </g>
          {/* Kepala Panik + Tetesan Keringat */}
          <rect x="-22" y="-66" width="44" height="42" fill="#fed7aa" />
          <rect x="-24" y="-72" width="48" height="12" fill="#29150b" />
          <rect x="16" y={-60 + (frame % 12)} width="4" height="6" fill="#7dd3fc" />
          <rect x="-20" y={-55 + ((frame + 6) % 12)} width="4" height="6" fill="#7dd3fc" />
          {/* Mata Membelalak Kaget */}
          <rect x="-16" y="-54" width="13" height="13" fill="#ffffff" />
          <rect x="3" y="-54" width="13" height="13" fill="#ffffff" />
          <rect x="-11" y="-49" width="4" height="4" fill="#0f172a" />
          <rect x="7" y="-49" width="4" height="4" fill="#0f172a" />
          <rect x="-9" y="-37" width="18" height="12" fill="#450a0a" />
          {/* Mahkota Miring */}
          <g transform="translate(4, -76) rotate(14)">
            <rect x="-18" y="-8" width="36" height="10" fill="#facc15" />
            <rect x="-18" y="-16" width="8" height="8" fill="#fde047" />
            <rect x="-4" y="-18" width="8" height="10" fill="#fde047" />
            <rect x="10" y="-16" width="8" height="8" fill="#fde047" />
          </g>
        </g>

        {/* Gelembung Panik */}
        <g transform={`translate(18, ${102 + Math.sin(frame * 0.6) * 3})`}>
          <rect x="0" y="0" width="38" height="34" rx="5" fill="#ffffff" stroke="#dc2626" strokeWidth="3" />
          <g transform="translate(7, 5)"><PixelIcon type="panic" size={24} /></g>
        </g>
      </svg>

      <div style={{
        position: 'absolute', bottom: 24, left: 24, right: 24,
        backgroundColor: 'rgba(15, 23, 42, 0.92)', border: '4px solid #ef4444',
        borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <PixelIcon type="crown" size={32} />
          <div>
            <div style={{ fontFamily, fontSize: 19, color: '#facc15' }}>LEADER UDIN</div>
            <div style={{ fontFamily, fontSize: 12, color: '#f87171', marginTop: 8 }}>PULAU BODOH</div>
          </div>
        </div>
        <PixelIcon type="fire" size={32} />
      </div>
    </div>
  );
};
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

  // Tahun 1 - 12 sinkron dengan narasi (Tahun 8 tepat di detik 21 / frame 630)
  const year = Math.min(12, Math.floor(interpolate(frame, [0, 630, 1050], [1, 8, 12.9], { extrapolateRight: 'clamp' })));

  const smartPop = year < 6
    ? Math.floor(interpolate(frame, [0, 500], [100, 114], { extrapolateRight: 'clamp' }))
    : Math.floor(interpolate(frame, [500, 1150], [114, 135], { extrapolateRight: 'clamp' }));

  const dumbPop = year < 8
    ? 100
    : Math.floor(interpolate(frame, [640, 960], [100, 54], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));

  // Kemarau tepat di Tahun 8 (frame 630 - 930), Hujan penyegar di Tahun 11 (frame 930 - 1015)
  const drought = interpolate(frame, [620, 650, 910, 945], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const isDry = drought > 0.45;
  const isRaining = frame >= 925 && frame <= 1015;
  const fireActive = frame >= 995;
  const fireScale = fireActive ? spring({ frame: frame - 995, fps, config: { damping: 8 } }) : 0;

  const builtCount = Math.min(SMART_HOUSES.length, Math.floor(interpolate(frame, [95, 560], [0, 8], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })));
  const statueScale = interpolate(frame, [160, 590], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const spawnFlash = interpolate(frame, [0, 22, 62], [0, 1, 0], { extrapolateRight: 'clamp' });

  const showBimaCut = frame >= 285 && frame <= 455;
  const showUdinCut = frame >= 1060;
  const cutActive = showBimaCut || showUdinCut;
  const bimaPop = showBimaCut ? spring({ frame: frame - 285, fps, config: { damping: 12 } }) : 0;
  const udinPop = showUdinCut ? spring({ frame: frame - 1060, fps, config: { damping: 12 } }) : 0;
  const cliffIn = spring({ frame: frame - 1175, fps, config: { damping: 10 } });

  // Subtitle Pop-Up Per Kata
  const activeWordIdx = WORD_SUBS.findIndex((item) => sec >= item.s && sec < item.e);
  const activeWord = activeWordIdx >= 0 ? WORD_SUBS[activeWordIdx] : null;
  const wordPop = activeWord
    ? spring({ frame: Math.max(0, frame - Math.floor(activeWord.s * fps)), fps, config: { damping: 11, stiffness: 280, mass: 0.5 } })
    : 0;

  const shoreWave = Math.sin(frame * 0.14) * 0.25 + 0.75;
  const treeSway = Math.sin(frame * 0.08) * 0.9;

  const renderBaseTiles = (showRoads: boolean) => (
    <g>
      {ISLAND_CELLS.map((c, idx) => {
        let fill = '#38bdf8';
        let op = 1;
        if (c.t === 1) op = shoreWave;
        else if (c.t === 2) fill = '#fde047';
        else if (c.t === 3) fill = isDry ? '#b48a3e' : '#4ade80';
        else if (c.t === 4) fill = isDry ? '#926c2a' : '#22c55e';
        return <rect key={idx} x={c.x} y={c.y} width="10.4" height="10.4" fill={fill} opacity={op} />;
      })}
      <rect x="85" y="75" width="22" height="14" fill="#94a3b8" />
      <rect x="92" y="68" width="14" height="10" fill="#cbd5e1" />
      {showRoads && (
        <g opacity="0.85">
          <rect x="122" y="109" width="175" height="9" fill="#d97706" />
          <rect x="246" y="80" width="9" height="106" fill="#d97706" />
        </g>
      )}
    </g>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#1d4ed8', overflow: 'hidden' }}>
      <Audio src={staticFile('vo_wb_ep1.mp3')} volume={1} />
      <Audio src={staticFile('bgm.wav')} volume={0.16} />
      <Sequence from={10} durationInFrames={40}><Audio src={ding} volume={0.4} /></Sequence>
      <Sequence from={285} durationInFrames={35}><Audio src={whoosh} volume={0.45} /></Sequence>
      <Sequence from={450} durationInFrames={35}><Audio src={whoosh} volume={0.35} /></Sequence>
      <Sequence from={630} durationInFrames={30}><Audio src={mouseClick} volume={0.5} /></Sequence>
      <Sequence from={995} durationInFrames={40}><Audio src={whoosh} volume={0.5} /></Sequence>
      <Sequence from={1060} durationInFrames={40}><Audio src={whoosh} volume={0.5} /></Sequence>
      <Sequence from={1175} durationInFrames={60}><Audio src={ding} volume={0.55} /></Sequence>

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
              <SvgHouse x={294} y={84} roof="#f59e0b" scale={0.95} />
            </g>
          )}

          {ISLAND_TREES.map((tr, i) => (
            <SvgTree key={i} x={tr.x} y={tr.y} felled={year >= tr.smartChop} dry={isDry} size={tr.size} sway={treeSway} />
          ))}

          {SMART_HOUSES.slice(0, builtCount).map(([hx, hy], idx) => (
            <SvgHouse key={idx} x={hx} y={hy} roof="#2563eb" scale={spring({ frame: frame - (95 + idx * 55), fps, config: { damping: 10 } })} smokeFrame={idx % 2 === 0 ? frame + idx * 9 : undefined} />
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
            const bp = walkPath([[215, 114], [268, 114], [268, 148], [215, 148]], frame * 0.003);
            return <SvgCitizen x={bp.x} y={bp.y} shirt="#1e40af" step={frame * 0.28} flip={bp.flip} isLeader bubble={year >= 3 && year <= 6 ? 'bulb' : undefined} />;
          })()}

          {/* Awan Melayang Lembut */}
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
        position: 'absolute', top: 798, left: 0, right: 0, height: 10,
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
            <SvgTree key={i} x={tr.x} y={tr.y} felled={year >= tr.dumbChop} dry={isDry} size={tr.size} sway={treeSway} />
          ))}

          {year >= 3 && (
            <>
              <SvgHouse x={315} y={96} roof="#dc2626" tilted scale={0.85} />
              <SvgHouse x={300} y={178} roof="#dc2626" tilted scale={0.82} />
            </>
          )}

          {statueScale > 0.08 && <SvgStatue x={218} y={128} scale={statueScale * 1.15} />}
          {fireActive && <SvgFire x={224} y={154} frame={frame} scale={fireScale * 1.35} />}

          {DUMB_CITIZENS.map((c) => {
            if (year >= 8 && frame > c.dieAt && c.id > 12) return null;
            const t = (frame * c.speed + c.phase) % 3;
            let px = c.ax, py = c.ay, flip = false;
            if (t < 1) { px = c.ax + (c.bx - c.ax) * t; py = c.ay + (c.by - c.ay) * t; flip = c.bx < c.ax; }
            else if (t < 2) { px = c.bx + (c.cx - c.bx) * (t - 1); py = c.by + (c.cy - c.by) * (t - 1); flip = c.cx < c.bx; }
            else { px = c.cx + (c.ax - c.cx) * (t - 2); py = c.cy + (c.ay - c.cy) * (t - 2); flip = c.ax < c.cx; }

            if (fireActive) {
              const fleeP = Math.min(1, (frame - 995) / (30 + (c.id % 5) * 6));
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

      {/* Efek Cuaca Kemarau & Hujan */}
      {drought > 0 && (
        <AbsoluteFill style={{ background: `radial-gradient(circle at 80% 15%, rgba(253, 224, 71, ${drought * 0.35}), rgba(245, 158, 11, ${drought * 0.16}))`, pointerEvents: 'none', zIndex: 28 }} />
      )}
      {isRaining && !cutActive && (
        <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 29 }}>
          {RAINDROPS.map((r, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${r.x}%`,
              top: `${(r.y + frame * r.sp * 0.25) % 100}%`,
              width: 4, height: 22, backgroundColor: '#bae6fd', opacity: 0.55,
            }} />
          ))}
        </AbsoluteFill>
      )}

      {/* Backdrop Gelap + 2 Adegan Cutscene Close-Up */}
      {cutActive && <AbsoluteFill style={{ backgroundColor: 'rgba(15, 23, 42, 0.58)', zIndex: 35 }} />}
      {showBimaCut && (
        <AbsoluteFill style={{ transform: `scale(${bimaPop})`, zIndex: 38 }}>
          <CloseUpBima frame={frame} />
        </AbsoluteFill>
      )}
      {showUdinCut && (
        <AbsoluteFill style={{ transform: `scale(${udinPop})`, zIndex: 38 }}>
          <CloseUpUdin frame={frame} />
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

      {/* === SUBTITLE POP-UP PER KATA (ZONA AMAN TENGAH-BAWAH) === */}
      {activeWord && frame < 1175 && (
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
            backgroundColor: 'rgba(15, 23, 42, 0.78)',
            border: `3px solid ${getWordColor(activeWord.w)}`,
            textShadow: '4px 4px 0 #0f172a, -3px -3px 0 #0f172a, 3px -3px 0 #0f172a, -3px 3px 0 #0f172a',
            transform: `scale(${0.65 + wordPop * 0.35}) rotate(${activeWordIdx % 2 === 0 ? -2 : 2}deg)`,
          }}>
            {activeWord.w.toUpperCase()}
          </div>
        </div>
      )}

      {frame >= 1175 && (
        <div style={{
          position: 'absolute', top: 1435, left: 95, right: 95,
          backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '4px solid #facc15',
          borderRadius: 16, padding: '16px 20px', textAlign: 'center',
          fontFamily, fontSize: 16, color: '#facc15', transform: `scale(${cliffIn})`, zIndex: 55,
          display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12,
        }}>
          <span>BERSAMBUNG KE EPISODE 2</span>
          <PixelIcon type="fire" size={24} />
        </div>
      )}
    </AbsoluteFill>
  );
};
