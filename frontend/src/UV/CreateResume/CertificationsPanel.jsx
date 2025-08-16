"use client"

import { useState, useEffect } from "react"
import { X, Plus, Trash2, Loader2 } from "lucide-react"
import toast from "react-hot-toast"

export default function CertificationsPanel({ certifications = [], onUpdateCertifications, onClose }) {
  const [certs, setCerts] = useState(certifications)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    setCerts(certifications);
  }, [certifications]);

  const callGeminiAPI = async (data) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key not configured");
    }

    const prompt = `
    Please format the following certifications data to match this exact structure and improve the content quality:

    Expected format:
    [
      {
        "id": number,
        "name": "Full Certification Name",
        "issuer": "Issuing Organization Name",
        "date": "Year Obtained (e.g., 2023)",
        "credentialId": "Credential ID if applicable"
      }
    ]

    Input data:
    ${JSON.stringify(data, null, 2)}

    Rules:
    1. Use full, professional certification names
    2. Use official organization names (e.g., "Amazon Web Services" not "AWS")
    3. Format dates as year only (e.g., "2023")
    4. Keep credential IDs if provided
    5. Ensure proper capitalization and formatting
    6. Remove duplicates and empty entries
    7. Return ONLY the JSON array, no additional text

    Formatted data:
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const generatedText = result.candidates[0].content.parts[0].text;
    const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
    
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from Gemini response");
    }

    return JSON.parse(jsonMatch[0]);
  };

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

  const handleSave = async () => {
    // Filter out empty certifications
    const validCertifications = certs.filter(cert => cert.name.trim() !== "");

    if (validCertifications.length === 0) {
      onUpdateCertifications([]);
      onClose();
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading("Processing certifications with AI...");
    
    try {
      const formattedData = await callGeminiAPI(validCertifications);
      onUpdateCertifications(formattedData);
      toast.success("Certifications updated and formatted!", { id: toastId });
      onClose();
    } catch (error) {
      console.error("Error formatting data:", error);
      toast.error("AI formatting failed, using your input as-is", { id: toastId });
      onUpdateCertifications(validCertifications);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Certifications</h2>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded" disabled={isProcessing}>
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
                disabled={isProcessing}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certification Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={cert.name}
                  onChange={(e) => updateCertification(cert.id, "name", e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., AWS Certified Solutions Architect - Professional"
                  disabled={isProcessing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issuing Organization <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={cert.issuer}
                  onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Amazon Web Services"
                  disabled={isProcessing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Obtained <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={cert.date}
                  onChange={(e) => updateCertification(cert.id, "date", e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 2023"
                  disabled={isProcessing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credential ID (Optional)
                </label>
                <input
                  type="text"
                  value={cert.credentialId}
                  onChange={(e) => updateCertification(cert.id, "credentialId", e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., AWS-CSA-PRO-123456"
                  disabled={isProcessing}
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addCertification}
          className="w-full py-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
          disabled={isProcessing}
        >
          <Plus className="w-5 h-5 text-gray-500" />
          <span className="text-gray-500">Add Certification</span>
        </button>

  
      </div>

      <div className="p-4 border-t flex space-x-2">
        <button
          onClick={handleSave}
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing with AI...</span>
            </>
          ) : (
            <span>DONE</span>
          )}
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
          disabled={isProcessing}
        >
          CANCEL
        </button>
      </div>
    </div>
  )
}