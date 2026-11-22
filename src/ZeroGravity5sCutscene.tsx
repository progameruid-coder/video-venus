import React from 'react';
import { interpolate } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PressStart2P';

const { fontFamily } = loadFont();

export const CloseUpUdinCrash: React.FC<{ frame: number; localFrame: number }> = ({ frame, localFrame }) => {
  const zoom = interpolate(localFrame, [0, 160], [1, 1.05], { extrapolateRight: 'clamp' });
  const sway = Math.sin(frame * 0.2) * 2;
  const starA = frame * 0.16;
  return (
    <div style={{ position: 'absolute', top: 210, left: 60, right: 60, height: 1180, backgroundColor: '#0f172a', border: '8px solid #facc15', borderRadius: 28, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.88)', zIndex: 38 }}>
      <svg width="100%" height="100%" viewBox="0 0 240 310" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges" style={{ transform: `scale(${zoom})`, transformOrigin: '50% 60%' }}>
        <rect width="240" height="122" fill="#0284c7" /><rect y="78" width="240" height="44" fill="#38bdf8" />
        <rect x="28" y="20" width="40" height="10" fill="#e0f2fe" /><rect x="148" y="30" width="46" height="11" fill="#f0f9ff" />
        {/* Deretan Gedung Kota */}
        <rect x="0" y="54" width="76" height="72" fill="#9a3412" stroke="#0f172a" strokeWidth="2" />
        <rect x="10" y="66" width="16" height="18" fill="#bae6fd" stroke="#0f172a" strokeWidth="1.5" />
        <rect x="36" y="66" width="16" height="18" fill="#bae6fd" stroke="#0f172a" strokeWidth="1.5" />
        <rect x="86" y="76" width="54" height="50" fill="#475569" stroke="#0f172a" strokeWidth="2" />
        <rect x="96" y="86" width="12" height="14" fill="#94a3b8" /><rect x="116" y="86" width="12" height="14" fill="#94a3b8" />
        {/* Trotoar, Aspal & Retakan Pixel Rapi */}
        <rect y="122" width="240" height="36" fill="#cbd5e1" /><rect y="158" width="240" height="152" fill="#334155" />
        <rect y="155" width="240" height="5" fill="#94a3b8" />
        <rect x="44" y="264" width="16" height="3" fill="#0f172a" /><rect x="56" y="267" width="12" height="3" fill="#0f172a" /><rect x="64" y="270" width="10" height="3" fill="#0f172a" />
        {/* Tiang Lampu Kiri */}
        <rect x="20" y="24" width="7" height="148" fill="#334155" stroke="#0f172a" strokeWidth="2" />
        <rect x="15" y="168" width="17" height="8" fill="#1e293b" stroke="#0f172a" strokeWidth="1.8" />
        <rect x="14" y="12" width="19" height="16" fill="#fde047" stroke="#0f172a" strokeWidth="1.8" />
        {/* Taksi Kuning Penyok Menapak di Aspal + Bayangan + Asap Kap Depan */}
        <ellipse cx="188" cy="178" rx="38" ry="8" fill="rgba(15,23,42,0.45)" />
        <g transform="translate(188, 162) rotate(9)">
          <rect x="-34" y="-12" width="68" height="20" fill="#eab308" stroke="#0f172a" strokeWidth="2" />
          <rect x="-20" y="-22" width="38" height="12" fill="#facc15" stroke="#0f172a" strokeWidth="2" />
          <rect x="-16" y="-20" width="14" height="8" fill="#bae6fd" /><rect x="2" y="-20" width="13" height="8" fill="#bae6fd" />
          <rect x="-26" y="4" width="13" height="11" fill="#0f172a" /><rect x="14" y="5" width="13" height="11" fill="#0f172a" />
          {/* Asap Mesin Keluar dari Kap Depan Kanan */}
          <rect x="16" y={-24 - (frame % 20)} width="12" height="9" fill="#e2e8f0" stroke="#475569" strokeWidth="1.2" opacity={0.88 - (frame % 20) / 25} />
          <rect x="24" y={-36 - ((frame + 10) % 20)} width="10" height="8" fill="#cbd5e1" stroke="#475569" strokeWidth="1.2" opacity={0.78 - ((frame + 10) % 20) / 26} />
        </g>
        {/* Mangkok Bakso Tumpah + Kuah + Mi + Pentol */}
        <g transform="translate(184, 248)">
          <rect x="-26" y="4" width="44" height="9" fill="#facc15" opacity="0.65" />
          <rect x="-22" y="10" width="30" height="6" fill="#fde047" opacity="0.7" />
          <polygon points="-16,-8 8,-8 12,4 -12,4" fill="#f8fafc" stroke="#0f172a" strokeWidth="2" />
          <rect x="-12" y="-4" width="20" height="3" fill="#dc2626" />
          <rect x="-26" y="3" width="14" height="3" fill="#fef08a" /><rect x="-22" y="7" width="12" height="3" fill="#fde047" />
          <rect x="14" y="1" width="9" height="9" fill="#92400e" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="26" y="7" width="8" height="8" fill="#78350f" stroke="#0f172a" strokeWidth="1.5" />
        </g>
        {/* SI UDIN TERDUDUK PUSING + TANGAN MEMEGANGI PELIPIS + KUCING SANTAI */}
        <g transform={`translate(${108 + sway * 0.4}, 226)`}>
          <ellipse cx="0" cy="36" rx="42" ry="10" fill="rgba(15,23,42,0.45)" />
          <rect x="-32" y="14" width="24" height="15" fill="#1e3a8a" stroke="#0f172a" strokeWidth="2" />
          <rect x="8" y="14" width="24" height="15" fill="#1e3a8a" stroke="#0f172a" strokeWidth="2" />
          <rect x="-36" y="18" width="10" height="13" fill="#0f172a" /><rect x="26" y="18" width="10" height="13" fill="#0f172a" />
          <rect x="-20" y="-18" width="40" height="38" fill="#0f172a" /><rect x="-17" y="-15" width="34" height="32" fill="#dc2626" />
          <rect x="-17" y="8" width="34" height="5" fill="#7f1d1d" />
          {/* Lengan Menekuk Keluar Lebar (Tidak Mengotaki Wajah!) */}
          <rect x="-36" y="-16" width="18" height="10" fill="#dc2626" stroke="#0f172a" strokeWidth="2" />
          <rect x="18" y="-16" width="18" height="10" fill="#dc2626" stroke="#0f172a" strokeWidth="2" />
          <rect x="-36" y="-42" width="10" height="30" fill="#dc2626" stroke="#0f172a" strokeWidth="2" />
          <rect x="26" y="-42" width="10" height="30" fill="#dc2626" stroke="#0f172a" strokeWidth="2" />
          <rect x="-29" y="-44" width="12" height="10" fill="#fed7aa" stroke="#0f172a" strokeWidth="2" />
          <rect x="17" y="-44" width="12" height="10" fill="#fed7aa" stroke="#0f172a" strokeWidth="2" />
          <g transform={`translate(${sway * 0.5}, 0)`}>
            <rect x="-19" y="-54" width="38" height="36" fill="#0f172a" /><rect x="-16" y="-51" width="32" height="30" fill="#fed7aa" />
            <rect x="-18" y="-59" width="36" height="11" fill="#29150b" stroke="#0f172a" strokeWidth="2" />
            {/* Mata Pusing & Tetesan Keringat */}
            <rect x="-12" y="-44" width="10" height="10" fill="#fff" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="2" y="-44" width="10" height="10" fill="#fff" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="-10" y="-42" width="4" height="4" fill="#0f172a" /><rect x="6" y="-39" width="4" height="4" fill="#0f172a" />
            <rect x="-6" y="-29" width="12" height="5" fill="#7f1d1d" stroke="#0f172a" strokeWidth="1.2" />
            <rect x="11" y={-49 + (frame % 10)} width="3.5" height="5.5" fill="#7dd3fc" />
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
            {/* 3 Bintang Pusing Mengorbit Bersih di Atas Telinga Kucing! */}
            {[0, 1, 2].map((i) => {
              const a = starA + (i * Math.PI * 2) / 3;
              return <rect key={i} x={Math.cos(a) * 34 - 4} y={-112 + Math.sin(a) * 6} width="8" height="8" fill={i % 2 === 0 ? '#fde047' : '#ffffff'} stroke="#0f172a" strokeWidth="1.2" />;
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
