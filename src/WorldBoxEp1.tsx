import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PressStart2P';
import { whoosh, ding, mouseClick } from '@remotion/sfx';

const { fontFamily } = loadFont();

// Grid pulau organik 16x10 (0=laut, 1=pasir, 2=rumput, 3=jalan, 4=batu)
const ISLAND_GRID = [
  [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,1,1,2,2,2,2,2,2,2,2,1,1,0,0],
  [0,1,1,2,2,2,3,3,3,2,2,2,2,1,1,0],
  [1,1,2,2,2,2,3,2,3,2,2,2,2,2,1,1],
  [1,2,2,2,3,3,3,3,3,3,3,2,2,2,2,1],
  [1,2,2,2,3,2,2,3,2,2,3,2,2,2,2,1],
  [1,1,2,2,2,2,2,3,2,2,2,2,2,2,1,1],
  [0,1,1,2,2,2,2,2,2,2,2,2,2,1,1,0],
  [0,0,1,1,2,2,2,2,2,2,2,2,1,1,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
];

// Jalur kerja penduduk Pintar (Hutan -> Jalan -> Lokasi Rumah -> Ladang)
const SMART_PATHS = [
  [[16, 30], [28, 30], [36, 44], [52, 44], [68, 44]],
  [[82, 28], [70, 35], [68, 52], [50, 52], [35, 52]],
  [[20, 68], [34, 62], [48, 55], [48, 32], [32, 26]],
  [[78, 70], [66, 62], [66, 42], [74, 42], [74, 58]],
];

const SMART_CITIZENS = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  pathIdx: i % SMART_PATHS.length,
  offset: (i * 0.19) % 1,
  speed: 0.0028 + random(`ssp-${i}`) * 0.0014,
  jitterX: (random(`sjx-${i}`) - 0.5) * 34,
  jitterY: (random(`sjy-${i}`) - 0.5) * 28,
}));

const DUMB_CITIZENS = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  ax: 20 + random(`dax-${i}`) * 60,
  ay: 24 + random(`day-${i}`) * 52,
  bx: 18 + random(`dbx-${i}`) * 64,
  by: 22 + random(`dby-${i}`) * 56,
  cx: 22 + random(`dcx-${i}`) * 56,
  cy: 25 + random(`dcy-${i}`) * 50,
  speed: 0.018 + random(`dsp-${i}`) * 0.015,
  phase: random(`dph-${i}`) * 12,
  dieAt: 640 + Math.floor(random(`ddie-${i}`) * 260),
}));

const SMART_HOUSES = [
  [25, 25], [37, 25], [49, 25],
  [25, 43], [37, 43],
  [25, 61], [37, 61], [49, 61],
];

const PixelTree: React.FC<{ x: number; y: number; felled?: boolean; dry?: boolean }> = ({ x, y, felled = false, dry = false }) => (
  <div style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -80%)' }}>
    {felled ? (
      <div style={{ width: 18, height: 10, backgroundColor: '#78350f', border: '2px solid #0f172a', borderRadius: 2 }} />
    ) : (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderBottom: `16px solid ${dry ? '#a16207' : '#15803d'}` }} />
        <div style={{ width: 0, height: 0, borderLeft: '16px solid transparent', borderRight: '16px solid transparent', borderBottom: `20px solid ${dry ? '#854d0e' : '#166534'}`, marginTop: -6 }} />
        <div style={{ width: 8, height: 10, backgroundColor: '#713f12', border: '2px solid #0f172a' }} />
      </div>
    )}
  </div>
);

const PixelHouse: React.FC<{ x: number; y: number; roofColor: string; tilted?: boolean; scale?: number }> = ({ x, y, roofColor, tilted = false, scale = 1 }) => (
  <div style={{
    position: 'absolute', left: `${x}%`, top: `${y}%`,
    transform: `translate(-50%, -70%) rotate(${tilted ? 12 : 0}deg) scale(${scale})`,
    display: 'flex', flexDirection: 'column', alignItems: 'center',
  }}>
    <div style={{ width: 42, height: 16, backgroundColor: roofColor, border: '3px solid #0f172a', borderRadius: '6px 6px 0 0' }} />
    <div style={{ width: 34, height: 22, backgroundColor: '#d97706', border: '3px solid #0f172a', borderTop: 'none', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
      <div style={{ width: 10, height: 13, backgroundColor: '#451a03' }} />
    </div>
  </div>
);
const PixelPerson: React.FC<{
  color: string; isLeader?: boolean; name?: string; bubble?: string; walkPhase?: number; flip?: boolean; scale?: number;
}> = ({ color, isLeader = false, name, bubble, walkPhase = 0, flip = false, scale = 1 }) => {
  const step = Math.sin(walkPhase);
  const bob = Math.abs(step) * 5;
  const tilt = step * 8;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${scale})`, position: 'relative' }}>
      {name && (
        <div style={{
          position: 'absolute', top: -54, whiteSpace: 'nowrap',
          backgroundColor: 'rgba(15, 23, 42, 0.92)', border: `2px solid ${isLeader ? '#facc15' : '#fff'}`,
          borderRadius: 8, padding: '4px 9px', fontFamily, fontSize: 10, color: isLeader ? '#facc15' : '#fff', zIndex: 30,
        }}>
          {isLeader ? `👑 ${name}` : name}
        </div>
      )}
      {bubble && (
        <div style={{
          position: 'absolute', top: -32, right: -22, backgroundColor: '#fff', border: '2px solid #0f172a',
          borderRadius: 8, padding: '2px 5px', fontSize: 12, lineHeight: 1, zIndex: 25,
        }}>
          {bubble}
        </div>
      )}
      {isLeader && !name && <div style={{ fontSize: 13, marginBottom: -3 }}>👑</div>}
      <div style={{
        transform: `translateY(${-bob}px) rotate(${tilt}deg) scaleX(${flip ? -1 : 1})`,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <div style={{ width: 13, height: 12, backgroundColor: '#fed7aa', border: '2px solid #0f172a', borderRadius: 2 }} />
        <div style={{ width: 15, height: 13, backgroundColor: color, border: '2px solid #0f172a', borderTop: 'none', borderRadius: 2 }} />
        <div style={{ display: 'flex', gap: 3, marginTop: -1 }}>
          <div style={{ width: 4, height: 5, backgroundColor: '#0f172a', transform: `translateY(${step > 0 ? -2 : 0}px)` }} />
          <div style={{ width: 4, height: 5, backgroundColor: '#0f172a', transform: `translateY(${step < 0 ? -2 : 0}px)` }} />
        </div>
      </div>
    </div>
  );
};

function samplePath(pts: number[][], t: number) {
  const total = pts.length - 1;
  const scaled = (t % 1) * total;
  const idx = Math.floor(scaled);
  const frac = scaled - idx;
  const [x1, y1] = pts[idx];
  const [x2, y2] = pts[idx + 1];
  return { x: x1 + (x2 - x1) * frac, y: y1 + (y2 - y1) * frac, dir: x2 < x1 };
}
export const WorldBoxEp1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const yearFloat = interpolate(frame, [0, 1180], [1, 12.9], { extrapolateRight: 'clamp' });
  const year = Math.min(12, Math.floor(yearFloat));

  const smartPop = year < 6
    ? Math.floor(interpolate(frame, [0, 540], [100, 114], { extrapolateRight: 'clamp' }))
    : Math.floor(interpolate(frame, [540, 1200], [114, 135], { extrapolateRight: 'clamp' }));

  const dumbPop = year < 7
    ? 100
    : Math.floor(interpolate(frame, [620, 980], [100, 54], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));

  const droughtFactor = interpolate(frame, [560, 620, 880, 940], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const isDry = droughtFactor > 0.4;

  const fireActive = frame >= 1030;
  const fireScale = fireActive ? spring({ frame: frame - 1030, fps, config: { damping: 8 } }) : 0;

  const zoomBima = interpolate(frame, [260, 300, 440, 480], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const zoomUdin = interpolate(frame, [1020, 1055, 1210, 1245], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const camScale = 1 + zoomBima * 0.45 + zoomUdin * 0.48;
  const camY = zoomBima * 210 - zoomUdin * 230;

  const builtCount = Math.min(SMART_HOUSES.length, Math.floor(interpolate(frame, [90, 520], [0, 8], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })));
  const statueProgress = interpolate(frame, [150, 450], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const spawnBeam = interpolate(frame, [0, 25, 65], [0, 1, 0], { extrapolateRight: 'clamp' });
  const cliffhangerIn = spring({ frame: frame - 1140, fps, config: { damping: 10 } });

  const renderIslandTiles = (showPath: boolean) => (
    <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gridTemplateRows: 'repeat(10, 1fr)' }}>
      {ISLAND_GRID.flat().map((cell, idx) => {
        let bg = 'transparent';
        if (cell === 1) bg = '#fde047';
        else if (cell === 2) bg = isDry ? '#b48a3e' : '#4ade80';
        else if (cell === 3) bg = showPath ? (isDry ? '#92400e' : '#d97706') : (isDry ? '#b48a3e' : '#4ade80');
        return <div key={idx} style={{ backgroundColor: bg }} />;
      })}
    </div>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#1e40af', overflow: 'hidden' }}>
      <Audio src={staticFile('vo_wb_ep1.mp3')} volume={1} />
      <Audio src={staticFile('bgm.wav')} volume={0.16} />
      <Sequence from={10} durationInFrames={40}><Audio src={ding} volume={0.4} /></Sequence>
      <Sequence from={265} durationInFrames={35}><Audio src={whoosh} volume={0.35} /></Sequence>
      <Sequence from={580} durationInFrames={35}><Audio src={mouseClick} volume={0.5} /></Sequence>
      <Sequence from={1030} durationInFrames={45}><Audio src={whoosh} volume={0.5} /></Sequence>
      <Sequence from={1140} durationInFrames={60}><Audio src={ding} volume={0.55} /></Sequence>

      <AbsoluteFill style={{ transform: `translateY(${camY}px) scale(${camScale})`, transformOrigin: 'center center' }}>
        {/* Gelombang Laut Piksel */}
        <AbsoluteFill style={{
          backgroundImage: 'radial-gradient(#38bdf8 4px, transparent 4px)',
          backgroundSize: '44px 44px',
          backgroundPosition: `${(frame * 0.9) % 44}px ${(frame * 0.4) % 44}px`,
          opacity: 0.45,
        }} />

        {/* === PULAU ATAS: PULAU PINTAR === */}
        <div style={{ position: 'absolute', top: 230, left: 75, right: 75, height: 610 }}>
          {renderIslandTiles(year >= 2)}
          {spawnBeam > 0 && <div style={{ position: 'absolute', inset: 40, backgroundColor: `rgba(125, 211, 252, ${spawnBeam * 0.65})`, borderRadius: 40, zIndex: 20 }} />}

          <PixelTree x={18} y={28} felled={year >= 2} dry={isDry} />
          <PixelTree x={82} y={28} felled={year >= 3} dry={isDry} />
          <PixelTree x={18} y={70} dry={isDry} />
          <PixelTree x={82} y={70} dry={isDry} />
          <PixelTree x={52} y={18} dry={isDry} />

          {SMART_HOUSES.slice(0, builtCount).map(([hx, hy], idx) => (
            <PixelHouse key={idx} x={hx} y={hy} roofColor="#2563eb" scale={spring({ frame: frame - (90 + idx * 50), fps, config: { damping: 10 } })} />
          ))}

          {/* Ladang Gandum & Lumbung */}
          {year >= 4 && (
            <div style={{
              position: 'absolute', left: '63%', top: '34%', width: 175, height: 185,
              backgroundColor: isDry ? '#92400e' : '#eab308', border: '4px solid #713f12',
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', placeItems: 'center', fontSize: 22,
            }}>
              <span>🌾</span><span>🌾</span><span>🌾</span>
              <span>🌾</span><span>🌾</span><span>🌾</span>
              <span>🌾</span><span>🌾</span><span>🌾</span>
            </div>
          )}

          {/* Menara Batu Tahun 11+ */}
          {year >= 11 && (
            <>
              <div style={{ position: 'absolute', left: '16%', top: '16%', width: 26, height: 42, backgroundColor: '#94a3b8', border: '3px solid #0f172a' }} />
              <div style={{ position: 'absolute', right: '16%', top: '16%', width: 26, height: 42, backgroundColor: '#94a3b8', border: '3px solid #0f172a' }} />
            </>
          )}

          {/* Penduduk Pintar Berjalan Menyusuri Jalur */}
          {SMART_CITIZENS.map((c) => {
            const pos = samplePath(SMART_PATHS[c.pathIdx], c.offset + frame * c.speed);
            return (
              <div key={c.id} style={{ position: 'absolute', left: `${pos.x}%`, top: `${pos.y}%`, transform: `translate(${c.jitterX}px, ${c.jitterY}px)` }}>
                <PixelPerson color="#2563eb" walkPhase={frame * 0.35 + c.id} flip={pos.dir} bubble={c.id === 3 && year >= 4 && year <= 6 ? '🌾' : undefined} />
              </div>
            );
          })}

          {/* Leader Bima */}
          {(() => {
            const bPos = samplePath([[44, 44], [62, 44], [62, 54], [44, 54]], frame * 0.004);
            return (
              <div style={{ position: 'absolute', left: `${bPos.x}%`, top: `${bPos.y}%`, zIndex: 20 }}>
                <PixelPerson
                  color="#1d4ed8"
                  isLeader
                  name={zoomBima > 0.3 ? 'BIMA' : undefined}
                  bubble={year >= 3 && year <= 6 ? '💡' : isDry ? '✅' : undefined}
                  walkPhase={frame * 0.3}
                  flip={bPos.dir}
                  scale={1.25}
                />
              </div>
            );
          })()}

          <div style={{
            position: 'absolute', bottom: -14, left: '50%', transform: 'translateX(-50%)',
            backgroundColor: '#0f172a', border: '3px solid #38bdf8', borderRadius: 12,
            padding: '6px 18px', fontFamily, fontSize: 15, color: '#38bdf8', zIndex: 35,
          }}>
            PULAU PINTAR
          </div>
        </div>

        {/* === GARIS PEMISAH TENGAH & VS === */}
        <div style={{
          position: 'absolute', top: 915, left: 0, right: 0, height: 14,
          backgroundColor: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 25,
        }}>
          <div style={{
            backgroundColor: '#1e293b', border: '5px solid #facc15', borderRadius: 16,
            padding: '8px 22px', fontFamily, fontSize: 26, color: '#facc15', boxShadow: '0 6px 0 #0f172a',
          }}>
            VS
          </div>
        </div>

        {/* === PULAU BAWAH: PULAU BODOH === */}
        <div style={{ position: 'absolute', top: 995, left: 75, right: 75, height: 610 }}>
          {renderIslandTiles(false)}
          {spawnBeam > 0 && <div style={{ position: 'absolute', inset: 40, backgroundColor: `rgba(252, 165, 165, ${spawnBeam * 0.65})`, borderRadius: 40, zIndex: 20 }} />}

          <PixelTree x={20} y={28} felled={year >= 2} dry={isDry} />
          <PixelTree x={80} y={30} felled={year >= 3} dry={isDry} />
          <PixelTree x={22} y={70} felled={year >= 4} dry={isDry} />
          <PixelTree x={78} y={72} dry={isDry} />

          {/* 2 Gubuk Miring Berantakan */}
          {year >= 3 && (
            <>
              <PixelHouse x={72} y={32} roofColor="#dc2626" tilted scale={0.9} />
              <PixelHouse x={68} y={72} roofColor="#dc2626" tilted scale={0.85} />
            </>
          )}

          {/* Patung Batu Raksasa Pixel */}
          {statueProgress > 0.1 && (
            <div style={{
              position: 'absolute', left: '46%', top: '42%',
              transform: `translate(-50%, -75%) scale(${statueProgress})`,
              display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}>
              <div style={{ width: 38, height: 48, backgroundColor: '#94a3b8', border: '4px solid #0f172a', borderRadius: '8px 8px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 22, height: 6, backgroundColor: '#475569', marginBottom: 6 }} />
                <div style={{ width: 8, height: 14, backgroundColor: '#64748b' }} />
              </div>
              <div style={{ width: 52, height: 14, backgroundColor: '#64748b', border: '4px solid #0f172a', borderTop: 'none' }} />
            </div>
          )}

          {/* Kobaran Api Pixel Tahun 12! */}
          {fireActive && (
            <div style={{
              position: 'absolute', left: '48%', top: '56%',
              transform: `translate(-50%, -50%) scale(${fireScale * (1 + Math.sin(frame * 0.7) * 0.14)})`,
              zIndex: 22, display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}>
              <div style={{ width: 22, height: 22, backgroundColor: '#fef08a', borderRadius: '50% 50% 20% 20%', marginBottom: -10 }} />
              <div style={{ width: 42, height: 42, backgroundColor: '#f97316', border: '3px solid #dc2626', borderRadius: '50% 50% 30% 30%' }} />
            </div>
          )}

          {/* Penduduk Bodoh Berlarian & Panik Menjauhi Api */}
          {DUMB_CITIZENS.map((c) => {
            if (year >= 7 && frame > c.dieAt && c.id > 15) return null;
            const t = (frame * c.speed + c.phase) % 3;
            let px = c.ax, py = c.ay, dir = false;
            if (fireActive) {
              // Panik lari ke tepi pulau menjauhi titik api (48, 56)
              const angle = (c.id / 28) * Math.PI * 2 + Math.sin(frame * 0.25) * 0.3;
              px = 48 + Math.cos(angle) * 28;
              py = 52 + Math.sin(angle) * 24;
              dir = Math.cos(angle) < 0;
            } else if (t < 1) {
              px = c.ax + (c.bx - c.ax) * t;
              py = c.ay + (c.by - c.ay) * t;
              dir = c.bx < c.ax;
            } else if (t < 2) {
              px = c.bx + (c.cx - c.bx) * (t - 1);
              py = c.by + (c.cy - c.by) * (t - 1);
              dir = c.cx < c.bx;
            } else {
              px = c.cx + (c.ax - c.cx) * (t - 2);
              py = c.cy + (c.ay - c.cy) * (t - 2);
              dir = c.ax < c.cx;
            }

            let bub: string | undefined = undefined;
            if (fireActive && c.id % 2 === 0) bub = '!';
            else if (isDry && c.id % 4 === 0) bub = '🍖❌';
            else if (year < 6 && c.id % 5 === 0) bub = '?';

            return (
              <div key={c.id} style={{ position: 'absolute', left: `${px}%`, top: `${py}%` }}>
                <PixelPerson color="#dc2626" walkPhase={frame * (fireActive ? 0.6 : 0.42) + c.id} flip={dir} bubble={bub} />
              </div>
            );
          })}

          {/* Leader Udin */}
          {(() => {
            const uPos = samplePath([[38, 52], [56, 48], [52, 64], [36, 60]], frame * (fireActive ? 0.015 : 0.008));
            return (
              <div style={{ position: 'absolute', left: `${uPos.x}%`, top: `${uPos.y}%`, zIndex: 24 }}>
                <PixelPerson
                  color="#b91c1c"
                  isLeader
                  name={zoomUdin > 0.3 ? 'UDIN' : undefined}
                  bubble={fireActive ? '🔥!' : isDry ? '💀' : '?'}
                  walkPhase={frame * 0.48}
                  flip={uPos.dir}
                  scale={1.25}
                />
              </div>
            );
          })()}

          <div style={{
            position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
            backgroundColor: '#0f172a', border: '3px solid #f87171', borderRadius: 12,
            padding: '6px 18px', fontFamily, fontSize: 15, color: '#f87171', zIndex: 35,
          }}>
            PULAU BODOH • 🤪 {dumbPop}
          </div>
        </div>
      </AbsoluteFill>

      {/* === HUD TETAP ZONA AMAN TIKTOK === */}
      <div style={{
        position: 'absolute', top: 92, left: '50%', transform: 'translateX(-50%)',
        padding: '6px 18px', borderRadius: 20, backgroundColor: 'rgba(15, 23, 42, 0.78)',
        border: '2px solid rgba(250, 204, 21, 0.55)', fontFamily: 'sans-serif',
        fontSize: 22, fontWeight: 'bold', color: '#f8fafc', zIndex: 40,
      }}>
        @dysesat
      </div>

      <div style={{
        position: 'absolute', top: 150, left: 90, right: 90,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 40,
      }}>
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '3px solid #facc15',
          borderRadius: 14, padding: '10px 16px', fontFamily, fontSize: 18, color: '#facc15',
        }}>
          TAHUN: {year}
        </div>
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '3px solid #38bdf8',
          borderRadius: 14, padding: '10px 16px', fontFamily, fontSize: 16, color: '#38bdf8',
        }}>
          🧠 {smartPop}
        </div>
      </div>

      {frame >= 1140 && (
        <div style={{
          position: 'absolute', bottom: 340, left: 100, right: 100,
          backgroundColor: 'rgba(15, 23, 42, 0.94)', border: '3px solid #facc15',
          borderRadius: 16, padding: '14px 18px', textAlign: 'center',
          fontFamily, fontSize: 16, color: '#facc15', transform: `scale(${cliffhangerIn})`, zIndex: 45,
        }}>
          BERSAMBUNG KE EPISODE 2 🔥
        </div>
      )}
    </AbsoluteFill>
  );
};
