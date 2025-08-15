"use client"

export default function EducationForm({ data, onChange }) {
  const addEducation = () => {
    const newEducation = {
      id: Date.now(),
      school: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      gpa: "",
    }
    onChange([...data, newEducation])
  }

  const updateEducation = (id, field, value) => {
    const updated = data.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
    onChange(updated)
  }

  const removeEducation = (id) => {
    onChange(data.filter((edu) => edu.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Học vấn</h2>
        <button
          onClick={addEducation}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          + Thêm học vấn
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Chưa có thông tin học vấn. Nhấn "Thêm học vấn" để bắt đầu.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {data.map((education) => (
            <div key={education.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium text-gray-900">Học vấn #{data.indexOf(education) + 1}</h3>
                <button onClick={() => removeEducation(education.id)} className="text-red-600 hover:text-red-800">
                  Xóa
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trường học</label>
                  <input
                    type="text"
                    value={education.school}
                    onChange={(e) => updateEducation(education.id, "school", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tên trường"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bằng cấp</label>
                  <input
                    type="text"
                    value={education.degree}
                    onChange={(e) => updateEducation(education.id, "degree", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Cử nhân, Thạc sĩ..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chuyên ngành</label>
                  <input
                    type="text"
                    value={education.field}
                    onChange={(e) => updateEducation(education.id, "field", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Công nghệ thông tin..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GPA (tùy chọn)</label>
                  <input
                    type="text"
                    value={education.gpa}
                    onChange={(e) => updateEducation(education.id, "gpa", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="3.5/4.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Năm bắt đầu</label>
                  <input
                    type="month"
                    value={education.startDate}
                    onChange={(e) => updateEducation(education.id, "startDate", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Năm tốt nghiệp</label>
                  <input
                    type="month"
                    value={education.endDate}
                    onChange={(e) => updateEducation(education.id, "endDate", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
