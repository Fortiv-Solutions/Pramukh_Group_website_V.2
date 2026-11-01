"use client";

import { useEffect, useRef, useState } from "react";
import { logoPaths } from "@/components/brand/logo-paths";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { respond, STARTER_CHIPS, type Reply } from "@/lib/concierge";
import { whatsappHref } from "@/content/site";
import styles from "./ContactDock.module.css";

type Msg = { id: number; from: "bot" | "user"; reply: Reply };

const WHATSAPP_PATH =
  "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z";

const GREETING: Reply = {
  text: "Welcome to Pramukh Group. I can help you find a project, compare homes by city or BHK, or reach our team.",
  chips: STARTER_CHIPS,
};

/** Bottom-right dock: WhatsApp (opens a chat with sales) and the Pramukh concierge (in-page assistant). */
export function ContactDock() {
  const root = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const nextId = useRef(1);
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([{ id: 0, from: "bot", reply: GREETING }]);

  // Hidden over the hero; slides in once the visitor has scrolled past it (stays while the chat is open).
  // It also steps aside while the enquiry card fills its corner: that card offers WhatsApp and a call itself.
  const [shown, setShown] = useState(false);
  useGSAP(
    () => {
      const card = document.querySelector("[data-enq-card]");
      const overCard = () => {
        if (!card) return false;
        const r = card.getBoundingClientRect();
        return r.top < window.innerHeight - 40 && r.bottom > window.innerHeight - 140;
      };
      // It also steps aside for as long as a city volume is open, so nothing floats over the book.
      const overBook = () => !!document.querySelector("#city-volume");
      const past = () => window.scrollY > window.innerHeight * 0.85 && !overCard() && !overBook();
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: () => setShown(past()),
        onRefresh: () => setShown(past()),
      });
      setShown(past());
      // The projects reader announces when a volume opens or closes, which may not involve a scroll.
      const recheck = () => requestAnimationFrame(() => setShown(past()));
      window.addEventListener("pramukh:reader", recheck);
      return () => {
        st.kill();
        window.removeEventListener("pramukh:reader", recheck);
      };
    },
    { scope: root },
  );

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 260);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(id);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const ask = (text: string) => {
    const t = text.trim();
    if (!t || typing) return;
    setMsgs((m) => [...m, { id: nextId.current++, from: "user", reply: { text: t } }]);
    setDraft("");
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { id: nextId.current++, from: "bot", reply: respond(t) }]);
    }, 650);
  };

  const [x, y, w, h] = logoPaths.mark.box;
  const lastBot = [...msgs].reverse().find((m) => m.from === "bot");

  return (
    <div ref={root} className={styles.dock} data-open={open} data-shown={shown || open}>
      <section className={styles.panel} role="dialog" aria-modal="false" aria-label="Pramukh concierge" aria-hidden={!open} inert={!open}>
        <header className={styles.head}>
          <span className={styles.avatar} aria-hidden="true">
            <svg viewBox={`${x - 40} ${y - 40} ${w + 80} ${h + 80}`}>
              <path d={logoPaths.mark.paths[0]} />
            </svg>
          </span>
          <div className={styles.headText}>
            <p className={styles.title}>Pramukh Concierge</p>
            <p className={styles.sub}>Answers from our project library</p>
          </div>
          <button type="button" className={styles.close} onClick={() => setOpen(false)} aria-label="Close concierge">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        <div ref={logRef} className={styles.log} role="log" aria-live="polite" data-lenis-prevent>
          {msgs.map((m) => (
            <div key={m.id} className={styles.msg} data-from={m.from}>
              <p className={styles.bubble}>{m.reply.text}</p>
              {m.reply.links && (
                <div className={styles.links}>
                  {m.reply.links.map((l) => (
                    <a key={l.label + l.href} href={l.href} {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                      {l.label}
                      <svg viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M6 14 14 6M7.5 6H14v6.5" />
                      </svg>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          {typing && (
            <div className={styles.msg} data-from="bot" aria-label="Concierge is typing">
              <p className={`${styles.bubble} ${styles.typing}`}>
                <i />
                <i />
                <i />
              </p>
            </div>
          )}
        </div>

        {lastBot?.reply.chips && !typing && (
          <div className={styles.chips} data-lenis-prevent>
            {lastBot.reply.chips.map((c) => (
              <button key={c} type="button" onClick={() => ask(c)}>
                {c}
              </button>
            ))}
          </div>
        )}

        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            ask(draft);
          }}
        >
          <label htmlFor="concierge-input" className="sr-only">
            Ask the concierge
          </label>
          <input
            id="concierge-input"
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask about a project, city or BHK"
            autoComplete="off"
          />
          <button type="submit" aria-label="Send" disabled={!draft.trim()}>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M3 10h13M11 4.5 16.5 10 11 15.5" />
            </svg>
          </button>
        </form>
      </section>

      {/* One rounded bar: WhatsApp · blinking caret · concierge. */}
      <div className={styles.bar} data-dock-btn inert={!(shown || open)}>
        <a
          href={whatsappHref()}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.btn} ${styles.wa}`}
          aria-label="Chat with us on WhatsApp (opens in a new tab)"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={WHATSAPP_PATH} />
          </svg>
          <span className={styles.tip}>WhatsApp</span>
        </a>
        <span className={styles.caret} aria-hidden="true" />
        <button
          ref={launcherRef}
          type="button"
          className={`${styles.btn} ${styles.bot}`}
          aria-expanded={open}
          aria-label={open ? "Close Pramukh concierge" : "Open Pramukh concierge"}
          onClick={() => setOpen((v) => !v)}
        >
          <svg className={styles.mono} viewBox={`${x} ${y} ${w} ${h}`} aria-hidden="true">
            <path d={logoPaths.mark.paths[0]} />
          </svg>
          <svg className={styles.x} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
          {!open && <span className={styles.tip}>Ask Pramukh</span>}
        </button>
      </div>
    </div>
  );
}
