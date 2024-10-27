import { MailerModule } from "@nestjs-modules/mailer";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { ServeStaticModule } from "@nestjs/serve-static";
import { ThrottlerModule } from "@nestjs/throttler";

import { AwsModule } from "@/aws";
import { AuthMiddleware, LoggerMiddleware } from "@/common/middlewares";
import {
  mailerConfig,
  multerConfig,
  serveStaticConfig,
  throttlerConfig,
} from "@/config";
import { NetgsmModule } from "@/netgsm";
import { PrismaModule } from "@/prisma";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
// Routes
import { routes } from "@/routes";
import { WebsocketModule } from "@/websocket";

const { AWS_ACCESS_KEY_ID, MAILER_USER, NETGSM_USERCODE } = process.env;

const configModules = () => {
  const modules = [];
  if (MAILER_USER) modules.push(MailerModule.forRoot(mailerConfig));
  if (NETGSM_USERCODE) modules.push(NetgsmModule);
  if (AWS_ACCESS_KEY_ID) modules.push(AwsModule);
  return modules;
};

@Module({
  controllers: [AppController],
  imports: [
    ...Object.values(routes),
    PrismaModule,
    WebsocketModule,
    ...configModules(),
    ThrottlerModule.forRoot(throttlerConfig),
    ServeStaticModule.forRoot(serveStaticConfig),
    MulterModule.register(multerConfig),
  ],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware, AuthMiddleware).forRoutes("*");
  }
}
