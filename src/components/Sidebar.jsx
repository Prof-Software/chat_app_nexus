import React, { useState } from "react";
import { SiGuilded } from "react-icons/si";
import { AiFillCompass, AiOutlinePlus } from "react-icons/ai";
import Divider from "@mui/material/Divider";
import { motion } from "framer-motion";

const Sidebar = ({ servers }) => {
  const [active, setActive] = useState("");
  return (
    <div className="h-full flex flex-col w-[72px] bg-[#1e1f22]">
      <button
        onClick={() => {
          setActive("home");
        }}
        className="px-3 my-3 flex items-center justify-center relative w-[72px]"
      >
        <div
          className={`${
            active === "home" ? "bg-[#5865f2]" : "bg-[#393a3d]"
          } flex items-center transition-all duration-75 justify-center p-[0.65rem] ${
            active === "home" ? "rounded-xl" : "rounded-full"
          } hover:bg-[#5865f2] active:bg-[#4b59c6]`}
        >
          <SiGuilded fontSize={25} />
        </div>
        {active === "home" && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-0 bottom-0 w-[7px] bg-transparent border-r-4 border-l-white transform origin-right rounded-md"
          ></motion.div>
        )}
      </button>
      <div className="w-[50%] mx-auto rounded-full h-[1.4px] bg-[#393a3d]" />
      <button
        onClick={() => {
          setActive("add");
        }}
        className="px-3 my-2 flex items-center justify-center relative w-[72px]"
      >
        <div
          className={`${
            active === "add" ? "bg-[#23a559] text-white" : "bg-[#393a3d] text-[#23a559]"
          } flex items-center transition-all duration-75 justify-center p-[0.65rem] ${
            active === "add" ? "rounded-xl" : "rounded-full"
          } hover:bg-[#23a559] hover:text-white active:bg-[#23a559]`}
        >
          <AiOutlinePlus fontSize={25} />
        </div>
        {active === "add" && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-0 bottom-0 w-[7px] bg-transparent border-r-4 border-l-white transform origin-right rounded-md"
          ></motion.div>
        )}
      </button>
      <button
        onClick={() => {
          setActive("compass");
        }}
        className="px-3 my-2 flex items-center justify-center relative w-[72px]"
      >
        <div
          className={`${
            active === "compass" ? "bg-[#23a559] text-white" : "bg-[#393a3d] text-[#23a559]"
          } flex items-center transition-all duration-75 justify-center p-[0.65rem] ${
            active === "compass" ? "rounded-xl" : "rounded-full"
          } hover:bg-[#23a559] hover:text-white active:bg-[#23a559]`}
        >
          <AiFillCompass fontSize={25} />
        </div>
        {active === "compass" && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-0 bottom-0 w-[7px] bg-transparent border-r-4 border-l-white transform origin-right rounded-md"
          ></motion.div>
        )}
      </button>
    </div>
  );
};

export default Sidebar;
