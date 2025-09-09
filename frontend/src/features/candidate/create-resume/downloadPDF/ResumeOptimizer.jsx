import { useState } from "react";
import { Wand2 } from "lucide-react";

const ResumeOptimizer = ({
    currentResumeData,
    optimizedResumeData,
    setOptimizedResumeData,
    isPreviewMode,
    generatePreview,
    isGeneratingPreview,
}) => {
    const [isOptimizing, setIsOptimizing] = useState(false);

    const callGeminiAPI = async (prompt) => {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("Gemini API key not configured");
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 4096,
                    }
                })
            }
        );

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    };

    const optimizeResumeForPageBreaks = async () => {
        setIsOptimizing(true);

        try {
            const prompt = `
You are a professional resume formatter. I need you to optimize this resume data for better page layout and readability.

CURRENT RESUME DATA:
${JSON.stringify(currentResumeData, null, 2)}

OPTIMIZATION REQUIREMENTS:
1. **Content Grouping**: Ensure related content blocks stay together on the same page
2. **Section Priorities**: 
   - Personal info should always be at the top of page 1
   - Experience section is most important - ensure each job entry stays together
   - Education entries should not be split across pages
   - Skills should be grouped logically
   - Projects should be complete on one page if possible

3. **Content Optimization**:
   - Shorten overly long descriptions while maintaining impact
   - Combine similar skills into categories
   - Prioritize most recent and relevant experiences
   - Ensure bullet points are concise but descriptive

4. **Length Management**:
   - Aim for 1-2 pages total
   - If content is too long, prioritize recent experiences (last 10 years)
   - Remove less relevant older experiences if needed
   - Keep education concise unless very recent or highly relevant

FORMATTING RULES:
- Each experience entry must stay together (title, company, dates, description)
- Each education entry must stay together
- Skills categories should not be split
- Project entries should not be split
- Maintain professional language and impact-focused descriptions

Please return the optimized resume data in the exact same JSON structure, with improved content that will fit better on pages without splitting logical blocks.

Return ONLY the JSON data, no additional text or explanations.
`;

            const optimizedData = await callGeminiAPI(prompt);

            try {
                const parsed = JSON.parse(optimizedData.replace(/```json\n?|\n?```/g, '').trim());
                setOptimizedResumeData(parsed);

                // Regenerate preview with optimized data after a short delay
                if (isPreviewMode) {
                    setTimeout(() => {
                        generatePreview();
                    }, 500);
                }

            } catch (parseError) {
                console.error('Error parsing Gemini response:', parseError);
                throw new Error('Failed to parse optimized resume data');
            }

        } catch (error) {
            console.error('Error optimizing resume:', error);
            alert('Failed to optimize resume. Please try again or check your API configuration.');
        } finally {
            setIsOptimizing(false);
        }
    };

    const resetToOriginal = () => {
        setOptimizedResumeData(null);
        // Regenerate preview with original data if in preview mode
        if (isPreviewMode) {
            setTimeout(() => {
                generatePreview();
            }, 300);
        }
    };

    return (
        <div className="flex items-center gap-3">
            {/* AI Optimization Button */}
            <button
                onClick={optimizeResumeForPageBreaks}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 text-sm font-medium shadow-md"
                disabled={isOptimizing || isGeneratingPreview}
            >
                {isOptimizing ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Optimizing...
                    </>
                ) : (
                    <>
                        <Wand2 className="w-4 h-4" />
                        AI Optimize
                    </>
                )}
            </button>

            {/* Reset to Original Button */}
            {optimizedResumeData && (
                <button
                    onClick={resetToOriginal}
                    className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 text-sm font-medium"
                >
                    Reset
                </button>
            )}
        </div>
    );
};

export default ResumeOptimizer;