// Importamos módulos
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import productsRouter from './productManager/productsRouter.js';
import cartsRouter from './cartManager/cartsRouter.js';
import fs from 'fs';

// Configuración de rutas absolutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializamos app y server
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Rutas a los archivos
const PRODUCTS_FILE = path.join(__dirname, 'products', 'products.json');

// Middleware para parsear JSON y recibir datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Carpeta pública para archivos estáticos (JS cliente)
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Routers API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/', async (req, res) => {
    const products = await getProducts(); 
    res.render('home', { products });
});

// Vista de productos en tiempo real
app.get('/realtimeproducts', async (req, res) => {
    const products = await getProducts();
    res.render('realTimeProducts', { products });
});

// Funciones utilitarias para leer/guardar productos
async function getProducts() {
    const data = await fs.promises.readFile(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(data);
}

async function saveProducts(products) {
    await fs.promises.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

// WebSockets
io.on('connection', (socket) => {
    console.log('Cliente conectado vía WebSocket');

    socket.on('nuevoProducto', async (producto) => {
        const products = await getProducts();
        producto.id = Date.now();
        products.push(producto);
        await saveProducts(products);
        io.emit('productosActualizados', products);
    });

    socket.on('eliminarProducto', async (id) => {
        let products = await getProducts();
        products = products.filter(p => p.id.toString() !== id.toString());
        await saveProducts(products);
        io.emit('productosActualizados', products);
    });
    
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Inicializamos el servidor en el puerto 8080
httpServer.listen(8080, () => {
    console.log('Servidor escuchando en http://localhost:8080');
});
