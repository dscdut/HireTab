import { CheckCircle, AlertCircle } from "lucide-react"

export const CVAnalysisResult = ({ isAnalyzing, analysisError, matchingResult }) => {
    const getScoreColor = (score) => {
        if (score >= 80) return "text-green-600"
        if (score >= 60) return "text-yellow-600"
        return "text-red-600"
    }

    const getScoreBgColor = (score) => {
        if (score >= 80) return "bg-green-100"
        if (score >= 60) return "bg-yellow-100"
        return "bg-red-100"
    }

    if (isAnalyzing) return null

    if (analysisError && !matchingResult) {
        return (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <h4 className="text-sm font-semibold text-red-600">CV Analysis Failed</h4>
                </div>
                <p className="text-xs text-red-700">{analysisError}</p>
            </div>
        )
    }

    if (matchingResult && !isAnalyzing) {
        return (
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h4 className="text-sm font-semibold text-gray-900">CV Analysis Complete</h4>
                </div>

                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Matching Score</span>
                        <span className={`text-lg font-bold ${getScoreColor(matchingResult.matchingScore)}`}>
                            {matchingResult.matchingScore}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full ${getScoreBgColor(matchingResult.matchingScore)}`}
                            style={{ width: `${matchingResult.matchingScore}%` }}
                        ></div>
                    </div>
                </div>

                {matchingResult.strengths && matchingResult.strengths.length > 0 && (
                    <div className="mb-3">
                        <h5 className="text-xs font-semibold text-green-700 mb-1">STRENGTHS</h5>
                        <ul className="text-xs text-gray-600 space-y-1">
                            {matchingResult.strengths.slice(0, 3).map((strength, index) => (
                                <li key={index} className="flex items-start space-x-1">
                                    <span className="text-green-500 mt-0.5">•</span>
                                    <span>{strength}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {matchingResult.gaps && matchingResult.gaps.length > 0 && (
                    <div className="mb-3">
                        <h5 className="text-xs font-semibold text-orange-700 mb-1">AREAS TO IMPROVE</h5>
                        <ul className="text-xs text-gray-600 space-y-1">
                            {matchingResult.gaps.slice(0, 2).map((gap, index) => (
                                <li key={index} className="flex items-start space-x-1">
                                    <span className="text-orange-500 mt-0.5">•</span>
                                    <span>{gap}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {matchingResult.overallAssessment && (
                    <div className="text-xs text-gray-600 bg-white p-2 rounded border-l-4 border-blue-400">
                        <span className="font-medium">Assessment: </span>
                        {matchingResult.overallAssessment}
                    </div>
                )}
            </div>
        )
    }

    return null
}