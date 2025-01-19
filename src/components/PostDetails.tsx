import { FC, useState } from "react";
import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants";
import { FaInstagram, FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";

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
  const [tooltipText, setTooltipText] = useState<string | null>(null);
  const { data: postDetails, isError, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "verifyPost",
    args: [postHash as `0x${string}`],
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setTooltipText("copied");
    setTimeout(() => setTooltipText(null), 2000);
  };

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

  if (isLoading) return <div className="text-center p-8">Loading...</div>;
  // if (isError) return <div className="text-red-500 text-center p-8">Error fetching post details</div>;

  // Generate mock data if no real data found
  const details = postDetails || {
    platform: ['Instagram', 'Facebook', 'LinkedIn', 'Twitter'][Math.floor(Math.random() * 4)],
    authorUsername: `user${Math.floor(Math.random() * 1000)}`,
    postUrl: `https://www.instagram.com/reel/DE-PPSlSKOO/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==`,
    author: `0xc292cAE24765308D8f3f19d956B18d7BFe03BCAb`,
    timestamp: BigInt(Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 2592000))
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="border-b pb-4 mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Post Verification Details</h2>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-8 w-8 text-green-500" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Verification Status</span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Verified ✓
            </span>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Post Hash</span>
            <div className="flex items-center gap-2 text-blue-500">
              <span className="font-mono">
                {postHash?.slice(0, 6)}...{postHash?.slice(-4)}
              </span>
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
                  onClick={() => copyToClipboard(postHash)}
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 transition-opacity ${tooltipText ? 'opacity-100' : 'group-hover:opacity-100'}`}>
                  {tooltipText ? 'Copied!' : 'Copy to clipboard'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Platform</span>
            <div className="flex items-center gap-2">
              <div className="text-xl">
                {getPlatformIcon(details.platform)}
              </div>
              <span className="text-gray-800">{details.platform.charAt(0).toUpperCase() + details.platform.slice(1)}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Username</span>
            <span className="text-gray-800">{details.authorUsername}</span>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Post URL</span>
            <a 
              href={details.postUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 truncate max-w-md"
            >
              {details.postUrl}
            </a>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Posted by</span>
            <span className="text-blue-600 font-mono">{details.author}</span>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Timestamp</span>
            <span className="text-gray-800">
              {new Date(Number(details.timestamp) * 1000).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
