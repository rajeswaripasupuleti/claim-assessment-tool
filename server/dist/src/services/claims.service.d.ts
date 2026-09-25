import { PrismaService } from './prisma.service';
import { OpenAiService } from './openai.service';
import { CreateClaimDto } from '../dto/create-claim.dto';
export declare class ClaimsService {
    private readonly prisma;
    private readonly openAiService;
    constructor(prisma: PrismaService, openAiService: OpenAiService);
    listClaims(): Promise<{
        id: string;
        title: string;
        description: string;
        createdBy: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createClaim(dto: CreateClaimDto): Promise<{
        id: string;
        title: string;
        description: string;
        createdBy: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    assessClaim(claimId: string, uploadedBy: string, file: Express.Multer.File): Promise<{
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
