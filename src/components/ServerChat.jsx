import React, { useEffect, useRef, useState } from "react";
import { client, urlFor } from "../client";
import { Divider } from "@mui/material";
import { AiOutlinePlus } from "react-icons/ai";
import moment from "moment";

const ServerChat = ({
  page,
  serverData,
  user,
  setServerData,
  currentChannel,
}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [senders, setSenders] = useState({});
  const messagesEndRef = useRef(null);
  const [selectedImages, setSelectedImages] = useState([]);

  const handleImageChange = (event) => {
    const files = event.target.files; // Get the selected files
    const images = Array.from(files); // Convert FileList to array

    setSelectedImages(images);
  };
  const scrollToBottom = () => {
    const parentContainer = messagesEndRef.current?.closest(".overflow-auto");
    const lastChild = parentContainer?.lastElementChild;
    lastChild?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };
  useEffect(() => {
    // if (!spoilerRemoved && !hover) {
    //   scrollToBottom();
    // }
    // setSpoilerRemoved(false);
    // setHover(false);
    scrollToBottom();
  }, [messages]);
  useEffect(() => {
    client
      .fetch(`*[_id == "${page}"][0]`)
      .then((data) => setServerData(data))
      .catch(console.error);
  }, [page]);
  useEffect(() => {
    // Fetch initial server messages
    const fetchServerMessages = async () => {
      try {
        const query = `*[_type == "serverMessage" && server == "${serverData?._id}" && channel == "${currentChannel}"]`;
        const messages = await client.fetch(query);
        setMessages(messages);
      } catch (error) {
        console.error("Failed to fetch server messages:", error);
      }
    };

    fetchServerMessages();

    // Subscribe to real-time updates
    const subscription = client
      .listen(
        `*[_type == "serverMessage" && server == "${serverData?._id}" && channel == "${currentChannel}"]`
      )
      .subscribe((update) => {
        console.log(update);
        if (
          update?.transition === "appear" ||
          update?.transition === "initial"
        ) {
          // A new message has been added or updated
          const newMessage = update?.result;
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        } else if (update?.transition === "disappear") {
          // A message has been deleted
          const deletedMessageId = update?.documentId;
          setMessages((prevMessages) =>
            prevMessages.filter((message) => message?._id !== deletedMessageId)
          );
        }
      });

    // Cleanup the subscription when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, [serverData, currentChannel]);

  useEffect(() => {
    const fetchSenderData = async () => {
      const senderIds = messages.map((message) => message.sender);

      try {
        const query = `*[_type == 'user' && _id in [${senderIds
          .map((id) => `'${id}'`)
          .join(",")}]]`;
        const users = await client.fetch(query);

        const senderData = {};
        users.forEach((user) => {
          senderData[user._id] = {
            userName: user.userName,
            image: user.image,
          };
        });

        setSenders(senderData);
      } catch (error) {
        console.error("Failed to fetch sender data:", error);
      }
    };

    fetchSenderData();
  }, [messages]);

  const filteredMessages = [...messages].sort((a, b) => {
    const dateA = moment(a.timestamp).toDate();
    const dateB = moment(b.timestamp).toDate();
    return dateA - dateB;
  });

  let currentDate = null;

  const handleSendMessage = async () => {
    try {
      const uploadedImages = await Promise.all(
        selectedImages.map((image) =>
          client.assets.upload("image", image, {
            contentType: image.type,
            filename: image.name,
          })
        )
      );
      console.log(uploadedImages);
      const newServerMessage = {
        _type: "serverMessage",
        server: serverData?._id,
        channel: currentChannel,
        sender: user?._id,
        message: message,
        images: uploadedImages.map((image) => ({
          _type: "image",
          asset: {
            _type: "reference",
            _ref: image._id,
          },
        })),
        timestamp: new Date().toISOString(),
      };

      await client.create(newServerMessage);

      setMessage("");
      setSelectedImages([]);
    } catch (error) {
      console.error("Error creating serverMessage:", error);
    }
  };

  return (
    <div className="relative w-full">
      <Divider />
      <div className="h-[92%] flex flex-col w-full overflow-scroll">
        <div className="flex flex-col">
          <div className="ml-5 flex flex-col gap-4 items-center justify-center w-[95%] h-[80vh] text-center">
            <h1 className="text-4xl font-sans font-bold">
              Welcome to <br /> {serverData?.name}
            </h1>
            <p className="text-sm text-[gray]">
              This is your brand new, shiny server. Here are some tips to help{" "}
              <br /> you get started. For more check out our{" "}
              <span className="text-blue-400 hover:underline">
                Getting Started guide
              </span>
            </p>
            <button className="w-[400px] h-[80px] rounded-md bg-[#232428] hover:bg-[#bcbec57c] transition-all duration-300"></button>
            <button className="w-[400px] h-[80px] rounded-md bg-[#232428] hover:bg-[#bcbec57c] transition-all duration-300"></button>
            <button className="w-[400px] h-[80px] rounded-md bg-[#232428] hover:bg-[#bcbec57c] transition-all duration-300"></button>
            <button className="w-[400px] h-[80px] rounded-md bg-[#232428] hover:bg-[#bcbec57c] transition-all duration-300"></button>
          </div>
        </div>
        <div className="flex flex-col" ref={messagesEndRef}>
          {filteredMessages.map((message) => {
            const messageDate = moment(message.timestamp).format("MMM DD");

            const renderDateHeader =
              currentDate !== messageDate ? (
                <div className="w-[98%] my-3 m-auto relative">
                  <div className="absolute h-[10px] bottom-[-18px] w-full">
                    <Divider />
                  </div>
                  <p className="absolute right-[48%] top-[0%] px-3 bg-[#313338] text-[12px] text-[gray]">
                    {messageDate}
                  </p>
                </div>
              ) : null;

            currentDate = messageDate;

            return (
              <React.Fragment key={message._id}>
                {renderDateHeader}
                <div className="flex my-3 ml-5">
                  <div className="h-[40px] gap-3">
                    {senders[message.sender]?.image ? (
                      <img
                        src={urlFor(senders[message.sender]?.image)
                          .width(70)
                          .height(70)}
                        className="h-[40px] w-[40px] rounded-full bg-black"
                        alt="Sender"
                      />
                    ) : (
                      <div
                        className="h-[40px] w-[40px] rounded-full bg-black"
                        alt="Sender"
                      />
                    )}
                  </div>
                  <div className="flex flex-col ml-3">
                    <div className="gap-1 flex items-center">
                      <h4 className="text-[#efefef] text-sm">
                        {senders[message.sender]?.userName}
                      </h4>
                      <span className="text-[12px] text-[gray]">
                        {moment(message.timestamp).format("hh:mm a")}
                      </span>
                    </div>
                    <p className="text-[#d6d6d6] text-sm">{message.message}</p>
                    <div className="flex flex-wrap w-[60%] gap-4 mt-3">

                    {message?.images?.map((image, index) => (
                      <img
                      className="object-cover rounded-md"
                        key={index}
                        src={urlFor(image.asset._ref)}
                        alt={image.alt}
                      />
                    ))}
                    </div>

                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
      <div className="flex absolute bottom-0 left-0 w-full">
        <div className="absolute bottom-0 flex left-0 mb-[80px] mr-[45px] rounded flex-wrap bg-[#00000057] p-2 gap-3 ml-[63px]">
          {selectedImages.map((image, index) => (
            <div key={index} className="flex gap-4">
              <img
                className="h-[160px] rounded-md"
                src={URL.createObjectURL(image)}
                alt={`Image ${index + 1}`}
              />
            </div>
          ))}
        </div>
        <input
          type="text"
          value={message}
          className="w-[90%] mx-auto shadow-md mb-4 bg-[#383a40] pl-12 outline-none p-3 text-lg h-full rounded-md"
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.keyCode === 13) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="Enter your message"
        />
        <div className="ml-[75px] p-1 cursor-pointer absolute top-[20%] bg-[#b5bac1] text-[#383a40] rounded-full">
          <input
            type="file"
            multiple
            name="upload-image"
            className="hidden"
            id="file-input"
            onChange={handleImageChange}
          />
          <label htmlFor="file-input">
            <AiOutlinePlus />
          </label>
        </div>
      </div>
    </div>
  );
};

export default ServerChat;
