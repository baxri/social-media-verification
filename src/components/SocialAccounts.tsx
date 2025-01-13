import { FC } from "react";
import { useAccount, useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants"; // Assuming these exist

export interface SocialAccount {
  username: string;
  platform: string;
}

const SocialAccounts: FC = () => {
  const { address, isConnected } = useAccount();

  const { data: socialAccounts, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getUserSocialAccounts",
    args: [address as `0x${string}`],
  });

  if (!isConnected) return null;

  if (isLoading) {
    return (
      <div>List is loading...</div>
    );
  }

  return (
    <div>
      <h2>Social Accounts</h2>
      {Array.isArray(socialAccounts) && socialAccounts.length > 0 ? (
        <ul>
          {socialAccounts.map((account, index: number) => (
            <li key={index}>
              {account.username} / {account.platform}
            </li>
          ))}
        </ul>
      ) : (
        <p>No social accounts found</p>
      )}
    </div>
  );
};

export default SocialAccounts;
