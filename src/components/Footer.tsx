import { FC } from "react";
import { FaInstagram, FaGithub, FaFacebook } from "react-icons/fa";

const Footer: FC = () => {
  return (
    <footer className="w-full p-4 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-gray-600">
        <div className="text-gray-400">Made with ❤️ by <span className="font-bold text-gray-600">BIBI</span></div>

        <div className="flex gap-4">
          <a href="#" className="text-gray-600 hover:text-gray-800">
            <FaInstagram size={20} />
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-800">
            <FaGithub size={20} />
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-800">
            <FaFacebook size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
