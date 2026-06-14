import { themes } from "../data/templates";

export default function SlidePreview({ slide, presentation, activeIndex }) {
  const theme = themes[presentation.theme] || themes.classic;

  return (
    <section
      className="preview"
      style={{
        background: theme.background,
        color: theme.text
      }}
    >
      <div className="accent" style={{ background: theme.accent }} />

      {slide.type === "title" && (
        <div className="titleSlide">
          <h1>{slide.title || "Без названия"}</h1>
          <p style={{ color: theme.muted }}>
            {slide.subtitle || "Подзаголовок презентации"}
          </p>
        </div>
      )}

      {slide.type === "content" && (
        <div className="contentSlide">
          <h2>{slide.title || "Заголовок слайда"}</h2>
          {slide.subtitle && (
            <p className="subtitle" style={{ color: theme.muted }}>
              {slide.subtitle}
            </p>
          )}
          <div
            className="textBox"
            style={{
              background: theme.card
            }}
          >
            <p>{slide.text || "Текст слайда появится здесь."}</p>
          </div>
        </div>
      )}

      {slide.type === "quote" && (
        <div className="quoteSlide">
          <div className="quoteMark" style={{ color: theme.accent }}>
            “
          </div>
          <blockquote>{slide.text || "Цитата или важная мысль"}</blockquote>
          <p style={{ color: theme.muted }}>{slide.title}</p>
        </div>
      )}

      <div className="slideNumber" style={{ color: theme.muted }}>
        {activeIndex + 1} / {presentation.slides.length}
      </div>
    </section>
  );
}
