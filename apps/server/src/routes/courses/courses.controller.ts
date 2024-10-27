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

import { GetUser, Roles } from "@/common/decorators";
import { AuthGuard } from "@/common/guards";

import { CreateCourseDto, UpdateCourseDto } from "./courses.dto";
import { CoursesService } from "./courses.service";

@Controller("courses")
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(["ADMIN"])
  create(
    @Body() createCourseDto: CreateCourseDto,
    @GetUser("id") userId: string
  ) {
    return this.coursesService.create(createCourseDto, userId);
  }

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(":slug/slug")
  findBySlug(@Param("slug") slug: string) {
    return this.coursesService.findBySlug(slug);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.coursesService.findOne(id);
  }

  @Get(":id/teacher")
  findTeacher(@Param("id") id: string) {
    return this.coursesService.findTeacher(id);
  }

  @Post(":id/join")
  @UseGuards(AuthGuard)
  join(@Param("id") id: string, @GetUser("id") userId: string) {
    return this.coursesService.join(id, userId);
  }

  @Post(":id/leave")
  @UseGuards(AuthGuard)
  leave(@Param("id") id: string, @GetUser("id") userId: string) {
    return this.coursesService.leave(id, userId);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  @Roles(["ADMIN"])
  remove(@Param("id") id: string) {
    return this.coursesService.remove(id);
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  @Roles(["ADMIN"])
  update(@Param("id") id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(id, updateCourseDto);
  }
}
