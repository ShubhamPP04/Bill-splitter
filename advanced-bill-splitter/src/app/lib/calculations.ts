import { Person, Expense, Split } from '@/types';

export function calculateSplits(people: Person[], expenses: Expense[]): Split[] {
  const balances: { [key: string]: number } = {};

  // Initialize balances
  people.forEach((person) => {
    balances[person.id] = 0;
  });

  // Calculate balances
  expenses.forEach((expense) => {
    const payer = expense.paidBy;
    const splitAmount = expense.amount / expense.splitAmong.length;

    balances[payer] += expense.amount;

    expense.splitAmong.forEach((personId) => {
      balances[personId] -= splitAmount;
    });
  });

  // Calculate splits
  const splits: Split[] = [];
  const debtors = Object.entries(balances).filter(([, balance]) => balance < 0);
  const creditors = Object.entries(balances).filter(([, balance]) => balance > 0);

  debtors.forEach(([debtorId, debtorBalance]) => {
    let remainingDebt = Math.abs(debtorBalance);

    creditors.forEach(([creditorId, creditorBalance]) => {
      if (remainingDebt > 0 && creditorBalance > 0) {
        const amount = Math.min(remainingDebt, creditorBalance);
        splits.push({
          from: debtorId,
          to: creditorId,
          amount: Number(amount.toFixed(2)),
        });
        remainingDebt -= amount;
        balances[creditorId] -= amount;
      }
    });
  });

  return splits;
}