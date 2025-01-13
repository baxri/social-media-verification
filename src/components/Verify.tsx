import { FC, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants";
import { useQueryClient } from "@tanstack/react-query";
import router from "next/router";

const Verify: FC = () => {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

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

      router.push("/");
    }
  }, [isSuccess]);

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
      });
    } catch (error) {
      console.error("Error verifying:", error);
    }
  };

  return (
    <div>
      <h2>Verifying Social Account</h2>
      <p>Please wait while we verify your social account...</p>
      <button onClick={handleVerification} disabled={isLoadingOrPending}>
        Verify Now
      </button>
    </div>
  );
};

export default Verify;
