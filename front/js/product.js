// Récuperer l'id du produit
let product_id = new URLSearchParams(window.location.search).get("_id");

fetch(`http://localhost:3000/api/products/` + product_id)
  .then((product) => product.json()) // Transforme l'api en fichier json
  .then((product) => {
    displayProductInfos(product);
    getColor();
    getQuantity();
  });

let product_client = {};
product_client.id = product_id;

let color = "";
let quantite = 0;
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
  for (let i = 0; i < product_color.length; i++) {
    product_colors.innerHTML += `<option value="${product_color[i]}">${product_color[i]}</option>`;
  }
}
//------------------------------------------------------------

// Récuperer la valeur de couleur quand celle ci-change
function getColor() {
  const colors = document.querySelector("#colors");
  colors.addEventListener("input", (event) => {
    let result_color = event.target.value;
    product_client.colors = result_color;
    color = result_color;
  });
}
//------------------------------------------------------------

// Récuperer la value de quantité quand elle change
function getQuantity() {
  const qte = document.querySelector("#quantity");
  qte.addEventListener("change", (event) => {
    let result = event.target.value;
    result = parseInt(result);
    product_client.quantity = result;
    quantite = result;
  });
}
//------------------------------------------------------------

// Click sur le bouton ajouter au panier
const add_cart = document.querySelector("#addToCart");
add_cart.addEventListener("click", (event) => {
  let result = getQuantity();
  let result_color = color;
  let product_client = {
    id: product_id,
    quantity: quantite,
    color: color,
  };
  verifyInput(product_client);
});
//------------------------------------------------------------

// Vérifier si il y as bien une couleur et une quantite de choisi
function verifyInput() {
  if (color == []) {
    alert("Merci de choisir une couleur");
  } else if (quantite > 0 && quantite < 101) {
    console.log("c'est bon");
  } else {
    alert("Veuillez choisir un nombre de produit compris entre 1 et 100");
  }
}
