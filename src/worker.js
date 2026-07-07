const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
};

const MODEL = "gemini-2.5-flash";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: JSON_HEADERS,
  });
}

function cleanText(value, fallback, maxLength) {
  const text = String(value || fallback || "").trim();
  return text.slice(0, maxLength);
}

function cleanMood(input) {
  return {
    label: cleanText(input && input.label, "감정", 24),
    text: cleanText(input && input.text, "현재 감정", 120),
  };
}

function cleanTarget(input) {
  return {
    label: cleanText(input && input.label, "나에게", 24),
    tone: cleanText(input && input.tone, "조용하고 깊게", 80),
  };
}

function cleanEnv(input) {
  return {
    season: cleanText(input && input.season, "오늘", 16),
    time: cleanText(input && input.time, "지금", 16),
  };
}

async function handleGemini(request, env) {
  if (request.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  if (!env.GEMINI_API_KEY) {
    return json({ error: "missing_server_secret" }, 500);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "bad_json" }, 400);
  }

  const mood = cleanMood(payload && payload.mood);
  const target = cleanTarget(payload && payload.target);
  const currentEnv = cleanEnv(payload && payload.env);
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(env.GEMINI_API_KEY)}`;
  const body = {
    systemInstruction: {
      parts: [
        {
          text: '너는 한국어 감정 카드 카피라이터다. 반드시 JSON 객체 하나만 반환한다. 구조는 {"quote":"문장","subtext":"짧은 문장","prompt":"english image prompt"} 이다. markdown, 코드블록, 설명 문장은 금지한다.',
        },
      ],
    },
    contents: [
      {
        role: "user",
        parts: [
          {
            text: [
              `환경: ${currentEnv.season} ${currentEnv.time}`,
              `감정: ${mood.label} - ${mood.text}`,
              `수신 타겟: ${target.label} - ${target.tone}`,
              "아주 짧게 답한다. JSON 값 외의 긴 설명은 절대 쓰지 않는다.",
              "quote는 한국어 44자 이하 명언형 문장으로 작성한다.",
              "subtext는 한국어 20자 이하 보조 문장으로 작성한다.",
              "prompt는 영어 25단어 이하 이미지 프롬프트로 작성하고 pastel neon emotional background no text를 포함한다.",
            ].join("\n"),
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.92,
      maxOutputTokens: 2048,
      responseMimeType: "application/json",
    },
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let upstreamError = "";
    try {
      const errorBody = await response.json();
      upstreamError = errorBody && errorBody.error && errorBody.error.message;
    } catch {
      upstreamError = "";
    }
    return json({ error: "gemini_failed", upstreamStatus: response.status, upstreamError: String(upstreamError || "").slice(0, 160) }, response.status === 429 ? 429 : 502);
  }

  const data = await response.json();
  const candidate = data && data.candidates && data.candidates[0];
  const parts = candidate && candidate.content && candidate.content.parts;
  const raw = (parts && parts[0] && parts[0].text) || "{}";

  try {
    const card = JSON.parse(raw.replace(/```json/g, "").replace(/```/g, "").trim());
    if (!card.quote || !card.subtext) {
      return json({ error: "bad_gemini_json", finishReason: candidate && candidate.finishReason, hasParts: Boolean(parts && parts.length) }, 502);
    }

    return json({
      quote: String(card.quote).slice(0, 80),
      subtext: String(card.subtext).slice(0, 44),
      prompt: card.prompt || "pastel neon emotional background no text",
    });
  } catch {
    return json({ error: "bad_gemini_json", finishReason: candidate && candidate.finishReason, hasParts: Boolean(parts && parts.length) }, 502);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/gemini") {
      return handleGemini(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};
