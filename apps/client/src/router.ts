// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from "@generouted/react-router/client";

export type Path =
  | `/`
  | `/courses`
  | `/courses/:courseSlug`
  | `/dashboard/courses`
  | `/dashboard/courses/:courseId`
  | `/dashboard/users`
  | `/dashboard/users/:userId`
  | `/login`
  | `/register`;

export type Params = {
  "/courses/:courseSlug": { courseSlug: string };
  "/dashboard/courses/:courseId": { courseId: string };
  "/dashboard/users/:userId": { userId: string };
};

export type ModalPath = never;

export const { Link, Navigate } = components<Path, Params>();
export const { useModals, useNavigate, useParams } = hooks<
  Path,
  Params,
  ModalPath
>();
export const { redirect } = utils<Path, Params>();
