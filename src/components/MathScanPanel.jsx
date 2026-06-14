import MathFormula from "./MathFormula";

export default function MathScanPanel({
  draft,
  setDraft,
  setFileAsDataUrl,
  createMathSlide,
  closePanel
}) {
  return (
    <section className="mathScanPanel">
      <div className="mathScanHeader">
        <div>
          <span className="eyebrow">Экспериментальная функция</span>
          <h2>Скан задачи → красивый LaTeX-слайд</h2>
        </div>
        <button className="smallButton" onClick={closePanel}>
          Закрыть
        </button>
      </div>

      <div className="mathScanGrid">
        <div className="scanBox">
          <label className="uploadControl bigUpload">
            <span>Загрузить картинку с задачей</span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                setFileAsDataUrl(event, (dataUrl) =>
                  setDraft({ ...draft, image: dataUrl })
                )
              }
            />
          </label>

          {draft.image ? (
            <img className="scanPreviewImage" src={draft.image} alt="Задача" />
          ) : (
            <div className="emptyScan">
              Сюда появится фото или скрин задачи.
            </div>
          )}

          <button
            className="button secondary"
            onClick={() =>
              alert(
                "Автораспознавание подключим следующим шагом через OCR/API. Сейчас можно вставить LaTeX вручную или после распознавания в другом сервисе."
              )
            }
          >
            Распознать автоматически
          </button>
        </div>

        <div className="scanFields">
          <label className="label">Заголовок слайда</label>
          <input
            className="input"
            value={draft.title}
            onChange={(event) =>
              setDraft({ ...draft, title: event.target.value })
            }
          />

          <label className="label">LaTeX задачи</label>
          <textarea
            className="textarea latexTextarea"
            value={draft.latex}
            onChange={(event) =>
              setDraft({ ...draft, latex: event.target.value })
            }
            placeholder="Например: \frac{2x - 5}{3} = 7"
          />

          <div className="quickLatex">
            <button
              className="smallButton"
              onClick={() => setDraft({ ...draft, latex: "\\frac{2x - 5}{3} = 7" })}
            >
              Дробь
            </button>
            <button
              className="smallButton"
              onClick={() => setDraft({ ...draft, latex: "x^2 - 5x + 6 = 0" })}
            >
              Квадратное
            </button>
            <button
              className="smallButton"
              onClick={() => setDraft({ ...draft, latex: "\\sqrt{x+4}=6" })}
            >
              Корень
            </button>
            <button
              className="smallButton"
              onClick={() => setDraft({ ...draft, latex: "\\begin{cases} x+y=7 \\\\ x-y=1 \\end{cases}" })}
            >
              Система
            </button>
          </div>

          <label className="label">Решение / подсказка</label>
          <textarea
            className="textarea"
            value={draft.solution}
            onChange={(event) =>
              setDraft({ ...draft, solution: event.target.value })
            }
            placeholder="Например: Умножим обе части на 3..."
          />

          <label className="label">Ответ</label>
          <input
            className="input"
            value={draft.answer}
            onChange={(event) =>
              setDraft({ ...draft, answer: event.target.value })
            }
            placeholder="Например: x = 13"
          />

          <button className="button primary wideButton" onClick={createMathSlide}>
            Создать математический слайд
          </button>
        </div>

        <div className="formulaPreviewBox">
          <span className="eyebrow">Предпросмотр формулы</span>
          <div className="formulaCard">
            <MathFormula latex={draft.latex} />
          </div>

          <p className="helperText">
            Сейчас это полуавтоматический прототип: учитель загружает картинку,
            вставляет или правит LaTeX, а конструктор сам оформляет слайд.
            Следующий шаг — подключить реальное OCR-распознавание.
          </p>
        </div>
      </div>
    </section>
  );
}
