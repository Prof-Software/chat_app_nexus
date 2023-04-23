import React, { useState } from "react";
import { Divider } from "@mui/material";
import { FaUserFriends } from "react-icons/fa";
import { IoMdHelpCircle } from "react-icons/io";
import { RiChatNewFill, RiChatNewLine } from "react-icons/ri";
import { MdAllInbox, MdInbox } from "react-icons/md";

const MainChat = () => {
  const [active, setActive] = useState("");
  const [frndreq, setFrndreq] = useState("");
  return (
    <div className="w-full">
      <div className="h-[48px] p-3 flex items-center justify-between">
        <div className="flex items-center">
          <button className="flex px-2 items-center gap-2 cursor-default border-r border-r-[#555555]">
            <FaUserFriends fontSize={20} className="text-[gray]" />
            Friends
          </button>
          <button
            onClick={() => {
              setActive("online");
            }}
            className={`flex ${
              active === "online" && "bg-[#ffffff20] text-white rounded-md"
            } hover:bg-[#ffffff0d] px-2 text-[#828282] items-center gap-2 mx-3`}
          >
            Online
          </button>
          <button
            onClick={() => {
              setActive("All");
            }}
            className={`flex ${
              active === "All" && "bg-[#ffffff20] text-white rounded-md"
            } hover:bg-[#ffffff0d] px-2 text-[#828282] items-center gap-2 mx-3`}
          >
            All
          </button>
          <button
            onClick={() => {
              setActive("pending");
            }}
            className={`flex ${
              active === "pending" && "bg-[#ffffff20] text-white rounded-md"
            } hover:bg-[#ffffff0d] px-2 text-[#828282] items-center gap-2 mx-3`}
          >
            Pending
          </button>
          <button
            onClick={() => {
              setActive("Blocked");
            }}
            className={`flex ${
              active === "Blocked" && "bg-[#ffffff20] text-white rounded-md"
            } hover:bg-[#ffffff0d] px-2 text-[#828282] items-center gap-2 mx-3`}
          >
            Blocked
          </button>
          <button
            onClick={() => {
              setActive("add");
            }}
            className={`flex ${
              active === "add"
                ? "bg-[#2f3136] text-[#34aa5f] rounded-md"
                : "text-[white]"
            } px-2 bg-[#248046] rounded-md  items-center gap-2 mx-3`}
          >
            Add Friend
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-[#a2a2a2] px-3 border-r border-r-[#555555]">
            <RiChatNewFill fontSize={25} />
          </button>
          <button className="text-[#a2a2a2]">
            <MdInbox fontSize={25} />
          </button>
          <button className="text-[#349f5c]">
            <IoMdHelpCircle fontSize={25} />
          </button>
        </div>
      </div>
      <Divider />
      <div className="w-full h-full flex">
        <div className="flex flex-col w-[70%]">
          <div className="w-full p-6">
            <h1 className="text-base uppercase">Add Friend</h1>
            <p className="text-sm mt-2 text-[#959595]">
              You can add a friend by their Nexus Tag. Its Case Sensitive
            </p>
            <div className="relative">
              <input
                value={frndreq}
                onChange={(e) => {
                  setFrndreq(e.target.value);
                }}
                className="w-[90%] focus:shadow placeholder:font-sans focus:shadow-blue-400 outline-none my-2 bg-[#1e1f22] p-3 rounded-md"
                placeholder="Enter a Username#0000"
                type="text"
                name=""
                id=""
              />
              <button
                className={`text-[13px] px-4 outline-none ${
                  !frndreq && "opacity-40"
                } absolute top-[22%] right-[12%] bg-[#5865f2] p-[0.47rem] rounded-md`}
              >
                Send Friend Request
              </button>
            </div>
          </div>
          <Divider />
          <div></div>
        </div>
        <div className="w-[30%] flex flex-col  p-3 border-l border-l-[rgb(255,255,255,0.12)]">
          <h1 className="text-lg font-sans font-bold text-[#f3f3f3]">
            Active Now
          </h1>
          <div className="w-full text-center mt-6">
            <h3 className="text-base">It's quiet for now...</h3>
            <p className="text-sm text-[#979797]">
              When a friend starts an activity-like playing a game or hanging
              out on voice-we'll show it here!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainChat;
