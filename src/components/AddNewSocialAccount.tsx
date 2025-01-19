import { FC, useEffect, useState } from "react";
import {
  useWriteContract,
  useWatchContractEvent,
  useAccount,
  useReadContract,
} from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants";
import axios from "axios";

const AddNewSocialAccount: FC = () => {
  const { writeContract, error } = useWriteContract();
  const { address, isConnected } = useAccount();

  const { data: socialAccounts } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getUserSocialAccounts",
    args: [address as `0x${string}`],
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (error) {
      setIsLoading(false);
    }
  }, [error]);

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: "VerificationInitiated",
    onLogs: async (logs) => {
      const [log] = logs;

      const requestId = log?.args?.requestId;

      console.log("requestId", requestId);

      if (requestId) {
        const response = await axios.post("/api/initialize", {
          requestId,
          address: address,
          username: log?.args?.username,
          platform: log?.args?.platform,
        });

        console.log("response", response);

        if (response.data.redirect) {
          window.location.href = response.data.redirect;
        }

        setIsLoading(false);
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    const username = formData.get("username") as string;
    const platform = formData.get("platform") as string;

    try {
      setIsLoading(true);
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "initiateVerification",
        args: [username, platform],
      });
      form.reset();
    } catch (error) {
      console.error("ERROR:", error);
      setIsLoading(false);
    }
  };

  if (!isConnected) return null;

  return (
    <div >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            required
            className="mt-1 block w-full px-4 py-3 text-base rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
            Platform
          </label>
          <select
            id="platform"
            name="platform"
            required
            className="mt-1 block w-full px-4 py-3 text-base rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {["instagram"].map((platform) => (
              <option
                key={platform}
                value={platform}
                className="capitalize"
              >
                {platform}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Adding..." : "Add Social Account"}
        </button>
      </form>
    </div>
  );
};

export default AddNewSocialAccount;
