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

  async addTag(req, res) {
    try {
      const tag = await ItemService.addTag(req.body);
      if (tag) {
        res.status(200).json(tag);
      }
    } catch (e) {
      console.log(e);
      res.status(400).json(e);
    }
  }

  async getTagByID(req, res) {
    try {
      const id = req.params.id;
      const tag = await ItemService.getTagByID(id);
      if (tag) {
        res.status(200).json(tag);
      } else {
        res.status(404).json({ error: 'tag not found' });
      }
    } catch (e) {
      console.log(e);
      res.status(400).json(e);
    }
  }

  async getAllTags(req, res) {
    try {
      const tags = await ItemService.getAllTags();
      if (tags) {
        res.status(200).json(tags);
      }
    } catch (e) {
      console.log(e);
      res.status(400).json(e);
    }
  }

  async getItemsByTag(req, res) {
    try {
      const tag = req.params.tag;
      const page = req.query.page;
      const limit = req.query.limit;
      const { items, totalItems } = await ItemService.getItemsByTag(
        tag,
        page,
        limit
      );
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

  async addCategory(req, res) {
    try {
      const category = await ItemService.addCategory(req.body);
      if (category) {
        res.status(200).json(category);
      }
    } catch (e) {
      res.status(400).json(e);
    }
  }

  async getAllCategories(req, res) {
    try {
      const categories = await ItemService.getAllCategories();
      if (categories) {
        res.status(200).json(categories);
      }
    } catch (e) {
      res.status(400).json(e);
    }
  }
}

module.exports = new ItemController();
