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
  const zoom = interpolate(localFrame, [0, 150], [1, 1.05], { extrapolateRight: 'clamp' });
  const bounce = Math.sin(frame * 0.28);
  const sx = 1 + bounce * 0.032;
  const sy = 1 - bounce * 0.032;
  const headTilt = Math.sin(frame * 0.2) * 3.8;
  const legSwing = Math.sin(frame * 0.3) * 8;
  const earPress = Math.sin(frame * 0.5) * 1.8;
  const wince = (frame % 36) > 24;
  const pupilJit = Math.sin(frame * 0.65) * 1.6;

  return (
    <div style={{ position: 'absolute', top: 210, left: 60, right: 60, height: 1180, backgroundColor: '#0f172a', border: '8px solid #facc15', borderRadius: 28, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.88)', zIndex: 38 }}>
      <svg width="100%" height="100%" viewBox="0 0 240 310" preserveAspectRatio="xMidYMid slice" style={{ transform: `scale(${zoom})`, transformOrigin: '50% 56%' }}>
        <rect width="240" height="148" fill="#0284c7" /><rect y="84" width="240" height="64" fill="#38bdf8" />
        {/* Awan Voxel 3D Bergerak Halus */}
        <Box3D x={16 + (localFrame * 0.12)} y={24} w={36} h={10} dx={6} dy={4} front="#f0f9ff" top="#ffffff" side="#bae6fd" sw={1.4} />
        <Box3D x={156 - (localFrame * 0.08)} y={32} w={42} h={11} dx={6} dy={4} front="#f0f9ff" top="#ffffff" side="#bae6fd" sw={1.4} />

        {/* Tumpukan Puing Beton Patah Voxel 3D (Bukan Kotak Rapi!) */}
        <polygon points="-4,154 22,124 52,134 74,154" fill="#64748b" stroke="#0f172a" strokeWidth="1.8" />
        <Box3D x={6} y={136} w={22} h={16} dx={6} dy={4} front="#94a3b8" top="#cbd5e1" side="#475569" sw={1.5} />
        <Box3D x={34} y={142} w={16} h={11} dx={5} dy={4} front="#475569" top="#64748b" side="#334155" sw={1.5} />
        <polygon points="164,154 188,128 214,136 244,120 244,154" fill="#475569" stroke="#0f172a" strokeWidth="1.8" />
        <Box3D x={182} y={138} w={24} h={14} dx={6} dy={4} front="#64748b" top="#94a3b8" side="#334155" sw={1.5} />
        <Box3D x={210} y={132} w={20} h={18} dx={6} dy={4} front="#94a3b8" top="#cbd5e1" side="#64748b" sw={1.5} />
        <line x1="22" y1="124" x2="18" y2="108" stroke="#1e293b" strokeWidth="2.2" />
        <line x1="204" y1="130" x2="212" y2="112" stroke="#1e293b" strokeWidth="2.2" />
        {[0, 1, 2].map((i) => <rect key={i} x={18 + i * 86} y={116 - ((frame + i * 11) % 20)} width="7" height="7" fill="#e2e8f0" opacity={0.65 - ((frame + i * 11) % 20) / 30} />)}

        {/* Jalan Aspal, Retakan & Taksi Voxel 3D Mogok */}
        <rect y="152" width="240" height="158" fill="#475569" /><rect y="150" width="240" height="5" fill="#94a3b8" />
        <rect x="18" y="196" width="22" height="3" fill="#1e293b" /><rect x="34" y="199" width="14" height="3" fill="#1e293b" />
        <g transform="translate(172, 162)">
          <ellipse cx="32" cy="20" rx="34" ry="7" fill="rgba(15,23,42,0.4)" />
          <Box3D x={0} y={0} w={52} h={15} dx={10} dy={7} front="#eab308" top="#facc15" side="#ca8a04" sw={1.6} />
          <Box3D x={11} y={-11} w={28} h={11} dx={9} dy={6} front="#fde047" top="#fef08a" side="#eab308" sw={1.6} />
          <rect x="20" y="-17" width="11" height="5" fill="#fef08a" stroke="#0f172a" strokeWidth="1.2" />
          <rect x="14" y="-8" width="10" height="7" fill="#bae6fd" stroke="#0f172a" strokeWidth="1.2" />
          <rect x="26" y="-8" width="10" height="7" fill="#bae6fd" stroke="#0f172a" strokeWidth="1.2" />
          <rect x="5" y="11" width="11" height="9" fill="#0f172a" /><rect x="8" y="13" width="5" height="5" fill="#94a3b8" />
          <rect x="36" y="11" width="11" height="9" fill="#0f172a" /><rect x="39" y="13" width="5" height="5" fill="#94a3b8" />
          <Box3D x={2} y={-12 - (frame % 18)} w={8} h={7} dx={4} dy={3} front="#e2e8f0" top="#ffffff" side="#cbd5e1" sw={1} />
        </g>

        {/* Bongkahan Puing Beton 3D Tempat Duduk + Serpihan Kubus */}
        <ellipse cx="106" cy="256" rx="72" ry="11" fill="rgba(15,23,42,0.45)" />
        <Box3D x={38} y={224} w={132} h={26} dx={12} dy={8} front="#64748b" top="#94a3b8" side="#475569" sw={2} />
        <rect x="52" y="232" width="16" height="3" fill="#334155" /><rect x="64" y="235" width="10" height="3" fill="#334155" />
        <Box3D x={182} y={240} w={14} h={10} dx={5} dy={4} front="#94a3b8" top="#cbd5e1" side="#475569" sw={1.4} />
        <Box3D x={20} y={244} w={11} h={8} dx={4} dy={3} front="#64748b" top="#94a3b8" side="#334155" sw={1.4} />
        {/* === CHIBI VOXEL 3D SI UDIN (EKSPRESIF, KAKI MENJUNTAI, BEBAS TABRAKAN) === */}
        <g transform={`translate(96, 220) scale(${sx}, ${sy})`}>
          <ellipse cx="4" cy="4" rx="30" ry="7" fill="rgba(15,23,42,0.35)" />

          {/* 2 Kaki Kubus Buntet Menjuntai di Tepi Puing & Bergoyang Lucu */}
          <g transform={`translate(-11, -1) rotate(${legSwing})`}>
            <Box3D x={-7} y={0} w={14} h={17} dx={5} dy={4} front="#1d4ed8" top="#3b82f6" side="#1e3a8a" sw={1.8} />
            <rect x="-7" y="12" width="14" height="5" fill="#f8fafc" stroke="#0f172a" strokeWidth="1.5" />
          </g>
          <g transform={`translate(11, -1) rotate(${-legSwing})`}>
            <Box3D x={-7} y={0} w={14} h={17} dx={5} dy={4} front="#1d4ed8" top="#3b82f6" side="#1e3a8a" sw={1.8} />
            <rect x="-7" y="12" width="14" height="5" fill="#f8fafc" stroke="#0f172a" strokeWidth="1.5" />
          </g>

          {/* Badan Kubus Mungil */}
          <Box3D x={-19} y={-28} w={38} h={28} dx={9} dy={6} front="#dc2626" top="#ef4444" side="#991b1b" sw={1.9} />
          <rect x="-17" y="-10" width="34" height="4" fill="#991b1b" />

          {/* Tangan Kanan Terulur ke Kanan + Gelas Es Voxel (100% BEBAS DARI KEPALA!) */}
          <Box3D x={19} y={-22} w={20} h={10} dx={5} dy={4} front="#dc2626" top="#ef4444" side="#991b1b" sw={1.7} />
          <Box3D x={37} y={-22} w={10} h={10} dx={4} dy={3} front="#fb7185" top="#fda4af" side="#e11d48" sw={1.7} />
          <g transform={`translate(45, ${-39 + bounce * 1.6}) rotate(${bounce * 3})`}>
            <g transform="translate(11, -1) rotate(24)">
              <rect x="-2" y="-12" width="4" height="14" fill="#ef4444" stroke="#0f172a" strokeWidth="1.3" />
              <rect x="-2" y="-9" width="4" height="3" fill="#ffffff" /><rect x="-2" y="-4" width="4" height="3" fill="#ffffff" />
            </g>
            <Box3D x={0} y={0} w={16} h={20} dx={5} dy={4} front="#38bdf8" top="#e0f2fe" side="#0284c7" sw={1.6} />
            <rect x="-1" y="-2" width="18" height="4" fill="#f8fafc" stroke="#0f172a" strokeWidth="1.4" />
            <rect x="3" y="5" width="5" height="5" fill="#e0f2fe" opacity="0.9" /><rect x="9" y="10" width="4" height="4" fill="#bae6fd" opacity="0.9" />
          </g>

          {/* KEPALA KUBUS BESAR CHIBI BERGOYANG + TELINGA VOXEL */}
          <g transform={`translate(0, -28) rotate(${headTilt})`}>
            {/* Telinga Kiri Voxel (Tempat Tangan Menutup!) */}
            <Box3D x={-36} y={-34} w={8} h={13} dx={4} dy={3} front="#fb7185" top="#fda4af" side="#e11d48" sw={1.7} />
            <Box3D x={-29} y={-56} w={58} h={56} dx={12} dy={9} front="#fb7185" top="#fda4af" side="#e11d48" sw={2.1} />
            <Box3D x={-31} y={-67} w={62} h={14} dx={12} dy={9} front="#3b1d0e" top="#5c2d16" side="#1f0e06" sw={2} />
            <rect x="-25" y="-53" width="11" height="7" fill="#3b1d0e" stroke="#0f172a" strokeWidth="1.4" />
            <rect x="11" y="-53" width="14" height="5" fill="#3b1d0e" stroke="#0f172a" strokeWidth="1.4" />

            {/* Pipi Gosong Merona Berdenyut */}
            <rect x="-24" y="-20" width="9" height="6" fill="#f43f5e" opacity={0.75 + bounce * 0.2} />
            <rect x="15" y="-20" width="9" height="6" fill="#f43f5e" opacity={0.75 + bounce * 0.2} />

            {/* Mata Ekspresif: Bergantian Kaget Melotot <-> Menyipit (> <) Kesakitan! */}
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

            {/* Keringat & Uap Panas Voxel Naik */}
            <rect x="21" y={-48 + (frame % 14)} width="4" height="7" fill="#7dd3fc" stroke="#0f172a" strokeWidth="1" />
            {[-12, 5, 20].map((ux, i) => (
              <rect key={i} x={ux} y={-82 - ((frame + i * 9) % 18)} width="6" height="6" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" opacity={0.85 - ((frame + i * 9) % 18) / 22} />
            ))}
          </g>

          {/* Lengan Kiri (DI DEPAN KEPALA) Menekuk Rapat Menutup Telinga Kiri + Gelombang Denging! */}
          <g transform={`translate(${earPress}, 0)`}>
            <Box3D x={-32} y={-25} w={15} h={10} dx={4} dy={3} front="#dc2626" top="#ef4444" side="#991b1b" sw={1.7} />
            <Box3D x={-40} y={-47} w={11} h={25} dx={4} dy={3} front="#dc2626" top="#ef4444" side="#991b1b" sw={1.7} />
            <Box3D x={-38} y={-59} w={12} h={12} dx={4} dy={3} front="#fb7185" top="#fda4af" side="#e11d48" sw={1.7} />
            <path d="M -48 -58 Q -54 -52 -48 -46" stroke="#fde047" strokeWidth="2.8" fill="none" opacity={frame % 10 < 5 ? 1 : 0.25} />
            <path d="M -56 -63 Q -64 -52 -56 -41" stroke="#38bdf8" strokeWidth="2.4" fill="none" opacity={frame % 10 >= 5 ? 1 : 0.25} />
          </g>
        </g>
      </svg>

      <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24, backgroundColor: 'rgba(15, 23, 42, 0.92)', border: '4px solid #facc15', borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div><div style={{ fontFamily, fontSize: 16, color: '#facc15' }}>KOTA RATA PUING!</div><div style={{ fontFamily, fontSize: 11, color: '#38bdf8', marginTop: 8 }}>GOSONG + TELINGA BERDENGING</div></div>
        <div style={{ fontFamily, fontSize: 16, color: '#f87171' }}>5 DETIK!</div>
      </div>
    </div>
  );
};
