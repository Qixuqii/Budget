import React from "react";

export default function CategoryInput({
  value = { name: "", amount: "" },
  onChange,
  onAdd,
  addLabel = "+ Add Category",
}) {
  const handleNameChange = (e) => {
    const v = { ...value, name: e.target.value };
    onChange && onChange(v);
  };

  const handleAmountChange = (e) => {
    const v = { ...value, amount: e.target.value };
    onChange && onChange(v);
  };

  return (
    <div className="category-inputs">
      <div className="field">
        <label>Category</label>
        <input
          type="text"
          placeholder="e.g. Dining"
          value={value.name}
          onChange={handleNameChange}
        />
      </div>
      <div className="field">
        <label>Amount</label>
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={value.amount}
          onChange={handleAmountChange}
        />
      </div>
      <button className="btn add" onClick={onAdd} type="button">
        {addLabel}
      </button>
    </div>
  );
}
