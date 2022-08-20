// Récuperer l'id du produit
let product_id = new URLSearchParams(window.location.search).get("_id");

fetch(`http://localhost:3000/api/products/` + product_id)
  .then((product) => product.json()) // Transforme l'api en fichier json
  .then((product) => {
    console.log(product);
    displayProductInfos(product);
  });

let product_img = document.querySelector(".item__img");
let product_title = document.querySelector("#title");
let product_price = document.querySelector("#price");
let product_description = document.querySelector("#description");
let product_colors = document.querySelector("#colors");
let product_nb = document.querySelector("itemQuantity");

// Afficher les informations du produit
function displayProductInfos(product) {
  product_img.innerHTML += `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
  product_title.innerHTML += `<h1 id="title"> ${product.name} </h1>`;
  product_price.innerHTML += `<span id="price"> ${product.price} </span>`;
  product_description.innerHTML += `<p id="description"> ${product.description} </p>`;
  let product_color = product.colors;
  for (let i = 0; i < product_color.length; i++){
    product_colors.innerHTML += `<option value="${product_color[i]}">${product_color[i]}</option>`
    console.log(product_color[i])
  }
}
