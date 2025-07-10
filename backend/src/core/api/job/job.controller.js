import { ValidHttpResponse } from '../../../packages/handler/response/validHttp.response';
import { JobPostingsService } from 'core/modules/job/service/job.service';
import { CreateJobPostingDto, UpdateJobPostingDto } from 'core/modules/job/dto/jobPosting.dto';
class Controller {
    constructor() {
        this.service = JobPostingsService;
    }

    findById = async req => {
        const data = await this.service.getJobDetailsById(req.params.id);
        return ValidHttpResponse.toOkResponse(data);
    }

    createOne = async req => {
        const data = await this.service.createOne(CreateJobPostingDto(req.body));
        return ValidHttpResponse.toCreatedResponse(data[0]);
    };
    getListJobOpening = async req => {
        const data = await this.service.getListJobOpening();
        return ValidHttpResponse.toOkResponse(data);
    };
    updateOne = async req => {
        const data = await this.service.updateOne(req.params.id, UpdateJobPostingDto(req.body));
        return ValidHttpResponse.toOkResponse(data);
    };
    deleteOne = async req => {
        const data = await this.service.deleteOne(req.params.id);
        return ValidHttpResponse.toOkResponse(data);
    };
}

export const JobController = new Controller();
