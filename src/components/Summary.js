import React from 'react';

function Summary({ totalIncome, totalExpenses, balance, savings }) {
  return (
    <div className="summary">
      <h3>Monthly Summary</h3>
      <div className="summary-item income">Total Income: ${totalIncome.toFixed(2)}</div>
      <div className="summary-item expense">Total Expenses: ${totalExpenses.toFixed(2)}</div>
      <div className="summary-item balance">Balance: ${balance.toFixed(2)}</div>
      <div className="summary-item savings">Savings: ${savings.toFixed(2)}</div>
    </div>
  );
}

export default Summary;