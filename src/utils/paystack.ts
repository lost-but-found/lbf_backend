import crypto from "crypto";
import axios from "axios";
import { PAYSTACK_SECRET_KEY } from "../config";

class Paystack {
  // Paystack secret key
  private secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  // Create a Paystack checkout session
  async initializeTransaction({
    email,
    amount,
    post,
    user,
  }: {
    email: string;
    amount: number;
    post: string;
    user: string;
  }) {
    try {
      const response = await axios.post(
        "https://api.paystack.co/transaction/initialize",
        {
          email: email,
          amount: amount * 100, // Paystack amount is in kobo
          metadata: {
            post,
            user,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.secret}`,
          },
        }
      );

      const authorizationUrl = response.data.data.authorization_url;
      return authorizationUrl;
    } catch (error) {
      console.error(error);
    }
  }

  verifyHash(event: any) {
    return crypto
      .createHmac("sha512", this.secret)
      .update(JSON.stringify(event))
      .digest("hex");
  }
}

export default new Paystack(PAYSTACK_SECRET_KEY);
