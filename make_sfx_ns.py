import math, random, struct, wave
SR = 22050
def save(name, arr):
    b = bytearray()
    for s in arr: b += struct.pack("<h", int(max(-1.0, min(1.0, s)) * 32767))
    with wave.open(f"public/{name}", "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(b)
random.seed(77)
ck = []
for i in range(int(1.2 * SR)):
    t = i / SR; lt = t % 0.15; f0 = 1400 if int(t/0.15)%2==0 else 1050
    ck.append(0.36 * math.sin(2*math.pi*f0*lt) * math.exp(-lt/0.015))
save("sfx_ns_clock.wav", ck)
th = []
for i in range(int(0.6 * SR)):
    t = i / SR
    th.append((0.55*math.sin(2*math.pi*(120-80*t)*t) + (random.random()*2-1)*0.18) * math.exp(-t/0.14))
save("sfx_ns_thud.wav", th)
hl = []
for i in range(int(1.2 * SR)):
    t = i / SR; env = min(1.0, t/0.18, (1.2-t)/0.3)
    w1 = math.sin(2*math.pi*(110 + 18*math.sin(2*math.pi*5*t))*t)
    w2 = math.sin(2*math.pi*(520 - 180*t)*t) * 0.3
    hl.append((w1*0.34 + w2 + (random.random()*2-1)*0.08) * env)
save("sfx_ns_hallu.wav", hl)
ht = []
for i in range(int(1.5 * SR)):
    t = i / SR; lt = t % 0.42
    p1 = math.exp(-((lt-0.06)/0.025)**2) * math.sin(2*math.pi*62*lt)
    p2 = 0.72 * math.exp(-((lt-0.18)/0.022)**2) * math.sin(2*math.pi*52*lt)
    ht.append(0.55 * (p1 + p2))
save("sfx_ns_heart.wav", ht)
sd = []
for i in range(int(1.0 * SR)):
    t = i / SR; f0 = 720 * math.exp(-t*3.2) + 45
    sd.append(0.45 * math.sin(2*math.pi*f0*t) * min(1.0, t/0.02) * math.exp(-t/0.42))
save("sfx_ns_shutdown.wav", sd)
