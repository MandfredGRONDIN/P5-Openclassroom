let cart = JSON.parse(localStorage.getItem("product_client"));
let api_products = [];

// Apparition des produits dans l'ordre alphabétique
function nameOrder() {
  api_products.sort(function (a, b) {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
}

getAPIProducts(cart);
//------------------------------------------------------------

// Récupérer les infos manquantes des produits
async function getAPIProducts(products) {
  if (products === null || products == 0) {
    document.querySelector("#totalQuantity").innerHTML = "0";
    document.querySelector("#totalPrice").innerHTML = "0";
    document.querySelector("h1").innerHTML =
      "Vous n'avez pas d'article dans votre panier";
    return null;
  }
  try {
    for (let i = 0; i < products.length; i++) {
      let api_product = null;
      await fetch(`http://localhost:3000/api/products/` + products[i].id)
        .then((res) => res.json())
        .then((data) => (api_product = data));
      if (!api_product) {
        continue;
      }
      api_product.color = products[i].color;
      api_product.quantity = products[i].quantity;
      api_products.push(api_product);
      nameOrder();
    }
    displayProducts();
  } catch (err) {
    console.error(err);
  }
}
//------------------------------------------------------------

// Création des produits et leurs infos
function displayProducts() {
  let cart_items = document.querySelector("#cart__items");
  cart_items.innerHTML = api_products
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
let quantity_error = document.createElement("span");
function changeInput() {
  let input_qty = document.querySelectorAll(".cart__item");
  input_qty.forEach((input_qty) => {
    input_qty.addEventListener("change", (e) => {
      let article = input_qty.closest("article");
      let data_id = article.getAttribute("data-id");
      let data_color = article.getAttribute("data-color");
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === data_id && cart[i].color === data_color) {
          if (e.target.value > 100) {
            e.target.value = 100;
            cart[i].quantity = 100;
            localStorage.setItem("product_client", JSON.stringify(cart));
          } else if (e.target.value < 1) {
            e.target.value = 1;
            cart[i].quantity = 1;
            localStorage.setItem("product_client", JSON.stringify(cart));
          } else {
            cart[i].quantity = parseInt(e.target.value);
            localStorage.setItem("product_client", JSON.stringify(cart));
          }
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
      for (let j = 0; j < api_products.length; j++) {
        if (
          data_id == api_products[j]._id &&
          data_color == api_products[j].color
        ) {
          cart = cart.filter(
            (prod) =>
              prod._id !== api_products[j]._id &&
              prod.color !== api_products[j].color
          );
          localStorage.setItem("product_client", JSON.stringify(cart));
          article.remove();
          if (cart === null || cart == 0) {
            document.querySelector("#totalQuantity").innerHTML = "0";
            document.querySelector("#totalPrice").innerHTML = "0";
            document.querySelector("h1").innerHTML =
              "Vous n'avez plus d'article dans votre panier";
          } else {
            totalQty();
            break;
          }
        }
      }
    });
  }
}
//------------------------------------------------------------

// Total Quantité
function totalQty() {
  let total_quantity = document.querySelector("#totalQuantity");
  let total_price = document.querySelector("#totalPrice");
  let number = 0;
  let total = 0;
  for (let j = 0; j < cart.length; j++) {
    let current_index = api_products.findIndex((product) => {
      return product._id == cart[j].id;
    });
    number += cart[j].quantity;
    total += cart[j].quantity * api_products[current_index].price;
  }
  total_price.innerHTML = total;
  total_quantity.innerHTML = number;
}
//------------------------------------------------------------

// Gestion du formulaire et de l'envoie vers la page confirmation

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

// Champs demanadés pour le POST
let contact = {
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  email: "",
};

// Event au click
btn_order.addEventListener("click", (e) => {
  e.preventDefault();

  // Création d'une classe pour fabriquer l'objet dans lequel iront les values du formulaire
  class Form {
    constructor() {
      this.firstName = first_name.value;
      this.lastName = last_name.value;
      this.address = address.value;
      this.city = city.value;
      this.email = e_mail.value;
    }
  }
  // Appel de l'instance de classe Formulaire pour créer l'objet formulaire_value
  const FORM_VALUE = new Form();

  // Const regEx pour le formulaire
  const REG_EX_LAST_FIRST_NAME = (value) => {
    return /^[A-Za-z]{3,20}$/.test(value);
  };
  const REG_EX_CITY = (value) => {
    return /^[A-Za-zéèàïêç\-\s]{2,50}\s+[0-9]{5}$/.test(value);
  };
  const REG_EX_ADDRESS = (value) => {
    return /^[0-9]{1,5}\s+[A-Za-zéèàïêç\-\s]{2,50}$/.test(value);
  };
  const REG_EX_E_MAIL = (value) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
  };

  // Controle de la validité name
  function firstNameControle() {
    let name_form = FORM_VALUE.firstName;
    if (REG_EX_LAST_FIRST_NAME(name_form)) {
      first_name_error.innerHTML = "";
      return true;
    } else {
      first_name_error.innerHTML =
        "Le prénom doit avoir 3 lettres minimum et pas de caractère spéciaux ou chiffres";
      return false;
    }
  }

  // Controle de la validité lastName
  function lastNameControle() {
    let last_name_form = FORM_VALUE.lastName;
    if (REG_EX_LAST_FIRST_NAME(last_name_form)) {
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
    let address_form = FORM_VALUE.address;
    if (REG_EX_ADDRESS(address_form)) {
      address_error.innerHTML = "";
      return true;
    } else {
      address_error.innerHTML =
        "merci de renseigner votre adresse de max 50 caractères et débutant par des chiffres";
      return false;
    }
  }

  // Controle de la validité city
  function cityControle() {
    let city_form = FORM_VALUE.city;
    if (REG_EX_CITY(city_form)) {
      city_error.innerHTML = "";
      return true;
    } else {
      city_error.innerHTML =
        `Merci de renseigner votre ville et votre code postal, exemple : "Paris 00000 "`;
      return false;
    }
  }

  // Controle de la validité email
  function emailControle() {
    let email_form = FORM_VALUE.email;
    if (REG_EX_E_MAIL(email_form)) {
      e_mail_error.innerHTML = "";
      return true;
    } else {
      e_mail_error.innerHTML =
        "Email non valide, il doit contenir un @ et 1 point suivi de maxixum 3 lettres";
      return false;
    }
  }

  // Vérification si la fonction return vrai ou faux
  if (
    !firstNameControle() ||
    !lastNameControle() ||
    !adressControle() ||
    !cityControle() ||
    !emailControle()
  ) {
    return null;
  }
  //-------------------------------------------------

  // Push uniquement les Id dans le tableau des produits
  let products = [];
  for (let article_select of cart) {
    products.push(article_select.id);
  }

  // Envoie de l'objet order vers le serveur
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contact: FORM_VALUE,
      products: products,
    }),
  }).then(async (response) => {
    try {
      const POST_ORDER = await response.json();
      let orderId = POST_ORDER.orderId;

      // Clear le localStorage
      localStorage.clear();
      window.location.assign("confirmation.html?id=" + orderId);
    } catch (e) {
      console.log(e);
    }
  });
});
