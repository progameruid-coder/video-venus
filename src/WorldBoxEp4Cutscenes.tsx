import React from 'react';
import { interpolate } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PressStart2P';

const { fontFamily } = loadFont();

const Cut4Icon: React.FC<{ type: 'cannon' | 'dragon' | 'trophy' | 'gold'; size?: number }> = ({ type, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" shapeRendering="crispEdges">
    {type === 'cannon' && <><rect x="2" y="4" width="8" height="4" fill="#334155" /><rect x="3" y="8" width="6" height="3" fill="#78350f" /><rect x="9" y="5" width="2" height="2" fill="#f97316" /></>}
    {type === 'dragon' && <><rect x="2" y="3" width="7" height="6" fill="#dc2626" /><rect x="8" y="5" width="3" height="3" fill="#b91c1c" /><rect x="5" y="4" width="2" height="2" fill="#fde047" /></>}
    {type === 'trophy' && <><rect x="3" y="2" width="6" height="4" fill="#facc15" /><rect x="5" y="6" width="2" height="2" fill="#eab308" /><rect x="3" y="8" width="6" height="2" fill="#ca8a04" /></>}
    {type === 'gold' && <><rect x="2" y="5" width="8" height="4" fill="#ca8a04" /><rect x="3" y="4" width="6" height="3" fill="#facc15" /></>}
  </svg>
);

export const CloseUpBattle: React.FC<{ frame: number; localFrame: number }> = ({ frame, localFrame }) => {
  const hit = localFrame >= 156;
  const dead = localFrame >= 174;
  const shake = hit && localFrame < 194 ? Math.sin(frame * 2.6) * 4 : Math.sin(frame * 1.4) * 0.9;
  const wing = Math.sin(frame * 0.45) * 11;
  const jaw = Math.sin(frame * 0.48) * 4 + 2;
  const shotP = (localFrame % 38) / 38;
  const zoom = interpolate(localFrame, [0, 210], [1, 1.05], { extrapolateRight: 'clamp' });

  return (
    <div style={{ position: 'absolute', top: 215, left: 65, right: 65, height: 1170, backgroundColor: '#0f172a', border: '8px solid #38bdf8', borderRadius: 28, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.9)', zIndex: 38 }}>
      <svg width="100%" height="100%" viewBox="0 0 240 310" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges" style={{ transform: `translate(${shake}px, ${-shake * 0.5}px) scale(${zoom})`, transformOrigin: '50% 50%' }}>
        <rect width="240" height="190" fill="#1e293b" /><rect y="95" width="240" height="95" fill="#451a03" opacity="0.5" />
        {/* Siluet Kastil Emas di Latar Kiri */}
        <g transform="translate(14, 122)">
          <rect x="0" y="14" width="62" height="56" fill="#ca8a04" stroke="#0f172a" strokeWidth="2" />
          <rect x="-4" y="0" width="17" height="70" fill="#eab308" stroke="#0f172a" strokeWidth="2" />
          <rect x="49" y="0" width="17" height="70" fill="#eab308" stroke="#0f172a" strokeWidth="2" />
          <rect x="21" y="-10" width="20" height="26" fill="#facc15" stroke="#0f172a" strokeWidth="2" />
          <rect x="29" y="-24" width="3" height="14" fill="#0f172a" /><rect x="32" y="-24" width="14" height="8" fill="#2563eb" />
        </g>
        {/* Tembok Benteng Batu Depan */}
        <rect y="190" width="240" height="120" fill="#475569" /><rect y="182" width="240" height="16" fill="#94a3b8" stroke="#0f172a" strokeWidth="2" />
        {[8, 40, 72, 104, 136, 168, 200].map((bx) => <rect key={bx} x={bx} y="170" width="20" height="14" fill="#cbd5e1" stroke="#0f172a" strokeWidth="2" />)}
        {/* LEADER BIMA DI ATAS BENTENG (JUBAH + 2 TANGAN LENGKAP) */}
        <g transform="translate(46, 224)">
          <polygon points="-22,-18 -34,34 22,34 18,-18" fill="#1e3a8a" stroke="#0f172a" strokeWidth="2" />
          <rect x="-14" y="22" width="11" height="20" fill="#0f172a" /><rect x="3" y="22" width="11" height="20" fill="#0f172a" />
          <rect x="-28" y="-12" width="10" height="22" fill="#1d4ed8" stroke="#0f172a" strokeWidth="2" />
          <rect x="-27" y="9" width="8" height="8" fill="#fed7aa" stroke="#0f172a" strokeWidth="1.8" />
          <rect x="-20" y="-20" width="40" height="44" fill="#0f172a" /><rect x="-17" y="-17" width="34" height="38" fill="#1d4ed8" />
          <rect x="-11" y="-17" width="22" height="38" fill="#2563eb" /><rect x="-17" y="8" width="34" height="5" fill="#0f172a" /><rect x="-4" y="7" width="8" height="7" fill="#facc15" />
          <rect x="-18" y="-54" width="36" height="34" fill="#0f172a" /><rect x="-15" y="-51" width="30" height="28" fill="#fed7aa" />
          <rect x="-17" y="-59" width="34" height="11" fill="#3b2110" stroke="#0f172a" strokeWidth="2" />
          <rect x="-10" y="-45" width="7" height="2.5" fill="#3b2110" /><rect x="4" y="-45" width="7" height="2.5" fill="#3b2110" />
          <rect x="-9" y="-41" width="5" height="5" fill="#0f172a" /><rect x="5" y="-41" width="5" height="5" fill="#0f172a" />
          <rect x="-3" y="-31" width="10" height="4" fill="#7f1d1d" />
          <g transform="translate(0, -60)"><rect x="-15" y="-8" width="30" height="9" fill="#facc15" stroke="#0f172a" strokeWidth="2" /><rect x="-14" y="-14" width="7" height="7" fill="#fde047" /><rect x="-3.5" y="-16" width="7" height="9" fill="#fde047" /><rect x="7" y="-14" width="7" height="7" fill="#fde047" /></g>
          <g transform={`translate(18, -12) rotate(${-26 + Math.sin(frame * 0.4) * 7})`}>
            <rect x="-2" y="-4" width="14" height="9" fill="#2563eb" stroke="#0f172a" strokeWidth="2" />
            <rect x="12" y="-36" width="5" height="34" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1.8" />
            <rect x="6" y="-4" width="17" height="5" fill="#facc15" stroke="#0f172a" strokeWidth="1.4" />
            <rect x="10" y="0" width="9" height="9" fill="#fed7aa" stroke="#0f172a" strokeWidth="1.8" />
          </g>
        </g>

        {/* PRAJURIT PENEMBAK MERIAM + MERIAM BESAR */}
        <g transform="translate(95, 224)">
          <rect x="-8" y="10" width="6" height="12" fill="#0f172a" /><rect x="2" y="10" width="6" height="12" fill="#0f172a" />
          <rect x="-10" y="-10" width="20" height="22" fill="#2563eb" stroke="#0f172a" strokeWidth="2" />
          <rect x="-8" y="-26" width="16" height="16" fill="#fed7aa" stroke="#0f172a" strokeWidth="2" />
          <rect x="-9" y="-30" width="18" height="7" fill="#94a3b8" stroke="#0f172a" strokeWidth="1.8" />
          <rect x="2" y="-20" width="3" height="3" fill="#0f172a" />
          <rect x="7" y="-8" width="12" height="6" fill="#2563eb" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="17" y="-8" width="5" height="6" fill="#fed7aa" stroke="#0f172a" strokeWidth="1.2" />
          <rect x="19" y="-17" width="3" height="10" fill="#78350f" />
          <rect x="18" y="-22" width="5" height="6" fill={frame % 6 < 3 ? '#f97316' : '#fde047'} />
        </g>
        <g transform="translate(122, 210)">
          <rect x="-16" y="4" width="32" height="14" fill="#78350f" stroke="#0f172a" strokeWidth="2" />
          <circle cx="-8" cy="18" r="8" fill="#451a03" stroke="#0f172a" strokeWidth="2" />
          <circle cx="10" cy="18" r="8" fill="#451a03" stroke="#0f172a" strokeWidth="2" />
          <g transform="translate(0, 2) rotate(-52)">
            <rect x="-14" y="-9" width="38" height="16" fill="#334155" stroke="#0f172a" strokeWidth="2.5" />
            <rect x="20" y="-11" width="7" height="20" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
            {shotP < 0.25 && !dead && <><rect x="28" y="-14" width="14" height="24" fill="#f97316" /><rect x="28" y="-8" width="9" height="12" fill="#fde047" /></>}
          </g>
        </g>
        {!dead && (
          <g transform={`translate(${136 + shotP * 38}, ${188 - shotP * 76})`}>
            <rect x="-7" y="3" width="9" height="8" fill="#f97316" opacity="0.85" />
            <rect x="-5" y="-5" width="10" height="10" fill="#0f172a" stroke="#fde047" strokeWidth="1.5" />
          </g>
        )}
        {/* NAGA API DETAIL DI LANGIT KANAN */}
        {!dead && (
          <g transform={`translate(174, ${102 + Math.sin(frame * 0.3) * 4})`} opacity={hit && frame % 4 < 2 ? 0.4 : 1}>
            <g transform={`translate(6, -12) rotate(${-10 + wing})`}>
              <polygon points="0,0 44,-38 48,-8 32,-12 26,8 10,-6" fill="#991b1b" stroke="#0f172a" strokeWidth="2.5" />
              <polygon points="6,-4 36,-28 38,-10 22,-12" fill="#dc2626" />
            </g>
            <polygon points="24,18 52,26 42,36 18,28" fill="#7f1d1d" stroke="#0f172a" strokeWidth="2" />
            <rect x="-10" y="-6" width="38" height="36" fill="#991b1b" stroke="#0f172a" strokeWidth="2.5" />
            <rect x="-8" y="0" width="12" height="9" fill="#facc15" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="-6" y="11" width="12" height="9" fill="#eab308" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="-44" y="-26" width="46" height="26" fill="#dc2626" stroke="#0f172a" strokeWidth="2.5" />
            <rect x="-66" y="-18" width="28" height="18" fill="#b91c1c" stroke="#0f172a" strokeWidth="2.5" />
            <rect x="-4" y="-42" width="10" height="18" fill="#facc15" stroke="#0f172a" strokeWidth="2" />
            <rect x="-32" y="-20" width="12" height="9" fill="#fde047" stroke="#0f172a" strokeWidth="2" /><rect x="-28" y="-19" width="4" height="7" fill="#0f172a" />
            <rect x="-62" y="0" width="5" height="6" fill="#fff" /><rect x="-50" y="0" width="5" height="6" fill="#fff" />
            <g transform={`translate(-40, ${4 + jaw * 0.5})`}>
              <rect x="-24" y="0" width="46" height="10" fill="#991b1b" stroke="#0f172a" strokeWidth="2" />
              <rect x="-18" y="-5" width="5" height="5" fill="#fff" />
            </g>
            <g transform="translate(-66, -8) rotate(12)">
              <rect x={-48 - Math.sin(frame * 0.8) * 5} y="-10" width="48" height="20" fill="#dc2626" />
              <rect x={-36 - Math.cos(frame * 0.8) * 4} y="-6" width="36" height="12" fill="#f97316" />
              <rect x="-22" y="-4" width="22" height="8" fill="#fde047" />
            </g>
          </g>
        )}
        {hit && (
          <g transform="translate(174, 102)">
            {(() => {
              const a = localFrame - 156;
              return (
                <>
                  {a < 28 && <><rect x={-26 - a} y={-26 - a} width={52 + a * 2} height={52 + a * 2} fill="#f97316" opacity={Math.max(0, 1 - a / 28)} /><rect x={-16 - a * 0.6} y={-16 - a * 0.6} width={32 + a * 1.2} height={32 + a * 1.2} fill="#fde047" opacity={Math.max(0, 1 - a / 24)} /></>}
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => {
                    const ang = (k / 8) * Math.PI * 2;
                    return <rect key={k} x={Math.cos(ang) * a * 1.8 - 4} y={Math.sin(ang) * a * 1.8 - 4} width="8" height="8" fill={k % 2 === 0 ? '#fde047' : '#ffffff'} opacity={Math.max(0, 1 - a / 54)} />;
                  })}
                  {dead && <g transform={`translate(-54, -12) scale(${1 + Math.sin(frame * 0.35) * 0.04})`}><rect x="0" y="0" width="108" height="24" rx="5" fill="#0f172a" stroke="#facc15" strokeWidth="2.5" /><text x="12" y="15.5" fill="#fde047" fontSize="10" fontFamily="monospace" fontWeight="bold">NAGA KALAH!</text>{Math.sin(frame * 0.5) > 0 ? <><rect x="-12" y="-8" width="5" height="5" fill="#fde047" /><rect x="112" y="18" width="5" height="5" fill="#ffffff" /></> : <><rect x="112" y="-8" width="5" height="5" fill="#fde047" /><rect x="-12" y="18" width="5" height="5" fill="#ffffff" /></>}</g>}
                </>
              );
            })()}
          </g>
        )}
      </svg>
      <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24, backgroundColor: 'rgba(15, 23, 42, 0.92)', border: '4px solid #38bdf8', borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}><Cut4Icon type="cannon" size={32} /><div><div style={{ fontFamily, fontSize: 16, color: '#facc15' }}>MERIAM vs NAGA</div><div style={{ fontFamily, fontSize: 11, color: '#38bdf8', marginTop: 8 }}>PERTEMPURAN AKHIR</div></div></div>
        <Cut4Icon type="dragon" size={32} />
      </div>
    </div>
  );
};
export const CloseUpFinaleSplit: React.FC<{ frame: number; localFrame: number }> = ({ frame, localFrame }) => {
  const bob = Math.sin(frame * 0.28) * 2.5;
  const fw1 = (frame % 26) / 26;
  const fw2 = ((frame + 13) % 26) / 26;
  const zoom = interpolate(localFrame, [0, 220], [1, 1.05], { extrapolateRight: 'clamp' });
  return (
    <div style={{ position: 'absolute', top: 215, left: 65, right: 65, height: 1170, backgroundColor: '#0f172a', border: '8px solid #facc15', borderRadius: 28, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.9)', zIndex: 38 }}>
      <svg width="100%" height="100%" viewBox="0 0 240 310" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges" style={{ transform: `scale(${zoom})`, transformOrigin: '50% 55%' }}>
        {/* SISI KIRI: PULAU PINTAR MENANG + KEMBANG API + KASTIL DI HORIZON KIRI */}
        <rect x="0" y="0" width="120" height="168" fill="#0284c7" /><rect x="0" y="112" width="120" height="56" fill="#38bdf8" />
        <rect x="0" y="168" width="120" height="142" fill="#22c55e" /><rect x="0" y="168" width="120" height="12" fill="#4ade80" />
        {[0, 1, 2, 3, 4, 5].map((k) => {
          const a = (k / 6) * Math.PI * 2;
          return (
            <g key={k}>
              <rect x={28 + Math.cos(a) * fw1 * 22 - 2} y={62 + Math.sin(a) * fw1 * 20 - 2} width="4" height="4" fill={k % 2 === 0 ? '#fde047' : '#ffffff'} opacity={1 - fw1} />
              <rect x={92 + Math.cos(a) * fw2 * 20 - 2} y={72 + Math.sin(a) * fw2 * 18 - 2} width="4" height="4" fill={k % 2 === 0 ? '#f472b6' : '#fde047'} opacity={1 - fw2} />
            </g>
          );
        })}
        {/* Kastil Emas Mini di Bukit Kiri Jauh (Bebas 100% dari Piala Bima!) */}
        <g transform="translate(6, 134)">
          <rect x="2" y="10" width="28" height="24" fill="#ca8a04" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="0" y="2" width="9" height="32" fill="#facc15" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="23" y="2" width="9" height="32" fill="#facc15" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="14" y="-6" width="2" height="10" fill="#0f172a" /><rect x="16" y="-6" width="8" height="5" fill="#2563eb" />
        </g>
        {/* LEADER BIMA MENGANGKAT PIALA EMAS DENGAN KEDUA TANGAN */}
        <g transform={`translate(66, ${234 - Math.abs(bob)})`}>
          <ellipse cx="0" cy={38 + Math.abs(bob)} rx="24" ry="6" fill="rgba(15,23,42,0.35)" />
          <rect x="-12" y="18" width="10" height="20" fill="#0f172a" /><rect x="2" y="18" width="10" height="20" fill="#0f172a" />
          {/* Bahu & Lengan Menekuk Rapi Mengangkat Piala */}
          <rect x="-28" y="-17" width="12" height="9" fill="#1d4ed8" stroke="#0f172a" strokeWidth="2" />
          <rect x="16" y="-17" width="12" height="9" fill="#1d4ed8" stroke="#0f172a" strokeWidth="2" />
          <rect x="-28" y="-73" width="9" height="60" fill="#2563eb" stroke="#0f172a" strokeWidth="2" />
          <rect x="19" y="-73" width="9" height="60" fill="#2563eb" stroke="#0f172a" strokeWidth="2" />
          <rect x="-24" y="-82" width="10" height="10" fill="#fed7aa" stroke="#0f172a" strokeWidth="2" />
          <rect x="14" y="-82" width="10" height="10" fill="#fed7aa" stroke="#0f172a" strokeWidth="2" />
          <rect x="-18" y="-18" width="36" height="38" fill="#0f172a" /><rect x="-15" y="-15" width="30" height="32" fill="#2563eb" />
          <rect x="-15" y="4" width="30" height="4" fill="#0f172a" /><rect x="-3" y="3" width="6" height="6" fill="#facc15" />
          <rect x="-16" y="-50" width="32" height="32" fill="#0f172a" /><rect x="-13" y="-47" width="26" height="26" fill="#fed7aa" />
          <rect x="-15" y="-54" width="30" height="10" fill="#3b2110" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="-9" y="-39" width="5" height="5" fill="#0f172a" /><rect x="4" y="-39" width="5" height="5" fill="#0f172a" />
          <rect x="-8" y="-38" width="2" height="2" fill="#fff" /><rect x="5" y="-38" width="2" height="2" fill="#fff" />
          <rect x="-7" y="-29" width="14" height="6" fill="#7f1d1d" /><rect x="-5" y="-28" width="10" height="2.5" fill="#fff" />
          <g transform="translate(0, -54)"><rect x="-13" y="-7" width="26" height="8" fill="#facc15" stroke="#0f172a" strokeWidth="1.5" /><rect x="-12" y="-11" width="6" height="5" fill="#fde047" /><rect x="-3" y="-13" width="6" height="7" fill="#fde047" /><rect x="6" y="-11" width="6" height="5" fill="#fde047" /></g>
          <g transform="translate(0, -90)">
            <rect x="-17" y="4" width="6" height="9" fill="none" stroke="#eab308" strokeWidth="2.5" />
            <rect x="11" y="4" width="6" height="9" fill="none" stroke="#eab308" strokeWidth="2.5" />
            <rect x="-12" y="0" width="24" height="15" fill="#facc15" stroke="#0f172a" strokeWidth="2" />
            <rect x="-8" y="3" width="6" height="9" fill="#fef08a" />
            <rect x="-4" y="15" width="8" height="4" fill="#eab308" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="-10" y="19" width="20" height="4" fill="#ca8a04" stroke="#0f172a" strokeWidth="1.5" />
            {Math.sin(frame * 0.45) > 0 && <rect x="10" y="-6" width="5" height="5" fill="#ffffff" />}
          </g>
        </g>
        <g transform="translate(12, 16)"><rect x="0" y="0" width="96" height="19" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" /><text x="10" y="13" fill="#38bdf8" fontSize="8.5" fontFamily="monospace" fontWeight="bold">MENANG! 310</text></g>
        {/* GARIS PEMISAH TENGAH */}
        <rect x="117" y="0" width="6" height="310" fill="#0f172a" />
        {/* SISI KANAN: PULAU BODOH GOSONG BERASAP + UDIN MEMELUK PATUNG EMAS */}
        <rect x="123" y="0" width="117" height="168" fill="#1e293b" /><rect x="123" y="106" width="117" height="62" fill="#334155" />
        <rect x="123" y="168" width="117" height="142" fill="#292524" /><rect x="123" y="168" width="117" height="12" fill="#44403c" />
        {/* Asap & Tunggul Pohon Gosong di Latar */}
        {[0, 1, 2].map((i) => {
          const sy = (frame * 1.1 + i * 28) % 85;
          return <rect key={i} x={134 + i * 32 + Math.sin(frame * 0.1 + i) * 4} y={160 - sy} width="14" height="9" fill="#64748b" opacity={Math.max(0, 0.55 - sy / 140)} />;
        })}
        <rect x="130" y="160" width="12" height="10" fill="#1c1917" stroke="#0f172a" strokeWidth="1.5" />
        <rect x="148" y="164" width="10" height="6" fill="#44403c" />
        {/* Patung Emas Moai Tetap Utuh Berkilau */}
        <g transform="translate(198, 224)">
          <rect x="-24" y="18" width="48" height="10" fill="#475569" stroke="#0f172a" strokeWidth="2" />
          <rect x="-20" y="-56" width="40" height="76" fill="#ca8a04" stroke="#0f172a" strokeWidth="2.5" />
          <rect x="-16" y="-52" width="14" height="68" fill="#facc15" /><rect x="-13" y="-38" width="26" height="7" fill="#854d0e" />
          <rect x="-4" y="-28" width="8" height="18" fill="#a16207" />
          {Math.sin(frame * 0.4) > 0 && <rect x="10" y="-48" width="6" height="6" fill="#ffffff" />}
        </g>
        {/* Puing Gubuk Gosong & Bara Kecil di Latar Kanan */}
        <polygon points="128,168 142,155 156,168" fill="#1c1917" stroke="#0f172a" strokeWidth="1.5" />
        <rect x="137" y="164" width="4" height="4" fill={frame % 8 < 4 ? '#f97316' : '#fde047'} />
        {/* LEADER UDIN GOSONG BANGGA MEMELUK PATUNG EMAS (PAS 2 TANGAN!) */}
        <g transform={`translate(160, ${234 + bob * 0.4})`}>
          <ellipse cx="0" cy={38 - bob * 0.4} rx="22" ry="6" fill="rgba(15,23,42,0.45)" />
          {/* Tangan Kanan (Belakang): Memeluk Sisi Belakang Patung */}
          <rect x="12" y="-15" width="9" height="9" fill="#991b1b" stroke="#0f172a" strokeWidth="1.8" />
          <rect x="-11" y="18" width="9" height="20" fill="#0f172a" /><rect x="2" y="18" width="9" height="20" fill="#0f172a" />
          <rect x="-17" y="-18" width="34" height="38" fill="#0f172a" /><rect x="-14" y="-15" width="28" height="32" fill="#dc2626" />
          <rect x="-6" y="-12" width="8" height="6" fill="#1c1917" opacity="0.45" />
          {/* Tangan Kiri (Depan): Menekuk dari Bahu Kiri Melintasi Dada Memeluk Patung */}
          <rect x="-19" y="-14" width="9" height="19" fill="#dc2626" stroke="#0f172a" strokeWidth="2" />
          <rect x="-19" y="-3" width="50" height="9" fill="#dc2626" stroke="#0f172a" strokeWidth="2" />
          <rect x="-17" y="-11" width="5" height="9" fill="#dc2626" />
          <rect x="29" y="-3" width="9" height="9" fill="#fed7aa" stroke="#0f172a" strokeWidth="1.8" />
          <rect x="-15" y="-50" width="30" height="32" fill="#0f172a" /><rect x="-12" y="-47" width="24" height="26" fill="#fed7aa" />
          <rect x="-14" y="-54" width="28" height="10" fill="#29150b" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="-9" y="-33" width="6" height="4" fill="#1c1917" opacity="0.45" />
          <rect x="-9" y="-42" width="6" height="6" fill="#0f172a" /><rect x="3" y="-42" width="6" height="6" fill="#0f172a" />
          <rect x="-8" y="-41" width="2.5" height="2.5" fill="#fde047" /><rect x="4" y="-41" width="2.5" height="2.5" fill="#fde047" />
          <rect x="-7" y="-29" width="14" height="6" fill="#7f1d1d" /><rect x="-5" y="-28" width="10" height="2.5" fill="#fff" />
          <g transform="translate(2, -53) rotate(12)"><rect x="-12" y="-7" width="24" height="8" fill="#facc15" stroke="#0f172a" strokeWidth="1.5" /><rect x="-11" y="-11" width="5" height="5" fill="#fde047" /><rect x="-3" y="-13" width="6" height="7" fill="#fde047" /><rect x="6" y="-11" width="5" height="5" fill="#fde047" /></g>
        </g>
        <g transform="translate(128, 16)"><rect x="0" y="0" width="106" height="19" rx="4" fill="#0f172a" stroke="#facc15" strokeWidth="2" /><text x="6" y="13" fill="#fde047" fontSize="7.5" fontFamily="monospace" fontWeight="bold">PATUNG SELAMAT!</text></g>
      </svg>
      <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24, backgroundColor: 'rgba(15, 23, 42, 0.92)', border: '4px solid #facc15', borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}><Cut4Icon type="trophy" size={32} /><div><div style={{ fontFamily, fontSize: 16, color: '#facc15' }}>TAHUN KE-50!</div><div style={{ fontFamily, fontSize: 11, color: '#38bdf8', marginTop: 8 }}>BIMA vs UDIN • FINAL</div></div></div>
        <Cut4Icon type="gold" size={32} />
      </div>
    </div>
  );
};
