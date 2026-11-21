import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PressStart2P';
import { whoosh, ding, mouseClick } from '@remotion/sfx';

const { fontFamily } = loadFont();

const SMART_CITIZENS = Array.from({ length: 32 }, (_, i) => ({
  id: i,
  bx: 18 + (i % 8) * 9,
  by: 24 + Math.floor(i / 8) * 14,
  speed: 0.05 + random(`sp-${i}`) * 0.04,
  phase: random(`ph-${i}`) * 10,
}));

const DUMB_CITIZENS = Array.from({ length: 32 }, (_, i) => ({
  id: i,
  bx: 16 + random(`dbx-${i}`) * 66,
  by: 20 + random(`dby-${i}`) * 58,
  speed: 0.11 + random(`dsp-${i}`) * 0.09,
  phase: random(`dph-${i}`) * 10,
  dieAt: 640 + Math.floor(random(`ddie-${i}`) * 260),
}));

const SMART_HOUSES = [
  [22, 24], [34, 24], [46, 24],
  [22, 42], [34, 42], [46, 42],
  [22, 60], [34, 60], [46, 60],
];

const TREES = [
  [12, 22], [14, 48], [13, 72], [84, 24], [85, 52], [82, 74], [52, 16], [30, 76],
];

const PixelPerson: React.FC<{
  color: string; isLeader?: boolean; name?: string; bubble?: string; walkPhase?: number; scale?: number;
}> = ({ color, isLeader = false, name, bubble, walkPhase = 0, scale = 1 }) => {
  const bob = Math.abs(Math.sin(walkPhase)) * 4;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${scale})`, position: 'relative' }}>
      {name && (
        <div style={{
          position: 'absolute', top: isLeader ? -58 : -44, whiteSpace: 'nowrap',
          backgroundColor: 'rgba(15, 23, 42, 0.88)', border: `2px solid ${isLeader ? '#facc15' : '#fff'}`,
          borderRadius: 8, padding: '3px 8px', fontFamily, fontSize: 10, color: isLeader ? '#facc15' : '#fff',
        }}>
          {isLeader ? `👑 ${name}` : name}
        </div>
      )}
      {bubble && (
        <div style={{
          position: 'absolute', top: -32, right: -22, backgroundColor: '#fff', border: '2px solid #0f172a',
          borderRadius: 8, padding: '2px 5px', fontSize: 13, lineHeight: 1, zIndex: 10,
        }}>
          {bubble}
        </div>
      )}
      {isLeader && !name && <div style={{ fontSize: 13, marginBottom: -3 }}>👑</div>}
      <div style={{ transform: `translateY(${-bob}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: 12, height: 11, backgroundColor: '#fed7aa', border: '2px solid #0f172a', borderRadius: 2 }} />
        <div style={{ width: 14, height: 13, backgroundColor: color, border: '2px solid #0f172a', borderTop: 'none', borderRadius: 2 }} />
      </div>
    </div>
  );
};
export const WorldBoxEp1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Durasi total 1260 frame (42 detik) -> Tahun 1 sampai Tahun 12
  const yearFloat = interpolate(frame, [0, 1180], [1, 12.9], { extrapolateRight: 'clamp' });
  const year = Math.min(12, Math.floor(yearFloat));

  // Populasi dinamis
  const smartPop = year < 6
    ? Math.floor(interpolate(frame, [0, 540], [100, 114], { extrapolateRight: 'clamp' }))
    : Math.floor(interpolate(frame, [540, 1200], [114, 135], { extrapolateRight: 'clamp' }));

  const dumbPop = year < 7
    ? 100
    : Math.floor(interpolate(frame, [620, 980], [100, 54], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));

  // Event Kemarau (Tahun 7 - 10 -> frame 580 - 930)
  const droughtFactor = interpolate(frame, [560, 620, 880, 940], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const grassColor = droughtFactor > 0.4 ? '#b48a3e' : '#4ade80';
  const grassEdge = droughtFactor > 0.4 ? '#926c2a' : '#22c55e';

  // Event Kebakaran Tahun 12 (frame >= 1030)
  const fireActive = frame >= 1030;
  const fireScale = fireActive ? spring({ frame: frame - 1030, fps, config: { damping: 8 } }) : 0;

  // Kamera Close-Up Otomatis pada momen Bima (frame 280-460) & Udin (frame 1030-1210)
  const zoomBima = interpolate(frame, [260, 300, 440, 480], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const zoomUdin = interpolate(frame, [1020, 1055, 1210, 1245], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const camScale = 1 + zoomBima * 0.52 + zoomUdin * 0.55;
  const camY = zoomBima * 235 - zoomUdin * 255;

  const builtCount = Math.min(SMART_HOUSES.length, Math.floor(interpolate(frame, [90, 520], [0, 9], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })));
  const statueProgress = interpolate(frame, [150, 450], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const spawnBeam = interpolate(frame, [0, 25, 65], [0, 1, 0], { extrapolateRight: 'clamp' });
  const cliffhangerIn = spring({ frame: frame - 1140, fps, config: { damping: 10 } });
  return (
    <AbsoluteFill style={{ backgroundColor: '#1d4ed8', overflow: 'hidden' }}>
      <Audio src={staticFile('vo_wb_ep1.mp3')} volume={1} />
      <Audio src={staticFile('bgm.wav')} volume={0.16} />
      <Sequence from={10} durationInFrames={40}><Audio src={ding} volume={0.4} /></Sequence>
      <Sequence from={265} durationInFrames={35}><Audio src={whoosh} volume={0.35} /></Sequence>
      <Sequence from={580} durationInFrames={35}><Audio src={mouseClick} volume={0.5} /></Sequence>
      <Sequence from={1030} durationInFrames={45}><Audio src={whoosh} volume={0.5} /></Sequence>
      <Sequence from={1140} durationInFrames={60}><Audio src={ding} volume={0.55} /></Sequence>

      {/* LAPISAN DUNIA PIXEL (Dapat di-Zoom Close-Up) */}
      <AbsoluteFill style={{ transform: `translateY(${camY}px) scale(${camScale})`, transformOrigin: 'center center' }}>
        {/* Pola Gelombang Laut Piksel */}
        <AbsoluteFill style={{
          backgroundImage: 'radial-gradient(#3b82f6 3px, transparent 3px)',
          backgroundSize: '36px 36px',
          backgroundPosition: `${(frame * 0.6) % 36}px ${(frame * 0.3) % 36}px`,
          opacity: 0.45,
        }} />

        {/* === PULAU ATAS: PULAU PINTAR === */}
        <div style={{
          position: 'absolute', top: 235, left: 110, right: 110, height: 615,
          backgroundColor: '#fde047', borderRadius: 68, border: '8px solid #0f172a',
          boxShadow: '0 14px 0 rgba(15,23,42,0.45)', padding: 26,
        }}>
          <div style={{
            width: '100%', height: '100%', backgroundColor: grassColor, borderRadius: 46,
            border: `6px solid ${grassEdge}`, position: 'relative', overflow: 'hidden',
          }}>
            {spawnBeam > 0 && (
              <div style={{ position: 'absolute', inset: 0, backgroundColor: `rgba(125, 211, 252, ${spawnBeam * 0.65})`, zIndex: 20 }} />
            )}

            {/* Pohon Hutan */}
            {TREES.map(([tx, ty], idx) => (
              <div key={idx} style={{ position: 'absolute', left: `${tx}%`, top: `${ty}%`, fontSize: 30, opacity: droughtFactor > 0.5 ? 0.55 : 1 }}>🌲</div>
            ))}

            {/* Rumah Kayu Berjejer Rapi */}
            {SMART_HOUSES.slice(0, builtCount).map(([hx, hy], idx) => (
              <div key={idx} style={{ position: 'absolute', left: `${hx}%`, top: `${hy}%`, fontSize: 32 }}>🏠</div>
            ))}

            {/* Ladang Gandum & Lumbung (Tahun 4+) */}
            {year >= 4 && (
              <div style={{
                position: 'absolute', right: '14%', top: '30%', width: 175, height: 195,
                backgroundColor: droughtFactor > 0.5 ? '#a16207' : '#eab308',
                border: '4px solid #713f12', borderRadius: 10,
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', placeItems: 'center', fontSize: 22,
              }}>
                <span>🌾</span><span>🌾</span><span>🌾</span>
                <span>🌾</span><span>🌾</span><span>🌾</span>
                <span>🌾</span><span>🌾</span><span>🌾</span>
              </div>
            )}

            {/* Menara Pengawas (Tahun 11+) */}
            {year >= 11 && (
              <>
                <div style={{ position: 'absolute', left: '12%', top: '12%', fontSize: 34 }}>🏰</div>
                <div style={{ position: 'absolute', right: '12%', top: '12%', fontSize: 34 }}>🏰</div>
              </>
            )}

            {/* Penduduk Biru */}
            {SMART_CITIZENS.map((c) => {
              const mx = Math.sin(frame * c.speed + c.phase) * 14;
              const my = Math.cos(frame * c.speed + c.phase) * 10;
              return (
                <div key={c.id} style={{ position: 'absolute', left: `${c.bx}%`, top: `${c.by}%`, transform: `translate(${mx}px, ${my}px)` }}>
                  <PixelPerson color="#2563eb" walkPhase={frame * 0.25 + c.phase} bubble={c.id === 4 && year >= 4 && year <= 6 ? '🌾' : undefined} />
                </div>
              );
            })}

            {/* Leader Bima */}
            <div style={{
              position: 'absolute',
              left: `${56 + Math.sin(frame * 0.05) * 8}%`,
              top: `${46 + Math.cos(frame * 0.05) * 6}%`,
              zIndex: 15,
            }}>
              <PixelPerson
                color="#1d4ed8"
                isLeader
                name={zoomBima > 0.35 ? 'BIMA' : undefined}
                bubble={year >= 3 && year <= 6 ? '💡' : droughtFactor > 0.5 ? '✅' : undefined}
                walkPhase={frame * 0.22}
                scale={1.25}
              />
            </div>
          </div>
        </div>

        {/* === GARIS PEMISAH TENGAH & VS === */}
        <div style={{
          position: 'absolute', top: 920, left: 0, right: 0, height: 14,
          backgroundColor: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 25,
        }}>
          <div style={{
            backgroundColor: '#1e293b', border: '5px solid #facc15', borderRadius: 16,
            padding: '8px 22px', fontFamily, fontSize: 26, color: '#facc15',
            boxShadow: '0 6px 0 #0f172a',
          }}>
            VS
          </div>
        </div>

        {/* === PULAU BAWAH: PULAU BODOH === */}
        <div style={{
          position: 'absolute', top: 1005, left: 110, right: 110, height: 615,
          backgroundColor: '#fde047', borderRadius: 68, border: '8px solid #0f172a',
          boxShadow: '0 14px 0 rgba(15,23,42,0.45)', padding: 26,
        }}>
          <div style={{
            width: '100%', height: '100%', backgroundColor: grassColor, borderRadius: 46,
            border: `6px solid ${grassEdge}`, position: 'relative', overflow: 'hidden',
          }}>
            {spawnBeam > 0 && (
              <div style={{ position: 'absolute', inset: 0, backgroundColor: `rgba(252, 165, 165, ${spawnBeam * 0.65})`, zIndex: 20 }} />
            )}

            {TREES.slice(0, 5).map(([tx, ty], idx) => (
              <div key={idx} style={{ position: 'absolute', left: `${tx}%`, top: `${ty}%`, fontSize: 30, opacity: droughtFactor > 0.5 ? 0.5 : 1 }}>🌲</div>
            ))}

            {/* 2 Gubuk Miring Berantakan */}
            {year >= 3 && (
              <>
                <div style={{ position: 'absolute', left: '68%', top: '24%', fontSize: 30, transform: 'rotate(14deg)' }}>🏚️</div>
                <div style={{ position: 'absolute', left: '64%', top: '65%', fontSize: 30, transform: 'rotate(-11deg)' }}>🏚️</div>
              </>
            )}

            {/* Patung Batu Raksasa Sia-sia */}
            {statueProgress > 0.1 && (
              <div style={{
                position: 'absolute', left: '42%', top: '34%', fontSize: 78,
                transform: `scale(${statueProgress})`, transformOrigin: 'bottom center',
              }}>
                🗿
              </div>
            )}

            {/* Kebakaran di Tahun ke-12! */}
            {fireActive && (
              <div style={{
                position: 'absolute', left: '46%', top: '54%',
                transform: `scale(${fireScale * (1 + Math.sin(frame * 0.6) * 0.12)})`,
                fontSize: 54, zIndex: 18,
              }}>
                🔥💨
              </div>
            )}

            {/* Penduduk Merah Berlarian Acak */}
            {DUMB_CITIZENS.map((c) => {
              if (year >= 7 && frame > c.dieAt && c.id > 15) return null;
              const mx = Math.sin(frame * c.speed + c.phase) * 32;
              const my = Math.cos(frame * (c.speed * 1.2) + c.phase) * 26;
              let bub: string | undefined = undefined;
              if (fireActive && c.id % 3 === 0) bub = '!';
              else if (droughtFactor > 0.5 && c.id % 4 === 0) bub = '🍖❌';
              else if (year < 6 && c.id % 5 === 0) bub = '?';

              return (
                <div key={c.id} style={{ position: 'absolute', left: `${c.bx}%`, top: `${c.by}%`, transform: `translate(${mx}px, ${my}px)` }}>
                  <PixelPerson color="#dc2626" walkPhase={frame * 0.35 + c.phase} bubble={bub} />
                </div>
              );
            })}

            {/* Leader Udin */}
            <div style={{
              position: 'absolute',
              left: `${44 + Math.sin(frame * 0.14) * 14}%`,
              top: `${56 + Math.cos(frame * 0.14) * 10}%`,
              zIndex: 16,
            }}>
              <PixelPerson
                color="#b91c1c"
                isLeader
                name={zoomUdin > 0.35 ? 'UDIN' : undefined}
                bubble={fireActive ? '🔥!' : droughtFactor > 0.5 ? '💀' : '?'}
                walkPhase={frame * 0.38}
                scale={1.25}
              />
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* === HUD MINIMALIS ZONA AMAN TIKTOK === */}
      {/* Watermark @dysesat */}
      <div style={{
        position: 'absolute', top: 92, left: '50%', transform: 'translateX(-50%)',
        padding: '6px 18px', borderRadius: 20, backgroundColor: 'rgba(15, 23, 42, 0.72)',
        border: '2px solid rgba(250, 204, 21, 0.5)', fontFamily: 'sans-serif',
        fontSize: 22, fontWeight: 'bold', color: '#f8fafc', zIndex: 40,
      }}>
        @dysesat
      </div>

      {/* Penghitung Tahun & Populasi Atas */}
      <div style={{
        position: 'absolute', top: 150, left: 95, right: 95,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 40,
      }}>
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.88)', border: '3px solid #facc15',
          borderRadius: 14, padding: '10px 16px', fontFamily, fontSize: 18, color: '#facc15',
        }}>
          TAHUN: {year}
        </div>
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.88)', border: '3px solid #38bdf8',
          borderRadius: 14, padding: '10px 16px', fontFamily, fontSize: 16, color: '#38bdf8',
        }}>
          🧠 {smartPop}
        </div>
      </div>

      {/* Label Pulau Pintar */}
      <div style={{
        position: 'absolute', top: 830, left: '50%', transform: 'translateX(-50%)',
        backgroundColor: '#0f172a', border: '3px solid #38bdf8', borderRadius: 12,
        padding: '6px 18px', fontFamily, fontSize: 15, color: '#38bdf8', zIndex: 35,
      }}>
        PULAU PINTAR
      </div>

      {/* Label Pulau Bodoh & Populasi */}
      <div style={{
        position: 'absolute', top: 975, left: '50%', transform: 'translateX(-50%)',
        backgroundColor: '#0f172a', border: '3px solid #f87171', borderRadius: 12,
        padding: '6px 18px', fontFamily, fontSize: 15, color: '#f87171', zIndex: 35,
      }}>
        PULAU BODOH • 🤪 {dumbPop}
      </div>

      {/* Lencana Cliffhanger Akhir Episode 1 (Zona Aman Tengah Bawah) */}
      {frame >= 1140 && (
        <div style={{
          position: 'absolute', bottom: 340, left: 100, right: 100,
          backgroundColor: 'rgba(15, 23, 42, 0.92)', border: '3px solid #facc15',
          borderRadius: 16, padding: '14px 18px', textAlign: 'center',
          fontFamily, fontSize: 16, color: '#facc15', transform: `scale(${cliffhangerIn})`, zIndex: 45,
        }}>
          BERSAMBUNG KE EPISODE 2 🔥
        </div>
      )}
    </AbsoluteFill>
  );
};
