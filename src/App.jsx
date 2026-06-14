import { useEffect, useMemo, useState } from "react";
import Toolbar from "./components/Toolbar";
import SlideEditor from "./components/SlideEditor";
import SlidePreview from "./components/SlidePreview";
import MathScanPanel from "./components/MathScanPanel";
import { defaultPresentation } from "./data/templates";
import { exportToPptx } from "./utils/exportPptx";
import { copyGeniallyHtml, downloadGeniallyHtml, openGeniallyCodeWindow } from "./utils/exportHtml";

const STORAGE_KEY = "presentation-builder-project-v2";

function createEmptySlide() {
  return {
    type: "content",
    title: "Новый слайд",
    subtitle: "",
    text: "Добавьте текст слайда.",
    image: "",
    backgroundImage: "",
    latex: "",
    solution: "",
    answer: ""
  };
}

function normalizeProject(project) {
  return {
    ...defaultPresentation,
    ...project,
    slides: Array.isArray(project.slides) && project.slides.length
      ? project.slides.map((slide) => ({
          image: "",
          backgroundImage: "",
          subtitle: "",
          text: "",
          latex: "",
          solution: "",
          answer: "",
          ...slide
        }))
      : defaultPresentation.slides
  };
}

function readSavedProject() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultPresentation;

    const parsed = JSON.parse(saved);
    if (!parsed.title || !Array.isArray(parsed.slides)) return defaultPresentation;

    return normalizeProject(parsed);
  } catch {
    return defaultPresentation;
  }
}

export default function App() {
  const [presentation, setPresentation] = useState(readSavedProject);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMathScanOpen, setIsMathScanOpen] = useState(false);
  const [mathDraft, setMathDraft] = useState({
    title: "Решите задачу",
    latex: "\\frac{2x - 5}{3} = 7",
    solution: "Умножим обе части уравнения на 3.",
    answer: "x = 13",
    image: ""
  });

  const activeSlide = useMemo(() => {
    return presentation.slides[activeIndex] || presentation.slides[0];
  }, [presentation.slides, activeIndex]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(presentation));
    } catch {
      alert("Проект стал слишком большим для сохранения в браузере. Попробуйте использовать картинки/музыку меньшего размера.");
    }
  }, [presentation]);

  useEffect(() => {
    document.body.style.overflow = isMathScanOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMathScanOpen]);

  function setFileAsDataUrl(event, callback) {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxMb = file.type.startsWith("audio/") ? 12 : 5;
    if (file.size > maxMb * 1024 * 1024) {
      alert(`Файл слишком большой. Лучше выбрать файл до ${maxMb} МБ.`);
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      callback(reader.result, file);
      event.target.value = "";
    };

    reader.onerror = () => {
      alert("Не получилось прочитать файл.");
      event.target.value = "";
    };

    reader.readAsDataURL(file);
  }

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

  function createMathSlideFromDraft() {
    const newSlide = {
      type: "math",
      title: mathDraft.title || "Решите задачу",
      subtitle: "",
      text: "",
      latex: mathDraft.latex || "",
      solution: mathDraft.solution || "",
      answer: mathDraft.answer || "",
      image: mathDraft.image || "",
      backgroundImage: ""
    };

    const slides = [...presentation.slides, newSlide];

    setPresentation({
      ...presentation,
      slides
    });

    setActiveIndex(slides.length - 1);
    setIsMathScanOpen(false);
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
        openMathScan={() => setIsMathScanOpen(true)}
        exportPptx={handleExportPptx}
        copyGenially={() => copyGeniallyHtml(presentation)}
        openGeniallyCode={() => openGeniallyCodeWindow(presentation)}
        downloadGenially={() => downloadGeniallyHtml(presentation)}
        setFileAsDataUrl={setFileAsDataUrl}
        resetProject={resetProject}
      />

      {isMathScanOpen && (
        <MathScanPanel
          draft={mathDraft}
          setDraft={setMathDraft}
          setFileAsDataUrl={setFileAsDataUrl}
          createMathSlide={createMathSlideFromDraft}
          closePanel={() => setIsMathScanOpen(false)}
        />
      )}

      {presentation.backgroundMusic && (
        <div className="musicPanel">
          <span>Музыка: {presentation.backgroundMusicName || "загружена"}</span>
          <audio src={presentation.backgroundMusic} controls loop />
          <button
            className="smallButton"
            onClick={() =>
              setPresentation({
                ...presentation,
                backgroundMusic: "",
                backgroundMusicName: ""
              })
            }
          >
            Убрать музыку
          </button>
        </div>
      )}

      {presentation.backgroundImage && (
        <div className="notice">
          Загружен общий фон презентации.
          <button
            className="smallButton"
            onClick={() => setPresentation({ ...presentation, backgroundImage: "" })}
          >
            Убрать общий фон
          </button>
        </div>
      )}

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
              setFileAsDataUrl={setFileAsDataUrl}
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
