let cart = JSON.parse(localStorage.getItem("product_client"));

getAPIProducts(cart)
// Récupérer les infos manquantes des produits
async function getAPIProducts(product_client){
  try{
    for(let i = 0; i < product_client.length; i++){
      await fetch(`http://localhost:3000/api/products/` + cart[i].id)
      .then((res) => res.json())
      .then((data) => (productData = data))
       if (cart[i].id == productData._id){
        productData.colors = cart[i].color;
        productData.quantity = cart[i].quantity;
       }
      createProduct(productData);
    }
  } catch(err){
    console.error(err);
  }
}

// Création des produits et leurs infos
function createProduct(productData){
  let cart_items = document.querySelector("#cart__items");
        cart_items.innerHTML += `<article class="cart__item" data-id="${productData._id}" data-color="${productData.color}">
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
      </article>`
} 