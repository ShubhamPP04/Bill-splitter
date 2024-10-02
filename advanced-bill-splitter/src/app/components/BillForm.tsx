import { useState } from 'react';
import { Person, Expense } from '@/types';

interface BillFormProps {
  people: Person[];
  addExpense: (expense: Expense) => void;
}

export default function BillForm({ people, addExpense }: BillFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [splitAmong, setSplitAmong] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description && amount && paidBy && splitAmong.length > 0) {
      addExpense({
        id: Date.now().toString(),
        description,
        amount: parseFloat(amount),
        paidBy,
        splitAmong,
      });
      setDescription('');
      setAmount('');
      setPaidBy('');
      setSplitAmong([]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-blue-50 p-6 rounded-lg">
      <h2 className="text-3xl font-semibold mb-4 text-blue-800">Add Expense</h2>
      <div className="mb-4">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500"
        />
      </div>
      <div className="mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount (₹)"
          className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500"
        />
      </div>
      <div className="mb-4">
        <select
          value={paidBy}
          onChange={(e) => setPaidBy(e.target.value)}
          className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        >
          <option value="" className="text-gray-500">Paid by</option>
          {people.map((person) => (
            <option key={person.id} value={person.id} className="text-black">
              {person.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <p className="mb-2 font-medium text-blue-800">Split among:</p>
        <div className="grid grid-cols-2 gap-2">
          {people.map((person) => (
            <label key={person.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={splitAmong.includes(person.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSplitAmong([...splitAmong, person.id]);
                  } else {
                    setSplitAmong(splitAmong.filter((id) => id !== person.id));
                  }
                }}
                className="form-checkbox text-blue-500 h-5 w-5"
              />
              <span className="text-black">{person.name}</span>
            </label>
          ))}
        </div>
      </div>
      <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded transition duration-200">
        Add Expense
      </button>
    </form>
  );
}