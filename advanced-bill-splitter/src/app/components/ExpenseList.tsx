import { Expense, Person } from '@/types';

interface ExpenseListProps {
  expenses: Expense[];
  people: Person[];
}

export default function ExpenseList({ expenses, people }: ExpenseListProps) {
  const getPerson = (id: string) => people.find(p => p.id === id)?.name || 'Unknown';

  return (
    <div className="mb-8">
      <h2 className="text-3xl font-semibold mb-4 text-blue-800">Expenses</h2>
      <ul className="space-y-4">
        {expenses.map((expense) => (
          <li key={expense.id} className="bg-blue-50 p-4 rounded-lg shadow">
            <p className="font-semibold text-lg text-blue-800">{expense.description}</p>
            <p className="text-green-600 font-medium">Amount: ₹{expense.amount.toFixed(2)}</p>
            <p className="text-blue-600">Paid by: {getPerson(expense.paidBy)}</p>
            <p className="text-purple-600">Split among: {expense.splitAmong.map(getPerson).join(', ')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}