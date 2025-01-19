import { FC, useEffect, useState } from "react";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants";
import { SocialAccount } from "./SocialAccounts";
import { useQueryClient } from "@tanstack/react-query";

const AddPost: FC = () => {
  const { address, isConnected } = useAccount();
  const [postHash, setPostHash] = useState<string>("");
  const [isLoader, setIsLoader] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const { writeContract, data } = useWriteContract();
  const { isSuccess, isLoading, error } = useWaitForTransactionReceipt({
    hash: data,
  });

  const { data: socialAccounts } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getUserSocialAccounts",
    args: [address as `0x${string}`],
  });

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({
        queryKey: [
          "readContract",
          {
            address: CONTRACT_ADDRESS,
            functionName: "getUserPosts",
          },
        ],
      });
    }
  }, [isSuccess]);

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: "PostRegistered",
    onLogs: async (logs) => {
      const [log] = logs;

      console.log("log", log);

      const postHash = log?.args?.postHash;
      setPostHash(postHash as string);
      setIsLoader(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const socialAccountValue = formData.get("socialAccount") as string;
    const postUrl = formData.get("postUrl") as string;

    const [platform, username] = socialAccountValue.split(":");

    console.log("postUrl", postUrl);
    console.log("platform", platform);

    try {
      setIsLoader(true);
      setPostHash("");
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "registerPost",
        args: [postUrl, platform],
      });
      form.reset();
    } catch (error) {
      console.error("Error registering post:", error);
    }
  };

  if (!isConnected) return null;

  return (
    <div>
      {postHash && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          <p>Post registered on blockchain with hash: {postHash}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="socialAccount" className="block text-sm font-medium text-gray-700">
            Select Social Account
          </label>
          <select
            id="socialAccount"
            name="socialAccount"
            required
            className="mt-1 block w-full px-4 py-3 text-base rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {Array.isArray(socialAccounts) &&
              socialAccounts.map((account: SocialAccount, index: number) => (
                <option
                  key={index}
                  value={`${account.platform}:${account.username}`}
                >
                  {account.username} ({account.platform})
                </option>
              ))}
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="postUrl" className="block text-sm font-medium text-gray-700">
            Post URL
          </label>
          <input
            type="url"
            id="postUrl"
            name="postUrl"
            required
            placeholder="https://"
            className="mt-1 block w-full px-4 py-3 text-base rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <button
          disabled={isLoader}
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoader ? "Adding..." : "Add Post"}
        </button>
      </form>
    </div>
  );
};

export default AddPost;
