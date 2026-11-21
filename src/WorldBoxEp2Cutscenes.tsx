import React from 'react';
import { interpolate } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PressStart2P';

const { fontFamily } = loadFont();

const Cut2Icon: React.FC<{ type: 'crown' | 'gold' | 'anvil' | 'question' | 'ship'; size?: number }> = ({ type, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" shapeRendering="crispEdges">
    {type === 'crown' && <><rect x="1" y="7" width="10" height="3" fill="#facc15" /><rect x="1" y="3" width="2" height="4" fill="#facc15" /><rect x="5" y="2" width="2" height="5" fill="#fde047" /><rect x="9" y="3" width="2" height="4" fill="#facc15" /></>}
    {type === 'gold' && <><rect x="2" y="5" width="8" height="4" fill="#ca8a04" /><rect x="3" y="4" width="6" height="3" fill="#facc15" /><rect x="4" y="4" width="3" height="2" fill="#fef08a" /></>}
    {type === 'anvil' && <><rect x="1" y="3" width="10" height="3" fill="#94a3b8" /><rect x="4" y="6" width="4" height="3" fill="#64748b" /><rect x="2" y="9" width="8" height="2" fill="#475569" /></>}
    {type === 'question' && <><rect x="3" y="1" width="6" height="2" fill="#1e293b" /><rect x="7" y="3" width="2" height="2" fill="#1e293b" /><rect x="5" y="5" width="2" height="2" fill="#1e293b" /><rect x="5" y="9" width="2" height="2" fill="#1e293b" /></>}
    {type === 'ship' && <><rect x="2" y="8" width="8" height="3" fill="#78350f" /><rect x="5" y="2" width="2" height="6" fill="#92400e" /><rect x="7" y="2" width="4" height="5" fill="#38bdf8" /></>}
  </svg>
);

export const CloseUpUdinGold: React.FC<{ frame: number; localFrame: number }> = ({ frame, localFrame }) => {
  const chomp = Math.sin(frame * 0.55) > 0.2;
  const sparkle = Math.sin(frame * 0.4) > 0;
  const wx = 148 + Math.sin(frame * 0.08) * 18;
  const ws = Math.sin(frame * 0.5);
  const zoom = interpolate(localFrame, [0, 180], [1, 1.06], { extrapolateRight: 'clamp' });
  const pop = (localFrame * 0.9) % 34;

  return (
    <div style={{ position: 'absolute', top: 215, left: 65, right: 65, height: 1170, backgroundColor: '#0f172a', border: '8px solid #facc15', borderRadius: 28, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.85)', zIndex: 38 }}>
      <svg width="100%" height="100%" viewBox="0 0 240 310" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges" style={{ transform: `scale(${zoom})`, transformOrigin: '45% 60%' }}>
        <rect width="240" height="108" fill="#475569" /><rect y="75" width="240" height="33" fill="#64748b" />
        <rect y="108" width="240" height="202" fill="#57534e" /><rect y="108" width="240" height="16" fill="#44403c" />
        {/* Gua Emas Raksasa di Latar Kiri */}
        <g transform="translate(10, 42)">
          <rect x="0" y="18" width="112" height="72" fill="#334155" stroke="#0f172a" strokeWidth="2.5" />
          <rect x="14" y="6" width="84" height="22" fill="#475569" stroke="#0f172a" strokeWidth="2.5" />
          <rect x="22" y="28" width="68" height="62" fill="#0f172a" />
          <rect x="28" y="68" width="56" height="22" fill="#ca8a04" />
          <rect x="36" y="58" width="38" height="18" fill="#facc15" />
          <rect x="44" y="52" width="18" height="10" fill="#fde047" />
          {sparkle && <><rect x="34" y="42" width="6" height="6" fill="#fef08a" /><rect x="68" y="50" width="5" height="5" fill="#ffffff" /></>}
        </g>
        {/* Patung Moai yang Sedang Dilapisi Emas di Kanan */}
        <g transform="translate(186, 146)">
          <rect x="-30" y="-4" width="60" height="12" fill="#475569" stroke="#0f172a" strokeWidth="2" />
          <rect x="-24" y="-68" width="48" height="66" fill="#ca8a04" stroke="#0f172a" strokeWidth="2.5" />
          <rect x="-20" y="-64" width="18" height="58" fill="#facc15" />
          <rect x="-14" y="-58" width="8" height="24" fill="#fef08a" opacity="0.8" />
          <rect x="-16" y="-50" width="32" height="8" fill="#854d0e" />
          <rect x="-5" y="-40" width="10" height="18" fill="#a16207" />
          {!sparkle && <rect x="12" y="-56" width="6" height="6" fill="#ffffff" />}
        </g>
        {/* Warga Bodoh Menumpuk Emas ke Patung */}
        <g transform={`translate(${wx}, ${160 - Math.abs(ws) * 3})`}>
          <ellipse cx="0" cy="11" rx="9" ry="3" fill="rgba(15,23,42,0.35)" />
          <rect x="-5" y={ws > 0 ? 4 : 7} width="4" height="6" fill="#0f172a" /><rect x="1" y={ws < 0 ? 4 : 7} width="4" height="6" fill="#0f172a" />
          <rect x="-8" y="-12" width="16" height="18" fill="#dc2626" stroke="#0f172a" strokeWidth="2" />
          <rect x="-6" y="-23" width="12" height="11" fill="#fed7aa" stroke="#0f172a" strokeWidth="2" />
          <rect x="4" y="-12" width="14" height="7" fill="#facc15" stroke="#0f172a" strokeWidth="1.5" />
        </g>
        <g transform={`translate(150, ${102 - pop * 0.6})`} opacity={1 - pop / 34}><rect x="0" y="0" width="66" height="15" rx="3" fill="#0f172a" stroke="#facc15" strokeWidth="1.5" /><text x="6" y="10.5" fill="#fde047" fontSize="7" fontFamily="monospace" fontWeight="bold">LAPIS EMAS!</text></g>{wx > 158 && <><rect x="164" y="114" width="6" height="6" fill="#fef08a" /><rect x="176" y="98" width="5" height="5" fill="#ffffff" /></>}

        {/* KARAKTER CLOSE-UP: LEADER UDIN MENGGIGIT EMAS */}
        <g transform="translate(76, 224)">
          <ellipse cx="0" cy="46" rx="34" ry="8" fill="rgba(15,23,42,0.4)" />
          <rect x="-17" y="24" width="14" height="22" fill="#0f172a" /><rect x="3" y="24" width="14" height="22" fill="#0f172a" />
          <rect x="-15" y="26" width="10" height="18" fill="#1e293b" /><rect x="5" y="26" width="10" height="18" fill="#1e293b" />
          <rect x="-25" y="-24" width="50" height="52" fill="#0f172a" /><rect x="-22" y="-21" width="44" height="46" fill="#b91c1c" />
          <rect x="-16" y="-21" width="32" height="46" fill="#dc2626" /><rect x="-22" y="9" width="44" height="5" fill="#450a0a" />
          {/* Kedua Tangan Memegang Batangan Emas ke Mulut */}
          <rect x="-32" y="-26" width="11" height="22" fill="#dc2626" stroke="#0f172a" strokeWidth="2.5" />
          <rect x="21" y="-26" width="11" height="22" fill="#dc2626" stroke="#0f172a" strokeWidth="2.5" />
          {/* Kepala */}
          <rect x="-22" y="-62" width="44" height="40" fill="#0f172a" /><rect x="-19" y="-59" width="38" height="34" fill="#fed7aa" />
          <rect x="-21" y="-67" width="42" height="12" fill="#29150b" stroke="#0f172a" strokeWidth="2" />
          {/* Mata Bingung Juling Melihat Emas */}
          <rect x="-14" y="-50" width="11" height="10" fill="#fff" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="3" y="-50" width="11" height="10" fill="#fff" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="-7" y="-45" width="3.5" height="3.5" fill="#0f172a" /><rect x="4" y="-45" width="3.5" height="3.5" fill="#0f172a" />
          {/* Mulut Menggigit Batangan Emas */}
          <rect x="-10" y="-36" width="20" height={chomp ? 12 : 9} fill="#450a0a" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="-8" y="-35" width="16" height="3" fill="#ffffff" />
          <g transform={`translate(0, ${chomp ? -28 : -25})`}>
            <rect x="-18" y="-6" width="36" height="13" fill="#ca8a04" stroke="#0f172a" strokeWidth="2" />
            <rect x="-14" y="-4" width="28" height="7" fill="#facc15" />
            <rect x="-10" y="-3" width="10" height="3" fill="#fef08a" />
            <rect x="-26" y="-5" width="11" height="11" fill="#fed7aa" stroke="#0f172a" strokeWidth="2" />
            <rect x="15" y="-5" width="11" height="11" fill="#fed7aa" stroke="#0f172a" strokeWidth="2" />
          </g>
          {chomp && <><rect x="12" y="-41" width="6" height="6" fill="#ffffff" /><rect x="-20" y="-40" width="5" height="5" fill="#fde047" /><rect x="18" y="-32" width="4" height="4" fill="#7dd3fc" /></>}
          {/* Mahkota Miring */}
          <g transform="translate(4, -70) rotate(10)">
            <rect x="-17" y="-8" width="34" height="10" fill="#facc15" stroke="#0f172a" strokeWidth="2" />
            <rect x="-16" y="-15" width="8" height="8" fill="#fde047" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="-4" y="-17" width="8" height="10" fill="#fde047" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="8" y="-15" width="8" height="8" fill="#fde047" stroke="#0f172a" strokeWidth="1.5" />
          </g>
        </g>
        <g transform={`translate(114, ${60 + Math.sin(frame * 0.3) * 3})`}><rect x="0" y="0" width="36" height="32" rx="5" fill="#fff" stroke="#0f172a" strokeWidth="3" /><g transform="translate(6, 4)"><Cut2Icon type="question" size={24} /></g></g>
      </svg>
      <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24, backgroundColor: 'rgba(15, 23, 42, 0.92)', border: '4px solid #facc15', borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}><Cut2Icon type="crown" size={32} /><div><div style={{ fontFamily, fontSize: 19, color: '#facc15' }}>LEADER UDIN</div><div style={{ fontFamily, fontSize: 12, color: '#f87171', marginTop: 8 }}>GUA EMAS • PULAU BODOH</div></div></div>
        <Cut2Icon type="gold" size={32} />
      </div>
    </div>
  );
};
export const CloseUpBimaForge: React.FC<{ frame: number; localFrame: number }> = ({ frame, localFrame }) => {
  const talk = Math.abs(Math.sin(frame * 0.4)) > 0.45;
  const blink = (frame % 70) > 65;
  const hammerHit = (frame % 16) < 6;
  const zoom = interpolate(localFrame, [0, 150], [1, 1.06], { extrapolateRight: 'clamp' });
  const pop = (localFrame * 0.9) % 34;

  return (
    <div style={{ position: 'absolute', top: 215, left: 65, right: 65, height: 1170, backgroundColor: '#0f172a', border: '8px solid #38bdf8', borderRadius: 28, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.85)', zIndex: 38 }}>
      <svg width="100%" height="100%" viewBox="0 0 240 310" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges" style={{ transform: `scale(${zoom})`, transformOrigin: '50% 60%' }}>
        <rect width="240" height="108" fill="#0284c7" /><rect y="75" width="240" height="33" fill="#38bdf8" />
        <rect y="108" width="240" height="202" fill="#4ade80" /><rect y="108" width="240" height="18" fill="#22c55e" />
        {/* Tembok Benteng Batu & Menara Kastil di Latar */}
        <g>
          <rect x="0" y="78" width="240" height="36" fill="#94a3b8" stroke="#0f172a" strokeWidth="2" />
          {[8, 36, 64, 92, 120, 148, 176, 204].map((bx) => <rect key={bx} x={bx} y="68" width="16" height="12" fill="#cbd5e1" stroke="#0f172a" strokeWidth="2" />)}
          <rect x="164" y="28" width="54" height="84" fill="#64748b" stroke="#0f172a" strokeWidth="2.5" />
          <rect x="184" y="10" width="4" height="20" fill="#0f172a" /><rect x="188" y="10" width="18" height="11" fill="#2563eb" />
        </g>
        {/* Tungku Pandai Besi Menyala di Kanan */}
        <g transform="translate(132, 134)">
          <rect x="14" y="-32" width="18" height="36" fill="#475569" stroke="#0f172a" strokeWidth="2" />
          <rect x={18 + Math.sin(frame * 0.15) * 3} y={-40 - (frame % 26)} width="10" height="8" fill="#e2e8f0" opacity={0.7 - (frame % 26) / 38} />
          <rect x="0" y="0" width="76" height="58" fill="#64748b" stroke="#0f172a" strokeWidth="2.5" />
          <rect x="14" y="22" width="48" height="36" fill="#0f172a" />
          <rect x="18" y="34" width="40" height="24" fill="#ea580c" />
          <rect x="26" y="40" width="24" height="18" fill="#fde047" />
        </g>
        {/* Paron Besi (Anvil) + Percikan Api Tempaan */}
        <g transform="translate(158, 224)">
          <rect x="-24" y="0" width="48" height="12" fill="#94a3b8" stroke="#0f172a" strokeWidth="2" />
          <rect x="-12" y="12" width="24" height="14" fill="#64748b" stroke="#0f172a" strokeWidth="2" />
          <rect x="-20" y="26" width="40" height="9" fill="#475569" stroke="#0f172a" strokeWidth="2" />
          <rect x="-16" y="-4" width="32" height="5" fill="#fb923c" />
          {hammerHit && (
            <g>
              <rect x="-16" y="-18" width="5" height="5" fill="#fde047" />
              <rect x="10" y="-22" width="5" height="5" fill="#ffffff" />
              <rect x="0" y="-26" width="4" height="4" fill="#f97316" />
            </g>
          )}
        </g>
        <g transform="translate(206, 214)">
          <ellipse cx="0" cy="24" rx="14" ry="4" fill="rgba(15,23,42,0.35)" />
          <rect x="-9" y="12" width="7" height="12" fill="#1e293b" /><rect x="2" y="12" width="7" height="12" fill="#1e293b" />
          <rect x="-12" y="-12" width="24" height="26" fill="#1d4ed8" stroke="#0f172a" strokeWidth="2" />
          <rect x="-8" y="-4" width="16" height="18" fill="#78350f" />
          <rect x="-10" y="-32" width="20" height="20" fill="#fed7aa" stroke="#0f172a" strokeWidth="2" />
          <rect x="-11" y="-36" width="22" height="7" fill="#3b2110" /><rect x="-6" y="-24" width="4" height="4" fill="#0f172a" />
          <g transform={`translate(-10, -4) rotate(${hammerHit ? -12 : 42})`}>
            <rect x="-26" y="-4" width="26" height="6" fill="#78350f" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="-34" y="-10" width="12" height="18" fill="#94a3b8" stroke="#0f172a" strokeWidth="2" />
          </g>
        </g>
        <g transform={`translate(136, ${192 - pop * 0.7})`} opacity={1 - pop / 34}><rect x="0" y="0" width="64" height="15" rx="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" /><text x="6" y="10.5" fill="#38bdf8" fontSize="7" fontFamily="monospace" fontWeight="bold">+1 BENTENG</text></g>
        {/* KARAKTER CLOSE-UP: LEADER BIMA */}
        <g transform="translate(72, 222)">
          <ellipse cx="0" cy="46" rx="32" ry="8" fill="rgba(15,23,42,0.35)" />
          <rect x="-17" y="24" width="14" height="22" fill="#0f172a" /><rect x="3" y="24" width="14" height="22" fill="#0f172a" />
          <rect x="-15" y="26" width="10" height="18" fill="#1e293b" /><rect x="5" y="26" width="10" height="18" fill="#1e293b" />
          <rect x="-25" y="-24" width="50" height="52" fill="#0f172a" /><rect x="-22" y="-21" width="44" height="46" fill="#1d4ed8" />
          <rect x="-16" y="-21" width="32" height="46" fill="#2563eb" /><rect x="-22" y="9" width="44" height="6" fill="#0f172a" /><rect x="-5" y="8" width="10" height="8" fill="#facc15" />
          {/* Tangan Memegang Pedang Besi Baru */}
          <rect x="-34" y="-12" width="11" height="24" fill="#fed7aa" stroke="#0f172a" strokeWidth="2.5" />
          <g transform={`translate(24, -14) rotate(${hammerHit ? -10 : 8})`}>
            <rect x="0" y="-2" width="12" height="14" fill="#2563eb" stroke="#0f172a" strokeWidth="2" />
            <rect x="4" y="-36" width="6" height="40" fill="#e2e8f0" stroke="#0f172a" strokeWidth="2" />
            <rect x="5" y="-32" width="2" height="30" fill="#ffffff" />
            <rect x="5" y="4" width="4" height="14" fill="#78350f" />
            <rect x="-3" y="2" width="20" height="5" fill="#facc15" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="2" y="8" width="10" height="10" fill="#fed7aa" stroke="#0f172a" strokeWidth="2" />
          </g>
          <rect x="-22" y="-62" width="44" height="40" fill="#0f172a" /><rect x="-19" y="-59" width="38" height="34" fill="#fed7aa" />
          <rect x="-21" y="-67" width="42" height="13" fill="#3b2110" stroke="#0f172a" strokeWidth="2" />
          {blink ? <><rect x="-12" y="-43" width="7" height="2.5" fill="#0f172a" /><rect x="5" y="-43" width="7" height="2.5" fill="#0f172a" /></> : <><rect x="-12" y="-46" width="7" height="7" fill="#0f172a" /><rect x="5" y="-46" width="7" height="7" fill="#0f172a" /><rect x="-10" y="-45" width="2" height="2" fill="#fff" /><rect x="7" y="-45" width="2" height="2" fill="#fff" /></>}
          <rect x="-6" y="-33" width="12" height={talk ? 6 : 3} fill="#7f1d1d" />
          <g transform="translate(0, -68)"><rect x="-19" y="-9" width="38" height="11" fill="#facc15" stroke="#0f172a" strokeWidth="2" /><rect x="-18" y="-17" width="9" height="9" fill="#fde047" stroke="#0f172a" strokeWidth="2" /><rect x="-4.5" y="-20" width="9" height="12" fill="#fde047" stroke="#0f172a" strokeWidth="2" /><rect x="9" y="-17" width="9" height="9" fill="#fde047" stroke="#0f172a" strokeWidth="2" /></g>
        </g>
        <g transform={`translate(106, ${54 + Math.sin(frame * 0.25) * 3})`}><rect x="0" y="0" width="36" height="32" rx="5" fill="#fff" stroke="#0f172a" strokeWidth="3" /><g transform="translate(6, 4)"><Cut2Icon type="anvil" size={24} /></g></g>
      </svg>
      <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24, backgroundColor: 'rgba(15, 23, 42, 0.92)', border: '4px solid #38bdf8', borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}><Cut2Icon type="crown" size={32} /><div><div style={{ fontFamily, fontSize: 19, color: '#facc15' }}>LEADER BIMA</div><div style={{ fontFamily, fontSize: 12, color: '#38bdf8', marginTop: 8 }}>BENGKEL BESI • PULAU PINTAR</div></div></div>
        <Cut2Icon type="anvil" size={32} />
      </div>
    </div>
  );
};
