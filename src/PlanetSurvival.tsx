import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PressStart2P';
import { whoosh, ding } from '@remotion/sfx';
import { WORD_SUBS_PS, PS_TIMING } from './planetSurvWords';
import { CloseUpUdinPlanet } from './PlanetSurvivalCutscene';

const { fontFamily } = loadFont();

const getWordColor = (word: string) => {
  const c = word.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (['bumi', 'planet', 'astronot', 'mars', 'jupiter', 'nyaman'].includes(c)) return '#38bdf8';
  if (['merkurius', 'venus', 'gosong', 'beku', 'asam', 'remuk', 'badai', 'hancur', 'ngeri'].includes(c)) return '#f87171';
  if (['dua', 'detik', 'menit', 'satu', 'delapan', 'puluh', 'tahun', 'empat', 'ratus'].includes(c)) return '#fde047';
  return '#ffffff';
};

type UdinMode = 'normal' | 'split' | 'crush' | 'mars' | 'fall' | 'relief';

const Udin2D: React.FC<{ x: number; y: number; mode: UdinMode; frame: number; crushT?: number; blueT?: number }> = ({ x, y, mode, frame, crushT = 0, blueT = 0 }) => {
  const isPanic = mode === 'split' || mode === 'fall';
  const isRelief = mode === 'relief';
  const isCrush = mode === 'crush';
  const isMars = mode === 'mars';
  const sx = isCrush ? 1 + crushT * 0.55 : 1;
  const sy = isCrush ? 1 - crushT * 0.55 : 1;
  const rot = mode === 'fall' ? (frame * 11) % 360 : 0;
  const shiv = isMars ? Math.sin(frame * 1.6) * (1.2 + blueT * 1.4) : isCrush ? Math.sin(frame * 1.8) * 1.2 : 0;
  const bob = isPanic ? Math.abs(Math.sin(frame * 0.45)) * -3 : mode === 'normal' ? Math.sin(frame * 0.16) * 0.9 : 0;
  const fl = isPanic ? Math.sin(frame * 0.7) * 18 : 0;
  const skin = isCrush ? '#fb7185' : isMars ? (blueT > 0.45 ? '#93c5fd' : '#c4b5fd') : '#fed7aa';
  const blink = mode === 'normal' && (frame % 90) > 85;
  return (
    <g transform={`translate(${x + shiv}, ${y + bob + (isCrush ? crushT * 9 : isRelief ? 6 : 0)}) rotate(${rot}) scale(${sx}, ${sy})`}>
      {mode !== 'fall' && <ellipse cx="0" cy={isRelief ? 7 : 14} rx={isRelief ? 13 : 9} ry="3" fill="rgba(15,23,42,0.34)" />}
      {isRelief ? (
        <>
          <rect x="-12" y="2" width="10" height="5" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.2" />
          <rect x="2" y="2" width="10" height="5" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.2" />
        </>
      ) : (
        <>
          <rect x="-5" y="4" width="4" height="10" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.2" />
          <rect x="1" y="4" width="4" height="10" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.2" />
        </>
      )}
      <rect x="-7" y="-8" width="14" height="13" fill="#dc2626" stroke="#0f172a" strokeWidth="1.4" />
      {mode === 'split' && <rect x="0" y="-8" width="7" height="13" fill="#38bdf8" opacity="0.45" />}
      <g transform={`translate(-7, -6) rotate(${isPanic ? 130 + fl : isMars ? 35 : isCrush ? 110 : isRelief ? 28 : 0})`}>
        <rect x="-2.5" y="0" width="4.5" height="8" fill="#dc2626" stroke="#0f172a" strokeWidth="1.2" />
        <rect x="-2.5" y="7" width="4.5" height="3.5" fill={mode === 'split' ? '#fb7185' : skin} stroke="#0f172a" strokeWidth="1" />
      </g>
      <g transform={`translate(7, -6) rotate(${isPanic ? -130 - fl : isMars ? -35 : isCrush ? -110 : isRelief ? -28 : 0})`}>
        <rect x="-2" y="0" width="4.5" height="8" fill="#dc2626" stroke="#0f172a" strokeWidth="1.2" />
        <rect x="-2" y="7" width="4.5" height="3.5" fill={mode === 'split' ? '#7dd3fc' : skin} stroke="#0f172a" strokeWidth="1" />
      </g>
      {mode === 'split' ? (
        <>
          <rect x="-6" y="-19" width="6" height="11" fill="#fb7185" stroke="#0f172a" strokeWidth="1.3" />
          <rect x="0" y="-19" width="6" height="11" fill="#7dd3fc" stroke="#0f172a" strokeWidth="1.3" />
        </>
      ) : (
        <rect x="-6" y="-19" width="12" height="11" fill={skin} stroke="#0f172a" strokeWidth="1.4" />
      )}
      <rect x="-6" y="-21" width="12" height="4" fill="#29150b" />
      {blink ? (
        <><rect x="-3.5" y="-14" width="3" height="1.2" fill="#0f172a" /><rect x="1.5" y="-14" width="3" height="1.2" fill="#0f172a" /></>
      ) : (
        <><rect x="-3" y="-15" width="2" height="2" fill="#0f172a" /><rect x="2" y="-15" width="2" height="2" fill="#0f172a" /></>
      )}
      {isMars ? (
        <><rect x="-5.5" y="-12.5" width="3.5" height="3" fill="#f472b6" /><rect x="2" y="-12.5" width="3.5" height="3" fill="#f472b6" /><rect x="-1.5" y="-11" width="3" height="1.4" fill="#0f172a" /></>
      ) : (isPanic || isCrush) ? (
        <rect x="-2" y="-11.5" width="4" height="2.6" fill="#7f1d1d" />
      ) : null}
    </g>
  );
};
const PlanetStageBg: React.FC<{ stage: string; frame: number; localF: number }> = ({ stage, frame, localF }) => {
  if (stage === 'earth' || stage === 'back') {
    return (
      <g>
        <rect width="270" height="190" fill="#0284c7" /><rect y="95" width="270" height="95" fill="#38bdf8" />
        <rect x="218" y="22" width="24" height="24" fill="#fde047" stroke="#f59e0b" strokeWidth="2" />
        <rect x={(20 + frame * 0.16) % 290 - 20} y="28" width="44" height="12" fill="#f0f9ff" />
        <rect x={(140 + frame * 0.12) % 290 - 20} y="46" width="52" height="13" fill="#e0f2fe" />
        <polygon points="0,205 0,175 62,160 138,180 212,162 270,178 270,205" fill="#15803d" />
        <rect y="198" width="270" height="132" fill="#22c55e" /><rect y="196" width="270" height="6" fill="#4ade80" />
        <ellipse cx="44" cy="242" rx="18" ry="4" fill="rgba(15,23,42,0.25)" />
        <rect x="40" y="206" width="8" height="36" fill="#78350f" stroke="#0f172a" strokeWidth="1.4" />
        <rect x="26" y="176" width="36" height="32" fill="#16a34a" stroke="#0f172a" strokeWidth="1.6" />
        <ellipse cx="228" cy="244" rx="16" ry="4" fill="rgba(15,23,42,0.25)" />
        <rect x="224" y="212" width="8" height="32" fill="#78350f" stroke="#0f172a" strokeWidth="1.4" />
        <rect x="212" y="184" width="32" height="30" fill="#15803d" stroke="#0f172a" strokeWidth="1.6" />
      </g>
    );
  }
  if (stage === 'mercury') {
    return (
      <g>
        <rect x="0" y="0" width="135" height="200" fill="#7c2d12" />
        <rect x="0" y="90" width="135" height="110" fill="#ea580c" />
        <circle cx="44" cy="82" r="46" fill="#fde047" stroke="#f97316" strokeWidth="4" />
        <rect x="135" y="0" width="135" height="200" fill="#020617" />
        {[[154,28],[192,56],[228,32],[246,84],[170,98],[214,124]].map(([sx,sy],i)=><rect key={i} x={sx} y={sy} width="3" height="3" fill="#e0f2fe" />)}
        <rect x="0" y="200" width="135" height="130" fill="#b91c1c" /><rect x="0" y="198" width="135" height="6" fill="#fb923c" />
        <rect x="135" y="200" width="135" height="130" fill="#1e3a8a" /><rect x="135" y="198" width="135" height="6" fill="#7dd3fc" />
        <rect x="18" y="246" width="28" height="9" fill="#7f1d1d" /><rect x="182" y="248" width="32" height="10" fill="#0f172a" />
        <line x1="135" y1="0" x2="135" y2="330" stroke="#fef08a" strokeWidth="2" strokeDasharray="5 5" opacity="0.55" />
      </g>
    );
  }
  if (stage === 'venus') {
    return (
      <g>
        <rect width="270" height="205" fill="url(#venusSky)" />
        <rect x={(frame * 0.6) % 300 - 40} y="42" width="76" height="18" fill="#ca8a04" opacity="0.7" />
        <rect x={220 - ((frame * 0.5) % 280)} y="86" width="84" height="20" fill="#a16207" opacity="0.65" />
        <rect y="200" width="270" height="130" fill="#713f12" /><rect y="198" width="270" height="6" fill="#ca8a04" />
        {[0,1,2,3,4,5,6,7].map((i) => <rect key={i} x={(i * 38 + frame * 2) % 270} y={(frame * 11 + i * 43) % 310} width="2.5" height="12" fill="#bef264" opacity="0.82" />)}
        {/* Panah Tekanan Udara 92x Bumi Menekan ke Bawah */}
        {[106, 135, 164].map((px, i) => (
          <polygon key={i} points={`${px-6},${170 + (frame % 16)} ${px+6},${170 + (frame % 16)} ${px},${180 + (frame % 16)}`} fill="#ef4444" stroke="#0f172a" strokeWidth="1.2" />
        ))}
      </g>
    );
  }
  if (stage === 'mars') {
    return (
      <g>
        <rect width="270" height="200" fill="url(#marsSky)" />
        <rect x="206" y="40" width="14" height="14" fill="#fef3c7" opacity="0.85" />
        <polygon points="0,202 0,164 46,164 60,182 118,182 134,158 186,158 202,184 270,174 270,202" fill="#9a3412" />
        <rect y="200" width="270" height="130" fill="#c2410c" /><rect y="198" width="270" height="6" fill="#fb923c" />
        <ellipse cx="64" cy="264" rx="22" ry="6" fill="#7c2d12" /><ellipse cx="212" cy="248" rx="18" ry="5" fill="#7c2d12" />
        {[0,1,2,3,4].map((i) => <rect key={i} x={((frame * 7 + i * 68) % 310) - 40} y={136 + i * 36} width="38" height="2.5" fill="#fed7aa" opacity="0.45" />)}
      </g>
    );
  }
  /* Jupiter: Awan Gas Oranye Bergulung Naik + Badai Petir Tanpa Daratan! */
  const sc = (localF * 6) % 110;
  return (
    <g>
      <rect width="270" height="330" fill="#9a3412" />
      {[-1, 0, 1, 2, 3, 4].map((b) => (
        <g key={b} transform={`translate(0, ${b * 110 - sc})`}>
          <rect width="270" height="28" fill="#ea580c" /><rect y="28" width="270" height="22" fill="#fdba74" />
          <rect y="50" width="270" height="32" fill="#c2410c" /><rect y="82" width="270" height="28" fill="#7c2d12" />
          <ellipse cx="196" cy="66" rx="34" ry="13" fill="#dc2626" opacity="0.8" />
        </g>
      ))}
      {[28, 76, 198, 242].map((lx, i) => <rect key={i} x={lx} y={330 - ((frame * 16 + i * 85) % 350)} width="2.5" height="28" fill="#fef08a" opacity="0.55" />)}
      {frame % 18 < 4 && <polygon points="188,0 202,0 184,96 206,96 172,210 184,116 164,116" fill="#fef08a" stroke="#ffffff" strokeWidth="1.5" />}
    </g>
  );
};
export const PlanetSurvival: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sec = frame / fps;
  const { tPortal, tMerc, tVenus, tMars, tJup, tBack, tCutStart, tCutEnd, cliffFrame } = PS_TIMING;

  const stage = frame < tMerc ? 'earth' : frame < tVenus ? 'mercury' : frame < tMars ? 'venus' : frame < tJup ? 'mars' : frame < tBack ? 'jupiter' : 'back';
  const localF = stage === 'mercury' ? frame - tMerc : stage === 'venus' ? frame - tVenus : stage === 'mars' ? frame - tMars : stage === 'jupiter' ? frame - tJup : frame;

  const showCut = frame >= tCutStart && frame <= tCutEnd;
  const cutPop = showCut ? spring({ frame: frame - tCutStart, fps, config: { damping: 12 } }) : 0;
  const showCliff = frame >= cliffFrame;
  const cliffIn = showCliff ? spring({ frame: frame - cliffFrame, fps, config: { damping: 10 } }) : 0;
  const activeIdx = WORD_SUBS_PS.findIndex((x) => sec >= x.s && sec < x.e);
  const activeWord = activeIdx >= 0 ? WORD_SUBS_PS[activeIdx] : null;
  const wordPop = activeWord ? spring({ frame: Math.max(0, frame - Math.floor(activeWord.s * fps)), fps, config: { damping: 11, stiffness: 280, mass: 0.5 } }) : 0;

  const meta: Record<string, { name: string; time: string; temp: string; border: string; col: string }> = {
    earth:   { name: 'BUMI',      time: '~80 TAHUN', temp: '+25°C',          border: '#4ade80', col: '#4ade80' },
    mercury: { name: 'MERKURIUS', time: '~2 DETIK',  temp: '+400° / -180°C', border: '#fb923c', col: '#fde047' },
    venus:   { name: 'VENUS',     time: '< 1 DETIK', temp: '+465°C | 92x',   border: '#eab308', col: '#f87171' },
    mars:    { name: 'MARS',      time: '~2 MENIT',  temp: '-60°C | NO O2',  border: '#f97316', col: '#38bdf8' },
    jupiter: { name: 'JUPITER',   time: '< 1 DETIK', temp: 'BADAI RAKSASA',  border: '#ef4444', col: '#f87171' },
    back:    { name: 'BUMI',      time: 'SELAMAT!',  temp: '+25°C',          border: '#4ade80', col: '#4ade80' },
  };
  const cur = meta[stage];
  const shake = stage === 'venus' || stage === 'jupiter' ? Math.sin(frame * 2.4) * 3.5 : 0;
  const crushT = stage === 'venus' ? interpolate(localF, [10, 52], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const blueT = stage === 'mars' ? interpolate(localF, [18, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const udinMode: UdinMode = stage === 'earth' ? 'normal' : stage === 'mercury' ? 'split' : stage === 'venus' ? 'crush' : stage === 'mars' ? 'mars' : stage === 'jupiter' ? 'fall' : 'relief';
  const udinY = stage === 'jupiter' ? 145 + Math.sin(frame * 0.22) * 18 : 244;
  const isPortal = (frame >= tPortal && frame < tMerc + 10) || Math.abs(frame - tVenus) < 10 || Math.abs(frame - tMars) < 10 || Math.abs(frame - tJup) < 10 || Math.abs(frame - tBack) < 10;

  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a', overflow: 'hidden', transform: `translate(${shake}px, ${-shake * 0.5}px)` }}>
      <Audio src={staticFile('vo_planet_surv.mp3')} volume={1} />
      <Audio src={staticFile('bgm_planet_surv.wav')} volume={0.21} />
      {[tPortal, tVenus - 8, tMars - 8, tJup - 8, tBack - 8].map((pf) => <Sequence key={`p-${pf}`} from={Math.max(0, pf)} durationInFrames={20}><Audio src={staticFile('sfx_ps_portal.wav')} volume={0.26} /></Sequence>)}
      <Sequence from={tMerc + 8} durationInFrames={28}><Audio src={staticFile('sfx_ps_sizzle.wav')} volume={0.34} /></Sequence>
      <Sequence from={tVenus + 8} durationInFrames={30}><Audio src={staticFile('sfx_ps_crush.wav')} volume={0.38} /></Sequence>
      <Sequence from={tMars + 6} durationInFrames={36}><Audio src={staticFile('sfx_ps_wind.wav')} volume={0.32} /></Sequence>
      <Sequence from={tJup + 6} durationInFrames={36}><Audio src={staticFile('sfx_ps_storm.wav')} volume={0.38} /></Sequence>
      <Sequence from={tCutStart} durationInFrames={30}><Audio src={whoosh} volume={0.36} /></Sequence>
      <Sequence from={tCutEnd - 4} durationInFrames={30}><Audio src={whoosh} volume={0.32} /></Sequence>
      <Sequence from={cliffFrame} durationInFrames={50}><Audio src={ding} volume={0.45} /></Sequence>
      <AbsoluteFill style={{ backgroundImage: 'radial-gradient(#38bdf8 3px, transparent 3px)', backgroundSize: '44px 44px', opacity: 0.2 }} />

      <div style={{ position: 'absolute', top: 210, left: 60, right: 60, height: 1180, border: `8px solid ${cur.border}`, borderRadius: 28, overflow: 'hidden', boxShadow: '0 22px 54px rgba(0,0,0,0.85)', zIndex: 15 }}>
        <svg width="100%" height="100%" viewBox="0 0 270 330" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges">
          <defs>
            <linearGradient id="venusSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#854d0e" /><stop offset="55%" stopColor="#ca8a04" /><stop offset="100%" stopColor="#eab308" /></linearGradient>
            <linearGradient id="marsSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#431407" /><stop offset="55%" stopColor="#9a3412" /><stop offset="100%" stopColor="#ea580c" /></linearGradient>
          </defs>
          <PlanetStageBg stage={stage} frame={frame} localF={localF} />
          {isPortal && (
            <g transform={`translate(135, ${udinY - 4}) scale(${0.8 + Math.sin(frame * 0.6) * 0.16})`}>
              <ellipse cx="0" cy="0" rx="22" ry="30" fill="#a855f7" stroke="#0f172a" strokeWidth="2" opacity="0.88" />
              <ellipse cx="0" cy="0" rx="12" ry="18" fill="#e879f9" />
              <ellipse cx="0" cy="0" rx="5" ry="9" fill="#ffffff" />
            </g>
          )}
          <Udin2D x={135} y={udinY} mode={udinMode} frame={frame} crushT={crushT} blueT={blueT} />
        </svg>

        {stage !== 'earth' && stage !== 'back' && !showCut && (
          <div style={{ position: 'absolute', top: 28, left: '50%', transform: `translateX(-50%) scale(${1 + Math.sin(frame * 0.4) * 0.04})`, textAlign: 'center', zIndex: 30, width: '90%' }}>
            <div style={{ fontFamily, fontSize: 42, color: cur.col, textShadow: '6px 6px 0 #0f172a, -3px -3px 0 #0f172a, 3px -3px 0 #0f172a, -3px 3px 0 #0f172a' }}>{cur.time}</div>
            <div style={{ display: 'inline-block', marginTop: 12, padding: '8px 16px', borderRadius: 12, backgroundColor: 'rgba(15,23,42,0.88)', border: `3px solid ${cur.border}`, fontFamily, fontSize: 15, color: '#ffffff' }}>{cur.temp}</div>
          </div>
        )}
      </div>

      {showCut && <AbsoluteFill style={{ backgroundColor: 'rgba(15, 23, 42, 0.58)', opacity: cutPop, zIndex: 35 }} />}
      {showCut && <AbsoluteFill style={{ transform: `scale(${0.86 + cutPop * 0.14})`, opacity: cutPop, zIndex: 38 }}><CloseUpUdinPlanet frame={frame} localFrame={frame - tCutStart} /></AbsoluteFill>}

      <div style={{ position: 'absolute', top: 82, left: '50%', transform: 'translateX(-50%)', padding: '6px 18px', borderRadius: 20, backgroundColor: 'rgba(15, 23, 42, 0.85)', border: '2px solid rgba(250, 204, 21, 0.65)', fontFamily: 'sans-serif', fontSize: 22, fontWeight: 'bold', color: '#f8fafc', zIndex: 45 }}>@dysesat</div>
      <div style={{ position: 'absolute', top: 138, left: 65, right: 65, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 45 }}>
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.94)', border: `3px solid ${cur.border}`, borderRadius: 14, padding: '10px 16px', fontFamily, fontSize: 14, color: '#ffffff' }}>PLANET: <span style={{ color: cur.col }}>{cur.name}</span></div>
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.94)', border: `3px solid ${cur.border}`, borderRadius: 14, padding: '10px 16px', fontFamily, fontSize: 14, color: cur.col }}>{cur.time}</div>
      </div>

      {activeWord && !showCliff && (
        <div style={{ position: 'absolute', top: 1435, left: 70, right: 70, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 55, pointerEvents: 'none' }}>
          <div style={{ fontFamily, fontSize: activeWord.w.length > 10 ? 32 : 40, color: getWordColor(activeWord.w), textAlign: 'center', padding: '12px 24px', borderRadius: 16, backgroundColor: 'rgba(15, 23, 42, 0.84)', border: `3px solid ${getWordColor(activeWord.w)}`, textShadow: '4px 4px 0 #0f172a, -3px -3px 0 #0f172a, 3px -3px 0 #0f172a, -3px 3px 0 #0f172a', transform: `scale(${0.65 + wordPop * 0.35}) rotate(${activeIdx % 2 === 0 ? -2 : 2}deg)` }}>{activeWord.w.toUpperCase()}</div>
        </div>
      )}

      {showCliff && (
        <div style={{ position: 'absolute', top: 1435, left: 65, right: 65, backgroundColor: 'rgba(15, 23, 42, 0.96)', border: '4px solid #facc15', borderRadius: 16, padding: '16px 20px', textAlign: 'center', fontFamily, fontSize: 16, lineHeight: 1.5, color: '#facc15', boxShadow: '0 10px 28px rgba(0,0,0,0.65)', transform: `scale(${cliffIn * (1 + Math.sin(frame * 0.22) * 0.025)})`, zIndex: 55 }}>
          WAJIB PINDAH PLANET, PILIH MANA?<br /><span style={{ color: '#38bdf8', fontSize: 15 }}>TULIS DI KOMENTAR!</span>
        </div>
      )}
    </AbsoluteFill>
  );
};
