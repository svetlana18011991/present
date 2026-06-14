import { useEffect, useMemo, useState } from "react";
import Toolbar from "./components/Toolbar";
import SlideEditor from "./components/SlideEditor";
import SlidePreview from "./components/SlidePreview";
import { defaultPresentation } from "./data/templates";
import { exportToPptx } from "./utils/exportPptx";

const STORAGE_KEY = "presentation-builder-project";

function createEmptySlide() {
  return {
    type: "content",
    title: "Новый слайд",
    subtitle: "",
    text: "Добавьте текст слайда."
  };
}

function readSavedProject() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultPresentation;
    const parsed = JSON.parse(saved);

    if (!parsed.title || !Array.isArray(parsed.slides)) {
      return defaultPresentation;
    }

    return parsed;
  } catch {
    return defaultPresentation;
  }
}

export default function App() {
  const [presentation, setPresentation] = useState(readSavedProject);
  const [activeIndex, setActiveIndex] = useState(0);

  const activeSlide = useMemo(() => {
    return presentation.slides[activeIndex] || presentation.slides[0];
  }, [presentation.slides, activeIndex]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presentation));
  }, [presentation]);

  function updateSlide(index, updatedSlide) {
    const slides = presentation.slides.map((slide, slideIndex) =>
      slideIndex === index ? updatedSlide : slide
    );

    setPresentation({
      ...presentation,
      slides
    });
  }

  function addSlide() {
    setPresentation({
      ...presentation,
      slides: [...presentation.slides, createEmptySlide()]
    });

    setActiveIndex(presentation.slides.length);
  }

  function deleteSlide(index) {
    if (presentation.slides.length <= 1) return;

    const slides = presentation.slides.filter((_, slideIndex) => slideIndex !== index);

    setPresentation({
      ...presentation,
      slides
    });

    setActiveIndex(Math.max(0, index - 1));
  }

  function exportJson() {
    const data = JSON.stringify(presentation, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${presentation.title || "presentation"}.json`;
    link.click();

    URL.revokeObjectURL(url);
  }

  function importJson(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);

        if (!parsed.title || !Array.isArray(parsed.slides)) {
          alert("Файл не похож на проект презентации.");
          return;
        }

        setPresentation(parsed);
        setActiveIndex(0);
      } catch {
        alert("Не получилось прочитать JSON-файл.");
      }
    };

    reader.readAsText(file);
    event.target.value = "";
  }

  function resetProject() {
    const shouldReset = confirm("Сбросить проект к начальному примеру?");
    if (!shouldReset) return;

    setPresentation(defaultPresentation);
    setActiveIndex(0);
  }

  async function handleExportPptx() {
    await exportToPptx(presentation);
  }

  return (
    <main className="app">
      <Toolbar
        presentation={presentation}
        setPresentation={setPresentation}
        addSlide={addSlide}
        exportPptx={handleExportPptx}
        exportJson={exportJson}
        importJson={importJson}
        resetProject={resetProject}
      />

      <div className="workspace">
        <aside className="sidebar">
          {presentation.slides.map((slide, index) => (
            <SlideEditor
              key={index}
              slide={slide}
              index={index}
              isActive={index === activeIndex}
              onSelect={() => setActiveIndex(index)}
              onChange={(updatedSlide) => updateSlide(index, updatedSlide)}
              onDelete={() => deleteSlide(index)}
              canDelete={presentation.slides.length > 1}
            />
          ))}
        </aside>

        <section className="stage">
          <div className="stageHeader">
            <div>
              <span className="eyebrow">Предпросмотр</span>
              <h2>{activeSlide?.title || "Слайд"}</h2>
            </div>
            <span className="badge">
              {presentation.slides.length} слайд(ов)
            </span>
          </div>

          <SlidePreview
            slide={activeSlide}
            presentation={presentation}
            activeIndex={activeIndex}
          />
        </section>
      </div>
    </main>
  );
}
