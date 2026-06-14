import { themes } from "../data/templates";

export default function Toolbar({
  presentation,
  setPresentation,
  addSlide,
  exportPptx,
  exportJson,
  importJson,
  resetProject
}) {
  return (
    <header className="toolbar">
      <div className="toolbarMain">
        <div>
          <label className="label">Название презентации</label>
          <input
            className="input titleInput"
            value={presentation.title}
            onChange={(event) =>
              setPresentation({
                ...presentation,
                title: event.target.value
              })
            }
          />
        </div>

        <div>
          <label className="label">Тема</label>
          <select
            className="input"
            value={presentation.theme}
            onChange={(event) =>
              setPresentation({
                ...presentation,
                theme: event.target.value
              })
            }
          >
            {Object.entries(themes).map(([key, theme]) => (
              <option key={key} value={key}>
                {theme.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="toolbarActions">
        <button className="button secondary" onClick={addSlide}>
          + Слайд
        </button>
        <button className="button secondary" onClick={exportJson}>
          Экспорт JSON
        </button>

        <label className="button secondary fileButton">
          Импорт JSON
          <input
            type="file"
            accept="application/json"
            onChange={importJson}
          />
        </label>

        <button className="button danger" onClick={resetProject}>
          Сбросить
        </button>
        <button className="button primary" onClick={exportPptx}>
          Скачать PPTX
        </button>
      </div>
    </header>
  );
}
