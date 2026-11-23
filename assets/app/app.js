let catalogoProductos = [];

function calcularPrecioFinal(producto) {
    if (producto.enDescuento && producto.descuento > 0) {
        return Math.round(producto.precioNormal * (1 - producto.descuento / 100));
    }
    return producto.precioNormal;
}

function formatearPrecio(valor) {
    return `$${valor.toLocaleString('es-AR')}`;
}

function crearCartaProducto(producto) {
    const precioFinal = calcularPrecioFinal(producto);
    const tieneOferta = Boolean(producto.enDescuento && producto.descuento > 0);
    const sinStock = !producto.stock;

    const badgeHtml = sinStock
        ? `<span class="badge-producto sin-stock">Sin stock</span>`
        : tieneOferta
            ? `<span class="badge-producto oferta">-${producto.descuento}%</span>`
            : '';

    const precioHtml = tieneOferta
        ? `
            <span class="precio-tachado">${formatearPrecio(producto.precioNormal)}</span>
            <strong class="precio-final">${formatearPrecio(precioFinal)}</strong>
          `
        : `<strong class="precio-final">${formatearPrecio(producto.precioNormal)}</strong>`;

    return `
        <article class="carta-producto ${sinStock ? 'sin-stock' : ''}" data-id="${producto.id}">
            <div class="carta-img-wrap">
                ${badgeHtml}
                <img src="./assets/img/${producto.imagen}" alt="${producto.personaje} - ${producto.tipo}" loading="lazy">
            </div>
            <div class="carta-cuerpo">
                <span class="carta-tipo">${producto.tipo}</span>
                <h3 class="carta-titulo">${producto.personaje}</h3>
                <div class="carta-precios">${precioHtml}</div>
                <button type="button" class="btn-agregar" data-id="${producto.id}" ${sinStock ? 'disabled' : ''}>
                    ${sinStock ? 'Agotado' : 'Agregar al carrito'}
                </button>
            </div>
        </article>
    `;
}

function renderizarCatalogo(productos) {
    const contenedor = document.querySelector('#catalogo-grid');
    if (!contenedor) return;

    if (!productos.length) {
        contenedor.innerHTML = '<p class="catalogo-vacio">No se encontraron productos.</p>';
        return;
    }

    contenedor.innerHTML = productos.map(crearCartaProducto).join('');
}

async function cargarCatalogo() {
    const contenedor = document.querySelector('#catalogo-grid');
    try {
        /* REVISAR LA RUTA ACA  */
        const res = await fetch('./assets/almacen.json');
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

        catalogoProductos = await res.json();
        renderizarCatalogo(catalogoProductos);
    } catch (error) {
        console.error('Error al cargar productos:', error);
        if (contenedor) {
            contenedor.innerHTML = '<p class="catalogo-vacio">No se pudieron cargar los productos.</p>';
        }
    }
}

document.querySelector('#input-buscador')?.addEventListener('input', (e) => {
    const termino = e.target.value.trim().toLowerCase();
    const filtrados = catalogoProductos.filter((p) =>
        p.personaje.toLowerCase().includes(termino) || p.tipo.toLowerCase().includes(termino)
    );
    renderizarCatalogo(filtrados);
});

document.addEventListener('DOMContentLoaded', cargarCatalogo);