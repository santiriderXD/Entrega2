const socket = io();

const form = document.getElementById('formAgregar');
const lista = document.getElementById('listaProductos');

form.addEventListener('submit', e => {
    e.preventDefault();

    const formData = new FormData(form);
    const nuevoProducto = {};

    formData.forEach((value, key) => {
        if (key === 'price' || key === 'stock') {
            nuevoProducto[key] = parseFloat(value);
        } else if (key === 'thumbnails') {
            nuevoProducto[key] = value ? [value] : [];
        } else {
            nuevoProducto[key] = value;
        }
    });

    nuevoProducto.status = true;

    socket.emit('nuevoProducto', nuevoProducto);
    form.reset();
});

socket.on('productosActualizados', (productos) => {
    lista.innerHTML = '';
    productos.forEach(prod => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${prod.title}</strong> - $${prod.price}<br>
            <em>${prod.description}</em><br>
            Código: ${prod.code}<br>
            Stock: ${prod.stock} - Categoría: ${prod.category}<br>
            <img src="${prod.thumbnails?.[0] || ''}" width="100"><br>
            <button onclick="eliminarProducto('${prod.id}')">Eliminar</button>
        `;
        lista.appendChild(li);
    });
});

function eliminarProducto(id) {
    socket.emit('eliminarProducto', id);
}
