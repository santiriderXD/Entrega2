import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Ruta al archivo JSON
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, '../products/products.json');

export default class ProductManager {
  async getAll() {
    const data = await fs.readFile(file, 'utf-8');
    return JSON.parse(data);
  }

  async getById(id) {
    const items = await this.getAll();
    return items.find(p => p.id === id);
  }

  async add(product) {
    const items = await this.getAll();
    const newProduct = { id: String(Date.now()), ...product };
    items.push(newProduct);
    await fs.writeFile(file, JSON.stringify(items, null, 2));
    return newProduct;
  }

  async update(id, changes) {
    const items = await this.getAll();
    const index = items.findIndex(p => p.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...changes, id }; // No se cambia el id
    await fs.writeFile(file, JSON.stringify(items, null, 2));
    return items[index];
  }

  async delete(id) {
    const items = await this.getAll();
    const filtered = items.filter(p => p.id !== id);
    if (items.length === filtered.length) return false;
    await fs.writeFile(file, JSON.stringify(filtered, null, 2));
    return true;
  }
}
