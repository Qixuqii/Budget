import React, { Fragment, useMemo } from "react";

export default function SpendingLimitPerCategory({
  amount = 0,
  categories = [],
  setCategories,
}) {
  const total = useMemo(
    () => categories.reduce((sum, c) => sum + (Number(c.amount) || 0), 0),
    [categories]
  );

  const handleAmountChange = (idx, val) => {
    const v = Number(val);
    if (!isFinite(v) && val !== "") return;
    const arr = [...categories];
    arr[idx] = { ...arr[idx], amount: val === "" ? "" : v };
    setCategories(arr);
  };

  const handleNameChange = (idx, name) => {
    const arr = [...categories];
    arr[idx] = { ...arr[idx], name };
    setCategories(arr);
  };

  const removeAt = (idx) => {
    setCategories(categories.filter((_, i) => i !== idx));
  };

  const addRemainingToOther = () => {
    const remaining = (Number(amount) || 0) - total;
    if (remaining <= 0) return;
    setCategories((prev) => {
      const i = prev.findIndex((c) => (c.name || '').toLowerCase() === 'other');
      if (i >= 0) {
        const arr = [...prev];
        arr[i] = { ...arr[i], amount: Number(arr[i].amount) + remaining };
        return arr;
      }
      return [...prev, { name: 'Other', amount: remaining }];
    });
  };

  return (
    <div className="category-section">
      <div className="flex items-center justify-between mb-4">
        <span>Category</span>
        {/* The actual add action happens in parent via the input row, but keep button area here if needed */}
      </div>

      <div className="category-list">
        {categories.length === 0 ? (
          <div className="empty">No categories yet</div>
        ) : (
          categories.map((c, idx) => (
            <Fragment key={`${c.name}-${idx}`}>
              <div className="item">
                <input
                  className="name-input"
                  type="text"
                  placeholder="Category name"
                  value={c.name}
                  onChange={(e) => handleNameChange(idx, e.target.value)}
                />
                <input
                  className="value-input"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={c.amount}
                  onChange={(e) => handleAmountChange(idx, e.target.value)}
                />
                <button type="button" className="remove" onClick={() => removeAt(idx)}>
                  ×
                </button>
              </div>
            </Fragment>
          ))
        )}
      </div>

      <div className="totals">
        <div className={`remain ${total > (Number(amount) || 0) ? 'neg' : ''}`}>
          Remaining: {((Number(amount) || 0) - total).toFixed(2)}
        </div>
        <div className="total">Total: {total.toFixed(2)}</div>
      </div>

      {((Number(amount) || 0) - total) > 0 && (
        <button type="button" className="btn helper" onClick={addRemainingToOther}>
          Add remaining amount in 'Other' category
        </button>
      )}
    </div>
  );
}
