import math, random, struct, wave

SR = 22050

def save(name, arr):
    b = bytearray()
    for s in arr:
        b += struct.pack("<h", int(max(-1.0, min(1.0, s)) * 32767))
    with wave.open(f"public/{name}", "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(b)

random.seed(64)

save("sfx_ps_portal.wav", [
    0.34 * math.sin(2 * math.pi * (260 + 520 * (i / (0.65 * SR)) + 90 * math.sin(2 * math.pi * 16 * i / SR)) * i / SR)
    * min(1.0, i / (SR * 0.08), (0.65 * SR - i) / (SR * 0.18))
    for i in range(int(0.65 * SR))
])

save("sfx_ps_sizzle.wav", [
    ((random.random() * 2 - 1) * 0.28 + 0.18 * math.sin(2 * math.pi * 1950 * i / SR))
    * min(1.0, i / (SR * 0.08), (0.9 * SR - i) / (SR * 0.25))
    for i in range(int(0.9 * SR))
])

frz = []
for i in range(int(0.85 * SR)):
    t = i / SR
    chime = 0.24 * math.sin(2 * math.pi * (1480 + 920 * t) * t) + 0.16 * math.sin(2 * math.pi * (2960 - 400 * t) * t)
    crackle = (random.random() * 2 - 1) * (0.28 if (i % 700) < 90 else 0.07)
    frz.append((chime + crackle) * min(1.0, t / 0.04) * math.exp(-t / 0.34))
save("sfx_ps_freeze.wav", frz)
save("sfx_ps_crush.wav", [
    (0.5 * math.sin(2 * math.pi * (110 - 65 * (i / (1.1 * SR))) * i / SR) + (random.random() * 2 - 1) * 0.24)
    * math.exp(-i / (SR * 0.45))
    for i in range(int(1.1 * SR))
])

lp = 0.0; wd = []; dur_w = 6.0
for i in range(int(dur_w * SR)):
    t = i / SR
    lp = lp * 0.87 + (random.random() * 2 - 1) * 0.13
    gust = 0.55 + 0.45 * math.sin(2 * math.pi * 0.55 * t)
    wd.append(lp * 0.62 * gust * min(1.0, t / 0.25, (dur_w - t) / 0.35))
save("sfx_ps_wind.wav", wd)

lp = 0.0; st = []; dur_s = 6.0
for i in range(int(dur_s * SR)):
    t = i / SR
    lp = lp * 0.80 + (random.random() * 2 - 1) * 0.20
    roar = 0.22 * math.sin(2 * math.pi * (58 + 12 * math.sin(2 * math.pi * 0.8 * t)) * t)
    st.append((lp * 0.52 + roar) * min(1.0, t / 0.2, (dur_s - t) / 0.35))
save("sfx_ps_storm.wav", st)

lp = 0.0; th = []; dur_t = 0.75
for i in range(int(dur_t * SR)):
    t = i / SR; n = random.random() * 2 - 1
    lp = lp * 0.72 + n * 0.28
    crack = n * 0.65 * math.exp(-t / 0.045)
    rumble = (lp * 0.6 + 0.35 * math.sin(2 * math.pi * (68 - 22 * t) * t)) * math.exp(-t / 0.28)
    th.append((crack + rumble) * min(1.0, (dur_t - t) / 0.08))
save("sfx_ps_thunder.wav", th)
print("OK! 7 file SFX selesai dibuat.")
