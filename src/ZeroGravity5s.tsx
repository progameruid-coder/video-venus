import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PressStart2P';
import { whoosh, ding } from '@remotion/sfx';
import { WORD_SUBS_GRAV5S } from './grav5sWords';
import { CloseUpUdinCrash } from './ZeroGravity5sCutscene';

const { fontFamily } = loadFont();

const getWordColor = (word: string) => {
  const c = word.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (['gravitasi', 'bumi', 'air', 'kolam', 'udara', 'kota', 'dunia'].includes(c)) return '#38bdf8';
  if (['hilang', 'kekacauan', 'brak', 'jatuh', 'bebas', 'penyok', 'hancur', 'pecah', 'sekacau'].includes(c)) return '#f87171';
  if (['lima', 'detik', 'pertama', 'kedua', 'ketiga', 'keempat', 'kelima', 'bakso', 'kucingmu', 'seharian'].includes(c)) return '#fde047';
  return '#ffffff';
};

const PixelCar: React.FC<{ x: number; y: number; color: string; roof: string; rot: number; taxi?: boolean; crashed?: boolean; frame: number }> = ({ x, y, color, roof, rot, taxi = false, crashed = false, frame }) => (
  <g transform={`translate(${x}, ${y}) rotate(${rot})`}>
    <rect x="-26" y="-8" width="52" height="15" fill={color} stroke="#0f172a" strokeWidth="1.8" />
    <rect x="-15" y="-17" width="30" height="10" fill={roof} stroke="#0f172a" strokeWidth="1.8" />
    <rect x="-12" y="-15" width="11" height="7" fill="#bae6fd" /><rect x="2" y="-15" width="10" height="7" fill="#bae6fd" />
    {taxi && <rect x="-5" y="-21" width="10" height="5" fill="#fef08a" stroke="#0f172a" strokeWidth="1.2" />}
    <rect x="-20" y="4" width="10" height="9" fill="#0f172a" /><rect x="10" y="4" width="10" height="9" fill="#0f172a" />
    <rect x="-18" y="6" width="5" height="5" fill="#94a3b8" /><rect x="12" y="6" width="5" height="5" fill="#94a3b8" />
    {crashed && <rect x="-10" y={-24 - (frame % 16)} width="10" height="8" fill="#cbd5e1" opacity={0.75 - (frame % 16) / 22} />}
  </g>
);

const PixelBakso: React.FC<{ x: number; y: number; rot: number; floatT: number; crashed: boolean; frame: number }> = ({ x, y, rot, floatT, crashed, frame }) => (
  <g transform={`translate(${x}, ${y}) rotate(${rot})`}>
    <rect x="-20" y="-14" width="40" height="22" fill="#b45309" stroke="#0f172a" strokeWidth="1.8" />
    <rect x="-16" y="-26" width="32" height="13" fill="#bae6fd" stroke="#0f172a" strokeWidth="1.6" />
    <rect x="-22" y="-30" width="44" height="5" fill="#92400e" stroke="#0f172a" strokeWidth="1.6" />
    <rect x="-16" y="-6" width="32" height="10" fill="#dc2626" /><text x="-13" y="1.5" fill="#fff" fontSize="6.5" fontFamily="monospace" fontWeight="bold">BAKSO</text>
    <circle cx="-11" cy="11" r="6" fill="#334155" stroke="#0f172a" strokeWidth="1.8" />
    <circle cx="11" cy="11" r="6" fill="#334155" stroke="#0f172a" strokeWidth="1.8" />
    {floatT === 0 && !crashed && <rect x="-4" y={-36 - (frame % 10)} width="6" height="5" fill="#f8fafc" opacity={0.7 - (frame % 10) / 14} />}
  </g>
);
const PixelPerson: React.FC<{ x: number; y: number; shirt: string; rot: number; panic: boolean; dizzy: boolean; frame: number; bubble?: '?' | '!' }> = ({ x, y, shirt, rot, panic, dizzy, frame, bubble }) => {
  const fl = panic ? Math.sin(frame * 0.7) * 18 : 0;
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rot})`}>
      <rect x="-5" y="4" width="4" height="8" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1" />
      <rect x="1" y="4" width="4" height="8" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1" />
      <g transform={`translate(-7, -6) rotate(${panic ? -125 + fl : 0})`}><rect x="-3" y="0" width="4" height="9" fill={shirt} stroke="#0f172a" strokeWidth="1" /></g>
      <g transform={`translate(7, -6) rotate(${panic ? 125 - fl : 0})`}><rect x="-1" y="0" width="4" height="9" fill={shirt} stroke="#0f172a" strokeWidth="1" /></g>
      <rect x="-7" y="-8" width="14" height="13" fill={shirt} stroke="#0f172a" strokeWidth="1.4" />
      <rect x="-6" y="-19" width="12" height="11" fill="#fed7aa" stroke="#0f172a" strokeWidth="1.4" />
      <rect x="-6" y="-21" width="12" height="4" fill="#29150b" />
      <rect x="-3" y="-15" width="2" height="2" fill="#0f172a" /><rect x="2" y="-15" width="2" height="2" fill="#0f172a" />
      {bubble && (
        <g transform="translate(8, -32)">
          <rect x="0" y="0" width="12" height="12" rx="2" fill="#fff" stroke="#0f172a" strokeWidth="1.2" />
          <text x="3.5" y="9" fill={bubble === '!' ? '#dc2626' : '#0f172a'} fontSize="9" fontFamily="monospace" fontWeight="bold">{bubble}</text>
        </g>
      )}
      {dizzy && [0, 1, 2].map((i) => <rect key={i} x={Math.cos(frame * 0.2 + i * 2.1) * 10 - 2} y={-27 + Math.sin(frame * 0.2 + i * 2.1) * 3} width="4" height="4" fill="#fde047" />)}
    </g>
  );
};

const PixelCat: React.FC<{ x: number; y: number; rot: number; panic: boolean }> = ({ x, y, rot, panic }) => (
  <g transform={`translate(${x}, ${y}) rotate(${rot})`}>
    <rect x="-8" y="-4" width="15" height="8" fill="#f97316" stroke="#0f172a" strokeWidth="1.4" />
    <rect x="4" y="-9" width="9" height="8" fill="#fb923c" stroke="#0f172a" strokeWidth="1.4" />
    <rect x="5" y="-12" width="3" height="3" fill="#f97316" /><rect x="10" y="-12" width="3" height="3" fill="#f97316" />
    <rect x="-12" y="-7" width="5" height="3" fill="#f97316" stroke="#0f172a" strokeWidth="1" />
    <rect x="-6" y="4" width="3" height="4" fill="#ea580c" /><rect x="3" y="4" width="3" height="4" fill="#ea580c" />
    {panic && <g transform="translate(12, -20)"><rect x="0" y="0" width="11" height="11" rx="2" fill="#fff" stroke="#0f172a" strokeWidth="1" /><text x="3" y="8.5" fill="#0f172a" fontSize="8" fontFamily="monospace" fontWeight="bold">?</text></g>}
  </g>
);
export const ZeroGravity5s: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sec = frame / fps;

  // Fase: Normal (0-264) | 0G 5 Detik (265-659) | Jatuh (660-682) | Dampak & Cutscene (683-1200)
  const isZeroG = frame >= 265 && frame < 660;
  const isDropping = frame >= 660 && frame < 683;
  const isCrashed = frame >= 683;

  const lift = isZeroG
    ? interpolate(frame, [265, 659], [0, 1], { extrapolateRight: 'clamp' })
    : isDropping
      ? 1 - Math.pow(interpolate(frame, [660, 682], [0, 1], { extrapolateRight: 'clamp' }), 2)
      : 0;
  const liftLate = isZeroG
    ? interpolate(frame, [385, 659], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : isDropping
      ? 1 - Math.pow(interpolate(frame, [660, 682], [0, 1], { extrapolateRight: 'clamp' }), 2)
      : 0;

  const countNum = frame >= 265 && frame < 345 ? 5 : frame >= 345 && frame < 425 ? 4 : frame >= 425 && frame < 505 ? 3 : frame >= 505 && frame < 585 ? 2 : frame >= 585 && frame < 660 ? 1 : frame >= 660 && frame < 692 ? 0 : null;
  const shake = frame >= 680 && frame < 720 ? Math.sin(frame * 2.8) * (720 - frame) * 0.35 : 0;

  const showCut = frame >= 775 && frame <= 975;
  const cutPop = showCut ? spring({ frame: frame - 775, fps, config: { damping: 12 } }) : 0;

  const lastEnd = WORD_SUBS_GRAV5S.length > 0 ? WORD_SUBS_GRAV5S[WORD_SUBS_GRAV5S.length - 1].e : 36.2;
  const cliffFrame = Math.min(1115, Math.ceil((lastEnd + 0.12) * fps));
  const showCliff = frame >= cliffFrame;
  const cliffIn = showCliff ? spring({ frame: frame - cliffFrame, fps, config: { damping: 10 } }) : 0;
  const activeIdx = WORD_SUBS_GRAV5S.findIndex((x) => sec >= x.s && sec < x.e);
  const activeWord = activeIdx >= 0 ? WORD_SUBS_GRAV5S[activeIdx] : null;
  const wordPop = activeWord ? spring({ frame: Math.max(0, frame - Math.floor(activeWord.s * fps)), fps, config: { damping: 11, stiffness: 280, mass: 0.5 } }) : 0;

  const car1X = frame < 265 ? 60 + ((frame * 0.65) % 150) : 102;
  const taxiX = frame < 265 ? 225 - ((frame * 0.72) % 155) : 186;
  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a', overflow: 'hidden', transform: `translate(${shake}px, ${-shake * 0.6}px)` }}>
      <Audio src={staticFile('vo_grav_5s.mp3')} volume={1} />
      <Audio src={staticFile('bgm_grav_5s.wav')} volume={0.22} />
      <Sequence from={218} durationInFrames={28}><Audio src={staticFile('sfx_grav_alarm.wav')} volume={0.28} /></Sequence>
      <Sequence from={265} durationInFrames={36}><Audio src={staticFile('sfx_grav_float.wav')} volume={0.34} /></Sequence>
      {[265, 345, 425, 505, 585].map((fr) => <Sequence key={`tk-${fr}`} from={fr} durationInFrames={10}><Audio src={staticFile('sfx_grav_tick.wav')} volume={0.26} /></Sequence>)}
      <Sequence from={678} durationInFrames={36}><Audio src={staticFile('sfx_grav_crash.wav')} volume={0.44} /></Sequence>
      <Sequence from={775} durationInFrames={30}><Audio src={whoosh} volume={0.38} /></Sequence>
      <Sequence from={790} durationInFrames={28}><Audio src={staticFile('sfx_grav_dizzy.wav')} volume={0.28} /></Sequence>
      <Sequence from={970} durationInFrames={30}><Audio src={whoosh} volume={0.34} /></Sequence>
      <Sequence from={cliffFrame} durationInFrames={50}><Audio src={ding} volume={0.45} /></Sequence>

      <AbsoluteFill style={{ backgroundImage: 'radial-gradient(#38bdf8 3px, transparent 3px)', backgroundSize: '44px 44px', opacity: 0.22 }} />

      {/* === PANGGUNG UTAMA KOTA PIXEL-ART 16-BIT === */}
      <div style={{ position: 'absolute', top: 210, left: 60, right: 60, height: 1180, border: `8px solid ${isZeroG ? '#ef4444' : '#38bdf8'}`, borderRadius: 28, overflow: 'hidden', boxShadow: '0 22px 54px rgba(0,0,0,0.85)', zIndex: 15 }}>
        <svg width="100%" height="100%" viewBox="0 0 270 330" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges">
          {/* Langit & Siluet Kota */}
          <rect width="270" height="175" fill={isZeroG ? '#1d4ed8' : '#0284c7'} />
          <rect y="88" width="270" height="87" fill={isZeroG ? '#2563eb' : '#38bdf8'} />
          <rect x={(20 + frame * 0.16) % 290 - 20} y="24" width="44" height="12" fill="#f0f9ff" opacity="0.9" />
          <rect x={(160 + frame * 0.12) % 290 - 20} y="42" width="52" height="13" fill="#e0f2fe" opacity="0.85" />
          <rect x="78" y="108" width="28" height="72" fill="#1e40af" opacity="0.55" /><rect x="114" y="96" width="34" height="84" fill="#1e3a8a" opacity="0.55" /><rect x="156" y="114" width="26" height="66" fill="#1e40af" opacity="0.55" />

          {/* Garis Partikel Antigravitasi Naik Saat 0G */}
          {isZeroG && [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const py = 310 - ((frame * 3.8 + i * 44) % 290);
            return <rect key={i} x={18 + i * 33} y={py} width="2.5" height="14" fill="#fef08a" opacity="0.55" />;
          })}

          {/* Trotoar, Jalan Raya Aspal & Marka */}
          <rect y="175" width="270" height="36" fill="#cbd5e1" /><rect y="211" width="270" height="86" fill="#334155" />
          <rect y="209" width="270" height="4" fill="#94a3b8" /><rect y="297" width="270" height="33" fill="#cbd5e1" /><rect y="295" width="270" height="4" fill="#94a3b8" />
          {[14, 58, 102, 146, 190, 234].map((mx) => <rect key={mx} x={mx} y="252" width="24" height="5" fill="#fde047" />)}

          {/* Gedung Kiri, Pohon & Air Mancur Taman */}
          <rect x="4" y="64" width="56" height="126" fill="#9a3412" stroke="#0f172a" strokeWidth="2" />
          <rect x="2" y="58" width="60" height="8" fill="#7c2d12" stroke="#0f172a" strokeWidth="1.8" />
          {[76, 106, 136].map((wy) => <g key={wy}><rect x="14" y={wy} width="14" height="16" fill="#bae6fd" stroke="#0f172a" strokeWidth="1.5" /><rect x="36" y={wy} width="14" height="16" fill="#bae6fd" stroke="#0f172a" strokeWidth="1.5" /></g>)}
          {/* Pohon Taman */}
          <rect x="74" y="156" width="8" height="28" fill="#78350f" /><rect x="61" y="132" width="34" height="28" fill="#15803d" stroke="#0f172a" strokeWidth="1.6" /><rect x="66" y="122" width="24" height="14" fill="#22c55e" />
          {/* Kolam Air Mancur -> Butiran Air Melayang Saat 0G! */}
          <g transform="translate(124, 186)">
            <ellipse cx="0" cy="4" rx="22" ry="8" fill="#94a3b8" stroke="#0f172a" strokeWidth="1.6" />
            <ellipse cx="0" cy="3" rx="17" ry="5" fill="#38bdf8" />
            <rect x="-4" y="-12" width="8" height="14" fill="#cbd5e1" stroke="#0f172a" strokeWidth="1.4" />
            {lift === 0 && <><rect x="-2" y={-24 - (frame % 4)} width="4" height="12" fill="#7dd3fc" /><rect x="-10" y="-18" width="4" height="6" fill="#bae6fd" /><rect x="6" y="-18" width="4" height="6" fill="#bae6fd" /></>}
            {lift > 0 && [[-12, -24], [-4, -36], [6, -28], [13, -18], [-8, -50], [4, -56], [10, -42]].map(([dx, dy], idx) => (
              <rect key={idx} x={dx + Math.sin(frame * 0.2 + idx) * 3} y={dy - lift * (68 + idx * 8)} width="5" height="5" rx="2" fill={idx % 2 === 0 ? '#7dd3fc' : '#e0f2fe'} />
            ))}
          </g>
          {/* Toko Kanan + Atap Seng Yang Lepas Terbang di Detik 3-4 */}
          <rect x="206" y="88" width="60" height="104" fill="#b45309" stroke="#0f172a" strokeWidth="2" />
          <rect x="216" y="102" width="16" height="18" fill="#bae6fd" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="240" y="102" width="16" height="18" fill="#bae6fd" stroke="#0f172a" strokeWidth="1.5" />
          {[0, 1, 2, 3, 4].map((s) => <rect key={s} x={204 + s * 12} y="138" width="12" height="10" fill={s % 2 === 0 ? '#dc2626' : '#f8fafc'} stroke="#0f172a" strokeWidth="1" />)}
          <rect x="220" y="156" width="26" height="36" fill="#1e293b" stroke="#0f172a" strokeWidth="1.6" />
          {/* Lembaran Atap Seng Melayang! */}
          <g transform={`translate(${236 - liftLate * 24}, ${82 - liftLate * 74}) rotate(${-liftLate * 28})`}>
            <rect x="-32" y="-4" width="64" height="8" fill="#64748b" stroke="#0f172a" strokeWidth="1.6" />
            <rect x="-26" y="-2" width="52" height="3" fill="#94a3b8" />
          </g>

          {/* Tempat Sampah & Kardus Melayang */}
          <g transform={`translate(${174 - liftLate * 12}, ${194 - liftLate * 96}) rotate(${liftLate * 48 + (isCrashed ? 78 : 0)})`}>
            <rect x="-7" y="-10" width="14" height="16" fill="#64748b" stroke="#0f172a" strokeWidth="1.4" />
            <rect x="-9" y="-13" width="18" height="4" fill="#94a3b8" stroke="#0f172a" strokeWidth="1.2" />
          </g>
          <g transform={`translate(${194 + liftLate * 10}, ${202 - liftLate * 82}) rotate(${-liftLate * 35})`}>
            <rect x="-7" y="-7" width="14" height="12" fill="#d97706" stroke="#0f172a" strokeWidth="1.4" />
          </g>

          {/* Mobil Biru & Taksi Kuning */}
          <PixelCar x={car1X} y={236 - lift * 95} color="#2563eb" roof="#3b82f6" rot={isZeroG ? -16 * lift : isCrashed ? -8 : 0} crashed={isCrashed} frame={frame} />
          <PixelCar x={taxiX} y={272 - lift * 104} color="#eab308" roof="#facc15" rot={isZeroG ? 20 * lift : isCrashed ? 11 : 0} taxi crashed={isCrashed} frame={frame} />

          {/* Gerobak Bakso + Pentol & Mangkok Melayang */}
          <PixelBakso x={144} y={290 - liftLate * 92 + (isCrashed ? 4 : 0)} rot={isZeroG ? -24 * liftLate : isCrashed ? 168 : 0} floatT={liftLate} crashed={isCrashed} frame={frame} />
          {(liftLate > 0.05 || isCrashed) && [[-18, -28], [16, -34], [-6, -42], [22, -16]].map(([bx, by], i) => (
            <rect key={i} x={144 + bx + (isCrashed ? i * 5 : 0)} y={isCrashed ? 302 : 272 + by - liftLate * (88 + i * 12)} width="6" height="6" rx="2" fill={i % 2 === 0 ? '#92400e' : '#f8fafc'} stroke="#0f172a" strokeWidth="1" />
          ))}

          {/* Warga 1 & Warga 2 Melayang Lalu Pusing */}
          <PixelPerson x={86} y={196 - lift * 108 + (isCrashed ? 8 : 0)} shirt="#16a34a" rot={isZeroG ? -22 * lift : 0} panic={isZeroG} dizzy={isCrashed} frame={frame} bubble={isZeroG ? '?' : undefined} />
          <PixelPerson x={206} y={204 - lift * 116 + (isCrashed ? 8 : 0)} shirt="#9333ea" rot={isZeroG ? 25 * lift : 0} panic={isZeroG} dizzy={isCrashed} frame={frame + 7} bubble={isZeroG ? '!' : undefined} />

          {/* Tiang Lampu Tertanam Kokoh + SI UDIN BERPEGANGAN DI TIANG! */}
          <rect x="44" y="138" width="6" height="162" fill="#334155" stroke="#0f172a" strokeWidth="1.6" />
          <rect x="38" y="294" width="18" height="8" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="39" y="124" width="16" height="16" fill="#fde047" stroke="#0f172a" strokeWidth="1.6" />
          <polygon points="36,124 47,115 58,124" fill="#1e293b" />
          <g transform={`translate(56, ${272 - lift * 36}) rotate(${isZeroG ? 58 * lift : 0})`}>
            <rect x="-5" y="4" width="4" height="10" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1" />
            <rect x="1" y="4" width="4" height="10" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1" />
            <rect x="-12" y="-7" width="10" height="5" fill="#dc2626" stroke="#0f172a" strokeWidth="1.2" />
            <rect x="-12" y="-1" width="10" height="5" fill="#b91c1c" stroke="#0f172a" strokeWidth="1.2" />
            <rect x="-6" y="-9" width="13" height="14" fill="#dc2626" stroke="#0f172a" strokeWidth="1.4" />
            <rect x="-6" y="-20" width="12" height="11" fill="#fed7aa" stroke="#0f172a" strokeWidth="1.4" />
            <rect x="-6" y="-22" width="12" height="4" fill="#29150b" />
            <rect x="-3" y="-16" width="2" height="2" fill="#0f172a" /><rect x="2" y="-16" width="2" height="2" fill="#0f172a" />
          </g>

          {/* Kucing Oranye -> Melayang lalu Mendarat di Kepala Si Udin! */}
          <PixelCat x={isCrashed ? 54 : 184 - lift * 68} y={isCrashed ? 246 : 302 - lift * 155} rot={isZeroG ? -18 * lift : 0} panic={isZeroG} />

          {/* Awan Debu Benturan Saat Gravitasi Kembali (Frame 680-715) */}
          {frame >= 680 && frame < 718 && [65, 118, 178, 224].map((dx, i) => {
            const p = (frame - 680) / 38;
            return <ellipse key={i} cx={dx} cy={292 - p * 18} rx={12 + p * 22} ry={6 + p * 10} fill="#e2e8f0" opacity={Math.max(0, 0.85 - p)} />;
          })}
        </svg>

        {/* ANGKA HITUNG MUNDUR RAKSASA 5..4..3..2..1..0! */}
        {countNum !== null && !showCut && (
          <div style={{ position: 'absolute', top: 34, left: '50%', transform: `translateX(-50%) scale(${1 + Math.sin(frame * 0.45) * 0.06})`, fontFamily, fontSize: 108, color: countNum === 0 ? '#ef4444' : '#fde047', textShadow: '8px 8px 0 #0f172a, -4px -4px 0 #0f172a, 4px -4px 0 #0f172a, -4px 4px 0 #0f172a', zIndex: 30 }}>
            {countNum === 0 ? 'BRAK!' : countNum}
          </div>
        )}
      </div>
      {showCut && <AbsoluteFill style={{ backgroundColor: 'rgba(15, 23, 42, 0.58)', opacity: cutPop, zIndex: 35 }} />}
      {showCut && <AbsoluteFill style={{ transform: `scale(${cutPop})`, zIndex: 38 }}><CloseUpUdinCrash frame={frame} localFrame={frame - 775} /></AbsoluteFill>}

      {/* HUD ATAS AMAN TIKTOK */}
      <div style={{ position: 'absolute', top: 82, left: '50%', transform: 'translateX(-50%)', padding: '6px 18px', borderRadius: 20, backgroundColor: 'rgba(15, 23, 42, 0.85)', border: '2px solid rgba(250, 204, 21, 0.65)', fontFamily: 'sans-serif', fontSize: 22, fontWeight: 'bold', color: '#f8fafc', zIndex: 45 }}>@dysesat</div>
      <div style={{ position: 'absolute', top: 138, left: 65, right: 65, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 45 }}>
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.94)', border: `3px solid ${isZeroG ? '#ef4444' : '#38bdf8'}`, borderRadius: 14, padding: '10px 16px', fontFamily, fontSize: 15, color: isZeroG ? '#f87171' : '#38bdf8' }}>GRAVITASI: {isZeroG ? '0G!' : '1G'}</div>
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.94)', border: `3px solid ${isZeroG ? '#facc15' : isCrashed ? '#f87171' : '#4ade80'}`, borderRadius: 14, padding: '10px 16px', fontFamily, fontSize: 14, color: isZeroG ? '#fde047' : isCrashed ? '#f87171' : '#4ade80' }}>{isZeroG ? 'MELAYANG!' : isCrashed ? 'KACAU!' : 'NORMAL'}</div>
      </div>

      {/* SUBTITLE POP-UP PER KATA DI ZONA AMAN */}
      {activeWord && !showCliff && (
        <div style={{ position: 'absolute', top: 1435, left: 70, right: 70, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ fontFamily, fontSize: activeWord.w.length > 10 ? 32 : 40, color: getWordColor(activeWord.w), textAlign: 'center', padding: '12px 24px', borderRadius: 16, backgroundColor: 'rgba(15, 23, 42, 0.84)', border: `3px solid ${getWordColor(activeWord.w)}`, textShadow: '4px 4px 0 #0f172a, -3px -3px 0 #0f172a, 3px -3px 0 #0f172a, -3px 3px 0 #0f172a', transform: `scale(${0.65 + wordPop * 0.35}) rotate(${activeIdx % 2 === 0 ? -2 : 2}deg)` }}>
            {activeWord.w.toUpperCase()}
          </div>
        </div>
      )}

      {/* BANNER PENUTUP PANCING KOMENTAR */}
      {showCliff && (
        <div style={{ position: 'absolute', top: 1435, left: 65, right: 65, backgroundColor: 'rgba(15, 23, 42, 0.96)', border: '4px solid #facc15', borderRadius: 16, padding: '16px 20px', textAlign: 'center', fontFamily, fontSize: 17, lineHeight: 1.5, color: '#facc15', boxShadow: '0 10px 28px rgba(0,0,0,0.65)', transform: `scale(${cliffIn * (1 + Math.sin(frame * 0.22) * 0.025)})`, zIndex: 55 }}>
          KALAU HILANG SEHARIAN GIMANA?<br /><span style={{ color: '#38bdf8', fontSize: 15 }}>TULIS DI KOMENTAR!</span>
        </div>
      )}
    </AbsoluteFill>
  );
};
