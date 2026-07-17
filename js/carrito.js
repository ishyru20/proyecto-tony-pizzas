// Función global para actualizar el contador del nav
const actualizarContadorCarrito = () => {
    const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
    const contador = document.getElementById("contador-carrito");
    
    if (contador) {
        const totalItems = carritoActual.reduce((acc, prod) => acc + prod.cantidad, 0);
        contador.innerText = totalItems;
    }
};

// Traemos el carrito del localStorage
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Capturamos los elementos del DOM en carrito.html
const contenedorCarrito = document.getElementById("contenedorCarrito");
const totalCarrito = document.getElementById("totalCarrito");
const btnFinalizar = document.getElementById("btnFinalizar");

const renderizarCarrito = () => {
    // Si no estamos en la página del carrito, frenamos la función acá para no tirar errores
    if (!contenedorCarrito) return;

    contenedorCarrito.innerHTML = "";

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = `
            <div class="text-center mt-5">
                <h4 class="text-muted">Tu carrito está vacío</h4>
                <a href="index.html" class="btn btn-warning mt-3 fw-bold">Volver al Menú</a>
            </div>
        `;
        if (totalCarrito) totalCarrito.innerText = "0";
        return;
    }

    // Calculamos el total general usando reduce una sola vez
    const total = carrito.reduce(
        (acc, producto) => acc + (producto.precio * producto.cantidad), 
        0
    );

    // Recorremos el array y creamos una tarjeta horizontal por producto
    carrito.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("card", "mb-3", "shadow-sm");

        // Usamos una estructura horizontal de Bootstrap para que parezca una lista de compras
        div.innerHTML = `
            <div class="row g-0 align-items-center p-3">
                <div class="col-md-2 text-center">
                    <img src="${producto.imagen}" class="img-fluid rounded" style="height:120px; object-fit:cover;" alt="${producto.nombre}">
                </div>
                <div class="col-md-6 px-3">
                    <h5 class="card-title mb-1">${producto.nombre}</h5>
                    <small class="text-muted">Precio unitario: $${producto.precio.toLocaleString()}</small>
                </div>
                <div class="col-md-3 text-end d-flex justify-content-center align-items-center">
                    <button class="btn btn-sm btn-outline-danger me-2" onclick="restarProducto(${producto.id})">-</button>
                    <span class="fs-6 fw-bold">Cant: ${producto.cantidad}</span>
                    <button class="btn btn-sm btn-outline-success ms-2" onclick="sumarProducto(${producto.id})">+</button>
                </div>
                <div class="col-md-12 text-end">
                   <button class="btn btn-sm btn-danger mt-2" onclick="eliminarProducto(${producto.id})">
                        <i class="bi bi-trash-fill"></i> Eliminar
                    </button>
                </div>
            </div>
        `;
        contenedorCarrito.appendChild(div);
    });

    if (totalCarrito) totalCarrito.innerText = total.toLocaleString();
};

const eliminarProducto = (id) => {
    // Sobreescribimos el carrito quedándonos con todos los productos MENOS el que tiene el id que recibimos
    carrito = carrito.filter(producto => producto.id !== id);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    
    renderizarCarrito();
    actualizarContadorCarrito();
};

const sumarProducto = (id) => {
    const indice = carrito.findIndex(prod => prod.id === id);
    if (indice !== -1) {
        carrito[indice].cantidad++;
        localStorage.setItem("carrito", JSON.stringify(carrito));
        renderizarCarrito();
        actualizarContadorCarrito();
    }
};

const restarProducto = (id) => {
    const indice = carrito.findIndex(prod => prod.id === id);
    if (indice !== -1 && carrito[indice].cantidad > 1) {
        carrito[indice].cantidad--;
        localStorage.setItem("carrito", JSON.stringify(carrito));
        renderizarCarrito();
        actualizarContadorCarrito();
    }
};

// Evento para finalizar la compra (envolvemos en un if por si estamos en el index.html)
if (btnFinalizar) {
    btnFinalizar.addEventListener("click", () => {
        // Validación: no permitir comprar con carrito vacío
        if (carrito.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Carrito vacío",
                text: "No podés finalizar una compra sin productos.",
                confirmButtonColor: "#c0392b"
            });
            return;
        }

        // Alerta de éxito
        Swal.fire({
            icon: "success",
            title: "¡Pedido confirmado!",
            text: "Tus pizzas ya están en el horno. ¡Gracias por elegir a Tony'Pizzas!",
            confirmButtonColor: "#e67e22"
        }).then(() => {
            // Vaciamos el array
            carrito = [];

            // Vaciamos el LocalStorage 
            localStorage.setItem("carrito", JSON.stringify(carrito));
            renderizarCarrito();
            actualizarContadorCarrito();
        });
    });
}

// Ejecuciones iniciales
renderizarCarrito();
actualizarContadorCarrito();