import math, random, struct, wave
SR = 22050
def save(name, arr):
    b = bytearray()
    for s in arr: b += struct.pack("<h", int(max(-1.0, min(1.0, s)) * 32767))
    with wave.open(f"public/{name}", "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(b)
random.seed(99)
lp = 0.0; sp = []
for i in range(int(0.75 * SR)):
    t = i / SR; lp = lp * 0.72 + (random.random()*2-1) * 0.28
    plop = 0.42 * math.sin(2*math.pi*(180 + 260*t)*t) * math.exp(-t/0.12)
    sp.append((lp*0.65*math.exp(-t/0.24) + plop) * min(1.0, t/0.02))
save("sfx_md_splash.wav", sp)
bb = []
for i in range(int(0.85 * SR)):
    t = i / SR; lt = t % 0.17
    f0 = 360 + (int(t/0.17)%4)*120 + lt*1600
    bb.append(0.32 * math.sin(2*math.pi*f0*lt) * math.exp(-lt/0.055) * min(1.0, lt/0.01))
save("sfx_md_bubble.wav", bb)

ag = []
for i in range(int(0.8 * SR)):
    t = i / SR
    growl = 0.42 * math.sin(2*math.pi*(95 - 35*t + 18*math.sin(2*math.pi*22*t))*t)
    sting = 0.18 * math.sin(2*math.pi*(880 - 220*t)*t)
    ag.append((growl + sting) * min(1.0, t/0.05) * math.exp(-t/0.32))
save("sfx_md_angler.wav", ag)
sn = []
for i in range(int(1.1 * SR)):
    t = i / SR
    p1 = 0.42 * math.sin(2*math.pi*1320*t) * math.exp(-t/0.28)
    p2 = 0.15 * math.sin(2*math.pi*2640*t) * math.exp(-t/0.14)
    sn.append((p1 + p2) * min(1.0, t/0.01))
save("sfx_md_sonar.wav", sn)

cr = []
for i in range(int(1.2 * SR)):
    t = i / SR
    sub = 0.52 * math.sin(2*math.pi*(95 - 55*(t/1.2))*t)
    nz = (random.random()*2-1) * 0.26
    cr.append((sub + nz) * math.exp(-t/0.48))
save("sfx_md_crush.wav", cr)
lp = 0.0; dp = []; dur = 6.0
for i in range(int(dur * SR)):
    t = i / SR; lp = lp * 0.92 + (random.random()*2-1) * 0.08
    hum = 0.24 * math.sin(2*math.pi*(48 + 6*math.sin(2*math.pi*0.35*t))*t)
    env = min(1.0, t/0.3, (dur-t)/0.4)
    dp.append((lp * 0.65 + hum) * env)
save("sfx_md_deep.wav", dp)
print("OK! 6 SFX MarianaDive selesai.")
