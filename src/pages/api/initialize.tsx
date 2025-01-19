import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import { ethers } from "ethers";

const LOGIN_URL =
  "https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=1952722025237124&redirect_uri=https://www.myauto.ge/ka/&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { requestId, address, username, platform } = req.body;

    if (!requestId || !address || !username || !platform) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    // Set cookies with 1 hour expiration
    const cookieOptions = {
      httpOnly: true,
      sameSite: "strict" as const,
      path: "/",
      maxAge: 60 * 60, // 1 hour
    };

    res.setHeader("Set-Cookie", [
      serialize("requestId", requestId, cookieOptions),
      serialize("address", address, cookieOptions),
      serialize("username", username, cookieOptions),
      serialize("platform", platform, cookieOptions),
    ]);

    // TODO This is temporary, we need to redirect to the correct platform
     // Create message hash
     const message = ethers.solidityPackedKeccak256(
      ["bytes32", "address", "string", "string"],
      [requestId, address, username, platform]
    );


    console.log('process.env.VERIFIER_PRIVATE_KEY', process.env.VERIFIER_PRIVATE_KEY);
    console.log('requestId', requestId);
    console.log('address', address);
    console.log('username', username);
    console.log('platform', platform);

    // Sign message using private key
    const signer = new ethers.Wallet(process.env.VERIFIER_PRIVATE_KEY!);
    const signature = await signer.signMessage(ethers.getBytes(message));

    console.log('signature', signature);


    // return res.status(200).json({ redirect: LOGIN_URL });
    return res.status(200).json({ redirect: `/verify?signature=${signature}&requestId=${requestId}&username=${username}&platform=${platform}` });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
