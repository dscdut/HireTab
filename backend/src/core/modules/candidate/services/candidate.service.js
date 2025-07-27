import { CandidateRepository } from "../candidate.repository";
import { CandidateDto } from "../dto/candidate.dto";

class Service {
    constructor() {
        this.repository = CandidateRepository;
    }

    async getPaginationCandidate(page = 1, pageSize = 10) {
            const totalResult = await this.repository.getTotalCount();
            const total = totalResult?.total ? parseInt(totalResult.total, 10) : 0; 
            const data = await this.repository.getPaginationCandidate(page, pageSize);
    
            return {
                content: data.map(e => CandidateDto(e)),
                pageSize,
                total,
            }
    }
    async getCandidateByJobId(id) {
        const candidate = await this.repository.getCandidateByJobId(id);
        if (!candidate) {
            throw new Error('Candidate not found');
        }
        return candidate;
    }

    async searchCandidate(page = 1, size = 10, keyword = '') {
        const totalResult = await this.repository.getSearchTotalCount(keyword);
        const total = totalResult?.total ? parseInt(totalResult.total, 10) : 0;
        const data = await this.repository.searchCandidatesByNameAndJob(page, size, keyword);

        return {
            content: data.map(e => CandidateDto(e)),
            pageSize: size,
            total,
        };
    }
    async createCandidate(candidateForm) { 
        const infCandidate =  await this.repository.createCandidate(candidateForm);
        return infCandidate;
    }

    async deleteCandidateById(id) {
        const candidate = await this.repository.deleteCandidateById(id);
        if (!candidate) {
            throw new Error('Candidate not found');
        }
        return { message: "Delete success" };
    }

    async updateCandidateStatus(id, status) {
        const validStatuses = ['Interview', 'In-Review', 'Hired', 'Rejected'];
        if (!validStatuses.includes(status)) {
            throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
        }

        const statusCandidate = await this.repository.updateCandidateStatus(id, status);
        if (!statusCandidate || statusCandidate.length === 0) {
            throw new Error('Candidate not found or already deleted');
        }
        
        return {
            message: "Status updated successfully",
            candidate: statusCandidate[0]
        };
    }
}

export const CandidateService = new Service();