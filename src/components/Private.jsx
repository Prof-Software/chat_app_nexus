import { Divider, Menu, MenuItem } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import {
  AiFillSetting,
  AiOutlineLogout,
  AiOutlinePlus,
  AiOutlineRight,
} from "react-icons/ai";
import { FaUserFriends } from "react-icons/fa";
import Svg from "./Svg";
import { SiGuilded } from "react-icons/si";
import { FaMicrophone } from "react-icons/fa";
import { ImHeadphones } from "react-icons/im";
import EditIcon from "@mui/icons-material/Edit";
import CircleIcon from "@mui/icons-material/Circle";

import moment from "moment";
import { client } from "../client";
const Private = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      const query = `*[_type == "friendRequest" && (sender._ref == "${user?._id}" || receiver._ref == "${user?._id}") && status == "accepted"] {
        _id,
        status,
        sender->{
          _id,
          userName,
          userId,
          image,
        },
        receiver->{
          _id,
          userName,
          userId,
          image,
        }
      }`;
      const acceptedRequests = await client.fetch(query);
      setFriends(acceptedRequests);
    };
    fetchFriends();
  }, [user?._id]);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  console.log(friends);
  const handleClose = () => {
    setAnchorEl(null);
  };
  function handleLogout() {
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  return (
    <div className="w-[240px] bg-[#2b2d31] h-full flex flex-col justify-between">
      <div className="flex flex-col w-[232px]">
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
        <div className="text-[#313338] h-[428px] w-full px-2">
          {friends?.length > 0 ? (
            // Render the list of friends here
            <div className=" w-full text-[gray] hover:text-[white] hover:bg-[#ffffff2d] px-3 p-2 cursor-pointer rounded-md">
              {friends?.map((friend) => (
                <div key={friend._id}>
                  {friend.sender.userId === user?.userId ? (
                    <div className="flex gap-3 items-center">
                      <div className="bg-[#5865f2] text-white w-[30px] h-[30px] flex items-center justify-center rounded-full">
                        <SiGuilded />
                      </div>
                      <p>{friend.receiver.userName}</p>
                    </div>
                  ) : (
                    <div className="flex gap-3 items-center">
                      <div className="bg-[#5865f2] text-white w-[30px] h-[30px] flex items-center justify-center rounded-full">
                        <SiGuilded />
                      </div>
                      <p>{friend.sender.userName}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Render the Svg component here
            <Svg />
          )}
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
                <div className="hover:bg-[rgba(255,255,255,0.1)] cursor-pointer items-center flex justify-between hover:text-[gray] p-1 rounded-md transition-all px-3 text-green-400  my-2">
                  <div className="flex items-center gap-3">
                    <CircleIcon fontSize="15px" />
                    <p className="text-white">Online</p>
                  </div>
                  <AiOutlineRight className="text-white" />
                </div>
                <Divider />
                <div
                  onClick={handleLogout}
                  className="hover:bg-[rgba(255,255,255,0.1)] cursor-pointer items-center flex justify-between p-1 rounded-md transition-all px-3 my-2"
                >
                  <div className="flex items-center gap-3">
                    <AiOutlineLogout fontSize="15px" />
                    <p className="text-white">Logout</p>
                  </div>
                </div>
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
