import { Outlet } from "react-router-dom";

import { Footer } from "./_components/Footer";
import { Navbar } from "./_components/Navbar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="container min-h-screen px-3 py-10 md:px-6">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
