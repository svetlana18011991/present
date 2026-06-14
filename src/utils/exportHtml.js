import { themes } from "../data/templates";

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function slideHtml(slide, index, presentation, theme) {
  const bg = slide.backgroundImage || presentation.backgroundImage || "";
  const bgStyle = bg
    ? `background-image: linear-gradient(rgba(255,255,255,.14), rgba(255,255,255,.14)), url('${bg}'); background-size: cover; background-position: center;`
    : `background: ${theme.background};`;

  const image = slide.image
    ? `<img class="slide-image" src="${slide.image}" alt="Изображение на слайде">`
    : "";

  if (slide.type === "title") {
    return `
      <section class="slide active" data-slide="${index}" style="${bgStyle}">
        <div class="accent"></div>
        <div class="title-slide">
          <h1>${escapeHtml(slide.title || "Без названия")}</h1>
          <p>${escapeHtml(slide.subtitle || "")}</p>
          ${image}
        </div>
        <div class="counter">${index + 1} / ${presentation.slides.length}</div>
      </section>`;
  }

  if (slide.type === "quote") {
    return `
      <section class="slide" data-slide="${index}" style="${bgStyle}">
        <div class="accent"></div>
        <div class="quote-slide">
          <div class="quote-mark">“</div>
          <blockquote>${escapeHtml(slide.text || "Цитата или важная мысль")}</blockquote>
          <p>${escapeHtml(slide.title || "")}</p>
          ${image}
        </div>
        <div class="counter">${index + 1} / ${presentation.slides.length}</div>
      </section>`;
  }

  return `
    <section class="slide" data-slide="${index}" style="${bgStyle}">
      <div class="accent"></div>
      <div class="content-slide">
        <h2>${escapeHtml(slide.title || "Заголовок")}</h2>
        ${slide.subtitle ? `<p class="subtitle">${escapeHtml(slide.subtitle)}</p>` : ""}
        <div class="content-layout ${slide.image ? "with-image" : ""}">
          <div class="text-box">${escapeHtml(slide.text || "Текст слайда").replaceAll("\\n", "<br>")}</div>
          ${image}
        </div>
      </div>
      <div class="counter">${index + 1} / ${presentation.slides.length}</div>
    </section>`;
}

export function createGeniallyHtml(presentation) {
  const theme = themes[presentation.theme] || themes.classic;
  const music = presentation.backgroundMusic
    ? `<audio class="music" src="${presentation.backgroundMusic}" controls loop></audio>`
    : "";

  return `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(presentation.title || "Презентация")}</title>
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: Arial, sans-serif;
    background: #111827;
    overflow: hidden;
  }
  .presentation {
    position: relative;
    width: 100vw;
    height: 56.25vw;
    max-height: 100vh;
    max-width: 177.78vh;
    margin: auto;
    overflow: hidden;
    color: ${theme.text};
  }
  .slide {
    display: none;
    position: absolute;
    inset: 0;
    padding: 6% 7%;
    color: ${theme.text};
  }
  .slide.active { display: block; }
  .accent {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 12px;
    background: ${theme.accent};
  }
  h1, h2, p, blockquote { margin-top: 0; }
  .title-slide {
    height: 100%;
    display: grid;
    place-content: center;
    text-align: center;
  }
  .title-slide h1 {
    font-size: clamp(34px, 6vw, 84px);
    line-height: 1.05;
    margin-bottom: 24px;
  }
  .title-slide p, .subtitle {
    color: ${theme.muted};
    font-size: clamp(16px, 2vw, 28px);
  }
  .content-slide h2 {
    font-size: clamp(28px, 4vw, 58px);
    line-height: 1.1;
    margin-bottom: 12px;
  }
  .content-layout {
    display: grid;
    gap: 28px;
    align-items: center;
    margin-top: 24px;
  }
  .content-layout.with-image {
    grid-template-columns: 1.2fr .8fr;
  }
  .text-box {
    min-height: 260px;
    border-radius: 28px;
    padding: 32px;
    background: ${theme.card};
    font-size: clamp(20px, 2.4vw, 36px);
    line-height: 1.35;
    white-space: normal;
  }
  .slide-image {
    max-width: 100%;
    max-height: 52vh;
    object-fit: contain;
    border-radius: 24px;
  }
  .quote-slide {
    height: 100%;
    display: grid;
    place-content: center;
    text-align: center;
  }
  .quote-mark {
    color: ${theme.accent};
    font-size: 100px;
    font-weight: 900;
    line-height: .7;
  }
  blockquote {
    max-width: 950px;
    font-size: clamp(30px, 4.4vw, 70px);
    line-height: 1.18;
    font-style: italic;
  }
  .counter {
    position: absolute;
    right: 26px;
    bottom: 18px;
    color: ${theme.muted};
    font-weight: 700;
  }
  .nav {
    position: absolute;
    left: 50%;
    bottom: 18px;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    z-index: 5;
  }
  .nav button {
    border: 0;
    border-radius: 999px;
    padding: 10px 16px;
    background: rgba(255,255,255,.84);
    font-weight: 700;
    cursor: pointer;
  }
  .music {
    position: absolute;
    left: 18px;
    bottom: 14px;
    width: 230px;
    z-index: 6;
  }
</style>
</head>
<body>
  <main class="presentation">
    ${presentation.slides.map((slide, index) => slideHtml(slide, index, presentation, theme)).join("")}
    <div class="nav">
      <button onclick="prevSlide()">←</button>
      <button onclick="nextSlide()">→</button>
    </div>
    ${music}
  </main>
<script>
  let current = 0;
  const slides = Array.from(document.querySelectorAll(".slide"));

  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("active", slideIndex === current);
    });
  }

  function nextSlide() { showSlide(current + 1); }
  function prevSlide() { showSlide(current - 1); }

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === " ") nextSlide();
    if (event.key === "ArrowLeft") prevSlide();
  });

  showSlide(0);
</script>
</body>
</html>`;
}

export async function copyGeniallyHtml(presentation) {
  const html = createGeniallyHtml(presentation);

  try {
    await navigator.clipboard.writeText(html);
    alert("HTML-код для Genially скопирован. В Genially откройте Insert / Embed и вставьте код.");
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = html;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    alert("HTML-код скопирован. В Genially вставьте его через Embed / Вставить код.");
  }
}

export function downloadGeniallyHtml(presentation) {
  const html = createGeniallyHtml(presentation);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${presentation.title || "presentation"}-genially.html`;
  link.click();

  URL.revokeObjectURL(url);
}
