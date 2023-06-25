// const Router = require("express");
// const PaymentController = require("../controllers/payment-controller");
// const authMiddleware = require("../middleware/authMiddleware");
// const adminMiddleware = require("../middleware/adminMiddleware");

import { Router } from "express";
import PaymentController from "../controllers/payment-controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const PaymentRouter = Router();

PaymentRouter.post(
  "/new-order",
  [authMiddleware],
  PaymentController.addNewOrder
);

PaymentRouter.post(
  "/make-payment",
  [authMiddleware],
  PaymentController.makePayment
);

PaymentRouter.get(
  "/all-payments",
  [authMiddleware],
  [adminMiddleware],
  PaymentController.getAllPayments
);

PaymentRouter.get("/result", PaymentController.getResult);
PaymentRouter.get("/get-orders", [authMiddleware], PaymentController.getOrders);
PaymentRouter.post("/result", PaymentController.getResult);

PaymentRouter.get("/sign", PaymentController.generateSignature);

// module.exports = PaymentRouter;
export default PaymentRouter;
