// funcion global para actualizar el contador del nav
const actualizarContadorCarrito = () => {
    const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
    const contador = document.getElementById("contador-carrito");

    if (contador) {
        // Usamos reduce para sumar las cantidades de todos los productos
        const totalItems = carritoActual.reduce((acumulador, producto) => acumulador + producto.cantidad, 0);
        contador.innerText = totalItems;
    }
};

// Inicializamos el carrito. 
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Función asíncrona para cargar Productos
const cargarProductos = async () => {

    try {
        // Hacemos la petición (fetch) al archivo JSON y esperamos la respuesta
        const respuesta = await fetch("data/productos.json");

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar los productos.");
        }

        const datos = await respuesta.json();

        // Capturamos el contenedor del HTML donde vamos a inyectar las tarjetas
        const productos = document.getElementById("contenedorProductos");

        if (!productos) return;

        // Recorremos el array de datos que trajimos del JSON, producto por producto
        datos.forEach(producto => {

            // Creamos un elemento <div> nuevo para la tarjeta
            const tarjeta = document.createElement("div");

            // Le asignamos las clases de Bootstrap para la grilla
            tarjeta.classList.add("col-md-4", "mb-4");

            // Armamos la estructura HTML de la tarjeta inyectando las variables del producto
            tarjeta.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="card-img-top img-menu w-100">
                <div class="card-body d-flex flex-column">
                    <h3>${producto.nombre}</h3>
                    <p class="fs-4 fw-bold text-success">$${producto.precio.toLocaleString()}</p>
                    
                    <div class="mt-auto">
                        <div class="input-group mb-3">
                            <span class="input-group-text bg-light">Cant.</span>
                            <input type="number" class="form-control" id="input-${producto.id}" value="1" min="1" max="20">
                        </div>
                        <button type="button" class="btn btn-warning w-100 fw-bold btn-agrega shadow-sm" data-id="${producto.id}">
                            Agregar al carrito
                        </button>
                    </div>
                </div>
            </div>
            `;

            // Agregamos esta tarjeta terminada al contenedor principal en el DOM
            productos.appendChild(tarjeta);
        });

        // --- SECCIÓN DE EVENTOS DEL CARRITO ---

        // capturamos todos los botones de "Agregar al carrito"
        const botones = document.querySelectorAll(".btn-agrega");

        // A cada botón le asignamos un evento para que escuche cuando el usuario hace click
        botones.forEach(boton => {
            boton.addEventListener("click", (e) => {

                // Capturamos el ID del producto que guardamos en el HTML
                const idProducto = parseInt(e.target.getAttribute("data-id"));

                // Capturamos el valor que el usuario escribió en el input de esa tarjeta específica
                const inputCantidad = document.getElementById(`input-${idProducto}`);
                const cantidadElegida = parseInt(inputCantidad.value);

                // Buscamos el producto COMPLETO en nuestro array original de 'datos'.
                const productoEncontrado = datos.find(prod => prod.id === parseInt(idProducto));

                // Verificamos si el producto YA ESTÁ en el carrito
                const indiceEnCarrito = carrito.findIndex(prod => prod.id === idProducto);

                if (indiceEnCarrito !== -1) {
                    // Si ya existe, solo le sumamos la nueva cantidad elegida
                    carrito[indiceEnCarrito].cantidad += cantidadElegida;
                } else {
                    // Si no existe, lo agregamos al array copiando sus datos y agregando la propiedad "cantidad"
                    carrito.push({ ...productoEncontrado, cantidad: cantidadElegida });
                }

                // Guardamos el carrito en el localStorage
                localStorage.setItem("carrito", JSON.stringify(carrito));

                actualizarContadorCarrito();

                // Mostramos la alerta
                Toastify({
                    text: `Agregaste ${cantidadElegida} ${productoEncontrado.nombre} al carrito`,
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    style: {
                        background: "linear-gradient(to right, #c0392b, #e67e22)",
                        color: "white",
                        fontWeight: "bold"
                    }
                }).showToast();

            });
        });

    } catch (error) {
        // El catch ahora envuelve toda la lógica y atrapa los errores correctamente
        console.error(error);

        const productos = document.getElementById("contenedorProductos");

        if (productos) {
            productos.innerHTML = `
                <div class="alert alert-danger">
                    Error al cargar los productos.
                </div>
            `;
        }
    }
};

cargarProductos();
actualizarContadorCarrito();