let openShopping = document.querySelector('.shopping');
let closeShopping = document.querySelector('.closeShopping');
let list = document.querySelector('.list');
let listCard = document.querySelector('.listCard');
let body = document.querySelector('body');
let total = document.querySelector('.total');
let quantity = document.querySelector('.quantity');

openShopping.addEventListener('click', ()=>{
    body.classList.add('active');
})
closeShopping.addEventListener('click', ()=>{
    body.classList.remove('active');
})

let products = [
    {
        id: 1,
        name: 'PRODUCT NAME 1',
        image: '1.png',
        price: 70
    },
    {
        id: 2,
        name: 'PRODUCT NAME 2',
        image: '2.png',
        price: 120
    },
    {
        id: 3,
        name: 'PRODUCT NAME 3',
        image: '3.png',
        price: 90
    },
    {
        id: 4,
        name: 'PRODUCT NAME 4',
        image: '4.png',
        price: 60
    },
    {
        id: 5,
        name: 'PRODUCT NAME 5',
        image: '5.png',
        price: 80
    },
    {
        id: 6,
        name: 'PRODUCT NAME 6',
        image: '6.png',
        price: 120
    }
];
let listCards  = [];
function initApp(){
    console.log(products)
    products.forEach((value, key) =>{
        let newDiv = document.createElement('div');
        newDiv.classList.add('item');
        console.log(value)
        newDiv.innerHTML = `
            <img src="./public/images/${value.image}">
            <div class="title">${value.name}</div>
            <div class="price">price: ${value.price.toLocaleString()}</div>
            <button onclick="buy(${key})">BUY</button>`;
        list.appendChild(newDiv);
    })
}
initApp();
function buy(key){
    if(listCards[key] == null){
        // copy product form list to list card
        listCards[key] = JSON.parse(JSON.stringify(products[key]));
        listCards[key].quantity = 1;
    }
    reloadCard();
}
function reloadCard(){
    listCard.innerHTML = '';
    let count = 0;
    let totalPrice = 0;
    listCards.forEach((value, key)=>{
        totalPrice = totalPrice + value.price;
        count = count + value.quantity;
        if(value != null){
            let newDiv = document.createElement('li');
            newDiv.innerHTML = `
                <div><img src="./images/${value.image}"/></div>
                <div>${value.name}</div>
                <div>${value.price.toLocaleString()}</div>
                <div>
                    <button onclick="changeQuantity(${key}, ${value.quantity - 1})">-</button>
                    <div class="count">${value.quantity}</div>
                    <button onclick="changeQuantity(${key}, ${value.quantity + 1})">+</button>
                </div>`;
                listCard.appendChild(newDiv);
        }
    })
    total.innerText = totalPrice.toLocaleString();
    quantity.innerText = count;
}
function changeQuantity(key, quantity){
    if(quantity == 0){
        delete listCards[key];
    }else{
        listCards[key].quantity = quantity;
        listCards[key].price = quantity * products[key].price;
    }
    reloadCard();
}




function initiateRazorpayPayment(amount) {
  var options = {
    key: 'rzp_test_XsEnXjyLpNboqx',
    amount: amount * 100, 
    currency: 'INR', 
    name: 'Your Store Name',
    description: 'Payment for products',
    image: '', 
    handler: function (response) {
      alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
    },
    prefill: {
      name: 'Customer Name',
      email: 'customer@email.com',
      contact: 'customer_phone_number',
    },
  };
  var rzp = new Razorpay(options);
  rzp.open();
}

document.getElementById('payment').addEventListener('click', function () {
  const totalAmount = parseFloat(total.innerText.replace(/,/g, '')); 
  if (totalAmount > 0) {
    initiateRazorpayPayment(totalAmount);
  } else {
    alert('Your cart is empty. Add products before making a payment.');
  }
});
