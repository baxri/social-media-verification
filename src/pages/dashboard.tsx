import type { NextPage } from "next";
import Head from "next/head";
import { useAccount } from "wagmi";
import SocialAccounts from "../components/SocialAccounts";
import AddNewSocialAccount from "../components/AddNewSocialAccount";
import AddPost from "../components/AddPost";
import UserPosts from "../components/UserPosts";
import AllPosts from "../components/AllPosts";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Layout from "../components/Layout";

const Dashboard: NextPage = () => {
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
      <Header />
      <Layout>
        <main>
          {isConnected && <SocialAccounts />}
          {isConnected && <UserPosts />}
        </main>
      </Layout>
      <Footer />
    </div>
  );
};

export default Dashboard;
