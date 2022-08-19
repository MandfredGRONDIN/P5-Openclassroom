// Récuperer l'id du produit
let product_id = new URLSearchParams(window.location.search).get("_id");

fetch(`http://localhost:3000/api/products/` + product_id)
  .then((product) => product.json()) // Transforme l'api en fichier json
  .then((product) => {
    console.log(product);
    displayProductInfos(product);
  });

// Afficher les informations du produit
let product_img = document.querySelector(".item__img");
let product_title = document.querySelector("#title");
let product_price = document.querySelector("#price");
let product_description = document.querySelector("#description");
function displayProductInfos(product) {
  product_img.innerHTML += `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
  product_title.innerHTML += `<h1 id="title"> ${product.name} </h1>`;
  product_price.innerHTML += `<span id="price"> ${product.price} </span>`;
  product_description.innerHTML += `<p id="description"> ${product.description} </p>`;
}
