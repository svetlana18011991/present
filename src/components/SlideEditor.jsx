export default function SlideEditor({
  slide,
  index,
  isActive,
  onSelect,
  onChange,
  onDelete,
  canDelete
}) {
  return (
    <article
      className={`editorCard ${isActive ? "activeCard" : ""}`}
      onClick={onSelect}
    >
      <div className="editorTop">
        <strong>Слайд {index + 1}</strong>
        <button
          className="smallButton"
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
          disabled={!canDelete}
          title={!canDelete ? "Нельзя удалить последний слайд" : "Удалить слайд"}
        >
          Удалить
        </button>
      </div>

      <label className="label">Тип</label>
      <select
        className="input"
        value={slide.type}
        onChange={(event) => onChange({ ...slide, type: event.target.value })}
      >
        <option value="title">Титульный</option>
        <option value="content">Текстовый</option>
        <option value="quote">Цитата</option>
      </select>

      <label className="label">Заголовок</label>
      <input
        className="input"
        value={slide.title}
        onChange={(event) => onChange({ ...slide, title: event.target.value })}
        placeholder="Введите заголовок"
      />

      <label className="label">Подзаголовок</label>
      <input
        className="input"
        value={slide.subtitle}
        onChange={(event) =>
          onChange({ ...slide, subtitle: event.target.value })
        }
        placeholder="Можно оставить пустым"
      />

      <label className="label">Текст</label>
      <textarea
        className="textarea"
        value={slide.text}
        onChange={(event) => onChange({ ...slide, text: event.target.value })}
        placeholder="Основной текст слайда"
      />
    </article>
  );
}
