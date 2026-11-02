function json(res, status, data) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.statusCode = status;
  res.end(JSON.stringify(data));
}

function validateRsvp(input) {
  const wishes = input?.wishes ?? "";
  if (
    !input ||
    typeof input.name !== "string" ||
    !input.name.trim() ||
    input.name.trim().length > 100 ||
    !["yes", "no"].includes(input.attendance) ||
    typeof input.id !== "string" ||
    !/^[0-9a-f-]{36}$/i.test(input.id) ||
    typeof wishes !== "string" ||
    wishes.length > 1000
  )
    return null;

  return {
    id: input.id,
    name: input.name.trim(),
    attending: input.attendance === "yes",
    wishes: wishes.trim(),
    updated_at: new Date().toISOString(),
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST")
    return json(res, 405, { error: "Method not allowed." });

  if (!req.headers["content-type"]?.startsWith("application/json"))
    return json(res, 415, { error: "Please send a JSON response." });

  const origin = req.headers.origin;
  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.host)
        return json(res, 403, {
          error: "Please submit from the invitation website.",
        });
    } catch {
      return json(res, 403, { error: "Invalid origin." });
    }
  }

  const rsvp = validateRsvp(req.body);
  if (!rsvp)
    return json(res, 400, {
      error: "Please enter your name and choose whether you will attend.",
    });

  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/+$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("RSVP storage is not configured.");
    return json(res, 503, {
      error: "RSVPs are temporarily unavailable. Please try again shortly.",
    });
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rsvps?on_conflict=id`, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(rsvp),
    });
    if (!response.ok) {
      console.error(`Supabase RSVP request failed with status ${response.status}.`);
      return json(res, 503, {
        error: "We could not save your response. Please try again shortly.",
      });
    }
    return json(res, 200, { saved: true });
  } catch (error) {
    console.error("Supabase RSVP request failed:", error);
    return json(res, 503, {
      error: "We could not save your response. Please try again shortly.",
    });
  }
}
