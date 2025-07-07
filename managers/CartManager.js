const fs = require('fs');
const path = require('path');

class CartManager {
  constructor() {
    this.filePath = path.join(__dirname, '../data/carts.json');
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]));
    }
  }

  async getCarts() {
    const data = await fs.promises.readFile(this.filePath, 'utf-8');
    return JSON.parse(data);
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    return carts.find(c => c.id == id);
  }

  async createCart() {
    const carts = await this.getCarts();
    const newId = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;

    const newCart = {
      id: newId,
      products: []
    };

    carts.push(newCart);
    await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.getCarts();
    const index = carts.findIndex(c => c.id == cartId);
    if (index === -1) return null;

    const productInCart = carts[index].products.find(p => p.product === productId);

    if (productInCart) {
      productInCart.quantity += 1;
    } else {
      carts[index].products.push({ product: productId, quantity: 1 });
    }

    await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, 2));
    return carts[index];
  }
}

module.exports = CartManager;