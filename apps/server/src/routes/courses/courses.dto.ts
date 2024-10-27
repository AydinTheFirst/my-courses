import { IsArray, IsNumber, IsString } from "class-validator";

export class CreateCourseDto {
  @IsArray()
  @IsString({ each: true })
  categories: string[];

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  keywords: string[];

  @IsNumber()
  price: number;

  @IsString()
  title: string;
}

export class UpdateCourseDto extends CreateCourseDto {}
