let cart_items = document.querySelector("#cart__items")
let basket = JSON.parse(localStorage.getItem("product_client"));


fetch(`http://localhost:3000/api/products`)
  .then((products) => products.json()) // Transforme l'api en fichier json
  .then((products) => {
    /* test(basket) */
  });


console.table(basket)


/* function test(basket){
    for (let i = 0; i < basket.length; i++){
        cart_items.innerHTML += `<article class="cart__item" data-id="${basket[i].id}" data-color="${basket[i].color}">
        <div class="cart__item__img">
          <img src="../images/product01.jpg" alt="Photographie d'un canapé">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${basket[i].name}</h2>
            <p>${basket[i].color}</p>
            <p>42,00 €</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté : </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${basket[i].quantity}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
      </article>`
        console.log(basket[i])
    }
    
} */