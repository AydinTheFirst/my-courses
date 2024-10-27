import { Tab, Tabs } from "@nextui-org/react";
import { useEffect, useState } from "react";
import useSWR from "swr";

import { Course } from "@/types";

import { CourseCard } from "./_components/CourseCard";

const Index = () => {
  return (
    <section className="grid gap-10">
      <ImagesSlider />
      <Hero />
      <FeaturedCourses />
    </section>
  );
};

export default Index;

const Hero = () => {
  return (
    <div className="grid gap-3">
      <h1 className="text-5xl font-bold">
        İhtiyacınız olan tüm yetkinlikler tek bir yerde
      </h1>
      <p className="text-lg">
        Kritik yetkinliklerden teknik konulara kadar çeşitli alanları kapsayan
        Kurslarımız, profesyonel gelişiminizi destekler.
      </p>
    </div>
  );
};

const ImagesSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "/slides/slide-1.jpg",
    },
    {
      image: "/slides/slide-2.jpeg",
    },
    {
      image: "/slides/slide-3.jpg",
    },
  ];

  const images = slides.map((slide) => slide.image);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide, images.length]);

  return (
    <div className="relative h-[50vh] overflow-hidden rounded bg-content3 md:bg-[75vh]">
      <img
        alt="slide"
        className="absolute inset-0 h-full w-full object-contain" // absolute ile kapsayıcıya göre yerleştirdik
        src={images[currentSlide]}
      />
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform space-x-2">
        {images.map((_, index) => (
          <div
            className={`h-3 w-10 rounded-full bg-white ${
              index === currentSlide ? "bg-gray-500" : ""
            }`}
            key={index}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

// Öne çıkan kurslar
const FeaturedCourses = () => {
  const [activeTab, setActiveTab] = useState("development");

  const { data: courses } = useSWR<Course[]>("/courses");

  if (!courses) return "Yükleniyor...";

  const filteredCourses = courses.filter((course) =>
    course.categories.includes(activeTab),
  );

  return (
    <section className="grid gap-3">
      <Tabs
        onSelectionChange={(key) => setActiveTab(key.toString())}
        selectedKey={activeTab}
        variant={"underlined"}
      >
        <Tab key="Yazılım" title="Yazılım" />
        <Tab key="ai" title="Yapay Zeka" />
        <Tab key="cultural" title="Genel Kültür" />
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
