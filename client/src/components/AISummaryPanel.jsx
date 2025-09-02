import React, { useEffect, useMemo, useState } from "react";

/**
 * 展示某个账本在指定月份的 AI 总结
 * 依赖后端接口：GET /api/ledgers/:ledgerId/summaries/:month  (month 形如 YYYY-MM)
 *
 * 用法：
 * <AISummaryPanel ledgerId={11} />
 */
export default function AISummaryPanel({ ledgerId }) {
  const [month, setMonth] = useState(getCurrentMonth());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [content, setContent] = useState("");

  const endpoint = useMemo(() => {
    if (!ledgerId || !month) return "";
    return `/api/ledgers/${encodeURIComponent(ledgerId)}/summaries/${encodeURIComponent(month)}`;
  }, [ledgerId, month]);

  useEffect(() => {
    if (!endpoint) return;
    let abort = false;

    async function fetchSummary() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(endpoint, {
          headers: { "Content-Type": "application/json" },
          credentials: "include", // 若你的后端需要 cookie/JWT 放到 header 可自行调整
        });

        if (!res.ok) {
          const msg = await safeText(res);
          throw new Error(msg || `HTTP ${res.status}`);
        }
        const data = await res.json();
        // 约定后端返回 { content: "..." } 或 { data: { content: "..." } }
        const text =
          (data && data.content) ||
          (data && data.data && data.data.content) ||
          "";
        if (!abort) setContent(text || "（本月暂无总结）");
      } catch (e) {
        if (!abort) setError(e.message || "加载失败");
      } finally {
        if (!abort) setLoading(false);
      }
    }

    fetchSummary();
    return () => {
      abort = true;
    };
  }, [endpoint]);

  return (
    <section
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 16,
        marginTop: 24,
        background: "#ffffff",
      }}
    >
      <header style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>
          AI 月度总结
        </h2>
        <MonthPicker value={month} onChange={setMonth} />
      </header>

      <div style={{ marginTop: 12, minHeight: 80 }}>
        {loading && <p style={{ opacity: 0.7 }}>加载中…</p>}
        {!loading && error && (
          <p style={{ color: "#b91c1c" }}>
            加载失败：{error}
          </p>
        )}
        {!loading && !error && (
          <article
            style={{
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
              color: "#111827",
            }}
          >
            {content}
          </article>
        )}
      </div>

      <footer style={{ marginTop: 12, fontSize: 12, color: "#6b7280" }}>
        小贴士：切换上面的“月份”可以浏览不同月份的总结。
      </footer>
    </section>
  );
}

/** 获取当前月份字符串：YYYY-MM */
function getCurrentMonth() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

/** 简单的 month 选择器（优先使用 <input type="month">） */
function MonthPicker({ value, onChange }) {
  const [fallbackOpen, setFallbackOpen] = useState(false);

  // 检测浏览器是否支持 input[type=month]
  const supportsMonth = useMemo(() => {
    try {
      const i = document.createElement("input");
      i.setAttribute("type", "month");
      return i.type === "month";
    } catch {
      return false;
    }
  }, []);

  if (supportsMonth) {
    return (
      <input
        type="month"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: "6px 10px",
        }}
      />
    );
  }

  // 兜底：用两个下拉（年 + 月）
  const [year, month] = value.split("-");
  const years = range(5, new Date().getFullYear() - 4); // 近5年
  const months = range(12, 1);

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <select
        value={year}
        onChange={(e) => {
          onChange(`${e.target.value}-${month}`);
          setFallbackOpen(true);
        }}
      >
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
      <select
        value={month}
        onChange={(e) => {
          const mm = String(e.target.value).padStart(2, "0");
          onChange(`${year}-${mm}`);
        }}
        onClick={() => setFallbackOpen(true)}
      >
        {months.map((m) => {
          const mm = String(m).padStart(2, "0");
          return (
            <option key={mm} value={mm}>{mm}</option>
          );
        })}
      </select>
    </div>
  );
}

function range(n, start = 0) {
  return Array.from({ length: n }, (_, i) => i + start);
}

async function safeText(res) {
  try { return await res.text(); } catch { return ""; }
}
