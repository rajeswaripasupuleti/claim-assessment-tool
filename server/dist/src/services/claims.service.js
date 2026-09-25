"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaimsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const openai_service_1 = require("./openai.service");
const file_parser_1 = require("../utils/file.parser");
let ClaimsService = class ClaimsService {
    prisma;
    openAiService;
    constructor(prisma, openAiService) {
        this.prisma = prisma;
        this.openAiService = openAiService;
    }
    async listClaims() {
        return this.prisma.claim.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async createClaim(dto) {
        return this.prisma.claim.create({
            data: {
                title: dto.title,
                description: dto.description,
                createdBy: dto.createdBy,
            },
        });
    }
    async assessClaim(claimId, uploadedBy, file) {
        const claim = await this.prisma.claim.findUnique({ where: { id: claimId } });
        if (!claim) {
            throw new common_1.NotFoundException(`Claim ${claimId} not found`);
        }
        const { rows, summary } = (0, file_parser_1.parseEvidenceFile)(file.buffer);
        const evidence = await this.prisma.evidence.create({
            data: {
                claimId,
                uploadedBy,
                fileName: file.originalname,
                parsedData: rows,
            },
        });
        const { parsed, raw } = await this.openAiService.assessClaim(claim.description, summary);
        const assessment = await this.prisma.assessment.create({
            data: {
                claimId,
                evidenceId: evidence.id,
                justified: parsed.justified,
                confidenceScore: parsed.confidenceScore,
                reasoning: parsed.reasoning,
                rawModelResponse: raw,
            },
        });
        await this.prisma.claim.update({
            where: { id: claimId },
            data: { status: 'ASSESSED' },
        });
        return assessment;
    }
};
exports.ClaimsService = ClaimsService;
exports.ClaimsService = ClaimsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        openai_service_1.OpenAiService])
], ClaimsService);
//# sourceMappingURL=claims.service.js.map