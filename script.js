// Banco de dados dos produtos
const products =;

let cart = JSON.parse(localStorage.getItem('pied_cart')) ||;

function renderProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = products.map(p => `
        <div class="product-card">
            <img src="${p.img}" alt="${p.name}" class="product-img">
            <h3>${p.name}</h3>
            <span class="product-price">R$ ${p.price.toFixed(2)}</span>
            <button class="btn-buy" onclick="addToCart(${p.id})">Adicionar</button>
        </div>
    `).join('');
}

function addToCart(id) {
    const item = products.find(p => p.id === id);
    cart.push(item);
    updateCart();
}

function updateCart() {
    localStorage.setItem('pied_cart', JSON.stringify(cart));
    document.getElementById('cart-count').innerText = cart.length;
    renderCart();
}

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    let total = 0;
    cartItems.innerHTML = cart.map((item, index) => {
        total += item.price;
        return `<div style="display:flex; justify-content:space-between; margin-bottom:10px">
                    <span>${item.name}</span>
                    <b>R$ ${item.price.toFixed(2)}</b>
                </div>`;
    }).join('');
    document.getElementById('cart-total').innerText = `R$ ${total.toFixed(2)}`;
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = modal.style.display === 'block'? 'none' : 'block';
}

function checkoutWhatsApp() {
    if (cart.length === 0) return alert("Carrinho vazio!");
    let message = "*NOVO PEDIDO PIED STORE*%0A%0A";
    cart.forEach(item => message += `• ${item.name} - R$ ${item.price}%0A`);
    message += `%0A*TOTAL: ${document.getElementById('cart-total').innerText}*`;
    
    const phone = "5579999999999"; // Substitua pelo seu celular de Aracaju
    window.open(`https://wa.me/${phone}?text=${message}`);
    cart =;
    updateCart();
    toggleCart();
}

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCart();
});
