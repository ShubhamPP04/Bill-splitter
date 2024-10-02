import { Person, Expense } from '@/types';
import { calculateSplits } from '../lib/calculations';
import Image from 'next/image';

interface SplitSummaryProps {
  people: Person[];
  expenses: Expense[];
}

export default function SplitSummary({ people, expenses }: SplitSummaryProps) {
  const splits = calculateSplits(people, expenses);

  return (
    <div className="bg-blue-50 p-6 rounded-lg">
      <h2 className="text-3xl font-semibold mb-4 text-blue-800">हिसाब-किताब (Split Summary)</h2>
      {splits.length > 0 ? (
        <ul className="space-y-4">
          {splits.map((split, index) => {
            const fromPerson = people.find((p) => p.id === split.from);
            const toPerson = people.find((p) => p.id === split.to);
            return (
              <li key={index} className="bg-white p-4 rounded-lg shadow flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                    {fromPerson?.photoUrl ? (
                      <Image src={fromPerson.photoUrl} alt={fromPerson.name} width={48} height={48} className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-400">
                        {fromPerson?.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-lg flex-grow">
                  <span className="font-semibold text-red-600">{fromPerson?.name}</span>{' '}
                  <span className="text-gray-600">को देना है</span>{' '}
                  <span className="font-semibold text-green-600">{toPerson?.name}</span>{' '}
                  <span className="text-gray-600">को</span>{' '}
                  <span className="font-bold text-blue-800">₹{split.amount.toFixed(2)}</span>
                </p>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                    {toPerson?.photoUrl ? (
                      <Image src={toPerson.photoUrl} alt={toPerson.name} width={48} height={48} className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-400">
                        {toPerson?.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-600">कोई हिसाब-किताब नहीं है। (No splits to show.)</p>
      )}
    </div>
  );
}