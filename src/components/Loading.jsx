import React, { useState, useEffect } from "react";
import load from "../assets/load.mp4";

const Loading = () => {
  const tips = [
    "Lorem ipsum dolor sit amet.",
    "Consectetur adipiscing elit.",
    "Sed do eiusmod tempor incididunt.",
    "Ut enim ad minim veniam.",
    "Duis aute irure dolor in reprehenderit.",
    "Excepteur sint occaecat cupidatat non proident.",
    "Sunt in culpa qui officia deserunt mollit anim.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem.",
    "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
  ];

  const [randomTip, setRandomTip] = useState("");

  useEffect(() => {
    // Generate a random tip when the component mounts
    generateRandomTip();
  }, []);

  const generateRandomTip = () => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    const tip = tips[randomIndex];
    setRandomTip(tip);
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#26262e]">
      <video autoPlay loop muted playsInline className="h-[200px] w-[200px]">
        <source src={load} type="video/mp4" />
      </video>
      <div className="text-[gray]">{randomTip}</div>
    </div>
  );
};

export default Loading;
