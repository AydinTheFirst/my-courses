import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
} from "@nextui-org/react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import useSWR from "swr";

import http from "@/http";
import { Course } from "@/types";
import { sleep } from "@/utils";

const ViewCourse = () => {
  const navigate = useNavigate();

  const { courseId } = useParams<{ courseId: string }>();
  const isNew = courseId === "new";

  const { data: course, isLoading } = useSWR<Course>(
    isNew ? null : `/courses/${courseId}`,
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(
      formData.entries(),
    );

    data.price = parseFloat(data.price as string);
    data.categories = (data.categories as string)
      .split(",")
      .map((c) => c.trim());
    data.keywords = (data.keywords as string).split(",").map((k) => k.trim());

    try {
      await (isNew
        ? http.post("/courses", data)
        : http.patch(`/courses/${courseId}`, data));

      toast.success(
        isNew ? "Course created successfully!" : "Course updated successfully!",
      );
      await sleep(1000);
      navigate("/dashboard/courses");
    } catch (error) {
      http.handleError(error);
    }
  };

  const handleDelete = async () => {
    try {
      await http.delete(`/courses/${courseId}`);
      navigate("/dashboard/courses");
      toast.success("Course deleted successfully!");
    } catch (error) {
      http.handleError(error);
    }
  };

  if (isLoading) return "Yükleniyor...";

  return (
    <section className="grid gap-5">
      <Card>
        <CardHeader>
          <h3 className="text-2xl font-semibold">
            {isNew ? "Yeni Kurs Oluştur" : `Kursu Düzenle: ${course?.title}`}
          </h3>
        </CardHeader>
        <CardBody>
          <form className="grid grid-cols-12 gap-3" onSubmit={handleSubmit}>
            <Input
              className="col-span-12"
              defaultValue={course ? course.title : ""}
              label="Başlık"
              name="title"
              required
            />

            <Textarea
              className="col-span-12"
              defaultValue={course ? course.description : ""}
              label="Açıklama"
              name="description"
              required
            />

            <Input
              className="col-span-12"
              defaultValue={course ? course.categories.join(", ") : ""}
              label="Kategoriler"
              name="categories"
              required
            />

            <Input
              className="col-span-12"
              defaultValue={course ? course.keywords.join(", ") : ""}
              label="Anahtar Kelimeler"
              name="keywords"
              required
            />

            <Input
              className="col-span-12"
              defaultValue={course ? course.price.toString() : ""}
              label="Fiyat"
              name="price"
              required
              type="number"
            />

            <Button
              className="col-span-12"
              color="primary"
              fullWidth
              type="submit"
            >
              {isNew ? "Oluştur" : "Güncelle"}
            </Button>
          </form>
          {!isNew && (
            <div className="mt-3 flex justify-end">
              <Button color="danger" onClick={handleDelete}>
                Sil
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </section>
  );
};

export default ViewCourse;
