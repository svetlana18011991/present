import { themes } from "../data/templates";

export default function Toolbar({
  presentation,
  setPresentation,
  addSlide,
  exportPptx,
  copyGenially,
  downloadGenially,
  setFileAsDataUrl,
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

        <label className="uploadControl">
          <span>Фон всей презентации</span>
          <input
            type="file"
            accept="image/*"
            onChange={(event) =>
              setFileAsDataUrl(event, (dataUrl) =>
                setPresentation({ ...presentation, backgroundImage: dataUrl })
              )
            }
          />
        </label>

        <label className="uploadControl">
          <span>Фоновая музыка</span>
          <input
            type="file"
            accept="audio/*"
            onChange={(event) =>
              setFileAsDataUrl(event, (dataUrl, file) =>
                setPresentation({
                  ...presentation,
                  backgroundMusic: dataUrl,
                  backgroundMusicName: file.name
                })
              )
            }
          />
        </label>
      </div>

      <div className="toolbarActions">
        <button className="button secondary" onClick={addSlide}>
          + Слайд
        </button>
        <button className="button secondary" onClick={copyGenially}>
          Код для Genially
        </button>
        <button className="button secondary" onClick={downloadGenially}>
          Скачать HTML
        </button>
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
