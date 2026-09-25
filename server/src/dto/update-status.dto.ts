import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateStatusDto {
  @IsString()
  @IsIn(['PROPOSED', 'UNDER_EVALUATION', 'ASSESSED'])
  @IsNotEmpty()
  status: string;
}