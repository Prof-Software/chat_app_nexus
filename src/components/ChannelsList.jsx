import { useState, useEffect } from "react";
import { client } from "../client";
import { Divider } from "@mui/material";

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
    <div>
      {channelData?.map((channel) => (
        <div key={channel?._id} className="w-full">
          <button onClick={()=>{setCurrentChannel(channel?._id)}} className="w-full h-[48px] flex items-center justify-between px-5">
            {channel.name}
          </button>
          <Divider />
        </div>
      ))}
    </div>
  );
}
export default ChannelsList;
