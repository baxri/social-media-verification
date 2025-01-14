import { FC } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Header: FC = () => {
  return (
    <header className="w-full p-4 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="text-2xl">
          <span className="font-bold text-purple-600">MEDIA</span>
          <span className="text-gray-500 font-normal">SCAN</span>
        </div>
        <ConnectButton />
      </div>
    </header>
  );
};

export default Header;
