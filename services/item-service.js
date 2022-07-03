const Item = require('../models/Item');

class ItemService {
  async getItems(page = 1, limit = 10) {
    try {
      const totalItems = await Item.find({});
      const items = await Item.find({})
        .skip((page - 1) * limit)
        .limit(limit);
      return { items, totalItems };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getByID(id) {
    try {
      const items = await Item.findById(id);
      return items;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async addItem(item) {
    try {
      const newItem = await Item.create(item);
      newItem.save();
      return newItem;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}

module.exports = new ItemService();
