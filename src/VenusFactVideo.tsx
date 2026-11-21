import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PressStart2P';
import { whoosh, whip, ding, mouseClick } from '@remotion/sfx';

const { fontFamily } = loadFont();

const STARS = Array.from({ length: 36 }, (_, i) => ({
  x: random(`sx-${i}`) * 94 + 3,
  y: random(`sy-${i}`) * 94 + 3,
  size: Math.floor(random(`ss-${i}`) * 14) + 10,
  speed: Math.floor(random(`sp-${i}`) * 8) + 8,
}));

const CONFETTI = Array.from({ length: 24 }, (_, i) => ({
  x: random(`cx-${i}`) * 90 + 5,
  delay: random(`cd-${i}`) * 40,
  color: ['#FFE600', '#FF4D4D', '#4CC9F0', '#A0E7E5', '#FF9E00'][i % 5],
}));

const VenusChar: React.FC<{ size?: number; spin?: number; party?: boolean; blink?: boolean }> = ({ size = 340, spin = 0, party = false, blink = false }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%',
    background: 'radial-gradient(circle at 30% 30%, #ffd280, #f48c42 60%, #c84b31 100%)',
    boxShadow: '0 0 65px rgba(244, 140, 66, 0.55), inset -22px -22px 45px rgba(0,0,0,0.35)',
    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
    position: 'relative', transform: `rotate(${spin}deg)`,
  }}>
    {party && (
      <div style={{
        position: 'absolute', top: -size * 0.24, width: 0, height: 0,
        borderLeft: `${size * 0.14}px solid transparent`,
        borderRight: `${size * 0.14}px solid transparent`,
        borderBottom: `${size * 0.28}px solid #FFE600`,
      }} />
    )}
    <div style={{ display: 'flex', gap: size * 0.18, marginTop: 12 }}>
      {[0, 1].map((i) => (
        <div key={i} style={{ width: size * 0.11, height: blink ? 6 : size * 0.11, backgroundColor: '#2d140d', borderRadius: '50%' }} />
      ))}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.08, marginTop: 10 }}>
      <div style={{ width: size * 0.08, height: size * 0.04, backgroundColor: '#ff7b54', borderRadius: '50%', opacity: 0.8 }} />
      <div style={{ width: size * 0.1, height: size * 0.05, borderBottom: '5px solid #2d140d', borderRadius: '0 0 20px 20px' }} />
      <div style={{ width: size * 0.08, height: size * 0.04, backgroundColor: '#ff7b54', borderRadius: '50%', opacity: 0.8 }} />
    </div>
  </div>
);
const SUBS = [
  { s: 0, e: 175, t: 'Satu hari di Venus lebih lama dari 1 tahunnya!' },
  { s: 175, e: 270, t: 'Kok bisa? Begini penjelasannya...' },
  { s: 270, e: 575, t: 'Rotasi Venus super lambat: 243 hari Bumi!' },
  { s: 575, e: 825, t: 'Sedangkan kelilingi Matahari cuma 225 hari!' },
  { s: 825, e: 1110, t: 'Jadi Venus tahun baru duluan sebelum 1 hari selesai!' },
];

export const VenusFactVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const floatY = Math.sin(frame / 14) * 14;
  const isBlinking = (frame % 95) > 88;
  const camZoom = interpolate(frame, [0, 1110], [1, 1.08]);

  const s1 = interpolate(frame, [175, 195], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const s2 = interpolate(frame, [185, 205, 815, 835], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const s3 = interpolate(frame, [825, 845], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const hookIn = spring({ frame: frame - 8, fps, config: { damping: 11 } });
  const c1 = spring({ frame: frame - 270, fps, config: { damping: 11 } });
  const c2 = spring({ frame: frame - 575, fps, config: { damping: 11 } });
  const outroIn = spring({ frame: frame - 835, fps, config: { damping: 10 } });

  const slowSpin = interpolate(frame, [270, 825], [0, 130], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const orbit = interpolate(frame, [575, 825], [0, Math.PI * 2.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const meteorX = interpolate(frame % 240, [0, 60], [-150, 1250], { extrapolateRight: 'clamp' });
  const activeSub = SUBS.find((x) => frame >= x.s && frame < x.e);
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 35%, #2b3a55 0%, #0b0d17 100%)', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
      <Audio src={staticFile('vo.mp3')} volume={1} />
      <Audio src={staticFile('bgm.wav')} volume={0.18} />
      <Sequence from={5} durationInFrames={45}><Audio src={whoosh} volume={0.35} /></Sequence>
      <Sequence from={185} durationInFrames={45}><Audio src={whip} volume={0.35} /></Sequence>
      <Sequence from={270} durationInFrames={30}><Audio src={mouseClick} volume={0.45} /></Sequence>
      <Sequence from={575} durationInFrames={30}><Audio src={mouseClick} volume={0.45} /></Sequence>
      <Sequence from={830} durationInFrames={60}><Audio src={ding} volume={0.5} /></Sequence>

      <AbsoluteFill style={{ transform: `scale(${camZoom})` }}>
        {STARS.map((st, idx) => (
          <div key={idx} style={{ position: 'absolute', left: `${st.x}%`, top: `${st.y}%`, fontSize: st.size, color: idx % 2 === 0 ? '#FFD700' : '#A0E7E5', opacity: 0.3 + 0.7 * Math.abs(Math.sin(frame / st.speed + idx)) }}>✦</div>
        ))}
        <div style={{ position: 'absolute', top: '16%', left: meteorX, width: 110, height: 3, background: 'linear-gradient(90deg, transparent, #FFF)', transform: 'rotate(20deg)', opacity: 0.65 }} />
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: s1, justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ transform: `translateY(${floatY}px) scale(${hookIn})`, marginBottom: 270 }}>
          <VenusChar size={380} blink={isBlinking} />
        </div>
        <div style={{ position: 'absolute', bottom: 320, padding: '0 45px', textAlign: 'center', fontFamily, lineHeight: 1.65, transform: `scale(${hookIn})` }}>
          <div style={{ fontSize: 34, color: '#FFE600' }}>TAHUKAH KAMU?</div>
          <div style={{ fontSize: 30, color: '#FF9E00', marginTop: 18 }}>1 HARI DI VENUS</div>
          <div style={{ fontSize: 30, color: '#FFF', marginTop: 14 }}>LEBIH LAMA DARI <span style={{ color: '#FF4D4D' }}>1 TAHUNNYA!</span></div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: s2, justifyContent: 'center', alignItems: 'center', padding: '0 45px' }}>
        <div style={{ fontFamily, fontSize: 28, color: '#FFE600', marginBottom: 45 }}>KOK BISA BEGITU?</div>
        <div style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', border: '3px solid #FF9E00', borderRadius: 28, padding: 28, marginBottom: 36, transform: `scale(${c1})`, display: 'flex', alignItems: 'center', gap: 28 }}>
          <VenusChar size={150} spin={slowSpin} />
          <div>
            <div style={{ fontFamily, fontSize: 22, color: '#FF9E00' }}>1 HARI (ROTASI)</div>
            <div style={{ fontFamily: 'sans-serif', fontSize: 28, color: '#FFF', marginTop: 10 }}>Berputar sangat lambat:</div>
            <div style={{ fontFamily, fontSize: 24, color: '#FF4D4D', marginTop: 12 }}>243 HARI BUMI</div>
          </div>
        </div>
        <div style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', border: '3px solid #4CC9F0', borderRadius: 28, padding: 28, transform: `scale(${c2})`, display: 'flex', alignItems: 'center', gap: 28 }}>
          <div style={{ width: 150, height: 150, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ width: 130, height: 130, borderRadius: '50%', border: '2px dashed #4CC9F0', position: 'absolute' }} />
            <div style={{ width: 50, height: 50, borderRadius: '50%', backgroundColor: '#FF9E00', boxShadow: '0 0 20px #FF9E00' }} />
            <div style={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: '#f48c42', position: 'absolute', transform: `translate(${Math.cos(orbit) * 65}px, ${Math.sin(orbit) * 65}px)` }} />
          </div>
          <div>
            <div style={{ fontFamily, fontSize: 22, color: '#4CC9F0' }}>1 TAHUN (ORBIT)</div>
            <div style={{ fontFamily: 'sans-serif', fontSize: 28, color: '#FFF', marginTop: 10 }}>Mengelilingi Matahari:</div>
            <div style={{ fontFamily, fontSize: 24, color: '#A0E7E5', marginTop: 12 }}>225 HARI BUMI</div>
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: s3, justifyContent: 'center', alignItems: 'center', padding: '0 45px' }}>
        {CONFETTI.map((cf, i) => {
          const dropY = ((Math.max(0, frame - 830 - cf.delay) * 9) % 1920);
          return <div key={i} style={{ position: 'absolute', left: `${cf.x}%`, top: dropY, width: 16, height: 16, backgroundColor: cf.color, borderRadius: 4, transform: `rotate(${frame * 5}deg)` }} />;
        })}
        <div style={{ transform: `translateY(${floatY}px) scale(${outroIn})`, marginBottom: 260 }}>
          <VenusChar size={330} party blink={isBlinking} />
        </div>
        <div style={{ position: 'absolute', bottom: 310, textAlign: 'center', padding: '0 40px', transform: `scale(${outroIn})` }}>
          <div style={{ fontFamily, fontSize: 28, color: '#FFE600', lineHeight: 1.6 }}>TAHUN BARU DULUAN</div>
          <div style={{ fontFamily, fontSize: 24, color: '#FFF', marginTop: 16 }}>SEBELUM 1 HARI SELESAI!</div>
        </div>
      </AbsoluteFill>

      {activeSub && (
        <div style={{ position: 'absolute', bottom: 130, left: 45, right: 45, backgroundColor: 'rgba(0,0,0,0.75)', border: '2px solid #FFE600', borderRadius: 20, padding: '18px 24px', textAlign: 'center', fontFamily: 'sans-serif', fontSize: 32, fontWeight: 'bold', color: '#FFFFFF' }}>
          {activeSub.t}
        </div>
      )}
    </AbsoluteFill>
  );
};
