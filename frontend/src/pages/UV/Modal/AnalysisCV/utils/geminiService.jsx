import { toast } from "react-hot-toast"

export const analyzeWithGemini = async (base64PdfData, jobDescription) => {
    const toastId = toast.loading("Analyzing matching score...")
    
    try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY
        if (!apiKey) {
            throw new Error("Gemini API key not found")
        }

        const prompt = `
        Analyze the matching between this CV/Resume and job description. Provide a detailed analysis in JSON format.

        Job Description:
        ${jobDescription}

        Please analyze the uploaded PDF CV and provide analysis in this exact JSON format:
        {
            "matchingScore": number (0-100),
            "strengths": ["strength1", "strength2", "strength3"],
            "gaps": ["gap1", "gap2", "gap3"],
            "recommendations": ["recommendation1", "recommendation2"],
            "overallAssessment": "brief overall assessment"
        }
        
        Focus on:
        1. Technical skills alignment
        2. Experience relevance
        3. Education background
        4. Overall fit for the role
        `

        // Retry logic for 503 errors
        const maxRetries = 3
        let attempt = 1
        
        while (attempt <= maxRetries) {
            try {
                const response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, 
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            contents: [{
                                parts: [
                                    {
                                        text: prompt
                                    },
                                    {
                                        inline_data: {
                                            mime_type: "application/pdf",
                                            data: base64PdfData
                                        }
                                    }
                                ]
                            }]
                        })
                    }
                )
                console.log(response)
                if (!response.ok) {
                    if (response.status === 503 && attempt < maxRetries) {
                        console.log(`Attempt ${attempt} failed with 503, retrying...`)
                        await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
                        attempt++
                        continue
                    }
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const data = await response.json()
                
                if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
                    throw new Error("Invalid response structure from Gemini API")
                }

                const generatedText = data.candidates[0].content.parts[0].text
                
                // Extract JSON from response
                const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
                if (jsonMatch) {
                    const analysisResult = JSON.parse(jsonMatch[0])
                    toast.success("Matching score analysis completed!", { id: toastId })
                    return analysisResult
                } else {
                    throw new Error("Could not parse analysis result")
                }
                
            } catch (error) {
                console.error(`Attempt ${attempt} failed:`, error)
                if (attempt === maxRetries) {
                    throw error
                }
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
                attempt++
            }
        }
    } catch (error) {
        console.error("Error analyzing with Gemini:", error)
        toast.error("Failed to analyze matching score.", { id: toastId })
        throw error
    }
}