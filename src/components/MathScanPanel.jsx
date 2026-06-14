import MathFormula from "./MathFormula";

export default function MathScanPanel({
  draft,
  setDraft,
  setFileAsDataUrl,
  createMathSlide,
  closePanel,
  recognizeMath,
  isRecognizing,
  ocrSettings,
  setOcrSettings
}) {
  return (
    <div className="mathModalOverlay">
      <section className="mathScanPanel modalPanel">
        <div className="mathScanHeader">
          <div>
            <span className="eyebrow">Экспериментальная функция</span>
            <h2>Скан задачи → красивый LaTeX-слайд</h2>
          </div>
          <button className="button danger" onClick={closePanel}>
            Закрыть
          </button>
        </div>

        <div className="ocrSettingsBox">
          <div>
            <span className="eyebrow">Mathpix OCR</span>
            <p>
              Введите ключи Mathpix для теста. Они сохраняются только в вашем браузере.
              Для публичной версии лучше подключить backend, чтобы не показывать ключи пользователям.
            </p>
          </div>

          <input
            className="input"
            value={ocrSettings.appId}
            onChange={(event) =>
              setOcrSettings({ ...ocrSettings, appId: event.target.value })
            }
            placeholder="Mathpix app_id"
          />

          <input
            className="input"
            type="password"
            value={ocrSettings.appKey}
            onChange={(event) =>
              setOcrSettings({ ...ocrSettings, appKey: event.target.value })
            }
            placeholder="Mathpix app_key"
          />
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
              className="button secondary wideButton"
              onClick={recognizeMath}
              disabled={isRecognizing}
            >
              {isRecognizing ? "Распознаю..." : "Распознать автоматически"}
            </button>

            {draft.ocrRawText && (
              <details className="ocrDetails">
                <summary>Что распознал OCR</summary>
                <pre>{draft.ocrRawText}</pre>
              </details>
            )}
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

            {draft.ocrInfo && (
              <div className="ocrResultInfo">
                <strong>OCR:</strong> {draft.ocrInfo}
              </div>
            )}

            <p className="helperText">
              После распознавания проверьте формулу. OCR может ошибиться в знаках,
              степенях, дробях или переменных, особенно если фото размытое.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
