import katex from "katex";

export default function MathFormula({ latex, block = true }) {
  if (!latex) {
    return <span className="formulaPlaceholder">Введите LaTeX-формулу</span>;
  }

  let html = "";

  try {
    html = katex.renderToString(latex, {
      throwOnError: false,
      displayMode: block,
      output: "html"
    });
  } catch {
    html = katex.renderToString(String(latex), {
      throwOnError: false,
      displayMode: block,
      output: "html"
    });
  }

  return (
    <span
      className={block ? "mathFormula blockFormula" : "mathFormula"}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
