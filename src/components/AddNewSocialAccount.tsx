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

      if (requestId) {
        const response = await axios.post("/api/initialize", {
          requestId,
          address: address,
          username: log?.args?.username,
          platform: log?.args?.platform,
        });

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
      setIsLoading(false); // Reset loading state if user rejects or there's an error
    }
  };

  console.log("socialAccounts", socialAccounts);

  if (!isConnected) return null;

  return (
    <div>
      <h2>Add New Social Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div>
          <label htmlFor="platform">Platform</label>
          <select id="platform" name="platform" required>
            {["instagram", "twitter", "github"].map((platform) => (
              <option
                key={platform}
                value={platform}
              >
                {platform}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Social Account"}
        </button>
      </form>
    </div>
  );
};

export default AddNewSocialAccount;
