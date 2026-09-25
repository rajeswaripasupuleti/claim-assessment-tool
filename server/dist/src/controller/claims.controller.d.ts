import { ClaimsService } from '../services/claims.service';
import { AssessClaimDto } from '../dto/assess-claim.dto';
import { CreateClaimDto } from '../dto/create-claim.dto';
export declare class ClaimsController {
    private readonly claimsService;
    constructor(claimsService: ClaimsService);
    findAll(): Promise<{
        id: string;
        title: string;
        description: string;
        createdBy: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    create(dto: CreateClaimDto): Promise<{
        id: string;
        title: string;
        description: string;
        createdBy: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    assess(dto: AssessClaimDto, file: Express.Multer.File): Promise<{
        id: string;
        createdAt: Date;
        claimId: string;
        justified: boolean;
        confidenceScore: number;
        reasoning: string;
        rawModelResponse: import("@prisma/client/runtime/library").JsonValue;
        evidenceId: string;
    }>;
}
