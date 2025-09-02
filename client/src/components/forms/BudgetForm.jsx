import React, { useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CategoryInput from "../../components/CategoryInput";
import SpendingLimitPerCategory from "../budgets/SpendingLimitPerCategory";

const toMonthInput = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

export default function BudgetForm() {
  const navigate = useNavigate();

  const [startMonth, setStartMonth] = useState(toMonthInput());
  const [endMonth, setEndMonth] = useState(toMonthInput());
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const [categoryInput, setCategoryInput] = useState({ name: "", amount: "" });
  const [categories, setCategories] = useState([]); // { name, amount }

  const totalCategories = useMemo(
    () => categories.reduce((sum, c) => sum + (Number(c.amount) || 0), 0),
    [categories]
  );

  const remaining = useMemo(() => {
    const target = Number(amount) || 0;
    return target - totalCategories;
  }, [amount, totalCategories]);

  const handleAddCategory = (e) => {
    e && e.preventDefault();
    const name = (categoryInput.name || "").trim();
    const val = Number(categoryInput.amount);
    if (!name || !isFinite(val)) return;
    setCategories((prev) => [...prev, { name, amount: val }]);
    setCategoryInput({ name: "", amount: "" });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Placeholder create call. Replace with your backend contract.
      await axios.post("/api/ledgers", { name: title });
      navigate("/?cat=Budget");
    } catch (err) {
      console.error(err);
      alert("Create failed. Please login and try again.");
    }
  };

  return (
    <form className="budget-form" onSubmit={onSubmit}>
      <div className="row">
        <div className="field">
          <label>Start Month</label>
          <input
            type="month"
            value={startMonth}
            onChange={(e) => setStartMonth(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label>End Month</label>
          <input
            type="month"
            value={endMonth}
            onChange={(e) => setEndMonth(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="field">
        <label>Title</label>
        <input
          type="text"
          placeholder="e.g. June Budget"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label>Description</label>
        <textarea
          placeholder="Optional notes"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div className="field">
        <label>Amount</label>
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="category-section">
        <CategoryInput
          value={categoryInput}
          onChange={setCategoryInput}
          onAdd={handleAddCategory}
        />

        <SpendingLimitPerCategory
          amount={Number(amount) || 0}
          categories={categories}
          setCategories={setCategories}
        />

        <div className="totals">
          <div className="total">Total categories: {totalCategories.toFixed(2)}</div>
          <div className={`remain ${remaining < 0 ? 'neg' : ''}`}>
            Remaining: {remaining.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="actions">
        <button className="btn submit" type="submit" disabled={!title.trim()}>
          Submit
        </button>
      </div>
    </form>
  );
}
