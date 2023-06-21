const PaymentService = require("../services/payment-service");

class PaymentController {
  async addNewOrder(req, res) {
    try {
      const { items, deliveryData } = req.body;
      const response = await PaymentService.addNewOrder(items, deliveryData);
      // console.log(items);
      return res.status(200).json(response);
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: e });
    }
  }

  async getResult(req, res) {
    try {
      console.log(req);
      // const { orderID } = req.query;
      // const result = await PaymentService.getResult(orderID);
      return res.status(200).json(result);
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: e });
    }
  }

  async makePayment(req, res) {
    try {
      const { orderID } = req.body;
      PaymentService.makePayment(orderID);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }

  async getAllPayments(req, res) {
    try {
      const payments = await PaymentService.getAllPayments();
      if (payments) res.status(200).json({ payments });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }

  async generateSignature(req, res) {
    try {
      const signature = await PaymentService.getSignature();
      if (signature) res.status(200);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }
}

module.exports = new PaymentController();
