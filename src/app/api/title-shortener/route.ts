import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter (for demonstration; use a persistent store for production)
const RATE_LIMIT = 10; // requests
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in ms
const ipRequests: Record<string, { count: number; start: number }> = {};

const TITLE_MAX = 200;
const SUBTITLE_MAX = 300;
const OUTPUT_MAX = 120;

export async function POST(req: NextRequest) {
  // Rate limiting by IP
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const now = Date.now();
  if (!ipRequests[ip] || now - ipRequests[ip].start > RATE_LIMIT_WINDOW) {
    ipRequests[ip] = { count: 1, start: now };
  } else {
    ipRequests[ip].count++;
  }
  if (ipRequests[ip].count > RATE_LIMIT) {
    return NextResponse.json({ error: `Rate limit exceeded. Max ${RATE_LIMIT} requests per hour.` }, { status: 429 });
  }

  const { title, subtitle } = await req.json();
  if (!title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }
  if (title.length > TITLE_MAX) {
    return NextResponse.json({ error: `Title too long (max ${TITLE_MAX} characters).` }, { status: 400 });
  }
  if (subtitle && subtitle.length > SUBTITLE_MAX) {
    return NextResponse.json({ error: `Subtitle too long (max ${SUBTITLE_MAX} characters).` }, { status: 400 });
  }

  const prompt = `Shorten the following article title and subtitle to fit a thumbnail. Make them click-worthy but keep the main idea.\n\nTitle: ${title}\nSubtitle: ${subtitle}\n\nReturn as JSON with keys 'shortTitle' and 'shortSubtitle'. Each output should be no more than ${OUTPUT_MAX} characters.`;

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant that shortens article titles and subtitles for thumbnails." },
          { role: "user", content: prompt },
        ],
        max_tokens: 120,
        temperature: 0.7,
      }),
    });

    if (!openaiRes.ok) {
      const error = await openaiRes.text();
      return NextResponse.json({ error: `OpenAI error: ${error}` }, { status: 500 });
    }

    const data = await openaiRes.json();
    const content = data.choices?.[0]?.message?.content;
    let shortTitle = "";
    let shortSubtitle = "";
    try {
      // Remove Markdown code block if present
      const cleaned = content.replace(/```json|```/g, "").trim();
      const json = JSON.parse(cleaned);
      shortTitle = json.shortTitle || "";
      shortSubtitle = json.shortSubtitle || "";
    } catch {
      // fallback: try to parse as plain text
      const match = content.match(/shortTitle\s*[:=]\s*['"]?(.+?)['"]?\s*[\n,]/i);
      const match2 = content.match(/shortSubtitle\s*[:=]\s*['"]?(.+?)['"]?/i);
      shortTitle = match ? match[1] : "";
      shortSubtitle = match2 ? match2[1] : "";
    }
    // Enforce output length limits
    if (shortTitle.length > OUTPUT_MAX) shortTitle = shortTitle.slice(0, OUTPUT_MAX);
    if (shortSubtitle.length > OUTPUT_MAX) shortSubtitle = shortSubtitle.slice(0, OUTPUT_MAX);
    return NextResponse.json({ shortTitle, shortSubtitle });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 