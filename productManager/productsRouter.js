import { Router } from 'express';
import ProductManager from './productsManager.js';

const router = Router();
const manager = new ProductManager();

// Listar todos
router.get('/', async (req, res) => {
  res.json(await manager.getAll());
});

// Obtener por id
router.get('/:pid', async (req, res) => {
  const item = await manager.getById(req.params.pid);
  item ? res.json(item) : res.status(404).json({ error: 'No encontrado' });
});

// Agregar nuevo
router.post('/', async (req, res) => {
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;
  if (!title || !description || !code || price == null || status == null || stock == null || !category || !Array.isArray(thumbnails)) {
    return res.status(400).json({ error: 'Campos inválidos' });
  }
  res.status(201).json(await manager.add({ title, description, code, price, status, stock, category, thumbnails }));
});

// Actualizar
router.put('/:pid', async (req, res) => {
  const updated = await manager.update(req.params.pid, req.body);
  updated ? res.json(updated) : res.status(404).json({ error: 'No encontrado' });
});

// Eliminar
router.delete('/:pid', async (req, res) => {
  const deleted = await manager.delete(req.params.pid);
  deleted ? res.json({ mensaje: 'Eliminado' }) : res.status(404).json({ error: 'No encontrado' });
});

export default router;
