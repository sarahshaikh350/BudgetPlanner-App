import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function TransactionForm({ user }) {
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const categories = {
    income: ['salary', 'freelance', 'investment', 'other'],
    expense: ['food', 'rent', 'transport', 'entertainment', 'utilities', 'other']
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('transactions').insert({
      user_id: user.id,
      type,
      category,
      amount: parseFloat(amount),
      description,
      date
    });
    if (!error) {
      setCategory('');
      setAmount('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <h3>Add Transaction</h3>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <select value={category} onChange={(e) => setCategory(e.target.value)} required>
        <option value="">Select Category</option>
        {categories[type].map(cat => <option key={cat} value={cat}>{cat}</option>)}
      </select>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <button type="submit" className="btn-primary">Add</button>
    </form>
  );
}

export default TransactionForm;