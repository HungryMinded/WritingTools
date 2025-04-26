import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { title, subtitle } = await req.json();
  if (!title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  const prompt = `Shorten the following article title and subtitle to fit a thumbnail. Make them click-worthy but keep the main idea.\n\nTitle: ${title}\nSubtitle: ${subtitle}\n\nReturn as JSON with keys 'shortTitle' and 'shortSubtitle'.`;

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
    return NextResponse.json({ shortTitle, shortSubtitle });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Unknown error" }, { status: 500 });
  }
} 