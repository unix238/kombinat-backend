const User = require('../../models/User');
const Seller = require('../../models/Seller');
const Item = require('../../models/Item');

class ItemController {
  async getAllItems(req, res) {
    try {
      const user = await User.findOne({ _id: req.user.user._id });
      const seller = await Seller.findOne({ owner: user._id });
      if (!seller) {
        return res.status(400).json({ message: 'Seller not found' });
      }
      const items = await Item.find({ seller: seller._id });
      return res.status(200).json(items);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = new ItemController();
