import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function TransactionList({ transactions, setTransactions }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEdit = (transaction) => {
    setEditingId(transaction.id);
    setEditData({ ...transaction });
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from('transactions')
      .update(editData)
      .eq('id', editingId);
    if (!error) {
      setTransactions(transactions.map(t => t.id === editingId ? editData : t));
      setEditingId(null);
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (!error) setTransactions(transactions.filter(t => t.id !== id));
  };

  return (
    <div className="transaction-list">
      <h3>Transactions</h3>
      {transactions.length === 0 ? <p>No transactions for this month.</p> : (
        <ul>
          {transactions.map(t => (
            <li key={t.id} className={t.type}>
              {editingId === t.id ? (
                <div>
                  <input
                    type="text"
                    value={editData.category}
                    onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                  />
                  <input
                    type="number"
                    value={editData.amount}
                    onChange={(e) => setEditData({ ...editData, amount: parseFloat(e.target.value) })}
                  />
                  <input
                    type="text"
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  />
                  <button onClick={handleSave} className="btn-accent">Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              ) : (
                <div>
                  <span>{t.date} - {t.category}: ${t.amount} ({t.description})</span>
                  <button onClick={() => handleEdit(t)} className="btn-accent">Edit</button>
                  <button onClick={() => handleDelete(t.id)} className="btn-secondary">Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TransactionList;