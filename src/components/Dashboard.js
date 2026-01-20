import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import Summary from './Summary';

function Dashboard({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  useEffect(() => {
    fetchTransactions();
    const channel = supabase
      .channel('transactions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => {
        fetchTransactions();
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [filterMonth]);

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', `${filterMonth}-01`)
      .lt('date', `${filterMonth}-32`)
      .order('date', { ascending: false });
    if (!error) setTransactions(data || []);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;
  const savings = balance > 0 ? balance : 0;

  return (
    <div className="dashboard">
      <header>
        <h1>Budget Planner</h1>
        <button onClick={handleLogout} className="btn-secondary">Logout</button>
      </header>
      <div className="controls">
        <label>Month: </label>
        <input
          type="month"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
        />
      </div>
      <Summary totalIncome={totalIncome} totalExpenses={totalExpenses} balance={balance} savings={savings} />
      <TransactionForm user={user} />
      <TransactionList transactions={transactions} setTransactions={setTransactions} />
    </div>
  );
}

export default Dashboard;