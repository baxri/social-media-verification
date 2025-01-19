'use client';

import { FC, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants";
import { FaInstagram, FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";
import { useRouter } from "next/router";

const AllPosts: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tooltipText, setTooltipText] = useState<string | null>(null);
  const router = useRouter();
  const { data: realPosts } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getAllPosts",
  });

   // Mock data generation
  const mockPosts = Array.from({ length: 50 }, (_, i) => ({
    platform: ['Instagram', 'Facebook', 'LinkedIn', 'Twitter'][Math.floor(Math.random() * 4)],
    authorUsername: `user${i + 1}`,
    postHash: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
    timestamp: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 2592000), // Random time within last 30 days
    postUrl: `https://www.instagram.com/reel/DE-PPSlSKOO/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==`
  }));

  const posts = [...(realPosts || []), ...mockPosts];
  // const posts = [...(realPosts || [])];

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

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setTooltipText(`${index}`);
    setTimeout(() => setTooltipText(null), 2000);
  };

  const filteredPosts = posts?.filter((post) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      post.platform.toLowerCase().includes(searchLower) ||
      post.authorUsername.toLowerCase().includes(searchLower) ||
      post.postHash.toLowerCase().includes(searchLower) ||
      post.postUrl.toLowerCase().includes(searchLower) ||
      new Date(Number(post.timestamp) * 1000)
        .toLocaleString()
        .toLowerCase()
        .includes(searchLower)
    );
  });

  return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Verified Media</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Platform, Username, Post Hash, URL or Timestamp"
              className="pl-3 pr-10 py-2 w-[600px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Icon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post Hash</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {!filteredPosts || filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No posts found
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="text-xl">
                        {getPlatformIcon(post.platform)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {post.platform}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {post.authorUsername}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
                      <div className="flex items-center gap-2">
                        <a 
                          onClick={() => router.push(`/details/${post.postHash}`)}
                          className="cursor-pointer hover:underline"
                        >
                          {post.postHash.slice(0, 6)}...{post.postHash.slice(-4)}
                        </a>
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
                            onClick={() => copyToClipboard(post.postHash, index)}
                          >
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                          <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 transition-opacity ${tooltipText === `${index}` ? 'opacity-100' : 'group-hover:opacity-100'}`}>
                            {tooltipText === `${index}` ? 'Copied!' : 'Copy to clipboard'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(Number(post.timestamp) * 1000).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
                      <a href={post.postUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {post.postUrl.slice(0, 30)}...
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default AllPosts;
