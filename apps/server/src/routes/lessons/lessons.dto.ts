import { IsString } from "class-validator";

export class CreateLessonDto {
  @IsString()
  content: string;

  @IsString()
  courseId: string;

  @IsString()
  title: string;
}

export class UpdateLessonDto extends CreateLessonDto {}
