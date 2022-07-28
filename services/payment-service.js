const Item = require('../models/Item');
const Tag = require('../models/Tag');
const Category = require('../models/Category');
const Order = require('../models/Order');

class PaymentService {
  async addOrder(userID, items) {
    try {
      const order = await Order.create({
        userID,
        items,
      });
      return order;
    } catch (e) {
      throw e;
    }
  }

  async makePayment(orderID) {
    try {
      const order = await Order.findById(orderID);
      if (!order) {
        throw new Error('Order not found');
      }
      order.status = 'paid';
      order.save();
    } catch (e) {
      throw e;
    }
  }

  async getAllPayments() {
    try {
      const payments = await Order.find({});
      return payments;
    } catch (e) {
      throw e;
    }
  }

  async getPaidPayments() {
    try {
      const payments = await Order.find({ status: 'paid' });
      return payments;
    } catch (e) {
      throw e;
    }
  }

  async getPendingPayments() {
    try {
      const payments = await Order.find({ status: 'pending' });
      return payments;
    } catch (e) {
      throw e;
    }
  }

  async getPaymentByID(id) {
    try {
      const payments = await Order.find({ _id: id });
      return payments;
    } catch (e) {
      throw e;
    }
  }
}

module.exports = new PaymentService();
