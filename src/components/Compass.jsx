import { useState, useEffect } from "react";
import { client } from "../client";
import header from '../assets/compass.svg'
import ServerCard from "./ServerCard";
const Compass = ({ user }) => {
  const [servers, setServers] = useState([]);

  useEffect(() => {
    client.fetch('*[_type == "server"]').then((data) => {
      setServers(data);
    });
  }, []);

  return (
    <div className="w-full overflow-auto">
      <div className="relative w-[full] mt-8 flex items-center justify-center">
        <img src={header} className="w-[96%]" alt="" />
        <div className="absolute top-[29%] right-[29%] gap-3 flex items-start justify-center flex-col text-center">
            <h1 className="text-2xl w-full items-start justify-center font-sans font-bold text-center">Find your community on Nexus</h1>
            <p className="flex items-center justify-center text-center w-full">From gaming, to music, to learning, there's a place for you</p>
            <input className="p-2 text-black w-[509px] outline-none border-[3px] bg-white focus:border-[3px] focus:border-[#8cf7ff] border-[#fff] rounded-sm" placeholder="Explore communities" type="text" name="" id="" />
        </div>
      </div>
      <h1 className="my-3 text-lg ml-6">Featured Communites</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-6 mt-5">
        {/* Create a server card for each server in the array */}
        {servers.map((server) => (
          <ServerCard key={server._id} server={server} />
        ))}
      </div>
      <div className="w-full h-[30px]"></div>
    </div>
  );
};

export default Compass;
