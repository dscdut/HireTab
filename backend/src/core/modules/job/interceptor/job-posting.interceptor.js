import Joi from 'joi';
import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';
import { JoiUtils } from '../../../utils';

export const CreateJobPostingInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        userId: JoiUtils.positiveNumber().required(),
        industryId: JoiUtils.positiveNumber().required(),
        title: JoiUtils.requiredString().min(1),
        description: JoiUtils.optionalString(),
        location: JoiUtils.optionalString(),
        descRate: JoiUtils.optionalString(),
        salaryMin: JoiUtils.optionalInteger(),
        salaryMax: JoiUtils.optionalInteger(),
        level: JoiUtils.optionalString(),
        startTime: JoiUtils.requiredDateTime(),
        endTime: JoiUtils.requiredDateTime().greater(Joi.ref('startTime')),
        emoloymentType: JoiUtils.optionalString(),
        requirements: Joi.array().items(Joi.string()).optional(),
        responsibilities: Joi.array().items(Joi.string()).optional(),
        status: JoiUtils.optionalString(),
    }).unknown(true)
);

export const UpdateJobPostingInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        title: JoiUtils.optionalString().min(1),
        description: JoiUtils.optionalString(),
        location: JoiUtils.optionalString(),
        descRate: JoiUtils.optionalString(),
        salaryMin: JoiUtils.optionalInteger(),
        salaryMax: JoiUtils.optionalInteger(),
        level: JoiUtils.optionalString(),
        startTime: Joi.date().iso().optional(),
        endTime: Joi.date().iso().optional(),
        emoloymentType: JoiUtils.optionalString(),
        requirements: Joi.array().items(Joi.string()).optional(),
        responsibilities: Joi.array().items(Joi.string()).optional(),
        status: JoiUtils.optionalString(),
    }).unknown(true)
);

