const User = require('../../models/User');
const Seller = require('../../models/Seller');
const Item = require('../../models/Item');
const Brand = require('../../models/Brand');
const Category = require('../../models/Category');
const Tag = require('../../models/Tag');

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

  async getAllBrands(req, res) {
    try {
      const brands = await Brand.find();
      return res.status(200).json(brands);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async getAllCategories(req, res) {
    try {
      const categories = await Category.find();
      return res.status(200).json(categories);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async getAllTags(req, res) {
    try {
      const tags = await Tag.find();
      return res.status(200).json(tags);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async addItem(req, res) {
    try {
      const item = new Item({ ...req.body.item, seller: req.seller._id });
      await item.save();
      console.log(req.body);
      return res.status(200).json({ message: 'Item added' });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async updateItem(req, res) {
    try {
      const { id } = req.body;
      const { newitem } = req.body;
      const item = await Item.findOne({ _id: id });
      if (!item) {
        return res.status(400).json({ message: 'Item not found' });
      }
      await item.updateOne({ ...newitem });
      await item.save();
      return res.status(200).json({ message: 'Item updated' });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = new ItemController();
