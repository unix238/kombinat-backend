const Item = require("../models/Item");
const Tag = require("../models/Tag");
const Category = require("../models/Category");
const Order = require("../models/Order");
const SellerOrder = require("../models/SellerOrder");
const axios = require("axios");
const CryptoJS = require("crypto-js");
const config = require("../config");
const { DOMParser } = require("xmldom");

class PaymentService {
  async addNewOrder(items, deliveryData) {
    try {
      const salt = Math.random().toString();
      const allItems = await Item.find({
        _id: { $in: items.map((item) => item.id) },
      });
      const totalPrice =
        allItems.reduce((acc, item) => {
          return acc + item.price;
        }, 0) + 1000;

      const order = new Order({
        items: items.map((item) => ({ item: item.id, size: item.size })),
        deliveryData,
        totalPrice,
        amount: totalPrice,
        salt: salt,
      });
      console.log(totalPrice);
      // amount, id, salt, description
      const signature = await this.getSignature(
        totalPrice,
        order._id,
        salt,
        "Оплата заказа в Kombinat"
      );
      console.log(signature);
      const request = await this.getPaymentURL({
        id: order._id,
        amount: totalPrice,
        description: "Оплата заказа в Kombinat",
        salt: salt,
        signature: signature,
      });
      console.log(request.data);

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(request.data, "text/xml");

      const responseNode = xmlDoc.getElementsByTagName("response")[0];
      const pgStatus =
        responseNode.getElementsByTagName("pg_status")[0].textContent;
      const pgPaymentId =
        responseNode.getElementsByTagName("pg_payment_id")[0].textContent;
      const pgRedirectUrl =
        responseNode.getElementsByTagName("pg_redirect_url")[0].textContent;
      const pgRedirectUrlType = responseNode.getElementsByTagName(
        "pg_redirect_url_type"
      )[0].textContent;
      const pgSalt =
        responseNode.getElementsByTagName("pg_salt")[0].textContent;
      const pgSig = responseNode.getElementsByTagName("pg_sig")[0].textContent;

      console.log("pg_status:", pgStatus);
      console.log("pg_payment_id:", pgPaymentId);
      console.log("pg_redirect_url:", pgRedirectUrl);
      console.log("pg_redirect_url_type:", pgRedirectUrlType);
      console.log("pg_salt:", pgSalt);
      console.log("pg_sig:", pgSig);

      await order.save();
      return pgRedirectUrl;
    } catch (e) {
      throw e;
    }
  }

  async getPaymentStatus(orderID) {
    const order = Order.findById(orderID);
    const signature = await this.getCheckSignature({
      id: order._id,
      salt: order.salt,
    });
    const reqData = {
      pg_order_id: config.MERCHANT_IDENTIFIER,
      pg_payment_id: orderID,
      pg_salt: order.salt,
      pg_sig: signature,
    };

    const response = await axios.post(
      "https://api.paybox.money/get_status3.php",
      reqData
    );
    console.log(response.data);
  }

  async getPaymentURL(data) {
    const reqData = {
      pg_order_id: data.id,
      pg_merchant_id: config.MERCHANT_IDENTIFIER,
      pg_amount: data.amount,
      pg_description: data.description,
      pg_salt: data.salt,
      pg_sig: data.signature,
      pg_result_url: "https://dev.kmbinat.com/payments/result",
    };
    return await axios.post(
      "https://api.paybox.money/init_payment.php",
      reqData
    );
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

  async getCheckSignature(data) {
    const paybox_merchant_id = config.MERCHANT_IDENTIFIER;
    const paybox_merchant_secret = config.PAYMENT_RECEPTION;

    const request = {
      pg_merchant_id: paybox_merchant_id,
      pg_payment_id: data.id,
      pg_salt: data.salt,
    };

    // ksort from php
    function ksort(obj) {
      var keys = Object.keys(obj).sort(),
        sortedObj = {};

      for (var i in keys) {
        sortedObj[keys[i]] = obj[keys[i]];
      }

      return sortedObj;
    }

    const sortedRequest = ksort(request);
    // sortedRequest to array withotu keys
    const array = Object.values(sortedRequest);
    array.unshift("get_status3.php");
    array.push(paybox_merchant_secret);

    const signature = CryptoJS.MD5(array.join(";")).toString();
    return signature;
  }

  async getSignature(amount, id, salt, description) {
    const paybox_merchant_id = config.MERCHANT_IDENTIFIER;
    const paybox_merchant_secret = config.PAYMENT_RECEPTION;

    console.log(`data: ${amount}, ${id}, ${salt}, ${description}`);

    const request = {
      pg_order_id: id,
      pg_merchant_id: paybox_merchant_id,
      pg_amount: amount,
      pg_description: description,
      pg_salt: salt,
      pg_result_url: "https://dev.kmbinat.com/payments/result",
    };

    function makeFlatParamsArray(arrParams, parent_name = "") {
      let arrFlatParams = [];
      let i = 0;
      for (const key in arrParams) {
        if (arrParams.hasOwnProperty(key)) {
          i++;
          /**
           * Имя делаем вида tag001subtag001
           * Чтобы можно было потом нормально отсортировать и вложенные узлы не запутались при сортировке
           */
          const name = parent_name + key + i.toString().padStart(3, "0");
          if (Array.isArray(arrParams[key])) {
            arrFlatParams = arrFlatParams.concat(
              makeFlatParamsArray(arrParams[key], name)
            );
            continue;
          }
          arrFlatParams.push([name, String(arrParams[key])]);
        }
      }
      return arrFlatParams.reduce(function (result, item) {
        result[item[0]] = item[1];
        return result;
      }, {});
    }

    const flatParams = makeFlatParamsArray(request);
    // Сортировка по ключю
    const sortedData = Object.keys(flatParams)
      .sort()
      .reduce((acc, key) => {
        acc[key] = flatParams[key];
        return acc;
      }, {});
    // make array of values from sortedData
    const values = Object.values(sortedData);
    values.push(paybox_merchant_secret);
    values.unshift("init_payment.php");
    console.log(`values: ${values}`);
    const signature = CryptoJS.MD5(values.join(";")).toString();
    return signature;
  }
}
// init_payment.php;25;test;548817;23;some random string;lU9HFGGboiFuEZvM
module.exports = new PaymentService();
