import { Heart } from "lucide-react";
import { wedding } from "./config.js";
export function OurStory() {
  return (
    <section className="story-section" id="our-story">
      <p className="eyebrow">EVERY LOVE HAS A STORY</p>
      <h2>
        Our <i>Story.</i>
      </h2>
      <div className="story-timeline">
        {wedding.story.map((moment, i) => (
          <article className={`story-moment moment-${i}`} key={moment.title}>
            <figure>
              <img src={moment.image} alt={moment.alt} loading="lazy" />
            </figure>
            <div className="story-marker">
              <Heart size={12} fill="currentColor" />
            </div>
            <div className="story-copy">
              {moment.date && <p className="story-date">{moment.date}</p>}
              <h3>{moment.title}</h3>
              <p>{moment.text}</p>
            </div>
          </article>
        ))}
      </div>
      <Heart className="story-end" size={18} strokeWidth={1} />
    </section>
  );
}
