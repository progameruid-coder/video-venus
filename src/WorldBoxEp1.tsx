import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PressStart2P';
import { whoosh, ding, mouseClick } from '@remotion/sfx';

const { fontFamily } = loadFont();

// 1. Peta Pulau Organik Pixel-Art (44x26 tile, 10px per tile -> viewBox 440x260)
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
    if (d <= 0.62) t = 4;      // rumput dalam
    else if (d <= 0.82) t = 3; // rumput terang
    else if (d <= 0.93) t = 2; // pantai pasir
    else if (d <= 1.05) t = 1; // laut dangkal
    if (t > 0) {
      ISLAND_CELLS.push({ x: gx * 10, y: gy * 10, t });
      if ((t === 3 || t === 4) && gx > 6 && gx < 37 && gy > 4 && gy < 21) {
        GRASS_SPOTS.push({ x: gx * 10 + 5, y: gy * 10 + 5 });
      }
    }
  }
}

// 2. Hutan Lebat 38 Pohon Deterministik
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

// Ikon Pixel SVG (Pengganti Emoji 100% Tajam di Linux Render)
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
const SvgTree: React.FC<{ x: number; y: number; felled: boolean; dry: boolean; size: number }> = ({ x, y, felled, dry, size }) => (
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
        <rect x="-8" y="-13" width="16" height="9" fill={dry ? '#854d0e' : '#166534'} />
        <rect x="-6" y="-18" width="12" height="7" fill={dry ? '#a16207' : '#15803d'} />
        <rect x="-4" y="-21" width="8" height="4" fill={dry ? '#ca8a04' : '#22c55e'} />
        <rect x="-3" y="-19" width="3" height="3" fill={dry ? '#eab308' : '#4ade80'} />
      </>
    )}
  </g>
);

const SvgHouse: React.FC<{ x: number; y: number; roof: string; tilted?: boolean; scale?: number }> = ({ x, y, roof, tilted = false, scale = 1 }) => (
  <g transform={`translate(${x}, ${y}) rotate(${tilted ? 11 : 0}) scale(${scale})`}>
    <rect x="-12" y="2" width="24" height="4" fill="rgba(15,23,42,0.3)" />
    <rect x="-10" y="-10" width="20" height="13" fill="#d97706" />
    <rect x="-10" y="-10" width="20" height="2" fill="#92400e" />
    <rect x="-3" y="-4" width="6" height="7" fill="#451a03" />
    <rect x="4" y="-7" width="4" height="4" fill="#bae6fd" />
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
  const f2 = Math.cos(frame * 0.9) * 2;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <rect x="-14" y="0" width="28" height="6" fill="#451a03" />
      <rect x="-10" y="-3" width="20" height="4" fill="#78350f" />
      <rect x="-12" y={-14 + f1} width="24" height="15" fill="#dc2626" />
      <rect x="-9" y={-22 + f2} width="18" height="18" fill="#f97316" />
      <rect x="-5" y={-16 - f1} width="10" height="13" fill="#fde047" />
      {[0, 1, 2].map((i) => {
        const lift = ((frame * 1.6 + i * 16) % 42);
        return (
          <rect
            key={i}
            x={-6 + Math.sin((frame + i * 20) * 0.12) * 8}
            y={-24 - lift}
            width={10 + i * 2}
            height={8}
            fill="#1e293b"
            opacity={Math.max(0, 0.75 - lift / 52)}
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

// Data Pergerakan Penduduk
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
    dieAt: 740 + Math.floor(random(`dd-${i}`) * 230),
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
  const talk = Math.abs(Math.sin(frame * 0.35)) > 0.5;
  const armWave = Math.sin(frame * 0.25) * 6;
  const workerX = 185 + Math.sin(frame * 0.09) * 18;
  const wheatSway = Math.sin(frame * 0.2) * 2;
  return (
    <div style={{
      position: 'absolute', top: 235, left: 65, right: 65, height: 1210,
      backgroundColor: '#0f172a', border: '8px solid #38bdf8', borderRadius: 28,
      overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.85)', zIndex: 38,
    }}>
      <svg width="100%" height="100%" viewBox="0 0 240 310" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges">
        {/* Langit & Padang Rumput */}
        <rect width="240" height="115" fill="#38bdf8" />
        <rect x="24" y="20" width="38" height="12" fill="#e0f2fe" />
        <rect x="165" y="34" width="46" height="14" fill="#e0f2fe" />
        <rect y="115" width="240" height="195" fill="#4ade80" />
        <rect y="115" width="240" height="18" fill="#22c55e" />

        {/* Rumah Rapi di Latar Belakang */}
        <rect x="18" y="88" width="76" height="48" fill="#d97706" />
        <rect x="12" y="72" width="88" height="20" fill="#2563eb" />
        <rect x="22" y="62" width="68" height="12" fill="#1d4ed8" />
        <rect x="46" y="108" width="18" height="28" fill="#451a03" />
        <rect x="26" y="100" width="14" height="14" fill="#bae6fd" />

        {/* Ladang Gandum Emas & Pekerja */}
        <rect x="132" y="148" width="96" height="72" fill="#92400e" />
        {[0, 1, 2, 3, 4].map((c) => (
          <g key={c} transform={`translate(${142 + c * 18 + wheatSway}, 158)`}>
            <rect x="0" y="0" width="8" height="22" fill="#facc15" />
            <rect x="2" y="28" width="8" height="22" fill="#fde047" />
          </g>
        ))}

        {/* Pekerja Pintar di Latar */}
        <g transform={`translate(${workerX}, 136)`}>
          <rect x="-8" y="-12" width="16" height="18" fill="#2563eb" />
          <rect x="-7" y="-24" width="14" height="12" fill="#fed7aa" />
          <rect x="-7" y="-27" width="14" height="5" fill="#451a03" />
          <rect x="6" y="-8" width="12" height="5" fill="#78350f" />
        </g>

        {/* KARAKTER CLOSE-UP: LEADER BIMA */}
        <g transform="translate(88, 222)">
          <ellipse cx="0" cy="48" rx="34" ry="9" fill="rgba(15,23,42,0.35)" />
          {/* Kaki */}
          <rect x="-16" y="26" width="12" height="22" fill="#1e293b" />
          <rect x="4" y="26" width="12" height="22" fill="#1e293b" />
          {/* Badan & Jubah Biru */}
          <rect x="-24" y="-24" width="48" height="52" fill="#1d4ed8" />
          <rect x="-18" y="-24" width="36" height="50" fill="#2563eb" />
          {/* Tangan Memegang Cetak Biru */}
          <rect x="-34" y="-14" width="12" height="28" fill="#fed7aa" />
          <rect x="-46" y="-8" width="24" height="20" fill="#93c5fd" stroke="#1e3a8a" strokeWidth="2" />
          <rect x="-42" y="-3" width="16" height="3" fill="#ffffff" />
          <rect x="-42" y="3" width="12" height="3" fill="#ffffff" />
          {/* Tangan Menunjuk Mengarahkan */}
          <g transform={`translate(24, -14) rotate(${armWave})`}>
            <rect x="0" y="0" width="24" height="11" fill="#fed7aa" />
          </g>
          {/* Kepala */}
          <rect x="-22" y="-66" width="44" height="42" fill="#fed7aa" />
          <rect x="-24" y="-74" width="48" height="14" fill="#3b2110" />
          {/* Mata & Mulut Berbicara */}
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

        {/* Gelembung Ide di Atas Bima */}
        <g transform="translate(132, 92)">
          <rect x="0" y="0" width="38" height="34" rx="5" fill="#ffffff" stroke="#0f172a" strokeWidth="3" />
          <g transform="translate(7, 5)"><PixelIcon type="bulb" size={24} /></g>
        </g>
      </svg>

      <div style={{
        position: 'absolute', bottom: 26, left: 26, right: 26,
        backgroundColor: 'rgba(15, 23, 42, 0.92)', border: '4px solid #38bdf8',
        borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <PixelIcon type="crown" size={32} />
          <div>
            <div style={{ fontFamily, fontSize: 20, color: '#facc15' }}>LEADER BIMA</div>
            <div style={{ fontFamily, fontSize: 13, color: '#38bdf8', marginTop: 8 }}>PULAU PINTAR</div>
          </div>
        </div>
        <PixelIcon type="wheat" size={34} />
      </div>
    </div>
  );
};

const CloseUpUdin: React.FC<{ frame: number }> = ({ frame }) => {
  const shake = Math.sin(frame * 1.4) * 3;
  const flail = Math.sin(frame * 0.8) * 18;
  const runnerX = ((frame * 5) % 280) - 20;
  return (
    <div style={{
      position: 'absolute', top: 235, left: 65, right: 65, height: 1210,
      backgroundColor: '#0f172a', border: '8px solid #ef4444', borderRadius: 28,
      overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.85)', zIndex: 38,
    }}>
      <svg width="100%" height="100%" viewBox="0 0 240 310" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges">
        {/* Langit Gelap Asap & Tanah Kering */}
        <rect width="240" height="120" fill="#7c2d12" />
        <rect y="75" width="240" height="45" fill="#9a3412" />
        <rect y="120" width="240" height="190" fill="#a16207" />
        <rect y="120" width="240" height="16" fill="#854d0e" />

        {/* Patung Batu Raksasa Miring di Latar */}
        <g transform="translate(182, 146) rotate(8)">
          <rect x="-22" y="-70" width="44" height="72" fill="#94a3b8" />
          <rect x="-16" y="-54" width="32" height="8" fill="#475569" />
          <rect x="-5" y="-44" width="10" height="20" fill="#64748b" />
        </g>

        {/* Tunggul Kayu & Warga Panik Berlari */}
        <rect x="20" y="136" width="22" height="12" fill="#78350f" />
        <g transform={`translate(${runnerX}, 152)`}>
          <rect x="-8" y="-12" width="16" height="18" fill="#dc2626" />
          <rect x="-7" y="-24" width="14" height="12" fill="#fed7aa" />
          <rect x="-14" y="-20" width="6" height="12" fill="#fed7aa" />
          <rect x="8" y="-20" width="6" height="12" fill="#fed7aa" />
        </g>

        {/* Kobaran Api Besar di Sisi Kanan Bawah */}
        <g transform="translate(174, 246) scale(2.8)">
          <SvgFire x={0} y={0} frame={frame} scale={1} />
        </g>

        {/* KARAKTER CLOSE-UP: LEADER UDIN PANIK */}
        <g transform={`translate(${76 + shake}, 228)`}>
          <ellipse cx="0" cy="48" rx="34" ry="9" fill="rgba(15,23,42,0.4)" />
          <rect x="-16" y="26" width="12" height="22" fill="#1e293b" />
          <rect x="4" y="26" width="12" height="22" fill="#1e293b" />
          <rect x="-24" y="-24" width="48" height="52" fill="#b91c1c" />
          <rect x="-18" y="-24" width="36" height="50" fill="#dc2626" />
          {/* Tangan Panik Mengayun & Obor */}
          <g transform={`translate(-24, -14) rotate(${-55 + flail})`}>
            <rect x="-12" y="-18" width="12" height="28" fill="#fed7aa" />
          </g>
          <g transform={`translate(24, -14) rotate(${45 - flail})`}>
            <rect x="0" y="-18" width="12" height="28" fill="#fed7aa" />
            <rect x="3" y="-36" width="6" height="20" fill="#78350f" />
            <rect x="0" y="-46" width="12" height="12" fill="#f97316" />
            <rect x="3" y="-43" width="6" height="7" fill="#fde047" />
          </g>
          {/* Kepala Panik */}
          <rect x="-22" y="-66" width="44" height="42" fill="#fed7aa" />
          <rect x="-24" y="-72" width="48" height="12" fill="#29150b" />
          {/* Mata Membelalak Kaget */}
          <rect x="-16" y="-54" width="13" height="13" fill="#ffffff" />
          <rect x="3" y="-54" width="13" height="13" fill="#ffffff" />
          <rect x="-11" y="-49" width="4" height="4" fill="#0f172a" />
          <rect x="7" y="-49" width="4" height="4" fill="#0f172a" />
          {/* Mulut Teriak */}
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
        <g transform="translate(22, 108)">
          <rect x="0" y="0" width="38" height="34" rx="5" fill="#ffffff" stroke="#dc2626" strokeWidth="3" />
          <g transform="translate(7, 5)"><PixelIcon type="panic" size={24} /></g>
        </g>
      </svg>

      <div style={{
        position: 'absolute', bottom: 26, left: 26, right: 26,
        backgroundColor: 'rgba(15, 23, 42, 0.92)', border: '4px solid #ef4444',
        borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <PixelIcon type="crown" size={32} />
          <div>
            <div style={{ fontFamily, fontSize: 20, color: '#facc15' }}>LEADER UDIN</div>
            <div style={{ fontFamily, fontSize: 13, color: '#f87171', marginTop: 8 }}>PULAU BODOH</div>
          </div>
        </div>
        <PixelIcon type="fire" size={34} />
      </div>
    </div>
  );
};
export const WorldBoxEp1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const year = Math.min(12, Math.floor(interpolate(frame, [0, 1120], [1, 12.9], { extrapolateRight: 'clamp' })));

  const smartPop = year < 6
    ? Math.floor(interpolate(frame, [0, 560], [100, 114], { extrapolateRight: 'clamp' }))
    : Math.floor(interpolate(frame, [560, 1150], [114, 135], { extrapolateRight: 'clamp' }));

  const dumbPop = year < 8
    ? 100
    : Math.floor(interpolate(frame, [720, 1010], [100, 54], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));

  const drought = interpolate(frame, [700, 750, 970, 1020], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const isDry = drought > 0.45;
  const fireActive = frame >= 1010;
  const fireScale = fireActive ? spring({ frame: frame - 1010, fps, config: { damping: 8 } }) : 0;

  const builtCount = Math.min(SMART_HOUSES.length, Math.floor(interpolate(frame, [95, 580], [0, 8], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })));
  const statueScale = interpolate(frame, [160, 620], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const spawnFlash = interpolate(frame, [0, 22, 62], [0, 1, 0], { extrapolateRight: 'clamp' });

  // 2 Adegan Cutscene Close-Up Asli (Bima: frame 285-465 | Udin: frame 1075-1260)
  const showBimaCut = frame >= 285 && frame <= 465;
  const showUdinCut = frame >= 1075;
  const bimaPop = showBimaCut ? spring({ frame: frame - 285, fps, config: { damping: 12 } }) : 0;
  const udinPop = showUdinCut ? spring({ frame: frame - 1075, fps, config: { damping: 12 } }) : 0;
  const cliffIn = spring({ frame: frame - 1155, fps, config: { damping: 10 } });

  const renderBaseTiles = (showRoads: boolean) => (
    <g>
      {ISLAND_CELLS.map((c, idx) => {
        let fill = '#38bdf8';
        if (c.t === 2) fill = '#fde047';
        else if (c.t === 3) fill = isDry ? '#b48a3e' : '#4ade80';
        else if (c.t === 4) fill = isDry ? '#926c2a' : '#22c55e';
        return <rect key={idx} x={c.x} y={c.y} width="10.4" height="10.4" fill={fill} />;
      })}
      {/* Batu Tebing Alami */}
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
      <Sequence from={460} durationInFrames={35}><Audio src={whoosh} volume={0.35} /></Sequence>
      <Sequence from={720} durationInFrames={30}><Audio src={mouseClick} volume={0.5} /></Sequence>
      <Sequence from={1010} durationInFrames={40}><Audio src={whoosh} volume={0.5} /></Sequence>
      <Sequence from={1075} durationInFrames={40}><Audio src={whoosh} volume={0.5} /></Sequence>
      <Sequence from={1155} durationInFrames={60}><Audio src={ding} volume={0.55} /></Sequence>

      {/* Pola Gelombang Laut Piksel */}
      <AbsoluteFill style={{
        backgroundImage: 'radial-gradient(#38bdf8 4px, transparent 4px)',
        backgroundSize: '46px 46px',
        backgroundPosition: `${(frame * 0.8) % 46}px ${(frame * 0.35) % 46}px`,
        opacity: 0.38,
      }} />

      {/* === PULAU ATAS: PULAU PINTAR === */}
      <div style={{ position: 'absolute', top: 220, left: 75, width: 930, height: 550 }}>
        <svg width="100%" height="100%" viewBox="0 0 440 260" shapeRendering="crispEdges">
          {renderBaseTiles(year >= 3)}

          {/* Ladang Gandum Emas & Lumbung (Tahun 4+) */}
          {year >= 4 && (
            <g>
              <rect x="270" y="96" width="68" height="72" fill="#92400e" />
              {[0, 1, 2, 3].map((r) => [0, 1, 2, 3].map((c) => (
                <rect key={`${r}-${c}`} x={275 + c * 15} y={101 + r * 16} width="10" height="10" fill={isDry ? '#ca8a04' : '#fde047'} />
              )))}
              <SvgHouse x={294} y={84} roof="#f59e0b" scale={0.95} />
            </g>
          )}

          {/* Hutan 38 Pohon (Sebagian Ditebang untuk Desa & Ladang) */}
          {ISLAND_TREES.map((tr, i) => (
            <SvgTree key={i} x={tr.x} y={tr.y} felled={year >= tr.smartChop} dry={isDry} size={tr.size} />
          ))}

          {/* Rumah Berjejer Rapi */}
          {SMART_HOUSES.slice(0, builtCount).map(([hx, hy], idx) => (
            <SvgHouse key={idx} x={hx} y={hy} roof="#2563eb" scale={spring({ frame: frame - (95 + idx * 55), fps, config: { damping: 10 } })} />
          ))}

          {/* Menara Pengawas Tahun 11+ */}
          {year >= 11 && (
            <>
              <g transform="translate(105, 62)"><rect x="-7" y="-22" width="14" height="24" fill="#94a3b8" /><rect x="-9" y="-26" width="18" height="6" fill="#64748b" /><rect x="2" y="-34" width="8" height="5" fill="#38bdf8" /></g>
              <g transform="translate(334, 62)"><rect x="-7" y="-22" width="14" height="24" fill="#94a3b8" /><rect x="-9" y="-26" width="18" height="6" fill="#64748b" /><rect x="2" y="-34" width="8" height="5" fill="#38bdf8" /></g>
            </>
          )}

          {/* Penduduk Pintar Berjalan Menyusuri Jalan */}
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

          {/* Leader Bima di Peta */}
          {(() => {
            const bp = walkPath([[215, 114], [268, 114], [268, 148], [215, 148]], frame * 0.003);
            return <SvgCitizen x={bp.x} y={bp.y} shirt="#1e40af" step={frame * 0.28} flip={bp.flip} isLeader bubble={year >= 3 && year <= 6 ? 'bulb' : undefined} />;
          })()}

          {spawnFlash > 0 && <rect x="40" y="30" width="360" height="200" rx="50" fill="#7dd3fc" opacity={spawnFlash * 0.55} />}
        </svg>
      </div>

      {/* Label Pulau Pintar */}
      <div style={{
        position: 'absolute', top: 775, left: '50%', transform: 'translateX(-50%)',
        backgroundColor: '#0f172a', border: '3px solid #38bdf8', borderRadius: 12,
        padding: '6px 18px', fontFamily, fontSize: 15, color: '#38bdf8', zIndex: 25,
      }}>
        PULAU PINTAR
      </div>

      {/* === GARIS PEMISAH VS === */}
      <div style={{
        position: 'absolute', top: 856, left: 0, right: 0, height: 10,
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
      <div style={{ position: 'absolute', top: 925, left: 75, width: 930, height: 550 }}>
        <svg width="100%" height="100%" viewBox="0 0 440 260" shapeRendering="crispEdges">
          {renderBaseTiles(false)}

          {/* Hutan 38 Pohon (Hampir Semuanya Ditebang Jadi Tunggul!) */}
          {ISLAND_TREES.map((tr, i) => (
            <SvgTree key={i} x={tr.x} y={tr.y} felled={year >= tr.dumbChop} dry={isDry} size={tr.size} />
          ))}

          {/* 2 Gubuk Miring Berantakan */}
          {year >= 3 && (
            <>
              <SvgHouse x={315} y={96} roof="#dc2626" tilted scale={0.85} />
              <SvgHouse x={300} y={178} roof="#dc2626" tilted scale={0.82} />
            </>
          )}

          {/* Patung Batu Raksasa Sia-sia */}
          {statueScale > 0.08 && <SvgStatue x={218} y={128} scale={statueScale * 1.15} />}

          {/* Kobaran Api & Asap di Tahun ke-12 */}
          {fireActive && <SvgFire x={224} y={154} frame={frame} scale={fireScale * 1.35} />}

          {/* Penduduk Bodoh Berlarian Acak & Kabur Panik ke Berbagai Pantai */}
          {DUMB_CITIZENS.map((c) => {
            if (year >= 8 && frame > c.dieAt && c.id > 12) return null;
            const t = (frame * c.speed + c.phase) % 3;
            let px = c.ax, py = c.ay, flip = false;
            if (t < 1) { px = c.ax + (c.bx - c.ax) * t; py = c.ay + (c.by - c.ay) * t; flip = c.bx < c.ax; }
            else if (t < 2) { px = c.bx + (c.cx - c.bx) * (t - 1); py = c.by + (c.cy - c.by) * (t - 1); flip = c.cx < c.bx; }
            else { px = c.cx + (c.ax - c.cx) * (t - 2); py = c.cy + (c.ay - c.cy) * (t - 2); flip = c.ax < c.cx; }

            if (fireActive) {
              const fleeP = Math.min(1, (frame - 1010) / (32 + (c.id % 5) * 6));
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

          {/* Leader Udin di Peta */}
          {(() => {
            const up = walkPath([[185, 146], [235, 146], [220, 172], [180, 165]], frame * (fireActive ? 0.012 : 0.006));
            return <SvgCitizen x={up.x} y={up.y} shirt="#991b1b" step={frame * 0.5} flip={up.flip} isLeader bubble={fireActive ? 'fire' : isDry ? 'skull' : 'question'} />;
          })()}

          {spawnFlash > 0 && <rect x="40" y="30" width="360" height="200" rx="50" fill="#fca5a5" opacity={spawnFlash * 0.55} />}
        </svg>
      </div>

      {/* Label Pulau Bodoh */}
      <div style={{
        position: 'absolute', top: 1480, left: '50%', transform: 'translateX(-50%)',
        backgroundColor: '#0f172a', border: '3px solid #f87171', borderRadius: 12,
        padding: '6px 18px', fontFamily, fontSize: 15, color: '#f87171', zIndex: 25,
      }}>
        PULAU BODOH • {dumbPop}
      </div>

      {/* Overlay Cahaya Terik Saat Kemarau */}
      {drought > 0 && (
        <AbsoluteFill style={{ backgroundColor: `rgba(245, 158, 11, ${drought * 0.18})`, pointerEvents: 'none', zIndex: 28 }} />
      )}

      {/* === 2 ADEGAN CLOSE-UP CUTSCENE === */}
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

      {/* === HUD TETAP ZONA AMAN TIKTOK (TANPA EMOJI PECAH) === */}
      <div style={{
        position: 'absolute', top: 88, left: '50%', transform: 'translateX(-50%)',
        padding: '6px 18px', borderRadius: 20, backgroundColor: 'rgba(15, 23, 42, 0.82)',
        border: '2px solid rgba(250, 204, 21, 0.6)', fontFamily: 'sans-serif',
        fontSize: 22, fontWeight: 'bold', color: '#f8fafc', zIndex: 45,
      }}>
        @dysesat
      </div>

      <div style={{
        position: 'absolute', top: 146, left: 85, right: 85,
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

      {frame >= 1155 && (
        <div style={{
          position: 'absolute', top: 1475, left: 95, right: 95,
          backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '4px solid #facc15',
          borderRadius: 16, padding: '16px 20px', textAlign: 'center',
          fontFamily, fontSize: 16, color: '#facc15', transform: `scale(${cliffIn})`, zIndex: 50,
          display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12,
        }}>
          <span>BERSAMBUNG KE EPISODE 2</span>
          <PixelIcon type="fire" size={24} />
        </div>
      )}
    </AbsoluteFill>
  );
};
