import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PressStart2P';
import { whoosh, ding } from '@remotion/sfx';
import { WORD_SUBS_NS, NS_TIMING } from './noSleepWords';
import { CloseUpUdinNoSleep } from './NoSleepCutscene';

const { fontFamily } = loadFont();
const getWordColor = (w: string) => {
  const c = w.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (['tidur','tubuhmu','otakmu','mikro','pulas','rekor','begadang','jam'].includes(c)) return '#38bdf8';
  if (['memerah','anjlok','mabuk','emosi','meledak','halusinasi','bayangan','drop','kacau','menyerah','tumbang'].includes(c)) return '#f87171';
  if (['sebelas','dua','puluh','empat','delapan','tiga','tujuh','ketujuh','kesebelas'].includes(c)) return '#fde047';
  return '#ffffff';
};
type SleepMode = 'fresh' | 'drunk' | 'micro' | 'panic' | 'dizzy' | 'shut' | 'morning';

const UdinSleep2D: React.FC<{ x: number; y: number; mode: SleepMode; frame: number; nod?: number; fallT?: number }> = ({ x, y, mode, frame, nod = 0, fallT = 0 }) => {
  const sway = mode === 'drunk' ? Math.sin(frame * 0.14) * 9 : mode === 'dizzy' ? Math.sin(frame * 0.22) * 12 : mode === 'shut' ? -fallT * 90 : 0;
  const shiv = mode === 'panic' ? Math.sin(frame * 1.9) * 1.6 : 0;
  const bob = mode === 'fresh' || mode === 'morning' ? Math.sin(frame * 0.2) * 1.2 : 0;
  const skin = mode === 'panic' ? '#ddd6fe' : mode === 'dizzy' ? '#dcfce7' : '#fed7aa';
  const tired = mode !== 'fresh' && mode !== 'morning';
  const closed = (mode === 'micro' && nod > 0.45) || (mode === 'shut' && fallT > 0.35) || (mode === 'fresh' && frame % 85 > 80);
  const armL = mode === 'panic' || mode === 'dizzy' ? 138 : mode === 'fresh' ? 40 : mode === 'morning' ? 145 : 14;
  return (
    <g transform={`translate(${x + shiv}, ${y + bob}) rotate(${sway})`}>
      <ellipse cx="0" cy="14" rx="11" ry="3" fill="rgba(15,23,42,0.32)" />
      <rect x="-5" y="4" width="4" height="10" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.2" />
      <rect x="1" y="4" width="4" height="10" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.2" />
      <rect x="-7" y="-8" width="14" height="13" fill="#dc2626" stroke="#0f172a" strokeWidth="1.4" />
      <g transform={`translate(-7, -6) rotate(${armL})`}>
        <rect x="-2.5" y="0" width="4.5" height="8" fill="#dc2626" stroke="#0f172a" strokeWidth="1.2" />
        <rect x="-2.5" y="7" width="4.5" height="3.5" fill={skin} stroke="#0f172a" strokeWidth="1" />
        {mode === 'fresh' && <rect x="-3" y="9" width="5" height="5" fill="#f8fafc" stroke="#0f172a" strokeWidth="0.9" />}
      </g>
      <g transform={`translate(7, -6) rotate(${-armL})`}>
        <rect x="-2" y="0" width="4.5" height="8" fill="#dc2626" stroke="#0f172a" strokeWidth="1.2" />
        <rect x="-2" y="7" width="4.5" height="3.5" fill={skin} stroke="#0f172a" strokeWidth="1" />
        {mode === 'fresh' && <rect x="-1" y="8" width="4" height="6" rx="0.8" fill="#38bdf8" stroke="#0f172a" strokeWidth="0.9" />}
      </g>
      <g transform={`translate(0, ${nod * 3.5}) rotate(${nod * 24})`}>
        <rect x="-6" y="-19" width="12" height="11" fill={skin} stroke="#0f172a" strokeWidth="1.4" />
        <rect x="-6" y="-21" width="12" height="4" fill="#29150b" />
        {tired && <><rect x="-4.5" y="-12.5" width="3.8" height="1.5" fill="#4338ca" opacity="0.65" /><rect x="0.8" y="-12.5" width="3.8" height="1.5" fill="#4338ca" opacity="0.65" /></>}
        {closed ? (<><rect x="-4" y="-14" width="3" height="1.2" fill="#0f172a" /><rect x="1" y="-14" width="3" height="1.2" fill="#0f172a" /></>) : (
          <><rect x="-4.5" y="-15.5" width="3.5" height="3" fill={tired ? '#fca5a5' : '#ffffff'} /><rect x="1" y="-15.5" width="3.5" height="3" fill={tired ? '#fca5a5' : '#ffffff'} /><rect x="-3.2" y="-14.8" width="1.8" height="1.8" fill="#0f172a" /><rect x="2.2" y="-14.8" width="1.8" height="1.8" fill="#0f172a" /></>
        )}
        <rect x="-2" y="-10.8" width="4" height={mode === 'panic' || mode === 'morning' ? 2.6 : 1.4} fill={mode === 'panic' ? '#7f1d1d' : '#0f172a'} />
        {(mode === 'drunk' || mode === 'dizzy') && [0, 1, 2].map((i) => (<circle key={i} cx={Math.cos(frame * 0.22 + i * 2.1) * 9} cy={-24 + Math.sin(frame * 0.22 + i * 2.1) * 2.5} r="1.8" fill="#fde047" />))}
      </g>
    </g>
  );
};

const ChoiceBadge: React.FC<{ x: number; y: number; label: string; col: string; scale: number }> = ({ x, y, label, col, scale }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    <rect x="-32" y="-14" width="64" height="28" rx="7" fill="rgba(15,23,42,0.92)" stroke={col} strokeWidth="2.2" />
    <text x="0" y="3.5" textAnchor="middle" fill={col} fontSize="8.5" fontWeight="bold" fontFamily="monospace">{label}</text>
  </g>
);
const RoomStageBg: React.FC<{ stage: string; frame: number; shadowT: number; eyesT: number }> = ({ stage, frame, shadowT, eyesT }) => {
  const isMorn = stage === 'back';
  const wallFill = isMorn ? 'url(#nsMorn)' : stage === 'h72' ? 'url(#ns72)' : stage === 'd7' ? 'url(#nsD7)' : stage === 'd11' ? 'url(#nsD11)' : 'url(#nsNight)';
  const dayT = stage === 'start' ? (Math.sin(frame * 0.22) + 1) / 2 : isMorn ? 1 : 0;
  const clkSp = stage === 'start' ? 18 : isMorn ? 0.5 : 8;
  const mugs = stage === 'start' ? 1 : stage === 'h24' ? 2 : isMorn ? 0 : 4;
  return (
    <g>
      <rect width="270" height="240" fill={wallFill} />
      <rect y="236" width="270" height="7" fill={isMorn ? '#d97706' : '#334155'} stroke="#0f172a" strokeWidth="1.2" />
      <rect y="243" width="270" height="87" fill={isMorn ? '#b45309' : '#29150b'} />
      <g transform="translate(16, 114)">
        <rect width="34" height="40" rx="2" fill="#1e1b4b" stroke="#78350f" strokeWidth="2.2" />
        <circle cx="17" cy="19" r="7" fill="#f97316" /><ellipse cx="17" cy="19" rx="12" ry="3.2" fill="none" stroke="#fde047" strokeWidth="1.4" transform="rotate(-18, 17, 19)" />
      </g>
      <g transform="translate(86, 128)">
        <circle r="14" fill="#f8fafc" stroke="#0f172a" strokeWidth="2" />
        <line x1="0" y1="0" x2={Math.sin(frame * 0.05 * clkSp) * 8} y2={-Math.cos(frame * 0.05 * clkSp) * 8} stroke="#0f172a" strokeWidth="1.6" />
        <line x1="0" y1="0" x2={Math.sin(frame * 0.25 * clkSp) * 11} y2={-Math.cos(frame * 0.25 * clkSp) * 11} stroke="#dc2626" strokeWidth="1.2" />
        <circle r="1.5" fill="#0f172a" />
      </g>
      <g transform="translate(168, 108)">
        <rect width="68" height="62" rx="3" fill={dayT > 0.5 ? '#38bdf8' : '#020617'} stroke="#78350f" strokeWidth="3" />
        {dayT > 0.5 ? <circle cx="48" cy="20" r="8" fill="#fde047" /> : <><circle cx="48" cy="20" r="7" fill="#fef08a" /><circle cx="52" cy="18" r="6" fill="#020617" /></>}
        <line x1="34" y1="0" x2="34" y2="62" stroke="#78350f" strokeWidth="2" /><line x1="0" y1="31" x2="68" y2="31" stroke="#78350f" strokeWidth="2" />
      </g>
      {isMorn && <polygon points="168,170 236,170 184,295 104,295" fill="#fef08a" opacity="0.16" />}
      <ellipse cx="144" cy="284" rx="64" ry="13" fill={isMorn ? '#38bdf8' : '#1e293b'} stroke="#0f172a" strokeWidth="1.4" opacity="0.85" />
      <g transform="translate(14, 212)">
        <rect x="0" y="-12" width="12" height="58" rx="2" fill="#78350f" stroke="#0f172a" strokeWidth="1.6" />
        <rect x="10" y="10" width="98" height="24" rx="3" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1.6" />
        <ellipse cx="26" cy="8" rx="14" ry="6" fill="#ffffff" stroke="#0f172a" strokeWidth="1.4" />
        <rect x="44" y="10" width="64" height="24" rx="3" fill="#2563eb" stroke="#0f172a" strokeWidth="1.6" />
        <rect x="10" y="34" width="98" height="10" fill="#92400e" stroke="#0f172a" strokeWidth="1.6" />
      </g>
      <g transform="translate(182, 222)">
        <rect width="50" height="42" rx="2" fill="#78350f" stroke="#0f172a" strokeWidth="1.6" />
        <rect x="6" y="7" width="38" height="12" fill="#92400e" stroke="#0f172a" strokeWidth="1.2" /><circle cx="25" cy="13" r="2" fill="#fde047" />
        <rect x="30" y="-10" width="4" height="10" fill="#475569" /><polygon points="22,-22 42,-22 46,-10 18,-10" fill={isMorn ? '#fde047' : '#f59e0b'} stroke="#0f172a" strokeWidth="1.3" />
        {Array.from({ length: mugs }).map((_, i) => (<rect key={i} x={4 + (i % 2) * 10} y={-7 - Math.floor(i / 2) * 7} width="7" height="7" fill="#f8fafc" stroke="#0f172a" strokeWidth="1" />))}
      </g>
      {isMorn && (
        <g>
          <rect x="14" y="164" width="54" height="6" fill="#78350f" stroke="#0f172a" strokeWidth="1.2" />
          <rect x="18" y="152" width="7" height="12" fill="#ef4444" stroke="#0f172a" strokeWidth="1" />
          <rect x="26" y="150" width="7" height="14" fill="#38bdf8" stroke="#0f172a" strokeWidth="1" />
          <rect x="34" y="154" width="8" height="10" fill="#4ade80" stroke="#0f172a" strokeWidth="1" />
          <g transform="translate(192, 214)"><polygon points="-6,8 6,8 8,0 -8,0" fill="#ea580c" stroke="#0f172a" strokeWidth="1.1" /><circle cx="0" cy="-5" r="6" fill="#22c55e" stroke="#0f172a" strokeWidth="1.1" /></g>
          <g transform={`translate(192, ${284 + Math.sin(frame * 0.14) * 0.7})`}>
            <ellipse cx="0" cy="0" rx="11" ry="6" fill="#fb923c" stroke="#0f172a" strokeWidth="1.2" />
            <circle cx="-7" cy="-3" r="5" fill="#fb923c" stroke="#0f172a" strokeWidth="1.2" />
            <polygon points="-11,-7 -9,-12 -6,-7" fill="#fb923c" stroke="#0f172a" strokeWidth="1" />
            <polygon points="-6,-7 -4,-12 -2,-7" fill="#fb923c" stroke="#0f172a" strokeWidth="1" />
            <line x1="-9" y1="-3" x2="-6" y2="-3" stroke="#0f172a" strokeWidth="1.1" />
          </g>
        </g>
      )}
      {stage === 'h72' && shadowT > 0.01 && (
        <g transform={`translate(148, ${188 + Math.sin(frame * 0.1) * 3}) scale(${0.86 + shadowT * 0.2})`} opacity={shadowT}>
          <path d="M-46,66 Q-58,4 -34,-44 C-18,-72 18,-72 34,-44 Q58,4 46,66 Z" fill="#020617" />
          <path d={`M-38,14 Q${-86 + Math.sin(frame * 0.14) * 8},-12 ${-74 + Math.cos(frame * 0.12) * 6},-48 Q-58,-18 -30,0 Z`} fill="#020617" />
          <path d={`M38,14 Q${86 - Math.sin(frame * 0.14) * 8},-12 ${74 - Math.cos(frame * 0.12) * 6},-48 Q58,-18 30,0 Z`} fill="#020617" />
          {eyesT > 0.02 && (<g opacity={eyesT}><circle cx="-15" cy="-26" r="8" fill="#ef4444" opacity="0.34" /><circle cx="15" cy="-26" r="8" fill="#ef4444" opacity="0.34" /><polygon points="-22,-30 -8,-24 -20,-21" fill="#fde047" /><polygon points="22,-30 8,-24 20,-21" fill="#fde047" /><circle cx="-15" cy="-25" r="1.8" fill="#7f1d1d" /><circle cx="15" cy="-25" r="1.8" fill="#7f1d1d" /></g>)}
        </g>
      )}
      {stage === 'h72' && eyesT > 0.05 && [[38,194,'#c084fc'],[222,188,'#38bdf8']].map(([ex,ey,ec],i)=>(<g key={i} transform={`translate(${Number(ex)}, ${Number(ey)})`} opacity={eyesT * (0.6 + Math.sin(frame * 0.35 + i) * 0.35)}><circle cx="-4" cy="0" r="2" fill={String(ec)} /><circle cx="4" cy="0" r="2" fill={String(ec)} /></g>))}
      {stage === 'd7' && (<g><polyline points={`18,176 58,176 70,${154 + Math.sin(frame * 0.9) * 14} 82,196 94,168 112,176 154,176 168,${152 + Math.cos(frame * 1.1) * 14} 180,198 194,176 236,176`} fill="none" stroke="#ef4444" strokeWidth="2.4" opacity="0.88" /><g transform={`translate(212, ${142 + Math.sin(frame * 0.4) * 2})`}><path d="M0,-14 L12,-9 L10,5 L0,14 L-10,5 L-12,-9 Z" fill="#1e293b" stroke="#facc15" strokeWidth="2" /><polyline points="-2,-10 3,-2 -3,3 2,11" fill="none" stroke="#ef4444" strokeWidth="2" /></g></g>)}
    </g>
  );
};
export const NoSleep11Days: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sec = frame / fps;
  const { t24, t48, t72, tShadow, tDay7, tDay11, tShut, tBack, tCutEnd, tChoice, cliffFrame } = NS_TIMING;
  const stage = frame < t24 ? 'start' : frame < t48 ? 'h24' : frame < t72 ? 'h48' : frame < tDay7 ? 'h72' : frame < tDay11 ? 'd7' : frame < tBack ? 'd11' : 'back';
  const localF = stage === 'h24' ? frame - t24 : stage === 'h48' ? frame - t48 : stage === 'h72' ? frame - t72 : stage === 'd7' ? frame - tDay7 : stage === 'd11' ? frame - tDay11 : frame;
  const brainFrac = interpolate(frame, [0, t24, t48, t72, tDay7, tDay11, tShut + 16], [1, 0.72, 0.48, 0.28, 0.14, 0.06, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cutStart = tBack, cutEnd = tCutEnd;
  const showCut = frame >= cutStart && frame <= cutEnd;
  const cutIn = showCut ? spring({ frame: frame - cutStart, fps, config: { damping: 12 } }) : 0;
  const cutOutFlash = frame >= cutEnd - 2 && frame <= cutEnd + 3 ? interpolate(frame, [cutEnd - 2, cutEnd, cutEnd + 3], [0, 0.92, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const showCliff = frame >= cliffFrame;
  const cliffIn = showCliff ? spring({ frame: frame - cliffFrame, fps, config: { damping: 10 } }) : 0;
  const activeIdx = WORD_SUBS_NS.findIndex((x) => sec >= x.s && sec < x.e);
  const activeWord = activeIdx >= 0 ? WORD_SUBS_NS[activeIdx] : null;
  const wordPop = activeWord ? spring({ frame: Math.max(0, frame - Math.floor(activeWord.s * fps)), fps, config: { damping: 11, stiffness: 280, mass: 0.5 } }) : 0;
  const m1 = stage === 'h48' ? interpolate(localF, [22, 28, 42, 48], [0, 0.92, 0.92, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const m2 = stage === 'h48' ? interpolate(localF, [78, 84, 98, 104], [0, 0.95, 0.95, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const microBlink = Math.max(m1, m2);
  const shadowT = stage === 'h72' ? interpolate(localF, [28, 110], [0, 0.92], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const eyesT = stage === 'h72' ? interpolate(frame, [tShadow - 4, tShadow + 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const fallT = stage === 'd11' ? interpolate(frame, [tShut - 4, tShut + 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const lidH = stage === 'd11' ? interpolate(frame, [tShut + 6, tShut + 30], [0, 168], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const meta: Record<string, { dur: string; stat: string; big: string; sub: string; border: string; col: string }> = {
    start: { dur: '0 JAM', stat: 'OTAK: 100%', big: '0 JAM', sub: 'MULAI BEGADANG', border: '#38bdf8', col: '#38bdf8' },
    h24:   { dur: '24 JAM', stat: 'SETARA MABUK', big: '24 JAM', sub: 'FOKUS ANJLOK!', border: '#facc15', col: '#fde047' },
    h48:   { dur: '48 JAM', stat: 'TIDUR MIKRO!', big: '48 JAM', sub: 'TERTIDUR 3 DETIK!', border: '#fb923c', col: '#fb923c' },
    h72:   { dur: '72 JAM', stat: 'HALUSINASI!', big: '72 JAM', sub: 'BAYANGAN HIDUP!', border: '#a855f7', col: '#c084fc' },
    d7:    { dur: 'HARI KE-7', stat: 'IMUN DROP!', big: 'HARI KE-7', sub: 'JANTUNG KACAU!', border: '#ef4444', col: '#f87171' },
    d11:   { dur: 'HARI KE-11', stat: 'OTAK: 0%', big: 'HARI KE-11', sub: 'OTAK SHUTDOWN!', border: '#ef4444', col: '#f87171' },
    back:  { dur: 'SELESAI', stat: 'TIDUR PULAS', big: 'SELAMAT!', sub: 'BALAS DENDAM TIDUR', border: '#4ade80', col: '#4ade80' },
  };
  const cur = meta[stage];
  const roomTilt = stage === 'd7' ? Math.sin(localF * 0.09) * 5.2 : 0;
  const shake = stage === 'h72' && eyesT > 0.2 ? Math.sin(frame * 2.2) * 1.8 : stage === 'd11' && fallT > 0 && fallT < 1 ? Math.sin(frame * 2.8) * 3.5 : 0;
  const udinMode: SleepMode = stage === 'start' ? 'fresh' : stage === 'h24' ? 'drunk' : stage === 'h48' ? 'micro' : stage === 'h72' ? 'panic' : stage === 'd7' ? 'dizzy' : stage === 'd11' ? 'shut' : 'morning';
  const udinX = stage === 'd11' ? interpolate(fallT, [0, 1], [134, 80]) : stage === 'h72' ? 116 : 138;
  const udinY = stage === 'd11' ? interpolate(fallT, [0, 1], [252, 224]) : 252;
  const introAlpha = stage === 'start' ? interpolate(frame, [0, 8, t24 - 14, t24 - 4], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const showChoices = stage === 'back' && !showCut && frame >= tChoice - 4;
  const choicePop = showChoices ? spring({ frame: Math.max(0, frame - (tChoice - 4)), fps, config: { damping: 11, stiffness: 210 } }) : 0;
  const thudTimes = [t48 + 24, t48 + 80].filter((t) => t < t72 - 16);
  const heartTimes = [tDay7 + 6, tDay7 + 62].filter((t) => t < tDay11 - 20);
  const alarmTimes = [cutStart + 12, cutStart + 64].filter((t) => t < cutEnd - 24);
  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a', overflow: 'hidden', transform: `translate(${shake}px, ${-shake * 0.5}px)` }}>
      <Audio src={staticFile('vo_no_sleep.mp3')} volume={1} />
      <Audio src={staticFile('bgm_no_sleep.wav')} volume={0.21} />
      <Sequence from={8} durationInFrames={36}><Audio src={staticFile('sfx_ns_clock.wav')} volume={0.28} /></Sequence>
      {thudTimes.map((tf, i) => (<Sequence key={`th-${i}`} from={tf} durationInFrames={18}><Audio src={staticFile('sfx_ns_thud.wav')} volume={0.34} /></Sequence>))}
      <Sequence from={tShadow} durationInFrames={36}><Audio src={staticFile('sfx_ns_hallu.wav')} volume={0.34} /></Sequence>
      {heartTimes.map((hf, i) => (<Sequence key={`ht-${i}`} from={hf} durationInFrames={45}><Audio src={staticFile('sfx_ns_heart.wav')} volume={0.34} /></Sequence>))}
      <Sequence from={tShut} durationInFrames={30}><Audio src={staticFile('sfx_ns_shutdown.wav')} volume={0.38} /></Sequence>
      <Sequence from={cutStart} durationInFrames={28}><Audio src={whoosh} volume={0.34} /></Sequence>
      {alarmTimes.map((af, i) => (<Sequence key={`al-${i}`} from={af} durationInFrames={42}><Audio src={staticFile('sfx_ns_alarm.wav')} volume={0.25} /></Sequence>))}
      <Sequence from={Math.max(0, cutEnd - 3)} durationInFrames={28}><Audio src={whoosh} volume={0.30} /></Sequence>
      <Sequence from={cliffFrame} durationInFrames={45}><Audio src={ding} volume={0.45} /></Sequence>
      <AbsoluteFill style={{ backgroundImage: 'radial-gradient(#38bdf8 3px, transparent 3px)', backgroundSize: '44px 44px', opacity: 0.2 }} />
      <div style={{ position: 'absolute', top: 230, left: 60, right: 60, height: 1160, border: `8px solid ${cur.border}`, borderRadius: 28, overflow: 'hidden', boxShadow: '0 22px 54px rgba(0,0,0,0.85)', zIndex: 15 }}>
        <svg width="100%" height="100%" viewBox="0 0 270 330" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="nsNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1e293b" /><stop offset="100%" stopColor="#0f172a" /></linearGradient>
            <linearGradient id="ns72" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1e1b4b" /><stop offset="100%" stopColor="#09051a" /></linearGradient>
            <linearGradient id="nsD7" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2a121b" /><stop offset="100%" stopColor="#0f0710" /></linearGradient>
            <linearGradient id="nsD11" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#171717" /><stop offset="100%" stopColor="#050505" /></linearGradient>
            <linearGradient id="nsMorn" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fef3c7" /><stop offset="100%" stopColor="#fde68a" /></linearGradient>
          </defs>
          <g transform={`rotate(${roomTilt}, 135, 190)`}>
            <RoomStageBg stage={stage} frame={frame} shadowT={shadowT} eyesT={eyesT} />
            <UdinSleep2D x={udinX} y={udinY} mode={udinMode} frame={frame} nod={microBlink} fallT={fallT} />
          </g>
          {microBlink > 0.02 && <rect width="270" height="330" fill="#020617" opacity={microBlink} />}
          {lidH > 0.5 && (<><rect x="0" y="0" width="270" height={lidH} fill="#020617" /><rect x="0" y={330 - lidH} width="270" height={lidH} fill="#020617" />{lidH > 152 && <line x1="20" y1="165" x2="250" y2="165" stroke="#ffffff" strokeWidth="2" opacity={interpolate(lidH, [152, 168], [0.85, 0], { extrapolateRight: 'clamp' })} />}</>)}
          {stage !== 'back' && (
            <g transform="translate(248, 106)">
              <rect x="3" y="-4" width="6" height="4" rx="1" fill="#94a3b8" />
              <rect x="0" y="0" width="12" height="156" rx="4" fill="rgba(15,23,42,0.82)" stroke="#94a3b8" strokeWidth="1.4" />
              <rect x="2" y={2 + (1 - brainFrac) * 152} width="8" height={Math.max(4, brainFrac * 152)} rx="2.5" fill={brainFrac > 0.5 ? '#4ade80' : brainFrac > 0.25 ? '#facc15' : '#ef4444'} />
            </g>
          )}
          {showChoices && (
            <g>
              <g transform={`translate(138, ${214 + Math.sin(frame * 0.24) * 3}) scale(${choicePop})`}><rect x="-10" y="-12" width="20" height="14" rx="4" fill="rgba(15,23,42,0.9)" stroke="#facc15" strokeWidth="1.4" /><text x="0" y="-2.5" textAnchor="middle" fill="#fde047" fontSize="9" fontWeight="bold" fontFamily="monospace">?</text></g>
              <ChoiceBadge x={58} y={102 + Math.sin(frame * 0.22) * 3.5} label="24 JAM" col="#fde047" scale={choicePop} />
              <ChoiceBadge x={135} y={102 + Math.sin(frame * 0.22 + 1.2) * 3.5} label="48 JAM" col="#fb923c" scale={choicePop} />
              <ChoiceBadge x={212} y={102 + Math.sin(frame * 0.22 + 2.4) * 3.5} label="72 JAM+" col="#f87171" scale={choicePop} />
            </g>
          )}
        </svg>
        {introAlpha > 0.02 && (
          <div style={{ position: 'absolute', top: 34, left: 24, right: 24, textAlign: 'center', opacity: introAlpha, zIndex: 30 }}>
            <div style={{ fontFamily, fontSize: 27, lineHeight: 1.45, color: '#fde047', textShadow: '5px 5px 0 #0f172a, -3px -3px 0 #0f172a, 3px -3px 0 #0f172a, -3px 3px 0 #0f172a' }}>TIDAK TIDUR<br />11 HARI?!</div>
            <div style={{ display: 'inline-block', marginTop: 14, padding: '8px 16px', borderRadius: 12, backgroundColor: 'rgba(15,23,42,0.88)', border: '3px solid #f87171', fontFamily, fontSize: 13, color: '#ffffff' }}>APA YANG TERJADI?</div>
          </div>
        )}
        {stage !== 'start' && stage !== 'back' && !showCut && (
          <div style={{ position: 'absolute', top: 24, left: '50%', transform: `translateX(-50%) scale(${1 + Math.sin(frame * 0.4) * 0.04})`, textAlign: 'center', zIndex: 30, width: '90%' }}>
            <div style={{ fontFamily, fontSize: 13, color: '#ffffff', textShadow: '3px 3px 0 #0f172a', marginBottom: 8 }}>TANPA TIDUR:</div>
            <div style={{ fontFamily, fontSize: 36, color: cur.col, textShadow: '6px 6px 0 #0f172a, -3px -3px 0 #0f172a, 3px -3px 0 #0f172a, -3px 3px 0 #0f172a' }}>{cur.big}</div>
            <div style={{ display: 'inline-block', marginTop: 10, padding: '8px 16px', borderRadius: 12, backgroundColor: 'rgba(15,23,42,0.88)', border: `3px solid ${cur.border}`, fontFamily, fontSize: 14, color: '#ffffff' }}>{cur.sub}</div>
          </div>
        )}
      </div>
      {showCut && <div style={{ position: 'absolute', top: 230, left: 60, right: 60, height: 1160, borderRadius: 28, backgroundColor: '#0f172a', zIndex: 35 }} />}
      {showCut && <AbsoluteFill style={{ transform: `scale(${0.94 + cutIn * 0.06})`, transformOrigin: '50% 42%', zIndex: 38 }}><CloseUpUdinNoSleep frame={frame} localFrame={frame - cutStart} /></AbsoluteFill>}
      {cutOutFlash > 0.02 && <div style={{ position: 'absolute', top: 230, left: 60, right: 60, height: 1160, borderRadius: 28, backgroundColor: '#ffffff', opacity: cutOutFlash, zIndex: 40, pointerEvents: 'none' }} />}
      <div style={{ position: 'absolute', top: 68, left: '50%', transform: 'translateX(-50%)', padding: '5px 18px', borderRadius: 20, backgroundColor: 'rgba(15, 23, 42, 0.85)', border: '2px solid rgba(250, 204, 21, 0.65)', fontFamily: 'sans-serif', fontSize: 21, fontWeight: 'bold', color: '#f8fafc', zIndex: 45 }}>@dysesat</div>
      <div style={{ position: 'absolute', top: 114, left: 60, right: 60, textAlign: 'center', zIndex: 45 }}>
        <div style={{ display: 'inline-block', backgroundColor: 'rgba(15, 23, 42, 0.94)', border: '3px solid #facc15', borderRadius: 14, padding: '9px 18px', fontFamily, fontSize: 15, color: '#fde047', textShadow: '2px 2px 0 #0f172a' }}>TIDAK TIDUR 11 HARI!</div>
      </div>
      <div style={{ position: 'absolute', top: 170, left: 65, right: 65, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 45 }}>
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.94)', border: `3px solid ${cur.border}`, borderRadius: 14, padding: '9px 15px', fontFamily, fontSize: 13, color: '#ffffff' }}>BEGADANG: <span style={{ color: cur.col }}>{cur.dur}</span></div>
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.94)', border: `3px solid ${cur.border}`, borderRadius: 14, padding: '9px 15px', fontFamily, fontSize: 13, color: cur.col }}>{cur.stat}</div>
      </div>
      {activeWord && !showCliff && (
        <div style={{ position: 'absolute', top: 1435, left: 70, right: 70, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ fontFamily, fontSize: activeWord.w.length > 10 ? 32 : 40, color: getWordColor(activeWord.w), textAlign: 'center', padding: '12px 24px', borderRadius: 16, backgroundColor: 'rgba(15, 23, 42, 0.84)', border: `3px solid ${getWordColor(activeWord.w)}`, textShadow: '4px 4px 0 #0f172a, -3px -3px 0 #0f172a, 3px -3px 0 #0f172a, -3px 3px 0 #0f172a', transform: `scale(${0.65 + wordPop * 0.35}) rotate(${activeIdx % 2 === 0 ? -2 : 2}deg)` }}>{activeWord.w.toUpperCase()}</div>
        </div>
      )}
      {showCliff && (
        <div style={{ position: 'absolute', top: 1435, left: 65, right: 65, backgroundColor: 'rgba(15, 23, 42, 0.96)', border: '4px solid #facc15', borderRadius: 16, padding: '16px 20px', textAlign: 'center', fontFamily, fontSize: 15, lineHeight: 1.5, color: '#facc15', boxShadow: '0 10px 28px rgba(0,0,0,0.65)', transform: `scale(${cliffIn * (1 + Math.sin(frame * 0.22) * 0.025)})`, zIndex: 55 }}>
          REKOR BEGADANG TERLAMA KAMU BERAPA JAM?<br /><span style={{ color: '#38bdf8', fontSize: 15 }}>TULIS DI KOMENTAR!</span>
        </div>
      )}
    </AbsoluteFill>
  );
};
