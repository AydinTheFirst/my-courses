import {
  Button,
  Link,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Navbar as NextNavbar,
} from "@nextui-org/react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import useSWR from "swr";

import { ThemeToggler } from "@/components";
import { UserDisplay } from "@/components/UserDisplay";
import { User } from "@/types";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const { data: me } = useSWR<User>("/auth/me", {
    onError: () => {},
  });

  const menuItems = [
    {
      href: "/",
      title: "Anasayfa",
    },
    {
      href: "/courses",
      title: "Kurslar",
    },
    {
      href: "/dashboard",
      isAdmin: true,
      title: "Yönetim Paneli",
    },
  ];

  const filteredMenuItems = menuItems.filter((item) => {
    if (item.isAdmin) return me && me.roles.includes("ADMIN");
    return true;
  });

  return (
    <NextNavbar
      className="bg-content1"
      isBordered
      onMenuOpenChange={setIsMenuOpen}
      shouldHideOnScroll
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand as={Link} className="text-foreground" href={"/"}>
          <img alt="logo" className="mx-1 w-8" src="/logo.png" />
          <p className="text-xl font-bold text-inherit">Kurslar</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        {filteredMenuItems.map((item, index) => (
          <NavbarItem isActive={item.href === pathname} key={index}>
            <Link color="foreground" href={item.href}>
              {item.title}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeToggler />
        </NavbarItem>
        {me ? (
          <NavbarItem>
            <UserDisplay />
          </NavbarItem>
        ) : (
          <>
            <NavbarItem className="hidden lg:flex">
              <Link href="/login">
                <strong>Giriş yap</strong>
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" href="/register" variant="flat">
                <strong>Kayıt Ol</strong>
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
      <NavbarMenu>
        {filteredMenuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link className="w-full" href={item.href}>
              {item.title}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </NextNavbar>
  );
};
