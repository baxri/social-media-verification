import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import { useAccount } from "wagmi";
import SocialAccounts from "../components/SocialAccounts";
import AddNewSocialAccount from "../components/AddNewSocialAccount";
import AddPost from "../components/AddPost";
import UserPosts from "../components/UserPosts";
import AllPosts from "../components/AllPosts";

const Home: NextPage = () => {
  const { isConnected } = useAccount();

  return (
    <div>
      <Head>
        <title>RainbowKit App</title>
        <meta
          content="Generated by @rainbow-me/create-rainbowkit"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main>
        <ConnectButton />

        {isConnected && <SocialAccounts />}
        {isConnected && <AddNewSocialAccount />}
        {isConnected && <AddPost />}
        {isConnected && <UserPosts />}
      

      <AllPosts />
      </main>

      <footer>
        <a href="https://rainbow.me" rel="noopener noreferrer" target="_blank">
          Made with ❤️ by your
        </a>
      </footer>
    </div>
  );
};

export default Home;
