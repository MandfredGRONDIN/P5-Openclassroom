let cart = JSON.parse(localStorage.getItem("product_client"));
let apiProducts = [];

getAPIProducts(cart);
//------------------------------------------------------------

// Récupérer les infos manquantes des produits
async function getAPIProducts(products) {
  if (products === null || products == 0) {
    document.querySelector("#totalQuantity").innerHTML = "0";
    document.querySelector("#totalPrice").innerHTML = "0";
    document.querySelector("h1").innerHTML =
      "Vous n'avez pas d'article dans votre panier";
  } else {
    try {
      for (let i = 0; i < products.length; i++) {
        let apiProduct = null;
        await fetch(`http://localhost:3000/api/products/` + products[i].id)
          .then((res) => res.json())
          .then((data) => (apiProduct = data));
        apiProduct.color = products[i].color;
        apiProduct.quantity = products[i].quantity;
        apiProducts.push(apiProduct)
      }
      displayProducts();
  } catch (err) {
      console.error(err);
    }
  }
}
//------------------------------------------------------------

// Création des produits et leurs infos
function displayProducts(){
  let cart_items = document.querySelector("#cart__items");
  cart_items.innerHTML = apiProducts.map(product => {
    return `<article class="cart__item" data-id="${product._id}" data-color="${product.color}">
    <div class="cart__item__img">
      <img src="${product.imageUrl}" alt="${product.altTxt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${product.name}</h2>
        <p>${product.color}</p>
        <p>${product.price} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem" >Supprimer</p>
        </div>
      </div>
    </div>
  </article>`
  }).join("");
  listenDeleteEvents();
  changeInput();
  totalQty();
}

//------------------------------------------------------------

// Récuperer la value de quantité quand elle change
function changeInput() {
  let input_qty = document.querySelectorAll(".cart__item");
  input_qty.forEach((input_qty) => {
    input_qty.addEventListener("change", (e) => {
      let article = input_qty.closest("article");
      let data_id = article.getAttribute("data-id");
      let data_color = article.getAttribute("data-color");
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === data_id && cart[i].color === data_color) {
          cart[i].quantity = e.target.value;
          cart[i].quantity = parseInt(cart[i].quantity);
          localStorage.removeItem(cart)
          localStorage.setItem("product_client", JSON.stringify(cart))
        }
      }totalQty();
    });
  });
}
//------------------------------------------------------------

// Supprimer le produit
function listenDeleteEvents() {
  let btn_delete = document.querySelectorAll(".cart__item .deleteItem");
  for (let i = 0; i < btn_delete.length; i++) {
    btn_delete[i].addEventListener("click", () => {
      let article = btn_delete[i].closest("article");
      let data_id = article.getAttribute("data-id");
      let data_color = article.getAttribute("data-color");
      for (let j = 0; j < apiProducts.length; j++) {
        if (data_id == apiProducts[j]._id && data_color == apiProducts[j].color) {
          cart = cart.filter( prod => prod !== cart[j])
          localStorage.removeItem(cart)
          localStorage.setItem("product_client", JSON.stringify(cart))
          article.remove()
          totalQty();
          return null 
        }
      }
    });
  }
}
//------------------------------------------------------------

// Total Quantité
function totalQty(){
  let totalQuantity = document.querySelector('#totalQuantity');
  let totalPrice = document.querySelector("#totalPrice");
  let number = 0;
  let total = 0;
  for (let j = 0; j < cart.length; j++) {
    number += cart[j].quantity;
    total += cart[j].quantity * apiProducts[j].price;
}
  totalPrice.innerHTML = total;
  totalQuantity.innerHTML = number;
}