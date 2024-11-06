"use client";
import Image from "next/image";
import { useState } from "react";
import "./styles.css";
import { useLanguage } from "../../context/LanguageContext";
import SwitchLanguage from "../SwitchLang";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { handleSelectIdiom, idiom } = useLanguage();
  const { language } = useLanguage();
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="bg-black w-96 h-20 bg-opacity-50 rounded-full mt-5 flex items-center justify-around shadow-black shadow-lg">
        <div>
          <Image
            src="/icon.png"
            width={50}
            height={50}
            alt="icon"
            style={{ objectFit: "contain" }}
          />
        </div>
        <h1 className="text-white font-primary text-xl text-shadow">
          {language.pages.header.title}
        </h1>

        <div className="w-fit">
          <label className="hamburger">
            <input type="checkbox" checked={isOpen} onChange={toggleSidebar} />
            <svg viewBox="0 0 32 32">
              <path
                className="line line-top-bottom"
                d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
              ></path>
              <path className="line" d="M7 16 27 16"></path>
            </svg>
          </label>
        </div>

        <aside
          className={`sidebar z-50 ${
            isOpen ? "open" : ""
          } flex flex-col items-center`}
        >
          <p className="text-xl font-bold m-2">
            {language.pages.header.switch}
          </p>

          <div>
            <SwitchLanguage
              handleSelectIdiom={handleSelectIdiom}
              idiom={idiom}
            />{" "}
          </div>
        </aside>

        {isOpen && <div className="backdrop" onClick={toggleSidebar}></div>}
      </div>
    </>
  );
};
