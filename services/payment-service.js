const Item = require("../models/Item");
const Tag = require("../models/Tag");
const Category = require("../models/Category");
const Order = require("../models/Order");
const SellerOrder = require("../models/SellerOrder");
const CryptoJS = require("crypto-js");

class PaymentService {
  async addOrder(userID, items) {
    try {
    } catch (e) {
      throw e;
    }
  }

  async makePayment(orderID) {
    try {
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
      const payments = await Order.find({ status: "paid" });
      return payments;
    } catch (e) {
      throw e;
    }
  }

  async getPendingPayments() {
    try {
      const payments = await Order.find({ status: "pending" });
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

  async getSignature() {
    const paybox_merchant_id = "548817";
    const paybox_merchant_secret = "lU9HFGGboiFuEZvM";

    const request = {
      pg_order_id: "1233123212",
      pg_merchant_id: "548817",
      pg_amount: "100",
      pg_description: "test",
      pg_salt: "some random string",
    };

    // multidiemnsional array to one-dimensional without keys
    const requestArray = Object.values(request);
    console.log(requestArray);
    const sortedRequestArray = requestArray.sort();
    console.log(sortedRequestArray);
    // array_unshift($requestForSignature, 'init_payment.php'); // Добавление в начало имени скрипта
    sortedRequestArray.unshift("init_payment.php");
    console.log(sortedRequestArray);
    sortedRequestArray.push(paybox_merchant_secret);
    console.log(sortedRequestArray);
    const signature = CryptoJS.MD5(sortedRequestArray.join(";")).toString();
    console.log(signature);
    return null;
  }
}

module.exports = new PaymentService();
