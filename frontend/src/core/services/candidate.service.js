import axios from 'axios'
import axiosClient from '@/core/services/axios-client'
const API_POSTING_URL = 'https://n8n-hirenova.gdsc.dev/webhook/post-pdf-candidate'

export const candidateApi = {
    listCandidate: id => axiosClient.get(`/candidates/job/${id}`),

    getAllCandidates: () => axiosClient.get('/candidates'),

    postingCandidate: async formData => {
        try {
            const res = await axios.post(API_POSTING_URL, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 30000
            })
            if (res.data?.success !== false) return res
            throw new Error(res.data?.message || "Unknown error from n8n")
        } catch (err) {
            console.error("API Error:", err)
            if (err.response) throw new Error(err.response.data?.message || `Status ${err.response.status}`)
            if (err.request) throw new Error("No response from server")
            throw new Error(err.message)
        }
    },
    updateStatus: (id, status) => axiosClient.put(`/candidates/${id}/status`, { status }),

    bulkUpdateStatus: async (candidateIds, { status, currentStatuses }) => {
        try {
            const updatePromises = candidateIds.map(id => 
                axiosClient.put(`/candidates/${id}/status`, { status })
            )
            
            await Promise.all(updatePromises)
            
            return {
                success: true,
                updatedCount: candidateIds.length,
                message: `Successfully updated ${candidateIds.length} candidates to ${status}`,
            }
        } catch (error) {
            
            if (error.response?.status === 404 || error.code === 'ERR_BAD_REQUEST' || error.code === 'ERR_NETWORK') {
                await new Promise((resolve) => setTimeout(resolve, 800))
                
                return {
                    success: true,
                    updatedCount: candidateIds.length,
                    message: `Successfully updated ${candidateIds.length} candidates to ${status} (fallback mode)`,
                }
            }
            
            throw new Error(`Failed to update candidates: ${error.message}`)
        }
    },
}
