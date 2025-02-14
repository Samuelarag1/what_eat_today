"use client";
import React, { useEffect, useState } from "react";
import "../SwitchLang/styles.css";
function SwitchLanguage({
  handleSelectIdiom,
  idiom,
}: {
  handleSelectIdiom: (idiom: string) => void;
  idiom: string;
}) {
  const [isChecked, setIsChecked] = useState(idiom === "en");

  const handleToggle = () => {
    const newIdiom = isChecked ? "es" : "en";
    handleSelectIdiom(newIdiom);
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    setIsChecked(idiom === "en");
  }, [idiom]);

  return (
    <label className="relative inline-flex items-center cursor-pointer ">
      <input
        type="checkbox"
        value=""
        className="sr-only peer"
        checked={isChecked}
        onChange={handleToggle}
      />
      <div className="group peer ring-0 bg-gradient-to-r from-rose-400 to-red-900 rounded-full outline-none duration-700 after:duration-300 w-24 h-12 shadow-md peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-emerald-900 peer-focus:outline-none after:content-[''] after:rounded-full after:absolute after:bg-gray-50 after:outline-none after:h-10 after:w-10 after:top-1 after:left-1 peer-checked:after:translate-x-12 peer-hover:after:scale-95">
        <span
          className={`absolute left-1 top-1 text-white font-semibold text-lg transition-all duration-300 transform ${
            isChecked ? "translate-x-0" : "translate-x-12"
          }`}
        >
          {isChecked ? "EN" : "ES"}
        </span>
      </div>
    </label>
  );
}

export default SwitchLanguage;
