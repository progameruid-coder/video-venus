import asyncio, inspect, json, math, re, edge_tts

TEXT = (
    "Berapa lama kamu bisa bertahan hidup di planet lain tanpa baju astronot? "
    "Di Bumi, kita santai hidup sampai delapan puluh tahun. "
    "Tapi begitu pindah ke Merkurius, sisi siangnya empat ratus derajat dan malamnya minus seratus delapan puluh derajat, cuma kuat dua detik, langsung gosong atau beku! "
    "Masuk ke Venus lebih ngeri lagi: hujan asam ditambah tekanan sembilan puluh dua kali Bumi, kurang dari satu detik langsung remuk! "
    "Pindah ke Mars justru paling lama, kamu bisa tahan sekitar dua menit sambil tahan napas, sebelum beku kedinginan! "
    "Terakhir, Jupiter: tidak ada daratan, kamu langsung jatuh tersedot badai raksasa dan hancur kurang dari satu detik! "
    "Balik ke Bumi, ternyata memang cuma Bumi yang paling nyaman. "
    "Kalau wajib pindah pakai baju astronot, kamu pilih planet mana? Tulis di komentar!"
)

async def main():
    kw = {"voice": "id-ID-ArdiNeural", "rate": "+10%"}
    if "boundary" in inspect.signature(edge_tts.Communicate.__init__).parameters:
        kw["boundary"] = "WordBoundary"
    comm = edge_tts.Communicate(TEXT, **kw)
    words, sents = [], []
    with open("public/vo_planet_surv.mp3", "wb") as f:
        async for ch in comm.stream():
            if ch["type"] == "audio":
                f.write(ch["data"])
            elif ch["type"] == "WordBoundary":
                s, d = ch["offset"] / 1e7, ch["duration"] / 1e7
                words.append({"w": ch["text"], "s": round(s, 3), "e": round(s + d, 3)})
            elif ch["type"] == "SentenceBoundary":
                s, d = ch["offset"] / 1e7, ch["duration"] / 1e7
                sents.append({"t": ch["text"], "s": s, "e": s + d})

    if not words and sents:
        for sg in sents:
            tks = re.findall(r"\S+", sg["t"])
            tc = sum(max(1, len(x)) for x in tks) or 1
            cur, dur = sg["s"], sg["e"] - sg["s"]
            for tk in tks:
                wd = dur * (max(1, len(tk)) / tc)
                words.append({"w": tk, "s": round(cur, 3), "e": round(cur + wd, 3)})
                cur += wd
    for i in range(len(words) - 1):
        if words[i + 1]["s"] - words[i]["e"] < 0.22:
            words[i]["e"] = words[i + 1]["s"]

    def ft(target, after=0.0, d=1.0):
        for w in words:
            if re.sub(r"[^a-z0-9]", "", w["w"].lower()) == target and w["s"] >= after:
                return w["s"]
        return d

    le = words[-1]["e"] if words else 42.0
    s_estat = ft("bumi", 1.5, 3.6)
    s_port  = ft("tapi", 4.0, 6.4)
    s_merc  = ft("merkurius", s_port, s_port + 1.2)
    s_mnigh = ft("malamnya", s_merc + 0.8, s_merc + 3.0)
    s_ven   = ft("venus", s_merc + 2.5, s_merc + 7.5)
    s_mars  = ft("mars", s_ven + 2.5, s_ven + 6.5)
    s_jup   = ft("jupiter", s_mars + 2.5, s_mars + 6.5)
    s_back  = ft("balik", s_jup + 2.5, s_jup + 6.5)
    s_cta   = ft("kalau", s_back + 1.5, le - 4.2)
    s_choic = ft("pilih", s_cta, le - 2.2)

    f = 30
    t_estat = max(45, int(s_estat * f) - 4)
    t_port  = max(t_estat + 45, int(s_port * f))
    t_merc  = max(t_port + 18, int(s_merc * f))
    t_mnigh = max(t_merc + 35, int(s_mnigh * f))
    t_ven   = max(t_mnigh + 45, int(s_ven * f))
    t_mars  = max(t_ven + 60, int(s_mars * f))
    t_jup   = max(t_mars + 60, int(s_jup * f))
    t_back  = max(t_jup + 60, int(s_back * f))
    cliff   = max(t_back + 80, math.ceil((le + 0.15) * f))
    t_choic = min(cliff - 18, max(t_back + 90, int(s_choic * f)))
    t_c1    = t_back + 8
    t_c2    = min(t_choic - 8, max(t_c1 + 88, int(s_cta * f) + 6))

    tm = {
        "tEarthStat": t_estat, "tPortal": t_port, "tMerc": t_merc, "tMercNight": t_mnigh,
        "tVenus": t_ven, "tMars": t_mars, "tJup": t_jup, "tBack": t_back,
        "tCutStart": t_c1, "tCutEnd": t_c2, "tChoice": t_choic,
        "cliffFrame": cliff, "totalFrames": cliff + 50,
    }
    with open("src/planetSurvWords.ts", "w") as out:
        out.write("export const WORD_SUBS_PS: { w: string; s: number; e: number }[] = " + json.dumps(words, ensure_ascii=False) + ";\n")
        out.write("export const PS_TIMING = " + json.dumps(tm) + ";\n")
    print(f"OK! {len(words)} kata, total {tm['totalFrames']/30:.2f}s ({tm['totalFrames']} frame)")

asyncio.run(main())
