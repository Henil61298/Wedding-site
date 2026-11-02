import { test } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { openRsvps, saveRsvp } from "./rsvp.mjs";
test("RSVP persists, retries do not duplicate, and guests sharing a name stay separate", () => {
  const dir = mkdtempSync(join(tmpdir(), "wedding-"));
  let db;
  try {
    const file = join(dir, "test.sqlite");
    db = openRsvps(file);
    const first = {
      id: crypto.randomUUID(),
      name: " Test Guest ",
      attendance: "yes",
      wishes: "  Wishing you a lifetime of happiness!  ",
    };
    saveRsvp(db, first);
    saveRsvp(db, { ...first, attendance: "no" });
    saveRsvp(db, { ...first, id: crypto.randomUUID() });
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM rsvps").get().n, 2);
    db.close();
    db = openRsvps(file);
    assert.equal(
      db.prepare("SELECT name,attending FROM rsvps WHERE id=?").get(first.id)
        .attending,
      0,
    );
    assert.equal(
      db.prepare("SELECT name FROM rsvps WHERE id=?").get(first.id).name,
      "Test Guest",
    );
    assert.equal(
      db.prepare("SELECT wishes FROM rsvps WHERE id=?").get(first.id).wishes,
      "Wishing you a lifetime of happiness!",
    );
    assert.throws(() => saveRsvp(db, { ...first, name: "" }));
    assert.throws(() => saveRsvp(db, { ...first, attendance: "maybe" }));
    assert.throws(() => saveRsvp(db, { ...first, wishes: "w".repeat(1001) }));
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM rsvps").get().n, 2);
  } finally {
    db?.close();
    rmSync(dir, { recursive: true, force: true });
  }
});

test("existing RSVP databases gain an empty wishes field", () => {
  const dir = mkdtempSync(join(tmpdir(), "wedding-rsvps-legacy-"));
  let db;
  try {
    const file = join(dir, "test.sqlite");
    db = new DatabaseSync(file);
    db.exec(
      "CREATE TABLE rsvps (id TEXT PRIMARY KEY, name TEXT NOT NULL, attending INTEGER NOT NULL CHECK(attending IN (0,1)), updated_at TEXT NOT NULL)",
    );
    db.prepare(
      "INSERT INTO rsvps VALUES (?, ?, ?, ?)",
    ).run("c1b2a7f3-479a-4f4f-9f2d-c6b584af9b80", "Existing Guest", 1, new Date().toISOString());
    db.close();
    db = openRsvps(file);
    assert.equal(
      db.prepare("SELECT wishes FROM rsvps").get().wishes,
      "",
    );
  } finally {
    db?.close();
    rmSync(dir, { recursive: true, force: true });
  }
});
