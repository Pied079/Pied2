// ============================================
// CONFIGURAÇÕES GERAIS
// ============================================

const PHONE_NUMBER = "5579996300185"; // Altere para seu WhatsApp

// Banco de dados dos produtos
const products = [
    {
        id: 1,
        name: "Camiseta PIED Red",
        category: "camisetas",
        price: 89.90,
        img: "https://via.placeholder.com/300x300?text=Camiseta+Red",
        description: "Camiseta premium em algodão 100% com logo bordado"
    },
    {
        id: 2,
        name: "Camiseta PIED Black",
        category: "camisetas",
        price: 89.90,
        img: "https://via.placeholder.com/300x300?text=Camiseta+Black",
        description: "Camiseta premium em algodão 100% com logo bordado"
    },
    {
        id: 3,
        name: "Boné PIED Red",
        category: "bones",
        price: 129.90,
        img: "https://via.placeholder.com/300x300?text=Bone+Red",
        description: "Boné estruturado com aba curva"
    },
    {
        id: 4,
        name: "Boné PIED Black",
        category: "bones",
        price: 129.90,
        img: "https://via.placeholder.com/300x300?text=Bone+Black",
        description: "Boné estruturado com aba curva"
    },
    {
        id: 5,
        name: "Corrente PIED",
        category: "acessorios",
        price: 199.90,
        img: "https://via.placeholder.com/300x300?text=Corrente",
        description: "Corrente de prata 925 com pingente PIED"
    },
    {
        id: 6,
        name: "Pulseira PIED",
        category: "acessorios",
        price: 79.90,
        img: "https://via.placeholder.com/300x300?text=Pulseira",
        description: "Pulseira de couro premium"
    }
];

// ============================================
// GERENCIAMENTO DE CARRINHO
// ============================================

let cart = JSON.parse(localStorage.getItem('pied_cart')) || [];

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const emptyCart = document.getElementById('empty-cart');
    const cartItems = document.getElementById('cart-items');
    const checkoutBtn = document.getElementById('checkout-btn');

    cartCount.innerText = cart.length;

    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartItems.innerHTML = '';
        if (checkoutBtn) checkoutBtn.disabled = true;
    } else {
        emptyCart.style.display = 'none';
        if (checkoutBtn) checkoutBtn.disabled = false;
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Verifica se o produto já está no carrinho
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    renderCart();
    updateCartUI();
    
    // Feedback visual
    showNotification('Produto adicionado ao carrinho!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
    updateCartUI();
}

function updateQuantity(productId, quantity) {
    const item = cart.find(p => p.id === productId);
    if (item) {
        item.quantity = Math.max(1, parseInt(quantity));
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            renderCart();
        }
    }
}

function saveCart() {
    localStorage.setItem('pied_cart', JSON.stringify(cart));
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
}

function getCartSubtotal() {
    return getCartTotal();
}

function getShippingCost() {
    const total = getCartTotal();
    if (total === 0) return 0;
    if (total > 200) return 0; // Frete grátis acima de R$ 200
    return 15.00;
}

// ============================================
// RENDERIZAÇÃO DE PRODUTOS
// ============================================

function renderProducts(filter = 'all') {
    const productList = document.getElementById('product-list');
    const noProducts = document.getElementById('no-products');

    let filtered = products;
    if (filter !== 'all') {
        filtered = products.filter(p => p.category === filter);
    }

    if (filtered.length === 0) {
        noProducts.style.display = 'block';
        productList.innerHTML = '';
        return;
    }

    noProducts.style.display = 'none';
    productList.innerHTML = filtered.map(product => `
        <div class="product-card" onclick="openProductModal(${product.id})">
            <div class="product-image">
                <img src="${product.img}" alt="${product.name}" class="product-img">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">R$ ${product.price.toFixed(2)}</span>
                    <button class="btn-add" onclick="event.stopPropagation(); addToCart(${product.id})">
                        <i class="ri-add-line"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================
// RENDERIZAÇÃO DO CARRINHO
// ============================================

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('cart-total');

    if (cart.length === 0) {
        cartItems.innerHTML = '';
        subtotalEl.innerText = 'R$ 0,00';
        shippingEl.innerText = 'R$ 0,00';
        totalEl.innerText = 'R$ 0,00';
        return;
    }

    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div class="cart-item__image">
                <img src="${item.img}" alt="${item.name}">
            </div>
            <div class="cart-item__details">
                <h4>${item.name}</h4>
                <span class="cart-item__price">R$ ${item.price.toFixed(2)}</span>
            </div>
            <div class="cart-item__quantity">
                <button onclick="updateQuantity(${item.id}, ${(item.quantity || 1) - 1})">
                    <i class="ri-subtract-line"></i>
                </button>
                <input type="number" value="${item.quantity || 1}" 
                       onchange="updateQuantity(${item.id}, this.value)" 
                       class="quantity-input" min="1">
                <button onclick="updateQuantity(${item.id}, ${(item.quantity || 1) + 1})">
                    <i class="ri-add-line"></i>
                </button>
            </div>
            <div class="cart-item__total">
                <span>R$ ${(item.price * (item.quantity || 1)).toFixed(2)}</span>
            </div>
            <button class="cart-item__remove" onclick="removeFromCart(${item.id})">
                <i class="ri-close-line"></i>
            </button>
        </div>
    `).join('');

    // Atualiza resumo
    const subtotal = getCartSubtotal();
    const shipping = getShippingCost();
    const total = subtotal + shipping;

    subtotalEl.innerText = `R$ ${subtotal.toFixed(2)}`;
    shippingEl.innerText = shipping === 0 ? 'GRÁTIS' : `R$ ${shipping.toFixed(2)}`;
    totalEl.innerText = `R$ ${total.toFixed(2)}`;
}

// ============================================
// MODAIS E INTERAÇÕES
// ============================================

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    if (!modal) return;

    modal.classList.toggle('active');
    document.body.style.overflow = modal.classList.contains('active') ? 'hidden' : '';
}

function closeCart() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function toggleSearch() {
    const searchBar = document.getElementById('search-bar');
    if (!searchBar) return;

    searchBar.classList.toggle('active');
    if (searchBar.classList.contains('active')) {
        document.getElementById('search-input')?.focus();
    }
}

function toggleMenu() {
    const menu = document.querySelector('.nav__menu');
    if (!menu) return;

    menu.classList.toggle('active');
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('product-modal');
    const modalProduct = document.getElementById('modal-product');

    if (!modal || !modalProduct) return;

    modalProduct.innerHTML = `
        <div class="product-modal__image">
            <img src="${product.img}" alt="${product.name}">
        </div>
        <div class="product-modal__info">
            <h2>${product.name}</h2>
            <p class="product-modal__description">${product.description}</p>
            <span class="product-modal__price">R$ ${product.price.toFixed(2)}</span>
            <button class="btn btn-primary" onclick="addToCart(${product.id}); closeProductModal();">
                Adicionar ao Carrinho
            </button>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ============================================
// SISTEMA DE FILTROS
// ============================================

function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active de todos
            filterBtns.forEach(b => b.classList.remove('active'));
            // Adiciona ao clicado
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');
            renderProducts(filter);
        });
    });
}

// ============================================
// BUSCA DE PRODUTOS
// ============================================

function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();
        const productList = document.getElementById('product-list');
        const noProducts = document.getElementById('no-products');

        if (query.trim() === '') {
            renderProducts();
            return;
        }

        const filtered = products.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query)
        );

        if (filtered.length === 0) {
            noProducts.style.display = 'block';
            productList.innerHTML = '';
            return;
        }

        noProducts.style.display = 'none';
        productList.innerHTML = filtered.map(product => `
            <div class="product-card" onclick="openProductModal(${product.id})">
                <div class="product-image">
                    <img src="${product.img}" alt="${product.name}" class="product-img">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-footer">
                        <span class="product-price">R$ ${product.price.toFixed(2)}</span>
                        <button class="btn-add" onclick="event.stopPropagation(); addToCart(${product.id})">
                            <i class="ri-add-line"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    });
}

// ============================================
// CHECKOUT WHATSAPP
// ============================================

function checkoutWhatsApp() {
    if (cart.length === 0) {
        showNotification('Seu carrinho está vazio!', 'error');
        return;
    }

    // Solicita dados básicos para agilizar o atendimento
    const clienteNome = prompt("Por favor, digite seu nome para identificarmos o pedido:");
    
    if (!clienteNome) return; // Cancela se não digitar o nome

    let message = `*🏛️ PEDIDO PIED STREETWEAR*%0A`;
    message += `*Cliente:* ${clienteNome}%0A`;
    message += `*Data:* ${new Date().toLocaleDateString()}%0A%0A`;
    message += `*🛒 ITENS DO PEDIDO:*%0A`;
    message += `--------------------------------%0A`;

    cart.forEach(item => {
        const qty = item.quantity || 1;
        const subtotalItem = item.price * qty;
        message += `▪️ *${qty}x* ${item.name}%0A`;
        message += `   (R$ ${item.price.toFixed(2)}) = R$ ${subtotalItem.toFixed(2)}%0A`;
    });

    const subtotal = getCartSubtotal();
    const shipping = getShippingCost();
    const total = subtotal + shipping;

    message += `--------------------------------%0A`;
    message += `*Subtotal:* R$ ${subtotal.toFixed(2)}%0A`;
    message += shipping === 0 
        ? `*Frete:* GRÁTIS%0A` 
        : `*Frete:* R$ ${shipping.toFixed(2)}%0A`;
    message += `*TOTAL A PAGAR: R$ ${total.toFixed(2)}*%0A`;
    message += `--------------------------------%0A%0A`;
    message += `Gostaria de combinar a entrega e o pagamento (Pix/Cartão).`;

    window.open(`https://wa.me/${PHONE_NUMBER}?text=${message}`, '_blank');

    // Limpa carrinho após checkout
    cart = [];
    saveCart();
    renderCart();
    updateCartUI();
    closeCart();
    showNotification('Pedido gerado! Redirecionando para o WhatsApp...');
}

// ============================================
// NOTIFICAÇÕES
// ============================================

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#000' : '#ff4444'};
        color: #fff;
        border-radius: 4px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// FECHAR MODAIS AO CLICAR FORA
// ============================================

function setupModalCloseOnOutside() {
    document.addEventListener('click', function(e) {
        const cartModal = document.getElementById('cart-modal');
        const productModal = document.getElementById('product-modal');

        if (cartModal && e.target === cartModal) {
            closeCart();
        }

        if (productModal && e.target === productModal) {
            closeProductModal();
        }
    });
}

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    renderCart();
    updateCartUI();
    setupFilters();
    setupSearch();
    setupModalCloseOnOutside();

    // Atualizar carrinho ao carregar página
    saveCart();
});

// Atualizar carrinho quando volta a aba
window.addEventListener('focus', () => {
    updateCartUI();
});