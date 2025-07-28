const fs = require('fs');
const path = require('path');

class ProductManager {
  constructor() {
    this.filePath = path.join(__dirname, '../data/products.json');
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]));
    }
  }

  async getProducts() {
    const data = await fs.promises.readFile(this.filePath, 'utf-8');
    return JSON.parse(data);
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => p.id == id);
  }

  async addProduct(data) {
    const products = await this.getProducts();
    const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;
    const newProduct = {
      id: newId,
      status: true,
      ...data
    };
    products.push(newProduct);
    await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
    return newProduct;
  }

  async updateProduct(id, newFields) {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id == id);
    if (index === -1) return null;

    products[index] = {
      ...products[index],
      ...newFields,
      id: products[index].id
    };

    await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const newList = products.filter(p => p.id != id);
    await fs.promises.writeFile(this.filePath, JSON.stringify(newList, null, 2));
  }
}
module.exports = ProductManager;;
  