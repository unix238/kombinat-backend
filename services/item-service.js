const Item = require('../models/Item');
const Tag = require('../models/Tag');
const Brand = require('../models/Brand');
const Category = require('../models/Category');

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

  async getTagByID(id) {
    try {
      const tag = await Tag.findById(id);
      return tag;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getAllTags() {
    try {
      const tags = await Tag.find({});
      return tags;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async addTag(tag) {
    try {
      const { title, link } = tag;
      const newTag = await Tag.create({ title, link });
      newTag.save();
      return newTag;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async addCategory(category) {
    try {
      const newCategory = await Category.create(category);
      newCategory.save();
      return newCategory;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getAllCategories() {
    try {
      const categories = await Category.find({});
      return categories;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getItemsByTag(link, page = 1, limit = 12) {
    try {
      const tag = await Tag.find({ link: link });
      const totalItems = await Item.find({ tags: tag });
      const items = await Item.find({ tags: tag })
        .skip((page - 1) * limit)
        .limit(limit);
      console.log('items', items);
      return { items, totalItems };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getItemsByCategory(category, page = 1, limit = 12) {
    try {
      const totalItems = await Item.find({ category: category });
      const items = await Item.find({ category: category })
        .skip((page - 1) * limit)
        .limit(limit);
      return { items, totalItems };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getBrands() {
    try {
      const brands = await Brand.find();
      return brands;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getFilteredItems(filters, page = 1, limit = 12) {
    try {
      const { tags, category, brand } = filters;
      let allItems = [];
      if (tags.length > 0) {
        for (let i = 0; i < tags.length; i++) {
          const items = await Item.find({ tags: tags[i] });
          allItems = allItems.concat(items);
        }
      }

      if (brand.length > 0) {
        for (let i = 0; i < brand.length; i++) {
          const items = await Item.find({ brand: brand[i] });
          allItems = allItems.concat(items);
        }
      }

      if (category.length > 0) {
        console.log('added by category');
        for (let i = 0; i < category.length; i++) {
          const items = await Item.find({ categories: category[i] });
          allItems = allItems.concat(items);
        }
      }

      const fillted = [];
      for (let i = 0; i < allItems.length; i++) {
        if (!fillted.includes(allItems[i]._id)) {
          fillted.push(allItems[i]);
        }
      }

      console.log('filteredItems123123', fillted.length);
      return { items: fillted, totalItems: fillted.length };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}

module.exports = new ItemService();
