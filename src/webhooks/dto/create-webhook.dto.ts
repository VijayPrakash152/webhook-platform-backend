import {
  IsUrl,
  IsOptional,
  IsArray,
  IsString,
} from 'class-validator';

export class CreateWebhookDto {
  @IsUrl()
  sourceUrl: string;

  @IsUrl()
  callbackUrl: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  eventTypes?: string[];
}
