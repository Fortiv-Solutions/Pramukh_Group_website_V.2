"use client";

import { useId, useMemo, useRef, useState, type FormEvent } from "react";
import { logoPaths } from "@/components/brand/logo-paths";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { SubmitButton, TextLink } from "@/components/ui/Button";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { mapProjects, type MapCity } from "@/content/locations";
import { offices, telHref, whatsappHref } from "@/content/site";
import styles from "./Enquiry.module.css";

const CITIES: MapCity[] = ["Surat", "Vapi", "Silvassa", "Daman"];
const TIMES = ["Weekday morning", "Weekday evening", "Weekend"] as const;
const COUNT = Object.fromEntries(CITIES.map((c) => [c, mapProjects.filter((p) => p.city === c).length]));

type Fields = { name: string; phone: string; city: string; project: string; time: string };
type Errors = Partial<Record<"name" | "phone", string>>;
const EMPTY: Fields = { name: "", phone: "", city: "", project: "", time: "" };

const digits = (v: string) => v.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "").slice(0, 10);
const formatPhone = (d: string) => (d.length > 5 ? `${d.slice(0, 5)} ${d.slice(5)}` : d);
const check = (f: Fields): Errors => ({
  ...(f.name.trim().length < 2 && { name: "Please enter your name." }),
  ...(!/^[6-9]\d{9}$/.test(digits(f.phone)) && { phone: "Enter a 10-digit mobile number, e.g. 98765 43210." }),
});

/**
 * Private enquiry, the page's closing call to action before the footer. A double-bezel card holding a
 * three-part form (you · the project · your visit). Only name and mobile are required; city, project and
 * visit time are optional chips and a city-filtered select, so the form stays one short step.
 */
export function Enquiry() {
  const root = useRef<HTMLElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const [f, setF] = useState<Fields>(EMPTY);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [sent, setSent] = useState<Fields | null>(null);

  const errors = check(f);
  const show = (k: keyof Errors) => (touched[k] ? errors[k] : undefined);
  const projects = useMemo(() => (f.city ? mapProjects.filter((p) => p.city === f.city) : mapProjects), [f.city]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const enter = { trigger: "[data-enq-card]", start: "top 85%", toggleActions: "play none none none" };
        gsap.from("[data-enq-card]", { y: 70, autoAlpha: 0, duration: 1.5, ease: "expo.out", scrollTrigger: enter });
        gsap.from("[data-enq-group]", { y: 28, autoAlpha: 0, duration: 1.2, stagger: 0.09, delay: 0.25, ease: "expo.out", scrollTrigger: enter });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // The confirmation rises in and takes focus, so screen readers announce it.
  useGSAP(
    () => {
      if (status !== "sent" || !doneRef.current) return;
      doneRef.current.focus({ preventScroll: true });
      if (window.matchMedia(MQ.motion).matches)
        gsap.from(doneRef.current.children, { y: 24, autoAlpha: 0, duration: 1.1, stagger: 0.08, ease: "expo.out" });
    },
    { dependencies: [status], scope: root },
  );

  const set = (k: keyof Fields, v: string) =>
    setF((prev) => {
      const next = { ...prev, [k]: v };
      // A project picked first implies its city; a new city clears a project from elsewhere.
      if (k === "project" && v) next.city = mapProjects.find((p) => p.name === v)?.city ?? prev.city;
      if (k === "city" && prev.project && mapProjects.find((p) => p.name === prev.project)?.city !== v) next.project = "";
      return next;
    });

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({ name: true, phone: true });
    const first = Object.keys(errors)[0];
    if (first) {
      // By name: aria-invalid only updates on the next render.
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("sending");
    const website = (e.currentTarget.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, phone: digits(f.phone), website }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setSent(f);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setF(EMPTY);
    setTouched({});
    setSent(null);
    setStatus("idle");
  };

  const waMessage = (v: Fields) =>
    [
      `Hello Pramukh Group, I'm ${v.name.trim()}. I'd like to arrange a private visit`,
      v.project ? ` to ${v.project}` : v.city ? ` in ${v.city}` : "",
      v.time ? ` (${v.time.toLowerCase()})` : "",
      ".",
    ].join("");

  const id = (k: string) => `${uid}-${k}`;
  const [mx, my, mw, mh] = logoPaths.mark.box;

  return (
    <section ref={root} id="enquire" data-nav-theme="light" className={styles.enquiry} aria-labelledby="enquire-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.side}>
          <p className={styles.tag} data-reveal>
            <span className={styles.dot} aria-hidden="true" />
            Private enquiry
          </p>
          <SplitReveal as="h2" id="enquire-title" className={`display ${styles.title}`}>
            Your private visit.
          </SplitReveal>
          <p className={styles.lede} data-reveal>
            Tell us which project you&rsquo;d like to see and when suits you. Our team will call to confirm the time.
          </p>
          <div className={styles.direct} data-reveal>
            <p className={styles.directLabel}>Or speak to us now</p>
            <div className={styles.directLinks}>
              <TextLink href={whatsappHref()} external>
                WhatsApp
              </TextLink>
              <TextLink href={telHref(offices[0].phone)}>{offices[0].phone}</TextLink>
            </div>
          </div>
        </div>

        <div className={styles.shell} data-enq-card>
          <div className={styles.core}>
            {status === "sent" && sent ? (
              <div ref={doneRef} className={styles.done} role="status" tabIndex={-1}>
                <svg className={styles.doneMark} viewBox={`${mx} ${my} ${mw} ${mh}`} aria-hidden="true">
                  <path d={logoPaths.mark.paths[0]} />
                </svg>
                <h3 className={`display ${styles.doneTitle}`}>Thank you, {sent.name.trim().split(/\s+/)[0]}.</h3>
                <p className={styles.doneText}>
                  We&rsquo;ll call you on <strong>+91 {formatPhone(digits(sent.phone))}</strong> to confirm{" "}
                  {sent.time ? `a ${sent.time.toLowerCase()} visit` : "your visit"}
                  {sent.project ? ` to ${sent.project}` : sent.city ? ` in ${sent.city}` : ""}.
                </p>
                <div className={styles.doneActions}>
                  <TextLink href={whatsappHref(waMessage(sent))} external>
                    Continue on WhatsApp
                  </TextLink>
                  <button type="button" className={styles.again} onClick={reset}>
                    Send another enquiry
                  </button>
                </div>
              </div>
            ) : (
              <form className={styles.form} onSubmit={submit} noValidate aria-describedby={id("req")}>
                <fieldset className={styles.group} data-enq-group>
                  <legend className={styles.legend}>
                    <span className={styles.num}>01</span> About you
                  </legend>
                  <div className={styles.pair}>
                    <div className={styles.field}>
                      <label htmlFor={id("name")} className={styles.label}>
                        Full name
                      </label>
                      <div className={styles.control} data-invalid={!!show("name") || undefined}>
                        <input
                          id={id("name")}
                          name="name"
                          className={styles.input}
                          autoComplete="name"
                          placeholder="Your name"
                          required
                          value={f.name}
                          onChange={(e) => set("name", e.target.value)}
                          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                          aria-invalid={!!show("name")}
                          aria-describedby={show("name") ? id("name-err") : undefined}
                        />
                        <span className={styles.bar} aria-hidden="true" />
                      </div>
                      {show("name") && (
                        <p id={id("name-err")} className={styles.error}>
                          {show("name")}
                        </p>
                      )}
                    </div>
                    <div className={styles.field}>
                      <label htmlFor={id("phone")} className={styles.label}>
                        Mobile number
                      </label>
                      <div className={styles.control} data-invalid={!!show("phone") || undefined}>
                        <span className={styles.prefix} aria-hidden="true">
                          +91
                        </span>
                        <input
                          id={id("phone")}
                          name="phone"
                          type="tel"
                          inputMode="numeric"
                          className={styles.input}
                          autoComplete="tel-national"
                          placeholder="98765 43210"
                          required
                          value={f.phone}
                          onChange={(e) => set("phone", formatPhone(digits(e.target.value)))}
                          onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                          aria-invalid={!!show("phone")}
                          aria-describedby={show("phone") ? id("phone-err") : undefined}
                        />
                        <span className={styles.bar} aria-hidden="true" />
                      </div>
                      {show("phone") && (
                        <p id={id("phone-err")} className={styles.error}>
                          {show("phone")}
                        </p>
                      )}
                    </div>
                  </div>
                </fieldset>

                <fieldset className={styles.group} data-enq-group>
                  <legend className={styles.legend}>
                    <span className={styles.num}>02</span> The project <span className={styles.optional}>Optional</span>
                  </legend>
                  <div className={styles.chips} role="radiogroup" aria-label="City">
                    {CITIES.map((c) => (
                      <label key={c} className={styles.chip}>
                        <input type="radio" name="city" value={c} checked={f.city === c} onChange={() => set("city", c)} />
                        <span>
                          {c}
                          <sup className={styles.count}>{COUNT[c]}</sup>
                        </span>
                      </label>
                    ))}
                  </div>
                  <div className={styles.field}>
                    <label htmlFor={id("project")} className={styles.label}>
                      Project of interest
                    </label>
                    <div className={styles.control}>
                      <select
                        id={id("project")}
                        name="project"
                        className={`${styles.input} ${styles.select}`}
                        value={f.project}
                        onChange={(e) => set("project", e.target.value)}
                        data-empty={!f.project || undefined}
                      >
                        <option value="">Not sure yet, help me choose</option>
                        {f.city
                          ? projects.map((p) => (
                              <option key={p.name} value={p.name}>
                                {p.name} · {p.locality}
                              </option>
                            ))
                          : CITIES.map((c) => (
                              <optgroup key={c} label={c}>
                                {mapProjects
                                  .filter((p) => p.city === c)
                                  .map((p) => (
                                    <option key={p.name} value={p.name}>
                                      {p.name} · {p.locality}
                                    </option>
                                  ))}
                              </optgroup>
                            ))}
                      </select>
                      <svg className={styles.chevron} viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M5 8l5 5 5-5" />
                      </svg>
                      <span className={styles.bar} aria-hidden="true" />
                    </div>
                  </div>
                </fieldset>

                <fieldset className={styles.group} data-enq-group>
                  <legend className={styles.legend}>
                    <span className={styles.num}>03</span> Your visit <span className={styles.optional}>Optional</span>
                  </legend>
                  <div className={styles.chips} role="radiogroup" aria-label="Preferred visit time">
                    {TIMES.map((t) => (
                      <label key={t} className={styles.chip}>
                        <input type="radio" name="time" value={t} checked={f.time === t} onChange={() => set("time", t)} />
                        <span>{t}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                {/* Honeypot: hidden from people and assistive tech; bots fill it in. */}
                <div className={styles.trap} aria-hidden="true">
                  <label htmlFor={id("website")}>Website</label>
                  <input id={id("website")} name="website" tabIndex={-1} autoComplete="off" />
                </div>

                <div className={styles.actions} data-enq-group>
                  <SubmitButton tone="dark" className={styles.submit} disabled={status === "sending"}>
                    {status === "sending" ? "Sending" : "Schedule a private visit"}
                  </SubmitButton>
                  <p id={id("req")} className={styles.note}>
                    Only name and mobile are required. Your details are used only to arrange your visit.
                  </p>
                </div>
                {status === "error" && (
                  <p className={styles.alert} role="alert">
                    We couldn&rsquo;t send this just now. Please try again, or{" "}
                    <a href={whatsappHref(waMessage(f))} target="_blank" rel="noopener noreferrer">
                      message us on WhatsApp
                    </a>
                    .
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
