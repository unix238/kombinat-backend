const ItemService = require('../services/item-service');

class ItemController {
  async getItems(req, res) {
    try {
      const page = req.query.page;
      const limit = req.query.limit;
      const { items, totalItems } = await ItemService.getItems(page, limit);
      if (items) {
        res.setHeader('x-total-count', totalItems.length);
        res.setHeader('Access-Control-Expose-Headers', 'x-total-count');
        res.status(200).json(items);
      }
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: 'get news error' });
    }
  }

  async getByID(req, res) {
    try {
      const id = req.params.id;
      const news = await ItemService.getByID(id);
      if (news) {
        res.status(200).json(news);
      }
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: 'get news error' });
    }
  }

  async addItem(req, res) {
    try {
      const news = await ItemService.addItem(req.body);
      if (news) {
        res.status(200).json(news);
      }
    } catch (e) {
      console.log(e);
      res.status(400).json(e);
    }
  }
}

module.exports = new ItemController();
