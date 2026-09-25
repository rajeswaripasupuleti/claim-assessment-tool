import { IsNotEmpty, IsString } from 'class-validator';

export class AssessClaimDto {
  @IsString()
  @IsNotEmpty()
  claimId: string;

  @IsString()
  @IsNotEmpty()
  uploadedBy: string;
}