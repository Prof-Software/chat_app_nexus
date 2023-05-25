import { useState, useEffect } from "react";
import { client } from "../client";
import { Divider } from "@mui/material";
import Hash from '../assets/Hash'
function ChannelsList({ channels,currentChannel,setCurrentChannel }) {
  const [channelData, setChannelData] = useState([]);

  useEffect(() => {
    async function fetchChannelData() {
      const channelRefs = channels?.map((channel) => channel?._ref);
      const channelData = await client.fetch(`*[_id in $channelRefs]`, {
        channelRefs,
      });
      setChannelData(channelData);
    }
    fetchChannelData();
  }, [channels]);

  return (
    <div className="gap-2">
      {channelData?.map((channel) => (
        <div key={channel?._id} className={`w-[90%] cursor-pointer text-sm ${currentChannel===channel?._id ? "text-white":"text-[#9a9999]"} ${currentChannel!==channel?._id && "hover:bg-[#ffffff08]"} my-2 rounded-md p-2 ${currentChannel===channel?._id && "bg-[#ffffff1d]"} ml-4`}>
          <button onClick={()=>{setCurrentChannel(channel?._id)}} className="flex gap-2 items-center justify-between">
            <Hash/>
            {channel.name}
          </button>
        </div>
      ))}
    </div>
  );
}
export default ChannelsList;
