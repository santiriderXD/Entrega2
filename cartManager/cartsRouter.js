import { Router } from 'express';
import CartManager from './cartsManager.js';

const router = Router();
const manager = new CartManager();

// Crear carrito
router.post('/', async (req, res) => {
  res.status(201).json(await manager.create());
});

// Obtener productos del carrito
router.get('/:cid', async (req, res) => {
  const cart = await manager.getById(req.params.cid);
  cart ? res.json(cart.products) : res.status(404).json({ error: 'No encontrado' });
});

// Agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  const updated = await manager.addProduct(req.params.cid, req.params.pid);
  updated ? res.json(updated) : res.status(404).json({ error: 'Carrito no encontrado' });
});

export default router;
