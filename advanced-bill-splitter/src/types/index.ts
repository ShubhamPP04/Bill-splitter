export interface Person {
  id: string;
  name: string;
  photoUrl?: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  splitAmong: string[];
}

export interface Split {
  from: string;
  to: string;
  amount: number;
}