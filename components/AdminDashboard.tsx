'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';

interface Registration {
  id: number;
  intersection_name: string;
  end_user: string;
  distributor: string;
  cabinet_type: string;
  cabinet_type_other?: string;
  tls_connection: string;
  tls_connection_other?: string;
  detection_io: string;
  detection_io_other?: string;
  phasing_text?: string;
  phasing_file_path?: string;
  timing_files?: string;
  estimated_install_date?: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  created_at: string;
}

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await fetch('/api/registrations');
        if (response.ok) {
          const data = await response.json();
          setRegistrations(data.registrations);
        } else {
          setError('Failed to fetch registrations');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const parseTimingFiles = (timingFilesString?: string) => {
    if (!timingFilesString) return [];
    try {
      return JSON.parse(timingFilesString);
    } catch {
      return [];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading registrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.username}</p>
            </div>
            <div className="flex space-x-4">
              <a
                href="/"
                className="btn-secondary"
              >
                View Registration Form
              </a>
              <button
                onClick={onLogout}
                className="btn-primary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">R</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Registrations
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {registrations.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">T</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      This Month
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {registrations.filter(r => {
                        const regDate = new Date(r.created_at);
                        const now = new Date();
                        return regDate.getMonth() === now.getMonth() && 
                               regDate.getFullYear() === now.getFullYear();
                      }).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">N</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Recent (7 days)
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {registrations.filter(r => {
                        const regDate = new Date(r.created_at);
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return regDate >= weekAgo;
                      }).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Registrations Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Registration Submissions
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              All pre-install registration submissions
            </p>
          </div>
          
          {registrations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No registrations found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Intersection
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Distributor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Install Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {registrations.map((registration) => (
                    <tr key={registration.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {registration.intersection_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {registration.end_user}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {registration.distributor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <div className="font-medium">{registration.contact_name}</div>
                          <div className="text-gray-400">{registration.contact_email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {registration.estimated_install_date 
                          ? new Date(registration.estimated_install_date).toLocaleDateString('en-US')
                          : 'Not specified'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(registration.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedRegistration(registration)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Registration Details Modal */}
      {selectedRegistration && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Registration Details
                </h3>
                <button
                  onClick={() => setSelectedRegistration(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Intersection Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedRegistration.intersection_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End User</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedRegistration.end_user}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Distributor</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedRegistration.distributor}
                      {selectedRegistration.cabinet_type_other && (
                        <span className="text-gray-500"> ({selectedRegistration.cabinet_type_other})</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cabinet Type</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedRegistration.cabinet_type}
                      {selectedRegistration.cabinet_type_other && (
                        <span className="text-gray-500"> ({selectedRegistration.cabinet_type_other})</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">TLS Connection</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedRegistration.tls_connection}
                      {selectedRegistration.tls_connection_other && (
                        <span className="text-gray-500"> ({selectedRegistration.tls_connection_other})</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Detection I/O</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedRegistration.detection_io}
                      {selectedRegistration.detection_io_other && (
                        <span className="text-gray-500"> ({selectedRegistration.detection_io_other})</span>
                      )}
                    </p>
                  </div>
                </div>

                {selectedRegistration.estimated_install_date && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estimated Install Date</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedRegistration.estimated_install_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}

                {selectedRegistration.phasing_text && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phasing Information</label>
                    <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                      {selectedRegistration.phasing_text}
                    </p>
                  </div>
                )}

                {selectedRegistration.phasing_file_path && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phasing File</label>
                    <p className="mt-1 text-sm text-primary-600">
                      {selectedRegistration.phasing_file_path}
                    </p>
                  </div>
                )}

                {selectedRegistration.timing_files && parseTimingFiles(selectedRegistration.timing_files).length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Timing Files</label>
                    <div className="mt-1 space-y-1">
                      {parseTimingFiles(selectedRegistration.timing_files).map((file: string, index: number) => (
                        <p key={index} className="text-sm text-primary-600">{file}</p>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Name</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedRegistration.contact_name}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedRegistration.contact_email}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Phone</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedRegistration.contact_phone}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <label className="block text-xs font-medium text-gray-500">Submitted</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(selectedRegistration.created_at)}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedRegistration(null)}
                  className="btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
