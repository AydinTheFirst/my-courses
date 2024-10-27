import { Tab, Tabs } from "@nextui-org/react";
import { useEffect, useState } from "react";
import useSWR from "swr";

import { Course } from "@/types";

import { CourseCard } from "../_components/CourseCard";

const Courses = () => {
  const [activeTab, setActiveTab] = useState("development");

  const [categories, setCategories] = useState<string[]>([]);

  const { data: courses } = useSWR<Course[]>("/courses");

  useEffect(() => {
    if (!courses) return;

    const categories = courses.reduce<string[]>((acc, course) => {
      course.categories.forEach((categories) => {
        if (!acc.includes(categories)) {
          acc.push(categories);
        }
      });

      return acc;
    }, []);

    setCategories(categories);
  }, [courses]);

  if (!courses) return "Yükleniyor...";

  const filteredCourses = courses.filter((course) =>
    activeTab === "all" ? true : course.categories.includes(activeTab),
  );

  return (
    <section className="grid gap-3">
      <Tabs
        onSelectionChange={(key) => setActiveTab(key.toString())}
        selectedKey={activeTab}
        variant={"underlined"}
      >
        <Tab key="all" title="Tümü" />
        {categories.map((category) => (
          <Tab key={category} title={category} />
        ))}
      </Tabs>
      <div className="grid grid-cols-12 gap-3">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div
              className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
              key={course.id}
            >
              <CourseCard course={course} />
            </div>
          ))
        ) : (
          <div className="col-span-12">
            <p className="text-center">Henüz kurs bulunamadı.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Courses;
