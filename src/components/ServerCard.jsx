import React from "react";
import { urlFor } from "../client";
const ServerCard = ({ server }) => {
  const { cover, icon, name, description, members } = server;
  console.log(server);
  return (
    <div className="bg-[#232428] relative w-[278px] shadow-black cursor-pointer h-[320px] rounded-md  overflow-hidden transform transition-all hover:shadow-[#2e2b2b] duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="relative">
        <img
          src={urlFor(cover.asset._ref)}
          className="w-full rounded-t-md  h-[143px]"
          alt=""
        />
        <img
          src={urlFor(icon.asset._ref).height(120).width(120)}
          className="rounded-t-md absolute border-[4px] rounded-md top-[83%] left-[7%] border-[#232428] w-[50px] h-[50px]"
          alt=""
        />
      </div>
      <h1 className="text-lg mt-10 ml-5">{name}</h1>
      <p className="text-sm text-[#bbbbbb] ml-5 mr-3">{description}</p>
      <div className="absolute bottom-0 mb-2">
        <div className="text-[12px] flex text-[#adadad] gap-1 ml-5 mr-3">
          {members ? members?.length : "0"}
          
          <p>
          {members?.length > 1 ? "Members" : "member"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServerCard;
