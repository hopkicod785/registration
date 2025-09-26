'use client';

import { useState } from 'react';
import { DropdownData, RegistrationFormData } from '@/types';

interface RegistrationFormProps {
  dropdownData: DropdownData;
}

export default function RegistrationForm({ dropdownData }: RegistrationFormProps) {
  const [formData, setFormData] = useState<RegistrationFormData>({
    intersectionName: '',
    endUser: '',
    distributor: '',
    cabinetType: '',
    cabinetTypeOther: '',
    tlsConnection: '',
    tlsConnectionOther: '',
    detectionIO: '',
    detectionIOOther: '',
    phasingText: '',
    phasingFile: undefined,
    timingFiles: [],
    contactName: '',
    contactEmail: '',
    contactPhone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (field: keyof RegistrationFormData, value: string | File | File[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.intersectionName.trim()) newErrors.intersectionName = 'Intersection name is required';
    if (!formData.endUser.trim()) newErrors.endUser = 'End user is required';
    if (!formData.distributor) newErrors.distributor = 'Distributor is required';
    if (!formData.cabinetType) newErrors.cabinetType = 'Cabinet type is required';
    if (!formData.tlsConnection) newErrors.tlsConnection = 'TLS connection is required';
    if (!formData.detectionIO) newErrors.detectionIO = 'Detection I/O is required';
    if (!formData.contactName.trim()) newErrors.contactName = 'Contact name is required';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required';
    if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Contact phone is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.contactEmail && !emailRegex.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Invalid email address';
    }

    // Check if "Other" fields are filled when selected
    if (formData.cabinetType === 'Other' && !formData.cabinetTypeOther?.trim()) {
      newErrors.cabinetTypeOther = 'Please specify cabinet type';
    }
    if (formData.tlsConnection === 'Other' && !formData.tlsConnectionOther?.trim()) {
      newErrors.tlsConnectionOther = 'Please specify TLS connection';
    }
    if (formData.detectionIO === 'Other' && !formData.detectionIOOther?.trim()) {
      newErrors.detectionIOOther = 'Please specify detection I/O';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const formDataToSend = new FormData();
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'timingFiles' && Array.isArray(value)) {
          value.forEach(file => formDataToSend.append('timingFiles', file));
        } else if (key === 'phasingFile' && value instanceof File) {
          formDataToSend.append('phasingFile', value);
        } else if (typeof value === 'string') {
          formDataToSend.append(key, value);
        }
      });

      const response = await fetch('/api/registrations', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          intersectionName: '',
          endUser: '',
          distributor: '',
          cabinetType: '',
          cabinetTypeOther: '',
          tlsConnection: '',
          tlsConnectionOther: '',
          detectionIO: '',
          detectionIOOther: '',
          phasingText: '',
          phasingFile: undefined,
          timingFiles: [],
          contactName: '',
          contactEmail: '',
          contactPhone: '',
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Intersection Name */}
      <div>
        <label className="form-label">
          Intersection Name *
        </label>
        <input
          type="text"
          value={formData.intersectionName}
          onChange={(e) => handleInputChange('intersectionName', e.target.value)}
          className={`form-input ${errors.intersectionName ? 'border-red-500' : ''}`}
          placeholder="Enter intersection name"
        />
        {errors.intersectionName && (
          <p className="form-error">{errors.intersectionName}</p>
        )}
      </div>

      {/* End User */}
      <div>
        <label className="form-label">
          End User *
        </label>
        <input
          type="text"
          value={formData.endUser}
          onChange={(e) => handleInputChange('endUser', e.target.value)}
          className={`form-input ${errors.endUser ? 'border-red-500' : ''}`}
          placeholder="Enter end user"
        />
        {errors.endUser && (
          <p className="form-error">{errors.endUser}</p>
        )}
      </div>

      {/* Distributor */}
      <div>
        <label className="form-label">
          Distributor *
        </label>
        <select
          value={formData.distributor}
          onChange={(e) => handleInputChange('distributor', e.target.value)}
          className={`form-select ${errors.distributor ? 'border-red-500' : ''}`}
        >
          <option value="">Select distributor</option>
          {dropdownData.distributors.map((distributor) => (
            <option key={distributor.id} value={distributor.name}>
              {distributor.name}
            </option>
          ))}
        </select>
        {errors.distributor && (
          <p className="form-error">{errors.distributor}</p>
        )}
      </div>

      {/* Cabinet Type */}
      <div>
        <label className="form-label">
          Cabinet Type *
        </label>
        <select
          value={formData.cabinetType}
          onChange={(e) => handleInputChange('cabinetType', e.target.value)}
          className={`form-select ${errors.cabinetType ? 'border-red-500' : ''}`}
        >
          <option value="">Select cabinet type</option>
          {dropdownData.cabinetTypes.map((type) => (
            <option key={type.id} value={type.name}>
              {type.name}
            </option>
          ))}
        </select>
        {formData.cabinetType === 'Other' && (
          <div className="mt-2">
            <input
              type="text"
              value={formData.cabinetTypeOther || ''}
              onChange={(e) => handleInputChange('cabinetTypeOther', e.target.value)}
              className={`form-input ${errors.cabinetTypeOther ? 'border-red-500' : ''}`}
              placeholder="Specify cabinet type"
            />
            {errors.cabinetTypeOther && (
              <p className="form-error">{errors.cabinetTypeOther}</p>
            )}
          </div>
        )}
        {errors.cabinetType && (
          <p className="form-error">{errors.cabinetType}</p>
        )}
      </div>

      {/* TLS Connection */}
      <div>
        <label className="form-label">
          TLS Connection *
        </label>
        <select
          value={formData.tlsConnection}
          onChange={(e) => handleInputChange('tlsConnection', e.target.value)}
          className={`form-select ${errors.tlsConnection ? 'border-red-500' : ''}`}
        >
          <option value="">Select TLS connection</option>
          {dropdownData.tlsConnections.map((connection) => (
            <option key={connection.id} value={connection.name}>
              {connection.name}
            </option>
          ))}
        </select>
        {formData.tlsConnection === 'Other' && (
          <div className="mt-2">
            <input
              type="text"
              value={formData.tlsConnectionOther || ''}
              onChange={(e) => handleInputChange('tlsConnectionOther', e.target.value)}
              className={`form-input ${errors.tlsConnectionOther ? 'border-red-500' : ''}`}
              placeholder="Specify TLS connection"
            />
            {errors.tlsConnectionOther && (
              <p className="form-error">{errors.tlsConnectionOther}</p>
            )}
          </div>
        )}
        {errors.tlsConnection && (
          <p className="form-error">{errors.tlsConnection}</p>
        )}
      </div>

      {/* Detection I/O */}
      <div>
        <label className="form-label">
          Detection I/O *
        </label>
        <select
          value={formData.detectionIO}
          onChange={(e) => handleInputChange('detectionIO', e.target.value)}
          className={`form-select ${errors.detectionIO ? 'border-red-500' : ''}`}
        >
          <option value="">Select detection I/O</option>
          {dropdownData.detectionIOs.map((io) => (
            <option key={io.id} value={io.name}>
              {io.name}
            </option>
          ))}
        </select>
        {formData.detectionIO === 'Other' && (
          <div className="mt-2">
            <input
              type="text"
              value={formData.detectionIOOther || ''}
              onChange={(e) => handleInputChange('detectionIOOther', e.target.value)}
              className={`form-input ${errors.detectionIOOther ? 'border-red-500' : ''}`}
              placeholder="Specify detection I/O"
            />
            {errors.detectionIOOther && (
              <p className="form-error">{errors.detectionIOOther}</p>
            )}
          </div>
        )}
        {errors.detectionIO && (
          <p className="form-error">{errors.detectionIO}</p>
        )}
      </div>

      {/* Phasing */}
      <div>
        <label className="form-label">
          Phasing
        </label>
        <div className="space-y-3">
          <textarea
            value={formData.phasingText || ''}
            onChange={(e) => handleInputChange('phasingText', e.target.value)}
            className="form-input"
            rows={3}
            placeholder="Enter phasing information (text)"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phasing File (optional)
            </label>
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                handleInputChange('phasingFile', file || undefined);
              }}
              className="form-input"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            />
          </div>
        </div>
      </div>

      {/* Timing */}
      <div>
        <label className="form-label">
          Timing Files (optional)
        </label>
        <input
          type="file"
          multiple
          onChange={(e) => handleInputChange('timingFiles', Array.from(e.target.files || []))}
          className="form-input"
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
        />
        <p className="text-sm text-gray-500 mt-1">
          You can select multiple files for timing information
        </p>
      </div>

      {/* Contact Information */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">
              Contact Name *
            </label>
            <input
              type="text"
              value={formData.contactName}
              onChange={(e) => handleInputChange('contactName', e.target.value)}
              className={`form-input ${errors.contactName ? 'border-red-500' : ''}`}
              placeholder="Enter contact name"
            />
            {errors.contactName && (
              <p className="form-error">{errors.contactName}</p>
            )}
          </div>

          <div>
            <label className="form-label">
              Contact Email *
            </label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              className={`form-input ${errors.contactEmail ? 'border-red-500' : ''}`}
              placeholder="Enter contact email"
            />
            {errors.contactEmail && (
              <p className="form-error">{errors.contactEmail}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="form-label">
              Contact Phone *
            </label>
            <input
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => handleInputChange('contactPhone', e.target.value)}
              className={`form-input ${errors.contactPhone ? 'border-red-500' : ''}`}
              placeholder="Enter contact phone"
            />
            {errors.contactPhone && (
              <p className="form-error">{errors.contactPhone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Submit Status */}
      {submitStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <p className="text-green-800">
            Registration submitted successfully! Thank you for your submission.
          </p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">
            Failed to submit registration. Please try again.
          </p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`btn-primary ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Registration'}
        </button>
      </div>
    </form>
  );
}
