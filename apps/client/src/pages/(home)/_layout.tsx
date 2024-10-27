import { Outlet } from "react-router-dom";

import { Navbar } from "./_components/Navbar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="container px-3 py-10 md:px-6">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
