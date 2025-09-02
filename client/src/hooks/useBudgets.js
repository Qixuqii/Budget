import { useEffect, useState } from "react";

/**
 * 自定义 Hook：获取预算数据
 * 依赖后端接口 GET /api/budgets
 */
export default function useBudgets() {
  const [data, setData] = useState(null);       // 存放后端返回的数据
  const [isLoading, setIsLoading] = useState(true); // 是否在加载中
  const [error, setError] = useState(null);     // 错误信息

  useEffect(() => {
    let abort = false;

    async function fetchBudgets() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:8800/api/budgets", {
          credentials: "include", // 如果你用 JWT token，可以改成 headers: { Authorization: ... }
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const json = await res.json();

        if (!abort) {
          setData(json); // 保存返回的数据
        }
      } catch (err) {
        if (!abort) setError(err.message);
      } finally {
        if (!abort) setIsLoading(false);
      }
    }

    fetchBudgets();

    return () => {
      abort = true;
    };
  }, []);

  return { data, isLoading, error };
}
