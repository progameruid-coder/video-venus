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
  const bounce = Math.sin(frame * 0.24);
  const sx = 1 + bounce * 0.028;
  const sy = 1 - bounce * 0.028;
  const pupilJit = Math.sin(frame * 0.55) * 1.4;

  return (
    <div style={{ position: 'absolute', top: 210, left: 60, right: 60, height: 1180, backgroundColor: '#0f172a', border: '8px solid #facc15', borderRadius: 28, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.88)', zIndex: 38 }}>
      <svg width="100%" height="100%" viewBox="0 0 240 310" preserveAspectRatio="xMidYMid slice" style={{ transform: `scale(${zoom})`, transformOrigin: '50% 58%' }}>
        <rect width="240" height="148" fill="#0284c7" /><rect y="84" width="240" height="64" fill="#38bdf8" />
        {/* Awan Voxel 3D */}
        <Box3D x={18} y={24} w={36} h={10} dx={6} dy={4} front="#f0f9ff" top="#ffffff" side="#bae6fd" sw={1.4} />
        <Box3D x={156} y={32} w={42} h={11} dx={6} dy={4} front="#f0f9ff" top="#ffffff" side="#bae6fd" sw={1.4} />

        {/* Puing Beton Voxel 3D Tidak Simetris */}
        <Box3D x={-4} y={122} w={44} h={34} dx={8} dy={6} front="#64748b" top="#94a3b8" side="#475569" sw={1.6} />
        <Box3D x={34} y={138} w={36} h={18} dx={6} dy={5} front="#94a3b8" top="#cbd5e1" side="#64748b" sw={1.6} />
        <Box3D x={172} y={130} w={56} h={26} dx={8} dy={6} front="#475569" top="#64748b" side="#334155" sw={1.6} />
        <rect x="24" y="102" width="3" height="20" fill="#1e293b" /><rect x="198" y="110" width="3" height="20" fill="#1e293b" />

        {/* Jalan Aspal & Taksi Voxel 3D Mogok */}
        <rect y="152" width="240" height="158" fill="#475569" /><rect y="150" width="240" height="5" fill="#94a3b8" />
        <g transform="translate(166, 160)">
          <ellipse cx="32" cy="20" rx="34" ry="7" fill="rgba(15,23,42,0.38)" />
          <Box3D x={0} y={0} w={54} h={15} dx={10} dy={7} front="#eab308" top="#facc15" side="#ca8a04" sw={1.6} />
          <Box3D x={11} y={-11} w={30} h={11} dx={9} dy={6} front="#fde047" top="#fef08a" side="#eab308" sw={1.6} />
          <rect x="14" y="-8" width="11" height="7" fill="#bae6fd" stroke="#0f172a" strokeWidth="1.2" />
          <rect x="27" y="-8" width="11" height="7" fill="#bae6fd" stroke="#0f172a" strokeWidth="1.2" />
          <rect x="6" y="11" width="11" height="9" fill="#0f172a" /><rect x="38" y="11" width="11" height="9" fill="#0f172a" />
          <Box3D x={-4} y={-14 - (frame % 18)} w={9} h={7} dx={4} dy={3} front="#e2e8f0" top="#ffffff" side="#cbd5e1" sw={1} />
        </g>

        {/* Bongkahan Puing Beton 3D Tempat Duduk Si Udin */}
        <ellipse cx="114" cy="252" rx="68" ry="11" fill="rgba(15,23,42,0.42)" />
        <Box3D x={46} y={224} w={128} h={24} dx={12} dy={8} front="#64748b" top="#94a3b8" side="#475569" sw={2} />
        {/* === CHIBI VOXEL 3D SI UDIN (GAYA HIDE.IO / MAGICA.IO) === */}
        <g transform={`translate(106, 220) scale(${sx}, ${sy})`}>
          <ellipse cx="4" cy="6" rx="34" ry="8" fill="rgba(15,23,42,0.35)" />

          {/* 2 Kaki Kubus Buntet + Sepatu */}
          <Box3D x={-23} y={-6} w={15} h={13} dx={5} dy={4} front="#1d4ed8" top="#3b82f6" side="#1e3a8a" sw={1.8} />
          <rect x="-23" y="3" width="15" height="4" fill="#f8fafc" stroke="#0f172a" strokeWidth="1.4" />
          <Box3D x={7} y={-6} w={15} h={13} dx={5} dy={4} front="#1d4ed8" top="#3b82f6" side="#1e3a8a" sw={1.8} />
          <rect x="7" y="3" width="15" height="4" fill="#f8fafc" stroke="#0f172a" strokeWidth="1.4" />

          {/* Badan Kubus Mungil */}
          <Box3D x={-21} y={-34} w={42} h={30} dx={10} dy={7} front="#dc2626" top="#ef4444" side="#991b1b" sw={1.9} />
          <rect x="-19" y="-12" width="38" height="4" fill="#991b1b" />

          {/* Tangan Kanan + Gelas Es Voxel 3D dengan Sedotan Miring */}
          <Box3D x={20} y={-27} w={13} h={11} dx={5} dy={4} front="#dc2626" top="#ef4444" side="#991b1b" sw={1.7} />
          <Box3D x={31} y={-26} w={10} h={10} dx={4} dy={3} front="#fb7185" top="#fda4af" side="#e11d48" sw={1.7} />
          <g transform={`translate(36, ${-43 + bounce * 1.1})`}>
            <g transform="translate(11, -1) rotate(24)">
              <rect x="-2" y="-12" width="4" height="14" fill="#ef4444" stroke="#0f172a" strokeWidth="1.3" />
              <rect x="-2" y="-9" width="4" height="3" fill="#ffffff" />
              <rect x="-2" y="-4" width="4" height="3" fill="#ffffff" />
            </g>
            <Box3D x={0} y={0} w={16} h={20} dx={5} dy={4} front="#38bdf8" top="#e0f2fe" side="#0284c7" sw={1.6} />
            <rect x="-1" y="-2" width="18" height="4" fill="#f8fafc" stroke="#0f172a" strokeWidth="1.4" />
            <rect x="3" y="5" width="5" height="5" fill="#e0f2fe" opacity="0.85" />
            <rect x="9" y="9" width="4" height="4" fill="#bae6fd" opacity="0.85" />
          </g>

          {/* Tangan Kiri Menekuk Pegang Telinga yang Berdenging */}
          <Box3D x={-35} y={-32} w={14} h={11} dx={5} dy={4} front="#dc2626" top="#ef4444" side="#991b1b" sw={1.7} />
          <Box3D x={-42} y={-53} w={12} h={23} dx={5} dy={4} front="#dc2626" top="#ef4444" side="#991b1b" sw={1.7} />
          <Box3D x={-40} y={-65} w={12} h={12} dx={4} dy={3} front="#fb7185" top="#fda4af" side="#e11d48" sw={1.7} />

          {/* KEPALA KUBUS BESAR CHIBI (MERAH GOSONG!) */}
          <g transform={`translate(${Math.sin(frame * 0.2) * 1.2}, 0)`}>
            <Box3D x={-32} y={-94} w={64} h={62} dx={14} dy={10} front="#fb7185" top="#fda4af" side="#e11d48" sw={2.1} />
            <Box3D x={-34} y={-106} w={68} h={16} dx={14} dy={10} front="#3b1d0e" top="#5c2d16" side="#1f0e06" sw={2} />
            <rect x="-28" y="-90" width="12" height="7" fill="#3b1d0e" stroke="#0f172a" strokeWidth="1.4" />
            <rect x="12" y="-90" width="15" height="5" fill="#3b1d0e" stroke="#0f172a" strokeWidth="1.4" />

            {/* Pipi Gosong Merona */}
            <rect x="-26" y="-54" width="10" height="6" fill="#f43f5e" />
            <rect x="16" y="-54" width="10" height="6" fill="#f43f5e" />

            {/* Mata Besar Ekspresif + Kilau + Alis Panik */}
            <rect x="-23" y="-75" width="17" height="19" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
            <rect x="6" y="-75" width="17" height="19" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
            <rect x={-17 + pupilJit} y="-68" width="7" height="7" fill="#0f172a" />
            <rect x={11 - pupilJit} y="-68" width="7" height="7" fill="#0f172a" />
            <rect x={-16 + pupilJit} y="-67" width="3" height="3" fill="#ffffff" />
            <rect x={12 - pupilJit} y="-67" width="3" height="3" fill="#ffffff" />
            <g transform="translate(-15, -79) rotate(-14)"><rect x="-9" y="-2" width="18" height="4" fill="#29150b" /></g>
            <g transform="translate(15, -79) rotate(14)"><rect x="-9" y="-2" width="18" height="4" fill="#29150b" /></g>

            {/* Mulut Melongo Komikal */}
            <rect x="-11" y="-49" width="22" height={10 + (frame % 8 < 4 ? 2 : 0)} fill="#7f1d1d" stroke="#0f172a" strokeWidth="1.8" />
            <rect x="-9" y="-49" width="18" height="3.5" fill="#ffffff" />
            <rect x="-5" y="-42" width="10" height="3.5" fill="#fb7185" />

            {/* Keringat + Uap Panas Voxel dari Kepala */}
            <rect x="24" y={-84 + (frame % 12)} width="4" height="7" fill="#7dd3fc" stroke="#0f172a" strokeWidth="1" />
            {[-14, 4, 22].map((ux, i) => (
              <rect key={i} x={ux} y={-124 - ((frame + i * 9) % 18)} width="6" height="6" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" opacity={0.85 - ((frame + i * 9) % 18) / 22} />
            ))}
            <text x="-58" y="-56" fill="#fde047" fontSize="15" fontFamily="monospace" fontWeight="bold" opacity={frame % 10 < 5 ? 1 : 0.3}>~</text>
            <text x="-67" y="-66" fill="#38bdf8" fontSize="13" fontFamily="monospace" fontWeight="bold" opacity={frame % 10 >= 5 ? 1 : 0.3}>~</text>
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
