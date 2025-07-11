import { ApiDocument } from 'core/config/swagger.config';
import { SwaggerDocument } from 'packages/swagger';

ApiDocument.addModel('UpdateCandidateStatusDto', {
    status: SwaggerDocument.ApiProperty({ 
        type: 'string', 
        enum: ['Interview', 'In-Review', 'Hired', 'Rejected'],
        description: 'New status for the candidate'
    }),
});

export const UpdateCandidateStatusDto = body => ({
    status: body.status,
});