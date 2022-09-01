let cart = JSON.parse(localStorage.getItem("product_client"));

getAPIProducts(cart);
//------------------------------------------------------------

// Récupérer les infos manquantes des produits
async function getAPIProducts(product_client) {
  if (cart === null || cart == 0) {
    document.querySelector("#totalQuantity").innerHTML = "0";
    document.querySelector("#totalPrice").innerHTML = "0";
    document.querySelector("h1").innerHTML =
      "Vous n'avez pas d'article dans votre panier";
  } else {
    try {
      for (let i = 0; i < product_client.length; i++) {
        await fetch(`http://localhost:3000/api/products/` + cart[i].id)
          .then((res) => res.json())
          .then((data) => (productData = data));
        if (cart[i].id == productData._id) {
          productData.colors = cart[i].color;
          productData.quantity = cart[i].quantity;
        }
        createProduct(productData);
        changeInput();
        deleteProduct();
        /* totalQty(); */
      }
    } catch (err) {
      console.error(err);
    }
  }
}
//------------------------------------------------------------

// Création des produits et leurs infos
function createProduct(productData) {
  let cart_items = document.querySelector("#cart__items");
  cart_items.innerHTML += `<article class="cart__item" data-id="${productData._id}" data-color="${productData.colors}">
        <div class="cart__item__img">
          <img src="${productData.imageUrl}" alt="${productData.altTxt}">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${productData.name}</h2>
            <p>${productData.colors}</p>
            <p>${productData.price} €</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté : </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productData.quantity}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem" >Supprimer</p>
            </div>
          </div>
        </div>
      </article>`;
}
//------------------------------------------------------------

// Récuperer la value de quantité quand elle change
function changeInput() {
  input_qty = document.querySelectorAll(".itemQuantity");
  input_qty.forEach(function (qte) {
    qte.addEventListener("change", (e) => {
      let result_qty = e.target.value;
      result_qty = parseInt(result_qty);
      productData.quantity = result_qty;
      console.log(result_qty);
      localStorage.setItem("product_client", JSON.stringify(cart));
    });
  });
}
//------------------------------------------------------------

// Supprimer le produit
function deleteProduct() {
  let btn_supprimer = document.querySelectorAll(".cart__item .deleteItem");
  for (let i = 0; i < btn_supprimer.length; i++) {
    btn_supprimer[i].addEventListener("click", (e) => {
      product_del = btn_supprimer[i].closest("article");
      data_id = product_del.getAttribute("data-id");
      data_color = product_del.getAttribute("data-color");
      for (let j = 0; j < cart.length; j++) {
        if (data_id == cart[j].id && data_color == cart[j].color) {
          cart.splice(j);
          localStorage.removeItem(cart);
          localStorage.setItem("product_client", JSON.stringify(cart));
          window.location.href = "cart.html"
        }
      }
    });
  }
}
//------------------------------------------------------------

// Total Quantité
/* function totalQty(){
  let total_article = 0;
  let total_price = 0;
  let cart_el = document.querySelector(".cart__item");
  cart_el.forEach((cart) => {
    total_article += JSON.parse(cart.dataset.quantity);
    total_price += cart.dataset.quantity * cart.dataset.price;
  });
  document.getElementById("totalQuantity").textContent = totalArticle;  
  document.getElementById("totalPrice").textContent = totalPrix;
} */

/* function totalQty(){
  let total_article = 0;
  let total_price = 0;
  let cart_el = document.querySelector(".cart__item");
  for(j = 0; j < cart.length; j++){
    cart[j].quantity += total_article
    console.log(cart[j].quantity)
    console.log(total_article)
}
} */


/* function totalQty(){
  let qty_total = document.querySelectorAll(".cart__item .cart__item__content__description");
  for(i =0; i < qty_total.length; i++){
    console.log(qty_total[i])
    let prixTotalCalcul = [];
    let prix_produit_cart = productData.price;
    prixTotalCalcul.push(prix_produit_cart)
    console.log(prixTotalCalcul)
}}
  */