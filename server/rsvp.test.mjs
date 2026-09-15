import { test } from "node:test";
import assert from "node:assert/strict";
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
    assert.throws(() => saveRsvp(db, { ...first, name: "" }));
    assert.throws(() => saveRsvp(db, { ...first, attendance: "maybe" }));
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM rsvps").get().n, 2);
  } finally {
    db?.close();
    rmSync(dir, { recursive: true, force: true });
  }
});
