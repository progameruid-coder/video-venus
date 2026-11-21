import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/PressStart2P';

const { fontFamily } = loadFont();

export const VenusFactVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const floatY = Math.sin(frame / 15) * 15;

  const textScale = spring({
    frame: frame - 15,
    fps,
    config: { damping: 12 },
  });

  const ringPulse = 1 + Math.sin(frame / 20) * 0.02;

  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(circle at center, #1b2735 0%, #090a0f 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Latar Belakang Bintang Sederhana */}
      <div style={{ position: 'absolute', top: '15%', left: '20%', color: '#FFD700', fontSize: 30 }}>★</div>
      <div style={{ position: 'absolute', top: '25%', right: '18%', color: '#FFF', fontSize: 24 }}>✦</div>
      <div style={{ position: 'absolute', bottom: '35%', left: '15%', color: '#FFF', fontSize: 20 }}>•</div>

      {/* Grup Planet Venus */}
      <div
        style={{
          transform: `translateY(${floatY}px)`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 180,
        }}
      >
        {/* Cincin Orbit Tipis */}
        <div
          style={{
            position: 'absolute',
            width: 580,
            height: 160,
            border: '3px solid rgba(255, 255, 255, 0.35)',
            borderRadius: '50%',
            transform: `rotate(-20deg) scale(${ringPulse})`,
          }}
        />

        {/* Badan Planet Venus */}
        <div
          style={{
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, #ffd280, #f48c42 60%, #c84b31 100%)',
            boxShadow: '0 0 60px rgba(244, 140, 66, 0.4), inset -25px -25px 50px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {/* Mata Kartun */}
          <div style={{ display: 'flex', gap: 70, marginTop: 20 }}>
            <div style={{ width: 42, height: 42, backgroundColor: '#2d140d', borderRadius: '50%', position: 'relative' }}>
              <div style={{ width: 14, height: 14, backgroundColor: '#fff', borderRadius: '50%', position: 'absolute', top: 6, left: 6 }} />
            </div>
            <div style={{ width: 42, height: 42, backgroundColor: '#2d140d', borderRadius: '50%', position: 'relative' }}>
              <div style={{ width: 14, height: 14, backgroundColor: '#fff', borderRadius: '50%', position: 'absolute', top: 6, left: 6 }} />
            </div>
          </div>

          {/* Pipi Merona & Senyum */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 35, marginTop: 12 }}>
            <div style={{ width: 32, height: 16, backgroundColor: '#ff7b54', borderRadius: '50%', opacity: 0.7 }} />
            <div
              style={{
                width: 36,
                height: 18,
                borderBottom: '6px solid #2d140d',
                borderRadius: '0 0 20px 20px',
              }}
            />
            <div style={{ width: 32, height: 16, backgroundColor: '#ff7b54', borderRadius: '50%', opacity: 0.7 }} />
          </div>
        </div>
      </div>

      {/* Teks Piksel Berwarna di Bagian Bawah */}
      <div
        style={{
          position: 'absolute',
          bottom: 220,
          padding: '0 50px',
          textAlign: 'center',
          fontFamily,
          transform: `scale(${textScale})`,
          lineHeight: 1.6,
        }}
      >
        <div style={{ fontSize: 34, color: '#FFE600', textShadow: '4px 4px 0px #000' }}>
          TAHUKAH KAMU?
        </div>
        <div style={{ fontSize: 32, color: '#FF9E00', textShadow: '4px 4px 0px #000', marginTop: 12 }}>
          SATU HARI DI VENUS
        </div>
        <div style={{ fontSize: 32, color: '#FFFFFF', textShadow: '4px 4px 0px #000', marginTop: 12 }}>
          LEBIH LAMA DARI <span style={{ color: '#FF4D4D' }}>SATU TAHUNNYA!</span>
        </div>
        <div
          style={{
            fontSize: 22,
            color: '#A0E7E5',
            marginTop: 35,
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
          }}
        >
          Kira-kira kenapa ya? 🧐
        </div>
      </div>
    </AbsoluteFill>
  );
};
