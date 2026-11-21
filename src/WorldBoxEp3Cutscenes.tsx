import React from 'react';
import { interpolate } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PressStart2P';

const { fontFamily } = loadFont();

const Cut3Icon: React.FC<{ type: 'crown' | 'bread' | 'gold' | 'dragon' | 'fire'; size?: number }> = ({ type, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" shapeRendering="crispEdges">
    {type === 'crown' && <><rect x="1" y="7" width="10" height="3" fill="#facc15" /><rect x="1" y="3" width="2" height="4" fill="#facc15" /><rect x="5" y="2" width="2" height="5" fill="#fde047" /><rect x="9" y="3" width="2" height="4" fill="#facc15" /></>}
    {type === 'bread' && <><rect x="2" y="4" width="8" height="5" fill="#d97706" /><rect x="3" y="3" width="6" height="3" fill="#f59e0b" /><rect x="4" y="4" width="4" height="1" fill="#fde68a" /></>}
    {type === 'gold' && <><rect x="2" y="5" width="8" height="4" fill="#ca8a04" /><rect x="3" y="4" width="6" height="3" fill="#facc15" /><rect x="4" y="4" width="3" height="2" fill="#fef08a" /></>}
    {type === 'dragon' && <><rect x="2" y="3" width="7" height="6" fill="#dc2626" /><rect x="8" y="5" width="3" height="3" fill="#b91c1c" /><rect x="1" y="1" width="2" height="3" fill="#facc15" /><rect x="5" y="4" width="2" height="2" fill="#fde047" /></>}
    {type === 'fire' && <><rect x="3" y="5" width="6" height="6" fill="#ef4444" /><rect x="4" y="2" width="4" height="5" fill="#f97316" /><rect x="5" y="6" width="2" height="4" fill="#fde047" /></>}
  </svg>
);

export const CloseUpBarter: React.FC<{ frame: number; localFrame: number }> = ({ frame, localFrame }) => {
  const bob = Math.sin(frame * 0.25) * 2.5;
  const talk = Math.abs(Math.sin(frame * 0.4)) > 0.45;
  const spark = Math.sin(frame * 0.45) > 0;
  const zoom = interpolate(localFrame, [0, 220], [1, 1.06], { extrapolateRight: 'clamp' });
  const pop = (localFrame * 0.9) % 36;
  return (
    <div style={{ position: 'absolute', top: 215, left: 65, right: 65, height: 1170, backgroundColor: '#0f172a', border: '8px solid #facc15', borderRadius: 28, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.85)', zIndex: 38 }}>
      <svg width="100%" height="100%" viewBox="0 0 240 310" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges" style={{ transform: `scale(${zoom})`, transformOrigin: '50% 60%' }}>
        <rect width="240" height="106" fill="#38bdf8" /><rect y="74" width="240" height="32" fill="#7dd3fc" />
        <rect y="106" width="240" height="204" fill="#fde047" /><rect y="128" width="240" height="182" fill="#78716c" />
        {/* Kapal Perang di Laut Kiri & Patung Emas di Kanan */}
        <rect x="0" y="96" width="94" height="22" fill="#0284c7" />
        <g transform={`translate(34, ${98 + Math.sin(frame * 0.16) * 1.5})`}>
          <rect x="-18" y="0" width="36" height="9" fill="#78350f" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="-1" y="-26" width="3" height="26" fill="#451a03" />
          <rect x="2" y="-24" width="16" height="16" fill="#2563eb" stroke="#0f172a" strokeWidth="1.5" />
        </g>
        <g transform="translate(200, 128) scale(0.75)">
          <rect x="-24" y="-66" width="48" height="66" fill="#ca8a04" stroke="#0f172a" strokeWidth="2.5" />
          <rect x="-20" y="-62" width="18" height="58" fill="#facc15" /><rect x="-16" y="-50" width="32" height="8" fill="#854d0e" />
        </g>
        {/* LEADER BIMA (KIRI) MENYODORKAN ROTI */}
        <g transform="translate(56, 224)">
          <ellipse cx="0" cy="46" rx="28" ry="7" fill="rgba(15,23,42,0.35)" />
          <rect x="-15" y="24" width="12" height="22" fill="#0f172a" /><rect x="3" y="24" width="12" height="22" fill="#0f172a" />
          <rect x="-22" y="-22" width="44" height="48" fill="#0f172a" /><rect x="-19" y="-19" width="38" height="42" fill="#1d4ed8" />
          <rect x="-13" y="-19" width="26" height="42" fill="#2563eb" /><rect x="-19" y="8" width="38" height="5" fill="#0f172a" /><rect x="-4" y="7" width="8" height="7" fill="#facc15" />
          <rect x="-20" y="-58" width="40" height="36" fill="#0f172a" /><rect x="-17" y="-55" width="34" height="30" fill="#fed7aa" />
          <rect x="-19" y="-63" width="38" height="12" fill="#3b2110" stroke="#0f172a" strokeWidth="2" />
          {/* Alis Licik & Senyum Percaya Diri */}
          <rect x="-11" y="-48" width="8" height="2.5" fill="#3b2110" /><rect x="4" y="-49" width="8" height="2.5" fill="#3b2110" />
          <rect x="-9" y="-44" width="6" height="6" fill="#0f172a" /><rect x="5" y="-44" width="6" height="6" fill="#0f172a" />
          <rect x="-3" y="-33" width="11" height={talk ? 5 : 3} fill="#7f1d1d" />
          <g transform="translate(0, -64)"><rect x="-17" y="-8" width="34" height="10" fill="#facc15" stroke="#0f172a" strokeWidth="2" /><rect x="-16" y="-15" width="8" height="8" fill="#fde047" stroke="#0f172a" strokeWidth="1.5" /><rect x="-4" y="-17" width="8" height="10" fill="#fde047" stroke="#0f172a" strokeWidth="1.5" /><rect x="8" y="-15" width="8" height="8" fill="#fde047" stroke="#0f172a" strokeWidth="1.5" /></g>
          {/* Lengan Kanan Memegang Roti Gandum */}
          <g transform={`translate(20, ${-10 + bob * 0.5})`}>
            <rect x="0" y="0" width="24" height="10" fill="#2563eb" stroke="#0f172a" strokeWidth="2" />
            <rect x="20" y="-2" width="12" height="12" fill="#fed7aa" stroke="#0f172a" strokeWidth="2" />
            <rect x="16" y="-14" width="26" height="14" rx="4" fill="#d97706" stroke="#0f172a" strokeWidth="2" />
            <rect x="20" y="-12" width="18" height="6" fill="#f59e0b" />
            <rect x="23" y="-11" width="10" height="2.5" fill="#fde68a" />
          </g>
        </g>
        {/* LEADER UDIN (KANAN) KEGIRANGAN MENYERAHKAN PETI EMAS */}
        <g transform={`translate(182, ${224 - Math.abs(bob)})`}>
          <ellipse cx="0" cy={46 + Math.abs(bob)} rx="28" ry="7" fill="rgba(15,23,42,0.35)" />
          <rect x="-15" y="24" width="12" height="22" fill="#0f172a" /><rect x="3" y="24" width="12" height="22" fill="#0f172a" />
          <rect x="-22" y="-22" width="44" height="48" fill="#0f172a" /><rect x="-19" y="-19" width="38" height="42" fill="#b91c1c" />
          <rect x="-13" y="-19" width="26" height="42" fill="#dc2626" /><rect x="-19" y="8" width="38" height="5" fill="#450a0a" />
          <rect x="-20" y="-58" width="40" height="36" fill="#0f172a" /><rect x="-17" y="-55" width="34" height="30" fill="#fed7aa" />
          <rect x="-19" y="-63" width="38" height="12" fill="#29150b" stroke="#0f172a" strokeWidth="2" />
          {/* Mata Berbinar & Senyum Lebar */}
          <rect x="-12" y="-47" width="9" height="9" fill="#0f172a" /><rect x="3" y="-47" width="9" height="9" fill="#0f172a" />
          <rect x="-10" y="-45" width="4" height="4" fill="#fde047" /><rect x="5" y="-45" width="4" height="4" fill="#fde047" />
          <rect x="-9" y="-34" width="18" height="8" fill="#7f1d1d" stroke="#0f172a" strokeWidth="1.5" /><rect x="-7" y="-33" width="14" height="3" fill="#fff" />
          <g transform="translate(3, -66) rotate(11)"><rect x="-16" y="-8" width="32" height="10" fill="#facc15" stroke="#0f172a" strokeWidth="2" /><rect x="-15" y="-14" width="7" height="7" fill="#fde047" /><rect x="-3.5" y="-16" width="7" height="9" fill="#fde047" /><rect x="8" y="-14" width="7" height="7" fill="#fde047" /></g>
          {/* Lengan Kiri Menyodorkan Peti Penuh Emas */}
          <g transform="translate(-54, -10)">
            <rect x="28" y="4" width="14" height="10" fill="#dc2626" stroke="#0f172a" strokeWidth="2" />
            <rect x="0" y="0" width="38" height="22" fill="#78350f" stroke="#0f172a" strokeWidth="2" />
            <rect x="4" y="-9" width="14" height="10" fill="#facc15" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="16" y="-12" width="16" height="12" fill="#fde047" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="24" y="4" width="10" height="10" fill="#fed7aa" stroke="#0f172a" strokeWidth="2" />
            {spark && <rect x="10" y="-18" width="6" height="6" fill="#ffffff" />}
          </g>
        </g>

        <g transform={`translate(76, ${68 - pop * 0.5})`} opacity={1 - pop / 36}>
          <rect x="0" y="0" width="88" height="18" rx="4" fill="#0f172a" stroke="#fde047" strokeWidth="2" />
          <text x="8" y="12.5" fill="#fde047" fontSize="8.5" fontFamily="monospace" fontWeight="bold">DEAL BODOH!</text>
        </g>
      </svg>
      <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24, backgroundColor: 'rgba(15, 23, 42, 0.92)', border: '4px solid #facc15', borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}><Cut3Icon type="bread" size={32} /><div><div style={{ fontFamily, fontSize: 17, color: '#facc15' }}>BIMA vs UDIN</div><div style={{ fontFamily, fontSize: 11, color: '#38bdf8', marginTop: 8 }}>BARTER ROTI &amp; EMAS</div></div></div>
        <Cut3Icon type="gold" size={32} />
      </div>
    </div>
  );
};
export const CloseUpDragon: React.FC<{ frame: number; localFrame: number }> = ({ frame, localFrame }) => {
  const camX = Math.sin(frame * 2.1) * 2.4;
  const camY = Math.cos(frame * 1.8) * 1.6;
  const jaw = Math.sin(frame * 0.45) * 5;
  const wing = Math.sin(frame * 0.35) * 10;
  const flail = Math.sin(frame * 0.9) * 20;
  const zoom = interpolate(localFrame, [0, 260], [1, 1.08], { extrapolateRight: 'clamp' });

  return (
    <div style={{ position: 'absolute', top: 215, left: 65, right: 65, height: 1170, backgroundColor: '#0f172a', border: '8px solid #ef4444', borderRadius: 28, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.9)', zIndex: 38 }}>
      <svg width="100%" height="100%" viewBox="0 0 240 310" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges" style={{ transform: `translate(${camX}px, ${camY}px) scale(${zoom})`, transformOrigin: '60% 50%' }}>
        <rect width="240" height="130" fill="#450a0a" /><rect y="78" width="240" height="52" fill="#7f1d1d" />
        <rect y="130" width="240" height="180" fill="#292524" /><rect y="130" width="240" height="18" fill="#44403c" />
        {/* Gua Emas Retak Membara dengan Lava di Kanan */}
        <g transform="translate(116, 48)">
          <rect x="0" y="20" width="124" height="108" fill="#334155" stroke="#0f172a" strokeWidth="2.5" />
          <rect x="20" y="34" width="96" height="94" fill="#0f172a" />
          <rect x="26" y="88" width="84" height="40" fill="#ea580c" />
          <rect x="34" y="102" width="68" height="26" fill="#fde047" />
          <rect x="12" y="54" width="6" height="26" fill="#f97316" /><rect x="16" y="68" width="4" height="18" fill="#fde047" />
        </g>
        {/* Retakan Lava di Tanah */}
        <rect x="94" y="186" width="44" height="5" fill="#f97316" /><rect x="108" y="188" width="22" height="3" fill="#fde047" />
        <rect x="128" y="238" width="58" height="6" fill="#ea580c" />
        {/* NAGA API RAKSASA MENYEMBUL DARI GUA */}
        <g transform={`translate(168, ${138 + Math.sin(frame * 0.28) * 4})`}>
          {/* Sayap Merah Besar Mengepak */}
          <g transform={`translate(18, -12) rotate(${-10 + wing})`}>
            <rect x="-10" y="-58" width="66" height="46" fill="#991b1b" stroke="#0f172a" strokeWidth="2.5" />
            <rect x="0" y="-48" width="48" height="28" fill="#dc2626" />
            <rect x="8" y="-38" width="32" height="14" fill="#f97316" />
          </g>
          {/* Leher & Sisik Emas */}
          <rect x="-12" y="6" width="54" height="72" fill="#991b1b" stroke="#0f172a" strokeWidth="2.5" />
          <rect x="-10" y="12" width="16" height="58" fill="#facc15" stroke="#0f172a" strokeWidth="2" />
          {/* Kepala Naga Raksasa Menghadap Kiri */}
          <rect x="-58" y="-38" width="84" height="44" fill="#dc2626" stroke="#0f172a" strokeWidth="2.5" />
          <rect x="-74" y="-26" width="24" height="26" fill="#b91c1c" stroke="#0f172a" strokeWidth="2.5" />
          {/* Tanduk Emas Besar */}
          <rect x="2" y="-56" width="12" height="20" fill="#facc15" stroke="#0f172a" strokeWidth="2" />
          <rect x="16" y="-50" width="12" height="16" fill="#fde047" stroke="#0f172a" strokeWidth="2" />
          {/* Mata Menyala Kuning */}
          <rect x="-42" y="-28" width="16" height="12" fill="#fde047" stroke="#0f172a" strokeWidth="2" />
          <rect x="-38" y="-26" width="5" height="8" fill="#0f172a" />
          {/* Rahang Bawah Mengaum & Taring */}
          <g transform={`translate(-46, ${6 + jaw * 0.6})`}>
            <rect x="-26" y="0" width="62" height="16" fill="#991b1b" stroke="#0f172a" strokeWidth="2.5" />
            <rect x="-20" y="-6" width="7" height="7" fill="#fff" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="-4" y="-6" width="7" height="7" fill="#fff" stroke="#0f172a" strokeWidth="1.5" />
          </g>
          {/* Semburan Api Raksasa ke Kiri */}
          <g transform={`translate(-74, -4)`}>
            <rect x={-32 - Math.sin(frame * 0.8) * 6} y="-14" width="38" height="32" fill="#dc2626" opacity="0.92" />
            <rect x={-54 - Math.cos(frame * 0.9) * 8} y="-22" width="44" height="46" fill="#f97316" opacity="0.88" />
            <rect x={-26 - Math.sin(frame * 0.7) * 5} y="-8" width="28" height="20" fill="#fde047" />
          </g>
        </g>
        {/* Bara Api Beturbangan */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const lift = (frame * 2.5 + i * 23) % 140;
          return <rect key={i} x={24 + i * 36 + Math.sin(frame * 0.25 + i) * 8} y={240 - lift} width="4" height="4" fill={i % 2 === 0 ? '#fde047' : '#fb923c'} opacity={Math.max(0, 1 - lift / 140)} />;
        })}

        {/* LEADER UDIN KETAKUTAN DI KIRI BAWAH */}
        <g transform={`translate(${54 + Math.sin(frame * 1.4) * 2.5}, 228)`}>
          <ellipse cx="0" cy="44" rx="28" ry="7" fill="rgba(15,23,42,0.45)" />
          <rect x="-14" y="22" width="11" height="22" fill="#0f172a" /><rect x="3" y="22" width="11" height="22" fill="#0f172a" />
          <rect x="-21" y="-22" width="42" height="46" fill="#0f172a" /><rect x="-18" y="-19" width="36" height="40" fill="#b91c1c" />
          <rect x="-12" y="-19" width="24" height="40" fill="#dc2626" />
          <g transform={`translate(-20, -10) rotate(${-48 + flail})`}><rect x="-10" y="-18" width="10" height="24" fill="#fed7aa" stroke="#0f172a" strokeWidth="2" /></g>
          <g transform={`translate(20, -10) rotate(${48 - flail})`}><rect x="0" y="-18" width="10" height="24" fill="#fed7aa" stroke="#0f172a" strokeWidth="2" /></g>
          <rect x="-20" y="-58" width="40" height="36" fill="#0f172a" /><rect x="-17" y="-55" width="34" height="30" fill="#fed7aa" />
          <rect x="-19" y="-63" width="38" height="11" fill="#29150b" stroke="#0f172a" strokeWidth="2" />
          <rect x="-13" y="-48" width="11" height="11" fill="#fff" stroke="#0f172a" strokeWidth="1.5" /><rect x="2" y="-48" width="11" height="11" fill="#fff" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="-7" y="-44" width="3.5" height="3.5" fill="#0f172a" /><rect x="7" y="-44" width="3.5" height="3.5" fill="#0f172a" />
          <rect x="-7" y="-33" width="14" height="9" fill="#450a0a" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="15" y={-52 + (frame % 12)} width="4" height="6" fill="#7dd3fc" />
          <g transform={`translate(4, ${-70 - Math.abs(Math.sin(frame * 0.6)) * 4}) rotate(16)`}><rect x="-15" y="-8" width="30" height="9" fill="#facc15" stroke="#0f172a" strokeWidth="2" /><rect x="-14" y="-14" width="7" height="7" fill="#fde047" /><rect x="-3" y="-16" width="7" height="9" fill="#fde047" /><rect x="7" y="-14" width="7" height="7" fill="#fde047" /></g>
        </g>
      </svg>
      <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24, backgroundColor: 'rgba(15, 23, 42, 0.92)', border: '4px solid #ef4444', borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}><Cut3Icon type="dragon" size={32} /><div><div style={{ fontFamily, fontSize: 16, color: '#facc15' }}>NAGA API BANGKIT!</div><div style={{ fontFamily, fontSize: 11, color: '#f87171', marginTop: 8 }}>TAHUN 38 • GUA EMAS</div></div></div>
        <Cut3Icon type="fire" size={32} />
      </div>
    </div>
  );
};
