import { FC } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";

const Header: FC = () => {
  const { isConnected } = useAccount();
  const router = useRouter();

  return (
    <header className="w-full p-4 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div 
          className="text-2xl cursor-pointer" 
          onClick={() => router.push("/")}
        >
          <span className="font-bold text-purple-600">MEDIA</span>
          <span className="text-gray-500 font-normal">SCAN</span>
        </div>
        <div className="flex items-center gap-4">
          <ConnectButton />
          {isConnected && (
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 text-sm font-medium text-[#6984aa] hover:text-[#3498db] border border-[#6984aa] rounded-lg transition-colors hover:border-[#3498db]"
            >
              Dashboard
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
