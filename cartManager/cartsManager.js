import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, '../products/carts.json');

export default class CartManager {
  async getAll() {
    const data = await fs.readFile(file, 'utf-8');
    return JSON.parse(data);
  }

  async getById(id) {
    const carts = await this.getAll();
    return carts.find(c => c.id === id);
  }

  async create() {
    const carts = await this.getAll();
    const newCart = { id: String(Date.now()), products: [] };
    carts.push(newCart);
    await fs.writeFile(file, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async addProduct(cid, pid) {
    const carts = await this.getAll();
    const cart = carts.find(c => c.id === cid);
    if (!cart) return null;

    const prod = cart.products.find(p => p.product === pid);
    prod ? prod.quantity++ : cart.products.push({ product: pid, quantity: 1 });

    await fs.writeFile(file, JSON.stringify(carts, null, 2));
    return cart;
  }
}
