import { Module } from 'packages/handler/Module';
import { RecordId } from '../../common/swagger/record-id';
import { RecordIdInterceptor } from 'core/modules/interceptor/recordId/record-id.interceptor';
import { hasHRRole } from 'core/modules/auth/guard';
import { CreateJobPostingInterceptor, UpdateJobPostingInterceptor } from 'core/modules/job/interceptor/job-posting.interceptor';
import { JobController } from './job.controller';

export const JobResolver = Module.builder()
    .addPrefix({
        prefixPath: '/jobs',
        tag: 'jobs',
        module: 'JobModule',
    })
    .register([
        {
            route: '/open/:id',
            method: 'get',
            params: [RecordId],
            interceptors: [RecordIdInterceptor],
            controller: JobController.findById,
        },
        {
            route: '/open',
            method: 'get',
            controller: JobController.getListJobOpening,
        },
        {
            route: '/',
            method: 'post',
            body: 'CreateJobPostingDto',
            guards: [hasHRRole],
            interceptors: [CreateJobPostingInterceptor],
            controller: JobController.createOne,
            preAuthorization: true,
        },
        {
            route: '/:id',
            method: 'put',
            params: [RecordId],
            body: 'UpdateJobPostingDto',
            guards: [hasHRRole],
            interceptors: [RecordIdInterceptor, UpdateJobPostingInterceptor],
            controller: JobController.updateOne,
            preAuthorization: true,
        },
        {
            route: '/:id',
            method: 'delete',
            params: [RecordId],
            guards: [hasHRRole],
            interceptors: [RecordIdInterceptor],
            controller: JobController.deleteJobById, 
            preAuthorization: true,
        },
    ]);
