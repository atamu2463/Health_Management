import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateOrganizationDto {
  @IsNotEmpty()
  @IsString()
  name!: string;
}
