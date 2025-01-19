import { FC, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useWaitForTransactionReceipt, useWriteContract, useAccount, useWatchContractEvent } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants";
import { useQueryClient } from "@tanstack/react-query";
import router from "next/router";
import { useState } from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return <FaInstagram className="text-pink-600" />;
    case 'facebook':
      return <FaFacebook className="text-blue-600" />;
    case 'linkedin':
      return <FaLinkedin className="text-blue-700" />;
    case 'twitter':
      return <FaTwitter className="text-blue-400" />;
    default:
      return null;
  }
};

const Verify: FC = () => {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { address } = useAccount();
  const [tooltipText, setTooltipText] = useState("");

  const { writeContract, data, isPending } = useWriteContract();
  const { isSuccess, isLoading, error } = useWaitForTransactionReceipt({
    hash: data,
  });

  const isLoadingOrPending = isPending || isLoading;

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({
        queryKey: [
          "readContract",
          {
            address: CONTRACT_ADDRESS,  
            functionName: "getUserSocialAccounts",
          },
        ],
      });

      router.push("/dashboard");
    }
  }, [isSuccess]);

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: "VerificationFailed",
    onLogs: async (logs) => {
      console.log("VerificationFailed", logs);
    },
  });

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setTooltipText("Copied!");
    setTimeout(() => setTooltipText(""), 2000);
  };

  const handleVerification = async () => {
    if (isLoadingOrPending) return;
    const signature = searchParams.get("signature");
    const requestId = searchParams.get("requestId");
    const username = searchParams.get("username");
    const platform = searchParams.get("platform");

    console.log('signature', signature);
    console.log('requestId', requestId);
    console.log('username', username);
    console.log('platform', platform);

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "confirmVerification",
        args: [
          requestId as `0x${string}`,
          username!,
          platform!,
          signature as `0x${string}`,
        ],
        // gas: BigInt("44000000"),
      });
    } catch (error) {
      console.error("Error verifying:", error);
    }
  };

  const platform = searchParams.get("platform");

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Verifying Social Account</h2>
        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Wallet Address</span>
              <div className="flex items-center gap-2 text-blue-500">
                <span className="font-mono">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
                <div className="relative group">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor"
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="cursor-pointer text-gray-400 hover:text-gray-600"
                    onClick={() => address && copyToClipboard(address)}
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 transition-opacity ${tooltipText ? 'opacity-100' : 'group-hover:opacity-100'}`}>
                    {tooltipText ? 'Copied!' : 'Copy to clipboard'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Platform</span>
              <div className="flex items-center gap-2">
                <div className="text-xl">
                  {platform && getPlatformIcon(platform)}
                </div>
                <span className="text-gray-800">{platform && platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Username</span>
              <span className="text-gray-800">{searchParams.get("username")}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={handleVerification} 
          disabled={isLoadingOrPending}
          className={`px-6 py-3 rounded-lg font-medium text-white transition-colors
            ${isLoadingOrPending 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          {isLoadingOrPending ? 'Verifying...' : 'Verify Now'}
        </button>
      </div>
    </div>
  );
};

export default Verify;
