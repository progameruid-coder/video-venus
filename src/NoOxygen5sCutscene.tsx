import React from 'react';
import { interpolate } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PressStart2P';

const { fontFamily } = loadFont();

const Box3D: React.FC<{
  x: number; y: number; w: number; h: number;
  dx?: number; dy?: number; front: string; top: string; side: string; sw?: number;
}> = ({ x, y, w, h, dx = 8, dy = 6, front, top, side, sw = 1.8 }) => (
  <g stroke="#0f172a" strokeWidth={sw} strokeLinejoin="round">
    <polygon points={`${x},${y} ${x + dx},${y - dy} ${x + w + dx},${y - dy} ${x + w},${y}`} fill={top} />
    <polygon points={`${x + w},${y} ${x + w + dx},${y - dy} ${x + w + dx},${y + h - dy} ${x + w},${y + h}`} fill={side} />
    <rect x={x} y={y} width={w} height={h} fill={front} />
  </g>
);

export const CloseUpUdinSunburn: React.FC<{ frame: number; localFrame: number }> = ({ frame, localFrame }) => {
  const zoom = interpolate(localFrame, [0, 150], [1, 1.045], { extrapolateRight: 'clamp' });
  const bounce = Math.sin(frame * 0.26);
  const headTilt = Math.sin(frame * 0.2) * 3.2;
  const legSwing = Math.sin(frame * 0.28) * 7;
  const wince = (frame % 38) > 25;
  const pupilJit = Math.sin(frame * 0.6) * 1.5;

  return (
    <div style={{ position: 'absolute', top: 210, left: 60, right: 60, height: 1180, backgroundColor: '#0f172a', border: '8px solid #facc15', borderRadius: 28, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.88)', zIndex: 38 }}>
      <svg width="100%" height="100%" viewBox="0 0 240 310" preserveAspectRatio="xMidYMid slice" style={{ transform: `scale(${zoom})`, transformOrigin: '50% 56%' }}>
        <rect width="240" height="150" fill="#0284c7" /><rect y="82" width="240" height="68" fill="#38bdf8" />
        {/* Awan Voxel 3D */}
        <Box3D x={16 + localFrame * 0.1} y={24} w={36} h={10} dx={6} dy={4} front="#f0f9ff" top="#ffffff" side="#bae6fd" sw={1.4} />
        <Box3D x={156 - localFrame * 0.08} y={32} w={42} h={11} dx={6} dy={4} front="#f0f9ff" top="#ffffff" side="#bae6fd" sw={1.4} />

        {/* Siluet Reruntuhan Kota di Cakrawala (Biar Tengah Tidak Kosong) */}
        <polygon points="0,152 0,118 22,118 22,130 48,130 48,112 72,126 98,136 128,124 152,134 176,118 206,128 240,114 240,152" fill="#0369a1" opacity="0.48" />

        {/* Dinding Beton Patah & Bongkahan Puing Voxel (Tanpa Garis Antena) */}
        <polygon points="-4,154 14,126 30,126 42,138 66,154" fill="#64748b" stroke="#0f172a" strokeWidth="1.8" />
        <Box3D x={6} y={136} w={20} h={15} dx={6} dy={4} front="#94a3b8" top="#cbd5e1" side="#475569" sw={1.5} />
        <Box3D x={30} y={142} w={16} h={10} dx={5} dy={4} front="#475569" top="#64748b" side="#334155" sw={1.5} />
        <polygon points="168,154 186,132 204,138 224,122 244,128 244,154" fill="#475569" stroke="#0f172a" strokeWidth="1.8" />
        <Box3D x={184} y={138} w={22} h={14} dx={6} dy={4} front="#64748b" top="#94a3b8" side="#334155" sw={1.5} />
        <Box3D x={212} y={132} w={18} h={18} dx={6} dy={4} front="#94a3b8" top="#cbd5e1" side="#64748b" sw={1.5} />
        {[0, 1, 2].map((i) => <rect key={i} x={24 + i * 82} y={118 - ((frame + i * 11) % 18)} width="6" height="6" fill="#e2e8f0" opacity={0.55 - ((frame + i * 11) % 18) / 30} />)}

        {/* Trotoar, Aspal, Marka Jalan & Taksi Voxel 3D Mogok */}
        <rect y="150" width="240" height="14" fill="#cbd5e1" /><rect y="162" width="240" height="4" fill="#94a3b8" />
        <rect y="166" width="240" height="144" fill="#475569" />
        {[12, 54, 96, 138, 180, 222].map((mx) => <rect key={mx} x={mx} y="196" width="24" height="5" fill="#fde047" opacity="0.85" />)}
        <rect x="18" y="212" width="20" height="3" fill="#1e293b" /><rect x="34" y="215" width="14" height="3" fill="#1e293b" />

        <g transform="translate(166, 174)">
          <ellipse cx="30" cy="18" rx="34" ry="6" fill="rgba(15,23,42,0.42)" />
          <Box3D x={0} y={0} w={50} h={14} dx={9} dy={6} front="#eab308" top="#facc15" side="#ca8a04" sw={1.6} />
          <Box3D x={10} y={-10} w={28} h={10} dx={8} dy={5} front="#fde047" top="#fef08a" side="#eab308" sw={1.6} />
          <rect x="19" y="-15" width="10" height="4.5" fill="#fef08a" stroke="#0f172a" strokeWidth="1.2" />
          <rect x="13" y="-8" width="10" height="6.5" fill="#bae6fd" stroke="#0f172a" strokeWidth="1.2" />
          <rect x="25" y="-8" width="10" height="6.5" fill="#bae6fd" stroke="#0f172a" strokeWidth="1.2" />
          {/* Roda Voxel 3D */}
          <Box3D x={5} y={10} w={10} h={8} dx={3} dy={2} front="#1e293b" top="#334155" side="#0f172a" sw={1.3} />
          <rect x="8" y="12" width="4" height="4" fill="#94a3b8" />
          <Box3D x={35} y={10} w={10} h={8} dx={3} dy={2} front="#1e293b" top="#334155" side="#0f172a" sw={1.3} />
          <rect x="38" y="12" width="4" height="4" fill="#94a3b8" />
          {/* Asap Keluar dari Kap Depan Kiri + Ikon X Mogok */}
          <Box3D x={-4} y={-8 - (frame % 16)} w={8} h={6} dx={3} dy={2} front="#e2e8f0" top="#ffffff" side="#cbd5e1" sw={1} />
          <g transform="translate(26, -24)" opacity={frame % 14 < 9 ? 1 : 0.35}>
            <rect x="-7" y="-7" width="14" height="12" rx="2" fill="#0f172a" />
            <text x="-3.5" y="2.5" fill="#f87171" fontSize="10" fontFamily="monospace" fontWeight="bold">X</text>
          </g>
        </g>

        {/* Bongkahan Puing Beton 3D Tempat Duduk */}
        <ellipse cx="106" cy="256" rx="74" ry="11" fill="rgba(15,23,42,0.45)" />
        <Box3D x={36} y={224} w={132} h={26} dx={12} dy={8} front="#64748b" top="#94a3b8" side="#475569" sw={2} />
        <rect x="52" y="233" width="16" height="3" fill="#334155" /><rect x="64" y="236" width="10" height="3" fill="#334155" />
        <Box3D x={182} y={240} w={14} h={10} dx={5} dy={4} front="#94a3b8" top="#cbd5e1" side="#475569" sw={1.4} />
        <Box3D x={18} y={244} w={11} h={8} dx={4} dy={3} front="#64748b" top="#94a3b8" side="#334155" sw={1.4} />
        {/* === CHIBI VOXEL 3D SI UDIN === */}
        <g transform={`translate(96, ${222 + bounce * 1.4})`}>
          <ellipse cx="4" cy="2" rx="28" ry="6" fill="rgba(15,23,42,0.34)" />

          {/* 2 Kaki Kubus Menjuntai & Bergoyang Rapi di Depan Balok */}
          <g transform={`translate(-10, -2) rotate(${legSwing})`}>
            <Box3D x={-7} y={0} w={14} h={17} dx={5} dy={4} front="#1d4ed8" top="#3b82f6" side="#1e3a8a" sw={1.8} />
            <rect x="-7" y="12" width="14" height="5" fill="#f8fafc" stroke="#0f172a" strokeWidth="1.5" />
          </g>
          <g transform={`translate(10, -2) rotate(${-legSwing})`}>
            <Box3D x={-7} y={0} w={14} h={17} dx={5} dy={4} front="#1d4ed8" top="#3b82f6" side="#1e3a8a" sw={1.8} />
            <rect x="-7" y="12" width="14" height="5" fill="#f8fafc" stroke="#0f172a" strokeWidth="1.5" />
          </g>

          {/* Badan Kubus Mungil */}
          <Box3D x={-19} y={-28} w={38} h={28} dx={9} dy={6} front="#dc2626" top="#ef4444" side="#991b1b" sw={1.9} />
          <rect x="-17" y="-10" width="34" height="4" fill="#991b1b" />

          {/* Tangan Kanan + Gelas Es Voxel 3D */}
          <Box3D x={19} y={-22} w={20} h={10} dx={5} dy={4} front="#dc2626" top="#ef4444" side="#991b1b" sw={1.7} />
          <Box3D x={37} y={-22} w={10} h={10} dx={4} dy={3} front="#fb7185" top="#fda4af" side="#e11d48" sw={1.7} />
          <g transform={`translate(45, ${-39 + bounce * 1.4}) rotate(${bounce * 2.5})`}>
            <g transform="translate(11, -1) rotate(24)">
              <rect x="-2" y="-12" width="4" height="14" fill="#ef4444" stroke="#0f172a" strokeWidth="1.3" />
              <rect x="-2" y="-9" width="4" height="3" fill="#ffffff" /><rect x="-2" y="-4" width="4" height="3" fill="#ffffff" />
            </g>
            <Box3D x={0} y={0} w={16} h={20} dx={5} dy={4} front="#38bdf8" top="#e0f2fe" side="#0284c7" sw={1.6} />
            <rect x="-1" y="-2" width="18" height="4" fill="#f8fafc" stroke="#0f172a" strokeWidth="1.4" />
            <rect x="3" y="5" width="5" height="5" fill="#e0f2fe" opacity="0.9" /><rect x="9" y="10" width="4" height="4" fill="#bae6fd" opacity="0.9" />
          </g>

          {/* Bahu Kiri Menyambut Siku */}
          <Box3D x={-31} y={-24} w={13} h={10} dx={4} dy={3} front="#dc2626" top="#ef4444" side="#991b1b" sw={1.7} />

          {/* KEPALA KUBUS BESAR + TANGAN TUTUP TELINGA (IKUT MIRING BERSAMA KEPALA!) */}
          <g transform={`translate(0, -28) rotate(${headTilt})`}>
            {/* Kepala Gosong + Rambut Voxel */}
            <Box3D x={-29} y={-56} w={58} h={56} dx={12} dy={9} front="#fb7185" top="#fda4af" side="#e11d48" sw={2.1} />
            <Box3D x={-31} y={-67} w={62} h={14} dx={12} dy={9} front="#3b1d0e" top="#5c2d16" side="#1f0e06" sw={2} />
            <rect x="-25" y="-53" width="11" height="7" fill="#3b1d0e" stroke="#0f172a" strokeWidth="1.4" />
            <rect x="11" y="-53" width="14" height="5" fill="#3b1d0e" stroke="#0f172a" strokeWidth="1.4" />

            {/* Pipi Gosong Merona */}
            <rect x="-24" y="-20" width="9" height="6" fill="#f43f5e" opacity={0.75 + bounce * 0.2} />
            <rect x="15" y="-20" width="9" height="6" fill="#f43f5e" opacity={0.75 + bounce * 0.2} />

            {/* Mata Ekspresif: Melotot <-> Menyipit (> <) */}
            {wince ? (
              <g stroke="#0f172a" strokeWidth="3.2" fill="none" strokeLinecap="square">
                <polyline points="-20,-40 -10,-34 -20,-28" />
                <polyline points="20,-40 10,-34 20,-28" />
              </g>
            ) : (
              <>
                <rect x="-21" y="-42" width="16" height="18" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
                <rect x="5" y="-42" width="16" height="18" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
                <rect x={-16 + pupilJit} y="-35" width="7" height="7" fill="#0f172a" />
                <rect x={10 - pupilJit} y="-35" width="7" height="7" fill="#0f172a" />
                <rect x={-15 + pupilJit} y="-34" width="3" height="3" fill="#ffffff" />
                <rect x={11 - pupilJit} y="-34" width="3" height="3" fill="#ffffff" />
              </>
            )}
            <g transform="translate(-13, -46) rotate(-14)"><rect x="-9" y="-2" width="18" height="4" fill="#29150b" /></g>
            <g transform="translate(13, -46) rotate(14)"><rect x="-9" y="-2" width="18" height="4" fill="#29150b" /></g>

            {/* Mulut Melongo Bergetar */}
            <rect x="-10" y="-17" width="20" height={wince ? 8 : 11 + (frame % 6 < 3 ? 2 : 0)} fill="#7f1d1d" stroke="#0f172a" strokeWidth="1.8" />
            <rect x="-8" y="-17" width="16" height="3.2" fill="#ffffff" />
            <rect x="-4" y="-10" width="8" height="3" fill="#fb7185" />

            {/* Tetesan Keringat + Uap Panas Naik Jauh di Atas Rambut (Bukan Tanduk!) */}
            <rect x="21" y={-48 + (frame % 14)} width="4" height="7" fill="#7dd3fc" stroke="#0f172a" strokeWidth="1" />
            {[-10, 8].map((ux, i) => {
              const p = ((frame + i * 12) % 24) / 24;
              return (
                <g key={i} opacity={Math.sin(p * Math.PI) * 0.85}>
                  <rect x={ux + Math.sin(p * 6) * 2} y={-90 - p * 18} width="6" height="5" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
                </g>
              );
            })}

            {/* Lengan & Telapak Kiri Menutup Rapat Sisi Telinga Kiri (Tanpa Menutupi Pipi!) */}
            <Box3D x={-41} y={-20} w={11} h={24} dx={4} dy={3} front="#dc2626" top="#ef4444" side="#991b1b" sw={1.7} />
            <Box3D x={-39} y={-33} w={11} h={14} dx={4} dy={3} front="#fb7185" top="#fda4af" side="#e11d48" sw={1.7} />

            {/* Gelombang Denging Telinga 100% Pixel-Art */}
            <g opacity={frame % 10 < 5 ? 1 : 0.25} fill="#fde047">
              <rect x="-49" y="-34" width="3" height="3" /><rect x="-52" y="-31" width="3" height="8" /><rect x="-49" y="-23" width="3" height="3" />
            </g>
            <g opacity={frame % 10 >= 5 ? 1 : 0.25} fill="#38bdf8">
              <rect x="-56" y="-38" width="3" height="3" /><rect x="-59" y="-35" width="3" height="16" /><rect x="-56" y="-19" width="3" height="3" />
            </g>
          </g>
        </g>
      </svg>

      <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24, backgroundColor: 'rgba(15, 23, 42, 0.92)', border: '4px solid #facc15', borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div><div style={{ fontFamily, fontSize: 16, color: '#facc15' }}>KOTA RATA PUING!</div><div style={{ fontFamily, fontSize: 13, color: '#38bdf8', marginTop: 8 }}>GOSONG + TELINGA BERDENGING</div></div>
        <div style={{ fontFamily, fontSize: 16, color: '#f87171' }}>5 DETIK!</div>
      </div>
    </div>
  );
};
