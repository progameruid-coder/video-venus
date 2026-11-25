import asyncio, inspect, json, math, re, edge_tts

TEXT = (
    "Apa yang terjadi pada tubuhmu kalau nekat tidak tidur sebelas hari? "
    "Dua puluh empat jam tanpa tidur, matamu memerah dan fokus otakmu langsung anjlok setara orang mabuk! "
    "Masuk empat puluh delapan jam, otakmu mulai curi waktu lewat tidur mikro: kamu mendadak tertidur tiga detik tanpa sadar! "
    "Tujuh puluh dua jam, emosi meledak dan halusinasi menyerang! Bayangan di kamarmu terasa hidup dan menatap balik! "
    "Di hari ketujuh, sistem imun drop, detak jantung kacau, dan dinding kamar seolah ikut bergoyang! "
    "Hari kesebelas, ini batas rekor manusia: otakmu akhirnya menyerah total dan memaksa tubuh langsung tumbang tidur! "
    "Akhirnya balas dendam tidur pulas, alarm sekeras apa pun sudah tidak mempan. "
    "Jujur, rekor begadang terlama kamu tanpa tidur berapa jam? Tulis di komentar!"
)

async def main():
    kw = {"voice": "id-ID-ArdiNeural", "rate": "+10%"}
    if "boundary" in inspect.signature(edge_tts.Communicate.__init__).parameters:
        kw["boundary"] = "WordBoundary"
    comm = edge_tts.Communicate(TEXT, **kw)
    words, sents = [], []
    with open("public/vo_no_sleep.mp3", "wb") as f:
        async for ch in comm.stream():
            if ch["type"] == "audio": f.write(ch["data"])
            elif ch["type"] == "WordBoundary":
                s, d = ch["offset"]/1e7, ch["duration"]/1e7
                words.append({"w": ch["text"], "s": round(s,3), "e": round(s+d,3)})
            elif ch["type"] == "SentenceBoundary":
                s, d = ch["offset"]/1e7, ch["duration"]/1e7
                sents.append({"t": ch["text"], "s": s, "e": s+d})
    if not words and sents:
        for sg in sents:
            tks = re.findall(r"\S+", sg["t"])
            tc = sum(max(1, len(x)) for x in tks) or 1
            cur, dur = sg["s"], sg["e"] - sg["s"]
            for tk in tks:
                wd = dur * (max(1, len(tk)) / tc)
                words.append({"w": tk, "s": round(cur,3), "e": round(cur+wd,3)})
                cur += wd
    for i in range(len(words)-1):
        if words[i+1]["s"] - words[i]["e"] < 0.22: words[i]["e"] = words[i+1]["s"]
    def ft(target, after=0.0, d=1.0):
        for w in words:
            if re.sub(r"[^a-z0-9]", "", w["w"].lower()) == target and w["s"] >= after: return w["s"]
        return d
    le = words[-1]["e"] if words else 43.0
    s_24 = ft("dua", 1.5, 3.8)
    s_48 = ft("masuk", s_24+2.0, s_24+5.2)
    s_72 = ft("tujuh", s_48+2.0, s_48+5.6)
    s_sh = ft("bayangan", s_72+1.0, s_72+3.2)
    s_d7 = max(s_72+3.0, ft("ketujuh", s_72+2.5, s_72+6.5)-0.35)
    s_d11 = max(s_d7+3.0, ft("kesebelas", s_d7+2.5, s_d7+6.2)-0.25)
    s_shd = ft("menyerah", s_d11+1.5, s_d11+3.2)
    s_bk = max(s_d11+3.0, ft("balas", s_d11+2.5, s_d11+6.6)-0.35)
    s_cho = ft("jujur", s_bk+2.0, le-3.5)
    f = 30
    t24 = max(45, int(s_24*f))
    t48 = max(t24+60, int(s_48*f))
    t72 = max(t48+60, int(s_72*f))
    tSh = max(t72+24, int(s_sh*f))
    tD7 = max(t72+75, int(s_d7*f))
    tD11 = max(tD7+75, int(s_d11*f))
    tShut = max(tD11+30, int(s_shd*f))
    tBk = max(tD11+90, int(s_bk*f))
    cliff = max(tBk+120, math.ceil((le+0.15)*f))
    tCho = min(cliff-24, max(tBk+110, int(s_cho*f)))
    tm = {"t24":t24,"t48":t48,"t72":t72,"tShadow":tSh,"tDay7":tD7,"tDay11":tD11,"tShut":tShut,"tBack":tBk,"tCutEnd":tCho-4,"tChoice":tCho,"cliffFrame":cliff,"totalFrames":cliff+50}
    with open("src/noSleepWords.ts", "w") as out:
        out.write("export const WORD_SUBS_NS: { w: string; s: number; e: number }[] = " + json.dumps(words, ensure_ascii=False) + ";\n")
        out.write("export const NS_TIMING = " + json.dumps(tm) + ";\n")
    print(f"OK! {len(words)} kata, total {tm['totalFrames']/30:.2f}s ({tm['totalFrames']} frame)")

asyncio.run(main())
