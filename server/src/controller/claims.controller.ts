import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClaimsService } from '../services/claims.service';
import { AssessClaimDto } from '../dto/assess-claim.dto';
import { CreateClaimDto } from '../dto/create-claim.dto';
import { UpdateStatusDto } from '../dto/update-status.dto';

@Controller('api/claims')
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @Get()
  async findAll() {
    return this.claimsService.listClaims();
  }

  @Post()
  async create(@Body() dto: CreateClaimDto) {
    return this.claimsService.createClaim(dto);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.claimsService.updateStatus(id, dto.status);
  }

  @Post('assess')
  @UseInterceptors(FileInterceptor('file'))
  async assess(
    @Body() dto: AssessClaimDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Evidence file is required');
    }

    return this.claimsService.assessClaim(dto.claimId, dto.uploadedBy, file);
  }
}