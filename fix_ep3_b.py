import struct, wave

with open("src/WorldBoxEp3.tsx", "r") as f:
    s = f.read()

reps = [
    ("const showDragonCut = frame >= 985;", "const showDragonCut = frame >= 965;"),
    ("spring({ frame: frame - 985, fps", "spring({ frame: frame - 965, fps"),
    ("localFrame={frame - 985}", "localFrame={frame - 965}"),
    ("from={985} durationInFrames={35}", "from={965} durationInFrames={35}"),
    ("Math.min(1190, Math.ceil((lastEnd + 0.12) * fps))", "Math.min(1065, Math.ceil((lastEnd + 0.12) * fps))"),
    ("{frame < 75 && <SvgWarship3 x={265 + frame * 1.4} y={226 + frame * 0.28} frame={frame} />}",
     "{frame < 55 && <SvgWarship3 x={265 + frame * 2.8} y={226 + frame * 0.45} frame={frame} />}"),
    ("roof={hasGoldCastle ? '#ca8a04' : '#2563eb'}", "roof={frame >= 605 + idx * 10 ? '#ca8a04' : '#2563eb'}"),
    (
        "if (frame >= 620 && frame < 910 && c.id % 2 === 0) {\n              const p = walkP([[104, 86], [164, 148], [104, 86]], c.offset + frame * 0.005);\n              px = p.x + (c.id % 3) * 5; py = p.y + (c.id % 2) * 5;\n            }",
        "if (frame >= 565 && frame < 910 && c.id % 3 === 0) {\n              const a = c.id * 1.3 + frame * 0.04; px = 104 + Math.cos(a) * 18; py = 92 + Math.sin(a) * 12;\n            } else if (frame >= 565 && frame < 910 && c.id % 3 === 1) {\n              const a = c.id * 0.9 + Math.sin(frame * 0.05 + c.id) * 0.5; px = 194 + Math.cos(a) * 32; py = 148 + Math.sin(a) * 18;\n            }"
    ),
    ("const bub = dragonOut ? (c.id % 2 === 0 ? 'panic' : 'fire')", "const bub = dragonOut ? (c.id % 5 === 0 ? 'panic' : undefined)"),
    (
        "{dragonOut && (\n            <SvgDragonMap",
        "{dragonOut && [[122, 92], [156, 106], [192, 118]].map(([fx, fy], idx) => frame >= 920 + idx * 12 ? <g key={`df-${idx}`} transform={`translate(${fx}, ${fy})`}><rect x="-6" y="-8" width="12" height="9" fill="#ef4444" /><rect x="-4" y="-11" width="8" height="8" fill="#f97316" /><rect x="-2" y="-7" width="4" height="5" fill="#fde047" /></g> : null)}\n          {dragonOut && (\n            <SvgDragonMap"
    ),
    ("interpolate(frame, [910, 990], [98, 255]", "interpolate(frame, [910, 968], [98, 255]"),
    ("interpolate(frame, [910, 990], [82, 128]", "interpolate(frame, [910, 968], [82, 128]"),
]

for o, n in reps:
    assert o in s, f"Tidak ketemu: {o[:45]}"
    s = s.replace(o, n, 1)

with open("src/WorldBoxEp3.tsx", "w") as f:
    f.write(s)

# Rapikan fade-out BGM Ep 3 pas di detik ke-38
with wave.open("public/bgm_wb_ep3.wav", "rb") as w:
    sr, raw = w.getframerate(), w.readframes(int(38.2 * w.getframerate()))
samples = list(struct.unpack(f"<{len(raw)//2}h", raw))
for i in range(int(36.3 * sr), len(samples)):
    fade = max(0.0, (38.0 * sr - i) / (1.7 * sr))
    samples[i] = int(samples[i] * fade)
with wave.open("public/bgm_wb_ep3.wav", "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
    w.writeframes(struct.pack(f"<{len(samples)}h", *samples))

print("OK 2B: Peta, durasi 38 detik, dan fade-out BGM Ep 3 selesai!")
