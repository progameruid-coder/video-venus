import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PressStart2P';
import { whoosh, whip, ding, mouseClick } from '@remotion/sfx';

const { fontFamily } = loadFont();

const STARS = Array.from({ length: 36 }, (_, i) => ({
  x: random(`nsx-${i}`) * 94 + 3,
  y: random(`nsy-${i}`) * 94 + 3,
  size: Math.floor(random(`nss-${i}`) * 14) + 10,
  speed: Math.floor(random(`nsp-${i}`) * 8) + 8,
}));

const DIAMONDS = Array.from({ length: 26 }, (_, i) => ({
  x: random(`dx-${i}`) * 90 + 5,
  delay: random(`dd-${i}`) * 90,
  speed: random(`ds-${i}`) * 6 + 10,
  size: Math.floor(random(`dz-${i}`) * 16) + 22,
}));

const NeptuneChar: React.FC<{ size?: number; umbrella?: boolean; blink?: boolean }> = ({ size = 340, umbrella = false, blink = false }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%',
    background: 'radial-gradient(circle at 30% 30%, #72efdd, #3a86ff 55%, #1d3557 100%)',
    boxShadow: '0 0 65px rgba(58, 134, 255, 0.55), inset -22px -22px 45px rgba(0,0,0,0.4)',
    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
    position: 'relative', overflow: 'visible',
  }}>
    <div style={{ position: 'absolute', top: '24%', width: '76%', height: 12, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.16)' }} />
    <div style={{ position: 'absolute', bottom: '22%', width: '68%', height: 10, borderRadius: 10, backgroundColor: 'rgba(11,19,43,0.25)' }} />
    {umbrella && (
      <div style={{ position: 'absolute', top: -size * 0.32, right: -size * 0.14, transform: 'rotate(18deg)' }}>
        <div style={{ width: size * 0.56, height: size * 0.28, borderRadius: '140px 140px 0 0', backgroundColor: 'rgba(160, 231, 229, 0.55)', border: '4px solid #E0FBFC' }} />
        <div style={{ width: 6, height: size * 0.36, backgroundColor: '#E0FBFC', margin: '0 auto' }} />
      </div>
    )}
    <div style={{ display: 'flex', gap: size * 0.18, marginTop: 12 }}>
      {[0, 1].map((i) => (
        <div key={i} style={{ width: size * 0.11, height: blink ? 6 : size * 0.11, backgroundColor: '#0b132b', borderRadius: '50%' }} />
      ))}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.08, marginTop: 10 }}>
      <div style={{ width: size * 0.08, height: size * 0.04, backgroundColor: '#ff758f', borderRadius: '50%', opacity: 0.85 }} />
      <div style={{ width: size * 0.1, height: size * 0.05, borderBottom: '5px solid #0b132b', borderRadius: '0 0 20px 20px' }} />
      <div style={{ width: size * 0.08, height: size * 0.04, backgroundColor: '#ff758f', borderRadius: '50%', opacity: 0.85 }} />
    </div>
  </div>
);
const SUBS = [
  { s: 0, e: 185, t: 'Di Neptunus, hujannya bukan air, tapi berlian sungguhan!' },
  { s: 185, e: 400, t: 'Atmosfer Neptunus penuh gas metana (CH4) yang kaya karbon.' },
  { s: 400, e: 660, t: 'Badai petir & tekanan ekstrem memadatkan karbon jadi berlian!' },
  { s: 660, e: 830, t: 'Kristal berlian murni pun jatuh turun seperti hujan deras!' },
  { s: 830, e: 1010, t: 'Jadi di Neptunus, wajib pakai payung baja kalau keluar rumah!' },
  { s: 1010, e: 1110, t: 'Unik banget, kan? Follow @dysesat untuk fakta lainnya!' },
];

export const NeptuneFactVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const floatY = Math.sin(frame / 14) * 14;
  const isBlinking = (frame % 95) > 88;
  const camZoom = interpolate(frame, [0, 1110], [1, 1.08]);
  const diamondPulse = 1 + Math.sin(frame / 8) * 0.12;
  const lightningFlash = (frame >= 415 && frame <= 425) || (frame >= 445 && frame <= 452) ? 0.28 : 0;

  const s1 = interpolate(frame, [175, 195], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const s2 = interpolate(frame, [185, 205, 815, 835], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const s3 = interpolate(frame, [825, 845], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const hookIn = spring({ frame: frame - 8, fps, config: { damping: 11 } });
  const c1 = spring({ frame: frame - 210, fps, config: { damping: 11 } });
  const c2 = spring({ frame: frame - 410, fps, config: { damping: 11 } });
  const outroIn = spring({ frame: frame - 835, fps, config: { damping: 10 } });
  const activeSub = SUBS.find((x) => frame >= x.s && frame < x.e);
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 35%, #1d2d50 0%, #070913 100%)', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
      <Audio src={staticFile('vo_neptunus.mp3')} volume={1} />
      <Audio src={staticFile('bgm.wav')} volume={0.18} />
      <Sequence from={5} durationInFrames={45}><Audio src={whoosh} volume={0.35} /></Sequence>
      <Sequence from={185} durationInFrames={45}><Audio src={whip} volume={0.35} /></Sequence>
      <Sequence from={210} durationInFrames={30}><Audio src={mouseClick} volume={0.45} /></Sequence>
      <Sequence from={410} durationInFrames={30}><Audio src={mouseClick} volume={0.45} /></Sequence>
      <Sequence from={830} durationInFrames={60}><Audio src={ding} volume={0.5} /></Sequence>

      <AbsoluteFill style={{ backgroundColor: '#72efdd', opacity: lightningFlash }} />

      <AbsoluteFill style={{ transform: `scale(${camZoom})` }}>
        {STARS.map((st, idx) => (
          <div key={idx} style={{ position: 'absolute', left: `${st.x}%`, top: `${st.y}%`, fontSize: st.size, color: idx % 2 === 0 ? '#72efdd' : '#FFF', opacity: 0.3 + 0.7 * Math.abs(Math.sin(frame / st.speed + idx)) }}>✦</div>
        ))}
      </AbsoluteFill>

      {DIAMONDS.map((dm, i) => {
        const dropY = ((frame + dm.delay * 10) * dm.speed) % 1920;
        return (
          <div key={i} style={{ position: 'absolute', left: `${dm.x}%`, top: dropY, fontSize: dm.size, opacity: s1 + s3 * 0.95, transform: `rotate(${frame * 3}deg)` }}>💎</div>
        );
      })}

      <div style={{ position: 'absolute', top: 95, padding: '8px 22px', borderRadius: 30, backgroundColor: 'rgba(0,0,0,0.45)', border: '1px solid rgba(114, 239, 221, 0.45)', fontFamily: 'sans-serif', fontSize: 24, fontWeight: 'bold', color: 'rgba(255,255,255,0.75)', letterSpacing: 1 }}>
        @dysesat
      </div>

      <AbsoluteFill style={{ opacity: s1, justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ transform: `translateY(${floatY}px) scale(${hookIn})`, marginBottom: 270 }}>
          <NeptuneChar size={360} umbrella blink={isBlinking} />
        </div>
        <div style={{ position: 'absolute', bottom: 320, padding: '0 45px', textAlign: 'center', fontFamily, lineHeight: 1.65, transform: `scale(${hookIn})` }}>
          <div style={{ fontSize: 34, color: '#FFE600' }}>TAHUKAH KAMU?</div>
          <div style={{ fontSize: 30, color: '#72efdd', marginTop: 18 }}>DI NEPTUNUS</div>
          <div style={{ fontSize: 30, color: '#FFF', marginTop: 14 }}>HUJANNYA <span style={{ color: '#4CC9F0' }}>BERLIAN!</span></div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: s2, justifyContent: 'center', alignItems: 'center', padding: '0 45px' }}>
        <div style={{ fontFamily, fontSize: 28, color: '#FFE600', marginBottom: 45 }}>KOK BISA BEGITU?</div>
        <div style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', border: '3px solid #4CC9F0', borderRadius: 28, padding: 28, marginBottom: 36, transform: `scale(${c1})`, display: 'flex', alignItems: 'center', gap: 28 }}>
          <div style={{ width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle, #72efdd, #3a86ff)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily, fontSize: 32, color: '#070913', flexShrink: 0 }}>CH4</div>
          <div>
            <div style={{ fontFamily, fontSize: 22, color: '#72efdd' }}>1. GAS METANA</div>
            <div style={{ fontFamily: 'sans-serif', fontSize: 28, color: '#FFF', marginTop: 10 }}>Atmosfer Neptunus kaya akan unsur karbon dari gas metana.</div>
          </div>
        </div>
        <div style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', border: '3px solid #FF9E00', borderRadius: 28, padding: 28, transform: `scale(${c2})`, display: 'flex', alignItems: 'center', gap: 28 }}>
          <div style={{ width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle, #FFE600, #FF4D4D)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 64, flexShrink: 0, transform: `scale(${diamondPulse})` }}>💎</div>
          <div>
            <div style={{ fontFamily, fontSize: 22, color: '#FF9E00' }}>2. TEKANAN EKSTREM</div>
            <div style={{ fontFamily: 'sans-serif', fontSize: 28, color: '#FFF', marginTop: 10 }}>Petir & tekanan tinggi memadatkan karbon jadi kristal berlian!</div>
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: s3, justifyContent: 'center', alignItems: 'center', padding: '0 45px' }}>
        <div style={{ transform: `translateY(${floatY}px) scale(${outroIn})`, marginBottom: 260 }}>
          <NeptuneChar size={330} umbrella blink={isBlinking} />
        </div>
        <div style={{ position: 'absolute', bottom: 310, textAlign: 'center', padding: '0 40px', transform: `scale(${outroIn})` }}>
          <div style={{ fontFamily, fontSize: 28, color: '#72efdd', lineHeight: 1.6 }}>HUJAN BERLIAN MURNI</div>
          <div style={{ fontFamily, fontSize: 24, color: '#FFF', marginTop: 16 }}>WAJIB PAYUNG BAJA!</div>
        </div>
      </AbsoluteFill>

      {activeSub && (
        <div style={{ position: 'absolute', bottom: 130, left: 45, right: 45, backgroundColor: 'rgba(0,0,0,0.75)', border: '2px solid #72efdd', borderRadius: 20, padding: '18px 24px', textAlign: 'center', fontFamily: 'sans-serif', fontSize: 32, fontWeight: 'bold', color: '#FFFFFF' }}>
          {activeSub.t}
        </div>
      )}
    </AbsoluteFill>
  );
};
