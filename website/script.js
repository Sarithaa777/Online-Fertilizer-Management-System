function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
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

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    alert(`Thank you, ${name}! We have received your message.`);
    this.reset();
});
