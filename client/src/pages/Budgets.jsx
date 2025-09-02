import React from "react";
import { Link } from "react-router-dom"; // 濡傛灉浣犵敤鐨勬槸 React Router
import useBudgets from "../hooks/useBudgets.js"; // 浣犲凡鏈夌殑 hook
// import RecentBudgets from "../components/budgets/RecentBudgets.jsx";
// import EmptyStateBudgets from "../components/budgets/EmptyStateBudgets.jsx";

export default function Budgets() {
  const { data, isLoading } = useBudgets();
  const emptyState = data?.total === 0;

  return (
    <div className="mx-auto max-w-[1200px] w-full px-4">
      {/* 椤堕儴鍖哄煙锛氭爣棰?+ 鎸夐挳 */}
      <div
        className={`flex items-center ${
          emptyState ? "justify-center" : "justify-between"
        }`}
      >
        <h1 className="text-2xl font-bold py-10">Budgets</h1>

        {!emptyState && (
          <Link to="/budget/new">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Add Budget
            </button>
          </Link>
        )}
      </div>

      {/* 鍐呭鍖哄煙 */}
      {emptyState && !isLoading && <EmptyStateBudgets />}
      {isLoading && <p>Loading...</p>}
      {!emptyState && !isLoading && <RecentBudgets />}
    </div>
  );
}

