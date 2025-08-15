"use client"

import { useState } from "react"
import { X, Plus, Trash2 } from "lucide-react"

export default function CertificationsPanel({ certifications = [], onUpdateCertifications, onClose }) {
  const [certs, setCerts] = useState(certifications)

  const addCertification = () => {
    const newCert = {
      id: Date.now(),
      name: "",
      issuer: "",
      date: "",
      credentialId: "",
    }
    setCerts([...certs, newCert])
  }

  const updateCertification = (id, field, value) => {
    setCerts(certs.map((cert) => (cert.id === id ? { ...cert, [field]: value } : cert)))
  }

  const removeCertification = (id) => {
    setCerts(certs.filter((cert) => cert.id !== id))
  }

  const handleSave = () => {
    onUpdateCertifications(certs.filter((cert) => cert.name.trim() !== ""))
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Certifications</h2>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {certs.map((cert) => (
          <div key={cert.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="font-medium">Certification {certs.indexOf(cert) + 1}</h3>
              <button
                onClick={() => removeCertification(cert.id)}
                className="p-1 hover:bg-red-100 rounded text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Certification Name *</label>
                <input
                  type="text"
                  value={cert.name}
                  onChange={(e) => updateCertification(cert.id, "name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., AWS Certified Developer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issuing Organization *</label>
                <input
                  type="text"
                  value={cert.issuer}
                  onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Amazon Web Services"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Obtained</label>
                <input
                  type="text"
                  value={cert.date}
                  onChange={(e) => updateCertification(cert.id, "date", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 2023 or March 2023"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Credential ID</label>
                <input
                  type="text"
                  value={cert.credentialId}
                  onChange={(e) => updateCertification(cert.id, "credentialId", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., AWS-CDA-123456"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addCertification}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5 text-gray-500" />
          <span className="text-gray-500">Add Certification</span>
        </button>
      </div>

      <div className="p-4 border-t flex space-x-2">
        <button
          onClick={handleSave}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          DONE
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
        >
          CANCEL
        </button>
      </div>
    </div>
  )
}
