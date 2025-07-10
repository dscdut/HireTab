import { JobPostingsRepository } from '../job.repository.js';

class JobService {
    constructor() {
        this.repository = JobPostingsRepository;
    }

    async getJobDetailsById(id) {
        const jobDetails = await this.repository.findById(id);
        if (!jobDetails) {
            throw new Error('Job posting not found');
        }
        return jobDetails;
    }

    async createOne(jobPostingData) {
        const jobPosting = await this.repository.create(jobPostingData);
        return jobPosting;
    }
    async getListJobOpening() {
        const jobOpenings = await this.repository.findAll();
        return jobOpenings;
    }
    async updateOne(id, jobPostingData) {
        const updatedJob = await this.repository.update(id, jobPostingData);
        if (!updatedJob || updatedJob.length === 0) {
            throw new Error('Job posting not found or update failed');
        }
        return updatedJob[0];
    }

    async deleteOne(id) {
        const deletedJob = await this.repository.delete(id);
        if (!deletedJob || deletedJob.length === 0) {
            throw new Error('Job posting not found or delete failed');
        }
        return deletedJob[0];
    }
}

export const JobPostingsService = new JobService();