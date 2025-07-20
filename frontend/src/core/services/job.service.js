import axiosClient from '@/core/services/axios-client'

const API_LISTJOB_URL = '/jobs/open'
const API_CREATEJOB_URL = '/jobs'
export const jobApi = {
  listJobs() {
    return axiosClient.get(API_LISTJOB_URL)
  },
   getJobById(id) {
    return axiosClient.get(`/jobs/open/${id}`); 
  },
  createJob(params) {
    return axiosClient.post(API_CREATEJOB_URL, params) 
  },
  deleteJob(id) {
    return axiosClient.delete(`/jobs/${id}`) 
  },
  updateJob(id, params) {
    return axiosClient.put(`/jobs/${id}`, params)
  }
}
