import React from 'react';
import { interpolate } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PressStart2P';

const { fontFamily } = loadFont();

const CutIcon: React.FC<{ type: string; size?: number }> = ({ type, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" shapeRendering="crispEdges">
    {type === 'crown' && <><rect x="1" y="7" width="10" height="3" fill="#facc15" /><rect x="1" y="3" width="2" height="4" fill="#facc15" /><rect x="5" y="2" width="2" height="5" fill="#fde047" /><rect x="9" y="3" width="2" height="4" fill="#facc15" /></>}
    {type === 'bulb' && <><rect x="3" y="1" width="6" height="5" fill="#fde047" /><rect x="4" y="6" width="4" height="2" fill="#facc15" /><rect x="4" y="8" width="4" height="2" fill="#64748b" /></>}
    {type === 'wheat' && <><rect x="5" y="2" width="2" height="9" fill="#ca8a04" /><rect x="3" y="2" width="2" height="2" fill="#fde047" /><rect x="7" y="4" width="2" height="2" fill="#facc15" /></>}
    {type === 'fire' && <><rect x="3" y="5" width="6" height="6" fill="#ef4444" /><rect x="4" y="2" width="4" height="5" fill="#f97316" /><rect x="5" y="6" width="2" height="4" fill="#fde047" /></>}
    {type === 'panic' && <><rect x="5" y="1" width="2" height="6" fill="#dc2626" /><rect x="5" y="9" width="2" height="2" fill="#dc2626" /></>}
  </svg>
);

const CutFire: React.FC<{ frame: number }> = ({ frame }) => {
  const f1 = Math.sin(frame * 0.7) * 2;
  const f2 = Math.cos(frame * 0.9) * 2.5;
  return (
    <g>
      <rect x="-15" y="0" width="30" height="6" fill="#451a03" />
      <rect x="-11" y="-3" width="22" height="4" fill="#78350f" />
      <rect x="-12" y={-12 + f1} width="24" height="13" fill="#dc2626" />
      <rect x="-9" y={-19 + f2} width="18" height="15" fill="#f97316" />
      <rect x="-5" y={-14 - f1} width="10" height="11" fill="#fde047" />
      {[0, 1, 2, 3].map((i) => {
        const l = (frame * 2.2 + i * 11) % 38;
        return <rect key={i} x={-10 + i * 7 + Math.sin(frame * 0.3 + i) * 4} y={-18 - l} width="2.6" height="2.6" fill="#fde047" opacity={Math.max(0, 1 - l / 38)} />;
      })}
    </g>
  );
};
export const CloseUpBima: React.FC<{ frame: number; localFrame: number }> = ({ frame, localFrame }) => {
  const talk = Math.abs(Math.sin(frame * 0.42)) > 0.45;
  const blink = (frame % 75) > 70;
  const breathe = Math.sin(frame * 0.16) * 2;
  const armWave = Math.sin(frame * 0.25) * 6;
  const wx = 152 + Math.sin(frame * 0.055) * 28;
  const wf = Math.cos(frame * 0.055) < 0 ? -1 : 1;
  const ws = Math.sin(frame * 0.45);
  const sw = Math.sin(frame * 0.18) * 2.2;
  const zoom = interpolate(localFrame, [0, 140], [1, 1.06], { extrapolateRight: 'clamp' });
  const pop = (localFrame * 0.8) % 34;
  return (
    <div style={{ position: 'absolute', top: 215, left: 65, right: 65, height: 1170, backgroundColor: '#0f172a', border: '8px solid #38bdf8', borderRadius: 28, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.85)', zIndex: 38 }}>
      <svg width="100%" height="100%" viewBox="0 0 240 310" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges" style={{ transform: `scale(${zoom})`, transformOrigin: '45% 60%' }}>
        <rect width="240" height="105" fill="#38bdf8" /><rect y="75" width="240" height="30" fill="#7dd3fc" />
        <rect x="200" y="14" width="20" height="20" fill="#fde047" />
        <rect x={(16 + frame * 0.22) % 260 - 20} y="18" width="42" height="12" fill="#f0f9ff" />
        <rect x={(135 + frame * 0.16) % 260 - 20} y="34" width="48" height="13" fill="#e0f2fe" />
        <rect y="105" width="240" height="205" fill="#4ade80" /><rect y="105" width="240" height="18" fill="#22c55e" />
        {[114, 198, 224].map((tx, i) => <g key={i} transform={`translate(${tx}, 116)`}><rect x="-3" y="-6" width="6" height="10" fill="#78350f" /><rect x="-12" y="-22" width="24" height="16" fill="#166534" /><rect x="-8" y="-32" width="16" height="12" fill="#15803d" /><rect x="-4" y="-38" width="8" height="7" fill="#22c55e" /></g>)}
        <rect x="66" y="48" width="12" height="22" fill="#475569" />
        <rect x={69 + Math.sin(frame * 0.12) * 3} y={40 - (frame % 26)} width="8" height="7" fill="#f8fafc" opacity={0.72 - (frame % 26) / 36} />
        <rect x="12" y="82" width="82" height="52" fill="#0f172a" /><rect x="15" y="85" width="76" height="46" fill="#d97706" />
        <rect x="6" y="66" width="94" height="22" fill="#0f172a" /><rect x="9" y="69" width="88" height="16" fill="#2563eb" /><rect x="19" y="59" width="68" height="11" fill="#1d4ed8" />
        <rect x="44" y="103" width="18" height="28" fill="#451a03" /><rect x="23" y="96" width="14" height="14" fill="#fef08a" stroke="#0f172a" strokeWidth="2" />
        <rect x="0" y="142" width="240" height="20" fill="#d97706" opacity="0.45" />
        <g transform={`translate(${wx}, ${152 - Math.abs(ws) * 3}) scale(${wf}, 1)`}>
          <ellipse cx="0" cy="12" rx="10" ry="3" fill="rgba(15,23,42,0.3)" />
          <rect x="-6" y={ws > 0 ? 4 : 7} width="5" height="7" fill="#1e293b" /><rect x="1" y={ws < 0 ? 4 : 7} width="5" height="7" fill="#1e293b" />
          <rect x="-9" y="-13" width="18" height="20" fill="#0f172a" /><rect x="-7" y="-11" width="14" height="16" fill="#2563eb" />
          <rect x="-8" y="-26" width="16" height="14" fill="#0f172a" /><rect x="-6" y="-24" width="12" height="10" fill="#fed7aa" />
          <rect x="-6" y="-26" width="12" height="4" fill="#451a03" /><rect x="5" y="-9" width="16" height="6" fill="#78350f" stroke="#0f172a" strokeWidth="1.5" />
        </g>
        <g transform="translate(116, 206)">
          {[0, 20, 40, 60, 80, 100, 114].map((fx) => <rect key={fx} x={fx} y="-6" width="5" height="14" fill="#78350f" stroke="#0f172a" strokeWidth="1" />)}
          <rect x="0" y="-2" width="118" height="3" fill="#b45309" />
          {[0, 1, 2].map((r) => <g key={r} transform={`translate(${r * 4}, ${12 + r * 19})`}><rect x="0" y="6" width="108" height="11" fill="#78350f" /><rect x="2" y="8" width="104" height="7" fill="#92400e" />{[0, 1, 2, 3, 4, 5].map((c) => <g key={c} transform={`translate(${10 + c * 16 + sw}, -7)`}><rect x="2" y="4" width="3" height="13" fill="#ca8a04" /><rect x="0" y="0" width="7" height="7" fill="#fde047" /></g>)}</g>)}
        </g>
        <g transform={`translate(152, ${188 - pop})`} opacity={1 - pop / 34}><rect x="0" y="0" width="52" height="14" rx="3" fill="#0f172a" opacity="0.82" /><text x="6" y="10" fill="#fde047" fontSize="7" fontFamily="monospace" fontWeight="bold">+1 GANDUM</text></g>
        <g transform={`translate(68, ${222 + breathe})`}>
          <ellipse cx="0" cy={46 - breathe} rx="32" ry="8" fill="rgba(15,23,42,0.35)" />
          <rect x="-17" y="24" width="14" height="22" fill="#0f172a" /><rect x="3" y="24" width="14" height="22" fill="#0f172a" />
          <rect x="-15" y="26" width="10" height="18" fill="#1e293b" /><rect x="5" y="26" width="10" height="18" fill="#1e293b" />
          <rect x="-25" y="-24" width="50" height="52" fill="#0f172a" /><rect x="-22" y="-21" width="44" height="46" fill="#1d4ed8" />
          <rect x="-16" y="-21" width="32" height="46" fill="#2563eb" /><rect x="-22" y="9" width="44" height="6" fill="#0f172a" /><rect x="-5" y="8" width="10" height="8" fill="#facc15" />
          <rect x="-35" y="-14" width="12" height="26" fill="#fed7aa" stroke="#0f172a" strokeWidth="2.5" />
          <rect x="-46" y="-8" width="24" height="20" fill="#93c5fd" stroke="#0f172a" strokeWidth="2.5" />
          <rect x="-42" y="-3" width="16" height="3" fill="#ffffff" /><rect x="-42" y="3" width="12" height="3" fill="#ffffff" />
          <g transform={`translate(23, -13) rotate(${8 + armWave})`}><rect x="0" y="0" width="22" height="11" fill="#fed7aa" stroke="#0f172a" strokeWidth="2.5" /></g>
          <rect x="-22" y="-62" width="44" height="40" fill="#0f172a" /><rect x="-19" y="-59" width="38" height="34" fill="#fed7aa" />
          <rect x="-21" y="-67" width="42" height="13" fill="#3b2110" stroke="#0f172a" strokeWidth="2" />
          {blink ? <><rect x="-12" y="-43" width="7" height="2.5" fill="#0f172a" /><rect x="5" y="-43" width="7" height="2.5" fill="#0f172a" /></> : <><rect x="-12" y="-46" width="7" height="7" fill="#0f172a" /><rect x="5" y="-46" width="7" height="7" fill="#0f172a" /><rect x="-10" y="-45" width="2" height="2" fill="#fff" /><rect x="7" y="-45" width="2" height="2" fill="#fff" /></>}
          <rect x="-6" y="-33" width="12" height={talk ? 6 : 3} fill="#7f1d1d" />
          <g transform="translate(0, -68)"><rect x="-19" y="-9" width="38" height="11" fill="#facc15" stroke="#0f172a" strokeWidth="2" /><rect x="-18" y="-17" width="9" height="9" fill="#fde047" stroke="#0f172a" strokeWidth="2" /><rect x="-4.5" y="-20" width="9" height="12" fill="#fde047" stroke="#0f172a" strokeWidth="2" /><rect x="9" y="-17" width="9" height="9" fill="#fde047" stroke="#0f172a" strokeWidth="2" /></g>
        </g>
        <g transform={`translate(106, ${58 + Math.sin(frame * 0.25) * 3})`}><rect x="0" y="0" width="36" height="32" rx="5" fill="#fff" stroke="#0f172a" strokeWidth="3" /><g transform="translate(6, 4)"><CutIcon type="bulb" size={24} /></g></g>
      </svg>
      <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24, backgroundColor: 'rgba(15, 23, 42, 0.92)', border: '4px solid #38bdf8', borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}><CutIcon type="crown" size={32} /><div><div style={{ fontFamily, fontSize: 19, color: '#facc15' }}>LEADER BIMA</div><div style={{ fontFamily, fontSize: 12, color: '#38bdf8', marginTop: 8 }}>PULAU PINTAR</div></div></div>
        <CutIcon type="wheat" size={32} />
      </div>
    </div>
  );
};
export const CloseUpUdin: React.FC<{ frame: number; localFrame: number }> = ({ frame, localFrame }) => {
  const shakeX = Math.sin(frame * 1.5) * 2.5;
  const camShake = Math.sin(frame * 1.9) * 1.6;
  const flail = Math.sin(frame * 0.85) * 18;
  const rx = ((localFrame * 3.8) % 270) - 25;
  const rs = Math.sin(frame * 0.75);
  const fp = 0.2 + Math.sin(frame * 0.6) * 0.08;
  return (
    <div style={{ position: 'absolute', top: 215, left: 65, right: 65, height: 1170, backgroundColor: '#0f172a', border: '8px solid #ef4444', borderRadius: 28, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.85)', zIndex: 38 }}>
      <svg width="100%" height="100%" viewBox="0 0 240 310" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges" style={{ transform: `translate(${camShake}px, ${-camShake * 0.5}px) scale(1.03)` }}>
        <rect width="240" height="114" fill="#7c2d12" /><rect y="72" width="240" height="42" fill="#9a3412" />
        <rect y="114" width="240" height="196" fill="#a16207" /><rect y="114" width="240" height="16" fill="#854d0e" />
        <g transform="translate(182, 136)">
          <ellipse cx="0" cy="8" rx="34" ry="8" fill="rgba(15,23,42,0.35)" />
          <rect x="-30" y="-4" width="60" height="12" fill="#475569" stroke="#0f172a" strokeWidth="2" />
          <g transform="rotate(7)"><rect x="-24" y="-68" width="48" height="66" fill="#94a3b8" stroke="#0f172a" strokeWidth="2.5" /><rect x="-16" y="-52" width="32" height="8" fill="#475569" /><rect x="-5" y="-42" width="10" height="20" fill="#64748b" /></g>
        </g>
        {[12, 42, 72, 102, 132].map((fx) => <rect key={fx} x={fx} y="128" width="6" height="18" fill="#78350f" stroke="#0f172a" strokeWidth="1" />)}
        <rect x="0" y="134" width="142" height="4" fill="#92400e" /><rect x="0" y="152" width="240" height="16" fill="#854d0e" opacity="0.55" />
        <g transform={`translate(${rx}, ${160 - Math.abs(rs) * 3})`}>
          <ellipse cx="0" cy="11" rx="9" ry="3" fill="rgba(15,23,42,0.35)" />
          <rect x="-5" y={rs > 0 ? 4 : 7} width="4" height="6" fill="#0f172a" /><rect x="1" y={rs < 0 ? 4 : 7} width="4" height="6" fill="#0f172a" />
          <rect x="-8" y="-12" width="16" height="18" fill="#dc2626" stroke="#0f172a" strokeWidth="2" /><rect x="-6" y="-23" width="12" height="11" fill="#fed7aa" stroke="#0f172a" strokeWidth="2" />
        </g>
        <ellipse cx="176" cy="248" rx="68" ry="26" fill="#f97316" opacity={fp} />
        <g transform="translate(178, 246) scale(2.5)"><CutFire frame={frame} /></g>
        <g transform={`translate(${70 + shakeX}, 224)`}>
          <ellipse cx="0" cy="46" rx="32" ry="8" fill="rgba(15,23,42,0.4)" />
          <rect x="-17" y="24" width="14" height="22" fill="#0f172a" /><rect x="3" y="24" width="14" height="22" fill="#0f172a" />
          <rect x="-15" y="26" width="10" height="18" fill="#1e293b" /><rect x="5" y="26" width="10" height="18" fill="#1e293b" />
          <rect x="-25" y="-24" width="50" height="52" fill="#0f172a" /><rect x="-22" y="-21" width="44" height="46" fill="#b91c1c" />
          <rect x="-16" y="-21" width="32" height="46" fill="#dc2626" /><rect x="-22" y="9" width="44" height="5" fill="#450a0a" />
          <g transform={`translate(-23, -12) rotate(${-50 + flail})`}><rect x="-11" y="-18" width="11" height="27" fill="#fed7aa" stroke="#0f172a" strokeWidth="2.5" /></g>
          <g transform={`translate(23, -12) rotate(${42 - flail})`}><rect x="0" y="-18" width="11" height="27" fill="#fed7aa" stroke="#0f172a" strokeWidth="2.5" /><rect x="3" y="-36" width="6" height="20" fill="#78350f" stroke="#0f172a" strokeWidth="1.5" /><rect x="0" y="-46" width="12" height="12" fill="#f97316" /><rect x="3" y="-43" width="6" height="7" fill="#fde047" /></g>
          <rect x="-22" y="-62" width="44" height="40" fill="#0f172a" /><rect x="-19" y="-59" width="38" height="34" fill="#fed7aa" />
          <rect x="-21" y="-67" width="42" height="12" fill="#29150b" stroke="#0f172a" strokeWidth="2" />
          <rect x="16" y={-56 + (frame % 12)} width="4" height="6" fill="#7dd3fc" /><rect x="-20" y={-51 + ((frame + 6) % 12)} width="4" height="6" fill="#7dd3fc" />
          <rect x="-15" y="-51" width="12" height="12" fill="#fff" stroke="#0f172a" strokeWidth="1.5" /><rect x="3" y="-51" width="12" height="12" fill="#fff" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="-10" y="-46" width="4" height="4" fill="#0f172a" /><rect x="7" y="-46" width="4" height="4" fill="#0f172a" />
          <rect x="-8" y="-35" width="16" height="10" fill="#450a0a" stroke="#0f172a" strokeWidth="1.5" /><rect x="-5" y="-34" width="10" height="2.5" fill="#fff" />
          <g transform="translate(5, -71) rotate(14)"><rect x="-17" y="-8" width="34" height="10" fill="#facc15" stroke="#0f172a" strokeWidth="2" /><rect x="-16" y="-15" width="8" height="8" fill="#fde047" stroke="#0f172a" strokeWidth="1.5" /><rect x="-4" y="-17" width="8" height="10" fill="#fde047" stroke="#0f172a" strokeWidth="1.5" /><rect x="8" y="-15" width="8" height="8" fill="#fde047" stroke="#0f172a" strokeWidth="1.5" /></g>
        </g>
        <g transform={`translate(16, ${98 + Math.sin(frame * 0.6) * 3})`}><rect x="0" y="0" width="36" height="32" rx="5" fill="#fff" stroke="#dc2626" strokeWidth="3" /><g transform="translate(6, 4)"><CutIcon type="panic" size={24} /></g></g>
      </svg>
      <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24, backgroundColor: 'rgba(15, 23, 42, 0.92)', border: '4px solid #ef4444', borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}><CutIcon type="crown" size={32} /><div><div style={{ fontFamily, fontSize: 19, color: '#facc15' }}>LEADER UDIN</div><div style={{ fontFamily, fontSize: 12, color: '#f87171', marginTop: 8 }}>PULAU BODOH</div></div></div>
        <CutIcon type="fire" size={32} />
      </div>
    </div>
  );
};
