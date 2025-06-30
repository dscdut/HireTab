const CompanyHeader = ({ company, locations }) => {
    return (
        <div className="bg-white border-b border-gray-200 px-6 py-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

                    {/* Company Info Section - 8 columns */}
                    <div className="md:col-span-8">
                        <div className="flex items-start space-x-6">
                            {/* Avatar */}
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-white text-4xl font-bold">S</span>
                            </div>

                            {/* Company Text Info */}
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {company.jobCount} Jobs
                                    </span>
                                </div>
                                <p className="text-blue-600 mb-4">{company.website}</p>

                                {/* Grid Info */}
                                <div className="grid grid-cols-2 lg:grid-cols-2 gap-6">
                                    {[
                                        { label: 'Founded', value: company.founded, iconPath: "M6 2a1 1..." },
                                        { label: 'Employees', value: company.employees, iconPath: "M9 6a3 3..." },
                                        { label: 'Location', value: company.location, iconPath: "M5.05 4.05..." },
                                        { label: 'Industry', value: company.industry, iconPath: "M6 6V5..." },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center space-x-3">
                                            <div className="w-5 h-5 text-blue-500">
                                                <svg fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" clipRule="evenodd" d={item.iconPath} />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">{item.label}</p>
                                                <p className="font-medium">{item.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Office Location Section - 4 columns */}
                    <div className="md:col-span-4">
                        <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Office Locations</h2>
                            <p className="text-gray-600 text-sm mb-4">Offices in over 20 countries worldwide</p>

                            <div className="space-y-3 mb-4">
                                {locations.slice(0, 3).map((location, index) => (
                                    <div
                                        key={index}
                                        className="border border-gray-200 rounded-lg px-3 py-2 bg-white cursor-pointer hover:bg-gray-100 transition"
                                    >
                                        <span className="font-medium text-gray-700">{location}</span>
                                    </div>
                                ))}


                            </div>

                            <a
                                href="#"
                                className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                                View countries
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default CompanyHeader
