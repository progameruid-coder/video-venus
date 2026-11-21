import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PressStart2P';
import { whoosh, whip, ding, mouseClick } from '@remotion/sfx';

const { fontFamily } = loadFont();

const STARS = Array.from({ length: 34 }, (_, i) => ({
  x: random(`gsx-${i}`) * 94 + 3,
  y: random(`gsy-${i}`) * 94 + 3,
  size: Math.floor(random(`gss-${i}`) * 14) + 10,
  speed: Math.floor(random(`gsp-${i}`) * 8) + 8,
}));

const DIMPLE_POS = [
  [-55, -55], [0, -65], [55, -55],
  [-70, 0], [70, 0],
  [-55, 55], [0, 65], [55, 55],
];

const GolfBallChar: React.FC<{
  size?: number; dimpled?: boolean; blink?: boolean; shocked?: boolean; tilt?: number; squash?: number;
}> = ({ size = 260, dimpled = true, blink = false, shocked = false, tilt = 0, squash = 1 }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%',
    background: dimpled
      ? 'radial-gradient(circle at 30% 30%, #ffffff, #e2e8f0 60%, #94a3b8 100%)'
      : 'radial-gradient(circle at 30% 30%, #f8fafc, #cbd5e1 65%, #64748b 100%)',
    boxShadow: dimpled
      ? '0 0 55px rgba(76, 201, 240, 0.45), inset -18px -18px 36px rgba(0,0,0,0.3)'
      : '0 0 40px rgba(255, 77, 77, 0.35), inset -18px -18px 36px rgba(0,0,0,0.35)',
    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
    position: 'relative', transform: `rotate(${tilt}deg) scale(${2 - squash}, ${squash})`,
  }}>
    {dimpled && DIMPLE_POS.map(([dx, dy], idx) => (
      <div key={idx} style={{
        position: 'absolute',
        width: size * 0.085, height: size * 0.085, borderRadius: '50%',
        backgroundColor: 'rgba(100, 116, 139, 0.28)',
        boxShadow: 'inset 2px 2px 3px rgba(0,0,0,0.2)',
        transform: `translate(${(dx / 100) * size * 0.55}px, ${(dy / 100) * size * 0.55}px)`,
      }} />
    ))}
    <div style={{ display: 'flex', gap: size * 0.18, marginTop: 8, zIndex: 2 }}>
      {[0, 1].map((i) => (
        <div key={i} style={{
          width: size * 0.11, height: blink ? 6 : size * 0.11,
          backgroundColor: blink ? 'transparent' : '#0f172a',
          borderTop: blink ? '5px solid #0f172a' : 'none',
          borderRadius: '50%',
        }} />
      ))}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.07, marginTop: 8, zIndex: 2 }}>
      <div style={{ width: size * 0.08, height: size * 0.04, backgroundColor: '#fb7185', borderRadius: '50%', opacity: 0.85 }} />
      {shocked ? (
        <div style={{ width: size * 0.11, height: size * 0.11, backgroundColor: '#0f172a', borderRadius: '50%' }} />
      ) : dimpled ? (
        <div style={{ width: size * 0.14, height: size * (squash > 1 ? 0.085 : 0.06), backgroundColor: '#0f172a', borderRadius: '8px 8px 40px 40px', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', overflow: 'hidden' }}>
          <div style={{ width: '65%', height: '45%', backgroundColor: '#fb7185', borderRadius: '50% 50% 0 0' }} />
        </div>
      ) : (
        <div style={{ width: size * 0.11, height: size * 0.045, borderTop: '5px solid #0f172a', borderRadius: '20px 20px 0 0', marginTop: 6 }} />
      )}
      <div style={{ width: size * 0.08, height: size * 0.04, backgroundColor: '#fb7185', borderRadius: '50%', opacity: 0.85 }} />
    </div>
  </div>
);
const SUBS = [
  { s: 0, e: 175, t: 'Kenapa bola golf permukaannya penuh lekukan kecil?' },
  { s: 175, e: 270, t: 'Kenapa nggak dibuat mulus aja? Begini penjelasannya!' },
  { s: 270, e: 545, t: 'Bola mulus kena hambatan angin besar sehingga cepat jatuh!' },
  { s: 545, e: 830, t: 'Lekukan kecil (dimples) membelah udara 2x lebih jauh!' },
  { s: 830, e: 1010, t: 'Jadi, lekukan itu bukan hiasan, tapi biar terbang jauh!' },
  { s: 1010, e: 1110, t: 'Unik banget, kan? Follow @dysesat untuk fakta lainnya!' },
];

export const GolfFactVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bounceY = -Math.abs(Math.sin(frame / 9)) * 28;
  const squash = 1 + Math.cos(frame / 4.5) * 0.045;
  const wiggle = Math.sin(frame / 11) * 8;
  const isBlinking = (frame % 85) > 79;
  const camZoom = interpolate(frame, [0, 1110], [1, 1.08]);

  // Adegan pukulan stik golf (frame 0 - 45)
  const clubAngle = interpolate(frame, [0, 18, 26], [-75, 12, 38], { extrapolateRight: 'clamp' });
  const hitImpact = frame >= 18;
  const shakeX = frame >= 18 && frame <= 30 ? Math.sin(frame * 3) * 16 : 0;
  const shakeY = frame >= 18 && frame <= 30 ? Math.cos(frame * 3) * 16 : 0;
  const launchY = interpolate(frame, [18, 42], [0, -140], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const s1 = interpolate(frame, [245, 265], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const s2 = interpolate(frame, [255, 275, 815, 835], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const s3 = interpolate(frame, [825, 845], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const c1 = spring({ frame: frame - 280, fps, config: { damping: 10 } });
  const c2 = spring({ frame: frame - 545, fps, config: { damping: 10 } });
  const outroIn = spring({ frame: frame - 835, fps, config: { damping: 9, stiffness: 120 } });
  const activeSub = SUBS.find((x) => frame >= x.s && frame < x.e);
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 35%, #1e293b 0%, #090d16 100%)', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', transform: `translate(${shakeX}px, ${shakeY}px)` }}>
      <Audio src={staticFile('vo_golf.mp3')} volume={1} />
      <Audio src={staticFile('bgm.wav')} volume={0.18} />
      <Sequence from={16} durationInFrames={35}><Audio src={whip} volume={0.6} /></Sequence>
      <Sequence from={18} durationInFrames={30}><Audio src={mouseClick} volume={0.8} /></Sequence>
      <Sequence from={255} durationInFrames={45}><Audio src={whoosh} volume={0.35} /></Sequence>
      <Sequence from={280} durationInFrames={30}><Audio src={mouseClick} volume={0.45} /></Sequence>
      <Sequence from={545} durationInFrames={30}><Audio src={mouseClick} volume={0.45} /></Sequence>
      <Sequence from={830} durationInFrames={60}><Audio src={ding} volume={0.5} /></Sequence>

      <AbsoluteFill style={{ transform: `scale(${camZoom})` }}>
        {STARS.map((st, idx) => (
          <div key={idx} style={{ position: 'absolute', left: `${st.x}%`, top: `${st.y}%`, fontSize: st.size, color: idx % 2 === 0 ? '#4CC9F0' : '#FFE600', opacity: 0.25 + 0.65 * Math.abs(Math.sin(frame / st.speed + idx)) }}>✦</div>
        ))}
      </AbsoluteFill>

      <div style={{ position: 'absolute', top: 95, padding: '8px 22px', borderRadius: 30, backgroundColor: 'rgba(0,0,0,0.45)', border: '1px solid rgba(76, 201, 240, 0.45)', fontFamily: 'sans-serif', fontSize: 24, fontWeight: 'bold', color: 'rgba(255,255,255,0.75)', letterSpacing: 1 }}>
        @dysesat
      </div>

      {/* ADEGAN 1: Pukulan Stik Golf & Bola Mulus vs Berlekuk */}
      <AbsoluteFill style={{ opacity: s1, justifyContent: 'center', alignItems: 'center' }}>
        {/* Stik Golf Mengayun */}
        <div style={{
          position: 'absolute', left: 160, top: 430,
          transformOrigin: 'top left', transform: `rotate(${clubAngle}deg)`,
          opacity: interpolate(frame, [28, 42], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          <div style={{ width: 16, height: 320, backgroundColor: '#cbd5e1', borderRadius: 8 }} />
          <div style={{ width: 95, height: 48, backgroundColor: '#38bdf8', borderRadius: '12px 24px 24px 12px', marginLeft: -10, boxShadow: '0 0 20px rgba(56, 189, 248, 0.6)' }} />
        </div>

        {/* Efek Dampak Pukulan KTAK! */}
        {frame >= 18 && frame <= 38 && (
          <div style={{ position: 'absolute', top: 610, left: 230, fontFamily, fontSize: 34, color: '#FFE600', transform: `scale(${interpolate(frame, [18, 28], [0.5, 1.3], { extrapolateRight: 'clamp' })})` }}>
            KTAK! 💥
          </div>
        )}

        <div style={{ display: 'flex', gap: 55, marginBottom: 250, transform: `translateY(${launchY + (hitImpact ? bounceY : 0)}px)` }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <GolfBallChar size={240} dimpled={false} blink={isBlinking} shocked={frame >= 18 && frame <= 55} tilt={-wiggle} squash={squash} />
            <div style={{ fontFamily: 'sans-serif', fontSize: 26, fontWeight: 'bold', color: '#FF4D4D', marginTop: 22 }}>Bola Mulus</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <GolfBallChar size={240} dimpled={true} blink={isBlinking} shocked={frame >= 18 && frame <= 55} tilt={wiggle} squash={squash} />
            <div style={{ fontFamily: 'sans-serif', fontSize: 26, fontWeight: 'bold', color: '#4CC9F0', marginTop: 22 }}>Bola Berlekuk</div>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 310, padding: '0 45px', textAlign: 'center', fontFamily, lineHeight: 1.65 }}>
          <div style={{ fontSize: 32, color: '#FFE600' }}>KENAPA BOLA GOLF</div>
          <div style={{ fontSize: 32, color: '#FFF', marginTop: 16 }}>PENUH <span style={{ color: '#4CC9F0' }}>LEKUKAN?</span></div>
        </div>
      </AbsoluteFill>

      {/* ADEGAN 2: Perbandingan Hambatan Udara */}
      <AbsoluteFill style={{ opacity: s2, justifyContent: 'center', alignItems: 'center', padding: '0 45px' }}>
        <div style={{ fontFamily, fontSize: 28, color: '#FFE600', marginBottom: 42 }}>RAHASIA AERODINAMIKA</div>
        <div style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.08)', border: '3px solid #FF4D4D', borderRadius: 28, padding: 28, marginBottom: 34, transform: `scale(${c1})`, display: 'flex', alignItems: 'center', gap: 28 }}>
          <div style={{ flexShrink: 0 }}>
            <GolfBallChar size={140} dimpled={false} tilt={-wiggle} squash={squash} />
          </div>
          <div>
            <div style={{ fontFamily, fontSize: 21, color: '#FF4D4D' }}>1. BOLA MULUS ❌</div>
            <div style={{ fontFamily: 'sans-serif', fontSize: 27, color: '#FFF', marginTop: 10 }}>Hambatan udara sangat besar, bola tertahan dan cepat jatuh!</div>
          </div>
        </div>
        <div style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.08)', border: '3px solid #4CC9F0', borderRadius: 28, padding: 28, transform: `scale(${c2})`, display: 'flex', alignItems: 'center', gap: 28 }}>
          <div style={{ flexShrink: 0 }}>
            <GolfBallChar size={140} dimpled={true} tilt={wiggle} squash={squash} />
          </div>
          <div>
            <div style={{ fontFamily, fontSize: 21, color: '#4CC9F0' }}>2. ADA LEKUKAN ✅</div>
            <div style={{ fontFamily: 'sans-serif', fontSize: 27, color: '#FFF', marginTop: 10 }}>Membelah angin lebih lancar, terbang 2x lebih jauh!</div>
          </div>
        </div>
      </AbsoluteFill>

      {/* ADEGAN 3: Penutup */}
      <AbsoluteFill style={{ opacity: s3, justifyContent: 'center', alignItems: 'center', padding: '0 45px' }}>
        <div style={{ transform: `translateY(${bounceY}px) scale(${outroIn})`, marginBottom: 260 }}>
          <GolfBallChar size={330} dimpled={true} blink={isBlinking} tilt={wiggle} squash={squash} />
        </div>
        <div style={{ position: 'absolute', bottom: 310, textAlign: 'center', padding: '0 40px', transform: `scale(${outroIn})` }}>
          <div style={{ fontFamily, fontSize: 28, color: '#FFE600', lineHeight: 1.6 }}>BUKAN SEKADAR HIASAN</div>
          <div style={{ fontFamily, fontSize: 24, color: '#4CC9F0', marginTop: 16 }}>TERBANG 2X LEBIH JAUH!</div>
        </div>
      </AbsoluteFill>

      {activeSub && (
        <div style={{ position: 'absolute', bottom: 130, left: 45, right: 45, backgroundColor: 'rgba(0,0,0,0.75)', border: '2px solid #4CC9F0', borderRadius: 20, padding: '18px 24px', textAlign: 'center', fontFamily: 'sans-serif', fontSize: 32, fontWeight: 'bold', color: '#FFFFFF' }}>
          {activeSub.t}
        </div>
      )}
    </AbsoluteFill>
  );
};
