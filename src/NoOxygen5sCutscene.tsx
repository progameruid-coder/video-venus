import React from 'react';
import { interpolate } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PressStart2P';

const { fontFamily } = loadFont();

export const CloseUpUdinSunburn: React.FC<{ frame: number; localFrame: number }> = ({ frame, localFrame }) => {
  const zoom = interpolate(localFrame, [0, 160], [1, 1.05], { extrapolateRight: 'clamp' });
  const sway = Math.sin(frame * 0.22) * 1.8;
  return (
    <div style={{ position: 'absolute', top: 210, left: 60, right: 60, height: 1180, backgroundColor: '#0f172a', border: '8px solid #facc15', borderRadius: 28, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.88)', zIndex: 38 }}>
      <svg width="100%" height="100%" viewBox="0 0 240 310" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges" style={{ transform: `scale(${zoom})`, transformOrigin: '50% 60%' }}>
        <rect width="240" height="145" fill="#0284c7" /><rect y="85" width="240" height="60" fill="#38bdf8" />
        <rect x="24" y="22" width="42" height="10" fill="#e0f2fe" /><rect x="152" y="34" width="48" height="11" fill="#f0f9ff" />
        {/* Gundukan Puing Beton Rata di Latar */}
        <polygon points="0,155 34,118 76,138 118,124 166,142 204,116 240,155" fill="#64748b" stroke="#0f172a" strokeWidth="2" />
        <polygon points="18,155 58,132 104,155" fill="#94a3b8" stroke="#0f172a" strokeWidth="1.5" />
        <polygon points="148,155 196,126 236,155" fill="#475569" stroke="#0f172a" strokeWidth="1.5" />
        {/* Besi Beton Mencuat & Debu Melayang */}
        <rect x="44" y="106" width="3" height="22" fill="#1e293b" /><rect x="196" y="104" width="3" height="24" fill="#1e293b" />
        {[0, 1, 2].map((i) => <rect key={i} x={30 + i * 74} y={110 - ((frame + i * 14) % 24)} width="14" height="9" fill="#cbd5e1" opacity={0.6 - ((frame + i * 14) % 24) / 36} />)}
        {/* Tanah Penuh Puing & Taksi Mogok di Kanan */}
        <rect y="155" width="240" height="155" fill="#475569" /><rect y="152" width="240" height="6" fill="#94a3b8" />
        <g transform="translate(186, 170)">
          <rect x="-32" y="-12" width="64" height="18" fill="#eab308" stroke="#0f172a" strokeWidth="2" />
          <rect x="-18" y="-22" width="36" height="12" fill="#facc15" stroke="#0f172a" strokeWidth="2" />
          <rect x="-14" y="-19" width="13" height="7" fill="#bae6fd" /><rect x="2" y="-19" width="13" height="7" fill="#bae6fd" />
          <rect x="-24" y="3" width="12" height="10" fill="#0f172a" /><rect x="12" y="3" width="12" height="10" fill="#0f172a" />
          <rect x="-28" y={-22 - (frame % 18)} width="10" height="8" fill="#e2e8f0" stroke="#475569" strokeWidth="1" opacity={0.8 - (frame % 18) / 22} />
        </g>
        {/* Batu Puing di Bawah Udin */}
        <rect x="46" y="246" width="138" height="24" fill="#64748b" stroke="#0f172a" strokeWidth="2" />
        <rect x="64" y="236" width="96" height="16" fill="#94a3b8" stroke="#0f172a" strokeWidth="2" />
        {/* SI UDIN GOSONG MERAH DUDUK DI ATAS PUING (PAS 2 TANGAN & 2 KAKI) */}
        <g transform={`translate(${112 + sway * 0.4}, 214)`}>
          <rect x="-28" y="14" width="22" height="14" fill="#1e3a8a" stroke="#0f172a" strokeWidth="2" />
          <rect x="6" y="14" width="22" height="14" fill="#1e3a8a" stroke="#0f172a" strokeWidth="2" />
          <rect x="-32" y="18" width="9" height="12" fill="#0f172a" /><rect x="23" y="18" width="9" height="12" fill="#0f172a" />
          {/* Badan Kaos Merah */}
          <rect x="-20" y="-18" width="40" height="36" fill="#0f172a" /><rect x="-17" y="-15" width="34" height="30" fill="#dc2626" />
          {/* Tangan Kiri: Menekuk Memegangi Telinga yang Berdenging */}
          <rect x="-35" y="-16" width="17" height="10" fill="#dc2626" stroke="#0f172a" strokeWidth="2" />
          <rect x="-35" y="-42" width="10" height="30" fill="#dc2626" stroke="#0f172a" strokeWidth="2" />
          <rect x="-28" y="-44" width="11" height="10" fill="#f87171" stroke="#0f172a" strokeWidth="2" />
          {/* Tangan Kanan: Tetap Memegang Gelas Es Minuman Utuh! */}
          <rect x="18" y="-12" width="18" height="10" fill="#dc2626" stroke="#0f172a" strokeWidth="2" />
          <rect x="32" y="-12" width="10" height="10" fill="#f87171" stroke="#0f172a" strokeWidth="2" />
          <g transform="translate(42, -20)">
            <rect x="-6" y="0" width="14" height="18" fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />
            <rect x="-4" y="2" width="10" height="5" fill="#e0f2fe" />
            <rect x="0" y="-10" width="3" height="12" fill="#facc15" stroke="#0f172a" strokeWidth="1" />
          </g>
          {/* Kepala Gosong Merah + Uap Panas + Gelombang Denging Telinga */}
          <g transform={`translate(${sway * 0.4}, 0)`}>
            <rect x="-19" y="-54" width="38" height="36" fill="#0f172a" /><rect x="-16" y="-51" width="32" height="30" fill="#f87171" />
            <rect x="-18" y="-59" width="36" height="11" fill="#29150b" stroke="#0f172a" strokeWidth="2" />
            <rect x="-11" y="-43" width="9" height="8" fill="#fff" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="2" y="-43" width="9" height="8" fill="#fff" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="-8" y="-40" width="4" height="4" fill="#0f172a" /><rect x="5" y="-40" width="4" height="4" fill="#0f172a" />
            <rect x="-6" y="-29" width="12" height="5" fill="#7f1d1d" />
            {/* Uap Panas Naik dari Kepala Gosong */}
            {[-10, 2, 12].map((ux, i) => <rect key={i} x={ux} y={-68 - ((frame + i * 8) % 16)} width="4" height="8" fill="#ffffff" opacity={0.75 - ((frame + i * 8) % 16) / 22} />)}
            {/* Gelombang Denging Telinga di Kiri */}
            <text x="-48" y="-38" fill="#fde047" fontSize="14" fontFamily="monospace" fontWeight="bold" opacity={frame % 10 < 5 ? 1 : 0.35}>~</text>
            <text x="-58" y="-46" fill="#38bdf8" fontSize="12" fontFamily="monospace" fontWeight="bold" opacity={frame % 10 >= 5 ? 1 : 0.35}>~</text>
          </g>
        </g>
      </svg>
      <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24, backgroundColor: 'rgba(15, 23, 42, 0.92)', border: '4px solid #facc15', borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div><div style={{ fontFamily, fontSize: 16, color: '#facc15' }}>KOTA RATA PUING!</div><div style={{ fontFamily, fontSize: 11, color: '#38bdf8', marginTop: 8 }}>GOSONG + TELINGA BERDENGING</div></div>
        <div style={{ fontFamily, fontSize: 20, color: '#f87171' }}>0% O2</div>
      </div>
    </div>
  );
};
