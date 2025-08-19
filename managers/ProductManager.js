import Product from '../models/Product.js';

class ProductManager {
  async getProducts({ limit = 10, page = 1, query = {}, sort = null }) {
    const filter = {};
    if (query.category) filter.category = query.category;
    if (query.status !== undefined) filter.status = (query.status === 'true' || query.status === true);

    const options = {
      limit: Number(limit) || 10,
      page: Number(page) || 1,
      sort: {}
    };

    if (sort === 'asc') options.sort.price = 1;
    else if (sort === 'desc') options.sort.price = -1;

    return await Product.paginate(filter, options);
  }

  async getProductById(id) {
    return await Product.findById(id);
  }

  async addProduct(data) {
    const product = new Product(data);
    return await product.save();
  }

  async updateProduct(id, newFields) {
    return await Product.findByIdAndUpdate(id, newFields, { new: true });
  }

  async deleteProduct(id) {
    return await Product.findByIdAndDelete(id);
  }
}

export default ProductManager;
