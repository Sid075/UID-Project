const products = [
    { id: 1, name: "Nike Air Max Replica", originalPrice: 16500, price: 4999, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff", brand: "Nike", description: "Experience the iconic Nike Air Max with its signature visible Air cushioning. Perfect blend of comfort and style." },
    { id: 2, name: "Adidas Ultra Boost Replica", originalPrice: 13500, price: 3999, image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5", brand: "Adidas", description: "The Adidas Ultra Boost Replica offers superior cushioning and energy return with its Boost midsole technology." },
    { id: 3, name: "Puma RS-X Replica", originalPrice: 10000, price: 2999, image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5", brand: "Puma", description: "Bold and futuristic, the Puma RS-X Replica combines retro style with modern comfort." },
    { id: 4, name: "Nike Jordan 1 Replica", originalPrice: 18000, price: 5499, image: "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b", brand: "Nike", description: "A timeless classic, the Nike Jordan 1 Replica delivers streetwear style with premium materials." },
    { id: 5, name: "Adidas Yeezy Replica", originalPrice: 15000, price: 4499, image: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb", brand: "Adidas", description: "Inspired by Kanye West's vision, the Adidas Yeezy Replica offers a sleek design and unmatched comfort." },
    { id: 6, name: "Nike Air Force 1 Replica", originalPrice: 11500, price: 3499, image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a", brand: "Nike", description: "The Nike Air Force 1 Replica is a versatile sneaker with a clean, classic look and durable construction." },
    { id: 7, name: "Puma Suede Classic Replica", originalPrice: 8500, price: 2499, image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5", brand: "Puma", description: "The Puma Suede Classic Replica brings retro vibes with its premium suede upper and iconic design." },
    { id: 8, name: "Adidas NMD Replica", originalPrice: 12500, price: 3799, image: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb", brand: "Adidas", description: "The Adidas NMD Replica combines minimalist design with responsive cushioning for all-day comfort." }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn')) || false;
const cartIcon = document.querySelector('.cart-icon');
const cartModal = document.getElementById('cartModal');
const productGrid = document.querySelector('.product-grid');
const checkoutBtn = document.getElementById('checkoutBtn');
const popupOverlay = document.getElementById('popupOverlay');
const aboutPopup = document.getElementById('aboutPopup');

function showSection(sectionId) {
    document.querySelectorAll('main > section').forEach(section => {
        section.style.display = 'none';
    });
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
        window.scrollTo({ top: targetSection.offsetTop - 80, behavior: 'smooth' });
    }
}

function displayProducts() {
    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <a href="#product-detail" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name}">
            </a>
            <h3>${product.name}</h3>
            <div class="price-container">
                <p class="original-price">MRP: ₹${product.originalPrice.toLocaleString()}</p>
                <p class="discount-price">Our Price: ₹${product.price.toLocaleString()}</p>
                <p class="savings">You Save: ₹${(product.originalPrice - product.price).toLocaleString()}</p>
            </div>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        </div>
    `).join('');

    productGrid.querySelectorAll('.product-card a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = parseInt(link.getAttribute('data-id'));
            displayProductDetail(productId);
        });
    });

    productGrid.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.getAttribute('data-id'));
            addToCart(productId, parseInt(document.getElementById('size-select')?.value || 8));
        });
    });

    productGrid.querySelectorAll('.product-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function displayProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('detail-image').src = product.image;
    document.getElementById('detail-image').alt = product.name;
    document.getElementById('detail-name').textContent = product.name;
    document.getElementById('detail-original-price').textContent = `MRP: ₹${product.originalPrice.toLocaleString()}`;
    document.getElementById('detail-discount-price').textContent = `Our Price: ₹${product.price.toLocaleString()}`;
    document.getElementById('detail-savings').textContent = `You Save: ₹${(product.originalPrice - product.price).toLocaleString()}`;
    document.getElementById('detail-description').textContent = product.description;
    document.getElementById('detail-add-to-cart').setAttribute('data-id', productId);

    showSection('product-detail');
}

function addToCart(productId, size) {
    if (!isLoggedIn) {
        alert('Please log in to add items to your cart.');
        showSection('login');
        return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId && item.size === size);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1, size });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
    showCartNotification(`${product.name} (Size: ${size}) added to cart!`);
}

function removeFromCart(productId, size) {
    cart = cart.filter(item => !(item.id === productId && item.size === size));
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function updateCartDisplay() {
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.getElementById('cartTotal');

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>₹${item.price.toLocaleString()} x ${item.quantity} (Size: ${item.size})</p>
                <p class="savings">You Save: ₹${((item.originalPrice - item.price) * item.quantity).toLocaleString()}</p>
            </div>
            <button class="remove-item" data-id="${item.id}" data-size="${item.size}">×</button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    if (cart.length === 0) {
        checkoutBtn.classList.add('disabled');
        checkoutBtn.style.pointerEvents = 'none';
        checkoutBtn.style.opacity = '0.6';
    } else {
        checkoutBtn.classList.remove('disabled');
        checkoutBtn.style.pointerEvents = 'auto';
        checkoutBtn.style.opacity = '1';
    }

    cartItems.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', () => {
            const id = parseInt(button.getAttribute('data-id'));
            const size = parseInt(button.getAttribute('data-size'));
            removeFromCart(id, size);
        });
    });

    cartItems.querySelectorAll('.cart-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(20px)';
        setTimeout(() => {
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 100);
    });
}

function showCartNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 100px; right: 20px; background: var(--accent-color); color: var(--secondary-color);
        padding: 1rem 2rem; border-radius: 8px; z-index: 1002; opacity: 0; transition: opacity 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.opacity = '1';
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }, 10);
}

function showAboutPopup() {
    popupOverlay.style.display = 'block';
    aboutPopup.style.display = 'block';
}

function closePopup() {
    popupOverlay.style.display = 'none';
    aboutPopup.style.display = 'none';
}

cartIcon.addEventListener('click', () => {
    cartModal.style.display = cartModal.style.display === 'block' ? 'none' : 'block';
    if (cartModal.style.display === 'block') {
        const cartContent = document.querySelector('.cart-content');
        cartContent.style.transform = 'translateX(100%)';
        setTimeout(() => {
            cartContent.style.transition = 'transform 0.3s ease';
            cartContent.style.transform = 'translateX(0)';
        }, 10);
    }
});

window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        const cartContent = document.querySelector('.cart-content');
        cartContent.style.transition = 'transform 0.3s ease';
        cartContent.style.transform = 'translateX(100%)';
        setTimeout(() => {
            cartModal.style.display = 'none';
            cartContent.style.transform = 'translateX(0)';
        }, 300);
    }
    if (e.target === popupOverlay) {
        closePopup();
    }
});

document.querySelectorAll('.nav-links a, .footer-section a, .cta-button').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href === '#about') {
            showAboutPopup();
        } else if (href.startsWith('#')) {
            showSection(href.substring(1));
        }
    });
});

document.getElementById('login-btn')?.addEventListener('click', () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    if (email && password) {
        isLoggedIn = true;
        localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
        alert('Login successful!');
        showSection('home');
    } else {
        alert('Please fill in all fields.');
    }
});

document.getElementById('signup-btn')?.addEventListener('click', () => {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    if (name && email && password && confirmPassword) {
        if (password === confirmPassword) {
            isLoggedIn = true;
            localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
            alert('Sign up successful! You are now logged in.');
            showSection('home');
        } else {
            alert('Passwords do not match.');
        }
    } else {
        alert('Please fill in all fields.');
    }
});

document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    if (!isLoggedIn) {
        alert('Please log in to proceed to checkout.');
        showSection('login');
        return;
    }
    showSection('checkout');
    cartModal.style.display = 'none';
});

document.getElementById('place-order-btn')?.addEventListener('click', () => {
    const name = document.getElementById('checkout-name').value;
    const email = document.getElementById('checkout-email').value;
    const address = document.getElementById('shipping-address').value;
    const city = document.getElementById('checkout-city').value;
    const country = document.getElementById('checkout-country').value;
    const payment = document.getElementById('payment-method').value;
    if (name && email && address && city && country && payment) {
        alert('Order placed successfully! Thank you for shopping with Ginsha.in');
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();
        showSection('home');
    } else {
        alert('Please fill in all fields.');
    }
});

let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll > lastScrollTop && currentScroll > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
}, { passive: true });

document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    updateCartCount();
    updateCartDisplay();
    const hash = window.location.hash.substring(1);
    if (hash === 'about') {
        showAboutPopup();
    } else if (hash) {
        showSection(hash);
    } else {
        showSection('home');
    }
});