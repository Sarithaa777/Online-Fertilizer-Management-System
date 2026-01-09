document.addEventListener("DOMContentLoaded", function () {
    // Get URL parameters
    const params = new URLSearchParams(window.location.search);
    
    // Set product details in HTML
    document.getElementById("product-name").textContent = params.get("name");
    document.getElementById("product-price").textContent = params.get("price");
    document.getElementById("product-expiry").textContent = params.get("expiry");
    document.getElementById("product-company").textContent = params.get("company");
    document.getElementById("product-description").textContent = params.get("description");
    document.getElementById("product-components").textContent = params.get("components");
    document.getElementById("product-howItWorks").textContent = params.get("howItWorks");
});
