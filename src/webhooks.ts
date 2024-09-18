import express from "express";
import { WebhookRequest } from "./server";
import { stripe } from "./lib/stripe";
import type Stripe from "stripe";
import { getPayloadClient } from "./get-payload";
import { Product } from "./payload-types";
import { Resend } from "resend";
import { ReceiptEmailHtml } from "./components/emails/ReceiptEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export const stripeWebhookHandler = async (
  req: express.Request,
  res: express.Response
) => {
  const webhookRequest = req as any as WebhookRequest;
  const body = webhookRequest.rawBody;
  const signature = req.headers["stripe-signature"] || "";

  let event;
  // validate that the request actually comes from stripe
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    return res
      .status(400)
      .send(
        `Webhook Error: ${err instanceof Error ? err.message : "Unknown Error"}`
      );
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (!session?.metadata?.userId || !session?.metadata?.orderId) {
    return res.status(400).send(`Webhook Error: No user present in metadata`);
  }

  if (event.type === "checkout.session.completed") {
    const payload = await getPayloadClient();

    const { docs: users } = await payload.find({
      collection: "users",
      where: {
        id: {
          equals: session.metadata.userId,
        },
      },
    });

    const [user] = users;

    if (!user) return res.status(404).json({ error: "No such user exists." });

    const { docs: orders } = await payload.find({
      collection: "orders",
      depth: 2,
      where: {
        id: {
          equals: session.metadata.orderId,
        },
      },
    });

    const [order] = orders;

    // update the _isPaid vale of this order
    if (!order) return res.status(404).json({ error: "No such order exists." });

    await payload.update({
      collection: "orders",
      data: {
        _isPaid: true,
      },
      where: {
        id: {
          equals: session.metadata.orderId,
        },
      },
    });

    // send receipt email
    try {
      const data = await resend.emails.send({
        // from: "BuyArena <onboarding@resend.dev>",
        from: "BuyArena <hello@vinyldavyl.xyz>",
        to: [user.email],
        subject: "Thanks for your order! This is your receipt.",
        html: ReceiptEmailHtml({
          date: new Date(),
          email: user.email,
          orderId: session.metadata.orderId,
          products: order.products as Product[],
        }),
      });
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  return res.status(200).send();
};

// export const getUserHandler = async (
//   req: express.Request,
//   res: express.Response
// ) => {
//   try {
//     const payload = await getPayloadClient();
//     const token = req.headers.authorization?.split(" ")[1];

//     if (!token) {
//       return res.status(401).json({ message: "No token provided" });
//     }

//     // Verify the token and get the user
//     const user = await payload.find({
//       collection: "users",
//       where: {
//         token: {
//           equals: token,
//         },
//       },
//     });

//     if (!user) {
//       return res.status(401).json({ message: "Invalid token" });
//     }

//     return res.status(200).json({ user });
//   } catch (error) {
//     console.error("Error in getUserHandler:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

// export const apiHandler = async (
//   req: express.Request,
//   res: express.Response
// ) => {
//   if (req.method === "POST" && req.path === "/webhook") {
//     return stripeWebhookHandler(req, res);
//   } else if (req.method === "GET" && req.path === "/api/users/me") {
//     return getUserHandler(req, res);
//   } else {
//     res.status(404).json({ message: "Not found" });
//   }
// };
