import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Image,
} from "@nextui-org/react";
import { LucideStar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";

import { Course, User } from "@/types";

export const CourseCard = ({ course }: { course: Course }) => {
  const navigate = useNavigate();

  const { data: teacher } = useSWR<User>(`/courses/${course.id}/teacher`);
  const banner = course.images[0] || "https://placehold.co/400";

  if (!teacher) return "Yükleniyor...";

  const rating = Math.floor(Math.random() * 5) + 1;
  const voterCount = Math.floor(Math.random() * 100) + 1;

  return (
    <Card isPressable onPress={() => navigate(`/courses/${course.slug}`)}>
      <CardHeader className="justify-center bg-content2">
        <Image className="h-56 object-contain" src={banner} />
      </CardHeader>
      <CardBody className="grid gap-2">
        <h3 className="text-lg font-semibold">{course.title}</h3>
        <p className="text-sm text-gray-500">{teacher.displayName}</p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: rating }).map((_, index) => (
              <LucideStar fill="#facc15" key={index} size={16} />
            ))}
            {Array.from({ length: 5 - rating }).map((_, index) => (
              <LucideStar className="text-gray-500" key={index} size={16} />
            ))}
          </div>
          <small>({voterCount})</small> // random oylama sayısı
        </div>
        <h4
          className={`text-2xl font-bold ${
            course.price === 0 ? "text-green-500" : "text-primary"
          }`}
        >
          {course.price === 0 ? "Ücretsiz" : `${course.price.toFixed(2)}₺`}
        </h4>
      </CardBody>
      <CardFooter className="flex flex-wrap gap-1">
        {course.keywords.map((keyword) => (
          <Chip color="primary" key={keyword} size="sm">
            <strong>{keyword}</strong>
          </Chip>
        ))}
      </CardFooter>
    </Card>
  );
};
