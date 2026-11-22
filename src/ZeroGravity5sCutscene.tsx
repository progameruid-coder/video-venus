import React from 'react';
import { interpolate } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PressStart2P';

const { fontFamily } = loadFont();

export const CloseUpUdinCrash: React.FC<{ frame: number; localFrame: number }> = ({ frame, localFrame }) => {
  const zoom = interpolate(localFrame, [0, 160], [1, 1.05], { extrapolateRight: 'clamp' });
  const sway = Math.sin(frame * 0.2) * 2.2;
  const starA = frame * 0.16;
  return (
    <div style={{ position: 'absolute', top: 210, left: 60, right: 60, height: 1180, backgroundColor: '#0f172a', border: '8px solid #facc15', borderRadius: 28, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.88)', zIndex: 38 }}>
      <svg width="100%" height="100%" viewBox="0 0 240 310" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges" style={{ transform: `scale(${zoom})`, transformOrigin: '50% 60%' }}>
        <rect width="240" height="122" fill="#0284c7" /><rect y="78" width="240" height="44" fill="#38bdf8" />
        <rect x="28" y="20" width="40" height="10" fill="#e0f2fe" /><rect x="148" y="30" width="46" height="11" fill="#f0f9ff" />
        {/* Deretan Gedung Kota di Belakang (Bebas dari Tiang!) */}
        <rect x="0" y="54" width="76" height="72" fill="#9a3412" stroke="#0f172a" strokeWidth="2" />
        <rect x="10" y="66" width="16" height="18" fill="#bae6fd" stroke="#0f172a" strokeWidth="1.5" />
        <rect x="36" y="66" width="16" height="18" fill="#bae6fd" stroke="#0f172a" strokeWidth="1.5" />
        <rect x="86" y="76" width="54" height="50" fill="#475569" stroke="#0f172a" strokeWidth="2" />
        <rect x="96" y="86" width="12" height="14" fill="#94a3b8" /><rect x="116" y="86" width="12" height="14" fill="#94a3b8" />
        {/* Trotoar, Aspal Retak & Marka */}
        <rect y="122" width="240" height="36" fill="#cbd5e1" /><rect y="158" width="240" height="152" fill="#334155" />
        <rect y="155" width="240" height="5" fill="#94a3b8" />
        <polygon points="48,258 68,266 56,274 80,278" fill="none" stroke="#0f172a" strokeWidth="2" />
        {/* Tiang Lampu Rapi di Pinggir Kiri Trotoar */}
        <rect x="20" y="24" width="7" height="148" fill="#334155" stroke="#0f172a" strokeWidth="2" />
        <rect x="15" y="168" width="17" height="8" fill="#1e293b" stroke="#0f172a" strokeWidth="1.8" />
        <rect x="14" y="12" width="19" height="16" fill="#fde047" stroke="#0f172a" strokeWidth="1.8" />
        {/* Taksi Kuning Penyok Berasap di Kanan */}
        <g transform="translate(182, 152) rotate(13)">
          <rect x="-34" y="-12" width="68" height="20" fill="#eab308" stroke="#0f172a" strokeWidth="2" />
          <rect x="-20" y="-24" width="38" height="14" fill="#facc15" stroke="#0f172a" strokeWidth="2" />
          <rect x="-16" y="-21" width="14" height="9" fill="#bae6fd" /><rect x="2" y="-21" width="13" height="9" fill="#bae6fd" />
          <rect x="-26" y="4" width="13" height="11" fill="#0f172a" /><rect x="14" y="6" width="13" height="11" fill="#0f172a" />
          <rect x="-26" y={-34 - (frame % 20)} width="13" height="9" fill="#e2e8f0" opacity={0.75 - (frame % 20) / 26} />
          <rect x="-16" y={-44 - ((frame + 10) % 20)} width="10" height="8" fill="#cbd5e1" opacity={0.6 - ((frame + 10) % 20) / 28} />
        </g>
        {/* Mangkok Bakso Tumpah & Pentol Berserakan di Kanan Bawah */}
        <g transform="translate(182, 248)">
          <rect x="-16" y="-5" width="26" height="11" fill="#f8fafc" stroke="#0f172a" strokeWidth="2" />
          <rect x="-12" y="6" width="18" height="4" fill="#cbd5e1" />
          <rect x="-24" y="4" width="18" height="5" fill="#fde047" />
          <rect x="14" y="1" width="9" height="9" rx="3" fill="#92400e" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="26" y="7" width="8" height="8" rx="3" fill="#78350f" stroke="#0f172a" strokeWidth="1.5" />
        </g>
        {/* SI UDIN TERDUDUK PUSING + SIKU TERTEKUK MEMEGANGI KEPALA */}
        <g transform={`translate(${108 + sway * 0.4}, 226)`}>
          <ellipse cx="0" cy="36" rx="40" ry="10" fill="rgba(15,23,42,0.45)" />
          {/* Kaki Terduduk Menekuk Natural */}
          <rect x="-32" y="14" width="24" height="15" fill="#1e3a8a" stroke="#0f172a" strokeWidth="2" />
          <rect x="8" y="14" width="24" height="15" fill="#1e3a8a" stroke="#0f172a" strokeWidth="2" />
          <rect x="-36" y="18" width="10" height="13" fill="#0f172a" /><rect x="26" y="18" width="10" height="13" fill="#0f172a" />
          {/* Badan Kaos Merah */}
          <rect x="-20" y="-18" width="40" height="38" fill="#0f172a" /><rect x="-17" y="-15" width="34" height="32" fill="#dc2626" />
          <rect x="-17" y="8" width="34" height="5" fill="#7f1d1d" />
          {/* Bahu & Lengan Menekuk Memegangi Samping Kepala */}
          <rect x="-30" y="-16" width="12" height="10" fill="#dc2626" stroke="#0f172a" strokeWidth="2" />
          <rect x="18" y="-16" width="12" height="10" fill="#dc2626" stroke="#0f172a" strokeWidth="2" />
          <rect x="-30" y="-42" width="10" height="30" fill="#dc2626" stroke="#0f172a" strokeWidth="2" />
          <rect x="20" y="-42" width="10" height="30" fill="#dc2626" stroke="#0f172a" strokeWidth="2" />
          <rect x="-25" y="-46" width="11" height="10" fill="#fed7aa" stroke="#0f172a" strokeWidth="2" />
          <rect x="14" y="-46" width="11" height="10" fill="#fed7aa" stroke="#0f172a" strokeWidth="2" />
          {/* Kepala & Ekspresi Pusing */}
          <g transform={`translate(${sway * 0.5}, 0)`}>
            <rect x="-19" y="-54" width="38" height="36" fill="#0f172a" /><rect x="-16" y="-51" width="32" height="30" fill="#fed7aa" />
            <rect x="-18" y="-59" width="36" height="11" fill="#29150b" stroke="#0f172a" strokeWidth="2" />
            <rect x="-12" y="-44" width="10" height="10" fill="#fff" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="2" y="-44" width="10" height="10" fill="#fff" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="-9" y="-42" width="4" height="4" fill="#0f172a" /><rect x="6" y="-39" width="4" height="4" fill="#0f172a" />
            <rect x="-7" y="-29" width="14" height="6" fill="#7f1d1d" stroke="#0f172a" strokeWidth="1.2" />
            {/* KUCING ORANYE DUDUK SANTAI DI KEPALA UDIN */}
            <g transform="translate(0, -68)">
              <rect x="-16" y="-10" width="30" height="16" fill="#f97316" stroke="#0f172a" strokeWidth="2" />
              <rect x="-11" y="-8" width="5" height="5" fill="#c2410c" /><rect x="-2" y="-8" width="5" height="5" fill="#c2410c" />
              <rect x="6" y="-19" width="17" height="16" fill="#fb923c" stroke="#0f172a" strokeWidth="2" />
              <polygon points="7,-19 10,-26 13,-19" fill="#f97316" stroke="#0f172a" strokeWidth="1.5" />
              <polygon points="16,-19 19,-26 22,-19" fill="#f97316" stroke="#0f172a" strokeWidth="1.5" />
              <rect x="10" y="-13" width="3" height="2" fill="#0f172a" /><rect x="17" y="-13" width="3" height="2" fill="#0f172a" />
              <rect x="13" y="-9" width="3" height="2" fill="#be123c" />
              <g transform={`translate(-16, -6) rotate(${Math.sin(frame * 0.28) * 18})`}><rect x="-10" y="-3" width="11" height="5" fill="#f97316" stroke="#0f172a" strokeWidth="1.5" /></g>
            </g>
            {/* 3 Bintang Pusing Berputar */}
            {[0, 1, 2].map((i) => {
              const a = starA + (i * Math.PI * 2) / 3;
              return <rect key={i} x={Math.cos(a) * 34 - 4} y={-90 + Math.sin(a) * 8} width="8" height="8" fill={i % 2 === 0 ? '#fde047' : '#ffffff'} stroke="#0f172a" strokeWidth="1.2" />;
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
