'use client';

import { useState } from 'react';
import BillForm from './components/BillForm';
import ExpenseList from './components/ExpenseList';
import PersonList from './components/PersonList';
import SplitSummary from './components/SplitSummary';
import { Person, Expense } from '@/types';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Home() {
  const [people, setPeople] = useState<Person[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activeTab, setActiveTab] = useState<'people' | 'expenses' | 'summary'>('people');

  const addPerson = (name: string, photoUrl?: string) => {
    setPeople([...people, { id: Date.now().toString(), name, photoUrl }]);
  };

  const addExpense = (expense: Expense) => {
    setExpenses([...expenses, expense]);
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const chartData = {
    labels: people.map(p => p.name),
    datasets: [{
      data: people.map(p => 
        expenses.filter(e => e.paidBy === p.id).reduce((sum, e) => sum + e.amount, 0)
      ),
      backgroundColor: [
        '#3B82F6', '#10B981', '#60A5FA', '#34D399', '#93C5FD', '#6EE7B7'
      ],
    }]
  };

  const removePerson = (id: string) => {
    setPeople(people.filter(person => person.id !== id));
    setExpenses(expenses.filter(expense => expense.paidBy !== id && !expense.splitAmong.includes(id)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-blue-600">
          Smart Bill Splitter
        </h1>
        
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
          <div className="flex flex-col md:flex-row justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-3xl font-bold text-green-600 mb-4 md:mb-0">Total: ₹{totalExpenses.toFixed(2)}</h2>
            <div className="w-48 h-48">
              <Doughnut data={chartData} options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }} />
            </div>
          </div>
          <div className="flex border-b border-gray-200">
            {['people', 'expenses', 'summary'].map((tab) => (
              <button 
                key={tab}
                className={`flex-1 py-3 text-center font-medium text-sm transition-all duration-200 ${
                  activeTab === tab 
                    ? 'bg-blue-500 text-white shadow-inner' 
                    : 'text-blue-600 hover:bg-blue-100'
                }`}
                onClick={() => setActiveTab(tab as 'people' | 'expenses' | 'summary')}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className="p-6">
            {activeTab === 'people' && <PersonList people={people} addPerson={addPerson} removePerson={removePerson} />}
            {activeTab === 'expenses' && (
              <>
                <BillForm people={people} addExpense={addExpense} />
                <ExpenseList expenses={expenses} people={people} />
              </>
            )}
            {activeTab === 'summary' && <SplitSummary people={people} expenses={expenses} />}
          </div>
        </div>
      </div>
    </div>
  );
}
