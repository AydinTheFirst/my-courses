import { Injectable, NestMiddleware } from "@nestjs/common";
import { Handler } from "express";

import { PrismaService } from "@/prisma";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use: Handler = async (req, _res, next) => {
    let token = req.headers["authorization"];

    if (!token) return next();

    if (token.startsWith("Bearer ")) token = token.slice(7, token.length);

    const tokenDoc = await this.prisma.token.findFirst({
      where: { token },
    });

    if (!tokenDoc) return next();
    if (tokenDoc.expiresAt.getTime() < Date.now()) return next();

    const user = await this.prisma.user.findFirst({
      where: {
        id: tokenDoc.userId,
      },
    });

    if (!user) return next();

    if (!tokenDoc.userAgent) {
      await this.prisma.token.update({
        data: {
          userAgent: req.headers["user-agent"],
        },
        where: { id: tokenDoc.id },
      });
    }

    req.user = user;

    next();
  };

  constructor(private prisma: PrismaService) {}
}
