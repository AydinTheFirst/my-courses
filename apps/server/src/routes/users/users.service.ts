import { Injectable, NotFoundException } from "@nestjs/common";
import argon2 from "argon2";

import { PrismaService } from "@/prisma";

import { CreateUserDto, UpdateUserDto } from "./users.dto";

@Injectable()
export class UsersService {
  create = async (createUserDto: CreateUserDto) => {
    const user = await this.prisma.user.create({
      data: createUserDto,
    });

    return user;
  };
  findAll = async () => {
    const users = await this.prisma.user.findMany();
    return users;
  };

  findOne = async (id: string) => {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    return user;
  };

  remove = async (id: string) => {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) throw new NotFoundException("User not found");

    await this.prisma.user.delete({
      where: {
        id: id,
      },
    });

    return user;
  };

  update = async (id: string, updateUserDto: UpdateUserDto) => {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) throw new NotFoundException("User not found");

    if (updateUserDto.password && updateUserDto.password.length > 0) {
      updateUserDto.password = await argon2.hash(updateUserDto.password);
    } else {
      delete updateUserDto.password;
    }

    await this.prisma.user.update({
      data: updateUserDto,
      where: {
        id: id,
      },
    });

    return user;
  };

  constructor(private prisma: PrismaService) {}
}
