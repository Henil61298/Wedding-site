import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
export function openRsvps(file) {
  mkdirSync(dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec("PRAGMA journal_mode=WAL");
  db.exec(
    "CREATE TABLE IF NOT EXISTS rsvps (id TEXT PRIMARY KEY, name TEXT NOT NULL, attending INTEGER NOT NULL CHECK(attending IN (0,1)), updated_at TEXT NOT NULL)",
  );
  return db;
}
export function validateRsvp(input) {
  if (
    !input ||
    typeof input.name !== "string" ||
    !input.name.trim() ||
    input.name.trim().length > 100 ||
    !["yes", "no"].includes(input.attendance) ||
    typeof input.id !== "string" ||
    !/^[0-9a-f-]{36}$/i.test(input.id)
  )
    throw new Error(
      "Please enter your name and choose whether you will attend.",
    );
  return {
    id: input.id,
    name: input.name.trim(),
    attending: input.attendance === "yes" ? 1 : 0,
  };
}
export function saveRsvp(db, input) {
  const row = validateRsvp(input);
  db.prepare(
    "INSERT INTO rsvps (id,name,attending,updated_at) VALUES (?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name, attending=excluded.attending, updated_at=excluded.updated_at",
  ).run(row.id, row.name, row.attending, new Date().toISOString());
  return { saved: true };
}
