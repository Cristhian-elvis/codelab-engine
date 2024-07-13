import mercadopage from "mercadopago";
import { MERCADOPAGO_API_KEY } from "../config.js";


export const createOrder = async (req, res) => {
  const request = req.body
  mercadopage.configure({
    access_token: MERCADOPAGO_API_KEY,
  });

  try {
    const result = await mercadopage.preferences.create({
      items: [
        {
          title: request.course,
          unit_price: 50,
          currency_id: "PEN",
          quantity: request.quantity,
        },
      ],
      notification_url: "https://wxfwccs3-3001.brs.devtunnels.ms/webhook",
      back_urls: {
        success: "https://code-lab-tm.netlify.app/courses/payment-success",
        // pending: "https://e720-190-237-16-208.sa.ngrok.io/pending",
        failure: "https://code-lab-tm.netlify.app/courses/payment-error",
      },
    });

    console.log(result);

    // res.json({ message: "Payment creted" });
    res.json(result.body);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const receiveWebhook = async (req, res) => {
  try {
    const payment = req.query;
    console.log(req);
    console.log(payment);
    if (payment.type === "payment") {
      const data = await mercadopage.payment.findById(payment["data.id"]);
      console.log(data);
    }

    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something goes wrong" });
  }
};
