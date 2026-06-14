export const themes = {
  classic: {
    name: "Классика",
    background: "#ffffff",
    card: "#f5f7fb",
    text: "#1f2937",
    muted: "#6b7280",
    accent: "#2563eb"
  },
  dark: {
    name: "Тёмная",
    background: "#111827",
    card: "#1f2937",
    text: "#f9fafb",
    muted: "#d1d5db",
    accent: "#60a5fa"
  },
  pastel: {
    name: "Пастель",
    background: "#fff7ed",
    card: "#ffedd5",
    text: "#431407",
    muted: "#9a3412",
    accent: "#ea580c"
  },
  green: {
    name: "Зелёная",
    background: "#f0fdf4",
    card: "#dcfce7",
    text: "#052e16",
    muted: "#166534",
    accent: "#16a34a"
  }
};

export const defaultPresentation = {
  title: "Моя презентация",
  theme: "classic",
  slides: [
    {
      type: "title",
      title: "Моя презентация",
      subtitle: "Создано в конструкторе презентаций",
      text: ""
    },
    {
      type: "content",
      title: "Первый слайд",
      subtitle: "",
      text: "Здесь можно написать основные мысли, план урока, тезисы доклада или структуру выступления."
    }
  ]
};
