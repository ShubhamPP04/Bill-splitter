import { useState, useRef } from 'react';
import { Person } from '@/types';
import Image from 'next/image';

interface PersonListProps {
  people: Person[];
  addPerson: (name: string, photoUrl?: string) => void;
  removePerson: (id: string) => void;
}

export default function PersonList({ people, addPerson, removePerson }: PersonListProps) {
  const [newPersonName, setNewPersonName] = useState('');
  const [hoveredPerson, setHoveredPerson] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tempPhotoUrl, setTempPhotoUrl] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPersonName.trim()) {
      addPerson(newPersonName.trim(), tempPhotoUrl || undefined);
      setNewPersonName('');
      setTempPhotoUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-3xl font-bold mb-8 text-blue-800">People</h3>
      <ul className="mb-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {people.map((person) => (
          <li 
            key={person.id} 
            className={`relative bg-gradient-to-br from-blue-100 to-green-100 p-4 rounded-xl text-blue-800 font-medium shadow-md transition-all duration-300 ${
              hoveredPerson === person.id ? 'transform scale-105 shadow-lg' : ''
            }`}
            onMouseEnter={() => setHoveredPerson(person.id)}
            onMouseLeave={() => setHoveredPerson(null)}
          >
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 mb-3 rounded-full overflow-hidden bg-white shadow-inner">
                {person.photoUrl ? (
                  <Image src={person.photoUrl} alt={person.name} width={80} height={80} className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-blue-400">
                    {person.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="text-center text-lg">{person.name}</span>
            </div>
            {hoveredPerson === person.id && (
              <button 
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                onClick={() => removePerson(person.id)}
              >
                ×
              </button>
            )}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} className="space-y-4 bg-blue-50 p-6 rounded-xl">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={newPersonName}
            onChange={(e) => setNewPersonName(e.target.value)}
            placeholder="Enter name"
            className="flex-grow p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-800 placeholder-blue-300 transition-all duration-200"
          />
          <button 
            type="submit" 
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 font-medium"
          >
            Add Person
          </button>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
            id="photoUpload"
          />
          <label 
            htmlFor="photoUpload"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            Upload Photo
          </label>
          {tempPhotoUrl && (
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500">
              <Image src={tempPhotoUrl} alt="Temp" width={48} height={48} className="object-cover" />
            </div>
          )}
        </div>
      </form>
    </div>
  );
}