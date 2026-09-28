// ======================================================
// YAPA - MENÚ DIGITAL
// ======================================================

// Número de WhatsApp con código de país.
// Solo números, sin +, espacios ni guiones.
const WHATSAPP_NUMBER = "59164811633";


// ======================================================
// PRODUCTOS
// ======================================================

const products = [

  {
    id:'choripan',
    name:'Choripán',
    price:10,
    cat:'comida',
    img:'assets/01_choripan.png',
    desc:'Pan francés con chorizo argentino.'
  },

  {
    id:'sandwich_milanesa',
    name:'Sándwich de milanesa',
    price:10,
    cat:'comida',
    img:'assets/04_milanesa.png',
    desc:'Pan francés con milanesa hecha en casa.'
  },

  {
    id:'trancapecho',
    name:'Trancapecho',
    price:15,
    cat:'comida',
    img:'assets/03_trancapecho.png',
    desc:'Pan francés con silpancho, huevo frito, papa en rodajas y arroz.'
  },

  {
    id:'sandwich_lomito',
    name:'Sándwich de lomito',
    price:15,
    cat:'comida',
    img:'assets/02_lomito.png',
    desc:'Pan francés con filete de lomo y huevo frito.'
  },

  {
    id:'lomito',
    name:'Lomito',
    price:15,
    cat:'comida',
    img:'assets/17_lomito.png',
    desc:'Arroz, papa, filete de lomo y huevo frito.'
  },

  {
    id:'silpancho',
    name:'Silpancho',
    price:15,
    cat:'comida',
    img:'assets/16_silpancho.png',
    desc:'Silpancho con huevo frito, papa en rodajas y arroz.'
  },

  {
    id:'sandwich_milanesa_napo',
    name:'Sándwich de milanesa napolitana',
    price:15,
    cat:'comida',
    img:'assets/18_sandwich_milanesa_napo.png',
    desc:'Pan francés con milanesa hecha en casa, jamón y queso mozzarella.'
  },

  {
    id:'salchipapa',
    name:'Salchipapa',
    price:15,
    cat:'comida',
    img:'assets/05_salchipapa.png',
    desc:'Salchicha acompañada con papa frita.'
  },

  {
    id:'pollo',
    name:'Pollo a la canasta',
    price:25,
    cat:'comida',
    img:'assets/06_pollo.png',
    desc:'1/8 de pollo frito acompañado con papas fritas.'
  },


  // ====================================================
  // BEBIDAS
  // ====================================================

  {
    id:'coca300',
    name:'Coca-Cola 300 ml',
    price:5,
    cat:'bebida',
    img:'assets/09_coca_cola_300ml.png',
    desc:'Coca-Cola 300 ml.'
  },

  {
    id:'fanta300',
    name:'Fanta 300 ml',
    price:5,
    cat:'bebida',
    img:'assets/10_fanta_300ml.png',
    desc:'Fanta 300 ml.'
  }

];


// ======================================================
// CARRITO Y MODALIDAD
// ======================================================

let cart = [];
let serviceType = 'Para llevar';


// ======================================================
// SELECCIONAR PARA LLEVAR / DELIVERY
// ======================================================

function selectService(type){

  serviceType = type;

  const radio = document.querySelector(
    `input[name="serviceType"][value="${type}"]`
  );

  if(radio){
    radio.checked = true;
  }

  const menu = document.getElementById('menu');

  if(menu){
    menu.scrollIntoView({
      behavior:'smooth'
    });
  }
}


// ======================================================
// FORMATO DE PRECIO
// ======================================================

function money(p){

  if(p == null){
    return 'Consultar';
  }

  return 'Bs ' + p.toFixed(0);
}


// ======================================================
// MOSTRAR PRODUCTOS
// ======================================================

function render(filter='todos'){

  const el = document.getElementById('products');

  if(!el){
    return;
  }

  el.innerHTML = '';

  products
    .filter(p => filter === 'todos' || p.cat === filter)
    .forEach(p => {

      el.insertAdjacentHTML(
        'beforeend',
        `
        <article class="product">

          <div class="product-img">
            <img
              src="${p.img}"
              alt="${p.name}"
            >
          </div>

          <div class="product-body">

            <h3>${p.name}</h3>

            <p>${p.desc}</p>

            <div class="product-bottom">

              <span class="price">
                ${money(p.price)}
              </span>

              <button
                class="add"
                type="button"
                aria-label="Agregar ${p.name}"
                onclick="add('${p.id}')"
              >
                +
              </button>

            </div>

          </div>

        </article>
        `
      );

    });
}


// ======================================================
// AGREGAR PRODUCTO
// ======================================================

function add(id){

  const product = products.find(x => x.id === id);

  if(!product){
    return;
  }

  const existing = cart.find(x => x.id === id);

  if(existing){
    existing.qty++;
  }else{
    cart.push({
      ...product,
      qty:1
    });
  }

  updateCart();
}


function removeOne(id){

  const item = cart.find(x => x.id === id);

  if(!item) return;

  item.qty--;

  if(item.qty <= 0){
    cart = cart.filter(x => x.id !== id);
  }

  updateCart();

  if(cart.length === 0){
    closeModal();
  }else{
    sendOrder();
  }
}

function removeProduct(id){

  cart = cart.filter(x => x.id !== id);

  updateCart();

  if(cart.length === 0){
    closeModal();
  }else{
    sendOrder();
  }
}

function cancelOrder(){

  if(cart.length === 0) return;

  const confirmCancel = confirm(
    '¿Seguro que quieres cancelar todo el pedido?'
  );

  if(!confirmCancel) return;

  cart = [];

  updateCart();

  closeModal();
}


// ======================================================
// ACTUALIZAR BARRA DEL CARRITO
// ======================================================

function updateCart(){

  const count = cart.reduce(
    (total,item) => total + item.qty,
    0
  );

  const total = cart.reduce(
    (sum,item) => sum + (item.price || 0) * item.qty,
    0
  );

  const cartCount = document.getElementById('cartCount');
  const cartTotal = document.getElementById('cartTotal');
  const cartbar = document.getElementById('cartbar');

  if(cartCount){
    cartCount.textContent =
      `${count} ${count === 1 ? 'producto' : 'productos'}`;
  }

  if(cartTotal){
    cartTotal.textContent =
      total ? `Bs ${total}` : 'Pedido';
  }

  if(cartbar){
    cartbar.classList.toggle(
      'show',
      count > 0
    );
  }
}


// ======================================================
// MOSTRAR RESUMEN DEL PEDIDO
// ======================================================

function sendOrder(){

  if(cart.length === 0){
    alert('Primero agrega productos a tu pedido.');
    return;
  }

  const box = document.getElementById('orderItems');

  box.innerHTML = cart.map(x => {

    const subtotal = (x.price || 0) * x.qty;

    return `
      <div class="order-row">
        <div>
          <b>${x.qty} x ${x.name}</b>
          <div style="margin-top:6px;">
            <button
              type="button"
              onclick="removeOne('${x.id}')"
              style="
                border:none;
                background:#eee;
                padding:6px 10px;
                border-radius:8px;
                cursor:pointer;
                font-weight:700;
              "
            >
              −
            </button>

            <button
              type="button"
              onclick="removeProduct('${x.id}')"
              style="
                border:none;
                background:#f3dede;
                color:#a33;
                padding:6px 10px;
                border-radius:8px;
                cursor:pointer;
                font-weight:700;
                margin-left:6px;
              "
            >
              Quitar
            </button>
          </div>
        </div>

        <b>
          ${x.price ? `Bs ${subtotal}` : 'Consultar'}
        </b>
      </div>
    `;
  }).join('');

  const total = cart.reduce(
    (sum,item) => sum + (item.price || 0) * item.qty,
    0
  );

  const orderTotal = document.getElementById('orderTotal');

  if(orderTotal){
    orderTotal.textContent = total ? `Bs ${total}` : 'A confirmar';
  }

  const radio = document.querySelector(
    `input[name="serviceType"][value="${serviceType}"]`
  );

  if(radio){
    radio.checked = true;
  }

  const modal = document.getElementById('orderModal');

  if(modal){
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
  }
}


// ======================================================
// CERRAR MODAL
// ======================================================

function closeModal(){

  const modal =
    document.getElementById('orderModal');

  if(modal){

    modal.classList.remove('show');

    modal.setAttribute(
      'aria-hidden',
      'true'
    );

  }

}


// ======================================================
// CREAR MENSAJE DE WHATSAPP
// ======================================================

function orderText(){

  const selected = document.querySelector(
    'input[name="serviceType"]:checked'
  );

  serviceType = selected ? selected.value : 'Para llevar';

  let message = 'Hola YAPA. Quiero hacer este pedido:\n\n';

  cart.forEach(item => {
    const subtotal = (item.price || 0) * item.qty;

    message += `${item.qty} x ${item.name}`;

    if(item.price){
      message += ` - Bs ${subtotal}`;
    }

    message += '\n';
  });

  const total = cart.reduce(
    (sum,item) => sum + (item.price || 0) * item.qty,
    0
  );

  if(total){
    message += `\nTotal referencial: Bs ${total}\n`;
    message += `Anticipo requerido (50%): Bs ${(total/2).toFixed(0)}\n`;
  }

  message += `\nModalidad: ${serviceType}\n`;

  if(serviceType === 'Delivery'){
    message += 'Por favor, indícame tu ubicación para confirmar el envío.\n';
  }else{
    message += 'Pasaré a recoger mi pedido.\n';
  }

  message += 'Realizaré el anticipo por QR y enviaré el comprobante por este medio.\n';
  message += '¿Me confirman disponibilidad y tiempo?';

  return message;
}


// ======================================================
// ABRIR WHATSAPP
// ======================================================

function openWhatsApp(withOrder=false){

  if(!WHATSAPP_NUMBER){

    alert(
      'Falta configurar el número de WhatsApp de YAPA.'
    );

    return;

  }


  let message;


  if(withOrder){

    if(cart.length === 0){

      alert(
        'Primero agrega productos a tu pedido.'
      );

      return;

    }

    message = orderText();

  }else{

    message =
      'Hola YAPA. Quiero hacer un pedido. Entiendo que para confirmar solicitan 50% de anticipo por QR. ¿Me ayudan por favor?';

  }


  // IMPORTANTE:
  // Aquí codificamos TODO el mensaje una sola vez.
  // Esto evita los símbolos rotos �.

  const encodedMessage =
    encodeURIComponent(message);


  const url =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;


  window.open(
    url,
    '_blank'
  );

}


// ======================================================
// FILTROS TODOS / COMIDA / BEBIDAS
// ======================================================

document
  .querySelectorAll('.cat')
  .forEach(button => {

    button.addEventListener(
      'click',
      () => {

        document
          .querySelectorAll('.cat')
          .forEach(x =>
            x.classList.remove('active')
          );


        button.classList.add('active');


        render(
          button.dataset.filter
        );

      }
    );

  });


// ======================================================
// CAMBIO PARA LLEVAR / DELIVERY
// ======================================================

document.addEventListener(
  'change',
  event => {

    if(
      event.target.name ===
      'serviceType'
    ){

      serviceType =
        event.target.value;

    }

  }
);


// ======================================================
// INICIAR
// ======================================================

render();
updateCart();
