import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "@/prisma";

import { CreateCourseDto, UpdateCourseDto } from "./courses.dto";

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}
  async create(createCourseDto: CreateCourseDto, userId: string) {
    const course = await this.prisma.course.create({
      data: {
        ...createCourseDto,
        slug: this.createSlug(createCourseDto.title),
        teacherId: userId,
      },
    });

    return course;
  }

  createSlug(title: string) {
    return (
      title
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "") +
      "-" +
      Math.random().toString(36).substring(2, 9)
    );
  }

  async findAll() {
    const courses = await this.prisma.course.findMany();
    return courses;
  }

  async findBySlug(slug: string) {
    const course = await this.prisma.course.findUnique({
      where: {
        slug,
      },
    });

    if (!course) throw new NotFoundException("Course not found");

    return course;
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      include: {
        participants: true,
      },
      where: {
        id,
      },
    });

    if (!course) throw new NotFoundException("Course not found");

    return course;
  }

  async findTeacher(id: string) {
    const course = await this.findOne(id);

    const teacher = await this.prisma.user.findUnique({
      where: {
        id: course.teacherId,
      },
    });

    return {
      displayName: teacher.displayName,
      email: teacher.email,
    };
  }

  async join(id: string, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException("User not found");

    const course = await this.findOne(id);

    if (course.participants.find((participant) => participant.id === userId)) {
      throw new BadRequestException("User already joined this course");
    }

    if (course.price > user.balance) {
      throw new BadRequestException("Insufficient balance");
    }

    await this.prisma.user.update({
      data: {
        balance: user.balance - course.price,
      },
      where: {
        id: userId,
      },
    });

    await this.prisma.course.update({
      data: {
        participants: {
          connect: {
            id: userId,
          },
        },
      },
      where: {
        id,
      },
    });

    if (!course) throw new NotFoundException("Course not found");

    return course;
  }

  async leave(id: string, userId: string) {
    const course = await this.findOne(id);

    if (!course.participants.find((participant) => participant.id === userId)) {
      throw new BadRequestException("User not joined this course");
    }

    await this.prisma.course.update({
      data: {
        participants: {
          disconnect: {
            id: userId,
          },
        },
      },
      where: {
        id,
      },
    });

    return course;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.course.delete({
      where: {
        id,
      },
    });

    return true;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const existingCourse = await this.findOne(id);

    // if title is updated, update slug
    const slug =
      updateCourseDto.title === existingCourse.title
        ? existingCourse.slug
        : this.createSlug(updateCourseDto.title);

    const course = await this.prisma.course.update({
      data: {
        slug,
        ...updateCourseDto,
      },
      where: {
        id,
      },
    });

    return course;
  }
}
