import Joi from 'joi';
import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';

export const UpdateCandidateStatusInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        status: Joi.string()
            .valid('Interview', 'In-Review', 'Hired', 'Rejected')
            .required()
            .messages({
                'any.only': 'Status must be one of: Interview, In-Review, Hired, Rejected',
                'any.required': 'Status is required'
            })
    }).unknown(true)
);