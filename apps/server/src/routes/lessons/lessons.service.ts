import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "@/prisma";

import { CreateLessonDto, UpdateLessonDto } from "./lessons.dto";

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}
  async create(createLessonDto: CreateLessonDto) {
    const lesson = await this.prisma.lesson.create({
      data: {
        ...createLessonDto,
      },
    });

    return lesson;
  }

  async findAll() {
    const lessons = await this.prisma.lesson.findMany();
    return lessons;
  }

  async findOne(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: {
        id,
      },
    });

    if (!lesson) throw new NotFoundException("Lesson not found");

    return lesson;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.lesson.delete({
      where: {
        id,
      },
    });

    return true;
  }

  async update(id: string, updateLessonDto: UpdateLessonDto) {
    await this.findOne(id);

    const lesson = await this.prisma.lesson.update({
      data: {
        ...updateLessonDto,
      },
      where: {
        id,
      },
    });

    return lesson;
  }
}
