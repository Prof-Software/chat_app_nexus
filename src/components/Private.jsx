import { Divider, Menu, MenuItem } from "@mui/material";
import React, { useRef, useState } from "react";
import { AiFillSetting, AiOutlinePlus } from "react-icons/ai";
import { FaUserFriends } from "react-icons/fa";
import Svg from "./Svg";
import { SiGuilded } from "react-icons/si";
import { FaMicrophone } from "react-icons/fa";
import { ImHeadphones } from "react-icons/im";
import EditIcon from "@mui/icons-material/Edit";
import CircleIcon from "@mui/icons-material/Circle";

import moment from "moment";
const Private = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
      <div className="bg-[#232428] h-[52px] w-full justify-between py-2 flex">
        <div
          onClick={handleClick}
          className="flex ml-1 hover:bg-[#ffffff0f] cursor-pointer px-2 rounded-lg items-center justify-center"
        >
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
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          sx={{
            position: "absolute",
            top: "-7%",
            borderRadius: "15px",
          }}
        >
          <div className="w-[340px] bg-[#232428] rounded-[15px]">
            <div className="relative">
              <div className="h-[60px] bg-pink-300 w-full"></div>
              {/* {user.image} */}
              <div className="bg-[#5865f2] border-[6px] border-[#232428] absolute top-[10px] left-[20px] w-[90px] h-[90px] my-2 flex items-center justify-center rounded-full">
                <SiGuilded fontSize={40} className="mt-2" />
              </div>
              <button className="absolute top-[11%] right-[4%] bg-[rgba(0,0,0,0.31)] p-1 rounded-full flex items-center justify-center">
                <EditIcon />
              </button>
            </div>
            <div className="mt-11 p-4">
              <div className="h-full w-full bg-[#111214] rounded-lg p-2">
                <div className="my-2">
                  <h1 className="text-xl">{user?.userId}</h1>
                </div>
                <Divider />
                <div className="flex flex-col  my-2">
                  <p className="text-[13px] uppercase font-sans font-bold">
                    Nexus Member Since
                  </p>
                  <p className="text-[13px] text-[#a2a2a2]">
                    {moment(user?._createdAt).format("MMM DD, YYYY")}
                  </p>
                </div>
                <Divider />
                <div className="hover:bg-[rgba(255,255,255,0.1)] hover:text-[gray] p-1 rounded-md transition-all px-3 text-green-400  my-2">
                  <div className="flex items-center gap-3">
                    <CircleIcon fontSize="15px" />
                    <p className="text-white">Online</p>
                  </div>
                </div>
                <Divider/>
              </div>
            </div>
          </div>
        </Menu>
        <div className="flex mr-1 ml-2 gap-3 hover:bg-[#ffffff0f] cursor-pointer px-2 rounded-lg items-center justify-center">
          <div className="flex items-center text-[#838383] justify-center rounded-full">
            <FaMicrophone fontSize={18} />
          </div>
          <div className="flex items-center text-[#838383] justify-center rounded-full">
            <ImHeadphones fontSize={18} />
          </div>
          <div className="flex items-center text-[#838383] justify-center rounded-full">
            <AiFillSetting fontSize={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Private;
