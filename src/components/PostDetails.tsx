import { FC } from "react";
import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants";

interface PostDetailsProps {
  postHash: string;
}

interface PostVerification {
  isValid: boolean;
  postUrl: string;
  platform: string;
  posterAddress: string;
  timestamp: bigint;
}

const PostDetails: FC<PostDetailsProps> = ({ postHash }) => {
  const { data: postDetails, isError, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "verifyPost",
    args: [postHash as `0x${string}`],
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching post details</div>;
  if (!postDetails) return <div>No post details found</div>;

  const details = postDetails;

  return (
    <div className="post-details">
      <h2>Post Verification Details</h2>
      <div>
        <strong>Verification Status:</strong>{" "}
        <span style={{ color: "green" }}>Verified ✓</span>
      </div>
      <div>
        <strong>Platform:</strong> {details.platform}
      </div>
      <div>
        <strong>Username:</strong> {details.authorUsername}
      </div>
      <div>
        <strong>Post URL:</strong>{" "}
        <a href={details.postUrl} target="_blank" rel="noopener noreferrer">
          {details.postUrl}
        </a>
      </div>
      <div>
        <strong>Posted by:</strong> {details.author}
      </div>
      <div>
        <strong>Timestamp:</strong>{" "}
        {new Date(Number(details.timestamp) * 1000).toLocaleString()}
      </div>
    </div>
  );
};

export default PostDetails;
