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
  const hit = localFrame >= 132;
  const dead = localFrame >= 152;
  const shake = hit && localFrame < 175 ? Math.sin(frame * 2.6) * 4 : Math.sin(frame * 1.4) * 1;
  const wing = Math.sin(frame * 0.45) * 12;
  const shotP = (localFrame % 44) / 44;
  const zoom = interpolate(localFrame, [0, 210], [1, 1.06], { extrapolateRight: 'clamp' });

  return (
    <div style={{ position: 'absolute', top: 215, left: 65, right: 65, height: 1170, backgroundColor: '#0f172a', border: '8px solid #38bdf8', borderRadius: 28, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.9)', zIndex: 38 }}>
      <svg width="100%" height="100%" viewBox="0 0 240 310" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges" style={{ transform: `translate(${shake}px, ${-shake * 0.5}px) scale(${zoom})`, transformOrigin: '50% 50%' }}>
        <rect width="240" height="190" fill="#1e293b" /><rect y="95" width="240" height="95" fill="#451a03" opacity="0.55" />
        {/* Siluet Kastil Emas di Latar Kiri */}
        <g transform="translate(18, 120)">
          <rect x="0" y="14" width="64" height="58" fill="#ca8a04" stroke="#0f172a" strokeWidth="2" />
          <rect x="-4" y="0" width="18" height="72" fill="#eab308" stroke="#0f172a" strokeWidth="2" />
          <rect x="50" y="0" width="18" height="72" fill="#eab308" stroke="#0f172a" strokeWidth="2" />
          <rect x="22" y="-12" width="20" height="28" fill="#facc15" stroke="#0f172a" strokeWidth="2" />
          <rect x="30" y="-26" width="3" height="14" fill="#0f172a" /><rect x="33" y="-26" width="14" height="8" fill="#2563eb" />
        </g>
        {/* Tembok Benteng Batu Depan */}
        <rect y="190" width="240" height="120" fill="#475569" /><rect y="182" width="240" height="16" fill="#94a3b8" stroke="#0f172a" strokeWidth="2" />
        {[8, 40, 72, 104, 136, 168, 200].map((bx) => <rect key={bx} x={bx} y="170" width="20" height="14" fill="#cbd5e1" stroke="#0f172a" strokeWidth="2" />)}
        {/* LEADER BIMA DI ATAS BENTENG MENGACUNGKAN PEDANG */}
        <g transform="translate(52, 224)">
          <rect x="-14" y="22" width="11" height="20" fill="#0f172a" /><rect x="3" y="22" width="11" height="20" fill="#0f172a" />
          <rect x="-29" y="-12" width="10" height="24" fill="#1d4ed8" stroke="#0f172a" strokeWidth="2" />
          <rect x="-20" y="-20" width="40" height="44" fill="#0f172a" /><rect x="-17" y="-17" width="34" height="38" fill="#1d4ed8" />
          <rect x="-11" y="-17" width="22" height="38" fill="#2563eb" /><rect x="-17" y="8" width="34" height="5" fill="#0f172a" /><rect x="-4" y="7" width="8" height="7" fill="#facc15" />
          <rect x="-18" y="-54" width="36" height="34" fill="#0f172a" /><rect x="-15" y="-51" width="30" height="28" fill="#fed7aa" />
          <rect x="-17" y="-59" width="34" height="11" fill="#3b2110" stroke="#0f172a" strokeWidth="2" />
          <rect x="-9" y="-42" width="6" height="6" fill="#0f172a" /><rect x="5" y="-42" width="6" height="6" fill="#0f172a" />
          <rect x="-3" y="-31" width="10" height="4" fill="#7f1d1d" />
          <g transform="translate(0, -60)"><rect x="-15" y="-8" width="30" height="9" fill="#facc15" stroke="#0f172a" strokeWidth="2" /><rect x="-14" y="-14" width="7" height="7" fill="#fde047" /><rect x="-3.5" y="-16" width="7" height="9" fill="#fde047" /><rect x="7" y="-14" width="7" height="7" fill="#fde047" /></g>
          {/* Lengan Kanan Mengacungkan Pedang Menunjuk Naga */}
          <g transform={`translate(18, -14) rotate(${-35 + Math.sin(frame * 0.4) * 8})`}>
            <rect x="0" y="-4" width="14" height="10" fill="#2563eb" stroke="#0f172a" strokeWidth="2" />
            <rect x="10" y="-4" width="9" height="9" fill="#fed7aa" stroke="#0f172a" strokeWidth="1.8" />
            <rect x="14" y="-36" width="5" height="34" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1.8" />
            <rect x="8" y="-5" width="16" height="5" fill="#facc15" stroke="#0f172a" strokeWidth="1.4" />
          </g>
        </g>

        {/* MERIAM BESAR & PELURU MERIAM MELESAT KE NAGA */}
        <g transform="translate(116, 212)">
          <rect x="-16" y="4" width="32" height="14" fill="#78350f" stroke="#0f172a" strokeWidth="2" />
          <circle cx="-8" cy="18" r="8" fill="#451a03" stroke="#0f172a" strokeWidth="2" />
          <circle cx="10" cy="18" r="8" fill="#451a03" stroke="#0f172a" strokeWidth="2" />
          <g transform="translate(0, 2) rotate(-42)">
            <rect x="-14" y="-9" width="38" height="16" fill="#334155" stroke="#0f172a" strokeWidth="2.5" />
            <rect x="20" y="-11" width="7" height="20" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
            {shotP < 0.25 && !dead && <><rect x="28" y="-14" width="14" height="24" fill="#f97316" /><rect x="28" y="-8" width="9" height="12" fill="#fde047" /></>}
          </g>
        </g>
        {!dead && (
          <g transform={`translate(${136 + shotP * 48}, ${186 - shotP * 86})`}>
            <rect x="-8" y="2" width="10" height="8" fill="#f97316" opacity="0.8" />
            <rect x="-5" y="-5" width="10" height="10" fill="#0f172a" stroke="#fde047" strokeWidth="1.5" />
          </g>
        )}
        {/* NAGA API DI LANGIT KANAN -> TERKENA MERIAM & MELEDAK */}
        {!dead && (
          <g transform={`translate(182, ${94 + Math.sin(frame * 0.3) * 4})`} opacity={hit && frame % 4 < 2 ? 0.45 : 1}>
            <g transform={`translate(8, -14) rotate(${-10 + wing})`}>
              <polygon points="0,0 44,-40 50,-10 34,-14 28,8 12,-6" fill="#991b1b" stroke="#0f172a" strokeWidth="2.5" />
              <polygon points="6,-4 36,-30 40,-12 24,-14" fill="#dc2626" />
            </g>
            <rect x="-10" y="-8" width="38" height="36" fill="#991b1b" stroke="#0f172a" strokeWidth="2.5" />
            <rect x="-8" y="0" width="12" height="24" fill="#facc15" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="-46" y="-26" width="48" height="28" fill="#dc2626" stroke="#0f172a" strokeWidth="2.5" />
            <rect x="-66" y="-18" width="26" height="18" fill="#b91c1c" stroke="#0f172a" strokeWidth="2.5" />
            <rect x="-6" y="-42" width="10" height="18" fill="#facc15" stroke="#0f172a" strokeWidth="2" />
            <rect x="-34" y="-20" width="12" height="9" fill="#fde047" stroke="#0f172a" strokeWidth="2" /><rect x="-30" y="-19" width="4" height="7" fill="#0f172a" />
            <rect x="-62" y="0" width="5" height="6" fill="#fff" /><rect x="-50" y="0" width="5" height="6" fill="#fff" />
            <g transform="translate(-66, -6) rotate(14)">
              <rect x={-48 - Math.sin(frame * 0.8) * 5} y="-10" width="48" height="20" fill="#dc2626" />
              <rect x={-36 - Math.cos(frame * 0.8) * 4} y="-6" width="36" height="12" fill="#f97316" />
              <rect x="-22" y="-4" width="22" height="8" fill="#fde047" />
            </g>
          </g>
        )}
        {hit && (
          <g transform="translate(174, 96)">
            {(() => {
              const a = localFrame - 132;
              return (
                <>
                  {a < 28 && <><rect x={-26 - a} y={-26 - a} width={52 + a * 2} height={52 + a * 2} fill="#f97316" opacity={Math.max(0, 1 - a / 28)} /><rect x={-16 - a * 0.6} y={-16 - a * 0.6} width={32 + a * 1.2} height={32 + a * 1.2} fill="#fde047" opacity={Math.max(0, 1 - a / 24)} /></>}
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => {
                    const ang = (k / 8) * Math.PI * 2;
                    return <rect key={k} x={Math.cos(ang) * a * 2.1 - 4} y={Math.sin(ang) * a * 2.1 - 4} width="8" height="8" fill={k % 2 === 0 ? '#fde047' : '#ffffff'} opacity={Math.max(0, 1 - a / 55)} />;
                  })}
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
  const bob = Math.sin(frame * 0.28) * 3;
  const fw = (frame % 28) / 28;
  const zoom = interpolate(localFrame, [0, 220], [1, 1.05], { extrapolateRight: 'clamp' });
  return (
    <div style={{ position: 'absolute', top: 215, left: 65, right: 65, height: 1170, backgroundColor: '#0f172a', border: '8px solid #facc15', borderRadius: 28, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.9)', zIndex: 38 }}>
      <svg width="100%" height="100%" viewBox="0 0 240 310" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges" style={{ transform: `scale(${zoom})`, transformOrigin: '50% 55%' }}>
        {/* SISI KIRI: PULAU PINTAR MENANG + KEMBANG API */}
        <rect x="0" y="0" width="120" height="145" fill="#0284c7" /><rect x="0" y="95" width="120" height="50" fill="#38bdf8" />
        <rect x="0" y="145" width="120" height="165" fill="#22c55e" /><rect x="0" y="145" width="120" height="14" fill="#4ade80" />
        {/* Kembang Api Pixel */}
        {[0, 1, 2, 3, 4, 5].map((k) => {
          const a = (k / 6) * Math.PI * 2;
          return <rect key={k} x={60 + Math.cos(a) * fw * 28 - 2} y={48 + Math.sin(a) * fw * 24 - 2} width="5" height="5" fill={k % 2 === 0 ? '#fde047' : '#ffffff'} opacity={1 - fw} />;
        })}
        {/* Kastil Emas Mini Kiri */}
        <g transform="translate(26, 98)"><rect x="0" y="12" width="54" height="36" fill="#ca8a04" stroke="#0f172a" strokeWidth="2" /><rect x="-4" y="0" width="14" height="48" fill="#facc15" stroke="#0f172a" strokeWidth="2" /><rect x="44" y="0" width="14" height="48" fill="#facc15" stroke="#0f172a" strokeWidth="2" /></g>
        {/* LEADER BIMA MENGANGKAT PIALA EMAS */}
        <g transform={`translate(58, ${214 - Math.abs(bob)})`}>
          <rect x="-12" y="20" width="10" height="20" fill="#0f172a" /><rect x="2" y="20" width="10" height="20" fill="#0f172a" />
          <rect x="-26" y="-26" width="9" height="26" fill="#2563eb" stroke="#0f172a" strokeWidth="2" />
          <rect x="17" y="-26" width="9" height="26" fill="#2563eb" stroke="#0f172a" strokeWidth="2" />
          <rect x="-18" y="-18" width="36" height="40" fill="#0f172a" /><rect x="-15" y="-15" width="30" height="34" fill="#2563eb" />
          <rect x="-16" y="-50" width="32" height="32" fill="#0f172a" /><rect x="-13" y="-47" width="26" height="26" fill="#fed7aa" />
          <rect x="-15" y="-54" width="30" height="10" fill="#3b2110" /><rect x="-8" y="-38" width="5" height="5" fill="#0f172a" /><rect x="3" y="-38" width="5" height="5" fill="#0f172a" />
          <rect x="-6" y="-28" width="12" height="5" fill="#7f1d1d" /><rect x="-4" y="-27" width="8" height="2" fill="#fff" />
          <g transform="translate(0, -56)"><rect x="-13" y="-7" width="26" height="8" fill="#facc15" stroke="#0f172a" strokeWidth="1.5" /><rect x="-3" y="-13" width="6" height="7" fill="#fde047" /></g>
          {/* Piala Emas Besar di Atas Kepala */}
          <g transform="translate(0, -82)"><rect x="-12" y="0" width="24" height="16" fill="#facc15" stroke="#0f172a" strokeWidth="2" /><rect x="-4" y="16" width="8" height="7" fill="#eab308" /><rect x="-10" y="22" width="20" height="6" fill="#ca8a04" stroke="#0f172a" strokeWidth="1.5" /></g>
        </g>
        <g transform="translate(14, 16)"><rect x="0" y="0" width="90" height="18" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" /><text x="10" y="12.5" fill="#38bdf8" fontSize="8" fontFamily="monospace" fontWeight="bold">MENANG! 310</text></g>
        {/* GARIS PEMISAH TENGAH */}
        <rect x="117" y="0" width="6" height="310" fill="#0f172a" />
        {/* SISI KANAN: PULAU BODOH GOSONG + UDIN MEMELUK PATUNG EMAS */}
        <rect x="123" y="0" width="117" height="145" fill="#334155" /><rect x="123" y="95" width="117" height="50" fill="#475569" />
        <rect x="123" y="145" width="117" height="165" fill="#292524" /><rect x="123" y="145" width="117" height="14" fill="#44403c" />
        {/* Patung Emas Moai Tetap Utuh Berkilau */}
        <g transform="translate(194, 214)">
          <rect x="-26" y="18" width="52" height="10" fill="#475569" stroke="#0f172a" strokeWidth="2" />
          <rect x="-22" y="-56" width="44" height="76" fill="#ca8a04" stroke="#0f172a" strokeWidth="2.5" />
          <rect x="-18" y="-52" width="16" height="68" fill="#facc15" /><rect x="-14" y="-38" width="28" height="7" fill="#854d0e" />
          <rect x="-4" y="-28" width="8" height="18" fill="#a16207" />
          {Math.sin(frame * 0.4) > 0 && <rect x="10" y="-48" width="6" height="6" fill="#ffffff" />}
        </g>
        {/* LEADER UDIN GOSONG TERSENYUM BANGGA MEMELUK PATUNG EMAS */}
        <g transform={`translate(154, ${216 + bob * 0.5})`}>
          <rect x="-11" y="20" width="9" height="20" fill="#0f172a" /><rect x="2" y="20" width="9" height="20" fill="#0f172a" />
          <rect x="-17" y="-18" width="34" height="40" fill="#0f172a" /><rect x="-14" y="-15" width="28" height="34" fill="#dc2626" />
          <rect x="-6" y="-4" width="10" height="8" fill="#1c1917" opacity="0.55" />
          {/* Kedua Tangan Memeluk Patung Emas */}
          <rect x="12" y="-10" width="24" height="9" fill="#dc2626" stroke="#0f172a" strokeWidth="1.8" />
          <rect x="32" y="-10" width="9" height="9" fill="#fed7aa" stroke="#0f172a" strokeWidth="1.8" />
          <rect x="12" y="4" width="20" height="8" fill="#b91c1c" stroke="#0f172a" strokeWidth="1.8" />
          <rect x="-15" y="-50" width="30" height="32" fill="#0f172a" /><rect x="-12" y="-47" width="24" height="26" fill="#fed7aa" />
          <rect x="-14" y="-54" width="28" height="10" fill="#29150b" />
          <rect x="-9" y="-33" width="7" height="5" fill="#1c1917" opacity="0.45" />
          <rect x="-8" y="-39" width="5" height="3" fill="#0f172a" /><rect x="3" y="-39" width="5" height="3" fill="#0f172a" />
          <rect x="-6" y="-28" width="13" height="6" fill="#7f1d1d" /><rect x="-4" y="-27" width="9" height="2.5" fill="#fff" />
          <g transform="translate(2, -57) rotate(14)"><rect x="-12" y="-7" width="24" height="8" fill="#facc15" stroke="#0f172a" strokeWidth="1.5" /><rect x="-3" y="-12" width="6" height="6" fill="#fde047" /></g>
        </g>
        <g transform="translate(128, 16)"><rect x="0" y="0" width="106" height="18" rx="4" fill="#0f172a" stroke="#facc15" strokeWidth="2" /><text x="6" y="12.5" fill="#fde047" fontSize="7.5" fontFamily="monospace" fontWeight="bold">PATUNG SELAMAT!</text></g>
      </svg>
      <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24, backgroundColor: 'rgba(15, 23, 42, 0.92)', border: '4px solid #facc15', borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}><Cut4Icon type="trophy" size={32} /><div><div style={{ fontFamily, fontSize: 16, color: '#facc15' }}>TAHUN KE-50!</div><div style={{ fontFamily, fontSize: 11, color: '#38bdf8', marginTop: 8 }}>BIMA vs UDIN • FINAL</div></div></div>
        <Cut4Icon type="gold" size={32} />
      </div>
    </div>
  );
};
