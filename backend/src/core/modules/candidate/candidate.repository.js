import { DataRepository } from 'packages/restBuilder/core/dataHandler';

class Repository extends DataRepository {
    constructor(tableName) {
        super(tableName);
    }
    getPaginationCandidate(page, size) {
        const offset = (page - 1) * size;
        return this.query()
            .innerJoin('job_postings', 'job_postings.id', 'candidates.job_posting_id')
            .select(
                'candidates.id',
                'candidates.name',
                'candidates.summary',
                'candidates.experiences',
                'candidates.education',
                'candidates.certifications',
                'candidates.score',
                'candidates.resume_file as resumeFile',
                'candidates.cover_letter as coverLetter',
                'candidates.status',
                'candidates.email',
                'candidates.phone',
                'job_postings.title as jobPostingName',
                'candidates.created_at as createdAt',
                'candidates.updated_at as updatedAt'
            )
            .whereNull('candidates.deleted_at')
            .limit(size)
            .offset(offset);
    }

    getTotalCount() {
        return this.query()
            .whereNull('deleted_at')
            .count('id as total')
            .first()
            .then(result => {
                return result || { total: 0 };
            });
    }

    searchCandidatesByNameAndJob(page, size, keyword) {
        const offset = (page - 1) * size;
        return this.query()
            .innerJoin('job_postings', 'job_postings.id', 'candidates.job_posting_id')
            .select(
                'candidates.id',
                'candidates.name',
                'candidates.summary',
                'candidates.experiences',
                'candidates.education',
                'candidates.certifications',
                'candidates.resume_file as resumeFile',
                'candidates.cover_letter as coverLetter',
                'candidates.status',
                'candidates.score',
                'job_postings.title as jobPostingName',
                'candidates.created_at as createdAt',
                'candidates.updated_at as updatedAt'
            )
            .whereNull('candidates.deleted_at')
            .andWhere(function () {
                this.where('candidates.name', 'ilike', `%${keyword}%`) // Tìm kiếm theo tên ứng viên
                    .orWhere('job_postings.title', 'ilike', `%${keyword}%`); // Tìm kiếm theo tên công việc
            })
            .limit(size)
            .offset(offset);
    }

    getSearchTotalCount(keyword) {
        return this.query()
            .innerJoin('job_postings', 'job_postings.id', 'candidates.job_posting_id')
            .whereNull('candidates.deleted_at')
            .andWhere(function () {
                this.where('candidates.name', 'ilike', `%${keyword}%`)
                    .orWhere('job_postings.title', 'ilike', `%${keyword}%`);
            })
            .count('candidates.id as total')
            .first();
    }
    createCandidate(candidateData) {
        console.log('candidateForm', candidateData);
        return this.query().insert(candidateData)
            .returning([
                'id',
                'user_id as userId',
                'name',
                'email',
                'phone',
                'note',
                'summary',
                'experiences',
                'education',
                'candidates.score',
                'certifications',
                'resume_file as resumeFile',
                'cover_letter as coverLatter',
                'status',
                'industry_id as industryId',
                'job_posting_id as jobPostingId',
            ]);
    }

    getCandidateByJobId(jobPostingId) {
        return this.query()
            .innerJoin('job_postings', 'job_postings.id', 'candidates.job_posting_id') // Join với bảng job_postings
            .select(
                'candidates.id',
                'candidates.name',
                'candidates.email',
                'candidates.phone',
                'candidates.note',
                'candidates.summary',
                'candidates.experiences',
                'candidates.education',
                'candidates.score',
                'candidates.certifications',
                'candidates.resume_file as resumeFile',
                'candidates.cover_letter as coverLatter',
                'candidates.status',
                'job_postings.title as jobPostingName',
                'candidates.created_at as createdAt',
            )
            .where('candidates.job_posting_id', jobPostingId)
            .whereNull('candidates.deleted_at')
    }
    deleteCandidateById(id) {
        return this.query()
            .where('id', id)
            .del();
    }
    updateCandidateStatus(id, status) {
        return this.query()
            .where('id', id)
            .whereNull('deleted_at')
            .update({
                status: status,
                updated_at: new Date()
            })
            .returning([
                'id',
                'name',
                'email',
                'status',
                'updated_at as updatedAt'
            ]);
    }

    getSuggestionSkillsByCandidateId(candidateId) {
        if (!candidateId) return Promise.resolve([]);
        return this.query()
            .leftJoin('suggestion_skills', 'suggestion_skills.candidate_id', 'candidates.id')
            .select(
                'suggestion_skills.id as id',
                'suggestion_skills.candidate_id as candidateId',
                'suggestion_skills.categories',
                'suggestion_skills.level',
                'suggestion_skills.keywords',
                'suggestion_skills.created_at as createdAt'
            )
            .where('candidates.id', candidateId)
            .whereNull('candidates.deleted_at')
            .orderBy('suggestion_skills.id', 'asc');
    }
}

export const CandidateRepository = new Repository('candidates');