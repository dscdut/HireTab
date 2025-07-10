import { ApiDocument } from 'core/config/swagger.config';
import { SwaggerDocument } from 'packages/swagger';

ApiDocument.addModel('CreateJobPostingDto', {
    userId: SwaggerDocument.ApiProperty({ type: 'integer' }),
    industryId: SwaggerDocument.ApiProperty({ type: 'integer' }),
    title: SwaggerDocument.ApiProperty({ type: 'string' }),
    description: SwaggerDocument.ApiProperty({ type: 'string', required: false }),
    location: SwaggerDocument.ApiProperty({ type: 'string', required: false }),
    descRate: SwaggerDocument.ApiProperty({ type: 'string', required: false }),
    salaryMin: SwaggerDocument.ApiProperty({ type: 'integer', required: false }),
    salaryMax: SwaggerDocument.ApiProperty({ type: 'integer', required: false }),
    level: SwaggerDocument.ApiProperty({ type: 'string', required: false }),
    startTime: SwaggerDocument.ApiProperty({ type: 'string', format: 'date-time' }),
    endTime: SwaggerDocument.ApiProperty({ type: 'string', format: 'date-time' }),
    emoloymentType: SwaggerDocument.ApiProperty({ type: 'string', required: false }),
    requirements: SwaggerDocument.ApiProperty({ type: 'array', items: { type: 'string' }, required: false }),
    responsibilities: SwaggerDocument.ApiProperty({ type: 'array', items: { type: 'string' }, required: false }),
    status: SwaggerDocument.ApiProperty({ type: 'string', required: false }),
});

export const CreateJobPostingDto = body => ({
    user_id: body.userId,
    industry_id: body.industryId,
    title: body.title,
    description: body.description || null,
    location: body.location || null,
    desc_rate: body.descRate || null,
    salary_min: body.salaryMin || null,
    salary_max: body.salaryMax || null,
    level: body.level || null,
    start_time: body.startTime,
    end_time: body.endTime,
    emoloyment_type: body.emoloymentType || null,
    requirements: body.requirements ? JSON.stringify(body.requirements) : null,
    responsibilities: body.responsibilities ? JSON.stringify(body.responsibilities) : null,
    status: body.status || null,
});

ApiDocument.addModel('UpdateJobPostingDto', {
    title: SwaggerDocument.ApiProperty({ type: 'string', required: false }),
    description: SwaggerDocument.ApiProperty({ type: 'string', required: false }),
    location: SwaggerDocument.ApiProperty({ type: 'string', required: false }),
    descRate: SwaggerDocument.ApiProperty({ type: 'string', required: false }),
    salaryMin: SwaggerDocument.ApiProperty({ type: 'integer', required: false }),
    salaryMax: SwaggerDocument.ApiProperty({ type: 'integer', required: false }),
    level: SwaggerDocument.ApiProperty({ type: 'string', required: false }),
    startTime: SwaggerDocument.ApiProperty({ type: 'string', format: 'date-time', required: false }),
    endTime: SwaggerDocument.ApiProperty({ type: 'string', format: 'date-time', required: false }),
    emoloymentType: SwaggerDocument.ApiProperty({ type: 'string', required: false }),
    requirements: SwaggerDocument.ApiProperty({ type: 'array', items: { type: 'string' }, required: false }),
    responsibilities: SwaggerDocument.ApiProperty({ type: 'array', items: { type: 'string' }, required: false }),
    status: SwaggerDocument.ApiProperty({ type: 'string', required: false }),
});

export const UpdateJobPostingDto = body => ({
    title: body.title,
    description: body.description,
    location: body.location,
    desc_rate: body.descRate,
    salary_min: body.salaryMin,
    salary_max: body.salaryMax,
    level: body.level,
    start_time: body.startTime,
    end_time: body.endTime,
    emoloyment_type: body.emoloymentType,
    requirements: body.requirements ? JSON.stringify(body.requirements) : null,
    responsibilities: body.responsibilities ? JSON.stringify(body.responsibilities) : null,
    status: body.status,
});