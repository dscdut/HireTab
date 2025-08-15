"use client"

export default function ExperienceForm({ data, onChange }) {
  const addExperience = () => {
    const newExperience = {
      id: Date.now(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    }
    onChange([...data, newExperience])
  }

  const updateExperience = (id, field, value) => {
    const updated = data.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    onChange(updated)
  }

  const removeExperience = (id) => {
    onChange(data.filter((exp) => exp.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Kinh nghiệm làm việc</h2>
        <button
          onClick={addExperience}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          + Thêm kinh nghiệm
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Chưa có kinh nghiệm nào. Nhấn "Thêm kinh nghiệm" để bắt đầu.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {data.map((experience) => (
            <div key={experience.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium text-gray-900">Kinh nghiệm #{data.indexOf(experience) + 1}</h3>
                <button onClick={() => removeExperience(experience.id)} className="text-red-600 hover:text-red-800">
                  Xóa
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Công ty</label>
                  <input
                    type="text"
                    value={experience.company}
                    onChange={(e) => updateExperience(experience.id, "company", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tên công ty"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vị trí</label>
                  <input
                    type="text"
                    value={experience.position}
                    onChange={(e) => updateExperience(experience.id, "position", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Vị trí công việc"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày bắt đầu</label>
                  <input
                    type="month"
                    value={experience.startDate}
                    onChange={(e) => updateExperience(experience.id, "startDate", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày kết thúc</label>
                  <input
                    type="month"
                    value={experience.endDate}
                    onChange={(e) => updateExperience(experience.id, "endDate", e.target.value)}
                    disabled={experience.current}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                  <div className="mt-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={experience.current}
                        onChange={(e) => updateExperience(experience.id, "current", e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-600">Đang làm việc</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả công việc</label>
                <textarea
                  value={experience.description}
                  onChange={(e) => updateExperience(experience.id, "description", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mô tả chi tiết về công việc, thành tích..."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
