import React from 'react';
import { interpolate } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PressStart2P';

const { fontFamily } = loadFont();

const Cut3Icon: React.FC<{ type: 'bread' | 'gold' | 'dragon' | 'fire'; size?: number }> = ({ type, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" shapeRendering="crispEdges">
    {type === 'bread' && <><rect x="2" y="4" width="8" height="5" fill="#d97706" /><rect x="3" y="3" width="6" height="3" fill="#f59e0b" /><rect x="4" y="4" width="4" height="1" fill="#fde68a" /></>}
    {type === 'gold' && <><rect x="2" y="5" width="8" height="4" fill="#ca8a04" /><rect x="3" y="4" width="6" height="3" fill="#facc15" /><rect x="4" y="4" width="3" height="2" fill="#fef08a" /></>}
    {type === 'dragon' && <><rect x="2" y="3" width="7" height="6" fill="#dc2626" /><rect x="8" y="5" width="3" height="3" fill="#b91c1c" /><rect x="1" y="1" width="2" height="3" fill="#facc15" /><rect x="5" y="4" width="2" height="2" fill="#fde047" /></>}
    {type === 'fire' && <><rect x="3" y="5" width="6" height="6" fill="#ef4444" /><rect x="4" y="2" width="4" height="5" fill="#f97316" /><rect x="5" y="6" width="2" height="4" fill="#fde047" /></>}
  </svg>
);

export const CloseUpBarter: React.FC<{ frame: number; localFrame: number }> = ({ frame, localFrame }) => {
  const bob = Math.sin(frame * 0.22) * 2;
  const talk = Math.abs(Math.sin(frame * 0.42)) > 0.45;
  const blink = (frame % 70) > 65;
  const spark = Math.sin(frame * 0.45) > 0;
  const zoom = interpolate(localFrame, [0, 220], [1, 1.05], { extrapolateRight: 'clamp' });
  const pop = Math.sin(frame * 0.25) * 3;
  return (
    <div style={{ position: 'absolute', top: 215, left: 65, right: 65, height: 1170, backgroundColor: '#0f172a', border: '8px solid #facc15', borderRadius: 28, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.85)', zIndex: 38 }}>
      <svg width="100%" height="100%" viewBox="0 0 240 310" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges" style={{ transform: `scale(${zoom})`, transformOrigin: '50% 60%' }}>
        <rect width="240" height="96" fill="#38bdf8" /><rect y="64" width="240" height="32" fill="#7dd3fc" />
        <rect x="204" y="14" width="18" height="18" fill="#fde047" />
        <rect x={(20 + frame * 0.2) % 260 - 20} y="16" width="38" height="10" fill="#f0f9ff" />
        <rect x={(130 + frame * 0.14) % 260 - 20} y="28" width="44" height="11" fill="#e0f2fe" />
        <rect y="94" width="240" height="26" fill="#0284c7" /><rect y="114" width="240" height="22" fill="#fde047" />
        <rect y="132" width="240" height="178" fill="#57534e" /><rect y="132" width="240" height="10" fill="#78716c" />
        {/* Kapal Perang di Teluk Kiri & Gua Emas + Patung Emas Detail di Kanan */}
        <g transform={`translate(42, ${99 + Math.sin(frame * 0.16) * 1.5})`}>
          <rect x="-24" y="6" width="48" height="3.5" fill="#bae6fd" opacity="0.65" />
          <polygon points="-22,-2 24,-2 17,7 -17,7" fill="#78350f" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="-20" y="-8" width="11" height="6" fill="#92400e" stroke="#0f172a" strokeWidth="1.2" />
          <rect x="-2" y="-29" width="3" height="27" fill="#451a03" />
          <polygon points="1,-26 16,-22 18,-10 1,-9" fill="#2563eb" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="6" y="-20" width="5" height="5" fill="#fde047" />
          <polygon points="15,-21 26,-6 15,-7" fill="#f8fafc" stroke="#0f172a" strokeWidth="1.2" />
        </g>
        <g transform="translate(198, 134)">
          <rect x="-26" y="-4" width="52" height="10" fill="#475569" stroke="#0f172a" strokeWidth="2" />
          <rect x="-20" y="-56" width="40" height="54" fill="#ca8a04" stroke="#0f172a" strokeWidth="2.5" />
          <rect x="-16" y="-52" width="14" height="46" fill="#facc15" /><rect x="-14" y="-42" width="28" height="6" fill="#854d0e" />
          <rect x="-4" y="-34" width="8" height="15" fill="#a16207" /><rect x="-10" y="-14" width="20" height="4" fill="#854d0e" />
          {spark && <rect x="10" y="-48" width="5" height="5" fill="#ffffff" />}
        </g>
        {/* LEADER BIMA (KIRI) — 2 LENGAN LENGKAP & KERANJANG ROTI */}
        <g transform={`translate(56, ${222 + bob * 0.4})`}>
          <ellipse cx="0" cy={46 - bob * 0.4} rx="29" ry="7" fill="rgba(15,23,42,0.35)" />
          <rect x="-15" y="24" width="12" height="22" fill="#0f172a" /><rect x="3" y="24" width="12" height="22" fill="#0f172a" />
          <rect x="-13" y="26" width="8" height="18" fill="#1e293b" /><rect x="5" y="26" width="8" height="18" fill="#1e293b" />
          <rect x="-32" y="-14" width="12" height="26" fill="#1d4ed8" stroke="#0f172a" strokeWidth="2" />
          <rect x="-31" y="10" width="10" height="8" fill="#fed7aa" stroke="#0f172a" strokeWidth="2" />
          <rect x="-22" y="-22" width="44" height="48" fill="#0f172a" /><rect x="-19" y="-19" width="38" height="42" fill="#1d4ed8" />
          <rect x="-13" y="-19" width="26" height="42" fill="#2563eb" /><rect x="-19" y="8" width="38" height="5" fill="#0f172a" /><rect x="-4" y="7" width="8" height="7" fill="#facc15" />
          <rect x="-20" y="-58" width="40" height="36" fill="#0f172a" /><rect x="-17" y="-55" width="34" height="30" fill="#fed7aa" />
          <rect x="-19" y="-63" width="38" height="12" fill="#3b2110" stroke="#0f172a" strokeWidth="2" />
          <rect x="-12" y="-48" width="9" height="2.5" fill="#3b2110" /><rect x="4" y="-49" width="9" height="2.5" fill="#3b2110" />
          {blink ? <><rect x="-10" y="-42" width="6" height="2" fill="#0f172a" /><rect x="5" y="-42" width="6" height="2" fill="#0f172a" /></> : <><rect x="-10" y="-44" width="6" height="6" fill="#0f172a" /><rect x="5" y="-44" width="6" height="6" fill="#0f172a" /><rect x="-9" y="-43" width="2" height="2" fill="#fff" /><rect x="6" y="-43" width="2" height="2" fill="#fff" /></>}
          <rect x="-2" y="-33" width="11" height={talk ? 5 : 3} fill="#7f1d1d" />
          <g transform="translate(0, -64)"><rect x="-17" y="-8" width="34" height="10" fill="#facc15" stroke="#0f172a" strokeWidth="2" /><rect x="-16" y="-15" width="8" height="8" fill="#fde047" stroke="#0f172a" strokeWidth="1.5" /><rect x="-4" y="-17" width="8" height="10" fill="#fde047" stroke="#0f172a" strokeWidth="1.5" /><rect x="8" y="-15" width="8" height="8" fill="#fde047" stroke="#0f172a" strokeWidth="1.5" /></g>
          {/* Lengan Kanan Menyorongkan Keranjang Penuh Roti */}
          <g transform={`translate(20, ${-10 + bob * 0.4})`}>
            <rect x="0" y="2" width="20" height="10" fill="#2563eb" stroke="#0f172a" strokeWidth="2" />
            <rect x="16" y="-15" width="14" height="10" rx="3" fill="#d97706" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="28" y="-16" width="14" height="11" rx="3" fill="#f59e0b" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="22" y="-20" width="15" height="9" rx="3" fill="#fbbf24" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="14" y="-6" width="32" height="16" fill="#92400e" stroke="#0f172a" strokeWidth="2" />
            <rect x="17" y="-2" width="26" height="3" fill="#b45309" /><rect x="17" y="4" width="26" height="3" fill="#b45309" />
            <rect x="14" y="4" width="10" height="9" fill="#fed7aa" stroke="#0f172a" strokeWidth="1.8" />
          </g>
        </g>
        {/* LEADER UDIN (KANAN) — 2 TANGAN LENGKAP, MATA EKSPRESIF & PETI EMAS */}
        <g transform={`translate(184, ${222 - Math.abs(bob * 1.1)})`}>
          <ellipse cx="0" cy={46 + Math.abs(bob * 1.1)} rx="29" ry="7" fill="rgba(15,23,42,0.35)" />
          <rect x="-15" y="24" width="12" height="22" fill="#0f172a" /><rect x="3" y="24" width="12" height="22" fill="#0f172a" />
          <rect x="-13" y="26" width="8" height="18" fill="#1e293b" /><rect x="5" y="26" width="8" height="18" fill="#1e293b" />
          <rect x="20" y="-14" width="12" height="24" fill="#b91c1c" stroke="#0f172a" strokeWidth="2" />
          <rect x="21" y="8" width="10" height="8" fill="#fed7aa" stroke="#0f172a" strokeWidth="2" />
          <rect x="-22" y="-22" width="44" height="48" fill="#0f172a" /><rect x="-19" y="-19" width="38" height="42" fill="#b91c1c" />
          <rect x="-13" y="-19" width="26" height="42" fill="#dc2626" /><rect x="-19" y="8" width="38" height="5" fill="#450a0a" />
          <rect x="-20" y="-58" width="40" height="36" fill="#0f172a" /><rect x="-17" y="-55" width="34" height="30" fill="#fed7aa" />
          <rect x="-19" y="-63" width="38" height="12" fill="#29150b" stroke="#0f172a" strokeWidth="2" />
          {/* Mata Berbinar Ekspresif */}
          <rect x="-13" y="-47" width="10" height="9" fill="#fff" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="3" y="-47" width="10" height="9" fill="#fff" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="-11" y="-45" width="5" height="5" fill="#0f172a" /><rect x="5" y="-45" width="5" height="5" fill="#0f172a" />
          <rect x="-10" y="-44" width="2.5" height="2.5" fill="#fde047" /><rect x="6" y="-44" width="2.5" height="2.5" fill="#fde047" />
          <rect x="-9" y="-34" width="18" height="8" fill="#7f1d1d" stroke="#0f172a" strokeWidth="1.5" /><rect x="-7" y="-33" width="14" height="3" fill="#fff" />
          <g transform="translate(3, -66) rotate(10)"><rect x="-16" y="-8" width="32" height="10" fill="#facc15" stroke="#0f172a" strokeWidth="2" /><rect x="-15" y="-14" width="7" height="7" fill="#fde047" /><rect x="-3.5" y="-16" width="7" height="9" fill="#fde047" /><rect x="8" y="-14" width="7" height="7" fill="#fde047" /></g>
          {/* Peti Besar Penuh Emas Berkilau */}
          <g transform="translate(-58, -12)">
            <rect x="34" y="4" width="14" height="10" fill="#dc2626" stroke="#0f172a" strokeWidth="2" />
            <rect x="2" y="-10" width="14" height="10" fill="#facc15" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="14" y="-14" width="16" height="13" fill="#fde047" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="24" y="-9" width="12" height="10" fill="#eab308" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="0" y="-1" width="40" height="23" fill="#78350f" stroke="#0f172a" strokeWidth="2" />
            <rect x="0" y="7" width="40" height="4" fill="#451a03" /><rect x="16" y="5" width="8" height="8" fill="#facc15" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="26" y="4" width="10" height="9" fill="#fed7aa" stroke="#0f172a" strokeWidth="1.8" />
            {spark && <><rect x="8" y="-20" width="5" height="5" fill="#ffffff" /><rect x="26" y="-18" width="4" height="4" fill="#fef08a" /></>}
          </g>
        </g>

        <g transform={`translate(69, ${48 + pop})`}>
          <rect x="0" y="0" width="102" height="22" rx="5" fill="#0f172a" stroke="#facc15" strokeWidth="2.5" />
          <text x="12" y="14.5" fill="#fde047" fontSize="9" fontFamily="monospace" fontWeight="bold">DEAL BODOH!</text>
        </g>
      </svg>
      <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24, backgroundColor: 'rgba(15, 23, 42, 0.92)', border: '4px solid #facc15', borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}><Cut3Icon type="bread" size={32} /><div><div style={{ fontFamily, fontSize: 17, color: '#facc15' }}>BIMA vs UDIN</div><div style={{ fontFamily, fontSize: 11, color: '#38bdf8', marginTop: 8 }}>ROTI vs BERTON EMAS</div></div></div>
        <Cut3Icon type="gold" size={32} />
      </div>
    </div>
  );
};
export const CloseUpDragon: React.FC<{ frame: number; localFrame: number }> = ({ frame, localFrame }) => {
  const camX = Math.sin(frame * 2.0) * 2.2;
  const camY = Math.cos(frame * 1.7) * 1.4;
  const jaw = Math.sin(frame * 0.45) * 4.5 + 3;
  const wing = Math.sin(frame * 0.38) * 11;
  const flail = Math.sin(frame * 0.95) * 16;
  const zoom = interpolate(localFrame, [0, 180], [1, 1.06], { extrapolateRight: 'clamp' });

  return (
    <div style={{ position: 'absolute', top: 215, left: 65, right: 65, height: 1170, backgroundColor: '#0f172a', border: '8px solid #ef4444', borderRadius: 28, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.9)', zIndex: 38 }}>
      <svg width="100%" height="100%" viewBox="0 0 240 310" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges" style={{ transform: `translate(${camX}px, ${camY}px) scale(${zoom})`, transformOrigin: '55% 55%' }}>
        <rect width="240" height="145" fill="#2c0707" /><rect y="75" width="240" height="70" fill="#6b1111" />
        <rect y="145" width="240" height="165" fill="#1c1917" /><rect y="145" width="240" height="16" fill="#292524" />
        {/* Mulut Gua Vulkanik & Magma Membara */}
        <g transform="translate(116, 48)">
          <rect x="4" y="18" width="124" height="114" fill="#334155" stroke="#0f172a" strokeWidth="2.5" />
          <rect x="20" y="34" width="104" height="98" fill="#0f172a" />
          <rect x="26" y="96" width="94" height="36" fill="#ea580c" />
          <rect x="34" y="108" width="76" height="24" fill="#fde047" />
          <rect x="12" y="54" width="5" height="24" fill="#f97316" /><rect x="15" y="70" width="4" height="14" fill="#fde047" />
        </g>
        <rect x="92" y="198" width="54" height="5" fill="#ea580c" /><rect x="106" y="199" width="28" height="3" fill="#fde047" />
        <rect x="134" y="236" width="66" height="6" fill="#f97316" /><rect x="148" y="237" width="30" height="3" fill="#fde047" />
        {/* NAGA API PIXEL-ART RAKSASA (MENYEMBUR KE KIRI-ATAS, AMAN DARI UDIN) */}
        <g transform={`translate(174, ${118 + Math.sin(frame * 0.28) * 3.5})`}>
          {/* Sayap Kelelawar Bergerigi Mengepak */}
          <g transform={`translate(12, -16) rotate(${-14 + wing})`}>
            <polygon points="0,0 56,-48 64,-12 46,-20 42,6 24,-10 14,12" fill="#991b1b" stroke="#0f172a" strokeWidth="2.5" />
            <polygon points="8,-4 48,-36 52,-14 36,-18 28,-2" fill="#dc2626" />
            <rect x="14" y="-26" width="24" height="6" fill="#f97316" />
          </g>
          {/* Leher Melengkung, Duri Punggung & Sisik Perut Emas */}
          <rect x="16" y="12" width="42" height="74" fill="#7f1d1d" stroke="#0f172a" strokeWidth="2.5" />
          <rect x="0" y="0" width="42" height="56" fill="#991b1b" stroke="#0f172a" strokeWidth="2.5" />
          <rect x="0" y="8" width="14" height="10" fill="#facc15" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="2" y="20" width="14" height="10" fill="#eab308" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="6" y="32" width="14" height="10" fill="#facc15" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="12" y="44" width="14" height="10" fill="#eab308" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="40" y="2" width="10" height="8" fill="#facc15" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="46" y="18" width="10" height="8" fill="#facc15" stroke="#0f172a" strokeWidth="1.5" />
          {/* Kepala Naga Garang + Tanduk Melengkung + Taring Atas */}
          <rect x="-46" y="-36" width="66" height="34" fill="#dc2626" stroke="#0f172a" strokeWidth="2.5" />
          <rect x="-74" y="-26" width="34" height="24" fill="#b91c1c" stroke="#0f172a" strokeWidth="2.5" />
          <rect x="-66" y="-22" width="6" height="5" fill="#0f172a" />
          <rect x="2" y="-54" width="11" height="20" fill="#facc15" stroke="#0f172a" strokeWidth="2" />
          <rect x="11" y="-62" width="9" height="12" fill="#fde047" stroke="#0f172a" strokeWidth="2" />
          <rect x="-34" y="-32" width="18" height="6" fill="#7f1d1d" />
          <rect x="-32" y="-26" width="14" height="10" fill="#fde047" stroke="#0f172a" strokeWidth="2" />
          <rect x="-27" y="-25" width="4" height="8" fill="#0f172a" />
          <rect x="-68" y="-2" width="6" height="7" fill="#fff" stroke="#0f172a" strokeWidth="1.2" />
          <rect x="-54" y="-2" width="6" height="6" fill="#fff" stroke="#0f172a" strokeWidth="1.2" />
          {/* Rahang Bawah Mengaum + Taring Bawah */}
          <g transform={`translate(-40, ${4 + jaw * 0.6})`}>
            <rect x="-28" y="0" width="54" height="13" fill="#991b1b" stroke="#0f172a" strokeWidth="2.5" />
            <rect x="-22" y="-6" width="6" height="7" fill="#fff" stroke="#0f172a" strokeWidth="1.2" />
            <rect x="-8" y="-6" width="6" height="6" fill="#fff" stroke="#0f172a" strokeWidth="1.2" />
          </g>
          {/* Semburan Api Berlapis Mengarah ke Kiri-Atas (Bebas dari Kepala Udin!) */}
          <g transform="translate(-74, -10) rotate(12)">
            <rect x={-76 - Math.sin(frame * 0.8) * 6} y="-14" width="76" height="28" fill="#dc2626" />
            <rect x={-64 - Math.cos(frame * 0.9) * 5} y="-18" width="46" height="36" fill="#dc2626" opacity="0.9" />
            <rect x={-58 - Math.cos(frame * 0.9) * 5} y="-10" width="58" height="20" fill="#f97316" />
            <rect x={-38 - Math.sin(frame * 0.7) * 4} y="-6" width="38" height="12" fill="#fde047" />
            <rect x={-88 - (frame % 14)} y="-8" width="12" height="10" fill="#f97316" />
            <rect x={-96 - ((frame + 7) % 14)} y="4" width="9" height="8" fill="#fde047" />
          </g>
        </g>
        {/* Bara Api Beturbangan */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const lift = (frame * 2.5 + i * 23) % 160;
          return <rect key={i} x={18 + i * 38 + Math.sin(frame * 0.25 + i) * 8} y={248 - lift} width="4" height="4" fill={i % 2 === 0 ? '#fde047' : '#fb923c'} opacity={Math.max(0, 1 - lift / 160)} />;
        })}

        {/* LEADER UDIN PANIK DI KIRI BAWAH (TANGAN TERANGKAT, MATA TERPISAH RAPI) */}
        <g transform={`translate(${54 + Math.sin(frame * 1.4) * 2.2}, 228)`}>
          <ellipse cx="0" cy="44" rx="28" ry="7" fill="rgba(15,23,42,0.45)" />
          <rect x="-14" y="22" width="11" height="22" fill="#0f172a" /><rect x="3" y="22" width="11" height="22" fill="#0f172a" />
          <rect x="-12" y="24" width="7" height="18" fill="#1e293b" /><rect x="5" y="24" width="7" height="18" fill="#1e293b" />
          <rect x="-21" y="-22" width="42" height="46" fill="#0f172a" /><rect x="-18" y="-19" width="36" height="40" fill="#b91c1c" />
          <rect x="-12" y="-19" width="24" height="40" fill="#dc2626" /><rect x="-18" y="8" width="36" height="5" fill="#450a0a" />
          {/* Kedua Tangan Terangkat Tinggi Panik */}
          <g transform={`translate(-21, -14) rotate(${-22 + flail})`}>
            <rect x="-10" y="-26" width="10" height="28" fill="#dc2626" stroke="#0f172a" strokeWidth="2" />
            <rect x="-10" y="-34" width="10" height="10" fill="#fed7aa" stroke="#0f172a" strokeWidth="2" />
          </g>
          <g transform={`translate(21, -14) rotate(${22 - flail})`}>
            <rect x="0" y="-26" width="10" height="28" fill="#dc2626" stroke="#0f172a" strokeWidth="2" />
            <rect x="0" y="-34" width="10" height="10" fill="#fed7aa" stroke="#0f172a" strokeWidth="2" />
          </g>
          <rect x="-20" y="-58" width="40" height="36" fill="#0f172a" /><rect x="-17" y="-55" width="34" height="30" fill="#fed7aa" />
          <rect x="-19" y="-63" width="38" height="11" fill="#29150b" stroke="#0f172a" strokeWidth="2" />
          {/* Mata Panik Terpisah Melirik ke Atas-Kanan (Ke Arah Naga) */}
          <rect x="-13" y="-48" width="9" height="10" fill="#fff" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="4" y="-48" width="9" height="10" fill="#fff" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="-8" y="-46" width="3.5" height="3.5" fill="#0f172a" /><rect x="9" y="-46" width="3.5" height="3.5" fill="#0f172a" />
          <rect x="-7" y="-33" width="14" height="9" fill="#450a0a" stroke="#0f172a" strokeWidth="1.5" /><rect x="-5" y="-32" width="10" height="2.5" fill="#fff" />
          <rect x="-19" y={-52 + (frame % 12)} width="3.5" height="6" fill="#7dd3fc" />
          <g transform={`translate(3, ${-67 - Math.abs(Math.sin(frame * 0.6)) * 3}) rotate(12)`}><rect x="-15" y="-8" width="30" height="9" fill="#facc15" stroke="#0f172a" strokeWidth="2" /><rect x="-14" y="-14" width="7" height="7" fill="#fde047" /><rect x="-3" y="-16" width="7" height="9" fill="#fde047" /><rect x="7" y="-14" width="7" height="7" fill="#fde047" /></g>
        </g>
      </svg>
      <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24, backgroundColor: 'rgba(15, 23, 42, 0.92)', border: '4px solid #ef4444', borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}><Cut3Icon type="dragon" size={32} /><div><div style={{ fontFamily, fontSize: 16, color: '#facc15' }}>NAGA API BANGKIT!</div><div style={{ fontFamily, fontSize: 11, color: '#f87171', marginTop: 8 }}>TAHUN 38 • GUA EMAS</div></div></div>
        <Cut3Icon type="fire" size={32} />
      </div>
    </div>
  );
};
