import { Upload, FileText, Brain, Plus } from "lucide-react"

export const FileUploadSection = ({ 
    file, 
    fileInputRef, 
    onFileChange, 
    onDrop, 
    onDragOver, 
    isAnalyzing,
    createResumeUrl 
}) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Attach your resume</label>

            {/* Resume Options */}
            <div className="space-y-3 mb-4">
                <div
                    className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all"
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={onFileChange}
                        className="hidden"
                        accept=".pdf"
                        required={!file}
                    />
                    <div className="flex flex-col items-center">
                        {file ? (
                            <>
                                <FileText className="w-8 h-8 text-blue-500 mb-2" />
                                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                <p className="text-xs text-gray-500">PDF • {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </>
                        ) : (
                            <>
                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                <p className="text-sm font-medium text-gray-900 mb-1">Upload Resume/CV</p>
                                <p className="text-xs text-gray-500">Drag and drop or click to upload (PDF only)</p>
                            </>
                        )}
                    </div>
                </div>

                {/* OR Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">OR</span>
                    </div>
                </div>

                {/* Create Resume Link */}
                <a
                    href={createResumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full border-2 border-blue-200 bg-blue-50 rounded-lg p-4 text-center hover:border-blue-300 hover:bg-blue-100 transition-all group"
                >
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-2 group-hover:bg-blue-700 transition-colors">
                            <Plus className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-sm font-medium text-blue-900 mb-1">Create a Resume</p>
                        <p className="text-xs text-blue-700">Build a professional resume from templates</p>
                    </div>
                </a>
            </div>

            {isAnalyzing && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <Brain className="w-6 h-6 text-blue-600 animate-spin" />
                        <div>
                            <p className="text-sm font-medium text-blue-900">Analyzing your CV...</p>
                            <p className="text-xs text-blue-700">Our AI is comparing your resume with the job requirements</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}