import { eliminarProducto } from "./administrador.js";
import { comprarProducto } from "./carrito.js";

const userLogin = document.getElementById("userLogin");
const divProductos = document.getElementById("productos");
const filterInput = document.getElementById("filter__input");
const filterLista = document.getElementById("filter__lista");
const filterNombre = document.getElementById("filter__nombre");
const filterPrecio = document.getElementById("filter__precio");

export let productosDisponibles = [];
let usuarioLogeado; 

document.addEventListener("DOMContentLoaded", () => {
    fetch("productos.json")
        .then((response) => response.json())
        .then((data) => {
            productosDisponibles = data;
            generarCardsProductos(productosDisponibles);
        })
        .catch((error) => console.error("Error al obtener datos:", error));

    usuarioLogeado = JSON.parse(sessionStorage.getItem("usuario")); // Asigna el valor aquí

    if (usuarioLogeado === null) {
        const a = document.createElement("a");
        a.href = "./html/usuarios.html";
        a.innerHTML = "Login";
        userLogin.appendChild(a);
    } else {
        const p = document.createElement("p");
        const close = document.createElement("button");

        p.innerHTML = `Bienvenido ${usuarioLogeado.user}`;
        close.id = "cerrar__sesion";
        close.innerHTML = "Cerrar sesión";
        close.addEventListener("click", () => {
            Swal.fire({
                title: `Gracias por comprar en nuestra tienda ${usuarioLogeado.user}.`,
                text: "Usuario deslogueado",
                icon: "info",
            });

            sessionStorage.removeItem("usuario");
            location.reload();
        });
        userLogin.appendChild(p);
        userLogin.appendChild(close);
    }
});

export const generarCardsProductos = (productos) => {
    divProductos.innerHTML = "";

    productos.forEach((producto) => {
        const { imagen, nombre, categoria, precio, id } = producto;

        let card = document.createElement("div");
        card.className = "producto";
        card.innerHTML = `
      <div class="card" style="width: 18rem;">
      <img class="card-img-top" src="${imagen}" alt="Card image cap">
      <div class="card-body">
      <p class="card-title">${nombre}</p>
      <p class="card-text">Categoría: ${categoria}</p>

      <p class="card-text">Precio: <b>$${precio}</b></p>
      <button id="btn${id}" class="btn btn-primary">Comprar</button>

      ${
          usuarioLogeado?.admin === true
              ? `<button id="eliminar${id}" class="btn btn-danger">Eliminar</button>`
              : ""
      }

      </div>
      </div>`;

        divProductos.appendChild(card);

        const btnComprar = document.getElementById(`btn${id}`);
        btnComprar.addEventListener("click", () => comprarProducto(id));

        if (usuarioLogeado?.admin === true) {
            const btnEliminar = document.getElementById(`eliminar${id}`);
            btnEliminar.addEventListener("click", () => eliminarProducto(id));
        }
    });
};


filterInput.addEventListener("keyup", (e) => {
    const productosFilter = productosDisponibles.filter((producto) =>
        producto.nombre.toLowerCase().includes(e.target.value)
    );

    productosDisponibles = productosFilter;

    if (e.target.value !== "") {
        generarCardsProductos(productosFilter);
    } else {
        productosDisponibles = JSON.parse(localStorage.getItem("productos"));
        generarCardsProductos(productosDisponibles);
    }
});


filterLista.addEventListener("click", (e) => {
    const productosFilter = productosDisponibles.filter((producto) =>
        producto.categoria.toLowerCase().includes(e.target.innerHTML.toLowerCase())
    );

    productosDisponibles = productosFilter;

    if (e.target.innerHTML !== "Todos") {
        generarCardsProductos(productosFilter);
    } else {
        productosDisponibles = JSON.parse(localStorage.getItem("productos"));
        generarCardsProductos(productosDisponibles);
    }
});


filterNombre.addEventListener("click", (e) => {
    filtrarPorNombre(e.target.innerHTML);
});


const filtrarPorNombre = (orden) => {
    let productos;

    if (orden === "Ascendente") {
        productos = productosDisponibles.sort((a, b) =>
            a.nombre.toLowerCase() > b.nombre.toLowerCase() ? 1 : -1
        );
    } else if (orden === "Descendente") {
        productos = productosDisponibles.sort((a, b) =>
            a.nombre.toLowerCase() < b.nombre.toLowerCase() ? 1 : -1
        );
    }
    generarCardsProductos(productos);
};


filterPrecio.addEventListener("click", (e) => {
    const orden = e.target.innerHTML;
    let productos;

    if (orden === "Ascendente") {
        productos = productosDisponibles.sort((a, b) => a.precio - b.precio);
    } else if (orden === "Descendente") {
        productos = productosDisponibles.sort((a, b) => b.precio - a.precio);
    }

    generarCardsProductos(productos);
});