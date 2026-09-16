# Henil & Vidhi — wedding invitation

A local React + Vite project. Nothing has been deployed. The frontend is portable and includes the garden-villa entrance, a vintage car with gentle head movement, scroll-controlled opening doors, sky-blue Haldi styling, event details, directions, a four-photo lightbox gallery, music, and RSVP.

## Start locally

Use Node.js **22.13 or newer** (Node 24 recommended).

```sh
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://127.0.0.1:5173`. This command starts both React and the RSVP API. Port 5173 is the frontend; port 3001 is the API.

## Edit details

- `src/config.js`: names, dates, venue, directions, event times and music video.
- `src/App.jsx`: page sections, entrance animation, music, gallery and RSVP.
- `src/styles.css`: responsive styles and animation timing.
- `public/`: illustrations and four supplied photographs.

The venue image is a decorative villa illustration, not a photograph of Waves Club Resort.

## RSVP

The only visible fields are attendee name and yes/no attendance. Responses are saved by the included Node API to `data/rsvps.sqlite`, using Node's built-in SQLite module. Responses are not exposed by a public read endpoint. Editing a response within the same page session updates its record. New sessions are separate submissions; names are not treated as unique identities. Request IDs prevent a retry from duplicating a response.

Export responses locally:

```sh
npm run export:rsvps --silent > rsvps.csv
```

Keep the database private and back it up. `data/` is ignored by Git and excluded from the supplied archive.

## Build and host later

```sh
npm run build
npm start
```

`npm start` serves `dist/` and `/api/rsvp` together on port 3001. For hosting, set `HOST=0.0.0.0`, `PORT` as required by your provider, and `RSVP_DB_PATH` to a persistent writable disk. These are process environment variables; `.env.example` documents them. The server does not automatically load `.env` files. Put the server behind HTTPS. The SQLite file requires persistent storage: don't use an ephemeral serverless filesystem.

You can host `dist/` on a static host, but RSVP then needs a separately hosted backend and a same-origin `/api/rsvp` proxy. Static-only hosting cannot save responses by itself. `npm run preview` is a frontend-only preview; use `npm run dev` or `npm start` to test RSVP.

## Local videos and music

No YouTube embed or remote audio remains. Add your files at:

- `public/media/a-thousand-years.mp3` — your audio file, user-initiated playback and loop.
- `public/media/chapter-background.mp4` — muted looping background behind “A new chapter, together.”
- `public/media/our-film.mp4` — the standalone film section, with normal video controls.

These media files are not supplied yet. Until present, the chapter uses the villa image, the film section shows a “coming soon” poster, and music shows “Music coming soon.” The frontend checks the file's media type before activating playback. Use H.264 MP4 for broad browser support; the Node server supports byte-range requests for seeking. Change paths in `src/config.js` if desired, then rebuild for production.

## Our story and illustrations

`src/config.js` contains editable story entries inspired by the supplied photo-timeline reference. The current copy is draft wording, not a claim about your meeting/proposal dates. Replace the titles, text, dates, and photos with your real milestones.

Vidhi’s likeness in the car, portrait, and six-pose dance sheet has been updated using the supplied magenta-outfit reference photo. The dance is now a bundled MP4 with separate illustrated poses, playing automatically after the doors open.

The function cards use custom Haldi, Sangeet, and wedding background artwork. The venue includes an embedded map centred on the destination resolved from your supplied Google Maps link, plus the original directions link.

## Accessibility and motion

The entrance respects reduced-motion preferences. Guests can skip directly to the invitation. The gallery uses an accessible Radix dialog with Escape to close, and RSVP uses keyboard-accessible radio controls. The optional WebMCP tool only stages an RSVP for review; it does not submit it.

## Verification

```sh
npm test
npm run build
```

The RSVP test verifies persistence across reopening the database, safe retries, response updates, duplicate attendee names, and invalid-input rejection. The local UI was checked on desktop and at a 390px mobile width, with a successful test RSVP submission.

## Automatic dance video

`public/media/our-dance.mp4` is the bundled illustrated dance video. Scrolling opens the doors and reveals it; the dance then plays on its own clock (muted, inline), with a skip option. When it ends, the chapter invitation appears. It is a pose-based illustrated film with clean cuts, not photoreal footage or motion-captured character animation. Scrolling back to the entrance resets playback.

Gallery: add extra photos to public/gallery and list them in wedding.gallery in src/config.js. The countdown targets the start of 1 February 2027 in India, not an unconfirmed ceremony time.

## Vercel deployment from GitHub

Import this repository into Vercel with the Vite preset and Node.js 24.x. The root `vercel.json` sets `npm run build` and `dist`. This deploys the frontend only.

**RSVP launch requirement:** the included `server/` API uses a local SQLite database and is not deployed by Vercel's static Vite build. Connect a persistent hosted RSVP backend before sending invitations; a frontend-only deployment cannot save responses. Never commit attendee databases or `.env` secrets.
