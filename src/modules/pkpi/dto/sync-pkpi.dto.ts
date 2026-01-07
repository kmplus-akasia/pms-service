import { IsNumber, IsOptional, IsArray, IsString } from 'class-validator';

export class SyncPkpiDto {
  @IsNumber()
  year: number;

  @IsString()
  periode: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  group_ids?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  regional_ids?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subholding_ids?: string[];
}
