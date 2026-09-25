import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { OpenAiService } from './openai.service';
import { parseEvidenceFile } from '../utils/file.parser';
import { CreateClaimDto } from '../dto/create-claim.dto';

@Injectable()
export class ClaimsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly openAiService: OpenAiService,
  ) {}

  async listClaims() {
    return this.prisma.claim.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createClaim(dto: CreateClaimDto) {
    return this.prisma.claim.create({
      data: {
        title: dto.title,
        description: dto.description,
        createdBy: dto.createdBy,
      },
    });
  }

  async updateStatus(claimId: string, status: string) {
    const claim = await this.prisma.claim.findUnique({ where: { id: claimId } });
    if (!claim) {
      throw new NotFoundException(`Claim ${claimId} not found`);
    }

    return this.prisma.claim.update({
      where: { id: claimId },
      data: { status },
    });
  }

  async assessClaim(claimId: string, uploadedBy: string, file: Express.Multer.File) {
    const claim = await this.prisma.claim.findUnique({ where: { id: claimId } });
    if (!claim) {
      throw new NotFoundException(`Claim ${claimId} not found`);
    }

    const { rows, summary } = parseEvidenceFile(file.buffer);

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
        rawModelResponse: raw as any,
      },
    });

    await this.prisma.claim.update({
      where: { id: claimId },
      data: { status: 'ASSESSED' },
    });

    return assessment;
  }
}