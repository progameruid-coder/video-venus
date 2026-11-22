import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PressStart2P';
import { whoosh, ding } from '@remotion/sfx';
import { WORD_SUBS_GRAV5S, GRAV_TIMING } from './grav5sWords';
import { CloseUpUdinCrash } from './ZeroGravity5sCutscene';

const { fontFamily } = loadFont();

const getWordColor = (word: string) => {
  const c = word.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (['gravitasi', 'bumi', 'air', 'kolam', 'udara', 'kota', 'dunia'].includes(c)) return '#38bdf8';
  if (['hilang', 'kekacauan', 'jatuh', 'bebas', 'penyok', 'hancur', 'pecah', 'sekacau'].includes(c)) return '#f87171';
  if (['lima', 'detik', 'pertama', 'kedua', 'ketiga', 'keempat', 'kelima', 'bakso', 'kucingmu', 'seharian'].includes(c)) return '#fde047';
  return '#ffffff';
};

const PixelCar: React.FC<{ x: number; y: number; color: string; roof: string; rot: number; taxi?: boolean; crashed?: boolean; frame: number }> = ({ x, y, color, roof, rot, taxi = false, crashed = false, frame }) => {
  const hoodX = taxi ? -24 : 14;
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rot})`}>
      <rect x="-26" y="-8" width="52" height="15" fill={color} stroke="#0f172a" strokeWidth="1.8" />
      <rect x="-15" y={crashed ? -15 : -17} width="30" height={crashed ? 8 : 10} fill={roof} stroke="#0f172a" strokeWidth="1.8" />
      <rect x="-12" y={crashed ? -13 : -15} width="11" height="6" fill="#bae6fd" /><rect x="2" y={crashed ? -13 : -15} width="10" height="6" fill="#bae6fd" />
      {taxi && <rect x="-5" y={crashed ? -19 : -21} width="10" height="5" fill="#fef08a" stroke="#0f172a" strokeWidth="1.2" />}
      <rect x="-20" y="4" width="10" height="9" fill="#0f172a" /><rect x="10" y="4" width="10" height="9" fill="#0f172a" />
      <rect x="-18" y="6" width="5" height="5" fill="#94a3b8" /><rect x="12" y="6" width="5" height="5" fill="#94a3b8" />
      {crashed && (
        <g>
          <rect x={hoodX} y={-18 - (frame % 18)} width="10" height="8" fill="#e2e8f0" opacity={0.85 - (frame % 18) / 22} />
          <rect x={hoodX + (taxi ? -4 : 4)} y={-27 - ((frame + 9) % 18)} width="8" height="7" fill="#cbd5e1" opacity={0.68 - ((frame + 9) % 18) / 24} />
        </g>
      )}
    </g>
  );
};

const PixelBakso: React.FC<{ x: number; y: number; rot: number; floatT: number; crashed: boolean; frame: number }> = ({ x, y, rot, floatT, crashed, frame }) => (
  <g transform={`translate(${x}, ${y}) rotate(${rot})`}>
    <rect x="-20" y="-14" width="40" height="22" fill="#b45309" stroke="#0f172a" strokeWidth="1.8" />
    <rect x="-16" y="-26" width="32" height="13" fill="#bae6fd" stroke="#0f172a" strokeWidth="1.6" />
    {crashed && <><rect x="-8" y="-24" width="2" height="8" fill="#0f172a" /><rect x="4" y="-21" width="6" height="2" fill="#0f172a" /></>}
    <rect x="-22" y="-30" width="44" height="5" fill="#92400e" stroke="#0f172a" strokeWidth="1.6" />
    <rect x="-16" y="-6" width="32" height="10" fill="#dc2626" /><text x="-13" y="1.5" fill="#fff" fontSize="6.5" fontFamily="monospace" fontWeight="bold">BAKSO</text>
    <circle cx="-11" cy="11" r="6" fill="#334155" stroke="#0f172a" strokeWidth="1.8" />
    <circle cx="11" cy="11" r="6" fill="#334155" stroke="#0f172a" strokeWidth="1.8" />
    {floatT === 0 && !crashed && <rect x="-4" y={-36 - (frame % 10)} width="6" height="5" fill="#f8fafc" opacity={0.7 - (frame % 10) / 14} />}
  </g>
);
const PixelPerson: React.FC<{ x: number; y: number; shirt: string; rot: number; panic: boolean; dizzy: boolean; frame: number; bubble?: '?' | '!' }> = ({ x, y, shirt, rot, panic, dizzy, frame, bubble }) => {
  const fl = panic ? Math.sin(frame * 0.72) * 20 : 0;
  const idleY = !panic && !dizzy ? Math.sin(frame * 0.14) * 0.9 : 0;
  const blink = !panic && !dizzy && (frame % 95) > 90;
  const sway = dizzy ? Math.sin(frame * 0.18) * 1.4 : 0;
  return (
    <g transform={`translate(${x + sway * 0.4}, ${y + idleY}) rotate(${rot})`}>
      {dizzy ? (
        <>
          <rect x="-11" y="4" width="9" height="5" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.2" />
          <rect x="2" y="4" width="9" height="5" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.2" />
        </>
      ) : (
        <>
          <g transform={`translate(-3, 4) rotate(${panic ? 18 + fl * 0.85 : 0})`}><rect x="-2" y="0" width="4" height="9" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.2" /></g>
          <g transform={`translate(3, 4) rotate(${panic ? -18 - fl * 0.85 : 0})`}><rect x="-2" y="0" width="4" height="9" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.2" /></g>
        </>
      )}
      <rect x="-7" y="-8" width="14" height="13" fill={shirt} stroke="#0f172a" strokeWidth="1.4" />
      {/* Lengan: Melambai Panik (0G) | Menopang ke Tanah Lemas (Pusing) | Santai (Normal) */}
      <g transform={`translate(-7, -6) rotate(${panic ? 132 + fl : dizzy ? 32 : 0})`}>
        <rect x="-2.5" y="0" width="4.5" height="8.5" fill={shirt} stroke="#0f172a" strokeWidth="1.2" />
        <rect x="-2.5" y="7.5" width="4.5" height="3.5" fill="#fed7aa" stroke="#0f172a" strokeWidth="1" />
      </g>
      <g transform={`translate(7, -6) rotate(${panic ? -132 - fl : dizzy ? -32 : 0})`}>
        <rect x="-2" y="0" width="4.5" height="8.5" fill={shirt} stroke="#0f172a" strokeWidth="1.2" />
        <rect x="-2" y="7.5" width="4.5" height="3.5" fill="#fed7aa" stroke="#0f172a" strokeWidth="1" />
      </g>
      <rect x="-6" y="-19" width="12" height="11" fill="#fed7aa" stroke="#0f172a" strokeWidth="1.4" />
      <rect x="-6" y="-21" width="12" height="4" fill="#29150b" />
      {blink ? (
        <><rect x="-3.5" y="-14" width="3" height="1.2" fill="#0f172a" /><rect x="1.5" y="-14" width="3" height="1.2" fill="#0f172a" /></>
      ) : (
        <><rect x="-3" y="-15" width="2" height="2" fill="#0f172a" /><rect x="2" y="-15" width="2" height="2" fill="#0f172a" /></>
      )}
      {(panic || dizzy) && <rect x="-2" y="-11" width="4" height="2.2" fill="#7f1d1d" />}
      {bubble && (
        <g transform="translate(10, -34)">
          <rect x="0" y="0" width="12" height="12" rx="2" fill="#fff" stroke="#0f172a" strokeWidth="1.2" />
          <text x="3.5" y="9" fill={bubble === '!' ? '#dc2626' : '#0f172a'} fontSize="9" fontFamily="monospace" fontWeight="bold">{bubble}</text>
        </g>
      )}
      {dizzy && [0, 1, 2].map((i) => <rect key={i} x={Math.cos(frame * 0.2 + i * 2.1) * 10 - 2} y={-27 + Math.sin(frame * 0.2 + i * 2.1) * 3} width="4" height="4" fill="#fde047" />)}
    </g>
  );
};

const PixelCat: React.FC<{ x: number; y: number; rot: number; panic: boolean; frame: number }> = ({ x, y, rot, panic, frame }) => (
  <g transform={`translate(${x}, ${y}) rotate(${rot})`}>
    <rect x="-8" y="-4" width="15" height="8" fill="#f97316" stroke="#0f172a" strokeWidth="1.4" />
    <rect x="4" y="-9" width="9" height="8" fill="#fb923c" stroke="#0f172a" strokeWidth="1.4" />
    <rect x="5" y="-12" width="3" height="3" fill="#f97316" /><rect x="10" y="-12" width="3" height="3" fill="#f97316" />
    <g transform={`translate(-8, -3) rotate(${Math.sin(frame * 0.25) * 18})`}><rect x="-6" y="-2" width="7" height="3" fill="#f97316" stroke="#0f172a" strokeWidth="1" /></g>
    <rect x="-6" y="4" width="3" height="4" fill="#ea580c" /><rect x="3" y="4" width="3" height="4" fill="#ea580c" />
    {panic && <g transform="translate(12, -20)"><rect x="0" y="0" width="11" height="11" rx="2" fill="#fff" stroke="#0f172a" strokeWidth="1" /><text x="3" y="8.5" fill="#0f172a" fontSize="8" fontFamily="monospace" fontWeight="bold">?</text></g>}
  </g>
);
export const ZeroGravity5s: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sec = frame / fps;
  const { tAlarm, tSec1, tSec3, tCrash, tDropEnd, tCutStart, tCutEnd, cliffFrame } = GRAV_TIMING;

  const d1 = tSec1;
  const d2 = Math.round((tSec1 + tSec3) / 2);
  const d3 = tSec3;
  const d4 = Math.round(tSec3 + (tCrash - tSec3) * 0.42);
  const d5 = Math.max(d4 + 35, tCrash - 52);

  const isZeroG = frame >= d1 && frame < tCrash;
  const isDropping = frame >= tCrash && frame < tDropEnd;
  const isCrashed = frame >= tDropEnd;

  const dropT = isDropping ? Math.pow(interpolate(frame, [tCrash, tDropEnd], [0, 1], { extrapolateRight: 'clamp' }), 2) : 0;
  const lift = isZeroG ? interpolate(frame, [d1, tCrash], [0, 1], { extrapolateRight: 'clamp' }) : isDropping ? 1 - dropT : 0;
  const liftLate = isZeroG ? interpolate(frame, [d3, tCrash], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : isDropping ? 1 - dropT : 0;
  const grabT = isZeroG ? interpolate(frame, [d1, d1 + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : isDropping ? 1 : 0;

  const timerLabel = frame >= d1 && frame < d2 ? '1' : frame >= d2 && frame < d3 ? '2' : frame >= d3 && frame < d4 ? '3' : frame >= d4 && frame < d5 ? '4' : frame >= d5 && frame < tCrash ? '5' : frame >= tCrash && frame < tDropEnd + 18 ? 'BRAK!' : null;
  const shake = frame >= tDropEnd - 2 && frame < tDropEnd + 32 ? Math.sin(frame * 2.8) * (tDropEnd + 32 - frame) * 0.36 : 0;

  const showCut = frame >= tCutStart && frame <= tCutEnd;
  const cutPop = showCut ? spring({ frame: frame - tCutStart, fps, config: { damping: 12 } }) : 0;
  const showCliff = frame >= cliffFrame;
  const cliffIn = showCliff ? spring({ frame: frame - cliffFrame, fps, config: { damping: 10 } }) : 0;
  const activeIdx = WORD_SUBS_GRAV5S.findIndex((x) => sec >= x.s && sec < x.e);
  const activeWord = activeIdx >= 0 ? WORD_SUBS_GRAV5S[activeIdx] : null;
  const wordPop = activeWord ? spring({ frame: Math.max(0, frame - Math.floor(activeWord.s * fps)), fps, config: { damping: 11, stiffness: 280, mass: 0.5 } }) : 0;

  // Loop mobil keluar-masuk layar (-35..305) -> 100% BEBAS TELEPORT!
  const dCar = d1 - Math.min(frame, d1);
  const car1X = -35 + (((149 - dCar * 0.72) % 340) + 340) % 340;
  const taxiX = -35 + (((233 + dCar * 0.78) % 340) + 340) % 340;
  // Jalur kucing bersih di kiri (bebas dari mobil biru & taksi) -> mendarat tepat di kepala Udin!
  const catX = isZeroG ? interpolate(lift, [0, 1], [98, 86]) : isDropping ? interpolate(dropT, [0, 1], [86, 72]) : isCrashed ? 72 : 98;
  const catY = isZeroG ? interpolate(lift, [0, 1], [312, 188]) : isDropping ? interpolate(dropT, [0, 1], [188, 269]) : isCrashed ? 269 : 312;

  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a', overflow: 'hidden', transform: `translate(${shake}px, ${-shake * 0.6}px)` }}>
      <Audio src={staticFile('vo_grav_5s.mp3')} volume={1} />
      <Audio src={staticFile('bgm_grav_5s.wav')} volume={0.21} />
      <Sequence from={tAlarm} durationInFrames={28}><Audio src={staticFile('sfx_grav_alarm.wav')} volume={0.26} /></Sequence>
      <Sequence from={d1} durationInFrames={36}><Audio src={staticFile('sfx_grav_float.wav')} volume={0.32} /></Sequence>
      {[d1, d2, d3, d4, d5].map((fr) => <Sequence key={`tk-${fr}`} from={fr} durationInFrames={10}><Audio src={staticFile('sfx_grav_tick.wav')} volume={0.25} /></Sequence>)}
      <Sequence from={tDropEnd - 3} durationInFrames={36}><Audio src={staticFile('sfx_grav_crash.wav')} volume={0.46} /></Sequence>
      <Sequence from={tCutStart} durationInFrames={30}><Audio src={whoosh} volume={0.36} /></Sequence>
      <Sequence from={tCutStart + 12} durationInFrames={28}><Audio src={staticFile('sfx_grav_dizzy.wav')} volume={0.26} /></Sequence>
      <Sequence from={tCutEnd - 4} durationInFrames={30}><Audio src={whoosh} volume={0.32} /></Sequence>
      <Sequence from={cliffFrame} durationInFrames={50}><Audio src={ding} volume={0.45} /></Sequence>

      <AbsoluteFill style={{ backgroundImage: 'radial-gradient(#38bdf8 3px, transparent 3px)', backgroundSize: '44px 44px', opacity: 0.22 }} />

      <div style={{ position: 'absolute', top: 210, left: 60, right: 60, height: 1180, border: `8px solid ${isZeroG || isDropping ? '#ef4444' : '#38bdf8'}`, borderRadius: 28, overflow: 'hidden', boxShadow: '0 22px 54px rgba(0,0,0,0.85)', zIndex: 15 }}>
        <svg width="100%" height="100%" viewBox="0 0 270 330" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges">
          <rect width="270" height="175" fill={isZeroG ? '#1d4ed8' : '#0284c7'} />
          <rect y="88" width="270" height="87" fill={isZeroG ? '#2563eb' : '#38bdf8'} />
          <rect x={(20 + frame * 0.16) % 290 - 20} y="24" width="44" height="12" fill="#f0f9ff" opacity="0.9" />
          <rect x={(160 + frame * 0.12) % 290 - 20} y="42" width="52" height="13" fill="#e0f2fe" opacity="0.85" />
          <rect x="78" y="108" width="28" height="72" fill="#1e40af" opacity="0.55" /><rect x="114" y="96" width="34" height="84" fill="#1e3a8a" opacity="0.55" /><rect x="156" y="114" width="26" height="66" fill="#1e40af" opacity="0.55" />
          {isZeroG && [0, 1, 2, 3, 4, 5, 6, 7].map((i) => <rect key={i} x={18 + i * 33} y={310 - ((frame * 3.8 + i * 44) % 290)} width="2.5" height="14" fill="#fef08a" opacity="0.55" />)}
          {isDropping && [32, 74, 120, 168, 212, 248].map((sx, i) => <rect key={i} x={sx} y={50 + ((frame * 18 + i * 45) % 220)} width="2.5" height="26" fill="#ffffff" opacity="0.7" />)}

          <rect y="175" width="270" height="34" fill="#cbd5e1" /><rect y="209" width="270" height="78" fill="#334155" />
          <rect y="207" width="270" height="4" fill="#94a3b8" /><rect y="287" width="270" height="43" fill="#cbd5e1" /><rect y="285" width="270" height="4" fill="#94a3b8" />
          {[14, 58, 102, 146, 190, 234].map((mx) => <rect key={mx} x={mx} y="246" width="24" height="5" fill="#fde047" />)}
          {isCrashed && <><rect x="94" y="236" width="32" height="3" fill="#0f172a" /><rect x="180" y="272" width="34" height="3" fill="#0f172a" /></>}

          {/* Gedung Kiri + 2 Genteng Jatuh Miring Rusak Saat BRAK */}
          <rect x="4" y="64" width="56" height="126" fill="#9a3412" stroke="#0f172a" strokeWidth="2" />
          <rect x="2" y="58" width="60" height="8" fill="#7c2d12" stroke="#0f172a" strokeWidth="1.8" />
          <g transform={`translate(${isCrashed ? 22 : 18 + liftLate * 10}, ${isCrashed ? 60 : 56 - liftLate * 46}) rotate(${isCrashed ? 18 : liftLate * 35})`}><rect x="-7" y="-2" width="14" height="5" fill="#b45309" stroke="#0f172a" strokeWidth="1.2" /></g>
          <g transform={`translate(${isCrashed ? 50 : 44 + liftLate * 16}, ${isCrashed ? 188 : 56 - liftLate * 54}) rotate(${isCrashed ? -24 : -liftLate * 42})`}><rect x="-6" y="-2" width="12" height="5" fill="#9a3412" stroke="#0f172a" strokeWidth="1.2" /></g>
          {[76, 106, 136].map((wy) => <g key={wy}><rect x="14" y={wy} width="14" height="16" fill="#bae6fd" stroke="#0f172a" strokeWidth="1.5" /><rect x="36" y={wy} width="14" height="16" fill="#bae6fd" stroke="#0f172a" strokeWidth="1.5" /></g>)}
          <rect x="74" y="156" width="8" height="28" fill="#78350f" /><rect x="61" y="132" width="34" height="28" fill="#15803d" stroke="#0f172a" strokeWidth="1.6" /><rect x="66" y="122" width="24" height="14" fill="#22c55e" />
          {isZeroG && [0, 1, 2].map((i) => <rect key={i} x={64 + i * 12 + Math.sin(frame * 0.2 + i) * 4} y={120 - lift * (62 + i * 16)} width="4" height="4" fill="#4ade80" />)}

          <g transform="translate(124, 185)">
            <ellipse cx="0" cy="4" rx="22" ry="8" fill="#94a3b8" stroke="#0f172a" strokeWidth="1.6" />
            <ellipse cx="0" cy="3" rx="17" ry="5" fill="#38bdf8" />
            <rect x="-4" y="-12" width="8" height="14" fill="#cbd5e1" stroke="#0f172a" strokeWidth="1.4" />
            {lift === 0 && <><rect x="-2" y={-24 - (frame % 4)} width="4" height="12" fill="#7dd3fc" /><rect x="-10" y="-18" width="4" height="6" fill="#bae6fd" /><rect x="6" y="-18" width="4" height="6" fill="#bae6fd" /></>}
            {lift > 0 && [[-12, -24], [-4, -36], [6, -28], [13, -18], [-8, -50], [4, -56], [10, -42]].map(([dx, dy], idx) => (
              <rect key={idx} x={dx + Math.sin(frame * 0.2 + idx) * 3} y={dy - lift * (68 + idx * 8)} width="5" height="5" rx="2" fill={idx % 2 === 0 ? '#7dd3fc' : '#e0f2fe'} />
            ))}
          </g>
          {/* RUMAH KANAN + 3 PANEL ATAP SENG TERBANG DI DETIK 3-5 & JATUH RAPI KE ATAP/TROTOAR */}
          <rect x="206" y="96" width="60" height="96" fill="#b45309" stroke="#0f172a" strokeWidth="2" />
          <rect x="208" y="88" width="56" height="10" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
          {[218, 234, 250].map((rx) => <rect key={rx} x={rx} y="88" width="4" height="10" fill="#78350f" />)}
          <rect x="216" y="106" width="16" height="17" fill="#bae6fd" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="240" y="106" width="16" height="17" fill="#bae6fd" stroke="#0f172a" strokeWidth="1.5" />
          {[0, 1, 2, 3, 4].map((s) => <rect key={s} x={204 + s * 12} y="140" width="12" height="10" fill={s % 2 === 0 ? '#dc2626' : '#f8fafc'} stroke="#0f172a" strokeWidth="1" />)}
          <rect x="220" y="158" width="26" height="34" fill="#1e293b" stroke="#0f172a" strokeWidth="1.6" />
          {[
            { bx: 215, by: 87, dx: -24, dy: -66, r0: -30, cx: 214, cy: 90, rc: -18 },
            { bx: 236, by: 85, dx: -10, dy: -74, r0: 18, cx: 244, cy: 91, rc: 16 },
            { bx: 256, by: 87, dx: -4, dy: -54, r0: 34, cx: 248, cy: 199, rc: 12 },
          ].map((sh, i) => (
            <g key={i} transform={`translate(${isCrashed ? sh.cx : sh.bx + liftLate * sh.dx}, ${isCrashed ? sh.cy : sh.by + liftLate * sh.dy}) rotate(${isCrashed ? sh.rc : liftLate * sh.r0})`}>
              <rect x="-12" y="-5" width="24" height="10" fill="#64748b" stroke="#0f172a" strokeWidth="1.6" />
              <rect x="-10" y="-3" width="20" height="3" fill="#cbd5e1" />
              <rect x="-10" y="1" width="20" height="2" fill="#475569" />
            </g>
          ))}

          {/* Tempat Sampah + Tutup Lepas Saat Jatuh */}
          <g transform={`translate(${isCrashed ? 168 : 174 - liftLate * 10}, ${isCrashed ? 200 : 194 - liftLate * 88}) rotate(${isCrashed ? 86 : liftLate * 48})`}>
            <rect x="-7" y="-10" width="14" height="16" fill="#64748b" stroke="#0f172a" strokeWidth="1.4" />
            {!isCrashed && <rect x="-9" y="-13" width="18" height="4" fill="#94a3b8" stroke="#0f172a" strokeWidth="1.2" />}
          </g>
          {isCrashed && <><rect x="180" y="199" width="14" height="4" fill="#94a3b8" stroke="#0f172a" strokeWidth="1.2" /><rect x="178" y="204" width="5" height="4" fill="#f8fafc" /><rect x="188" y="203" width="4" height="4" fill="#fde047" /></>}

          <PixelCar x={car1X} y={228 - lift * 90} color="#2563eb" roof="#3b82f6" rot={isZeroG ? -15 * lift : isCrashed ? -8 : 0} crashed={isCrashed} frame={frame} />
          <PixelCar x={taxiX} y={262 - lift * 96} color="#eab308" roof="#facc15" rot={isZeroG ? 16 * lift : isCrashed ? 10 : 0} taxi crashed={isCrashed} frame={frame} />

          {/* Gerobak Bakso di Trotoar Bawah (Jalur Bebas dari Taksi & Air Mancur!) */}
          {isCrashed && <rect x="122" y="314" width="38" height="7" fill="#fde047" opacity="0.65" />}
          <PixelBakso x={154} y={isCrashed ? 301 : 307 - liftLate * 78} rot={isZeroG ? -20 * liftLate : isCrashed ? -94 : 0} floatT={liftLate} crashed={isCrashed} frame={frame} />
          {(liftLate > 0.05 || isCrashed) && [[-18, -28], [18, -32], [-6, -40], [24, -18]].map(([bx, by], i) => (
            <rect key={i} x={isCrashed ? 124 + i * 16 : 154 + bx} y={isCrashed ? 316 + (i % 2) * 3 : 292 + by - liftLate * (78 + i * 8)} width="6" height="6" rx="2" fill={i % 2 === 0 ? '#92400e' : '#f8fafc'} stroke="#0f172a" strokeWidth="1" />
          ))}

          <PixelPerson x={86} y={196 - lift * 104 + (isCrashed ? 8 : 0)} shirt="#16a34a" rot={isZeroG ? -16 * lift : 0} panic={isZeroG} dizzy={isCrashed} frame={frame} bubble={isZeroG ? '?' : undefined} />
          <PixelPerson x={212} y={198 - lift * 108 + (isCrashed ? 8 : 0)} shirt="#9333ea" rot={isZeroG ? 18 * lift : 0} panic={isZeroG} dizzy={isCrashed} frame={frame + 7} bubble={isZeroG ? '!' : undefined} />

          {/* TIANG LAMPU KOKOH */}
          <rect x="44" y="138" width="6" height="164" fill="#334155" stroke="#0f172a" strokeWidth="1.6" />
          <rect x="38" y="296" width="18" height="8" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="39" y="124" width="16" height="16" fill="#fde047" stroke="#0f172a" strokeWidth="1.6" />
          <polygon points="36,124 47,115 58,124" fill="#1e293b" />

          {/* SI UDIN: Santai (Normal) -> Mencengkeram Tiang Tanpa Menembus (0G) -> Duduk Lemas (Jatuh) */}
          {!isZeroG && !isDropping ? (
            <g transform={`translate(72, ${(isCrashed ? 294 : 292) + (!isCrashed ? Math.sin(frame * 0.14) * 0.8 : 0)})`}>
              {isCrashed ? (
                <><rect x="-11" y="4" width="9" height="5" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.2" /><rect x="2" y="4" width="9" height="5" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.2" /></>
              ) : (
                <><rect x="-5" y="4" width="4" height="10" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.2" /><rect x="1" y="4" width="4" height="10" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.2" /></>
              )}
              <rect x="-7" y="-8" width="14" height="13" fill="#dc2626" stroke="#0f172a" strokeWidth="1.4" />
              <g transform={`translate(-7, -6) rotate(${isCrashed ? 32 : 0})`}><rect x="-2.5" y="0" width="4.5" height="8.5" fill="#dc2626" stroke="#0f172a" strokeWidth="1.2" /><rect x="-2.5" y="7.5" width="4.5" height="3.5" fill="#fed7aa" stroke="#0f172a" strokeWidth="1" /></g>
              <g transform={`translate(7, -6) rotate(${isCrashed ? -32 : 0})`}><rect x="-2" y="0" width="4.5" height="8.5" fill="#dc2626" stroke="#0f172a" strokeWidth="1.2" /><rect x="-2" y="7.5" width="4.5" height="3.5" fill="#fed7aa" stroke="#0f172a" strokeWidth="1" /></g>
              <rect x="-6" y="-19" width="12" height="11" fill="#fed7aa" stroke="#0f172a" strokeWidth="1.4" />
              <rect x="-6" y="-21" width="12" height="4" fill="#29150b" />
              <rect x="-3" y="-15" width="2" height="2" fill="#0f172a" /><rect x="2" y="-15" width="2" height="2" fill="#0f172a" />
              {isCrashed && [0, 1, 2].map((i) => <rect key={i} x={Math.cos(frame * 0.2 + i * 2.1) * 12 - 2} y={-40 + Math.sin(frame * 0.2 + i * 2.1) * 3} width="4" height="4" fill="#fde047" />)}
            </g>
          ) : (
            <g transform={`translate(${48 + (1 - grabT) * 14}, ${286 - lift * 40}) rotate(${-36 * lift})`}>
              {/* Kaki Terangkat ke Kanan-Atas Meronta Panik */}
              <g transform={`translate(18, 9) rotate(${-28 * lift + Math.sin(frame * 0.85) * 18})`}><rect x="-2" y="0" width="4" height="11" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.2" /></g>
              <g transform={`translate(22, 9) rotate(${-34 * lift - Math.sin(frame * 0.85) * 18})`}><rect x="-2" y="0" width="4" height="11" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.2" /></g>
              {/* Kedua Lengan Mencengkeram Tiang, Badan & Kepala Bersih di Kanan Tiang */}
              <rect x="0" y="-2" width="15" height="5" fill="#dc2626" stroke="#0f172a" strokeWidth="1.2" />
              <rect x="0" y="3" width="15" height="5" fill="#b91c1c" stroke="#0f172a" strokeWidth="1.2" />
              <rect x="-3" y="-2" width="5" height="5" fill="#fed7aa" stroke="#0f172a" strokeWidth="1" />
              <rect x="-3" y="3" width="5" height="5" fill="#fed7aa" stroke="#0f172a" strokeWidth="1" />
              <rect x="13" y="-3" width="13" height="13" fill="#dc2626" stroke="#0f172a" strokeWidth="1.4" />
              <rect x="13" y="-14" width="12" height="11" fill="#fed7aa" stroke="#0f172a" strokeWidth="1.4" />
              <rect x="13" y="-16" width="12" height="4" fill="#29150b" />
              <rect x="15" y="-10" width="2" height="2" fill="#0f172a" /><rect x="20" y="-10" width="2" height="2" fill="#0f172a" />
            </g>
          )}

          <PixelCat x={catX} y={catY} rot={isZeroG ? -16 * lift : 0} panic={isZeroG} frame={frame} />

          {/* Awan Debu Benturan 100% Pixel-Art */}
          {frame >= tDropEnd - 2 && frame < tDropEnd + 32 && [68, 118, 174, 224].map((dx, i) => {
            const p = (frame - (tDropEnd - 2)) / 34;
            return (
              <g key={i} transform={`translate(${dx}, ${292 - p * 14})`} opacity={Math.max(0, 0.9 - p)}>
                <rect x={-10 - p * 12} y="-6" width={20 + p * 24} height="10" fill="#e2e8f0" />
                <rect x={-6 - p * 8} y="-12" width={12 + p * 16} height="8" fill="#f8fafc" />
              </g>
            );
          })}
        </svg>

        {timerLabel && !showCut && (
          <div style={{ position: 'absolute', top: 32, left: '50%', transform: `translateX(-50%) scale(${1 + Math.sin(frame * 0.45) * 0.06})`, textAlign: 'center', zIndex: 30 }}>
            {timerLabel !== 'BRAK!' && <div style={{ fontFamily, fontSize: 18, color: '#ffffff', textShadow: '3px 3px 0 #0f172a', marginBottom: 8 }}>DETIK KE</div>}
            <div style={{ fontFamily, fontSize: timerLabel === 'BRAK!' ? 92 : 108, color: timerLabel === 'BRAK!' ? '#ef4444' : '#fde047', textShadow: '8px 8px 0 #0f172a, -4px -4px 0 #0f172a, 4px -4px 0 #0f172a, -4px 4px 0 #0f172a' }}>{timerLabel}</div>
          </div>
        )}
      </div>

      {showCut && <AbsoluteFill style={{ backgroundColor: 'rgba(15, 23, 42, 0.58)', opacity: cutPop, zIndex: 35 }} />}
      {showCut && <AbsoluteFill style={{ transform: `scale(${cutPop})`, zIndex: 38 }}><CloseUpUdinCrash frame={frame} localFrame={frame - tCutStart} /></AbsoluteFill>}

      <div style={{ position: 'absolute', top: 82, left: '50%', transform: 'translateX(-50%)', padding: '6px 18px', borderRadius: 20, backgroundColor: 'rgba(15, 23, 42, 0.85)', border: '2px solid rgba(250, 204, 21, 0.65)', fontFamily: 'sans-serif', fontSize: 22, fontWeight: 'bold', color: '#f8fafc', zIndex: 45 }}>@dysesat</div>
      <div style={{ position: 'absolute', top: 138, left: 65, right: 65, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 45 }}>
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.94)', border: `3px solid ${isZeroG ? '#ef4444' : '#38bdf8'}`, borderRadius: 14, padding: '10px 16px', fontFamily, fontSize: 15, color: isZeroG ? '#f87171' : '#38bdf8' }}>GRAVITASI: {isZeroG ? '0G!' : '1G'}</div>
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.94)', border: `3px solid ${isZeroG ? '#facc15' : (isDropping || isCrashed) ? '#f87171' : '#4ade80'}`, borderRadius: 14, padding: '10px 16px', fontFamily, fontSize: 14, color: isZeroG ? '#fde047' : (isDropping || isCrashed) ? '#f87171' : '#4ade80' }}>{isZeroG ? 'MELAYANG!' : isDropping ? 'JATUH!' : isCrashed ? 'KACAU!' : 'NORMAL'}</div>
      </div>

      {activeWord && !showCliff && (
        <div style={{ position: 'absolute', top: 1435, left: 70, right: 70, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ fontFamily, fontSize: activeWord.w.length > 10 ? 32 : 40, color: getWordColor(activeWord.w), textAlign: 'center', padding: '12px 24px', borderRadius: 16, backgroundColor: 'rgba(15, 23, 42, 0.84)', border: `3px solid ${getWordColor(activeWord.w)}`, textShadow: '4px 4px 0 #0f172a, -3px -3px 0 #0f172a, 3px -3px 0 #0f172a, -3px 3px 0 #0f172a', transform: `scale(${0.65 + wordPop * 0.35}) rotate(${activeIdx % 2 === 0 ? -2 : 2}deg)` }}>{activeWord.w.toUpperCase()}</div>
        </div>
      )}

      {showCliff && (
        <div style={{ position: 'absolute', top: 1435, left: 65, right: 65, backgroundColor: 'rgba(15, 23, 42, 0.96)', border: '4px solid #facc15', borderRadius: 16, padding: '16px 20px', textAlign: 'center', fontFamily, fontSize: 17, lineHeight: 1.5, color: '#facc15', boxShadow: '0 10px 28px rgba(0,0,0,0.65)', transform: `scale(${cliffIn * (1 + Math.sin(frame * 0.22) * 0.025)})`, zIndex: 55 }}>
          KALAU HILANG SEHARIAN GIMANA?<br /><span style={{ color: '#38bdf8', fontSize: 15 }}>TULIS DI KOMENTAR!</span>
        </div>
      )}
    </AbsoluteFill>
  );
};
