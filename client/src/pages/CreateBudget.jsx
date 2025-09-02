import React from "react";
import BudgetForm from "../components/forms/BudgetForm";

export default function CreateBudget() {
  return (
    <div className="create-budget">
      <h1>Create Budget</h1>
      <div className="layout">
        <BudgetForm />
        <div className="hero" aria-hidden="true" />
      </div>
    </div>
  );
}
