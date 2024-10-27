import { Divider, Link } from "@nextui-org/react";
import { LucideHeart } from "lucide-react";

export const Footer = () => {
  return (
    <>
      <Divider className="my-5" />
      <footer className="bg-content1 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 p-3">
          <p>© {new Date().getFullYear()} Kurslar. All rights reserved.</p>
          <h6 className="flex items-center gap-1">
            Made with <LucideHeart fill="red" size={16} /> by
            <Link
              color="foreground"
              href="https://github.com/AydinTheFirst"
              isExternal
            >
              AydinTheFirst
            </Link>
          </h6>
        </div>
      </footer>
    </>
  );
};
