import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";

import { Roles } from "@/common/decorators";
import { AuthGuard } from "@/common/guards";

import { CreateLessonDto, UpdateLessonDto } from "./lessons.dto";
import { LessonsService } from "./lessons.service";

@Controller("lessons")
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(["ADMIN"])
  create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.create(createLessonDto);
  }

  @Get()
  findAll() {
    return this.lessonsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.lessonsService.findOne(id);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  @Roles(["ADMIN"])
  remove(@Param("id") id: string) {
    return this.lessonsService.remove(id);
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  @Roles(["ADMIN"])
  update(@Param("id") id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonsService.update(id, updateLessonDto);
  }
}
