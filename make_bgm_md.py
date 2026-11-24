import json, math, random, re, struct, wave
with open("src/marianaDiveWords.ts") as f:
    tm = json.loads(re.search(r"MD_TIMING = (\{.*?\});", f.read()).group(1))
SR = 22050
t_d, t_b, t_tot = tm["t1000"]/30.0, tm["tBack"]/30.0, tm["totalFrames"]/30.0
def fq(m): return 440.0 * (2 ** ((m - 69) / 12.0)) if m > 0 else 0.0
random.seed(88)
m1 = [72,76,79,81,79,76,74,76, 72,76,79,84,81,0,79,0]
b1 = [48,55,48,55, 45,52,43,50]
m2 = [64,67,69,67,64,63,64,0, 64,67,71,69,67,64,62,0]
b2 = [36,43,36,43, 33,40,35,42]
m3 = [72,74,76,79,84,81,79,76, 74,79,76,72,74,0,72,0]
b3 = [48,55,45,52, 41,48,43,50]
buf = bytearray()
for i in range(int((t_tot + 0.3) * SR)):
    t = i / SR
    sd = 0.175 if t_d <= t < t_b else 0.205
    st, lt = int(t / sd), (t % sd) / sd
    if t < t_d: mn, bn = m1[st%16], b1[(st//2)%8]
    elif t < t_b: mn, bn = m2[st%16], b2[(st//2)%8]
    else: mn, bn = m3[st%16], b3[(st//2)%8]
    s = 0.0
    if mn: s += (0.22 if (t*fq(mn))%1.0 < 0.35 else -0.22) * min(1.0, lt*14) * math.exp(-lt*2.6)
    if bn:
        bp = (t*fq(bn))%1.0
        s += 0.25 * (4.0*abs(bp-0.5)-1.0) * min(1.0, lt*10) * math.exp(-lt*2.0)
    if mn and (st%2==1) and lt < 0.1: s += (random.random()*2-1)*0.05*(1-lt/0.1)
    if t > t_tot - 1.8: s *= max(0.0, (t_tot - t) / 1.8)
    buf += struct.pack("<h", int(max(-1.0, min(1.0, s)) * 32767))
with wave.open("public/bgm_mariana_dive.wav", "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(buf)
print("OK! BGM MarianaDive selesai.")
