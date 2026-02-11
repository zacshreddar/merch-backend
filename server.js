import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getAccessToken, stkPush } from "./mpesa.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/pay", async (req, res) => {
  try {
    const { phone, amount } = req.body;

    if (!phone || !amount) {
      return res.status(400).json({ message: "Missing phone or amount" });
    }

    const token = await getAccessToken();
    const response = await stkPush(token, phone, amount);

    res.json({
      message: "STK Push sent. Check your phone 📲",
      data: response
    });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: "Payment failed ❌" });
  }
});

app.post("/callback", (req, res) => {
  console.log("MPESA CALLBACK:", JSON.stringify(req.body, null, 2));
  res.json({ message: "Callback received" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
