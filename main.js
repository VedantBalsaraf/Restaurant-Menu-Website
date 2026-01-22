// GSAP is loaded via CDN in index.html

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Liquid Ether Background
    const liquidEtherContainer = document.getElementById('liquid-ether-bg');
    if (liquidEtherContainer && window.LiquidEther) {
        const liquidEther = new LiquidEther(liquidEtherContainer, {
            colors: ['#D62300', '#FF6B35', '#F7931E', '#FDB913'], // Burger King themed colors: red, orange, yellow
            mouseForce: 25,
            cursorSize: 120,
            autoDemo: true,
            autoSpeed: 0.4,
            autoIntensity: 1.8,
            resolution: 0.6,
            dt: 0.016,
            BFECC: true,
            autoResumeDelay: 2000,
            autoRampDuration: 0.8
        });
    }

    // Mobile Menu Logic
    const hamburger = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu-popover');
    const mobileLinks = document.querySelectorAll('.mobile-menu-link');
    const hamburgerLines = document.querySelectorAll('.hamburger-line');

    let isMobileMenuOpen = false;

    if (mobileMenu) {
        gsap.set(mobileMenu, { visibility: 'hidden', opacity: 0, scaleY: 1 });
    }

    // Toggle Mobile Menu
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            isMobileMenuOpen = !isMobileMenuOpen;

            // Hamburger Animation
            if (isMobileMenuOpen) {
                gsap.to(hamburgerLines[0], { rotation: 45, y: 3, duration: 0.3, ease: 'power2.out' });
                gsap.to(hamburgerLines[1], { rotation: -45, y: -3, duration: 0.3, ease: 'power2.out' });

                // Menu Animation (Open)
                gsap.set(mobileMenu, { visibility: 'visible' });
                gsap.fromTo(mobileMenu,
                    { opacity: 0, y: 10, scaleY: 1 },
                    { opacity: 1, y: 0, scaleY: 1, duration: 0.3, ease: 'power3.out', transformOrigin: 'top center' }
                );
            } else {
                gsap.to(hamburgerLines[0], { rotation: 0, y: 0, duration: 0.3, ease: 'power2.out' });
                gsap.to(hamburgerLines[1], { rotation: 0, y: 0, duration: 0.3, ease: 'power2.out' });

                // Menu Animation (Close)
                gsap.to(mobileMenu, {
                    opacity: 0,
                    y: 10,
                    scaleY: 1,
                    duration: 0.2,
                    ease: 'power3.in',
                    transformOrigin: 'top center',
                    onComplete: () => {
                        gsap.set(mobileMenu, { visibility: 'hidden' });
                    }
                });
            }
        });
    }

    // Close mobile menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMobileMenuOpen) {
                hamburger.click(); // Trigger toggle to close
            }
        });
    });

    // Pill Navigation Logic
    const pills = document.querySelectorAll('.pill-list .pill');
    const circles = [];
    const timelines = [];
    const activeTweens = [];

    // Layout Calculation function
    const layout = () => {
        pills.forEach((pill, index) => {
            const circle = pill.querySelector('.hover-circle');
            if (!circle) return;

            pills[index].rect = pill.getBoundingClientRect();
            const w = pills[index].rect.width;
            const h = pills[index].rect.height;

            // Math from the React component
            const R = ((w * w) / 4 + h * h) / (2 * h);
            const D = Math.ceil(2 * R) + 2;
            const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
            const originY = D - delta;

            circle.style.width = `${D}px`;
            circle.style.height = `${D}px`;
            circle.style.bottom = `-${delta}px`;

            // Initial state
            gsap.set(circle, {
                xPercent: -50,
                scale: 0,
                transformOrigin: `50% ${originY}px`
            });

            const label = pill.querySelector('.pill-label');
            const white = pill.querySelector('.pill-label-hover');

            if (label) gsap.set(label, { y: 0 });
            if (white) gsap.set(white, { y: h + 12, opacity: 0 }); // Initial hidden state

            // Create Timeline
            const tl = gsap.timeline({ paused: true });

            // Circle Animation
            tl.to(circle, { scale: 1.2, xPercent: -50, duration: 0.6, ease: 'power3.easeOut', overwrite: 'auto' }, 0);

            // Text Animations
            if (label) {
                tl.to(label, { y: -(h + 8), duration: 0.6, ease: 'power3.easeOut', overwrite: 'auto' }, 0);
            }
            if (white) {
                gsap.set(white, { y: Math.ceil(h + 20), opacity: 0 });
                tl.to(white, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.easeOut', overwrite: 'auto' }, 0);
            }

            timelines[index] = tl;
        });
    };

    // Initialize Layout
    layout();
    window.addEventListener('resize', layout);
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(layout);
    }

    // Hover Events
    pills.forEach((pill, i) => {
        pill.addEventListener('mouseenter', () => {
            const tl = timelines[i];
            if (tl) {
                tl.play();
            }
        });

        pill.addEventListener('mouseleave', () => {
            const tl = timelines[i];
            if (tl) {
                tl.reverse();
            }
        });
    });

    // Logo Spin
    const logo = document.querySelector('.pill-logo');
    if (logo) {
        logo.addEventListener('mouseenter', () => {
            gsap.to(logo, { rotate: 360, duration: 0.6, ease: 'power3.out', overwrite: 'auto', onComplete: () => gsap.set(logo, { rotate: 0 }) });
        });
    }

    // Initial Load Animation
    const navItems = document.querySelector('.pill-nav-items');
    if (navItems) {
        gsap.set(navItems, { width: 0, overflow: 'hidden' });
        gsap.to(navItems, { width: 'auto', duration: 1, ease: 'power3.inOut' });
    }

    if (logo) {
        gsap.from(logo, { scale: 0, duration: 0.8, ease: 'back.out(1.7)' });
    }

    // --- Custom Cursor Logic ---
    const cursor = document.getElementById('custom-cursor');
    const ring = document.querySelector('.cursor-ring');
    const dot = document.querySelector('.cursor-dot');

    // Mouse Tracking
    let mouseX = 0;
    let mouseY = 0;

    // Use GSAP quickTo for performance
    const xTo = gsap.quickTo(ring, "x", { duration: 0.3, ease: "power3", overwrite: "auto" });
    const yTo = gsap.quickTo(ring, "y", { duration: 0.3, ease: "power3", overwrite: "auto" });
    const dotX = gsap.quickTo(dot, "x", { duration: 0.1, overwrite: "auto" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.1, overwrite: "auto" });

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        xTo(mouseX);
        yTo(mouseY);
        dotX(mouseX);
        dotY(mouseY);
    });

    // Ring Spin (Continuous)
    gsap.to(ring, { rotation: 360, duration: 8, repeat: -1, ease: "linear" });

    // Target Elements for Magnet Effect
    const magnetElements = document.querySelectorAll('.btn, .add-btn, .pill, .logo');

    magnetElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovering');
            // Scale up slightly logic handled by CSS transition on class
        });

        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovering');
            // Reset magnet
            gsap.to(el, { x: 0, y: 0, duration: 0.3 });
        });

        el.addEventListener('mousemove', (e) => {
            // Magnet Effect
            const rect = el.getBoundingClientRect();
            const relX = e.clientX - rect.left - rect.width / 2;
            const relY = e.clientY - rect.top - rect.height / 2;

            // Move element slightly towards mouse
            gsap.to(el, {
                x: relX * 0.3,
                y: relY * 0.3,
                duration: 0.3
            });
        });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        gsap.to(cursor, { opacity: 0, duration: 0.3 });
    });
    document.addEventListener('mouseenter', () => {
        gsap.to(cursor, { opacity: 1, duration: 0.3 });
    });

    // --- Dynamic Menu & Cart Logic ---

    // Menu Data (India Pricing ₹)
    const menuItems = [
        // Burgers (Non-Veg)
        {
            id: 1,
            name: "The Whopper",
            price: 269,
            category: "non-veg",
            desc: "Our signature flame-grilled beef patty.",
            img: "whopper.png"
        },
        {
            id: 2,
            name: "Bacon King",
            price: 329,
            category: "non-veg",
            desc: "Two flame-grilled patties with crispy bacon.",
            img: "whopper.png"
        },
        {
            id: 3,
            name: "Chicken Fries",
            price: 189,
            category: "non-veg",
            desc: "Crispy white meat chicken in a fun shape.",
            img: "chicken-fries.png"
        },
        // Burgers (Veg)
        {
            id: 4,
            name: "Veggie Whopper",
            price: 219,
            category: "veg",
            desc: "Flame-grilled plant-based patty.",
            img: "veggie-whopper.png"
        },
        {
            id: 5,
            name: "Crispy Veg",
            price: 99,
            category: "veg",
            desc: "Crispy potato patty with fresh lettuce.",
            img: "crispy-veg.png"
        },
        {
            id: 6,
            name: "Paneer Royale",
            price: 249,
            category: "veg",
            desc: "Thick paneer patty with spicy mayo.",
            img: "paneer-royale.png"
        },
        // Milkshakes
        {
            id: 7,
            name: "Chocolate Shake",
            price: 159,
            category: "milkshakes",
            desc: "Creamy chocolate thick shake.",
            img: "chocolate-shake.png"
        },
        {
            id: 8,
            name: "Strawberry Shake",
            price: 159,
            category: "milkshakes",
            desc: "Fresh strawberry flavor.",
            img: "strawberry-shake.png"
        },
        // Coffee
        {
            id: 9,
            name: "Cappuccino",
            price: 129,
            category: "coffee",
            desc: "Freshly brewed espresso with steamed milk.",
            img: "cappuccino.png"
        },
        {
            id: 10,
            name: "Iced Latte",
            price: 149,
            category: "coffee",
            desc: "Espresso with cold milk and ice.",
            img: "cappuccino.png"
        },
        // Desserts
        {
            id: 11,
            name: "Chocolate Dust Cake",
            price: 119,
            category: "desserts",
            desc: "Rich chocolate cake with dusting.",
            img: "chocolate-cake.png"
        },
        {
            id: 12,
            name: "Soft Serve Cone",
            price: 59,
            category: "desserts",
            desc: "Classic vanilla soft serve.",
            img: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        }
    ];

    // State
    let cart = [];
    let currentCategory = 'all';

    // Elements
    const menuGrid = document.getElementById('menu-grid');
    const catButtons = document.querySelectorAll('.cat-btn');
    const cartBtn = document.getElementById('cart-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCart = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPriceEl = document.getElementById('cart-total-price');
    const cartCountEl = document.getElementById('cart-count');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Render Menu
    function renderMenu(category) {
        menuGrid.innerHTML = '';
        const filteredItems = category === 'all'
            ? menuItems
            : menuItems.filter(item => item.category === category);

        filteredItems.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'menu-item';
            // Animation for entry
            gsap.fromTo(itemEl, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 });

            itemEl.innerHTML = `
                <div class="item-img-container">
                    <img src="${item.img}" alt="${item.name}">
                </div>
                <span class="item-title">${item.name}</span>
                <p class="item-desc">${item.desc}</p>
                <div class="item-footer">
                    <span class="item-price">₹${item.price}</span>
                    <button class="add-btn" data-id="${item.id}">+</button>
                </div>
            `;
            menuGrid.appendChild(itemEl);
        });

        // Re-attach listeners to add buttons
        document.querySelectorAll('.add-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                addToCart(id);

                // Small animation
                gsap.fromTo(e.target, { scale: 0.8 }, { scale: 1, duration: 0.2, ease: "back.out(2)" });
            });
        });
    }

    // Category Filter Logic
    catButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            catButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.dataset.category;
            renderMenu(category);
        });
    });

    // Cart Logic
    function addToCart(id) {
        const item = menuItems.find(i => i.id === id);
        const existingItem = cart.find(i => i.id === id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        updateCart();
        openCart(); // Optional: open cart when added
    }

    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        updateCart();
    }

    function updateCart() {
        // Update Count
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountEl.textContent = totalItems;

        // Animate count badge
        gsap.fromTo(cartCountEl, { scale: 1.5 }, { scale: 1, duration: 0.3 });

        // Update Total Price
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalPriceEl.textContent = `₹${total}`;

        // Render Items
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
            return;
        }

        cart.forEach(item => {
            const cartItemEl = document.createElement('div');
            cartItemEl.className = 'cart-item';
            cartItemEl.innerHTML = `
                <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <span class="cart-item-title">${item.name}</span>
                    <span class="cart-item-price">₹${item.price} x ${item.quantity}</span>
                </div>
                <div class="cart-item-controls">
                    <span class="cart-control-btn delete-item" data-id="${item.id}">&times;</span>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemEl);
        });

        // Attach listeners to remove buttons
        document.querySelectorAll('.delete-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                removeFromCart(parseInt(e.target.dataset.id));
            });
        });
    }

    function openCart() {
        cartSidebar.classList.add('open');
    }

    function closeCartSidebar() {
        cartSidebar.classList.remove('open');
    }

    // Toggle Cart
    cartBtn.addEventListener('click', () => {
        cartSidebar.classList.contains('open') ? closeCartSidebar() : openCart();
    });

    closeCart.addEventListener('click', closeCartSidebar);

    // Initial Render
    renderMenu('all');

    // Checkout Logic (Simulation)
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert("Your cart is empty!");
                return;
            }
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            alert(`Order Confirmed! Total Amount: ₹${total}\nThank you for ordering with Burger King!`);
            cart = [];
            updateCart();
            closeCartSidebar();
        });
    }

    // Booking Form (Improved Logic)
    const reservationForm = document.getElementById('reservation-form');
    if (reservationForm) {
        reservationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = reservationForm.querySelector('button');
            const originalText = btn.textContent;

            btn.textContent = "Booking...";
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = "Confirmed! ✅";
                btn.style.background = "#4CAF50"; // Green

                setTimeout(() => {
                    document.getElementById('reservation-modal').style.display = 'none';
                    btn.textContent = originalText;
                    btn.style.background = "";
                    btn.disabled = false;
                    reservationForm.reset();
                }, 1500);
            }, 1000);
        });
    }

});
