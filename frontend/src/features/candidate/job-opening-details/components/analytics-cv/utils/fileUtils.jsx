import { toast } from "react-hot-toast"

export const validatePdfFile = async (file) => {
    // Basic file type check
    if (file.type !== "application/pdf") {
        return {
            isValid: false,
            error: "Please upload only PDF files"
        }
    }

    // File size check (30MB limit)
    if (file.size > 30 * 1024 * 1024) {
        return {
            isValid: false,
            error: "File size must be less than 30MB"
        }
    }

    // Basic file header check for PDF
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = function(e) {
            const arr = new Uint8Array(e.target.result).subarray(0, 4)
            const header = Array.from(arr).map(byte => byte.toString(16)).join('')
            
            // PDF files start with %PDF which is 25504446 in hex
            if (header.startsWith('25504446')) {
                resolve({
                    isValid: true,
                    error: null
                })
            } else {
                resolve({
                    isValid: false,
                    error: "Invalid PDF file format"
                })
            }
        }
        reader.onerror = () => {
            resolve({
                isValid: false,
                error: "Failed to read file"
            })
        }
        reader.readAsArrayBuffer(file.slice(0, 4))
    })
}

export const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
            // Remove the data URL prefix (data:application/pdf;base64,)
            const base64 = reader.result.split(',')[1]
            resolve(base64)
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}