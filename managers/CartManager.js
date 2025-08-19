import Cart from '../models/Cart.js';

class CartManager {
  async createCart() {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    return newCart;
  }

  async getCartById(id) {
    return await Cart.findById(id).populate('products.product');
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;

    const idx = cart.products.findIndex(p => p.product.toString() === productId);
    if (idx !== -1) cart.products[idx].quantity += quantity;
    else cart.products.push({ product: productId, quantity });

    await cart.save();
    return cart.populate('products.product');
  }

  async updateCartProducts(cartId, newProducts) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;

    cart.products = newProducts.map(p => ({
      product: p.product,
      quantity: p.quantity
    }));

    await cart.save();
    return cart.populate('products.product');
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;

    const idx = cart.products.findIndex(p => p.product.toString() === productId);
    if (idx === -1) return null;

    cart.products[idx].quantity = quantity;
    await cart.save();
    return cart.populate('products.product');
  }

  async removeProduct(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;

    cart.products = cart.products.filter(p => p.product.toString() !== productId);
    await cart.save();
    return cart.populate('products.product');
  }

  async clearCart(cartId) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;

    cart.products = [];
    await cart.save();
    return cart;
  }
}

export default CartManager;
