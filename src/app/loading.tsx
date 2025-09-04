import React from "react";

const Loader = () => {
  return (
    <div className="w-full min-h-screen h-dvh flex flex-col items-center justify-center bg-white backdrop-blur-md fixed inset-0 z-[9999]">
      <div className="loader"></div>
    </div>
  );
};

export default Loader;
