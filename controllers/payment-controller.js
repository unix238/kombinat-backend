const PaymentService = require('../services/payment-service');

class PaymentController {
  async addNewOrder(req, res) {
    try {
      const { userID, items } = req.body;
      const order = await PaymentService.addOrder(userID, items);
      if (order) {
        res.status(200).json({ order });
      }
    } catch (e) {
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
}

module.exports = new PaymentController();
