import axios from 'axios'
import axiosClient from '@/core/services/axios-client'
const API_POSTING_URL = 'https://n8n-hirenova.gdsc.dev/webhook/post-pdf-candidate'

export const candidateApi = {
    listCandidate: id => axiosClient.get(`/candidates/job/${id}`),

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
    updateStatus: (id, status) => axiosClient.patch(`/candidates/${id}/status`, { status }),
}
