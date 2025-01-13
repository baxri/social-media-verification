import { FC, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants";

const AllPosts: FC = () => {

  const { data: posts } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getAllPosts",
  });

  return (
    <div>
      <h2>All Posts</h2>
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

export default AllPosts;
