import React, { useState } from "react";
import { SiGuilded } from "react-icons/si";
import { AiFillCompass, AiOutlinePlus } from "react-icons/ai";
import Divider from "@mui/material/Divider";
import { motion } from "framer-motion";
import Joined from "./Joined";

const Sidebar = ({ servers, page, setPage, user }) => {
  return (
    <div className="h-full flex flex-col w-[72px] bg-[#1e1f22]">
      <button
        onClick={() => {
          setPage("home");
        }}
        className="px-3 my-3 flex items-center justify-center relative w-[72px]"
      >
        <div
          className={`${
            page === "home" ? "bg-[#5865f2]" : "bg-[#393a3d]"
          } flex items-center transition-all duration-75 justify-center p-[0.65rem] ${
            page === "home" ? "rounded-xl" : "rounded-full"
          } hover:bg-[#5865f2] page:bg-[#4b59c6]`}
        >
          <SiGuilded fontSize={25} />
        </div>
        {page === "home" && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-0 bottom-0 w-[7px] bg-transparent border-r-4 border-l-white transform origin-right rounded-md"
          ></motion.div>
        )}
      </button>
      {user.joinedServers &&
        user.joinedServers.map((serverRef) => {
          return <Joined page={page} setPage={setPage} key={serverRef?._key} serverRef={serverRef} />;
        })}
      <div className="w-[50%] mx-auto h-[1.4px] bg-[#393a3d]" />
      <button
        onClick={() => {
          setPage("add");
        }}
        className="px-3 my-2 flex items-center justify-center relative w-[72px]"
      >
        <div
          className={`${
            page === "add"
              ? "bg-[#23a559] text-white"
              : "bg-[#393a3d] text-[#23a559]"
          } flex items-center transition-all duration-75 justify-center p-[0.65rem] ${
            page === "add" ? "rounded-xl" : "rounded-full"
          } hover:bg-[#23a559] hover:text-white page:bg-[#23a559]`}
        >
          <AiOutlinePlus fontSize={25} />
        </div>
        {page === "add" && (
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
          setPage("compass");
        }}
        className="px-3 my-2 flex items-center justify-center relative w-[72px]"
      >
        <div
          className={`${
            page === "compass"
              ? "bg-[#23a559] text-white"
              : "bg-[#393a3d] text-[#23a559]"
          } flex items-center transition-all duration-75 justify-center p-[0.65rem] ${
            page === "compass" ? "rounded-xl" : "rounded-full"
          } hover:bg-[#23a559] hover:text-white page:bg-[#23a559]`}
        >
          <AiFillCompass fontSize={25} />
        </div>
        {page === "compass" && (
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
