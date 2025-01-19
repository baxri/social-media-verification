import { FC, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants";
import { FaInstagram, FaFacebook, FaLinkedin, FaTwitter, FaCopy } from "react-icons/fa";
import Modal from "./Modal";
import AddPost from "./AddPost";
import { useRouter } from "next/router";

const UserPosts: FC = () => {
  const { address, isConnected } = useAccount();
  const [tooltipText, setTooltipText] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const { data: posts } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getUserPosts",
    args: [address as `0x${string}`],
  });

  const { data: socialAccounts, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getUserSocialAccounts",
    args: [address as `0x${string}`],
  });

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

  if (!isConnected) return null;

  const hasSocialAccounts = socialAccounts && socialAccounts.length > 0;

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Posts</h2>
        {hasSocialAccounts ? (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Add Post
          </button>
        ) : (
          <div className="text-sm text-orange-600">
            Please add a social account first before creating posts
          </div>
        )}
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
            {!posts || posts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No posts found
                </td>
              </tr>
            ) : (
              posts.map((post, index) => (
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Post"
      >
        <AddPost />
      </Modal>
    </div>
  );
};

export default UserPosts;
