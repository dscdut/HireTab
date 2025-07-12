import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';

class JobRepository extends DataRepository {
    findById(id) {
        return this.query()
            .innerJoin('users', 'users.id', 'job_postings.user_id')
            .innerJoin('industries', 'industries.id', 'job_postings.industry_id')
            .where('job_postings.id', '=', id)
            .select(
                'job_postings.id',
                'job_postings.title',
                'job_postings.description',
                'job_postings.location',
                'job_postings.employment_type as employmentType',
                'job_postings.requirements',
                'job_postings.responsibilities',
                'job_postings.desc_rate as descRate',
                'job_postings.salary_min as salaryMin',
                'job_postings.salary_max as salaryMax',
                'job_postings.status',
                'job_postings.level',
                { industryName: 'industries.name' },
            )
            .first();
    }

    create(jobPostingData) {
        return this.query().insert(jobPostingData)
            .returning([
                'title',
                'description',
                'location',
                'employment_type as employmentType',
                'requirements',
                'responsibilities',
                'desc_rate as descRate',
                'salary_min as salaryMin',
                'salary_max as salaryMax',
                'level',
                'start_time as startTime',
                'end_time as endTime',
            ]);
    }

    findAll(filters = {}) {
        const query = this.query()
            .innerJoin('industries', 'industries.id', 'job_postings.industry_id')
            .whereNull('job_postings.deleted_at')
            .select(
                'job_postings.id',
                'job_postings.title',
                'job_postings.status',
                'job_postings.description',
                'job_postings.location',
                'job_postings.employment_type as employmentType',
                'job_postings.level',
                'industries.name as industryName',
            );

        if (filters.status) {
            query.where('job_postings.status', filters.status);
        }

        return query;
    }

    update(id, jobPostingData) {
        return this.query()
            .where('id', id)
            .update({
                ...jobPostingData,
                updated_at: new Date()
            })
            .returning([
                'title',
                'description',
                'location',
                'employment_type as employmentType',
                'requirements',
                'responsibilities',
                'desc_rate as descRate',
                'salary_min as salaryMin',
                'salary_max as salaryMax',
                'status',
                'level',
                'start_time as startTime',
                'end_time as endTime',
            ]);
    }
    delete(id) {
        return this.query()
            .where('id', id)
            .update({
                deleted_at: new Date(),
                updated_at: new Date()
            })
            .returning([
                'id',
                'title',
                'deleted_at as deletedAt'
            ]);
    }
    deleteById(id) {
        return this.query()
            .where('id', id)
            .del();
    }
}

export const JobPostingsRepository = new JobRepository('job_postings');
