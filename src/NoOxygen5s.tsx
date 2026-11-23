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
        <rect x={taxi ? -26 : 16} y={-18 - (frame % 18)} width="9" height="7" fill="#e2e8f0" stroke="#475569" strokeWidth="1" opacity={0.85 - (frame % 18) / 22} />
        <text x="-4" y="-24" fill="#f87171" fontSize="9" fontFamily="monospace" fontWeight="bold" opacity={frame % 16 < 8 ? 1 : 0.3}>X</text>
      </g>
    )}
  </g>
);

const OxyPerson: React.FC<{ x: number; y: number; shirt: string; sunburn: boolean; holdEar: boolean; panic: boolean; frame: number; drink?: boolean }> = ({ x, y, shirt, sunburn, holdEar, panic, frame, drink = false }) => {
  const skin = sunburn ? '#f87171' : '#fed7aa';
  const bob = panic ? Math.abs(Math.sin(frame * 0.5)) * -3 : Math.sin(frame * 0.14) * 0.8;
  return (
    <g transform={`translate(${x}, ${y + bob})`}>
      <rect x="-5" y="4" width="4" height="10" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.2" />
      <rect x="1" y="4" width="4" height="10" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.2" />
      <rect x="-7" y="-8" width="14" height="13" fill={shirt} stroke="#0f172a" strokeWidth="1.4" />
      <g transform={`translate(-7, -6) rotate(${holdEar ? 148 : panic ? 120 : 0})`}>
        <rect x="-2.5" y="0" width="4.5" height="8.5" fill={shirt} stroke="#0f172a" strokeWidth="1.2" />
        <rect x="-2.5" y="7.5" width="4.5" height="3.5" fill={skin} stroke="#0f172a" strokeWidth="1" />
      </g>
      <g transform={`translate(7, -6) rotate(${holdEar && !drink ? -148 : panic && !drink ? -120 : 0})`}>
        <rect x="-2" y="0" width="4.5" height="8.5" fill={shirt} stroke="#0f172a" strokeWidth="1.2" />
        <rect x="-2" y="7.5" width="4.5" height="3.5" fill={skin} stroke="#0f172a" strokeWidth="1" />
      </g>
      {drink && <g transform="translate(11, 0)"><rect x="-2" y="-3" width="6" height="8" fill="#38bdf8" stroke="#0f172a" strokeWidth="1" /><rect x="0" y="-7" width="1.5" height="4" fill="#facc15" /></g>}
      <rect x="-6" y="-19" width="12" height="11" fill={skin} stroke="#0f172a" strokeWidth="1.4" />
      <rect x="-6" y="-21" width="12" height="4" fill="#29150b" />
      <rect x="-3" y="-15" width="2" height="2" fill="#0f172a" /><rect x="2" y="-15" width="2" height="2" fill="#0f172a" />
      {(panic || holdEar) && <rect x="-2" y="-11" width="4" height="2.2" fill="#7f1d1d" />}
      {holdEar && <text x="-16" y="-14" fill="#fde047" fontSize="9" fontFamily="monospace" fontWeight="bold" opacity={frame % 8 < 4 ? 1 : 0.3}>~</text>}
    </g>
  );
};
const ConcreteBuilding: React.FC<{ x: number; y: number; w: number; h: number; color: string; collapseT: number; frame: number }> = ({ x, y, w, h, color, collapseT, frame }) => {
  const curH = Math.max(14, h * (1 - collapseT * 0.88));
  const curY = y + (h - curH);
  const vib = collapseT > 0.02 && collapseT < 0.92 ? Math.sin(frame * 2.5) * 2.2 : 0;
  return (
    <g transform={`translate(${x + vib}, 0)`}>
      {collapseT < 0.85 ? (
        <>
          <rect x="0" y={curY} width={w} height={curH} fill={color} stroke="#0f172a" strokeWidth="2" />
          {curH > 44 && [0, 1].map((row) => (
            <g key={row}>
              <rect x={8} y={curY + 12 + row * 26} width={14} height={15} fill="#bae6fd" stroke="#0f172a" strokeWidth="1.4" />
              <rect x={w - 22} y={curY + 12 + row * 26} width={14} height={15} fill="#bae6fd" stroke="#0f172a" strokeWidth="1.4" />
            </g>
          ))}
          {collapseT > 0.05 && (
            <>
              <rect x={w * 0.35} y={curY + 8} width="3" height={curH * 0.45} fill="#0f172a" />
              <rect x={w * 0.35 + 3} y={curY + 24} width="12" height="3" fill="#0f172a" />
              <rect x={w * 0.6} y={curY + 18} width="3" height={curH * 0.35} fill="#0f172a" />
            </>
          )}
        </>
      ) : (
        <g>
          <polygon points={`-4,${y + h} ${w * 0.28},${y + h - 22} ${w * 0.65},${y + h - 16} ${w + 4},${y + h}`} fill="#64748b" stroke="#0f172a" strokeWidth="2" />
          <polygon points={`8,${y + h} ${w * 0.5},${y + h - 15} ${w - 6},${y + h}`} fill="#94a3b8" stroke="#0f172a" strokeWidth="1.4" />
        </g>
      )}
      {collapseT > 0.05 && collapseT < 0.98 && (
        <g opacity={Math.sin(collapseT * Math.PI)}>
          <rect x="-8" y={y + h - 26 - collapseT * 24} width={w + 16} height="22" fill="#cbd5e1" />
          <rect x="4" y={y + h - 38 - collapseT * 32} width={w - 8} height="16" fill="#e2e8f0" />
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
  const isHoldEar = frame >= tSec5;

  const timerLabel = frame >= tSec1 && frame < tSec2 ? '1' : frame >= tSec2 && frame < tSec3 ? '2' : frame >= tSec3 && frame < tSec4 ? '3' : frame >= tSec4 && frame < tSec5 ? '4' : frame >= tSec5 && frame < tEnd ? '5' : frame >= tEnd && frame < tEnd + 24 ? 'SELESAI!' : null;
  const shake = frame >= tSec3 && frame < tSec3 + 60 ? Math.sin(frame * 2.5) * 4.5 : 0;

  const showCut = frame >= tCutStart && frame <= tCutEnd;
  const cutPop = showCut ? spring({ frame: frame - tCutStart, fps, config: { damping: 12 } }) : 0;
  const showCliff = frame >= cliffFrame;
  const cliffIn = showCliff ? spring({ frame: frame - cliffFrame, fps, config: { damping: 10 } }) : 0;
  const activeIdx = WORD_SUBS_OXY5S.findIndex((x) => sec >= x.s && sec < x.e);
  const activeWord = activeIdx >= 0 ? WORD_SUBS_OXY5S[activeIdx] : null;
  const wordPop = activeWord ? spring({ frame: Math.max(0, frame - Math.floor(activeWord.s * fps)), fps, config: { damping: 11, stiffness: 280, mass: 0.5 } }) : 0;

  const dCar = (tSec1 + 12) - Math.min(frame, tSec1 + 12);
  const car1X = -35 + (((132 - dCar * 0.72) % 340) + 340) % 340;
  const taxiX = -35 + (((216 + dCar * 0.78) % 340) + 340) % 340;

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
      <Sequence from={tCutStart} durationInFrames={30}><Audio src={whoosh} volume={0.36} /></Sequence>
      <Sequence from={tCutEnd - 4} durationInFrames={30}><Audio src={whoosh} volume={0.32} /></Sequence>
      <Sequence from={cliffFrame} durationInFrames={50}><Audio src={ding} volume={0.45} /></Sequence>

      <AbsoluteFill style={{ backgroundImage: 'radial-gradient(#38bdf8 3px, transparent 3px)', backgroundSize: '44px 44px', opacity: 0.22 }} />

      <div style={{ position: 'absolute', top: 210, left: 60, right: 60, height: 1180, border: `8px solid ${isNoOxy ? '#ef4444' : '#38bdf8'}`, borderRadius: 28, overflow: 'hidden', boxShadow: '0 22px 54px rgba(0,0,0,0.85)', zIndex: 15 }}>
        <svg width="100%" height="100%" viewBox="0 0 270 330" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges">
          {/* Langit: Siang Cerah -> Gelap Gulita Berbintang Saat 0% O2! */}
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

          {/* Trotoar & Jalan Raya */}
          <rect y="175" width="270" height="34" fill="#cbd5e1" /><rect y="209" width="270" height="78" fill="#334155" />
          <rect y="207" width="270" height="4" fill="#94a3b8" /><rect y="287" width="270" height="43" fill="#cbd5e1" /><rect y="285" width="270" height="4" fill="#94a3b8" />
          {[14, 58, 102, 146, 190, 234].map((mx) => <rect key={mx} x={mx} y="246" width="24" height="5" fill="#fde047" />)}

          {/* 3 Gedung Beton Kota yang Retak & Ambruk Jadi Puing di Detik 3 */}
          <ConcreteBuilding x={8} y={66} w={62} h={124} color="#64748b" collapseT={collapseT} frame={frame} />
          <ConcreteBuilding x={102} y={76} w={64} h={114} color="#475569" collapseT={collapseT} frame={frame + 4} />
          <ConcreteBuilding x={198} y={62} w={64} h={128} color="#64748b" collapseT={collapseT} frame={frame + 8} />
          {/* Mobil Biru & Taksi Kuning -> Mogok Massal Saat O2 = 0% */}
          <OxyCar x={car1X} y={230} color="#2563eb" roof="#3b82f6" stalled={isStalled} frame={frame} />
          <OxyCar x={taxiX} y={264} color="#eab308" roof="#facc15" taxi stalled={isStalled} frame={frame} />

          {/* Warga & Si Udin (Jalan Santai -> Panik -> Gosong + Pegang Telinga) */}
          <OxyPerson x={86} y={196} shirt="#16a34a" sunburn={isSunburned} holdEar={isHoldEar} panic={isNoOxy} frame={frame} />
          <OxyPerson x={184} y={196} shirt="#9333ea" sunburn={isSunburned} holdEar={isHoldEar} panic={isNoOxy} frame={frame + 6} />
          <OxyPerson x={128} y={298} shirt="#dc2626" sunburn={isSunburned} holdEar={isHoldEar} panic={isNoOxy} frame={frame + 3} drink />

          {/* Sinar UV Tajam dari Langit Saat Lapisan Ozon Hilang (Detik 4-5) */}
          {isUV && [42, 108, 174, 232].map((ux, i) => (
            <g key={i} opacity={0.35 + Math.sin(frame * 0.45 + i) * 0.2}>
              <polygon points={`${ux - 14},0 ${ux + 14},0 ${ux + 34},330 ${ux - 34},330`} fill={i % 2 === 0 ? '#a855f7' : '#fde047'} />
            </g>
          ))}
        </svg>

        {timerLabel && !showCut && (
          <div style={{ position: 'absolute', top: 32, left: '50%', transform: `translateX(-50%) scale(${1 + Math.sin(frame * 0.45) * 0.06})`, textAlign: 'center', zIndex: 30 }}>
            {timerLabel !== 'SELESAI!' && <div style={{ fontFamily, fontSize: 18, color: '#ffffff', textShadow: '3px 3px 0 #0f172a', marginBottom: 8 }}>DETIK KE</div>}
            <div style={{ fontFamily, fontSize: timerLabel === 'SELESAI!' ? 64 : 108, color: timerLabel === 'SELESAI!' ? '#4ade80' : '#fde047', textShadow: '8px 8px 0 #0f172a, -4px -4px 0 #0f172a, 4px -4px 0 #0f172a, -4px 4px 0 #0f172a' }}>{timerLabel}</div>
          </div>
        )}
      </div>

      {showCut && <AbsoluteFill style={{ backgroundColor: 'rgba(15, 23, 42, 0.58)', opacity: cutPop, zIndex: 35 }} />}
      {showCut && <AbsoluteFill style={{ transform: `scale(${cutPop})`, zIndex: 38 }}><CloseUpUdinSunburn frame={frame} localFrame={frame - tCutStart} /></AbsoluteFill>}

      {/* HUD ATAS AMAN TIKTOK */}
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
