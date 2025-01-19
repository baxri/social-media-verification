import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Extract authorization code from query params
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "No authorization code provided" });
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://api.instagram.com/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: '1952722025237124',
          client_secret: '91f7cb4ee220d0bd82ae1b838297053f',
          grant_type: "authorization_code",
          redirect_uri: 'https://www.myauto.ge/ka/',
          code: code as string,
        }),
      }
    );

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for token");
    }

    const tokenData = await tokenResponse.json();

    // Get Instagram user profile
    const userResponse = await fetch(
      `https://graph.instagram.com/me?fields=id,username&access_token=${tokenData.access_token}`
    );

    if (!userResponse.ok) {
      throw new Error("Failed to fetch user data");
    }

    const userData = await userResponse.json();
    // const username = userData.username;

    const requestId = req.cookies.requestId;
    const address = req.cookies.address;
    const username = req.cookies.username;
    const platform = req.cookies.platform;

    if (!requestId || !address || !username || !platform) {
      throw new Error("Missing required cookies");
    }

    // Create message hash
    const message = ethers.solidityPackedKeccak256(
      ["bytes32", "address", "string", "string"],
      [requestId, address, username, platform]
    );

    // Sign message using private key
    const signer = new ethers.Wallet(process.env.VERIFIER_PRIVATE_KEY!);
    const signature = await signer.signMessage(ethers.getBytes(message));


    return res.redirect(`/verify?signature=${signature}&requestId=${requestId}&username=${username}&platform=${platform}`);
    // return res.status(200).json({ signature });
  } catch (error) {
    return res.redirect("/error");
    // return res.status(200).json({ error: "Error" });
  }
}
