import asyncio, inspect, json, math, re, edge_tts

TEXT = (
    "Seberapa dalam kamu bisa menyelam sebelum tubuhmu hancur? "
    "Di kedalaman empat puluh meter, penyelam biasa masih santai lihat terumbu karang. "
    "Turun ke tiga ratus tiga puluh dua meter, ini rekor terdalam manusia, paru-paru sudah terasa terjepit! "
    "Masuk seribu meter, cahaya matahari habis total! Gelap gulita, dingin menusuk, dan penuh ikan monster bercahaya! "
    "Lanjut ke tiga ribu delapan ratus meter, kamu ketemu bangkai kapal Titanic dengan tekanan tiga ratus delapan puluh kali Bumi! "
    "Terakhir, sebelas ribu meter di dasar Palung Mariana: tekanannya seribu seratus kali Bumi, setara ditindih lima puluh pesawat, tubuhmu langsung remuk dalam sekejap! "
    "Balik ke pantai, ternyata daratan tetap paling aman. "
    "Kalau disuruh milih, lebih serem nyasar di luar angkasa atau dasar laut? Tulis di komentar!"
)

async def main():
    kw = {"voice": "id-ID-ArdiNeural", "rate": "+10%"}
    if "boundary" in inspect.signature(edge_tts.Communicate.__init__).parameters:
        kw["boundary"] = "WordBoundary"
    comm = edge_tts.Communicate(TEXT, **kw)
    words, sents = [], []
    with open("public/vo_mariana_dive.mp3", "wb") as f:
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
    le = words[-1]["e"] if words else 42.0
    s_40   = ft("kedalaman", 1.5, 3.4)
    s_332  = ft("turun", s_40 + 2.0, s_40 + 4.8)
    s_1000 = ft("masuk", s_332 + 2.0, s_332 + 5.2)
    s_ang  = ft("ikan", s_1000 + 1.0, s_1000 + 3.4)
    s_3800 = ft("lanjut", s_1000 + 3.0, s_1000 + 6.2)
    s_11k  = ft("terakhir", s_3800 + 3.0, s_3800 + 6.2)
    s_back = ft("balik", s_11k + 3.0, s_11k + 7.2)
    s_cho  = ft("luar", s_back + 2.5, le - 2.8)
    f = 30
    t_40   = max(45, int(s_40 * f))
    t_332  = max(t_40 + 60, int(s_332 * f))
    t_1000 = max(t_332 + 60, int(s_1000 * f))
    t_ang  = max(t_1000 + 25, int(s_ang * f))
    t_3800 = max(t_1000 + 75, int(s_3800 * f))
    t_11k  = max(t_3800 + 75, int(s_11k * f))
    t_back = max(t_11k + 90, int(s_back * f))
    cliff  = max(t_back + 110, math.ceil((le + 0.15) * f))
    t_cho  = min(cliff - 18, max(t_back + 100, int(s_cho * f) - 6))
    tm = {"t40": t_40, "t332": t_332, "t1000": t_1000, "tAngler": t_ang, "t3800": t_3800, "t11k": t_11k, "tBack": t_back, "tCutStart": t_back, "tCutEnd": max(t_back + 100, t_cho - 6), "tChoice": t_cho, "cliffFrame": cliff, "totalFrames": cliff + 50}
    with open("src/marianaDiveWords.ts", "w") as out:
        out.write("export const WORD_SUBS_MD: { w: string; s: number; e: number }[] = " + json.dumps(words, ensure_ascii=False) + ";\n")
        out.write("export const MD_TIMING = " + json.dumps(tm) + ";\n")
    print(f"OK! {len(words)} kata, total {tm['totalFrames']/30:.2f}s ({tm['totalFrames']} frame)")

asyncio.run(main())
