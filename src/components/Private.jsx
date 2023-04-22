import { Divider } from "@mui/material";
import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FaUserFriends } from "react-icons/fa";
import Svg from "./Svg";
import { SiGuilded } from "react-icons/si";

const Private = ({ user }) => {
  return (
    <div className="w-[240px] bg-[#2b2d31] h-full flex flex-col justify-between">
      <div className="flex flex-col">
        <div className="h-[48px] py-3 w-full  flex items-center justify-center">
          <input
            className="bg-[#1e1f22] placeholder:text-sm p-1 px-4 outline-none rounded-md"
            placeholder="find or start a conversation"
            type="text"
            name=""
            id=""
          />
        </div>
        <Divider />
        <div className="mt-2 px-3">
          <button className="bg-[#404249] p-3 rounded-lg gap-3 flex items-center w-full">
            <FaUserFriends fontSize={20} /> Friends
          </button>
        </div>
        <div className="flex justify-between p-3  hover:text-[white] text-[#828282] cursor-default">
          <button className=" flex items-center uppercase  text-[12px] cursor-default">
            Direct Messages
          </button>
          <AiOutlinePlus />
        </div>
        <div className="text-[#313338] px-6">
          <Svg />
        </div>
      </div>
      <div className="bg-[#232428] h-[52px] w-full px-4 p-2 flex">
        <div className="flex hover:bg-[#ffffff0f] px-2 rounded-lg items-center justify-center">
          <div className="bg-[#5865f2] w-[30px] h-[30px] my-2 flex items-center justify-center rounded-full">
            <SiGuilded />
          </div>
          <div className="p-2  text-sm">
            <h3>{user?.userName}</h3>
            <p className="text-[13px] text-[#767676]">
              #{user?.userId?.slice(user?.userName.length + 1)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Private;
