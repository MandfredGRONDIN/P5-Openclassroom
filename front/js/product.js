// Récuperer l'id du produit
let product_id = new URLSearchParams(window.location.search).get("_id");

fetch(`http://localhost:3000/api/products/` + product_id)
  .then((product) => product.json()) // Transforme l'api en fichier json
  .then((product) => {
    displayProductInfos(product);
    listenColorsEvent();
    listenQuantityEvent();
  });

let product_client = { 
  id : product_id,
  color : "",
  quantity : 0
};

let product_img = document.querySelector(".item__img");
let product_title = document.querySelector("#title");
let product_price = document.querySelector("#price");
let product_description = document.querySelector("#description");
let product_colors = document.querySelector("#colors");
let product_nb = document.querySelector("#quantity");
let color_miss = document.querySelector(".item__content");


// Afficher les informations du produit
function displayProductInfos(product) {
  product_img.innerHTML += `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
  product_title.innerHTML += `<h1 id="title"> ${product.name} </h1>`;
  product_price.innerHTML += `<span id="price"> ${product.price} </span>`;
  product_description.innerHTML += `<p id="description"> ${product.description} </p>`;
  for (let i = 0; i < product.colors.length; i++) {
    product_colors.innerHTML += `<option value="${product.colors[i]}">${product.colors[i]}</option>`;
  }
}
//------------------------------------------------------------

// Récuperer la valeur de couleur quand celle ci-change
console.log(product_client.color)
function listenColorsEvent() {
  product_colors.addEventListener("change", (event) => {
    product_client.color = event.target.value;
    if(product_client.color != 0){
      document.querySelector(".color__miss").textContent = "";
    }
  });
}
//------------------------------------------------------------

// Récuperer la value de quantité quand elle change
function listenQuantityEvent() {
  product_nb.addEventListener("change", (event) => {
    product_client.quantity = parseInt(event.target.value);
    if(product_client.quantity != 0){
      document.querySelector(".quantity__miss").textContent = "";
    }
  });
}
//------------------------------------------------------------

// Click sur le bouton ajouter au panier
let add_cart = document.querySelector("#addToCart");
add_cart.addEventListener("click", () => {
  console.log(product_client);
  verifyInput(product_client);
});
//------------------------------------------------------------

// Vérifier si il y as bien une couleur et une quantite de choisi
function verifyInput(product_client) {
  if (product_client.color == "") {
    colorMiss()
  } else if (product_client.quantity < 1 || product_client.quantity > 100){
    quantityMiss();
  } else {
      if (addLs(product_client)){
      productAdded()
    } else {
      excessQuantity()
    }
  }
}
//------------------------------------------------------------

// Ajouter le produit au ls et ajoute uniquement la quantité si le produit y est déjà
function addLs(product_client) {
  let cart = JSON.parse(localStorage.getItem("product_client")); /* JSON.parse permet d'analyser ls.getItem comme du json */
  if (cart == null) {
    cart = [];
    cart.push(product_client);
    localStorage.setItem("product_client", JSON.stringify(cart));
  } else {
    let get_article = cart.find((cart_product) => product_client.id == cart_product.id && product_client.color == cart_product.color);
    if (get_article) {
      let nb = Number(product_client.quantity) + Number(get_article.quantity);
      if (nb < 101){
      get_article.quantity = nb;
      localStorage.setItem("product_client", JSON.stringify(cart));
      } else {
        return false
      }
    } else {
      cart.push(product_client);
      localStorage.setItem("product_client", JSON.stringify(cart));
    }
  } return true
} 
//------------------------------------------------------------

// Fonction pour les messages d'erreurs
let newElt = document.createElement("span");
let elt = color_miss;
elt.appendChild(newElt);
newElt.classList.add("color__miss", "quantity__miss","product__added", "excess__quantity");

function styleError(){
  newElt.style.color = "red";
  newElt.style.fontWeight = "bold";
  newElt.style.textAlign = "center";
  newElt.style.paddingTop = "5px";
}
function style(){
  newElt.style.color = "green";
  newElt.style.fontWeight = "bold";
  newElt.style.textAlign = "center";
  newElt.style.paddingTop = "5px";
}

function colorMiss(){
  document.querySelector(".color__miss").textContent = "Merci de bien choisir une couleur";
  styleError()
}

function quantityMiss(){
  document.querySelector(".quantity__miss").textContent = "Veuillez choisir une quantité de produit compris entre 1 et 100";
  styleError()
}

function productAdded(){
  document.querySelector(".product__added").textContent = `Votre commande viens d'etre ajoutée au panier`;
  style()
}

function excessQuantity(){
  document.querySelector(".excess__quantity").textContent = "La quantité total d'un même article ne peux dépasser 100";
  styleError()
}
//------------------------------------------------------------