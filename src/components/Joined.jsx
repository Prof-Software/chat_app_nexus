import { useState, useEffect } from "react";
import { client, urlFor } from "../client";

function Joined({ serverRef, page, setPage }) {
  const [serverData, setServerData] = useState(null);

  useEffect(() => {
    client
      .fetch(
        `*[_id == $serverId][0]{
          name,
          _id,
          icon {
            asset->{url}
          }
        }`,
        { serverId: serverRef._ref }
      )
      .then((data) => {
        setServerData(data);
      })
      .catch((error) => {
        console.error("Error fetching server data:", error);
      });
  }, [serverRef]);
  if (!serverData) {
    return null;
  }

  return (
    <div
      className={`flex items-center justify-center w-full my-2 cursor-pointer`}
      onClick={() => {
        setPage(serverData?._id);
      }}
    >
      <img
        className={`w-[48px] h-[45.800px] object-cover ${
          page === serverData?._id ? "rounded" : "rounded-full"
        } hover:rounded transition-all`}
        src={urlFor(serverData.icon.asset.url).height(150).width(150).url()}
        alt={`${serverData.name} icon`}
      />
    </div>
  );
}

export default Joined;
