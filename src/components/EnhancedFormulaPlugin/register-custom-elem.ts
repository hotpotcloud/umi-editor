/**
 * @description 注册增强的自定义公式元素
 */

import katex from "katex";
import "katex/dist/katex.min.css";

// 预处理公式
function preprocessFormula(value: string): string {
  if (!value) return "";

  let processed = value.trim();

  // 移除双重 $$ 符号（先检查双重的）
  if (processed.startsWith("$$") && processed.endsWith("$$")) {
    processed = processed.slice(2, -2).trim();
  }
  // 移除单个 $ 符号
  else if (processed.startsWith("$") && processed.endsWith("$")) {
    processed = processed.slice(1, -1).trim();
  }

  // 处理 HTML 实体
  processed = processed
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // 自动将带编号的环境转换为不带编号的版本（添加 *）
  // 这样可以避免显示方程编号 (1), (2) 等
  processed = processed
    .replace(/\\begin\{(align|gather|equation|multline)\}/g, "\\begin{$1*}")
    .replace(/\\end\{(align|gather|equation|multline)\}/g, "\\end{$1*}");

  return processed;
}

class EnhancedFormulaCard extends HTMLElement {
  private span: HTMLElement;

  static get observedAttributes() {
    return ["data-value"];
  }

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });

    // 添加 KaTeX CSS 到 Shadow DOM
    // 尝试从多个来源加载 KaTeX CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    // 优先使用 CDN，确保样式能加载
    link.href = "https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css";
    link.onerror = () => {
      console.warn("Failed to load KaTeX CSS from CDN, trying alternative...");
      // 如果 CDN 失败，尝试从 node_modules
      link.href = "/node_modules/katex/dist/katex.min.css";
    };
    shadow.appendChild(link);

    // 创建容器
    const span = document.createElement("span");
    span.style.display = "inline-block";
    shadow.appendChild(span);
    this.span = span;
  }

  connectedCallback() {
    // 当元素被插入 DOM 时渲染
    const value = this.getAttribute("data-value") || "";
    if (value) {
      // 等待 CSS 加载完成后再渲染
      const link = this.shadowRoot?.querySelector("link");
      if (link) {
        link.onload = () => {
          this.render(value);
        };
        // 如果 CSS 已经加载，直接渲染
        if (link.sheet) {
          this.render(value);
        }
      } else {
        this.render(value);
      }
    }
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    if (name === "data-value") {
      if (oldValue === newValue) return;
      this.render(newValue || "");
    }
  }

  private render(value: string) {
    console.log("Rendering formula:", value);

    // 预处理公式
    const processedValue = preprocessFormula(value);
    console.log("Processed formula:", processedValue);

    // 检测是否需要 displayMode
    // align, gather, alignat, equation 等环境需要 displayMode
    const needsDisplayMode =
      /\\begin\{(align|gather|alignat|equation|multline|split)\*?\}/.test(
        processedValue
      );

    try {
      katex.render(processedValue, this.span, {
        throwOnError: false,
        output: "html",
        displayMode: needsDisplayMode, // 根据公式内容自动选择
      });
      console.log(
        "Formula rendered successfully with displayMode:",
        needsDisplayMode
      );
    } catch (error) {
      console.error("KaTeX render error:", error);
      this.span.innerHTML = `<span style="color: #cc0000;">公式渲染错误: ${
        error instanceof Error ? error.message : "未知错误"
      }</span>`;
    }
  }
}

if (!window.customElements.get("enhanced-formula-card")) {
  window.customElements.define("enhanced-formula-card", EnhancedFormulaCard);
  console.log("Enhanced formula card registered");
}
