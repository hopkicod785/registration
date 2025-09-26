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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-slate-300 text-lg">Loading registration form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%236366f1" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      
      <div className="relative max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl mb-6 shadow-2xl">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent mb-6">
            Pre-Install Registration
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Register your traffic signal installation with all the necessary details. 
            This information will help us prepare for your installation and ensure everything goes smoothly.
          </p>
        </div>
        
        <div className="glass-effect rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">
              Installation Registration Form
            </h2>
            <p className="text-indigo-100 mt-2">
              Complete the form below to register your traffic signal installation
            </p>
          </div>
          
          <div className="p-8">
            {dropdownData ? (
              <RegistrationForm dropdownData={dropdownData} />
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-red-400 text-lg font-medium">Failed to load form data. Please refresh the page.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
