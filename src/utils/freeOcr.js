import { createWorker } from "tesseract.js";

function normalizeOcrText(text = "") {
  return String(text)
    .replace(/[×·]/g, "\\cdot ")
    .replace(/[–—]/g, "-")
    .replace(/[−]/g, "-")
    .replace(/[⁄]/g, "/")
    .replace(/[аА]/g, "a")
    .replace(/[хХ]/g, "x")
    .replace(/[уУ]/g, "y")
    .replace(/[сС]/g, "c")
    .replace(/\s+/g, " ")
    .trim();
}

function convertPlainFormulaToLatex(text = "") {
  let value = normalizeOcrText(text);

  // Берём самую похожую на формулу строку, если OCR вернул много текста.
  const lines = String(text)
    .split(/\n+/)
    .map((line) => normalizeOcrText(line))
    .filter(Boolean);

  const formulaLine =
    lines.find((line) => /[=+\-*/^√]/.test(line) && /[0-9xyabc]/i.test(line)) ||
    lines.find((line) => /[0-9]/.test(line)) ||
    value;

  value = formulaLine || value;

  // Простые замены для удобного вида.
  value = value
    .replace(/sqrt\s*\(([^)]+)\)/gi, "\\sqrt{$1}")
    .replace(/√\s*([a-zA-Z0-9]+)/g, "\\sqrt{$1}")
    .replace(/\^2/g, "^{2}")
    .replace(/\^3/g, "^{3}");

  // Простые дроби вида (2x-5)/3 или 2/5.
  value = value.replace(/\(([^()]+)\)\s*\/\s*([a-zA-Z0-9]+)/g, "\\frac{$1}{$2}");
  value = value.replace(/(?<![\\\w])([0-9]+)\s*\/\s*([0-9]+)(?!\w)/g, "\\frac{$1}{$2}");

  return value.trim();
}

export async function recognizeWithFreeOcr({ imageDataUrl, onProgress }) {
  if (!imageDataUrl) {
    throw new Error("Сначала загрузите картинку с задачей.");
  }

  const worker = await createWorker("rus+eng", 1, {
    logger: (message) => {
      if (message?.status && typeof message.progress === "number") {
        onProgress?.({
          status: message.status,
          progress: message.progress
        });
      }
    }
  });

  try {
    const result = await worker.recognize(imageDataUrl);
    const rawText = result?.data?.text || "";
    const latex = convertPlainFormulaToLatex(rawText);

    if (!rawText.trim()) {
      throw new Error("Не получилось распознать текст. Попробуйте более чёткое фото или обрежьте только задачу.");
    }

    return {
      rawText,
      latex,
      confidence: result?.data?.confidence
    };
  } finally {
    await worker.terminate();
  }
}
