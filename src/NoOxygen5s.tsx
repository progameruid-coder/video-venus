import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PressStart2P';
import { whoosh, ding } from '@remotion/sfx';
import { WORD_SUBS_OXY5S, OXY_TIMING } from './oxy5sWords';
import { CloseUpUdinSunburn } from './NoOxygen5sCutscene';

const { fontFamily } = loadFont();

const getWordColor = (word: string) => {
  const c = word.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (['oksigen', 'langit', 'siang', 'udara', 'ozon', 'kota', 'beton'].includes(c)) return '#38bdf8';
  if (['hilang', 'hancur', 'gelap', 'mogok', 'retak', 'ambruk', 'gosong', 'pecah', 'puing'].includes(c)) return '#f87171';
  if (['lima', 'detik', 'pertama', 'kedua', 'ketiga', 'keempat', 'kelima', 'uv', 'menit'].includes(c)) return '#fde047';
  return '#ffffff';
};

const OxyCar: React.FC<{ x: number; y: number; color: string; roof: string; taxi?: boolean; stalled: boolean; frame: number }> = ({ x, y, color, roof, taxi = false, stalled, frame }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect x="-26" y="-8" width="52" height="15" fill={color} stroke="#0f172a" strokeWidth="1.8" />
    <rect x="-15" y="-17" width="30" height="10" fill={roof} stroke="#0f172a" strokeWidth="1.8" />
    <rect x="-12" y="-15" width="11" height="6" fill="#bae6fd" /><rect x="2" y="-15" width="10" height="6" fill="#bae6fd" />
    {taxi && <rect x="-5" y="-21" width="10" height="5" fill="#fef08a" stroke="#0f172a" strokeWidth="1.2" />}
    <rect x="-20" y="4" width="10" height="9" fill="#0f172a" /><rect x="10" y="4" width="10" height="9" fill="#0f172a" />
    <rect x="-18" y="6" width="5" height="5" fill="#94a3b8" /><rect x="12" y="6" width="5" height="5" fill="#94a3b8" />
    {stalled && (
      <g>
        <rect x={taxi ? -25 : 15} y={-18 - (frame % 18)} width="10" height="7" fill="#e2e8f0" stroke="#334155" strokeWidth="1.2" opacity={0.9 - (frame % 18) / 22} />
        <rect x={taxi ? -21 : 19} y={-27 - ((frame + 9) % 18)} width="7" height="6" fill="#cbd5e1" stroke="#334155" strokeWidth="1" opacity={0.75 - ((frame + 9) % 18) / 24} />
        <g transform="translate(0, -28)" opacity={frame % 16 < 10 ? 1 : 0.35}>
          <rect x="-6" y="-6" width="12" height="11" rx="2" fill="#0f172a" />
          <text x="-3.5" y="2.5" fill="#f87171" fontSize="9" fontFamily="monospace" fontWeight="bold">X</text>
        </g>
      </g>
    )}
  </g>
);

const MiniBox3D: React.FC<{
  x: number; y: number; w: number; h: number;
  dx?: number; dy?: number; front: string; top: string; side: string; sw?: number;
}> = ({ x, y, w, h, dx = 3, dy = 2.2, front, top, side, sw = 1.1 }) => (
  <g stroke="#0f172a" strokeWidth={sw} strokeLinejoin="round">
    <polygon points={`${x},${y} ${x + dx},${y - dy} ${x + w + dx},${y - dy} ${x + w},${y}`} fill={top} />
    <polygon points={`${x + w},${y} ${x + w + dx},${y - dy} ${x + w + dx},${y + h - dy} ${x + w},${y + h}`} fill={side} />
    <rect x={x} y={y} width={w} height={h} fill={front} />
  </g>
);

const SHIRT_SHADES: Record<string, { front: string; top: string; side: string }> = {
  '#dc2626': { front: '#dc2626', top: '#ef4444', side: '#991b1b' },
  '#16a34a': { front: '#16a34a', top: '#22c55e', side: '#15803d' },
  '#9333ea': { front: '#9333ea', top: '#a855f7', side: '#6b21a8' },
};

const OxyPerson: React.FC<{ x: number; y: number; shirt: string; sunburn: boolean; showHeat: boolean; holdEar: boolean; panic: boolean; after: boolean; walk?: boolean; frame: number; drink?: boolean }> = ({ x, y, shirt, sunburn, showHeat, holdEar, panic, after, walk = false, frame, drink = false }) => {
  const sh = SHIRT_SHADES[shirt] || { front: shirt, top: shirt, side: shirt };
  const sk = sunburn
    ? { front: '#fb7185', top: '#fda4af', side: '#e11d48' }
    : { front: '#fed7aa', top: '#ffedd5', side: '#fdba74' };
  const isWave = panic && !holdEar && !after;
  const isEar = holdEar && !after;
  const fl = isWave ? Math.sin(frame * 0.72) * 18 : 0;
  const walkStep = walk ? Math.sin(frame * 0.28) * 16 : 0;
  const bounce = Math.sin(frame * (isWave ? 0.55 : 0.2));
  const sx = 1 + bounce * (isWave ? 0.045 : 0.02);
  const sy = 1 - bounce * (isWave ? 0.045 : 0.02);
  const bob = isWave ? Math.abs(Math.sin(frame * 0.45)) * -3.2 : walk ? Math.abs(Math.sin(frame * 0.28)) * -1.8 : 0;
  const blink = !panic && !after && (frame % 95) > 90;
  const wince = isEar && (frame % 26) > 16;
  const headTilt = isEar ? Math.sin(frame * 0.35) * 4 : isWave ? Math.sin(frame * 0.45) * 3 : 0;

  return (
    <g shapeRendering="auto" transform={`translate(${x + (isEar ? Math.sin(frame * 1.1) * 0.9 : 0)}, ${y + (after ? 5 : 0) + bob}) scale(${sx}, ${sy})`}>
      <ellipse cx="1.5" cy={after ? 5.5 : 10.5} rx={after ? 11 : 8.5} ry="2.8" fill="rgba(15,23,42,0.3)" />

      {/* 2 Kaki Kubus Buntet + Sepatu Putih */}
      {after ? (
        <>
          <MiniBox3D x={-10} y={0.5} w={7.5} h={4.5} dx={2.2} dy={1.6} front="#1d4ed8" top="#3b82f6" side="#1e3a8a" sw={1} />
          <rect x="-10" y="0.5" width="2.4" height="4.5" fill="#f8fafc" stroke="#0f172a" strokeWidth="0.9" />
          <MiniBox3D x={2.5} y={0.5} w={7.5} h={4.5} dx={2.2} dy={1.6} front="#1d4ed8" top="#3b82f6" side="#1e3a8a" sw={1} />
          <rect x="7.6" y="0.5" width="2.4" height="4.5" fill="#f8fafc" stroke="#0f172a" strokeWidth="0.9" />
        </>
      ) : (
        <>
          <g transform={`translate(-3.5, 2) rotate(${walkStep})`}>
            <MiniBox3D x={-2.5} y={0} w={5} h={7.5} dx={2} dy={1.5} front="#1d4ed8" top="#3b82f6" side="#1e3a8a" sw={1} />
            <rect x="-2.5" y="5.4" width="5" height="2.2" fill="#f8fafc" stroke="#0f172a" strokeWidth="0.85" />
          </g>
          <g transform={`translate(3.5, 2) rotate(${-walkStep})`}>
            <MiniBox3D x={-2.5} y={0} w={5} h={7.5} dx={2} dy={1.5} front="#1d4ed8" top="#3b82f6" side="#1e3a8a" sw={1} />
            <rect x="-2.5" y="5.4" width="5" height="2.2" fill="#f8fafc" stroke="#0f172a" strokeWidth="0.85" />
          </g>
        </>
      )}

      {/* Badan Kubus Mungil */}
      <MiniBox3D x={-7} y={after ? -7 : -8} w={14} h={after ? 9.5 : 10.5} dx={3.2} dy={2.4} front={sh.front} top={sh.top} side={sh.side} sw={1.15} />

      {/* Lengan Kanan (di sisi 3D badan) + Gelas Es Voxel Khusus Si Udin */}
      {!isEar || drink ? (
        <g transform={`translate(7.5, ${after ? -5 : -6.5}) rotate(${isWave && !drink ? -128 - fl : after && !drink ? -28 : walkStep * 0.5})`}>
          <MiniBox3D x={0} y={0} w={4} h={5.5} dx={1.8} dy={1.3} front={sh.front} top={sh.top} side={sh.side} sw={1} />
          <MiniBox3D x={0} y={5} w={4} h={3} dx={1.8} dy={1.3} front={sk.front} top={sk.top} side={sk.side} sw={1} />
        </g>
      ) : null}
      {drink && (
        <g transform={`translate(12, ${after ? -4.5 : -5.5})`}>
          <g transform="translate(3.8, -0.5) rotate(24)"><rect x="-0.8" y="-4.5" width="1.6" height="5" fill="#ef4444" stroke="#0f172a" strokeWidth="0.6" /></g>
          <MiniBox3D x={0} y={0} w={5.5} h={7} dx={1.8} dy={1.4} front="#38bdf8" top="#e0f2fe" side="#0284c7" sw={0.95} />
          <rect x="-0.4" y="-0.8" width="6.2" height="1.5" fill="#f8fafc" stroke="#0f172a" strokeWidth="0.7" />
        </g>
      )}

      {/* Lengan Kiri (Normal / Melambai / Duduk) */}
      {!isEar && (
        <g transform={`translate(-7.5, ${after ? -5 : -6.5}) rotate(${isWave ? 128 + fl : after ? 28 : -walkStep * 0.5})`}>
          <MiniBox3D x={-4} y={0} w={4} h={5.5} dx={1.8} dy={1.3} front={sh.front} top={sh.top} side={sh.side} sw={1} />
          <MiniBox3D x={-4} y={5} w={4} h={3} dx={1.8} dy={1.3} front={sk.front} top={sk.top} side={sk.side} sw={1} />
        </g>
      )}

      {/* KEPALA KUBUS BESAR CHIBI VOXEL 3D */}
      <g transform={`translate(0, ${after ? -7 : -8}) rotate(${headTilt})`}>
        <MiniBox3D x={-8.5} y={-16} w={17} h={16} dx={4} dy={3} front={sk.front} top={sk.top} side={sk.side} sw={1.25} />
        {/* Rambut Voxel + Poni */}
        <MiniBox3D x={-9} y={-20} w={18} h={4.5} dx={4} dy={3} front="#3b1d0e" top="#5c2d16" side="#1f0e06" sw={1.15} />
        <rect x="-7" y="-15.5" width="3.5" height="2" fill="#3b1d0e" /><rect x="3" y="-15.5" width="4" height="1.6" fill="#3b1d0e" />

        {/* Pipi Merah Gosong */}
        {sunburn && (
          <>
            <rect x="-7.2" y="-6.2" width="3" height="1.8" fill="#f43f5e" />
            <rect x="4.2" y="-6.2" width="3" height="1.8" fill="#f43f5e" />
          </>
        )}

        {/* Mata Chibi Ekspresif: Berkedip | Menyipit (> <) | Melotot Berkilau */}
        {wince ? (
          <g stroke="#0f172a" strokeWidth="1.5" fill="none" strokeLinecap="square">
            <polyline points="-6,-12 -3,-10 -6,-8" />
            <polyline points="6,-12 3,-10 6,-8" />
          </g>
        ) : blink ? (
          <>
            <rect x="-6.2" y="-10" width="4.5" height="1.3" fill="#0f172a" />
            <rect x="1.7" y="-10" width="4.5" height="1.3" fill="#0f172a" />
          </>
        ) : (
          <>
            <rect x="-6.2" y="-12.5" width="4.6" height="5.2" fill="#ffffff" stroke="#0f172a" strokeWidth="1" />
            <rect x="1.6" y="-12.5" width="4.6" height="5.2" fill="#ffffff" stroke="#0f172a" strokeWidth="1" />
            <rect x="-4.7" y="-10.6" width="2.2" height="2.4" fill="#0f172a" />
            <rect x="2.9" y="-10.6" width="2.2" height="2.4" fill="#0f172a" />
            <rect x="-4.5" y="-10.4" width="1" height="1" fill="#ffffff" />
            <rect x="3.1" y="-10.4" width="1" height="1" fill="#ffffff" />
          </>
        )}

        {/* Mulut Ekspresif */}
        {(panic || after) && <rect x="-3" y="-5.2" width="6" height={isWave || isEar ? 3 : 2} fill="#7f1d1d" stroke="#0f172a" strokeWidth="0.7" />}

        {/* Tangan Menekuk Menutup Telinga (Ikut Miring Bersama Kepala!) */}
        {isEar && (
          <>
            <MiniBox3D x={-12.5} y={-6} w={3.8} h={6.5} dx={1.6} dy={1.2} front={sh.front} top={sh.top} side={sh.side} sw={0.95} />
            <MiniBox3D x={-12} y={-10.5} w={4} h={4.5} dx={1.6} dy={1.2} front={sk.front} top={sk.top} side={sk.side} sw={0.95} />
            {!drink && (
              <>
                <MiniBox3D x={10} y={-6} w={3.8} h={6.5} dx={1.6} dy={1.2} front={sh.front} top={sh.top} side={sh.side} sw={0.95} />
                <MiniBox3D x={9.5} y={-10.5} w={4} h={4.5} dx={1.6} dy={1.2} front={sk.front} top={sk.top} side={sk.side} sw={0.95} />
              </>
            )}
            <g opacity={frame % 8 < 4 ? 1 : 0.3} fill="#fde047">
              <rect x="-16" y="-12" width="1.8" height="1.8" /><rect x="-17.8" y="-10.2" width="1.8" height="4.4" /><rect x="-16" y="-5.8" width="1.8" height="1.8" />
            </g>
          </>
        )}

        {/* Gelombang Panas Halus di Atas Kepala Saat UV */}
        {showHeat && [-4, 4].map((hx, i) => {
          const hp = ((frame + i * 10) % 20) / 20;
          return <rect key={i} x={hx} y={-25 - hp * 9} width="2.4" height="3.5" fill="#fef08a" opacity={Math.sin(hp * Math.PI) * 0.78} />;
        })}
      </g>
    </g>
  );
};

const ConcreteBuilding: React.FC<{ x: number; y: number; w: number; h: number; color: string; variant: 0 | 1 | 2; collapseT: number; frame: number }> = ({ x, y, w, h, color, variant, collapseT, frame }) => {
  const curH = Math.max(12, h * (1 - collapseT * 0.9));
  const curY = y + (h - curH);
  const vib = collapseT > 0.02 && collapseT < 0.9 ? Math.sin(frame * 2.8 + variant) * 2.4 : 0;
  const base = y + h;
  return (
    <g transform={`translate(${x + vib}, 0)`}>
      {collapseT < 0.86 ? (
        <>
          <rect x="0" y={curY} width={w} height={curH} fill={color} stroke="#0f172a" strokeWidth="2" />
          {collapseT < 0.15 ? (
            <rect x="-2" y={curY - 4} width={w + 4} height="6" fill="#334155" stroke="#0f172a" strokeWidth="1.5" />
          ) : (
            /* Atap Patah Bergigi Saat Ambruk */
            <polygon points={`0,${curY} 10,${curY - 5} 22,${curY + 3} 36,${curY - 4} ${w},${curY + 2} ${w},${curY + 8} 0,${curY + 8}`} fill="#475569" stroke="#0f172a" strokeWidth="1.4" />
          )}
          {curH > 44 && [0, 1, 2].map((row) => curY + 12 + row * 26 < base - 16 && (
            <g key={row}>
              <rect x={8} y={curY + 12 + row * 26} width={13} height={14} fill="#bae6fd" stroke="#0f172a" strokeWidth="1.4" />
              <rect x={w - 21} y={curY + 12 + row * 26} width={13} height={14} fill="#bae6fd" stroke="#0f172a" strokeWidth="1.4" />
            </g>
          ))}
          {collapseT > 0.04 && (
            <>
              <rect x={w * 0.3} y={curY + 8} width="3" height={curH * 0.5} fill="#0f172a" />
              <rect x={w * 0.3 + 3} y={curY + 24} width="12" height="3" fill="#0f172a" />
              <rect x={w * 0.65} y={curY + 16} width="3" height={curH * 0.4} fill="#0f172a" />
              {/* Bongkahan Beton Jatuh */}
              {[0, 1, 2, 3].map((d) => (
                <rect key={d} x={6 + d * 13} y={curY + ((frame * 5 + d * 17) % Math.max(20, curH))} width="5" height="5" fill={d % 2 === 0 ? '#cbd5e1' : '#334155'} stroke="#0f172a" strokeWidth="1" />
              ))}
            </>
          )}
        </>
      ) : (
        <g>
          {/* Puing Reruntuhan Beton Tak Beraturan + Dinding Patah (Bukan Tank!) */}
          {variant === 0 && (
            <>
              <polygon points={`-4,${base} 4,${base - 14} 16,${base - 24} 28,${base - 16} 40,${base - 22} 52,${base - 10} ${w + 4},${base}`} fill="#475569" stroke="#0f172a" strokeWidth="1.8" />
              <polygon points={`2,${base} 18,${base - 16} 34,${base - 8} 48,${base - 14} ${w},${base}`} fill="#64748b" stroke="#0f172a" strokeWidth="1.5" />
              <rect x="8" y={base - 10} width="12" height="7" fill="#94a3b8" stroke="#0f172a" strokeWidth="1.2" />
              <rect x="28" y={base - 12} width="7" height="6" fill="#bae6fd" stroke="#0f172a" strokeWidth="1.2" />
            </>
          )}
          {variant === 1 && (
            <>
              <polygon points={`-3,${base} 8,${base - 22} 18,${base - 22} 22,${base - 12} 38,${base - 18} 54,${base - 8} ${w + 3},${base}`} fill="#475569" stroke="#0f172a" strokeWidth="1.8" />
              <polygon points={`12,${base} 28,${base - 15} 44,${base - 12} ${w - 2},${base}`} fill="#64748b" stroke="#0f172a" strokeWidth="1.5" />
              <rect x="10" y={base - 18} width="6" height="6" fill="#bae6fd" stroke="#0f172a" strokeWidth="1.1" />
              <rect x="36" y={base - 9} width="11" height="6" fill="#94a3b8" stroke="#0f172a" strokeWidth="1.2" />
            </>
          )}
          {variant === 2 && (
            <>
              <polygon points={`-4,${base} 10,${base - 12} 24,${base - 20} 36,${base - 12} 46,${base - 26} 54,${base - 16} ${w + 4},${base}`} fill="#475569" stroke="#0f172a" strokeWidth="1.8" />
              <polygon points={`4,${base} 22,${base - 14} 38,${base - 18} ${w},${base}`} fill="#64748b" stroke="#0f172a" strokeWidth="1.5" />
              <rect x="16" y={base - 9} width="10" height="6" fill="#94a3b8" stroke="#0f172a" strokeWidth="1.2" />
              <rect x="40" y={base - 15} width="7" height="6" fill="#bae6fd" stroke="#0f172a" strokeWidth="1.1" />
            </>
          )}
          {/* Kerikil Beton Berserakan di Tepi */}
          <rect x="-7" y={base - 4} width="6" height="4" fill="#94a3b8" stroke="#0f172a" strokeWidth="1" />
          <rect x={w + 2} y={base - 4} width="5" height="4" fill="#64748b" stroke="#0f172a" strokeWidth="1" />
        </g>
      )}
      {collapseT > 0.05 && collapseT < 0.98 && (
        <g opacity={Math.sin(collapseT * Math.PI) * 0.92}>
          <rect x="-10" y={base - 20 - collapseT * 14} width={w * 0.55} height="18" fill="#cbd5e1" />
          <rect x={w * 0.35} y={base - 26 - collapseT * 20} width={w * 0.72} height="22" fill="#e2e8f0" />
          <rect x="6" y={base - 36 - collapseT * 26} width={w * 0.5} height="14" fill="#f1f5f9" />
        </g>
      )}
    </g>
  );
};
export const NoOxygen5s: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sec = frame / fps;
  const { tAlarm, tSec1, tSec2, tSec3, tSec4, tSec5, tEnd, tCutStart, tCutEnd, cliffFrame } = OXY_TIMING;

  const isNoOxy = frame >= tSec1 && frame < tEnd;
  const isStalled = frame >= tSec1 + 12;
  const isAfter = frame >= tEnd;
  const collapseT = frame < tSec3 ? 0 : interpolate(frame, [tSec3, tSec3 + 70], [0, 1], { extrapolateRight: 'clamp' });
  const isUV = frame >= tSec4 && frame < tEnd;
  const isSunburned = frame >= tSec4 + 14;
  const showHeat = isUV || (frame >= tEnd && frame < tEnd + 45);
  const isHoldEar = frame >= tSec5;

  const cutStart = Math.max(tEnd + 16, tCutStart - 20);
  const cutEnd = Math.min(cliffFrame - 14, tCutEnd + 28);
  const showCut = frame >= cutStart && frame <= cutEnd;
  const cutPop = showCut ? spring({ frame: frame - cutStart, fps, config: { damping: 12 } }) : 0;

  const timerLabel = frame >= tSec1 && frame < tSec2 ? '1' : frame >= tSec2 && frame < tSec3 ? '2' : frame >= tSec3 && frame < tSec4 ? '3' : frame >= tSec4 && frame < tSec5 ? '4' : frame >= tSec5 && frame < tEnd ? '5' : frame >= tEnd && frame < tEnd + 24 ? 'SELESAI!' : null;
  const shake = frame >= tSec3 && frame < tSec3 + 60 ? Math.sin(frame * 2.5) * 4.5 : 0;

  const showCliff = frame >= cliffFrame;
  const cliffIn = showCliff ? spring({ frame: frame - cliffFrame, fps, config: { damping: 10 } }) : 0;
  const activeIdx = WORD_SUBS_OXY5S.findIndex((x) => sec >= x.s && sec < x.e);
  const activeWord = activeIdx >= 0 ? WORD_SUBS_OXY5S[activeIdx] : null;
  const wordPop = activeWord ? spring({ frame: Math.max(0, frame - Math.floor(activeWord.s * fps)), fps, config: { damping: 11, stiffness: 280, mass: 0.5 } }) : 0;

  // Mobil biru berhenti tepat di celah tengah (x=136) -> BEBAS dari warga hijau (x=82) & ungu (x=192)!
  const dCar = (tSec1 + 12) - Math.min(frame, tSec1 + 12);
  const car1X = -35 + (((171 - dCar * 0.72) % 340) + 340) % 340;
  const taxiX = -35 + (((239 + dCar * 0.78) % 340) + 340) % 340;
  // Si Udin jalan santai saat fase normal lalu berhenti saat oksigen hilang
  const isWalking = frame < tSec1;
  const udinX = isWalking ? interpolate(frame, [0, tSec1], [94, 128], { extrapolateRight: 'clamp' }) : 128;

  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a', overflow: 'hidden', transform: `translate(${shake}px, ${-shake * 0.5}px)` }}>
      <Audio src={staticFile('vo_oxy_5s.mp3')} volume={1} />
      <Audio src={staticFile('bgm_oxy_5s.wav')} volume={0.21} />
      <Sequence from={tAlarm} durationInFrames={26}><Audio src={staticFile('sfx_oxy_alarm.wav')} volume={0.26} /></Sequence>
      <Sequence from={tSec1 + 12} durationInFrames={28}><Audio src={staticFile('sfx_oxy_stall.wav')} volume={0.34} /></Sequence>
      {[tSec1, tSec2, tSec3, tSec4, tSec5].map((fr) => <Sequence key={`tk-${fr}`} from={fr} durationInFrames={10}><Audio src={staticFile('sfx_grav_tick.wav')} volume={0.24} /></Sequence>)}
      <Sequence from={tSec3} durationInFrames={38}><Audio src={staticFile('sfx_oxy_crumble.wav')} volume={0.42} /></Sequence>
      <Sequence from={tSec4} durationInFrames={28}><Audio src={staticFile('sfx_oxy_uv.wav')} volume={0.32} /></Sequence>
      <Sequence from={tSec5} durationInFrames={30}><Audio src={staticFile('sfx_oxy_ring.wav')} volume={0.28} /></Sequence>
      <Sequence from={cutStart} durationInFrames={30}><Audio src={whoosh} volume={0.36} /></Sequence>
      <Sequence from={cutEnd - 4} durationInFrames={30}><Audio src={whoosh} volume={0.32} /></Sequence>
      <Sequence from={cliffFrame} durationInFrames={50}><Audio src={ding} volume={0.45} /></Sequence>

      <AbsoluteFill style={{ backgroundImage: 'radial-gradient(#38bdf8 3px, transparent 3px)', backgroundSize: '44px 44px', opacity: 0.22 }} />

      <div style={{ position: 'absolute', top: 210, left: 60, right: 60, height: 1180, border: `8px solid ${isNoOxy ? '#ef4444' : '#38bdf8'}`, borderRadius: 28, overflow: 'hidden', boxShadow: '0 22px 54px rgba(0,0,0,0.85)', zIndex: 15 }}>
        <svg width="100%" height="100%" viewBox="0 0 270 330" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges">
          <defs>
            <linearGradient id="uvSkyGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fde047" stopOpacity="0.46" />
              <stop offset="28%" stopColor="#fb923c" stopOpacity="0.26" />
              <stop offset="62%" stopColor="#c084fc" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.06" />
            </linearGradient>
            <linearGradient id="uvBeam" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.28" />
              <stop offset="65%" stopColor="#e879f9" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#e879f9" stopOpacity="0" />
            </linearGradient>
          </defs>

          <rect width="270" height="175" fill={isNoOxy ? '#020617' : '#0284c7'} />
          <rect y="88" width="270" height="87" fill={isNoOxy ? '#0f172a' : '#38bdf8'} />
          {isNoOxy ? (
            [[24,26],[62,48],[108,22],[152,54],[198,28],[238,44],[88,76],[178,72]].map(([sx, sy], i) => (
              <rect key={i} x={sx} y={sy} width="3" height="3" fill="#fef08a" opacity={0.4 + ((frame + i * 7) % 10) / 16} />
            ))
          ) : (
            <>
              <rect x={(20 + frame * 0.16) % 290 - 20} y="24" width="44" height="12" fill="#f0f9ff" opacity="0.9" />
              <rect x={(160 + frame * 0.12) % 290 - 20} y="42" width="52" height="13" fill="#e0f2fe" opacity="0.85" />
            </>
          )}

          <rect y="175" width="270" height="34" fill="#cbd5e1" /><rect y="209" width="270" height="78" fill="#334155" />
          <rect y="207" width="270" height="4" fill="#94a3b8" /><rect y="287" width="270" height="43" fill="#cbd5e1" /><rect y="285" width="270" height="4" fill="#94a3b8" />
          {[14, 58, 102, 146, 190, 234].map((mx) => <rect key={mx} x={mx} y="246" width="24" height="5" fill="#fde047" />)}
          {collapseT > 0.6 && (
            <>
              <rect x="20" y="224" width="16" height="3" fill="#0f172a" /><rect x="32" y="227" width="10" height="3" fill="#0f172a" />
              <rect x="44" y="268" width="20" height="3" fill="#0f172a" /><rect x="58" y="271" width="12" height="3" fill="#0f172a" />
              <rect x="228" y="226" width="18" height="3" fill="#0f172a" /><rect x="238" y="229" width="12" height="3" fill="#0f172a" />
            </>
          )}

          <ConcreteBuilding x={6} y={62} w={56} h={126} color="#64748b" variant={0} collapseT={collapseT} frame={frame} />
          <ConcreteBuilding x={96} y={76} w={58} h={112} color="#475569" variant={1} collapseT={collapseT} frame={frame + 4} />
          <ConcreteBuilding x={174} y={66} w={54} h={122} color="#64748b" variant={2} collapseT={collapseT} frame={frame + 8} />

          <rect x="66" y="130" width="5" height="68" fill="#334155" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="61" y="195" width="15" height="6" fill="#1e293b" stroke="#0f172a" strokeWidth="1.4" />
          <rect x="62" y="118" width="13" height="13" fill={isNoOxy ? '#fef08a' : '#cbd5e1'} stroke="#0f172a" strokeWidth="1.5" />
          {isNoOxy && <polygon points="58,131 79,131 92,204 44,204" fill="#fef08a" opacity="0.16" />}

          {/* Pohon Kanan dalam Pot Bata Terakota Berbayangan (Kontras dari Puing Beton!) */}
          <g>
            <rect x="235" y="201" width="28" height="3.5" fill="rgba(15,23,42,0.32)" />
            <rect x="237" y="193" width="24" height="9" fill="#9a3412" stroke="#0f172a" strokeWidth="1.4" />
            <rect x="235" y="190" width="28" height="4" fill="#c2410c" stroke="#0f172a" strokeWidth="1.3" />
            <rect x="239" y="190" width="20" height="2.5" fill="#451a03" />
            <rect x="246" y="166" width="6" height="25" fill="#78350f" stroke="#0f172a" strokeWidth="1.3" />
            <rect x="235" y="146" width="28" height="22" fill={isSunburned ? '#65a30d' : '#15803d'} stroke="#0f172a" strokeWidth="1.5" />
            <rect x="240" y="138" width="18" height="10" fill={isSunburned ? '#84cc16' : '#22c55e'} stroke="#0f172a" strokeWidth="1.3" />
          </g>
          <OxyCar x={car1X} y={232} color="#2563eb" roof="#3b82f6" stalled={isStalled} frame={frame} />
          <OxyCar x={taxiX} y={264} color="#eab308" roof="#facc15" taxi stalled={isStalled} frame={frame} />

          <OxyPerson x={87} y={196} shirt="#16a34a" sunburn={isSunburned} showHeat={showHeat} holdEar={isHoldEar} panic={isNoOxy} after={isAfter} frame={frame} />
          <OxyPerson x={192} y={196} shirt="#9333ea" sunburn={isSunburned} showHeat={showHeat} holdEar={isHoldEar} panic={isNoOxy} after={isAfter} frame={frame + 6} />
          <OxyPerson x={udinX} y={296} shirt="#dc2626" sunburn={isSunburned} showHeat={showHeat} holdEar={isHoldEar} panic={isNoOxy} after={isAfter} walk={isWalking} frame={frame + 3} drink />

          {/* Sinar UV Gradasi Halus (Bebas Garis Belang Horizontal!) */}
          {isUV && (
            <g>
              <rect width="270" height="330" fill="url(#uvSkyGlow)" opacity={0.88 + Math.sin(frame * 0.4) * 0.12} />
              {[38, 132, 222].map((rx, i) => (
                <polygon key={i} points={`${rx - 20},0 ${rx + 18},0 ${rx + 64},330 ${rx + 16},330`} fill="url(#uvBeam)" opacity={0.75 + Math.sin(frame * 0.35 + i * 2) * 0.25} />
              ))}
              {[0, 1, 2, 3, 4].map((i) => (
                <rect key={i} x={30 + i * 54 + Math.sin(frame * 0.4 + i) * 4} y={280 - ((frame * 3 + i * 38) % 120)} width="11" height="2" fill="#fef08a" opacity="0.42" />
              ))}
            </g>
          )}
        </svg>

        {timerLabel && !showCut && (
          <div style={{ position: 'absolute', top: 32, left: '50%', transform: `translateX(-50%) scale(${1 + Math.sin(frame * 0.45) * 0.06})`, textAlign: 'center', zIndex: 30 }}>
            {timerLabel !== 'SELESAI!' && <div style={{ fontFamily, fontSize: 18, color: '#ffffff', textShadow: '3px 3px 0 #0f172a', marginBottom: 8 }}>DETIK KE</div>}
            <div style={{ fontFamily, fontSize: timerLabel === 'SELESAI!' ? 64 : 108, color: timerLabel === 'SELESAI!' ? '#4ade80' : '#fde047', textShadow: '8px 8px 0 #0f172a, -4px -4px 0 #0f172a, 4px -4px 0 #0f172a, -4px 4px 0 #0f172a' }}>{timerLabel}</div>
          </div>
        )}
      </div>

      {showCut && <AbsoluteFill style={{ backgroundColor: 'rgba(15, 23, 42, 0.58)', opacity: cutPop, zIndex: 35 }} />}
      {showCut && <AbsoluteFill style={{ transform: `scale(${0.86 + cutPop * 0.14})`, opacity: cutPop, zIndex: 38 }}><CloseUpUdinSunburn frame={frame} localFrame={frame - cutStart} /></AbsoluteFill>}

      <div style={{ position: 'absolute', top: 82, left: '50%', transform: 'translateX(-50%)', padding: '6px 18px', borderRadius: 20, backgroundColor: 'rgba(15, 23, 42, 0.85)', border: '2px solid rgba(250, 204, 21, 0.65)', fontFamily: 'sans-serif', fontSize: 22, fontWeight: 'bold', color: '#f8fafc', zIndex: 45 }}>@dysesat</div>
      <div style={{ position: 'absolute', top: 138, left: 65, right: 65, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 45 }}>
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.94)', border: `3px solid ${isNoOxy ? '#ef4444' : '#38bdf8'}`, borderRadius: 14, padding: '10px 16px', fontFamily, fontSize: 15, color: isNoOxy ? '#f87171' : '#38bdf8' }}>OKSIGEN: {isNoOxy ? '0%!' : '21%'}</div>
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.94)', border: `3px solid ${isNoOxy ? '#facc15' : isAfter ? '#f87171' : '#4ade80'}`, borderRadius: 14, padding: '10px 16px', fontFamily, fontSize: 14, color: isNoOxy ? '#fde047' : isAfter ? '#f87171' : '#4ade80' }}>{isNoOxy ? 'BAHAYA!' : isAfter ? 'HANCUR!' : 'NORMAL'}</div>
      </div>

      {activeWord && !showCliff && (
        <div style={{ position: 'absolute', top: 1435, left: 70, right: 70, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ fontFamily, fontSize: activeWord.w.length > 10 ? 32 : 40, color: getWordColor(activeWord.w), textAlign: 'center', padding: '12px 24px', borderRadius: 16, backgroundColor: 'rgba(15, 23, 42, 0.84)', border: `3px solid ${getWordColor(activeWord.w)}`, textShadow: '4px 4px 0 #0f172a, -3px -3px 0 #0f172a, 3px -3px 0 #0f172a, -3px 3px 0 #0f172a', transform: `scale(${0.65 + wordPop * 0.35}) rotate(${activeIdx % 2 === 0 ? -2 : 2}deg)` }}>{activeWord.w.toUpperCase()}</div>
        </div>
      )}

      {showCliff && (
        <div style={{ position: 'absolute', top: 1435, left: 65, right: 65, backgroundColor: 'rgba(15, 23, 42, 0.96)', border: '4px solid #facc15', borderRadius: 16, padding: '16px 20px', textAlign: 'center', fontFamily, fontSize: 17, lineHeight: 1.5, color: '#facc15', boxShadow: '0 10px 28px rgba(0,0,0,0.65)', transform: `scale(${cliffIn * (1 + Math.sin(frame * 0.22) * 0.025)})`, zIndex: 55 }}>
          KALAU HILANG 1 MENIT GIMANA?<br /><span style={{ color: '#38bdf8', fontSize: 15 }}>TULIS DI KOMENTAR!</span>
        </div>
      )}
    </AbsoluteFill>
  );
};
