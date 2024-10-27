import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Card,
  CardBody,
  CardHeader,
  Image,
} from "@nextui-org/react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import useSWR from "swr";

import http from "@/http";
import { Course, User } from "@/types";

const ViewCourse = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const { data: course } = useSWR<Course>(`/courses/${courseSlug}/slug`);
  const { data: teacher } = useSWR<User>(
    course ? `/courses/${course.id}/teacher` : null,
  );

  if (!course) return null;

  return (
    <div className="container max-w-5xl">
      <section className="grid grid-cols-12 gap-3">
        <div className="col-span-12 md:col-span-8">
          <div className="grid gap-5">
            <Breadcrumbs>
              <BreadcrumbItem href="/" key={1}>
                Anasayfa
              </BreadcrumbItem>
              <BreadcrumbItem href="/" key={2}>
                Kurslar
              </BreadcrumbItem>
              <BreadcrumbItem key={3}>{course.title}</BreadcrumbItem>
            </Breadcrumbs>

            <h1 className="text-2xl font-bold md:text-5xl">{course.title}</h1>
            <p className="text-lg">{course.description}</p>
            <small>
              Oluşturan: {teacher ? teacher.displayName : "Yükleniyor..."}{" "}
            </small>
            <small>
              Güncellenme: {new Date(course.updatedAt).toLocaleDateString()}
            </small>
          </div>
        </div>

        <div className="col-span-12 md:col-span-4">
          <CourseCard course={course} />
        </div>
      </section>
    </div>
  );
};

export default ViewCourse;

const CourseCard = ({ course }: { course: Course }) => {
  const navigate = useNavigate();

  const banner = course.images[0] || "https://via.placeholder.com/300";
  const { data: me } = useSWR<User>("/auth/me", {
    onError: () => {},
  });

  const handleJoin = async () => {
    try {
      await http.post(`/courses/${course.id}/join`);
      toast.success("Kursa başarıyla kayıt oldunuz.");
    } catch (error) {
      http.handleError(error);
    }
  };

  return (
    <Card
      className="w-full"
      isPressable
      onPress={() => navigate(`/courses/${course.slug}`)}
    >
      <CardHeader className="justify-center bg-content2">
        <Image className="h-56 object-contain" src={banner} />
      </CardHeader>
      <CardBody className="grid gap-2">
        <h3 className="text-lg font-bold">{course.title}</h3>
        {me ? (
          <Button color="primary" onClick={handleJoin}>
            <strong>Kursa Kayıt Ol</strong>
          </Button>
        ) : (
          <>
            <Button color="success">
              <strong>Giriş Yap</strong>
            </Button>
            <p>
              <small>Kayıt olmak için giriş yapmanız gerekmektedir.</small>
            </p>
          </>
        )}
      </CardBody>
    </Card>
  );
};
