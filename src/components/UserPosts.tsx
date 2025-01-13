import { FC, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants";

//0xba7fe6199415f993c1d1c5173fcee602bac7237201b1cf10841a7329260eb14f
//0x88cc3adcbc9f29776173751421c6981379e3b8b3f6dd53b34c0822d0bc166dee
//0xcda17e457b63825a70cb9f72fe9c2f0c085b0d817243e0aff03cdb09e2c4a455




const UserPosts: FC = () => {
  const { address, isConnected } = useAccount();

  const { data: posts } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getUserPosts",
    args: [address as `0x${string}`],
  });

  if (!isConnected) return null;

  console.log('posts', posts);

  return (
    <div>
      <h2>Your Posts</h2>
      {posts?.length === 0 ? (
        <p>No posts found</p>
      ) : (
        <ul>
          {posts?.map((post, index) => (
            <li key={index}>
              <a href={post.postUrl} target="_blank" rel="noopener noreferrer">
                <strong>{post.platform} Post</strong>
              </a>
              <span> - Posted on {new Date(Number(post.timestamp) * 1000).toLocaleString()}</span>
              <div>URL: {post.postUrl}</div>
              <div>Hash: {post.postHash}</div>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserPosts;
