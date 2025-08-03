import { ApiDocument } from 'core/config/swagger.config';
import { SwaggerDocument } from 'packages/swagger';

ApiDocument.addModel('CandidateDto', {
    id: SwaggerDocument.ApiProperty({ type: 'integer' }),
    name: SwaggerDocument.ApiProperty({ type: 'string' }),
    summary: SwaggerDocument.ApiProperty({ type: 'string', required: false }),
    experiences: SwaggerDocument.ApiProperty({ type: 'string', required: false }),
    education: SwaggerDocument.ApiProperty({ type: 'string', required: false }),
    score: SwaggerDocument.ApiProperty({ type: 'integer', required: false }),
    email: SwaggerDocument.ApiProperty({ type: 'string', required: false }),
    phone: SwaggerDocument.ApiProperty({ type: 'string', required: false }),
    certifications: SwaggerDocument.ApiProperty({ type: 'string', required: false }),
    resumeFile: SwaggerDocument.ApiProperty({ type: 'string', required: false }),
    coverLetter: SwaggerDocument.ApiProperty({ type: 'string', required: false }),
    status: SwaggerDocument.ApiProperty({ type: 'string', enum: ['Interview', 'In-Review', 'Hired', 'Rejected'] }),
    jobPostingName: SwaggerDocument.ApiProperty({ type: 'string' }),
    createdAt: SwaggerDocument.ApiProperty({ type: 'string', format: 'date-time' }),
});


export const CandidateDto = body => ({
    id: body.id,
    name: body.name,
    summary: body.summary || null,
    experiences: body.experiences || null,
    education: body.education || null,
    score: body.score || null,
    certifications: body.certifications || null,
    resumeFile: body.resumeFile || null,
    coverLetter: body.coverLetter || null,
    status: body.status,
    email: body.email || null,
    phone: body.phone || null,
    jobPostingName: body.jobPostingName,
    createdAt: body.createdAt,
});
