import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  MapPin,
  Music2,
  Pause,
  Play,
  X,
  Check,
  Flower2,
  Sparkles,
  Heart,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "./RadioGroup.jsx";
import { wedding } from "./config.js";
import { Dialog } from "radix-ui";
import { MusicPlayer, ChapterVideo, WeddingFilm } from "./Media.jsx";
import { DanceSequence } from "./DanceSequence.jsx";
import { OurStory } from "./OurStory.jsx";
const clamp = (n, min = 0, max = 1) => Math.max(min, Math.min(max, n));

function AnimatedCar({ moving }) {
  return (
    <svg
      className={`car-art ${moving ? "moving" : ""}`}
      viewBox="0 0 1774 887"
      role="img"
      aria-label="Henil and Vidhi smiling in their flower-covered vintage car"
    >
      <defs>
        <mask id="car-outline" style={{maskType: "alpha"}}><image href="/car-mask.png" width="1774" height="887" /></mask>
        <mask id="vidhi-hair-edge" maskUnits="userSpaceOnUse" x="0" y="0" width="1774" height="887">
          <rect width="1774" height="887" fill="white" />
          <rect x="490" y="65" width="218" height="225" fill="black" />
          <path d="M490 290 L532 207 Q548 153 578 129 Q601 109 623 115 Q666 117 685 163 Q698 202 708 240 L708 290Z" fill="white" />
        </mask>
        <mask id="car-body">
          <rect width="1774" height="887" fill="white" />
          <ellipse cx="620" cy="196" rx="74" ry="91" fill="black" />
          <ellipse cx="767" cy="139" rx="60" ry="76" fill="black" />
        </mask>
        <clipPath id="vidhi-head">
          <ellipse cx="620" cy="196" rx="78" ry="95" />
        </clipPath>
        <clipPath id="henil-head">
          <ellipse cx="767" cy="139" rx="64" ry="80" />
        </clipPath>
      </defs>
      <g mask="url(#car-outline)"><g mask="url(#vidhi-hair-edge)">
      <image href="/car.png" width="1774" height="887" mask="url(#car-body)" />
      <g className="vidhi-head">
        <image
          href="/car.png"
          width="1774"
          height="887"
          clipPath="url(#vidhi-head)"
        />
      </g>
      <g className="henil-head">
        <image
          href="/car.png"
          width="1774"
          height="887"
          clipPath="url(#henil-head)"
        />
      </g>
      </g></g>
    </svg>
  );
}
function Entrance() {
  const section = useRef(null);
  const [progress, setProgress] = useState(0);
  const [moving, setMoving] = useState(true);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [danceDone, setDanceDone] = useState(false);
  useEffect(()=>{if(progress<.08)setDanceDone(false)},[progress]);
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    let frame;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = section.current;
        if (el)
          setProgress(
            clamp(
              -el.getBoundingClientRect().top / (el.offsetHeight - innerHeight),
            ),
          );
      });
    };
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    update();
    return () => {
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
      mq.removeEventListener("change", sync);
      cancelAnimationFrame(frame);
    };
  }, []);
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => setMoving(false), 4500);
    return () => clearTimeout(t);
  }, [ready]);
  const open = clamp((progress - 0.05) / 0.24);
  const carFade = 1 - clamp((progress - 0.015) / 0.10);
  const sceneFade = 1 - clamp((progress - 0.29) / 0.08);
  const chapterVisible = danceDone || progress >= .94;
  const danceActive = progress >= .37 && !chapterVisible && !reduced;
  const danceOpacity = chapterVisible ? 0 : clamp((progress - .32) / .05);
  const chapterOpacity = chapterVisible ? 1 : 0;
  return (
    <section
      ref={section}
      className={`entrance ${reduced ? "reduced" : ""}`}
      aria-label="Your invitation opens as you scroll"
    >
      <div className="entrance-sticky">
        <div
          className="inside-invitation"
          inert={!chapterVisible ? true : undefined}
          style={{ opacity: reduced ? 0 : chapterOpacity }}
        >
          <ChapterVideo active={chapterVisible && progress > .3} />
          <span className="tiny-flower">✧</span>
          <p className="eyebrow">WITH LOVE, FROM US TO YOU</p>
          <h2>
            A new chapter,
            <br />
            <i>together.</i>
          </h2>
          <p>
            With love in our hearts and our favourite people beside us,
            <br className="desktop-break" /> we’re beginning our forever.
          </p>
          <p className="italic">We would love for you to be there.</p>
          <a href="#celebrations" className="text-link">
            Discover the celebrations <ArrowDown size={16} />
          </a>
        </div>
        <div
          className="dance-layer"
          style={{ opacity: reduced ? 0 : danceOpacity }}
          inert={!danceActive ? true : undefined}
        >
          <DanceSequence active={danceActive} onComplete={()=>setDanceDone(true)} />
        </div>
        <div
          className="entrance-visual"
          style={{
            opacity: reduced ? 1 : sceneFade,
            transform: reduced ? "none" : `scale(${1 + open * 0.8})`,
          }}
        >
          <div className="villa-plane">
            <div className="door-light" />
            <svg
              viewBox="0 0 1672 941"
              className="villa-base"
              aria-hidden="true"
            >
              <defs>
                <mask id="villa-hole">
                  <rect width="1672" height="941" fill="white" />
                  <path
                    d="M658 578 V234 Q658 90 824 90 Q986 90 986 234 V578Z"
                    fill="black"
                  />
                </mask>
              </defs>
              <image
                href="/villa.png"
                width="1672"
                height="941"
                mask="url(#villa-hole)"
              />
            </svg>
            <svg
              viewBox="0 0 1672 941"
              className="door door-left"
              style={{
                transform: `perspective(1000px) rotateY(${reduced ? 0 : -open * 100}deg)`,
              }}
              aria-hidden="true"
            >
              <defs>
                <clipPath id="left-door">
                  <path d="M658 578 V234 Q658 90 824 90 V578Z" />
                </clipPath>
              </defs>
              <image
                href="/villa.png"
                width="1672"
                height="941"
                clipPath="url(#left-door)"
              />
            </svg>
            <svg
              viewBox="0 0 1672 941"
              className="door door-right"
              style={{
                transform: `perspective(1000px) rotateY(${reduced ? 0 : open * 100}deg)`,
              }}
              aria-hidden="true"
            >
              <defs>
                <clipPath id="right-door">
                  <path d="M824 90 Q986 90 986 234 V578 H824Z" />
                </clipPath>
              </defs>
              <image
                href="/villa.png"
                width="1672"
                height="941"
                clipPath="url(#right-door)"
              />
            </svg>
          </div>
        </div>
        <div
          className="entrance-heading"
          style={{ opacity: 1 - clamp(progress / 0.08) }}
        >
          <p className="eyebrow">TOGETHER WITH OUR FAMILIES</p>
          <h1>
            Henil Shah <em>&</em> Vidhi Mehta
          </h1>
          <p className="date">{wedding.dates}</p>
          <p className="hero-note">A little invitation to our biggest day.</p>
        </div>
        <div
          className={`car-position ${ready ? "ready" : ""}`}
          style={{ opacity: reduced ? 1 : carFade }}
        >
          <div className="car-drive">
            <AnimatedCar moving={moving && !reduced && ready} />
          </div>
        </div>
        <img
          src="/car.png"
          className="preload-image"
          alt=""
          onLoad={() => setReady(true)}
        />
        <a href="#celebrations" className="skip-intro">
          Skip to invitation
        </a>
        <div
          className="opening-cue"
          style={{ opacity: 1 - clamp(progress / 0.08) }}
        >
          <span>Scroll to enter</span>
          <ArrowDown size={20} />
        </div>
      </div>
    </section>
  );
}
function RSVP() {
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const requestId = useRef(null);
  async function save(values) {
    if (!values.name?.trim() || !["yes", "no"].includes(values.attendance))
      throw new Error(
        "Please enter your name and choose whether you will attend.",
      );
    setStatus("saving");
    setMessage("");
    requestId.current ??= crypto.randomUUID();
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, id: requestId.current }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data.error || "Your response could not be saved. Please try again.",
        );
      setName(values.name);
      setAttendance(values.attendance);
      setStatus("success");
      return { saved: true };
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Unable to connect. Please try again.");
      throw error;
    }
  }
  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const controller = new AbortController();
    Promise.resolve(
      context.registerTool(
        {
          name: "stage_wedding_rsvp",
          description:
            "Fill the attendee name and attendance choice in the RSVP form for the guest to review and submit. Does not submit.",
          inputSchema: {
            type: "object",
            properties: {
              name: { type: "string", minLength: 1, maxLength: 100 },
              attendance: { type: "string", enum: ["yes", "no"] },
            },
            required: ["name", "attendance"],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: false },
          execute(input) {
            if (
              typeof input?.name !== "string" ||
              !input.name.trim() ||
              input.name.length > 100 ||
              !["yes", "no"].includes(input.attendance)
            )
              throw new Error("A name and yes/no attendance are required.");
            setName(input.name.trim());
            setAttendance(input.attendance);
            setStatus("idle");
            requestId.current = null;
            document.getElementById("rsvp").scrollIntoView();
            return { staged: true, submitted: false };
          },
        },
        { signal: controller.signal },
      ),
    ).catch(() => {});
    return () => controller.abort();
  }, []);
  return (
    <section id="rsvp" className="rsvp-section">
      <div className="rsvp-photo">
        <img
          src="/portrait.png"
          alt="An illustrated portrait of Henil and Vidhi holding hands beneath a floral arch"
          loading="lazy"
        />
        <span>our forever, with you.</span>
      </div>
      <div className="rsvp-content">
        <p className="eyebrow">WE SAVED YOU A SEAT</p>
        <h2>
          Celebrate <br />
          <i>with us.</i>
        </h2>
        <p>Your presence will make our celebration complete.</p>
        {status === "success" ? (
          <div className="rsvp-success" role="status">
            <Check size={28} />
            <h3>Thank you, {name}.</h3>
            <p>
              {attendance === "yes"
                ? "We can’t wait to celebrate with you!"
                : "You’ll be missed. Thank you for letting us know."}
            </p>
            <button className="text-link" onClick={() => setStatus("idle")}>
              Edit my response
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              save({ name, attendance }).catch(() => {});
            }}
          >
            <label htmlFor="guest-name">Name of attendee</label>
            <input
              id="guest-name"
              autoComplete="name"
              required
              maxLength={100}
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <fieldset>
              <legend>Will you attend?</legend>
              <RadioGroup
                value={attendance}
                onValueChange={setAttendance}
                className="attendance-options"
                required
                aria-label="Will you attend?"
              >
                <label>
                  <RadioGroupItem className="radio-item" value="yes" />
                  Yes, I’ll be there
                </label>
                <label>
                  <RadioGroupItem className="radio-item" value="no" />
                  Sorry, I can’t attend
                </label>
              </RadioGroup>
            </fieldset>
            <button
              className="button submit"
              disabled={status === "saving"}
              type="submit"
            >
              {status === "saving" ? "Sending…" : "Submit RSVP"}{" "}
              <ArrowUpRight size={16} />
            </button>
            {message && (
              <p className="form-error" role="alert">
                {message}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
function Countdown() {
  const [now,setNow]=useState(Date.now());
  useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(timer)},[]);
  const remaining=Math.max(0,Math.floor((new Date('2027-02-01T00:00:00+05:30').getTime()-now)/1000));
  const values=[Math.floor(remaining/86400),Math.floor(remaining/3600)%24,Math.floor(remaining/60)%60,remaining%60];
  return <section className="countdown section" aria-label="Countdown to our celebration"><p className="eyebrow">COUNTING EVERY MOMENT</p><h2>{remaining?'Until our forever begins.':'Our celebration is here.'}</h2><div className="countdown-grid">{values.map((value,i)=><div key={i}><strong>{String(value).padStart(2,'0')}</strong><span>{['Days','Hours','Minutes','Seconds'][i]}</span></div>)}</div><p>Our celebrations begin 1st February 2027</p></section>
}
function Gallery() {
  const [expanded,setExpanded]=useState(false);
  return (
    <section className="section gallery" id="gallery">
      <p className="eyebrow">LITTLE MOMENTS, BIG LOVE</p>
      <h2>
        A little glimpse
        <br />
        <i>of us.</i>
      </h2>
      <div className="gallery-grid">
        {(expanded?wedding.gallery:wedding.gallery.slice(0,4)).map(({src,alt}) => (
          <Dialog.Root key={alt}>
            <Dialog.Trigger asChild>
              <button
                className="photo-button"
                aria-label={`Enlarge photo: ${alt}`}
              >
                <img src={src} alt={alt} loading="lazy" />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="dialog-overlay" />
              <Dialog.Content
                className="photo-dialog"
                aria-describedby={undefined}
              >
                <Dialog.Title className="sr-only">{alt}</Dialog.Title>
                <img src={src} alt={alt} />
                <Dialog.Close className="dialog-close" aria-label="Close photo">
                  <X size={22} />
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        ))}
      </div>
      <button className="button gallery-expand" aria-expanded={expanded} onClick={()=>setExpanded(!expanded)}>{expanded?'Collapse gallery':'Expand gallery'}</button>
      {expanded&&wedding.gallery.length<=4&&<p className="gallery-note">More memories coming soon.</p>}
    </section>
  );
}
export default function App() {
  return (
    <>
      <nav aria-label="Main navigation">
        <a className="monogram" href="#" aria-label="Henil and Vidhi home">
          <svg viewBox="0 0 64 64" className="wedding-emblem" aria-hidden="true"><path d="M12 51V25a20 20 0 0 1 40 0v26" fill="none" stroke="currentColor" strokeWidth="1.3"/><path d="M19 47V22m14 0v25M19 34h14m2-12 8 25 8-25" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M26 13q-6-7-8-1t8 9q10-3 8-9t-8 1" fill="none" stroke="currentColor"/><path d="M8 54h48" stroke="currentColor"/></svg>
        </a>
        <a href="#celebrations">The celebrations</a>
        <a href="#venue">The venue</a>
        <a className="nav-rsvp" href="#rsvp">
          RSVP
        </a>
      </nav>
      <main>
        <Entrance />
        <Countdown />
        <OurStory />
        <section id="celebrations" className="section celebrations">
          <p className="eyebrow">A CELEBRATION OF LOVE</p>
          <h2>
            Two days.
            <br />
            <i>A lifetime of memories.</i>
          </h2>
          <p className="section-intro">
            A little laughter, a little dancing, and all of our favourite
            people.
          </p>
          <div className="events">
            {wedding.events.map((e, i) => {
              const Icon = [Flower2, Music2, Heart][i];
              return (
                <article className={`event ${e.id}`} key={e.id}>
                  <img
                    className="event-art"
                    src={`/event-${e.id}.png`}
                    alt=""
                    loading="lazy"
                  />
                  <div className="event-scrim" />
                  <div className="event-emblem">
                    <Icon strokeWidth={1} size={34} />
                  </div>
                  <p className="event-kicker">
                    {e.number} · {e.label}
                  </p>
                  <h3>{e.title}</h3>
                  <p className="event-description">{e.description}</p>
                  <div className="event-details">
                    <p className="event-date">{e.date}</p>
                    <p className="event-time">Time: {e.time}</p>
                    {e.theme && <strong>Theme: {e.theme}</strong>}
                  </div>
                  <p className="event-venue">Waves Club Resort, Vadodara</p>
                </article>
              );
            })}
          </div>
        </section>
        <section id="venue" className="venue-section">
          <div className="venue-copy">
            <MapPin size={24} strokeWidth={1} />
            <p className="eyebrow">MEET US HERE</p>
            <h2>
              Waves Club Resort
            </h2>
            <p className="venue-city">Vadodara</p>
            <p>
              Two beautiful days.
              <br />
              One place to make memories together.
            </p>
            <a
              className="button"
              href={wedding.directions}
              target="_blank"
              rel="noreferrer"
            >
              Get Directions <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="venue-map">
            <iframe
              title="Map showing Waves Club Resort, Vadodara"
              src={wedding.mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <a href={wedding.directions} target="_blank" rel="noreferrer">
              Open route to Waves Club Resort <ArrowUpRight size={16} />
            </a>
          </div>
        </section>
        <Gallery />
        <WeddingFilm />
        <RSVP />
      </main>
      <footer>
        <Sparkles size={23} strokeWidth={1} />
        <p>Come for the wedding. Stay for the memories.</p>
        <h2>
          Henil <i>&</i> Vidhi
        </h2>
        <p className="footer-date">{wedding.dates} · Vadodara</p>
        <span>WITH LOVE, ALWAYS.</span>
      </footer>
      <MusicPlayer />
    </>
  );
}
