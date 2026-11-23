const CLAVE_CARRITO = 'carrito_tienda_hoyoverse';
let carrito = cargarCarritoStorage();

function cargarCarritoStorage() {
    try {
        const guardado = localStorage.getItem(CLAVE_CARRITO);
        return guardado ? JSON.parse(guardado) : [];
    } catch (error) {
        console.error('Error al leer carrito de localStorage:', error);
        return [];
    }
}

function guardarCarritoStorage() {
    try {
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    } catch (error) {
        console.error('Error al guardar carrito en localStorage:', error);
    }
}

function obtenerPrecioUnitario(producto) {
    return typeof calcularPrecioFinal === 'function'
        ? calcularPrecioFinal(producto)
        : producto.precioNormal;
}

function actualizarContadorHeader() {
    const btnCarrito = document.querySelector('#btn-carrito');
    if (!btnCarrito) return;

    const totalUnidades = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    btnCarrito.textContent = totalUnidades > 0 ? `Carrito (${totalUnidades})` : 'Carrito';
}

function agregarAlCarrito(idProducto) {
    const producto = catalogoProductos.find((p) => p.id === idProducto);
    if (!producto || !producto.stock) return;

    const existente = carrito.find((item) => item.id === idProducto);
    if (existente) {
        existente.cantidad += 1;
    } else {
        carrito.push({
            id: producto.id,
            personaje: producto.personaje,
            tipo: producto.tipo,
            precioUnitario: obtenerPrecioUnitario(producto),
            imagen: producto.imagen,
            cantidad: 1
        });
    }

    guardarCarritoStorage();
    renderizarCarrito();
}

function cambiarCantidad(idProducto, delta) {
    const item = carrito.find((i) => i.id === idProducto);
    if (!item) return;

    item.cantidad += delta;
    if (item.cantidad <= 0) {
        carrito = carrito.filter((i) => i.id !== idProducto);
    }

    guardarCarritoStorage();
    renderizarCarrito();
}

function vaciarCarrito() {
    carrito = [];
    guardarCarritoStorage();
    renderizarCarrito();
}

function renderizarCarrito() {
    const contenedorItems = document.querySelector('#carrito-items');
    const totalEl = document.querySelector('#carrito-total');
    actualizarContadorHeader();

    if (!contenedorItems || !totalEl) return;

    if (carrito.length === 0) {
        contenedorItems.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío.</p>';
        totalEl.textContent = formatearPrecio(0);
        return;
    }

    contenedorItems.innerHTML = carrito.map((item) => `
        <div class="carrito-item" data-id="${item.id}">
            <img src="./assets/img/${item.imagen}" alt="${item.personaje}" class="carrito-item-img">
            <div class="carrito-item-info">
                <h4>${item.personaje}</h4>
                <span>${item.tipo} · ${formatearPrecio(item.precioUnitario)}</span>
                <div class="carrito-controles">
                    <button type="button" class="btn-cant" data-accion="restar" data-id="${item.id}">-</button>
                    <span>${item.cantidad}</span>
                    <button type="button" class="btn-cant" data-accion="sumar" data-id="${item.id}">+</button>
                    <button type="button" class="btn-quitar" data-accion="quitar" data-id="${item.id}">Quitar</button>
                </div>
            </div>
        </div>
    `).join('');

    const totalMonto = carrito.reduce((acc, item) => acc + item.precioUnitario * item.cantidad, 0);
    totalEl.textContent = formatearPrecio(totalMonto);
}

function togglePanelCarrito(forzarEstado) {
    const panel = document.querySelector('#carrito-panel');
    if (!panel) return;

    const abrir = typeof forzarEstado === 'boolean'
        ? forzarEstado
        : !panel.classList.contains('abierto');

    panel.classList.toggle('abierto', abrir);
    panel.setAttribute('aria-hidden', String(!abrir));
}

// Delegación de eventos para agregar desde las cartas del catálogo
document.querySelector('#catalogo-grid')?.addEventListener('click', (evento) => {
    const btn = evento.target.closest('.btn-agregar');
    if (!btn || btn.disabled) return;
    agregarAlCarrito(btn.dataset.id);
});

// Delegación de eventos dentro del panel del carrito
document.querySelector('#carrito-items')?.addEventListener('click', (evento) => {
    const btn = evento.target.closest('button[data-accion]');
    if (!btn) return;

    const { id, accion } = btn.dataset;
    if (accion === 'sumar') cambiarCantidad(id, 1);
    if (accion === 'restar') cambiarCantidad(id, -1);
    if (accion === 'quitar') {
        carrito = carrito.filter((item) => item.id !== id);
        guardarCarritoStorage();
        renderizarCarrito();
    }
});

document.addEventListener('click', (evento) => {
    if (evento.target.closest('#btn-carrito, .js-abrir-carrito')) {
        evento.preventDefault();
        togglePanelCarrito();
    }
});

let temporizadorCompra;

function mostrarMensajeCompra() {
    const msg = document.querySelector('#mensaje-compra');
    if (!msg) return;

    msg.textContent = 'Comprado con éxito';
    msg.classList.add('visible');

    clearTimeout(temporizadorCompra);
    temporizadorCompra = setTimeout(() => {
        msg.textContent = '';
        msg.classList.remove('visible');
    }, 2500);
}

document.querySelector('#btn-cerrar-carrito')?.addEventListener('click', () => togglePanelCarrito(false));
document.querySelector('#btn-vaciar-carrito')?.addEventListener('click', vaciarCarrito);

document.addEventListener('DOMContentLoaded', renderizarCarrito);
document.querySelector('#btn-comprar-carrito')?.addEventListener('click', () => {
    mostrarMensajeCompra();
});