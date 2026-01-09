function addToCart(name, price, expiry, company, description, components, howItWorks) {
    // Encode product details in the URL
    const url = `cart.html?name=${encodeURIComponent(name)}&price=${encodeURIComponent(price)}&expiry=${encodeURIComponent(expiry)}&company=${encodeURIComponent(company)}&description=${encodeURIComponent(description)}&components=${encodeURIComponent(components)}&howItWorks=${encodeURIComponent(howItWorks)}`;

    // Redirect to cart.html with product details
    window.location.href = url;
}
