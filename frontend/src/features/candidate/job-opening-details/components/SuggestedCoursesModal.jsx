import React from 'react';
import { X, BookOpen, Tag, TrendingUp, ExternalLink, DollarSign } from "lucide-react";

const SuggestedCoursesModal = ({ isOpen, onClose, suggestionSkills, loading }) => {
    if (!isOpen) return null;

    const calculateDiscount = (regular, sale) => {
        if (!regular || !sale) return 0;
        return Math.round(((regular - sale) / regular) * 100);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl relative z-10 max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Suggested Courses</h1>
                        <p className="text-slate-600">Recommended courses to enhance your skills</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 transition-colors rounded-full hover:bg-gray-100"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex items-center justify-center h-40">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-slate-600">Loading suggested courses...</p>
                            </div>
                        </div>
                    ) : suggestionSkills.length === 0 ? (
                        <div className="text-center py-12">
                            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-slate-600 text-lg">No suggested courses found.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {suggestionSkills.map((course) => (
                                <div
                                    key={course.id}
                                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-blue-200 hover:-translate-y-1"
                                >
                                    {/* Course Image */}
                                    <div className="relative">
                                        <img
                                            src={course.image}
                                            alt={course.title}
                                            className="w-full h-48 object-cover"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/400x200/6366f1/ffffff?text=Course+Image'
                                            }}
                                        />
                                        {course.regular_price && course.sale_price && course.regular_price !== course.sale_price && (
                                            <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                {calculateDiscount(course.regular_price, course.sale_price)}% OFF
                                            </div>
                                        )}

                                        {/* Course ID Badge */}
                                        <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium">
                                            ID: {course.id}
                                        </div>
                                    </div>

                                    {/* Course Content */}
                                    <div className="p-5">
                                        {/* Title */}
                                        <h3 className="text-lg font-bold text-slate-800 mb-3 leading-tight min-h-[3.5rem]">
                                            {course.title}
                                        </h3>

                                        {/* Category */}
                                        <div className="mb-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Tag className="w-4 h-4 text-slate-500" />
                                                <span className="text-xs font-medium text-slate-600">Category</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-slate-600 px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                                                    {course.category?.name || 'General'}
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    (ID: {course.category?.id || 'N/A'})
                                                </span>
                                            </div>
                                        </div>

                                        {/* Level */}
                                        <div className="mb-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <TrendingUp className="w-4 h-4 text-slate-500" />
                                                <span className="text-xs font-medium text-slate-600">Level</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-slate-600 px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                                                    {course.level?.name || 'Beginner'}
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    (ID: {course.level?.id || 'N/A'})
                                                </span>
                                            </div>
                                        </div>

                                        {/* Price Section */}
                                        <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-medium text-slate-600">Price</span>
                                                <DollarSign className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl font-bold text-green-600">
                                                    ${course.sale_price || course.regular_price || 0}
                                                </span>
                                                {course.regular_price && course.sale_price && course.regular_price !== course.sale_price && (
                                                    <span className="text-sm text-slate-400 line-through">
                                                        ${course.regular_price}
                                                    </span>
                                                )}
                                            </div>
                                            {course.regular_price && course.sale_price && course.regular_price !== course.sale_price && (
                                                <div className="mt-1">
                                                    <span className="text-xs text-green-700 font-medium">
                                                        You save: ${course.regular_price - course.sale_price}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Course Link Preview */}
                                        <div className="mb-4 p-2 bg-gray-50 rounded border">
                                            <p className="text-xs text-slate-500 font-medium mb-1">Course URL:</p>
                                            <p className="text-xs text-slate-600 break-all leading-relaxed">
                                                {course.link}
                                            </p>
                                        </div>

                                        {/* Action Button */}
                                        <a
                                            href={course.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm shadow-lg hover:shadow-xl"
                                        >
                                            <BookOpen className="w-4 h-4" />
                                            Enroll Now
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                            Found {suggestionSkills.length} suggested course{suggestionSkills.length !== 1 ? 's' : ''}
                        </p>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>

            {/* CSS Styles - Removed line-clamp for full title display */}
            <style jsx>{`
                /* No line-clamp needed for full display */
            `}</style>
        </div>
    );
};

export default SuggestedCoursesModal;