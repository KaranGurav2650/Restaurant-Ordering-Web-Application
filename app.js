// Restaurant Application JavaScript

// Application State
let currentCategory = 'starters';
let cart = JSON.parse(localStorage.getItem('restaurantCart')) || [];
let orders = JSON.parse(localStorage.getItem('restaurantOrders')) || [];
let currentView = 'customer';
let currentTableNumber = '';

// Menu Data with Real Images
const menuData = {
  "starters": [
    {"id": 1, "name": "Veg Spring Rolls", "price": 120, "image": "https://sravaniskitchen.com/wp-content/uploads/2024/07/Veg-Spring-Rolls.jpg"},
    {"id": 2, "name": "Paneer Tikka", "price": 150, "image": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&h=200&fit=crop"},
    {"id": 3, "name": "Chicken Lollipop", "price": 180, "image": "https://images.unsplash.com/photo-1562967914-608f82629710?w=300&h=200&fit=crop"},
    {"id": 4, "name": "French Fries", "price": 100, "image": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop"}
  ],
  "mainCourse": [
    {"id": 5, "name": "Vegetarian Curry", "price": 120, "image": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=200&fit=crop"},
    {"id": 6, "name": "Grilled Paneer", "price": 150, "image": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&h=200&fit=crop"},
    {"id": 7, "name": "Butter Chicken", "price": 220, "image": "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=300&h=200&fit=crop"},
    {"id": 8, "name": "Dal Tadka", "price": 130, "image": "https://tse4.mm.bing.net/th/id/OIP.Fd03nm5ec7KRVhP0g41FbwHaF8?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3"},
    {"id": 9, "name": "Veg Biryani", "price": 160, "image": "https://www.madhuseverydayindian.com/wp-content/uploads/2022/11/easy-vegetable-biryani.jpg"},
    {"id": 10, "name": "Chicken Biryani", "price": 200, "image": "https://www.cubesnjuliennes.com/wp-content/uploads/2020/07/Chicken-Biryani-Recipe.jpg"}
  ],
 "drinks": [
    {"id": 11, "name": "Masala Chaas", "price": 60, "image": "https://dinewithgitanjali.com/wp-content/uploads/2019/04/IMG_6746-1080x1439.jpg"},
    {"id": 12, "name": "Cold Coffee", "price": 120, "image": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=200&fit=crop&crop=center"},
    {"id": 13, "name": "Fresh Lime Soda", "price": 80, "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300&h=200&fit=crop&crop=center"},
    {"id": 14, "name": "Mango Shake", "price": 100, "image": "https://images.unsplash.com/photo-1546173159-315724a31696?w=300&h=200&fit=crop&crop=center"},
    {"id": 15, "name": "Soft Drink", "price": 50, "image": "https://c8.alamy.com/comp/2HNNYBB/bottles-of-global-soft-drink-brands-2HNNYBB.jpg"}
],

  "desserts": [
    {"id": 16, "name": "Gulab Jamun", "price": 90, "image": "https://recipes.net/wp-content/uploads/2023/05/gulab-jamun-recipe_9fb159dc2674f395436a64666227c988-768x768.jpeg"},
    {"id": 17, "name": "Chocolate Brownie", "price": 150, "image": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&h=200&fit=crop"},
    {"id": 18, "name": "Ice Cream", "price": 120, "image": "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=300&h=200&fit=crop"},
    {"id": 19, "name": "Rasmalai", "price": 130, "image": "https://spicesnflavors.com/wp-content/uploads/2018/05/rasmalai-3-min.jpg"},
    {"id": 20, "name": "Cheesecake", "price": 200, "image": "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=300&h=200&fit=crop"}
  ]
};

// DOM Elements
let customerViewBtn, adminViewBtn, customerView, adminView, menuItems, cartItems, totalAmount;
let confirmOrderBtn, clearCartBtn, tableNumberSelect, statusContent, ordersGrid;
let billModal, serviceNotification;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize DOM elements
    customerViewBtn = document.getElementById('customerViewBtn');
    adminViewBtn = document.getElementById('adminViewBtn');
    customerView = document.getElementById('customerView');
    adminView = document.getElementById('adminView');
    menuItems = document.getElementById('menuItems');
    cartItems = document.getElementById('cartItems');
    totalAmount = document.getElementById('totalAmount');
    confirmOrderBtn = document.getElementById('confirmOrder');
    clearCartBtn = document.getElementById('clearCart');
    tableNumberSelect = document.getElementById('tableNumber');
    statusContent = document.getElementById('statusContent');
    ordersGrid = document.getElementById('ordersGrid');
    billModal = document.getElementById('billModal');
    serviceNotification = document.getElementById('serviceNotification');
    
    initializeEventListeners();
    renderMenu();
    updateCartDisplay();
    updateOrderStatus();
    renderAdminDashboard();
});

// Event Listeners
function initializeEventListeners() {
    // View toggle
    if (customerViewBtn && adminViewBtn) {
        customerViewBtn.addEventListener('click', () => switchView('customer'));
        adminViewBtn.addEventListener('click', () => switchView('admin'));
    }

    // Category tabs
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const category = e.target.dataset.category;
            switchCategory(category);
        });
    });

    // Service buttons
    document.querySelectorAll('.service-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const service = e.target.closest('.service-btn').dataset.service;
            handleServiceRequest(service);
        });
    });

    // Cart actions
    if (confirmOrderBtn && clearCartBtn && tableNumberSelect) {
        confirmOrderBtn.addEventListener('click', confirmOrder);
        clearCartBtn.addEventListener('click', clearCart);
        tableNumberSelect.addEventListener('change', updateTableNumber);
    }

    // Modal close
    const modalClose = document.querySelector('.modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            if (billModal) billModal.classList.add('hidden');
        });
    }

    // Notification close
    const notificationClose = document.querySelector('.notification-close');
    if (notificationClose) {
        notificationClose.addEventListener('click', () => {
            if (serviceNotification) serviceNotification.classList.add('hidden');
        });
    }

    // Close modal on backdrop click
    if (billModal) {
        billModal.addEventListener('click', (e) => {
            if (e.target === billModal) {
                billModal.classList.add('hidden');
            }
        });
    }
}

// View Management
function switchView(view) {
    currentView = view;
    
    if (!customerView || !adminView || !customerViewBtn || !adminViewBtn) return;
    
    if (view === 'customer') {
        customerView.classList.remove('hidden');
        adminView.classList.add('hidden');
        customerViewBtn.classList.add('active');
        customerViewBtn.classList.remove('btn--outline');
        customerViewBtn.classList.add('btn--primary');
        adminViewBtn.classList.remove('active');
        adminViewBtn.classList.add('btn--outline');
        adminViewBtn.classList.remove('btn--primary');
    } else {
        customerView.classList.add('hidden');
        adminView.classList.remove('hidden');
        customerViewBtn.classList.remove('active');
        customerViewBtn.classList.add('btn--outline');
        customerViewBtn.classList.remove('btn--primary');
        adminViewBtn.classList.add('active');
        adminViewBtn.classList.remove('btn--outline');
        adminViewBtn.classList.add('btn--primary');
        renderAdminDashboard();
    }
}

// Menu Management
function switchCategory(category) {
    currentCategory = category;
    
    // Update active tab
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    const activeTab = document.querySelector(`[data-category="${category}"]`);
    if (activeTab) activeTab.classList.add('active');
    
    renderMenu();
}

function renderMenu() {
    if (!menuItems) return;
    
    const items = menuData[currentCategory] || [];
    
    menuItems.innerHTML = items.map(item => `
        <div class="menu-item">
            <div class="menu-item-image">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
            </div>
            <div class="menu-item-name">${item.name}</div>
            <div class="menu-item-price">₹${item.price}</div>
            <button class="add-btn" onclick="addToCart(${item.id})">Add</button>
        </div>
    `).join('');
}

// Cart Management
function addToCart(itemId) {
    const item = findItemById(itemId);
    if (!item) return;
    
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartDisplay();
    showNotification(`${item.name} added to cart!`);
}

function removeFromCart(itemId) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex > -1) {
        cart.splice(itemIndex, 1);
        saveCart();
        updateCartDisplay();
    }
}

function updateQuantity(itemId, change) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(itemId);
    } else {
        saveCart();
        updateCartDisplay();
    }
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartDisplay();
    showNotification('Cart cleared!');
}

function updateCartDisplay() {
    if (!cartItems || !totalAmount || !confirmOrderBtn) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart"><p>Your cart is empty</p></div>';
        totalAmount.textContent = 'Total: ₹0';
        confirmOrderBtn.disabled = true;
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₹${item.price} each</div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
        </div>
    `).join('');
    
    totalAmount.textContent = `Total: ₹${total}`;
    confirmOrderBtn.disabled = !currentTableNumber || cart.length === 0;
}

function updateTableNumber() {
    if (!tableNumberSelect || !confirmOrderBtn) return;
    
    currentTableNumber = tableNumberSelect.value;
    confirmOrderBtn.disabled = !currentTableNumber || cart.length === 0;
}

// Order Management
function confirmOrder() {
    if (!currentTableNumber || cart.length === 0) return;
    
    const order = {
        id: Date.now(),
        tableNumber: currentTableNumber,
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'pending',
        timestamp: new Date().toLocaleString()
    };
    
    orders.push(order);
    localStorage.setItem('restaurantOrders', JSON.stringify(orders));
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartDisplay();
    
    // Reset table selection
    if (tableNumberSelect) {
        tableNumberSelect.value = '';
        currentTableNumber = '';
    }
    
    // Update status
    updateOrderStatus('confirmed');
    
    showNotification('Order confirmed successfully!');
    
    // Update admin dashboard if we're in admin view
    if (currentView === 'admin') {
        renderAdminDashboard();
    }
}

function updateOrderStatus(status = 'ready') {
    if (!statusContent) return;
    
    let content = '';
    
    switch (status) {
        case 'confirmed':
            content = `
                <div class="status-icon">✅</div>
                <h3>Order Confirmed!</h3>
                <p>Your order is being prepared</p>
            `;
            break;
        case 'ready':
        default:
            content = `
                <div class="status-icon">📝</div>
                <h3>Ready to Order</h3>
                <p>Select items from menu and confirm your order</p>
            `;
    }
    
    statusContent.innerHTML = content;
}

// Service Requests
function handleServiceRequest(service) {
    let message = '';
    
    switch (service) {
        case 'menu':
            message = 'Menu displayed on screen';
            break;
        case 'waiter':
            message = 'Waiter has been called to your table';
            break;
        case 'cleaning':
            message = 'Cleaning request sent to staff';
            break;
        case 'bill':
            // Check if current table has orders
            const currentTable = currentTableNumber || (tableNumberSelect ? tableNumberSelect.value : '');
            const tableOrders = orders.filter(order => order.tableNumber === currentTable);
            
            if (tableOrders.length > 0 && currentTable) {
                generateBill();
                return;
            } else {
                message = 'Please select your table number first or ensure you have placed an order';
            }
            break;
        case 'water':
            message = 'Water refill request sent to staff';
            break;
    }
    
    showNotification(message);
}

// Bill Generation
function generateBill() {
    const currentTable = currentTableNumber || (tableNumberSelect ? tableNumberSelect.value : '');
    const customerOrders = orders.filter(order => order.tableNumber === currentTable);
    
    if (customerOrders.length === 0 || !currentTable) {
        showNotification('No orders found for this table');
        return;
    }
    
    const totalBill = customerOrders.reduce((sum, order) => sum + order.total, 0);
    const tax = Math.round(totalBill * 0.05); // 5% tax
    const grandTotal = totalBill + tax;
    
    const billContent = document.getElementById('billContent');
    if (!billContent) return;
    
    billContent.innerHTML = `
        <div class="bill-header">
            <h3>Spice Garden</h3>
            <p>Table: ${currentTable}</p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
        </div>
        <div class="bill-details">
            ${customerOrders.map(order => 
                order.items.map(item => `
                    <div class="bill-item">
                        <span>${item.name} x ${item.quantity}</span>
                        <span>₹${item.price * item.quantity}</span>
                    </div>
                `).join('')
            ).join('')}
            <div class="bill-item">
                <span>Subtotal</span>
                <span>₹${totalBill}</span>
            </div>
            <div class="bill-item">
                <span>Tax (5%)</span>
                <span>₹${tax}</span>
            </div>
        </div>
        <div class="bill-total">
            Total: ₹${grandTotal}
        </div>
        <div class="qr-code" id="qrCode"></div>
        <button class="btn btn--primary btn--full-width" onclick="processPayment()">
            Pay Now - ₹${grandTotal}
        </button>
    `;
    
    // Generate QR Code
    setTimeout(() => {
        const qrContainer = document.getElementById('qrCode');
        if (qrContainer && window.QRCode) {
            QRCode.toCanvas(qrContainer, `upi://pay?pa=restaurant@upi&pn=Spice Garden&am=${grandTotal}&tn=Table ${currentTable}`, {
                width: 200,
                height: 200
            });
        }
    }, 100);
    
    if (billModal) billModal.classList.remove('hidden');
}

function processPayment() {
    showNotification('Payment processed successfully!');
    if (billModal) billModal.classList.add('hidden');
}

// Admin Dashboard
function renderAdminDashboard() {
    if (!ordersGrid) return;
    
    if (orders.length === 0) {
        ordersGrid.innerHTML = '<div class="no-orders"><p>No active orders</p></div>';
        return;
    }
    
    ordersGrid.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <span class="table-number">Table ${order.tableNumber}</span>
                <span class="order-time">${order.timestamp}</span>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.name} x ${item.quantity}</span>
                        <span>₹${item.price * item.quantity}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">Total: ₹${order.total}</div>
            <div class="order-status">
                <span>Status:</span>
                <select class="status-select" onchange="updateOrderStatusAdmin(${order.id}, this.value)">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="preparing" ${order.status === 'preparing' ? 'selected' : ''}>Preparing</option>
                    <option value="ready" ${order.status === 'ready' ? 'selected' : ''}>Ready</option>
                    <option value="served" ${order.status === 'served' ? 'selected' : ''}>Served</option>
                </select>
            </div>
        </div>
    `).join('');
}

function updateOrderStatusAdmin(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        localStorage.setItem('restaurantOrders', JSON.stringify(orders));
        renderAdminDashboard();
    }
}

// Utility Functions
function findItemById(id) {
    for (const category in menuData) {
        const item = menuData[category].find(item => item.id === id);
        if (item) return item;
    }
    return null;
}

function saveCart() {
    localStorage.setItem('restaurantCart', JSON.stringify(cart));
}

function showNotification(message, duration = 3000) {
    if (!serviceNotification) return;
    
    const text = serviceNotification.querySelector('.notification-text');
    if (!text) return;
    
    text.textContent = message;
    serviceNotification.classList.remove('hidden');
    
    setTimeout(() => {
        serviceNotification.classList.add('hidden');
    }, duration);
}

// Global functions for onclick handlers
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.updateOrderStatusAdmin = updateOrderStatusAdmin;
window.processPayment = processPayment;

// Auto-refresh admin dashboard every 30 seconds
setInterval(() => {
    if (currentView === 'admin') {
        renderAdminDashboard();
    }
}, 30000);