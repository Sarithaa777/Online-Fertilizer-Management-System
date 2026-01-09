function goBack() {
    window.location.href = 'index.html';
}
let cartItems = [];

function addToCart(productName) {
    cartItems.push(productName);
    updateCart();
}

function updateCart() {
    const cart = document.getElementById('cart');
    cart.innerHTML = '';
    cartItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        cart.appendChild(li);
    });
}