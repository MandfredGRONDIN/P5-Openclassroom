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
        apiProducts.push(apiProduct);
      }
      displayProducts();
    } catch (err) {
      console.error(err);
    }
  }
}
//------------------------------------------------------------

// Création des produits et leurs infos
function displayProducts() {
  let cart_items = document.querySelector("#cart__items");
  cart_items.innerHTML = apiProducts
    .map((product) => {
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
  </article>`;
    })
    .join("");
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
          localStorage.removeItem(cart);
          localStorage.setItem("product_client", JSON.stringify(cart));
        }
      }
      totalQty();
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
        if (
          data_id == apiProducts[j]._id &&
          data_color == apiProducts[j].color
        ) {
          cart = cart.filter((prod) => prod !== cart[j]);
          localStorage.removeItem(cart);
          localStorage.setItem("product_client", JSON.stringify(cart));
          article.remove();
          if (cart === null || cart == 0) {
            document.querySelector("#totalQuantity").innerHTML = "0";
            document.querySelector("#totalPrice").innerHTML = "0";
            document.querySelector("h1").innerHTML =
              "Vous n'avez plus d'article dans votre panier";
          } else {
            totalQty();
            return null;
          }
        }
      }
    });
  }
}
//------------------------------------------------------------

// Total Quantité
function totalQty() {
  let totalQuantity = document.querySelector("#totalQuantity");
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
//------------------------------------------------------------

// Gestion du formulaire

// Formulaire querySelector
let first_name = document.querySelector("#firstName");
let last_name = document.querySelector("#lastName");
let address = document.querySelector("#address");
let city = document.querySelector("#city");
let e_mail = document.querySelector("#email");
let btn_order = document.querySelector("#order");

// Formulaire Error querySelector
let first_name_error = document.querySelector("#firstNameErrorMsg");
first_name_error.style.color = "red";
let last_name_error = document.querySelector("#lastNameErrorMsg");
last_name_error.style.color = "red";
let address_error = document.querySelector("#addressErrorMsg");
address_error.style.color = "red";
let city_error = document.querySelector("#cityErrorMsg");
city_error.style.color = "red";
let e_mail_error = document.querySelector("#emailErrorMsg");
e_mail_error.style.color = "red";

let contact = {
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  email: "",
};
let products = [];

// Event au click
btn_order.addEventListener("click", (e) => {
  e.preventDefault();

  // Création d'une classe pour fabriquer l'objet dans lequel iront les values du formulaire
  class Formulaire {
    constructor() {
      this.firstName = first_name.value;
      this.lastName = last_name.value;
      this.address = address.value;
      this.city = city.value;
      this.email = e_mail.value;
    }
  }
  // Appel de l'instance de classe Formulaire pour créer l'objet formulaire_value
  const formulaire_value = new Formulaire();

  // Const regEx pour le formulaire
  const regExLastnameNameCity = (value) => {
    return /^[A-Za-z]{3,20}$/.test(value);
  };
  const regExCity = (value) => {
    return /^[a-zA-Zéèàïêç\-\s]{2,30}$/.test(value);
  };
  const regExAdress = (value) => {
    return /^(.){2,50}$/.test(value);
  };
  const regExEmail = (value) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
  };

  // Controle de la validité name
  function nameControle() {
    let nameForm = formulaire_value.firstName;
    if (regExLastnameNameCity(nameForm)) {
      first_name_error.innerHTML = "";
      return true;
    } else {
      first_name_error.innerHTML =
        "Le prénom doit avoir 3 lettres minimum et pas de caractère spéciaux ou chiffres";
      return false;
    }
  }
  // Controle de la validité lastName
  function lastnameControle() {
    let lastnameForm = formulaire_value.lastName;
    if (regExLastnameNameCity(lastnameForm)) {
      last_name_error.innerHTML = "";
      return true;
    } else {
      last_name_error.innerHTML =
        "Le nom doit avoir 3 lettres minimum et pas de caractère spéciaux ou chiffres";
      return false;
    }
  }
  // Controle de la validité address
  function adressControle() {
    let addressForm = formulaire_value.address;
    if (regExAdress(addressForm)) {
      address_error.innerHTML = "";
      return true;
    } else {
      address_error.innerHTML =
        "merci de rentrer une adresse valide, max 50 caractères";
      return false;
    }
  }
  // Controle de la validité city
  function cityControle() {
    let cityForm = formulaire_value.city;
    if (regExCity(cityForm)) {
      city_error.innerHTML = "";
      return true;
    } else {
      city_error.innerHTML =
        "Merci de rentrer le nom de votre ville ou village, pas de code postal";
      return false;
    }
  }
  // Controle de la validité email
  function emailControle() {
    let emailForm = formulaire_value.email;
    if (regExEmail(emailForm)) {
      e_mail_error.innerHTML = "";
      return true;
    } else {
      e_mail_error.innerHTML =
        "Email non valide, il doit contenir un @ et 1 point suivi de maxixum 3 lettres";
      return false;
    }
  }

  // Vérification si la fonction return vrai ou faux puis rajoute dans le localstorage si vrai puis ajout dans le localStorage
  if (
    nameControle() &&
    lastnameControle() &&
    adressControle() &&
    cityControle() &&
    emailControle()
  ) {
    localStorage.setItem("formulaire", JSON.stringify(formulaire_value));
  }
  //-------------------------------------------------

  // Récupération des valeurs du formulaires + les produits dans le localStorage pour les mettres dans commandeFinale
  for (let articleSelect of cart){
    products.push(articleSelect.id)
  }
  let commandeFinale;
  let contactRef;
  paquet()
  function paquet(){
    contactRef = JSON.parse(localStorage.getItem("formulaire"));
    commandeFinale = {
      contact: {
        firstName: contactRef.firstName,
        lastName: contactRef.lastName,
        address: contactRef.address,
        city: contactRef.city,
        email: contactRef.email,
      },
      products: products,
    }
  }

  // Envoie de l'objet order vers le serveur
  fetch("http://localhost:3000/api/products/order",{
    method: "POST",
    headers: { 
    'Content-Type': 'application/json' 
    },
    body: JSON.stringify(commandeFinale),
  })
  .then(async(response)=>{
    try{
      const contenu = await response.json();
      console.log(contenu.orderId);
      let orderId = contenu.orderId;
      window.location.assign("confirmation.html?id=" + orderId) 
    }catch(e){
      console.log(e);
    }
  })
});
