function stripMathDelimiters(value = "") {
  return String(value)
    .trim()
    .replace(/^\$\$([\s\S]*)\$\$$/, "$1")
    .replace(/^\$([\s\S]*)\$$/, "$1")
    .replace(/^\\\[([\s\S]*)\\\]$/, "$1")
    .replace(/^\\\(([\s\S]*)\\\)$/, "$1")
    .trim();
}

function pickBestLatex(result) {
  if (result.latex_styled) {
    return stripMathDelimiters(result.latex_styled);
  }

  if (Array.isArray(result.data)) {
    const latexItem = result.data.find((item) => item.type === "latex" && item.value);
    if (latexItem) {
      return stripMathDelimiters(latexItem.value);
    }
  }

  if (result.text) {
    const text = String(result.text).trim();

    const displayMatch = text.match(/\\\[([\s\S]*?)\\\]/);
    if (displayMatch?.[1]) return stripMathDelimiters(displayMatch[1]);

    const inlineMatch = text.match(/\\\(([\s\S]*?)\\\)/);
    if (inlineMatch?.[1]) return stripMathDelimiters(inlineMatch[1]);

    const dollarDisplay = text.match(/\$\$([\s\S]*?)\$\$/);
    if (dollarDisplay?.[1]) return stripMathDelimiters(dollarDisplay[1]);

    const dollarInline = text.match(/\$([\s\S]*?)\$/);
    if (dollarInline?.[1]) return stripMathDelimiters(dollarInline[1]);

    return stripMathDelimiters(text);
  }

  return "";
}

export async function recognizeWithMathpix({ imageDataUrl, appId, appKey }) {
  if (!imageDataUrl) {
    throw new Error("Сначала загрузите картинку с задачей.");
  }

  if (!appId || !appKey) {
    throw new Error("Введите Mathpix app_id и app_key.");
  }

  const response = await fetch("https://api.mathpix.com/v3/text", {
    method: "POST",
    headers: {
      app_id: appId,
      app_key: appKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      src: imageDataUrl,
      formats: ["text", "latex_styled", "data"],
      data_options: {
        include_latex: true,
        include_asciimath: false
      },
      math_inline_delimiters: ["$", "$"],
      math_display_delimiters: ["$$", "$$"],
      rm_spaces: true,
      rm_fonts: true,
      idiomatic_eqn_arrays: true
    })
  });

  let result = null;

  try {
    result = await response.json();
  } catch {
    result = null;
  }

  if (!response.ok) {
    const message =
      result?.error ||
      result?.error_info?.message ||
      `Ошибка Mathpix: ${response.status}`;
    throw new Error(message);
  }

  const latex = pickBestLatex(result);

  if (!latex) {
    throw new Error("Mathpix не вернул LaTeX. Попробуйте более чёткое фото или обрежьте только задачу.");
  }

  return {
    latex,
    rawText: result.text || "",
    confidence: result.confidence,
    confidenceRate: result.confidence_rate,
    isPrinted: result.is_printed,
    isHandwritten: result.is_handwritten,
    requestId: result.request_id
  };
}
