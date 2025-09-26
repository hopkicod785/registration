'use client';

import { useState, useEffect } from 'react';
import RegistrationForm from '@/components/RegistrationForm';
import { DropdownData } from '@/types';

export default function Home() {
  const [dropdownData, setDropdownData] = useState<DropdownData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const response = await fetch('/api/dropdown-data');
        if (response.ok) {
          const data = await response.json();
          setDropdownData(data);
        }
      } catch (error) {
        console.error('Failed to fetch dropdown data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDropdownData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading registration form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-primary-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">
              Pre-Install Registration System
            </h1>
            <p className="text-primary-100 mt-1">
              Register your traffic signal installation details
            </p>
          </div>
          
          <div className="p-6">
            {dropdownData ? (
              <RegistrationForm dropdownData={dropdownData} />
            ) : (
              <div className="text-center py-8">
                <p className="text-red-600">Failed to load form data. Please refresh the page.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
