const User = require('../../models/User');
const Seller = require('../../models/Seller');
const Order = require('../../models/Order');
const Item = require('../../models/Item');

class ordersController {
  async uniqueClients(req, res) {
    try {
      const user = await User.findOne({ _id: req.user.user._id });
      const seller = await Seller.findOne({ owner: user._id });
      const orders = await Order.find({
        items: { $elemMatch: { seller: seller._id } },
      });
      return res.status(200).json(orders);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ error: 'Error in uniqueClients' });
    }
  }

  async getAllItems(req, res) {
    try {
      const user = await User.findOne({ _id: req.user.user._id });
      const seller = await Seller.findOne({ owner: user._id });
      const items = await Item.find({ seller: seller._id });
      return res.status(200).json(items);
    } catch (e) {
      console.log(e);
      return res.status(420).json({ error: e });
    }
  }

  async getAllOrders(req, res) {
    try {
      const orders = await Order.find();
      return res.status(200).json(orders);
    } catch (e) {
      console.log(e);
      return res.status(420).json({ error: e });
    }
  }
}

module.exports = new ordersController();
