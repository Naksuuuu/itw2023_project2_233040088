const menuToggle = document.querySelector('.nav-toggle span');
const navList = document.querySelector('.nav-item');
let toggleOpen = false;

menuToggle.addEventListener('click', () => {
  if (toggleOpen) {
    navList.style.top = '-100vh';
    menuToggle.textContent = 'menu';
  } else {
    navList.style.top = '0';
    menuToggle.textContent = 'close';
  }

  toggleOpen = !toggleOpen;
});

const navItem = document.querySelectorAll('.nav-item ul li a');
navItem.forEach((items) => {
  items.addEventListener('click', () => {
    if (toggleOpen == true) {
      navList.style.top = '-100vh';
      menuToggle.textContent = 'menu';
      toggleOpen = false;
    }
    items.classList.toggle('active');
  });
});

// slide nav

const section = Array.from(document.querySelectorAll('section'));
window.addEventListener('scroll', () => {
  section.forEach((sec) => {
    const top = window.scrollY;
    const offset = sec.offsetTop - 200;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');

    if (top >= offset && top < offset + height) {
      navItem.forEach((links) => {
        links.classList.remove('active');
        document.querySelector('.nav-item ul li a[href*=' + id + ']').classList.add('active');
      });
    }
  });
});

// animation navbrand

const navBrand = document.querySelector('li.brand');
const charNavBrand = [...navBrand.textContent];

let containerChar = [];
charNavBrand.forEach((char, index) => {
  navBrand.textContent = '';
  containerChar.push(`<span style="animation-delay: ${index * 600}ms">${char}</span>`);
  if (index == 11) {
    navBrand.innerHTML = containerChar.join('');
  }
});

// card

window.addEventListener('load', async () => {
  const cards = await getCard();
  updateUi(cards);
});

function getCard() {
  return fetch('/asset/data.json')
    .then((response) => response.json())
    .then((response) => response.Cake);
}

function updateUi(cards) {
  let card = '';
  cards.forEach((m) => {
    card += showCard(m);
  });
  const cardContainer = document.querySelector('.cards');
  cardContainer.innerHTML = card;
}

function showCard(m) {
  return `<div class="card">
  <div class="card-heading">
    <img src="${m.Img}" alt="" />
  </div>
  <div class="card-text">
    <h3>${m.Type}</h3>
    <p>${m.Description}</p>
  </div>
  <div class="divider"></div>
  <div class="card-text price-cart w100">
    <p>${m.Price}</p>
    <button class="cart" data-id="${m.Id}">
    <p>Add to Cart
    </p>
    <span class="material-symbols-outlined"> shopping_cart </span>
    </button>
  </div>
</div>`;
}

// shopping cart

const cartToggle = document.querySelector('.cart-toggle');
const sectionNotCart = [];
let secCart = '';
section.forEach((sec, i) => {
  if (i < 6) {
    sectionNotCart.push(sec);
  } else {
    secCart = sec;
  }
});

let cartVisible = true;

cartToggle.addEventListener('click', () => {
  sectionNotCart.forEach((sec) => {
    if (cartVisible) {
      sec.style.display = 'none';
      secCart.style.display = 'flex';
    } else {
      sec.style.display = 'flex';
      secCart.style.display = 'none';
    }
  });
  cartVisible = !cartVisible;
  secOpenAgain(sectionNotCart, secCart);
});

function secOpenAgain(sectionNotCart, secCart) {
  const navSection = document.querySelector('.nav-item ul');
  const itemNav = Array.from(navSection.children);
  itemNav.forEach((item, i) => {
    if (i < 6) {
      item.addEventListener('click', () => {
        sectionNotCart.forEach((sec) => {
          sec.style.display = 'flex';
          secCart.style.display = 'none';
        });
      });
    }
    cartVisible = !cartVisible;
  });
}

// show page cart

window.addEventListener('click', async function (e) {
  const isButtonCart = e.target.classList.contains('cart') || e.target.closest('.cart');
  if (isButtonCart) {
    const dataSet = e.target.dataset.id || isButtonCart.dataset.id;
    const cartTarget = await cardToCart(dataSet);
    filteringCart(cartTarget);
  }
});

function cardToCart(id) {
  return fetch('/asset/data.json')
    .then((response) => response.json())
    .then((response) => response.Cake)
    .then((response) => response[id]);
}

let cartArr = [];
function filteringCart(cartItems) {
  if (!checkCart(cartItems)) {
    cartArr.push(cartItems);
    updateUiCart(cartArr);
  } else if (checkCart(cartItems)) {
    alert('Item sudah masuk di cart, jika ingin menambah jumlah pembelian silahkan di halaman cart');
  }
}

function updateUiCart(cartArr) {
  const isiCart = document.querySelector('.wrapper.cart-items');
  isiCart.innerHTML = '';
  cartArr.forEach((m) => {
    isiCart.innerHTML += showInCart(m);
  });
}

function checkCart(cart) {
  return cartArr.some((item) => item.Id === cart.Id);
}

function showInCart(m) {
  return `<div class="grid-parent w100">
  <div class="tabel-heading">
    <p>Detail Produk</p>
  </div>
  <div class="tabel-heading two">
    <p>Rincian Biaya</p>
  </div>
  <div class="tabel-product">
    <div class="img-cart">
      <img src="${m.Img}" alt="" />
    </div>
    <p>${m.Type}</p>
  </div>
  <div class="tabel-product two">
    <div class="cart-price">
      <p><span  class="price-value">${m.Price}</span> x <span class="price-quantity">1</span></p>
    </div>
    <div class="quantity">
      <p><span class="material-symbols-outlined operator minus"> remove </span></p>
      <p class="quantity-value">1</p>
      <p><span class="material-symbols-outlined operator plus"> add </span></p>
    </div>
  </div>
</div>`;
}

// quantity detailing

window.addEventListener('click', (e) => {
  if (e.target.classList.contains('operator')) {
    const tabelProduct = e.target.closest('.tabel-product');

    if (!tabelProduct) {
      return;
    }

    const valQuantity = tabelProduct.querySelector('.quantity-value');
    const priceQuantity = tabelProduct.querySelector('.price-quantity');

    if (e.target.classList.contains('plus')) {
      quantityPlus(valQuantity, priceQuantity);
    } else {
      quantityMinus(valQuantity, priceQuantity);
    }
  }
});

function quantityPlus(valQuantity, priceQuantity) {
  valQuantity.textContent = parseInt(valQuantity.textContent) + 1;
  priceQuantity.textContent = valQuantity.textContent;
}

function quantityMinus(valQuantity, priceQuantity) {
  if (valQuantity.textContent == 1) {
    return;
  }

  valQuantity.textContent = parseInt(valQuantity.textContent) - 1;
  priceQuantity.textContent = valQuantity.textContent;
}
// total price

const containerTotalPay = document.querySelector('.total-cart');
const cekIsiItem = containerTotalPay.previousElementSibling;
cartToggle.addEventListener('click', () => {
  if (cekIsiItem.textContent == '') {
    cekIsiItem.textContent = 'Empty';
  } else {
    const isiNya = Array.from(cekIsiItem.children);
    isiNya.forEach((item, index) => {
      getPrice(item, index);
      window.addEventListener('click', (e) => {
        if (e.target.classList.contains('operator')) {
          getPrice(item, index);
        }
      });
    });
  }
});

let tampungBiaya = [];

function getPrice(item, index) {
  const priceStr = item.querySelector('.price-value').textContent;
  const quantityStr = item.querySelector('.price-quantity').textContent;
  const priceNumber = parseFloat(priceStr.replace('.', ''));
  const quantityNumber = parseInt(quantityStr.replace('.', ''));
  const totalBiayaItem = priceNumber * quantityNumber;
  if (tampungBiaya[index] !== undefined) {
    tampungBiaya[index] = totalBiayaItem;
  } else {
    tampungBiaya[index] = totalBiayaItem;
  }

  updateTotalBiaya();
}

function updateTotalBiaya() {
  const containerBiaya = document.querySelector('.total-amount');
  const totalBiaya = tampungBiaya.reduce((acc, curr) => acc + curr, 0);
  const totalbiayaRupiah = formatRupiah(totalBiaya);
  containerBiaya.textContent = totalbiayaRupiah;
}

function formatRupiah(biaya) {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  });

  return formatter.format(biaya);
}

// total item

const totalItem = document.querySelector('.total-items');

cartToggle.addEventListener('click', () => {
  const coba2 = document.querySelector('.cart-items');
  if (coba2.textContent == 'Empty') {
    totalItem.textContent = '0';
  } else {
    const coba3 = Array.from(coba2.children);
    coba3.forEach((item, index) => {
      hitungItem(item, index);
      window.addEventListener('click', (e) => {
        if (e.target.classList.contains('operator')) {
          hitungItem(item, index);
        }
      });
    });
  }
});

let totalItemsArr = [];
function hitungItem(item, index) {
  const testes = item.querySelectorAll('.quantity-value');
  testes.forEach((m) => {
    if (totalItemsArr[index] != undefined) {
      totalItemsArr[index] = parseInt(m.textContent);
    } else {
      // totalItemsArr[index] = parseInt(m.textContent);
      totalItemsArr.push(parseInt(m.textContent));
    }
    masukanKeHtml();
  });
}

function masukanKeHtml() {
  const hasilHitung = totalItemsArr.reduce((a, b) => a + b, 0);

  totalItem.textContent = hasilHitung;
}

// form animation

const labelName = document.querySelectorAll('.form-group label');
const formContainer2 = Array.from(labelName);
const label = Array.from(labelName).map((item) => item.textContent);

function coba(label, container) {
  container.forEach((element, i) => {
    const element2 = label[i];
    const ch = [...element2].map((char, index) => {
      if (char.trim() === '') {
        return `<span class="space">${char}i</span>`;
      } else {
        return `<span style="transition-delay:${index * 30}ms">${char}</span>`;
      }
    });

    element.innerHTML = ch.join(' ');
  });
}

coba(label, formContainer2);

// button in Cart

const buttonSend = document.querySelector('.form-send .button-send');
const inputValueName = document.querySelector('.form-send form #name');
const inputValueAlamat = document.querySelector('.form-send form #alamat');
const inputValueDeskripsi = document.querySelector('.form-send form #deskripsi');
buttonSend.addEventListener('click', () => {
  buttonSend.style.backgroundColor = 'grey';
  setTimeout(() => {
    buttonSend.style.backgroundColor = '';
  }, 500);
});

inputValueName.addEventListener('input', () => {
  cekInput();
});

inputValueAlamat.addEventListener('input', () => {
  cekInput();
});

function cekInput() {
  const isInputValid = inputValueName.value != '' && inputValueAlamat.value != '';
  if (isInputValid) {
    buttonSend.style.backgroundColor = 'royalblue';
    buttonSend.addEventListener('click', async (btn) => {
      btn.preventDefault();
      if (isInputValid) {
        await buttonStyle();
      }
      setTimeout(waitUiUpdate, 2000);
    });
  } else {
    buttonSend.style.backgroundColor = '';
  }
}

function waitUiUpdate() {
  const imgContainer = buttonSend.querySelector('.svg-wrapper');
  const imgSvg = buttonSend.querySelector('.send-logo');
  const spanBtn = buttonSend.querySelector('span');

  const containerCake = document.querySelector('.cart-items');
  if (containerCake.textContent !== 'Empty') {
    resetTotalItem(containerCake);
  }

  inputValueName.value = '';
  inputValueAlamat.value = '';
  inputValueDeskripsi.value = '';
  imgContainer.style.animation = '';
  spanBtn.style.transform = '';
  buttonSend.style.transform = '';
  imgSvg.style.transform = '';
}

function resetTotalItem(containerCake) {
  const totalItem = document.querySelector('.total-items');
  const totalAmount = document.querySelector('.total-amount');
  totalAmount.textContent = '0';
  totalItem.textContent = '0';
  const childCake = Array.from(containerCake.children);
  childCake.forEach((cake) => {
    containerCake.removeChild(cake);
  });
  containerCake.textContent = 'Empty';
}

function buttonStyle() {
  const imgContainer = buttonSend.querySelector('.svg-wrapper');
  const imgSvg = buttonSend.querySelector('.send-logo');
  const spanBtn = buttonSend.querySelector('span');

  imgContainer.style.animation = 'fly-1 0.6s ease-in-out infinite alternate';
  spanBtn.style.transform = 'translateX(10em)';
  buttonSend.style.transform = 'scale(0.95)';
  imgSvg.style.transform = 'translateX(4.7em) rotate(-45deg) scale(1.1)';
}

// button from

const inputContact = Array.from(document.querySelectorAll('.form-contact input'));
const textAreaContact = document.querySelector('.form-contact textarea');
const btnMsg = document.querySelector('.button-message');

inputContact.forEach((input) => {
  input.addEventListener('input', checkInput);
});

textAreaContact.addEventListener('input', checkInput);

function checkInput() {
  const allInput = inputContact.every((input) => input.value.trim() !== '');
  if (allInput && textAreaContact.value.trim() !== '') {
    btnMsg.style.backgroundColor = 'royalblue';
    const initialTextBtn = btnMsg.textContent;
    btnMsg.addEventListener('click', async (btn) => {
      btn.preventDefault();
      btnMsg.textContent = 'Pesan terkirim!';
      await resetInput();
      btnMsg.style.backgroundColor = '';
      btnMsg.textContent = initialTextBtn;
    });
  } else {
    btnMsg.style.backgroundColor = '';
  }
}

function resetInput() {
  return new Promise((resolve) => {
    setTimeout(() => {
      textAreaContact.value = '';
      inputContact.forEach((input) => {
        input.value = '';
      });
      resolve();
    }, 1000);
  });
}

// test

// const testestes = document.querySelector('a.btn-to-catalog');
// testestes.addEventListener('click', () => {
//   console.log(testestes);
// });

window.addEventListener('click', (e) => {
  console.log(e.target);
});
