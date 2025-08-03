import { candidateApi } from '@/core/services/candidate.service'

// API service for managing all candidates
export const manageCandidateApi = {
  // Get all candidates from all job postings
  getAllCandidates: async () => {
      const response = await candidateApi.getAllCandidates()
      return response.data
  },

  bulkUpdateStatus: async (candidateIds, { status, currentStatuses }) => {
      const updatePromises = candidateIds.map(id =>
          candidateApi.updateStatus(id, status)
      )

      await Promise.all(updatePromises)

      return {
          success: true,
          updatedCount: candidateIds.length,
          message: `Successfully updated ${candidateIds.length} candidates to ${status}`,
      }
    }
}

