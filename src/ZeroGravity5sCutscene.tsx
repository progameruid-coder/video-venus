import React from 'react';
import { interpolate } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PressStart2P';

const { fontFamily } = loadFont();

export const CloseUpUdinCrash: React.FC<{ frame: number; localFrame: number }> = ({ frame, localFrame }) => {
  const zoom = interpolate(localFrame, [0, 190], [1, 1.05], { extrapolateRight: 'clamp' });
  const sway = Math.sin(frame * 0.18) * 2.5;
  const starA = frame * 0.14;
  return (
    <div style={{ position: 'absolute', top: 210, left: 60, right: 60, height: 1180, backgroundColor: '#0f172a', border: '8px solid #facc15', borderRadius: 28, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.88)', zIndex: 38 }}>
      <svg width="100%" height="100%" viewBox="0 0 240 310" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges" style={{ transform: `scale(${zoom})`, transformOrigin: '50% 60%' }}>
        <rect width="240" height="125" fill="#38bdf8" /><rect y="85" width="240" height="40" fill="#7dd3fc" />
        <rect y="125" width="240" height="36" fill="#cbd5e1" /><rect y="161" width="240" height="149" fill="#475569" />
        <rect y="158" width="240" height="5" fill="#94a3b8" />
        {/* Gedung & Taksi Kuning Penyok Berasap di Latar */}
        <rect x="8" y="42" width="66" height="86" fill="#9a3412" stroke="#0f172a" strokeWidth="2" />
        <rect x="18" y="54" width="16" height="18" fill="#bae6fd" stroke="#0f172a" strokeWidth="1.5" />
        <rect x="44" y="54" width="16" height="18" fill="#bae6fd" stroke="#0f172a" strokeWidth="1.5" />
        <g transform="translate(174, 152) rotate(12)">
          <rect x="-36" y="-14" width="72" height="22" fill="#facc15" stroke="#0f172a" strokeWidth="2" />
          <rect x="-22" y="-26" width="42" height="14" fill="#fde047" stroke="#0f172a" strokeWidth="2" />
          <rect x="-18" y="-23" width="16" height="9" fill="#38bdf8" /><rect x="2" y="-23" width="14" height="9" fill="#38bdf8" />
          <rect x="-28" y="4" width="14" height="12" fill="#0f172a" /><rect x="14" y="4" width="14" height="12" fill="#0f172a" />
          <rect x="-30" y={-34 - (frame % 18)} width="12" height="9" fill="#cbd5e1" opacity={0.7 - (frame % 18) / 25} />
        </g>
        {/* Tiang Lampu & Mangkok Bakso Tumpah */}
        <rect x="44" y="34" width="8" height="170" fill="#334155" stroke="#0f172a" strokeWidth="2" />
        <rect x="38" y="200" width="20" height="10" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
        <g transform="translate(172, 246)">
          <rect x="-18" y="-6" width="28" height="12" fill="#f8fafc" stroke="#0f172a" strokeWidth="2" />
          <rect x="-14" y="6" width="20" height="5" fill="#cbd5e1" />
          <rect x="14" y="2" width="9" height="9" rx="3" fill="#92400e" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="26" y="7" width="8" height="8" rx="3" fill="#78350f" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="-28" y="4" width="16" height="4" fill="#fde047" />
        </g>
        {/* SI UDIN TERDUDUK PUSING + KUCING ORANYE DI KEPALANYA (PAS 2 TANGAN & 2 KAKI) */}
        <g transform={`translate(${110 + sway * 0.4}, 224)`}>
          <ellipse cx="0" cy="36" rx="36" ry="9" fill="rgba(15,23,42,0.4)" />
          {/* Kaki Terduduk ke Depan */}
          <rect x="-26" y="18" width="22" height="14" fill="#1e3a8a" stroke="#0f172a" strokeWidth="2" />
          <rect x="4" y="18" width="22" height="14" fill="#1e3a8a" stroke="#0f172a" strokeWidth="2" />
          <rect x="-32" y="20" width="9" height="12" fill="#0f172a" /><rect x="23" y="20" width="9" height="12" fill="#0f172a" />
          {/* Badan Kaos Merah */}
          <rect x="-20" y="-18" width="40" height="38" fill="#0f172a" /><rect x="-17" y="-15" width="34" height="32" fill="#dc2626" />
          {/* Kedua Tangan Mengangkat ke Dekat Kepala Mengaduh */}
          <rect x="-30" y="-26" width="11" height="24" fill="#dc2626" stroke="#0f172a" strokeWidth="2" />
          <rect x="-29" y="-34" width="10" height="10" fill="#fed7aa" stroke="#0f172a" strokeWidth="2" />
          <rect x="19" y="-26" width="11" height="24" fill="#dc2626" stroke="#0f172a" strokeWidth="2" />
          <rect x="19" y="-34" width="10" height="10" fill="#fed7aa" stroke="#0f172a" strokeWidth="2" />
          {/* Kepala & Mata Pusing (X X) */}
          <g transform={`translate(${sway * 0.5}, 0)`}>
            <rect x="-19" y="-54" width="38" height="36" fill="#0f172a" /><rect x="-16" y="-51" width="32" height="30" fill="#fed7aa" />
            <rect x="-18" y="-59" width="36" height="11" fill="#29150b" stroke="#0f172a" strokeWidth="2" />
            <rect x="-12" y="-44" width="9" height="9" fill="#fff" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="3" y="-44" width="9" height="9" fill="#fff" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="-9" y="-41" width="4" height="4" fill="#0f172a" /><rect x="6" y="-40" width="4" height="4" fill="#0f172a" />
            <rect x="-8" y="-29" width="16" height="5" fill="#7f1d1d" />
            {/* KUCING ORANYE DUDUK SANTAI DI ATAS KEPALA UDIN */}
            <g transform="translate(0, -68)">
              <rect x="-16" y="-10" width="30" height="16" fill="#f97316" stroke="#0f172a" strokeWidth="2" />
              <rect x="-12" y="-8" width="6" height="4" fill="#c2410c" /><rect x="-2" y="-8" width="6" height="4" fill="#c2410c" />
              <rect x="6" y="-18" width="16" height="15" fill="#fb923c" stroke="#0f172a" strokeWidth="2" />
              <polygon points="7,-18 10,-25 13,-18" fill="#f97316" stroke="#0f172a" strokeWidth="1.5" />
              <polygon points="15,-18 18,-25 21,-18" fill="#f97316" stroke="#0f172a" strokeWidth="1.5" />
              <rect x="10" y="-13" width="3" height="3" fill="#0f172a" /><rect x="17" y="-13" width="3" height="3" fill="#0f172a" />
              <rect x="-24" y={-14 + Math.sin(frame * 0.25) * 3} width="10" height="5" fill="#f97316" stroke="#0f172a" strokeWidth="1.5" />
            </g>
            {/* 3 Bintang Pusing Berputar di Atas Kepala */}
            {[0, 1, 2].map((i) => {
              const a = starA + (i * Math.PI * 2) / 3;
              return <rect key={i} x={Math.cos(a) * 32 - 4} y={-88 + Math.sin(a) * 8} width="8" height="8" fill={i % 2 === 0 ? '#fde047' : '#ffffff'} stroke="#0f172a" strokeWidth="1.2" />;
            })}
          </g>
        </g>
      </svg>
      <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24, backgroundColor: 'rgba(15, 23, 42, 0.92)', border: '4px solid #facc15', borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div><div style={{ fontFamily, fontSize: 16, color: '#facc15' }}>KOTA KACAU TOTAL!</div><div style={{ fontFamily, fontSize: 11, color: '#38bdf8', marginTop: 8 }}>DAMPAK 5 DETIK TANPA GRAVITASI</div></div>
        <div style={{ fontFamily, fontSize: 22, color: '#f87171' }}>0G!</div>
      </div>
    </div>
  );
};
