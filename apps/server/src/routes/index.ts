import { AuthModule } from "./auth/auth.module";
import { CoursesModule } from "./courses/courses.module";
import { LessonsModule } from "./lessons/lessons.module";
import { UsersModule } from "./users/users.module";

export const routes = [AuthModule, CoursesModule, LessonsModule, UsersModule];
