import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { openRsvps } from "./rsvp.mjs";
const db = openRsvps(
  process.env.RSVP_DB_PATH ||
    resolve(
      fileURLToPath(new URL("../", import.meta.url)),
      "data/rsvps.sqlite",
    ),
);
const quote = (s) => '"' + String(s).replaceAll('"', '""') + '"';
console.log("Name,Attending,Updated at");
for (const r of db
  .prepare("SELECT name,attending,updated_at FROM rsvps ORDER BY updated_at")
  .all())
  console.log(
    [r.name, r.attending ? "Yes" : "No", r.updated_at].map(quote).join(","),
  );
db.close();
