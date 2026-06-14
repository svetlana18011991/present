import pptxgen from "pptxgenjs";
import { themes } from "../data/templates";

function hexWithoutHash(value) {
  return value.replace("#", "");
}

function addFooter(slide, index, total, theme) {
  slide.addText(`${index + 1} / ${total}`, {
    x: 11.9,
    y: 6.85,
    w: 0.8,
    h: 0.25,
    fontSize: 9,
    color: hexWithoutHash(theme.muted),
    align: "right"
  });
}

function addAccentLine(slide, theme) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 0.12,
    fill: { color: hexWithoutHash(theme.accent) },
    line: { color: hexWithoutHash(theme.accent) }
  });
}

export async function exportToPptx(presentation) {
  const theme = themes[presentation.theme] || themes.classic;
  const pptx = new pptxgen();

  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Presentation Builder";
  pptx.company = "GitHub Project";
  pptx.subject = presentation.title || "Presentation";
  pptx.title = presentation.title || "Presentation";
  pptx.lang = "ru-RU";
  pptx.theme = {
    headFontFace: "Aptos Display",
    bodyFontFace: "Aptos",
    lang: "ru-RU"
  };

  presentation.slides.forEach((item, index) => {
    const slide = pptx.addSlide();

    slide.background = { color: hexWithoutHash(theme.background) };
    addAccentLine(slide, theme);

    if (item.type === "title") {
      slide.addText(item.title || "Без названия", {
        x: 0.9,
        y: 1.9,
        w: 11.6,
        h: 0.9,
        fontSize: 38,
        bold: true,
        color: hexWithoutHash(theme.text),
        align: "center",
        margin: 0.05
      });

      slide.addText(item.subtitle || "", {
        x: 1.4,
        y: 3.0,
        w: 10.6,
        h: 0.55,
        fontSize: 18,
        color: hexWithoutHash(theme.muted),
        align: "center",
        margin: 0.05
      });
    }

    if (item.type === "content") {
      slide.addText(item.title || "Заголовок", {
        x: 0.75,
        y: 0.55,
        w: 11.7,
        h: 0.55,
        fontSize: 28,
        bold: true,
        color: hexWithoutHash(theme.text),
        margin: 0.04
      });

      if (item.subtitle) {
        slide.addText(item.subtitle, {
          x: 0.75,
          y: 1.18,
          w: 11.7,
          h: 0.35,
          fontSize: 14,
          color: hexWithoutHash(theme.muted),
          margin: 0.04
        });
      }

      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.75,
        y: 1.75,
        w: 11.85,
        h: 4.65,
        rectRadius: 0.12,
        fill: { color: hexWithoutHash(theme.card) },
        line: { color: hexWithoutHash(theme.card) }
      });

      slide.addText(item.text || "", {
        x: 1.1,
        y: 2.05,
        w: 11.1,
        h: 4.05,
        fontSize: 18,
        color: hexWithoutHash(theme.text),
        valign: "top",
        fit: "shrink",
        breakLine: false,
        margin: 0.06
      });
    }

    if (item.type === "quote") {
      slide.addText("“", {
        x: 0.75,
        y: 0.8,
        w: 1,
        h: 1,
        fontSize: 70,
        bold: true,
        color: hexWithoutHash(theme.accent),
        margin: 0
      });

      slide.addText(item.text || "Цитата или важная мысль", {
        x: 1.35,
        y: 1.65,
        w: 10.6,
        h: 2.4,
        fontSize: 28,
        italic: true,
        color: hexWithoutHash(theme.text),
        align: "center",
        valign: "mid",
        fit: "shrink"
      });

      slide.addText(item.title || "", {
        x: 1.35,
        y: 4.35,
        w: 10.6,
        h: 0.45,
        fontSize: 16,
        color: hexWithoutHash(theme.muted),
        align: "center"
      });
    }

    addFooter(slide, index, presentation.slides.length, theme);
  });

  await pptx.writeFile({
    fileName: `${presentation.title || "presentation"}.pptx`
  });
}
