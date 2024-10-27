import {
  getKeyValue,
  Input,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { LucideSearch } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";

import { Course } from "@/types";

const ViewCourses = () => {
  const navigate = useNavigate();

  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const { data: courses } = useSWR<Course[]>("/courses");

  useEffect(() => {
    if (!courses) return;
    setFilteredCourses(courses);
  }, [courses]);

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    if (!courses) return;

    const filtered = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(value) ||
        course.description.toLowerCase().includes(value),
    );

    setFilteredCourses(filtered);
  };

  const handleSort = (type: string) => {
    switch (type) {
      case "date:asc":
        setFilteredCourses(
          [...filteredCourses].sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          ),
        );
        break;

      case "date:desc":
        setFilteredCourses(
          [...filteredCourses].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          ),
        );
        break;

      case "title:asc":
        setFilteredCourses(
          [...filteredCourses].sort((a, b) => a.title.localeCompare(b.title)),
        );
        break;

      case "title:desc":
        setFilteredCourses(
          [...filteredCourses].sort((a, b) => b.title.localeCompare(a.title)),
        );
        break;

      default:
        break;
    }
  };

  const columns = [
    { key: "title", label: "Title" },
    { key: "price", label: "Price" },
    { key: "slug", label: "Slug" },
    { key: "createdAt", label: "Created At" },
  ];

  const rows = filteredCourses.map((course) => {
    return {
      createdAt: new Date(course.createdAt).toLocaleDateString(),
      key: course.id,
      price: course.price.toLocaleString("tr-TR", {
        currency: "TRY",
        style: "currency",
      }),
      slug: course.slug,
      title: course.title,
    };
  });

  const handleRowAction = (key: React.Key) => {
    navigate(`/dashboard/courses/${key}`);
  };

  if (!courses) return "Loading...";

  return (
    <section className="grid gap-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="flex items-end justify-start gap-3">
          <h2 className="text-2xl font-bold">Kurslar</h2>
          <span className="text-sm text-gray-500">
            ({filteredCourses.length}/{courses?.length})
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Input
            className="max-w-xs"
            endContent={<LucideSearch />}
            label="Ara"
            onChange={handleFilter}
            placeholder="Kullanıcı ara..."
            variant="faded"
          />
          <Select
            className="max-w-xs"
            label="Sırala"
            onSelectionChange={(keys) =>
              handleSort(Array.from(keys)[0].toString())
            }
            placeholder="Sırala"
            variant="faded"
          >
            <SelectItem key="date:asc">Tarihe Göre (Eskiden Yeniye)</SelectItem>
            <SelectItem key="date:desc">
              Tarihe Göre (Yeniden Eskiye)
            </SelectItem>
            <SelectItem key="name:asc">İsme Göre (A-Z)</SelectItem>
            <SelectItem key="name:desc">İsme Göre (Z-A)</SelectItem>
            <SelectItem key="email:asc">E-Postaya Göre (A-Z)</SelectItem>
            <SelectItem key="email:desc">E-Postaya Göre (Z-A)</SelectItem>
          </Select>
        </div>
      </div>

      <Table
        aria-label="Example table with dynamic content"
        isStriped
        onRowAction={handleRowAction}
        selectionMode="single"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={rows}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
};

export default ViewCourses;
