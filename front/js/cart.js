let cart = JSON.parse(localStorage.getItem("product_client"));

getAPIProducts(cart);
//------------------------------------------------------------

// Récupérer les infos manquantes des produits
async function getAPIProducts(product_client) {
  if (cart === null || cart == 0) {
    document.querySelector("#totalQuantity").innerHTML = "0";
    document.querySelector("#totalPrice").innerHTML = "0";
    document.querySelector("h1").innerHTML = "Vous n'avez pas d'article dans votre panier";
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
        deleteProduct();
        changeInput();
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
              <p class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
      </article>`;
}
//------------------------------------------------------------

// Récuperer la value de quantité quand elle change
function changeInput() {
  let input_qty = document.querySelectorAll(".itemQuantity");
  input_qty.forEach(function (qte) {
    qte.addEventListener("change", (e) => {
      let result_qty = e.target.value;
      result_qty = parseInt(result_qty);
      cart.quantity = result_qty;
      console.log(result_qty);
    });
  });
}
//------------------------------------------------------------

// Supprimer le produit
 function deleteProduct(){
  let delete_item = document.getElementsByClassName("cart__item");
  console.log(delete_item)
  const test = delete_item.closest('deleteItem');
  console.log(test)
  delete_item.forEach(function (del){
    del.addEventListener("click", (e) => {
      console.log(delete_item.dataset.id)
      console.log(productData._id)
      /* const articleSelectId = this.getAttribute('data-id'); */
      /* console.log(articleSelectId) */
    })
  })
} 

  

