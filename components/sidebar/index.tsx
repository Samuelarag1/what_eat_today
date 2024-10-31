import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full w-3/4 bg-gray-50 z-40 transform  ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full "
        } transition-transform duration-300 ease-in-out`}
      >
        <button className="absolute top-10 left-4 z-50" onClick={toggleSidebar}>
          {/* <IoMdClose size={30} color="black" /> */}x
        </button>

        <div className="flex flex-col p-8 space-y-6 mt-20">Hola</div>
      </div>
    </>
  );
};

export default Header;
