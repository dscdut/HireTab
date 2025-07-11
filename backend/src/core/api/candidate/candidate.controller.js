import { ValidHttpResponse } from '../../../packages/handler/response/validHttp.response';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'core/common/constants/default-params.constant';
import { PaginationCandidateDto } from 'core/modules/candidate/dto/pagination-candidate.dto';
import { CandidateService } from 'core/modules/candidate/services/candidate.service';
import { CreateCandidateDto, UpdateCandidateStatusDto } from 'core/modules/candidate/dto';
class Controller {
    constructor() {
        this.service = CandidateService;
    }

    getCandidate = async req => {
        const page = req.query.page || DEFAULT_PAGE;
        const size = req.query.size || DEFAULT_PAGE_SIZE;
        const data = await this.service.getPaginationCandidate(
            page,
            size,
        );
        return ValidHttpResponse.toOkResponse(PaginationCandidateDto(data));
    };
    
    findById = async req => {
        const data = await this.service.getCandidateByJobId(req.params.id);
        return ValidHttpResponse.toOkResponse(data);;
    };

    searchCandidate = async req => {
        const page = req.query.page || DEFAULT_PAGE;
        const size = req.query.size || DEFAULT_PAGE_SIZE;
        const keyword = req.query.keyword;
        const data = await this.service.searchCandidate(
            page,
            size,
            keyword,
        );
        return ValidHttpResponse.toOkResponse(PaginationCandidateDto(data));
    };
    createCandidate = async req => {
        const { desc_rate, userId } = req.body;
        const data = await this.service.createCandidate(
            CreateCandidateDto(req.body),
            desc_rate,
            userId
        );
        return ValidHttpResponse.toOkResponse(data[0]);
    };
    
    deleteCandidateById = async req => {
        const data = await this.service.deleteCandidateById(req.params.id);
        return ValidHttpResponse.toOkResponse(data);
    }

    updateCandidateStatus = async req => {
    const data = await this.service.updateCandidateStatus(
        req.params.id, 
        UpdateCandidateStatusDto(req.body).status
    );
        return ValidHttpResponse.toOkResponse(data);
    }
}

export const CandidateController = new Controller();
