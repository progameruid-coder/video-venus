import React from 'react';

const MiniBox3D: React.FC<{
  x: number; y: number; w: number; h: number;
  dx?: number; dy?: number; front: string; top: string; side: string; sw?: number;
}> = ({ x, y, w, h, dx = 3, dy = 2.2, front, top, side, sw = 1.1 }) => (
  <g stroke="#0f172a" strokeWidth={sw} strokeLinejoin="round">
    <polygon points={`${x},${y} ${x + dx},${y - dy} ${x + w + dx},${y - dy} ${x + w},${y}`} fill={top} />
    <polygon points={`${x + w},${y} ${x + w + dx},${y - dy} ${x + w + dx},${y + h - dy} ${x + w},${y + h}`} fill={side} />
    <rect x={x} y={y} width={w} height={h} fill={front} />
  </g>
);

const SHIRT_SHADES: Record<string, { front: string; top: string; side: string }> = {
  '#dc2626': { front: '#dc2626', top: '#ef4444', side: '#991b1b' },
  '#16a34a': { front: '#16a34a', top: '#22c55e', side: '#15803d' },
  '#9333ea': { front: '#9333ea', top: '#a855f7', side: '#6b21a8' },
};

export const OxyPerson: React.FC<{
  x: number; y: number; shirt: string; sunburn: boolean; showHeat: boolean;
  holdEar: boolean; panic: boolean; after: boolean; walk?: boolean; frame: number; drink?: boolean;
}> = ({ x, y, shirt, sunburn, showHeat, holdEar, panic, after, walk = false, frame, drink = false }) => {
  const sh = SHIRT_SHADES[shirt] || { front: shirt, top: shirt, side: shirt };
  const sk = sunburn
    ? { front: '#fb7185', top: '#fda4af', side: '#e11d48' }
    : { front: '#fed7aa', top: '#ffedd5', side: '#fdba74' };
  const isWave = panic && !holdEar && !after;
  const isEar = holdEar && !after;
  const fl = isWave ? Math.sin(frame * 0.72) * 18 : 0;
  const walkStep = walk ? Math.sin(frame * 0.28) * 16 : 0;
  const bounce = Math.sin(frame * (isWave ? 0.55 : 0.2));
  const sx = 1 + bounce * (isWave ? 0.045 : 0.02);
  const sy = 1 - bounce * (isWave ? 0.045 : 0.02);
  const bob = isWave ? Math.abs(Math.sin(frame * 0.45)) * -3.2 : walk ? Math.abs(Math.sin(frame * 0.28)) * -1.8 : 0;
  const blink = !panic && !after && (frame % 95) > 90;
  const wince = isEar && (frame % 26) > 16;
  const headTilt = isEar ? Math.sin(frame * 0.35) * 4 : isWave ? Math.sin(frame * 0.45) * 3 : 0;
  return (
    <g shapeRendering="auto" transform={`translate(${x + (isEar ? Math.sin(frame * 1.1) * 0.9 : 0)}, ${y + (after ? 5 : 0) + bob}) scale(${sx}, ${sy})`}>
      <ellipse cx="1.5" cy={after ? 5.5 : 10.5} rx={after ? 11 : 8.5} ry="2.8" fill="rgba(15,23,42,0.3)" />
      {after ? (
        <>
          <MiniBox3D x={-10} y={0.5} w={7.5} h={4.5} dx={2.2} dy={1.6} front="#1d4ed8" top="#3b82f6" side="#1e3a8a" sw={1} />
          <rect x="-10" y="0.5" width="2.4" height="4.5" fill="#f8fafc" stroke="#0f172a" strokeWidth="0.9" />
          <MiniBox3D x={2.5} y={0.5} w={7.5} h={4.5} dx={2.2} dy={1.6} front="#1d4ed8" top="#3b82f6" side="#1e3a8a" sw={1} />
          <rect x="7.6" y="0.5" width="2.4" height="4.5" fill="#f8fafc" stroke="#0f172a" strokeWidth="0.9" />
        </>
      ) : (
        <>
          <g transform={`translate(-3.5, 2) rotate(${walkStep})`}>
            <MiniBox3D x={-2.5} y={0} w={5} h={7.5} dx={2} dy={1.5} front="#1d4ed8" top="#3b82f6" side="#1e3a8a" sw={1} />
            <rect x="-2.5" y="5.4" width="5" height="2.2" fill="#f8fafc" stroke="#0f172a" strokeWidth="0.85" />
          </g>
          <g transform={`translate(3.5, 2) rotate(${-walkStep})`}>
            <MiniBox3D x={-2.5} y={0} w={5} h={7.5} dx={2} dy={1.5} front="#1d4ed8" top="#3b82f6" side="#1e3a8a" sw={1} />
            <rect x="-2.5" y="5.4" width="5" height="2.2" fill="#f8fafc" stroke="#0f172a" strokeWidth="0.85" />
          </g>
        </>
      )}
      <MiniBox3D x={-7} y={after ? -7 : -8} w={14} h={after ? 9.5 : 10.5} dx={3.2} dy={2.4} front={sh.front} top={sh.top} side={sh.side} sw={1.15} />
      {(!isEar || drink) && (
        <g transform={`translate(7.5, ${after ? -5 : -6.5}) rotate(${isWave && !drink ? -128 - fl : after && !drink ? -28 : walkStep * 0.5})`}>
          <MiniBox3D x={0} y={0} w={4} h={5.5} dx={1.8} dy={1.3} front={sh.front} top={sh.top} side={sh.side} sw={1} />
          <MiniBox3D x={0} y={5} w={4} h={3} dx={1.8} dy={1.3} front={sk.front} top={sk.top} side={sk.side} sw={1} />
        </g>
      )}
      {drink && (
        <g transform={`translate(12, ${after ? -4.5 : -5.5})`}>
          <g transform="translate(3.8, -0.5) rotate(24)"><rect x="-0.8" y="-4.5" width="1.6" height="5" fill="#ef4444" stroke="#0f172a" strokeWidth="0.6" /></g>
          <MiniBox3D x={0} y={0} w={5.5} h={7} dx={1.8} dy={1.4} front="#38bdf8" top="#e0f2fe" side="#0284c7" sw={0.95} />
          <rect x="-0.4" y="-0.8" width="6.2" height="1.5" fill="#f8fafc" stroke="#0f172a" strokeWidth="0.7" />
        </g>
      )}
      {!isEar && (
        <g transform={`translate(-7.5, ${after ? -5 : -6.5}) rotate(${isWave ? 128 + fl : after ? 28 : -walkStep * 0.5})`}>
          <MiniBox3D x={-4} y={0} w={4} h={5.5} dx={1.8} dy={1.3} front={sh.front} top={sh.top} side={sh.side} sw={1} />
          <MiniBox3D x={-4} y={5} w={4} h={3} dx={1.8} dy={1.3} front={sk.front} top={sk.top} side={sk.side} sw={1} />
        </g>
      )}
      <g transform={`translate(0, ${after ? -7 : -8}) rotate(${headTilt})`}>
        <MiniBox3D x={-8.5} y={-16} w={17} h={16} dx={4} dy={3} front={sk.front} top={sk.top} side={sk.side} sw={1.25} />
        <MiniBox3D x={-9} y={-20} w={18} h={4.5} dx={4} dy={3} front="#3b1d0e" top="#5c2d16" side="#1f0e06" sw={1.15} />
        <rect x="-7" y="-15.5" width="3.5" height="2" fill="#3b1d0e" /><rect x="3" y="-15.5" width="4" height="1.6" fill="#3b1d0e" />
        {sunburn && <><rect x="-7.2" y="-6.2" width="3" height="1.8" fill="#f43f5e" /><rect x="4.2" y="-6.2" width="3" height="1.8" fill="#f43f5e" /></>}
        {wince ? (
          <g stroke="#0f172a" strokeWidth="1.5" fill="none" strokeLinecap="square"><polyline points="-6,-12 -3,-10 -6,-8" /><polyline points="6,-12 3,-10 6,-8" /></g>
        ) : blink ? (
          <><rect x="-6.2" y="-10" width="4.5" height="1.3" fill="#0f172a" /><rect x="1.7" y="-10" width="4.5" height="1.3" fill="#0f172a" /></>
        ) : (
          <>
            <rect x="-6.2" y="-12.5" width="4.6" height="5.2" fill="#ffffff" stroke="#0f172a" strokeWidth="1" />
            <rect x="1.6" y="-12.5" width="4.6" height="5.2" fill="#ffffff" stroke="#0f172a" strokeWidth="1" />
            <rect x="-4.7" y="-10.6" width="2.2" height="2.4" fill="#0f172a" /><rect x="2.9" y="-10.6" width="2.2" height="2.4" fill="#0f172a" />
            <rect x="-4.5" y="-10.4" width="1" height="1" fill="#ffffff" /><rect x="3.1" y="-10.4" width="1" height="1" fill="#ffffff" />
          </>
        )}
        {(panic || after) && <rect x="-3" y="-5.2" width="6" height={isWave || isEar ? 3 : 2} fill="#7f1d1d" stroke="#0f172a" strokeWidth="0.7" />}
        {isEar && (
          <>
            <MiniBox3D x={-12.5} y={-6} w={3.8} h={6.5} dx={1.6} dy={1.2} front={sh.front} top={sh.top} side={sh.side} sw={0.95} />
            <MiniBox3D x={-12} y={-10.5} w={4} h={4.5} dx={1.6} dy={1.2} front={sk.front} top={sk.top} side={sk.side} sw={0.95} />
            {!drink && (
              <>
                <MiniBox3D x={10} y={-6} w={3.8} h={6.5} dx={1.6} dy={1.2} front={sh.front} top={sh.top} side={sh.side} sw={0.95} />
                <MiniBox3D x={9.5} y={-10.5} w={4} h={4.5} dx={1.6} dy={1.2} front={sk.front} top={sk.top} side={sk.side} sw={0.95} />
              </>
            )}
            <g opacity={frame % 8 < 4 ? 1 : 0.3} fill="#fde047"><rect x="-16" y="-12" width="1.8" height="1.8" /><rect x="-17.8" y="-10.2" width="1.8" height="4.4" /><rect x="-16" y="-5.8" width="1.8" height="1.8" /></g>
          </>
        )}
        {showHeat && [-4, 4].map((hx, i) => {
          const hp = ((frame + i * 10) % 20) / 20;
          return <rect key={i} x={hx} y={-25 - hp * 9} width="2.4" height="3.5" fill="#fef08a" opacity={Math.sin(hp * Math.PI) * 0.78} />;
        })}
      </g>
    </g>
  );
};
