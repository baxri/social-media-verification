import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Error: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Verification Error</title>
        <meta
          content="Social account verification error"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1>Verification Failed</h1>
          <p>There was an error verifying your social account.</p>
          <Link href="/">
            Return to Home Page
          </Link>
        </div>
      </main>

      <footer>
        <a href="https://rainbow.me" rel="noopener noreferrer" target="_blank">
          Made with ❤️ by your
        </a>
      </footer>
    </div>
  );
};

export default Error;
