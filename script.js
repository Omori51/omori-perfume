// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navCenter = document.querySelector('.nav-center');
    
    if (hamburger && navCenter) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navCenter.classList.toggle('active');
            document.body.style.overflow = navCenter.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(function(n) {
        n.addEventListener('click', function() {
            if (hamburger && navCenter) {
                hamburger.classList.remove('active');
                navCenter.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (hamburger && navCenter && navCenter.classList.contains('active')) {
            if (!hamburger.contains(e.target) && !navCenter.contains(e.target)) {
                hamburger.classList.remove('active');
                navCenter.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
});

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-box input');
    const searchIcon = document.querySelector('.search-box i');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
    }
    
    if (searchIcon) {
        searchIcon.addEventListener('click', function() {
            if (searchInput && searchInput.value) {
                performSearch(searchInput.value);
            }
        });
    }
});

function performSearch(searchTerm) {
    if (!searchTerm.trim()) return;
    
    // Simple search implementation
    const productNames = document.querySelectorAll('.product-info h3');
    let found = false;
    
    productNames.forEach(function(name) {
        if (name.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
            name.scrollIntoView({ behavior: 'smooth', block: 'center' });
            name.style.background = 'rgba(255, 107, 53, 0.2)';
            setTimeout(function() {
                name.style.background = 'transparent';
            }, 3000);
            found = true;
        }
    });
    
    if (!found) {
        alert('Аромат не найден. Попробуйте другое название.');
    }
}

// Shopping cart functionality
document.addEventListener('DOMContentLoaded', function() {
    const cartIcon = document.querySelector('.icon-wrapper .fa-shopping-bag').parentElement;
    const cartBadge = cartIcon.querySelector('.badge');
    
    if (cartIcon) {
        cartIcon.addEventListener('click', function() {
            alert('Корзина пока пуста. Добавьте товары для оформления заказа.');
        });
    }
});

// Wishlist functionality
function getWishlist() {
    return readStore('wishlist', []);
}

function setWishlist(wishlist) {
    writeStore('wishlist', wishlist);
}

function toggleWishlist(id, name, image) {
    let wishlist = getWishlist();
    const idx = wishlist.findIndex(w => w.id === id);
    if (idx >= 0) {
        wishlist.splice(idx, 1);
    } else {
        wishlist.push({ id, name, image });
    }
    setWishlist(wishlist);
}

function updateWishlistBadge() {
    const wishlist = getWishlist();
    const wishlistIcon = document.getElementById('wishlistIcon');
    const badge = wishlistIcon?.querySelector('.badge');
    if (badge) {
        badge.textContent = wishlist.length;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const wishlistIcon = document.getElementById('wishlistIcon');
    if (wishlistIcon) {
        wishlistIcon.addEventListener('click', function() {
            // Всегда открываем личный кабинет на избранных, даже если список пуст
            const accountModal = document.getElementById('accountModal');
            if (accountModal && typeof openModal === 'function') {
                openModal(accountModal);
                renderAccount();
                setTimeout(() => {
                    const profileTab = accountModal.querySelector('.account-tabs .tab[data-tab="profile"]');
                    if (profileTab) profileTab.click();
                    const favBlock = document.getElementById('favoritesSection');
                    if (favBlock) favBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 150);
            }
        });
    }
    updateWishlistBadge();
});

// User account functionality
function updateAuthHeader() {
    const navAuthLink = document.querySelector('.nav-menu a[href="register.html"]');
    const userRef = getCurrentUser();
    if (!navAuthLink) return;
    if (userRef && userRef.email) {
        navAuthLink.textContent = userRef.email;
        navAuthLink.classList.add('nav-link-user');
    } else {
        navAuthLink.textContent = 'Регистрация';
        navAuthLink.classList.remove('nav-link-user');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const userIcon = document.getElementById('userIcon');
    const authModal = document.getElementById('authModal');
    const accountModal = document.getElementById('accountModal');
    
    // Обновляем ссылку в шапке (Регистрация / email)
    updateAuthHeader();
    
    if (userIcon) {
        userIcon.addEventListener('click', function() {
            const user = getCurrentUser();
            if (user && accountModal && typeof openModal === 'function') {
                // Уже вошёл — открываем личный кабинет
                openModal(accountModal);
                renderAccount();
                return;
            }
            // Открываем модальное окно входа/регистрации
            const loginForm = document.getElementById('loginForm');
            const registerForm = document.getElementById('registerForm');
            if (loginForm && registerForm){
                loginForm.hidden = false;
                registerForm.hidden = true;
                const t = document.getElementById('authTitle'); if (t) t.textContent = 'Войти';
            }
            openModal(authModal);
        });
    }

    // Ссылка в меню «Регистрация / email»
    const navAuthLink = document.querySelector('.nav-menu a[href="register.html"]');
    if (navAuthLink){
        navAuthLink.addEventListener('click', function(e){
            const user = getCurrentUser();
            if (user && accountModal && typeof openModal === 'function') {
                // Уже вошёл — показываем личный кабинет
                e.preventDefault();
                openModal(accountModal);
                renderAccount();
            } else {
                // Нет аккаунта — показываем регистрацию
                e.preventDefault();
                const loginForm = document.getElementById('loginForm');
                const registerForm = document.getElementById('registerForm');
                if (loginForm && registerForm){
                    loginForm.hidden = true; registerForm.hidden = false;
                    const t = document.getElementById('authTitle'); if (t) t.textContent = 'Регистрация';
                }
                openModal(authModal);
            }
        });
    }

    // Fallback global opener
    window.openRegister = function(){
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        if (loginForm && registerForm){
            loginForm.hidden = true; registerForm.hidden = false;
            const t = document.getElementById('authTitle'); if (t) t.textContent = 'Регистрация';
        }
        openModal(document.getElementById('authModal'));
    };
});

// City selector functionality
document.addEventListener('DOMContentLoaded', function() {
    const citySelector = document.querySelector('.city-selector');
    
    if (citySelector) {
        citySelector.addEventListener('click', function() {
            const cities = ['Алматы', 'Астана', 'Шымкент', 'Актобе', 'Тараз', 'Павлодар'];
            const currentCity = document.getElementById('currentCity');
            const currentIndex = cities.indexOf(currentCity.textContent);
            const nextIndex = (currentIndex + 1) % cities.length;
            currentCity.textContent = cities[nextIndex];
        });
    }
});

// Image loading and error handling
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    images.forEach(function(img) {
        // Set initial opacity
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        
        img.addEventListener('load', function() {
            this.style.opacity = '1';
            console.log('Image loaded successfully:', this.alt);
        });
        
        img.addEventListener('error', function onImgError() {
            console.log('Image failed to load:', this.src);
            // Try alternate extensions before giving up
            const tried = this.dataset.triedExts ? this.dataset.triedExts.split(',') : [];
            const candidates = ['jpg','jpeg','png','webp'];
            const url = new URL(this.src, window.location.href);
            const pathname = url.pathname;
            const dotIdx = pathname.lastIndexOf('.');
            const base = dotIdx > -1 ? pathname.slice(0, dotIdx) : pathname;
            const currentExt = dotIdx > -1 ? pathname.slice(dotIdx+1).toLowerCase() : '';
            if (!tried.length && currentExt) tried.push(currentExt);
            const nextExt = candidates.find(ext => !tried.includes(ext));
            if (nextExt){
                tried.push(nextExt);
                this.dataset.triedExts = tried.join(',');
                const nextSrc = base + '.' + nextExt + (url.search || '');
                console.log('Retrying with extension:', nextExt, '->', nextSrc);
                this.src = nextSrc;
                return; // wait for next load/error
            }
            // Create placeholder if all retries failed
            const container = this.parentElement;
            container.innerHTML = `
                <div class="image-placeholder">
                    <i class="fas fa-shopping-bag"></i>
                    <span>Изображение недоступно</span>
                </div>
            `;
        });
        
        // Set loading timeout
        setTimeout(function() {
            if (img.complete === false || img.naturalHeight === 0) {
                console.log('Image loading timeout:', img.src);
                img.dispatchEvent(new Event('error'));
            }
        }, 8000);
    });
    
    // Force reload images that might be cached incorrectly
    setTimeout(function() {
        images.forEach(function(img) {
            if (img.style.opacity === '0') {
                console.log('Retrying image load:', img.src);
                const newSrc = img.src + '&t=' + Date.now();
                img.src = newSrc;
            }
        });
    }, 2000);
});

// ========= Local product image uploader (persists in localStorage) =========
document.addEventListener('DOMContentLoaded', function(){
    const cards = document.querySelectorAll('.products-section .product-card');
    if (!cards.length) return;

    function keyFor(name){ return 'productImage:'+name.trim(); }

    cards.forEach(function(card){
        const nameEl = card.querySelector('.product-info h3');
        const imgEl = card.querySelector('.product-image img');
        const imgWrap = card.querySelector('.product-image');
        if (!nameEl || !imgEl || !imgWrap) return;

        // Apply persisted image if exists
        try{
            const saved = localStorage.getItem(keyFor(nameEl.textContent));
            if (saved) { imgEl.src = saved; }
        }catch(e){}

        // Create upload badge and hidden input
        const badge = document.createElement('button');
        badge.type = 'button';
        badge.className = 'upload-badge';
        badge.title = 'Загрузить фото';
        badge.innerHTML = '<i class="fas fa-upload"></i>';
        const file = document.createElement('input');
        file.type = 'file';
        file.accept = 'image/*';
        file.style.display = 'none';

        badge.addEventListener('click', function(){ file.click(); });
        file.addEventListener('change', function(){
            const f = file.files && file.files[0];
            if (!f) return;
            const reader = new FileReader();
            reader.onload = function(){
                const dataUrl = String(reader.result);
                try{ localStorage.setItem(keyFor(nameEl.textContent), dataUrl); }catch(e){ alert('Не удалось сохранить изображение (localStorage переполнен)'); }
                imgEl.src = dataUrl;
            };
            reader.readAsDataURL(f);
        });

        imgWrap.appendChild(badge);
        imgWrap.appendChild(file);
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        const target = document.querySelector(href);
        if (!target) return;

        // Специальное поведение для каталога: раскрываем с анимацией
        if (href === '#catalog') {
            e.preventDefault();
            const catalogSection = document.getElementById('catalog');
            if (catalogSection) {
                catalogSection.classList.remove('catalog-collapsed');
                catalogSection.classList.add('catalog-open');
                catalogSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            return;
        }

        // Остальные якоря — обычный плавный скролл
        e.preventDefault();
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Кнопка "Открыть каталог" из блока О нас
document.addEventListener('DOMContentLoaded', function() {
    const openFromAbout = document.getElementById('openCatalogFromAbout');
    const catalogSection = document.getElementById('catalog');
    if (openFromAbout && catalogSection) {
        openFromAbout.addEventListener('click', function () {
            catalogSection.classList.remove('catalog-collapsed');
            catalogSection.classList.add('catalog-open');
            catalogSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }

    // Если сразу пришли по хэшу #catalog — раскрываем каталог
    if (location.hash === '#catalog' && catalogSection) {
        catalogSection.classList.remove('catalog-collapsed');
        catalogSection.classList.add('catalog-open');
    }
});

// Add hover effects for product cards
document.addEventListener('DOMContentLoaded', function() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// ============ Helpers (Modal/Drawer, Storage) ============
function openModal(el){ if(!el) return; el.setAttribute('aria-hidden','false'); el.style.display='block'; }
function closeModal(el){ if(!el) return; el.setAttribute('aria-hidden','true'); el.style.display='none'; }
function openDrawer(el){ if(!el) return; el.setAttribute('aria-hidden','false'); el.style.display='block'; }
function closeDrawer(el){ if(!el) return; el.setAttribute('aria-hidden','true'); el.style.display='none'; }

document.addEventListener('click', function(e){
    if (e.target.matches('[data-close="modal"]')) closeModal(e.target.closest('.modal'));
    if (e.target.matches('[data-close="drawer"]')) closeDrawer(e.target.closest('.drawer'));
});

// Storage helpers
function readStore(key, fallback){ try{ return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch(e){ return fallback; } }
function writeStore(key, value){ localStorage.setItem(key, JSON.stringify(value)); }

// ============ Auth ============
function getCurrentUser(){ return readStore('currentUser', null); }

document.addEventListener('DOMContentLoaded', function(){
    const authModal = document.getElementById('authModal');
    const accountModal = document.getElementById('accountModal');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const goRegister = document.getElementById('goRegister');
    const goLogin = document.getElementById('goLogin');
    const logoutBtn = document.getElementById('logoutBtn');

    if (goRegister) goRegister.addEventListener('click', (e)=>{ e.preventDefault(); loginForm.hidden=true; registerForm.hidden=false; document.getElementById('authTitle').textContent='Регистрация'; });
    if (goLogin) goLogin.addEventListener('click', (e)=>{ e.preventDefault(); registerForm.hidden=true; loginForm.hidden=false; document.getElementById('authTitle').textContent='Войти'; });
    const forgot = document.getElementById('forgotPass');
    if (forgot) forgot.addEventListener('click', (e)=>{ e.preventDefault(); alert('Для демо введите любой новый пароль при регистрации. В реальном проекте здесь будет восстановление.'); });

    if (registerForm) registerForm.addEventListener('submit', function(e){
        e.preventDefault();
        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim().toLowerCase();
        const password = document.getElementById('regPassword').value;
        const users = readStore('users', []);
        if (users.some(u=>u.email===email)) { alert('Пользователь уже существует'); return; }
        const newUser = { 
            id: Date.now(), 
            name, 
            email, 
            password, 
            orders: [], 
            coupons: [],
            phone: '',
            address: '',
            avatar: ''
        };
        users.push(newUser); writeStore('users', users); writeStore('currentUser', {id:newUser.id,email:newUser.email});
        updateRegisterButtonVisibility();
        closeModal(authModal); openModal(accountModal); renderAccount();
    });

    if (loginForm) loginForm.addEventListener('submit', function(e){
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim().toLowerCase();
        const password = document.getElementById('loginPassword').value;
        const users = readStore('users', []);
        const user = users.find(u=>u.email===email && u.password===password);
        if (!user) { alert('Неверный email или пароль'); return; }
        writeStore('currentUser', {id:user.id,email:user.email});
        updateRegisterButtonVisibility();
        closeModal(authModal); openModal(accountModal); renderAccount();
    });

    if (logoutBtn) logoutBtn.addEventListener('click', function(){
        localStorage.removeItem('currentUser');
        updateRegisterButtonVisibility();
        closeModal(accountModal); openModal(authModal);
    });

    // eye toggle
    const toggleLoginPass = document.getElementById('toggleLoginPass');
    if (toggleLoginPass){
        toggleLoginPass.addEventListener('click', ()=>{
            const inp = document.getElementById('loginPassword');
            inp.type = inp.type === 'password' ? 'text' : 'password';
        });
    }
});

// ============ Account Panels ============
function renderAccount(){
    const userRef = getCurrentUser();
    const users = readStore('users', []);
    const user = users.find(u=>u.id===userRef?.id);
    if (!user) return;
    const ordersEl = document.getElementById('tab-orders');
    const couponsEl = document.getElementById('tab-coupons');
    const profileEl = document.getElementById('tab-profile');
    if (ordersEl){
        if (!user.orders.length) ordersEl.innerHTML = '<p>У вас пока нет заказов.</p>';
        else ordersEl.innerHTML = user.orders.map(o=>{
            const paymentInfo = o.paymentMethodName ? `<div style="font-size:13px;color:var(--ink-soft);margin-top:4px">Оплата: ${o.paymentMethodName}</div>` : '';
            const statusInfo = o.status === 'paid' ? '<span style="color:#22c55e;font-size:12px;margin-left:8px">✓ Оплачен</span>' : o.status === 'pending' ? '<span style="color:#f59e0b;font-size:12px;margin-left:8px">⏳ Ожидает оплаты</span>' : '';
            return `<div class="order-card"><div><strong>Заказ #${o.id}</strong> — ${new Date(o.date).toLocaleDateString('ru-RU')}${statusInfo}</div><div>${o.items.length} товаров · ${formatKZT(o.total)}</div>${paymentInfo}</div>`;
        }).join('');
    }
    if (couponsEl){
        const list = user.coupons.length ? user.coupons.map(c=>`<li>${c.code} — ${c.type==='percent'?c.value+'%':'₸'+c.value}</li>`).join('') : '<li>Нет сохранённых купонов</li>';
        couponsEl.innerHTML = `<ul>${list}</ul>`;
    }
    if (profileEl){
        const avatar = user.avatar || '';
        profileEl.innerHTML = `
            <div style="display:flex;flex-direction:column;gap:24px;">
                <div style="display:flex;flex-direction:column;align-items:center;gap:20px;padding:20px;background:var(--shell);border-radius:8px;border:1px solid var(--line)">
                    <div style="position:relative">
                        <div id="avatarPreviewModal" style="width:120px;height:120px;border-radius:50%;background:var(--accent-soft);display:flex;align-items:center;justify-content:center;overflow:hidden;border:3px solid var(--accent);cursor:pointer">
                            ${avatar ? `<img src="${avatar}" style="width:100%;height:100%;object-fit:cover" alt="Аватар">` : `<i class="fas fa-user" style="font-size:60px;color:var(--accent)"></i>`}
                        </div>
                        <input type="file" id="avatarInputModal" accept="image/*" style="display:none">
                        <label for="avatarInputModal" style="position:absolute;bottom:0;right:0;width:36px;height:36px;background:var(--accent);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;border:3px solid var(--shell);box-shadow:0 2px 8px rgba(0,0,0,0.2)">
                            <i class="fas fa-camera" style="color:white;font-size:16px"></i>
                        </label>
                    </div>
                    <div style="display:grid;gap:12px;width:100%;max-width:400px">
                        <div>
                            <label style="display:block;margin-bottom:4px;font-size:13px;color:var(--ink-soft);font-weight:500">Имя</label>
                            <input type="text" id="profileNameModal" value="${user.name || ''}" style="width:100%;padding:10px;border:1px solid var(--line);border-radius:8px;font-size:14px">
                        </div>
                        <div>
                            <label style="display:block;margin-bottom:4px;font-size:13px;color:var(--ink-soft);font-weight:500">Email</label>
                            <input type="email" id="profileEmailModal" value="${user.email || ''}" style="width:100%;padding:10px;border:1px solid var(--line);border-radius:8px;font-size:14px" readonly>
                        </div>
                        <div>
                            <label style="display:block;margin-bottom:4px;font-size:13px;color:var(--ink-soft);font-weight:500">Телефон</label>
                            <input type="tel" id="profilePhoneModal" value="${user.phone || ''}" placeholder="+7 (___) ___-__-__" style="width:100%;padding:10px;border:1px solid var(--line);border-radius:8px;font-size:14px">
                        </div>
                        <div>
                            <label style="display:block;margin-bottom:4px;font-size:13px;color:var(--ink-soft);font-weight:500">Адрес</label>
                            <textarea id="profileAddressModal" rows="3" placeholder="Ваш адрес доставки" style="width:100%;padding:10px;border:1px solid var(--line);border-radius:8px;font-size:14px;resize:vertical">${user.address || ''}</textarea>
                        </div>
                        <button id="saveProfileModal" class="btn btn-outline" style="width:100%;margin-top:8px">Сохранить изменения</button>
                    </div>
                </div>
                <div id="favoritesSection" style="width:100%;max-width:900px;margin:0 auto;">
                    <h4 style="margin-bottom:12px;font-size:18px;">Избранные товары</h4>
                    <div id="favoritesGrid" class="favorites-grid"></div>
                </div>
            </div>
        `;
        
        // Setup handlers for modal
        const avatarInputModal = document.getElementById('avatarInputModal');
        const avatarPreviewModal = document.getElementById('avatarPreviewModal');
        if (avatarInputModal && avatarPreviewModal) {
            avatarInputModal.onchange = null; // Remove old handlers
            avatarInputModal.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (!file) return;
                if (!file.type.startsWith('image/')) {
                    alert('Пожалуйста, выберите изображение');
                    return;
                }
                if (file.size > 2 * 1024 * 1024) {
                    alert('Размер файла не должен превышать 2 МБ');
                    return;
                }
                const reader = new FileReader();
                reader.onload = function(event) {
                    const base64 = event.target.result;
                    avatarPreviewModal.innerHTML = `<img src="${base64}" style="width:100%;height:100%;object-fit:cover" alt="Аватар">`;
                    const users = readStore('users', []);
                    const userIdx = users.findIndex(u=>u.id===user.id);
                    if (userIdx >= 0) {
                        users[userIdx].avatar = base64;
                        writeStore('users', users);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
        
        const saveBtnModal = document.getElementById('saveProfileModal');
        if (saveBtnModal) {
            saveBtnModal.onclick = null; // Remove old handlers
            saveBtnModal.addEventListener('click', function() {
                const name = document.getElementById('profileNameModal').value.trim();
                const phone = document.getElementById('profilePhoneModal').value.trim();
                const address = document.getElementById('profileAddressModal').value.trim();
                
                if (!name) {
                    alert('Имя обязательно для заполнения');
                    return;
                }
                
                const users = readStore('users', []);
                const userIdx = users.findIndex(u=>u.id===user.id);
                if (userIdx >= 0) {
                    users[userIdx].name = name;
                    users[userIdx].phone = phone;
                    users[userIdx].address = address;
                    writeStore('users', users);
                    alert('Профиль успешно сохранён!');
                    renderAccount(); // Refresh
                }
            });
        }
        
        // Render favorites list
        const favGrid = document.getElementById('favoritesGrid');
        if (favGrid) {
            const wishlist = getWishlist();
            if (!wishlist.length) {
                favGrid.innerHTML = '<p style="color:var(--ink-soft);font-size:14px;">У вас пока нет избранных товаров. Отмечайте сердечком понравившиеся ароматы в каталоге.</p>';
            } else {
                favGrid.innerHTML = wishlist.map(item => `
                    <div class="favorite-item" data-id="${item.id}">
                        <div class="favorite-thumb">
                            ${item.image ? `<img src="${item.image}" alt="${item.name}">` : '<div class="favorite-placeholder"><i class="fas fa-perfume"></i></div>'}
                        </div>
                        <div class="favorite-info">
                            <div class="favorite-name">${item.name}</div>
                            <button class="btn btn-outline btn-small favorite-remove">Убрать из избранного</button>
                        </div>
                    </div>
                `).join('');
                
                favGrid.querySelectorAll('.favorite-remove').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const itemEl = this.closest('.favorite-item');
                        const id = Number(itemEl.dataset.id);
                        let wishlist = getWishlist();
                        wishlist = wishlist.filter(w => w.id !== id);
                        setWishlist(wishlist);
                        updateWishlistBadge();
                        // Обновляем состояние сердечек в каталоге
                        document.querySelectorAll(`.wishlist-btn[data-product-id="${id}"]`).forEach(b => b.classList.remove('active'));
                        renderAccount();
                    });
                });
            }
        }
    }
    // tabs switch
    const tabsBar = document.querySelector('#accountModal .account-tabs');
    if (tabsBar && !tabsBar.dataset.wired){
        tabsBar.dataset.wired = '1';
        tabsBar.addEventListener('click', (e)=>{
            const btn = e.target.closest('.tab'); if(!btn) return;
            tabsBar.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
            btn.classList.add('active');
            const tab = btn.getAttribute('data-tab');
            document.querySelectorAll('#accountModal .tab-panel').forEach(p=>p.hidden=true);
            document.getElementById('tab-'+tab).hidden = false;
        });
    }

    // dashboard tiles -> tabs
    const dash = document.getElementById('accountDashboard');
    if (dash && !dash.dataset.wired){
        dash.dataset.wired = '1';
        dash.addEventListener('click', (e)=>{
            const card = e.target.closest('.dash-card'); if(!card) return;
            const tab = card.getAttribute('data-open-tab');
            const tabsBar = document.querySelector('#accountModal .account-tabs');
            const btn = tabsBar.querySelector(`.tab[data-tab="${tab}"]`);
            btn.click();
        });
    }
}

function formatKZT(n){ return '₸'+Number(n).toLocaleString('ru-RU'); }

// ============ Cart, Coupons, Checkout ============
document.addEventListener('DOMContentLoaded', function(){
    const cartIcon = document.getElementById('cartIcon');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartItemsEl = document.getElementById('cartItems');
    const subtotalEl = document.getElementById('subtotal');
    const discountEl = document.getElementById('discount');
    const grandTotalEl = document.getElementById('grandTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const applyCouponBtn = document.getElementById('applyCouponBtn');
    const couponInput = document.getElementById('couponInput');
    const cartBadge = cartIcon?.querySelector('.badge');

    // Делаем функции глобально доступными
    window.getCart = function(){ return readStore('cart', []); };
    window.setCart = function(c){ writeStore('cart', c); updateCartBadge(); };
    window.getCoupon = function(){ return readStore('appliedCoupon', null); };
    window.setCoupon = function(c){ writeStore('appliedCoupon', c); };
    
    // Локальные ссылки для использования внутри этого блока
    const getCart = window.getCart;
    const setCart = window.setCart;
    const getCoupon = window.getCoupon;
    const setCoupon = window.setCoupon;

    function updateCartBadge(){ if(cartBadge){ const c=getCart(); cartBadge.textContent = String(c.reduce((s,i)=>s+i.qty,0)); } }

    function calcTotals(){
        const cart = getCart();
        const subtotal = cart.reduce((s,i)=>s+i.price*i.qty,0);
        let discount = 0; const coupon = getCoupon();
        if (coupon){
            if (coupon.type==='percent') discount = Math.round(subtotal * (coupon.value/100));
            else discount = Math.min(coupon.value, subtotal);
        }
        const total = Math.max(0, subtotal - discount);
        subtotalEl.textContent = formatKZT(subtotal);
        discountEl.textContent = '-'+formatKZT(discount).replace('₸','₸');
        grandTotalEl.textContent = formatKZT(total);
    }

    function renderCart(){
        const cart = getCart();
        if (!cart.length){ cartItemsEl.innerHTML = '<p>Корзина пуста</p>'; }
        else {
            cartItemsEl.innerHTML = cart.map(item=>`
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}">
                    <div>
                        <h4>${item.name}</h4>
                        <div class="qty">
                            <button data-act="dec">−</button>
                            <span>${item.qty}</span>
                            <button data-act="inc">+</button>
                            <button data-act="del" title="Удалить" style="margin-left:8px">×</button>
                        </div>
                    </div>
                    <div class="price-sm">${formatKZT(item.price*item.qty)}</div>
                </div>
            `).join('');
        }
        calcTotals();
    }

    cartItemsEl?.addEventListener('click', function(e){
        const itemEl = e.target.closest('.cart-item'); if(!itemEl) return;
        const id = Number(itemEl.dataset.id);
        let cart = getCart();
        const idx = cart.findIndex(i=>i.id===id);
        if (idx<0) return;
        if (e.target.dataset.act==='inc') {
            cart[idx].qty++;
        }
        if (e.target.dataset.act==='dec') {
            cart[idx].qty--;
            if (cart[idx].qty <= 0) {
                cart.splice(idx, 1);
            }
        }
        if (e.target.dataset.act==='del') {
            cart.splice(idx,1);
        }
        setCart(cart); renderCart();
    });

    cartIcon?.addEventListener('click', function(){ openDrawer(cartDrawer); renderCart(); });

    applyCouponBtn?.addEventListener('click', function(){
        const code = couponInput.value.trim().toUpperCase();
        if (!code){ setCoupon(null); renderCart(); return; }
        // demo coupons: SALE10 (10%), SAVE3000 (₸3000)
        const coupons = { 'SALE10':{code:'SALE10',type:'percent',value:10}, 'SAVE3000':{code:'SAVE3000',type:'fixed',value:3000} };
        const c = coupons[code];
        if (!c){ alert('Купон не найден'); return; }
        setCoupon(c); renderCart();
    });

    checkoutBtn?.addEventListener('click', function(){
        const userRef = getCurrentUser();
        if (!userRef){ closeDrawer(cartDrawer); const authModal=document.getElementById('authModal'); openModal(authModal); return; }
        const cart = getCart(); if (!cart.length){ alert('Корзина пуста'); return; }
        const coupon = getCoupon();
        const subtotal = cart.reduce((s,i)=>s+i.price*i.qty,0);
        const discount = coupon ? (coupon.type==='percent'? Math.round(subtotal*(coupon.value/100)) : Math.min(coupon.value, subtotal)) : 0;
        const total = Math.max(0, subtotal - discount);
        
        // Показываем окно выбора способа оплаты
        const paymentModal = document.getElementById('paymentModal');
        if (paymentModal) {
            // Обновляем суммы в окне оплаты
            document.getElementById('paymentSubtotal').textContent = formatKZT(subtotal);
            document.getElementById('paymentDiscount').textContent = '-' + formatKZT(discount).replace('₸','₸');
            document.getElementById('paymentTotal').textContent = formatKZT(total);
            
            closeDrawer(cartDrawer);
            openModal(paymentModal);
            
            // Дополнительная проверка: убеждаемся, что обработчики работают
            setTimeout(() => {
                const kaspiMethod = paymentModal.querySelector('[data-method="kaspi"]');
                if (kaspiMethod) {
                    console.log('Kaspi метод найден, обработчики должны работать');
                } else {
                    console.error('Kaspi метод не найден в модальном окне');
                }
            }, 100);
        }
    });

    updateCartBadge();
});

// ============ Payment System ============
const KASPI_QR_STORAGE_KEY = 'kaspiStaticQrImage';
const DEFAULT_KASPI_QR = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="720" height="960" viewBox="0 0 720 960"><rect width="100%" height="100%" fill="#f5f5f5"/><rect x="120" y="160" width="480" height="480" rx="24" fill="#ffffff" stroke="#d1d5db" stroke-width="8" stroke-dasharray="14 14"/><text x="50%" y="360" text-anchor="middle" font-family="Montserrat, sans-serif" font-size="42" fill="#374151">Kaspi QR</text><text x="50%" y="420" text-anchor="middle" font-family="Montserrat, sans-serif" font-size="28" fill="#9ca3af">Загрузите изображение</text><text x="50%" y="520" text-anchor="middle" font-family="Montserrat, sans-serif" font-size="24" fill="#f97316">Кнопка «Загрузить QR»</text><text x="50%" y="560" text-anchor="middle" font-family="Montserrat, sans-serif" font-size="20" fill="#6b7280">Сохраняется на этом устройстве</text></svg>`);
window.useStaticKaspiQR = true;

let kaspiPayment = null;
let kaspiQrUploadInput = null;

function getKaspiStaticQr(){
    try {
        return localStorage.getItem(KASPI_QR_STORAGE_KEY) || DEFAULT_KASPI_QR;
    } catch (e) {
        return DEFAULT_KASPI_QR;
    }
}

function setKaspiStaticQr(dataUrl){
    try {
        localStorage.setItem(KASPI_QR_STORAGE_KEY, dataUrl);
    } catch (e) {
        console.error('Не удалось сохранить Kaspi QR:', e);
    }
}

function ensureKaspiQrUploader(currentPaymentData, renderFn){
    if (kaspiQrUploadInput) return kaspiQrUploadInput;
    kaspiQrUploadInput = document.createElement('input');
    kaspiQrUploadInput.type = 'file';
    kaspiQrUploadInput.accept = 'image/*';
    kaspiQrUploadInput.style.display = 'none';
    kaspiQrUploadInput.addEventListener('change', function(){
        const file = this.files && this.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            alert('Пожалуйста, выберите изображение QR-кода');
            return;
        }
        const reader = new FileReader();
        reader.onload = function(evt){
            setKaspiStaticQr(String(evt.target?.result || ''));
            alert('Kaspi QR обновлён! Этот QR сохранён в вашем браузере.');
            if (currentPaymentData && typeof renderFn === 'function') {
                renderFn(currentPaymentData);
            }
        };
        reader.readAsDataURL(file);
        this.value = '';
    });
    document.body.appendChild(kaspiQrUploadInput);
    return kaspiQrUploadInput;
}

document.addEventListener('DOMContentLoaded', function(){
    if (typeof KaspiPayment !== 'undefined') {
        kaspiPayment = new KaspiPayment({
            isDemo: true // По умолчанию демо-режим
        });
    }
});

document.addEventListener('DOMContentLoaded', function(){
    const paymentModal = document.getElementById('paymentModal');
    if (!paymentModal) {
        console.error('paymentModal не найден');
        return;
    }
    
    let selectedPaymentMethod = null;
    let currentPayment = null;
    let currentPaymentData = null; // Сохраняем данные заказа для завершения
    
    // Функция для получения способов оплаты (может вызываться после открытия модалки)
    function getPaymentMethods() {
        return paymentModal.querySelectorAll('.payment-method');
    }
    
    // Выбор способа оплаты - используем делегирование для надежности
    paymentModal.addEventListener('click', function(e){
        const method = e.target.closest('.payment-method');
        if (!method) return;
        
        e.stopPropagation();
        e.preventDefault();
        
        const methodType = method.getAttribute('data-method');
        console.log('Клик по способу оплаты:', methodType);
        
        // Визуальная обратная связь
        method.style.opacity = '0.7';
        setTimeout(() => {
            method.style.opacity = '1';
        }, 150);
        
        // Для Kaspi сразу открываем окно с QR-кодом
        if (methodType === 'kaspi') {
            console.log('Обработка Kaspi платежа...');
            try {
                // Вызываем функцию (она будет определена ниже)
                if (typeof handleKaspiPayment === 'function') {
                    const result = handleKaspiPayment();
                    if (result && result.catch) {
                        result.catch(error => {
                            console.error('Ошибка в handleKaspiPayment:', error);
                            alert('Ошибка создания платежа: ' + (error.message || error));
                        });
                    }
                } else {
                    console.error('handleKaspiPayment не определена');
                    alert('Ошибка: функция обработки платежа не найдена');
                }
            } catch (error) {
                console.error('Синхронная ошибка при вызове handleKaspiPayment:', error);
                alert('Ошибка: ' + error.message);
            }
            return false;
        }
        
        // Для других методов - стандартная логика выбора
        const paymentMethods = getPaymentMethods();
        paymentMethods.forEach(m => m.classList.remove('selected'));
        method.classList.add('selected');
        selectedPaymentMethod = methodType;
    });
    
    // Двойной клик для завершения заказа (для других методов, кроме Kaspi)
    paymentModal.addEventListener('dblclick', function(e){
        const method = e.target.closest('.payment-method');
        if (!method) return;
        
        const methodType = method.getAttribute('data-method');
        
        // Для Kaspi не обрабатываем двойной клик
        if (methodType === 'kaspi') {
            return;
        }
        
        // Если способ уже выбран, завершаем заказ при двойном клике
        if (selectedPaymentMethod === methodType) {
            processPayment(selectedPaymentMethod);
        }
    });
    
    function showKaspiStaticPaymentView(orderSnapshot){
        const modalBody = paymentModal.querySelector('.modal-body');
        if (!modalBody) return;
        const qrImage = getKaspiStaticQr();
        const storeInfo = `
            <div style="text-align:center;margin-bottom:12px">
                <div style="font-weight:600;font-size:18px">Omori Perfume</div>
                <div style="color:var(--ink-soft);font-size:14px">ИП Турсунтай · Иргели, Асыл Арман, 7</div>
            </div>`;
        modalBody.innerHTML = `
            <div class="kaspi-static-qr">
                ${storeInfo}
                <div class="kaspi-static-qr-image">
                    <img src="${qrImage}" alt="Kaspi QR">
                </div>
                <div class="kaspi-payment-info">
                    <div class="kaspi-payment-amount">${formatKZT(orderSnapshot.total)}</div>
                    <div class="kaspi-payment-order">Заказ #${orderSnapshot.orderId}</div>
                    <div class="kaspi-payment-status pending">Сканируйте в приложении Kaspi</div>
                </div>
                <div class="kaspi-static-qr-actions">
                    <button class="btn" onclick="confirmKaspiStaticPayment()">
                        <i class="fas fa-check-circle"></i>
                        Я оплатил
                    </button>
                    <button class="btn btn-outline" onclick="openKaspiQrUpload()">
                        <i class="fas fa-qrcode"></i>
                        Загрузить QR
                    </button>
                </div>
                <p class="kaspi-static-qr-hint">
                    QR хранится только в вашем браузере. Загрузите изображение из Kaspi Pay, чтобы клиенты могли сканировать.
                </p>
            </div>
        `;
    }

    function showKaspiStaticPayment(total, orderId, cart, coupon, subtotal, discount){
        currentPayment = { id: 'STATIC_'+orderId, status: 'pending' };
        currentPaymentData = { orderId, total, cart, coupon, subtotal, discount };
        showKaspiStaticPaymentView(currentPaymentData);
        ensureKaspiQrUploader(currentPaymentData, showKaspiStaticPaymentView);
    }

    window.confirmKaspiStaticPayment = function(){
        if (!currentPaymentData) {
            alert('Нет активного заказа');
            return;
        }
        currentPayment = { ...(currentPayment || {}), status: 'completed' };
        completeOrderWithKaspi(
            currentPaymentData.orderId,
            currentPaymentData.total,
            currentPaymentData.cart,
            currentPaymentData.coupon,
            currentPaymentData.subtotal,
            currentPaymentData.discount
        );
    };

    window.openKaspiQrUpload = function(){
        const input = ensureKaspiQrUploader(currentPaymentData, showKaspiStaticPaymentView);
        if (input) input.click();
    };

    // Обработка оплаты через Kaspi (доступна глобально для отладки)
    window.handleKaspiPayment = async function() {
        console.log('handleKaspiPayment вызвана');
        
        // Убеждаемся, что модальное окно открыто
        if (!paymentModal) {
            console.error('paymentModal не найден');
            alert('Ошибка: модальное окно оплаты не найдено');
            return;
        }
        
        if (paymentModal.getAttribute('aria-hidden') === 'true') {
            openModal(paymentModal);
        }
        
        // Убеждаемся, что модальное окно видимо
        if (paymentModal.style.display === 'none') {
            paymentModal.style.display = 'block';
        }
        
        const userRef = getCurrentUser();
        if (!userRef) {
            alert('Необходимо войти в систему');
            closeModal(paymentModal);
            // Открываем окно входа
            const authModal = document.getElementById('authModal');
            if (authModal) {
                setTimeout(() => openModal(authModal), 300);
            }
            return;
        }
        
        // Используем глобальные функции
        const getCartFunc = window.getCart || function(){ return readStore('cart', []); };
        const getCouponFunc = window.getCoupon || function(){ return readStore('appliedCoupon', null); };
        
        const cart = getCartFunc();
        if (!cart.length) {
            alert('Корзина пуста');
            return;
        }
        
        const coupon = getCouponFunc();
        const subtotal = cart.reduce((s,i)=>s+i.price*i.qty,0);
        const discount = coupon ? (coupon.type==='percent'? Math.round(subtotal*(coupon.value/100)) : Math.min(coupon.value, subtotal)) : 0;
        const total = Math.max(0, subtotal - discount);
        
        const orderId = Date.now();
        
        if (window.useStaticKaspiQR !== false) {
            showKaspiStaticPayment(total, orderId, cart, coupon, subtotal, discount);
            return;
        }
        
        // Создаем платеж через Kaspi (API режим)
        if (!kaspiPayment) {
            console.error('kaspiPayment не инициализирован');
            if (typeof KaspiPayment !== 'undefined') {
                kaspiPayment = new KaspiPayment({ isDemo: true });
                console.log('Kaspi Payment инициализирован в демо-режиме');
            } else {
                alert('Модуль Kaspi Payment не загружен. Проверьте, что файл kaspi-payment.js подключен.');
                return;
            }
        }
        
        try {
            console.log('Начинаем создание платежа...');
            // Показываем загрузку СРАЗУ
            const modalBody = paymentModal.querySelector('.modal-body');
            if (modalBody) {
                modalBody.innerHTML = `
                    <div class="kaspi-payment-loading">
                        <div class="spinner"></div>
                        <p>Создание платежа...</p>
                    </div>
                `;
            }
            
            const payment = await kaspiPayment.createPayment({
                orderId: orderId,
                amount: total,
                description: `Заказ #${orderId}`,
                customerPhone: userRef.phone || '',
                customerEmail: userRef.email || ''
            });
            
            console.log('Платеж создан:', payment);
            
            currentPayment = payment;
            // Сохраняем данные заказа для завершения
            currentPaymentData = {
                orderId: orderId,
                total: total,
                cart: JSON.parse(JSON.stringify(cart)), // Копия корзины
                coupon: coupon,
                subtotal: subtotal,
                discount: discount
            };
            
            // Показываем QR-код
            console.log('Показываем QR-код...');
            showKaspiPaymentQR(payment, total, orderId);
            
            // Начинаем проверку статуса платежа
            kaspiPayment.startPaymentPolling(payment.id, (updatedPayment) => {
                currentPayment = updatedPayment;
                if (updatedPayment.status === 'completed') {
                    // Платеж успешен - создаем заказ
                    if (currentPaymentData) {
                        completeOrderWithKaspi(
                            currentPaymentData.orderId,
                            currentPaymentData.total,
                            currentPaymentData.cart,
                            currentPaymentData.coupon,
                            currentPaymentData.subtotal,
                            currentPaymentData.discount
                        );
                    }
                } else if (updatedPayment.status === 'failed') {
                    alert('Платеж не прошел. Попробуйте еще раз.');
                }
            });
        } catch (error) {
            console.error('Ошибка создания платежа Kaspi:', error);
            alert('Ошибка создания платежа: ' + error.message);
            
            // Показываем ошибку в модальном окне
            const modalBody = paymentModal.querySelector('.modal-body');
            if (modalBody) {
                modalBody.innerHTML = `
                    <div style="padding: 40px; text-align: center;">
                        <p style="color: var(--accent); margin-bottom: 20px;">Ошибка создания платежа</p>
                        <p style="color: var(--ink-soft); margin-bottom: 20px;">${error.message}</p>
                        <button class="btn btn-outline" onclick="location.reload()">Обновить страницу</button>
                    </div>
                `;
            }
        }
    }
    
    // Показать QR-код для оплаты Kaspi
    function showKaspiPaymentQR(payment, total, orderId) {
        console.log('showKaspiPaymentQR вызвана', { payment, total, orderId });
        
        const modalBody = paymentModal.querySelector('.modal-body');
        if (!modalBody) {
            console.error('modalBody не найден');
            return;
        }
        
        // Убеждаемся, что модальное окно открыто
        if (paymentModal.getAttribute('aria-hidden') === 'true') {
            openModal(paymentModal);
        }
        
        const isDemo = kaspiPayment && kaspiPayment.isDemo;
        const demoButton = isDemo ? `
            <button class="btn" onclick="simulateKaspiPayment()" style="background: var(--accent); color: white; margin-top: 12px; width: 100%;">
                <i class="fas fa-check"></i>
                Симулировать оплату (демо)
            </button>
        ` : '';
        
        const qrCodeUrl = payment.qrCode || payment.qrCodeUrl || '';
        const paymentUrl = payment.paymentUrl || '#';
        
        console.log('QR Code URL:', qrCodeUrl);
        console.log('Payment URL:', paymentUrl);
        
        modalBody.innerHTML = `
            <div class="kaspi-payment-container">
                <div class="kaspi-qr-code">
                    <img src="${qrCodeUrl}" alt="QR код для оплаты Kaspi" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <div style="display:none; padding: 20px; text-align: center; color: var(--ink-soft);">
                        <i class="fas fa-qrcode" style="font-size: 48px; margin-bottom: 10px;"></i>
                        <p>QR-код загружается...</p>
                    </div>
                </div>
                <div class="kaspi-payment-info">
                    <div class="kaspi-payment-amount">${formatKZT(total)}</div>
                    <div class="kaspi-payment-order">Заказ #${orderId}</div>
                    <div class="kaspi-payment-status pending">Ожидание оплаты</div>
                    ${isDemo ? '<div style="font-size:12px;color:var(--ink-soft);margin-top:8px;text-align:center">Демо-режим: используйте кнопку ниже для тестирования</div>' : ''}
                </div>
                <div class="kaspi-payment-actions">
                    <a href="${paymentUrl}" class="kaspi-open-app" target="_blank" style="flex: 1;">
                        <i class="fas fa-mobile-alt"></i>
                        Открыть в Kaspi
                    </a>
                    <button class="btn btn-outline" onclick="checkKaspiPaymentStatus()" style="flex: 1;">
                        <i class="fas fa-sync-alt"></i>
                        Проверить
                    </button>
                </div>
                ${demoButton}
                <button class="btn btn-outline" onclick="cancelKaspiPayment()" style="margin-top: 12px; width: 100%;">
                    Отменить
                </button>
            </div>
        `;
        
        console.log('QR-код отображен');
    }
    
    // Показать загрузку
    function showKaspiPaymentLoading() {
        const modalBody = paymentModal.querySelector('.modal-body');
        if (!modalBody) return;
        
        modalBody.innerHTML = `
            <div class="kaspi-payment-loading">
                <div class="spinner"></div>
                <p>Создание платежа...</p>
            </div>
        `;
    }
    
    // Завершить заказ после успешной оплаты Kaspi
    function completeOrderWithKaspi(orderId, total, cart, coupon, subtotal, discount) {
        const userRef = getCurrentUser();
        if (!userRef) return;
        
        const users = readStore('users', []);
        const idx = users.findIndex(u=>u.id===userRef.id);
        
        const order = { 
            id: orderId, 
            date: new Date().toISOString(), 
            items: cart, 
            subtotal, 
            discount, 
            total,
            paymentMethod: 'kaspi',
            paymentMethodName: 'Kaspi.kz',
            status: 'paid',
            paymentId: currentPayment?.id
        };
        
        if (idx>=0){ 
            users[idx].orders = users[idx].orders || []; 
            users[idx].orders.unshift(order); 
            writeStore('users', users); 
        }
        
        // Очищаем корзину (используем глобальные функции или fallback)
        const setCartFunc = window.setCart || function(c){ writeStore('cart', c); };
        const setCouponFunc = window.setCoupon || function(c){ writeStore('appliedCoupon', c); };
        setCartFunc([]); 
        setCouponFunc(null);
        
        // Обновляем отображение корзины, если функция доступна
        if (typeof renderCart === 'function') {
            renderCart();
        } 
        closeModal(paymentModal);
        
        // Показываем подтверждение
        alert(`Заказ успешно оплачен!\nСпособ оплаты: Kaspi.kz\nСумма: ${formatKZT(total)}\nЗаказ #${orderId}`);
        
        // Открываем личный кабинет с заказами
        const accountModal = document.getElementById('accountModal');
        if (accountModal) {
            openModal(accountModal);
            renderAccount();
            const ordersTab = accountModal.querySelector('.account-tabs .tab[data-tab="orders"]');
            if (ordersTab) ordersTab.click();
        }
        
        currentPayment = null;
        currentPaymentData = null;
    }
    
    // Глобальные функции для кнопок в QR-окне
    window.checkKaspiPaymentStatus = async function() {
        if (!currentPayment || !kaspiPayment) return;
        
        try {
            const updated = await kaspiPayment.checkPaymentStatus(currentPayment.id);
            currentPayment = updated;
            
            if (updated.status === 'completed') {
                // Используем сохраненные данные заказа
                if (currentPaymentData) {
                    completeOrderWithKaspi(
                        currentPaymentData.orderId,
                        currentPaymentData.total,
                        currentPaymentData.cart,
                        currentPaymentData.coupon,
                        currentPaymentData.subtotal,
                        currentPaymentData.discount
                    );
                } else {
                    // Fallback: получаем данные из корзины
                    const userRef = getCurrentUser();
                    const cart = getCart();
                    const coupon = getCoupon();
                    const subtotal = cart.reduce((s,i)=>s+i.price*i.qty,0);
                    const discount = coupon ? (coupon.type==='percent'? Math.round(subtotal*(coupon.value/100)) : Math.min(coupon.value, subtotal)) : 0;
                    const total = Math.max(0, subtotal - discount);
                    
                    completeOrderWithKaspi(currentPayment.orderId, total, cart, coupon, subtotal, discount);
                }
            } else {
                alert('Платеж еще не подтвержден. Пожалуйста, подождите.');
            }
        } catch (error) {
            console.error('Ошибка проверки статуса:', error);
            alert('Ошибка проверки статуса платежа');
        }
    };
    
    window.cancelKaspiPayment = function() {
        if (confirm('Отменить оплату через Kaspi?')) {
            currentPayment = null;
            currentPaymentData = null;
            closeModal(paymentModal);
        }
    };
    
    // Симуляция оплаты для демо-режима
    window.simulateKaspiPayment = async function() {
        if (!currentPayment || !kaspiPayment || !currentPaymentData) {
            alert('Нет активного платежа');
            return;
        }
        
        if (!kaspiPayment.isDemo) {
            alert('Эта функция доступна только в демо-режиме');
            return;
        }
        
        try {
            // Обновляем статус платежа в хранилище
            const payments = kaspiPayment.payments;
            const paymentIndex = payments.findIndex(p => p.id === currentPayment.id);
            
            if (paymentIndex >= 0) {
                payments[paymentIndex].status = 'completed';
                payments[paymentIndex].transactionId = 'DEMO_TXN_' + Date.now();
                payments[paymentIndex].updatedAt = new Date().toISOString();
                kaspiPayment.savePayments();
                
                // Обновляем текущий платеж
                currentPayment = payments[paymentIndex];
                
                // Завершаем заказ
                completeOrderWithKaspi(
                    currentPaymentData.orderId,
                    currentPaymentData.total,
                    currentPaymentData.cart,
                    currentPaymentData.coupon,
                    currentPaymentData.subtotal,
                    currentPaymentData.discount
                );
            }
        } catch (error) {
            console.error('Ошибка симуляции оплаты:', error);
            alert('Ошибка симуляции оплаты');
        }
    };
    
    function processPayment(method) {
        const userRef = getCurrentUser();
        if (!userRef) return;
        
        const cart = getCart();
        if (!cart.length) return;
        
        const coupon = getCoupon();
        const subtotal = cart.reduce((s,i)=>s+i.price*i.qty,0);
        const discount = coupon ? (coupon.type==='percent'? Math.round(subtotal*(coupon.value/100)) : Math.min(coupon.value, subtotal)) : 0;
        const total = Math.max(0, subtotal - discount);
        
        const paymentNames = {
            'kaspi': 'Kaspi.kz',
            'halyk': 'Halyk Bank',
            'card': 'Банковская карта',
            'cash': 'Наличными'
        };
        
        // Создаем заказ
        const users = readStore('users', []);
        const idx = users.findIndex(u=>u.id===userRef.id);
        const order = { 
            id: Date.now(), 
            date: new Date().toISOString(), 
            items: cart, 
            subtotal, 
            discount, 
            total,
            paymentMethod: method,
            paymentMethodName: paymentNames[method] || method,
            status: method === 'cash' ? 'pending' : 'paid'
        };
        
        if (idx>=0){ 
            users[idx].orders = users[idx].orders || []; 
            users[idx].orders.unshift(order); 
            writeStore('users', users); 
        }
        
        // Очищаем корзину
        setCart([]); 
        setCoupon(null); 
        renderCart(); 
        closeModal(paymentModal);
        
        // Показываем подтверждение
        alert(`Заказ оформлен!\nСпособ оплаты: ${paymentNames[method]}\nСумма: ${formatKZT(total)}\n\n${method === 'cash' ? 'Оплата при получении' : 'Ожидайте подтверждения оплаты'}`);
        
        // Открываем личный кабинет с заказами
        const accountModal = document.getElementById('accountModal');
        if (accountModal) {
            openModal(accountModal);
            renderAccount();
            const ordersTab = accountModal.querySelector('.account-tabs .tab[data-tab="orders"]');
            if (ordersTab) ordersTab.click();
        }
        
        selectedPaymentMethod = null;
        paymentMethods.forEach(m => m.classList.remove('selected'));
    }
});

// ============ Add-to-cart function ============
function addToCart(id, name, price, image) {
    let cart = readStore('cart', []);
    const idx = cart.findIndex(i=>i.id===id);
    if (idx>=0) cart[idx].qty++; else cart.push({id,name,price,qty:1,image});
    writeStore('cart', cart);
    const cartIcon = document.getElementById('cartIcon');
    const badge = cartIcon?.querySelector('.badge');
    if (badge) badge.textContent = String(cart.reduce((s,i)=>s+i.qty,0));
}

// ============ Add-to-cart buttons on catalog ============
document.addEventListener('DOMContentLoaded', function(){
    // Hook into existing catalog rendering to add buttons
    const grid = document.getElementById('catalogGrid');
    if (!grid) return;
    const observer = new MutationObserver(()=>{
        grid.querySelectorAll('.product-card').forEach(card=>{
            if (card.dataset.wired) return; card.dataset.wired='1';
            
            // Add to cart button
            const existingBtn = card.querySelector('.btn-add');
            if (!existingBtn) {
                const btn = document.createElement('button');
                btn.className = 'btn btn-outline btn-add';
                btn.textContent = 'В корзину';
                btn.style.width = '100%';
                btn.style.marginTop = '8px';
                btn.addEventListener('click', ()=>{
                    const name = card.querySelector('h3').textContent;
                    const priceText = card.querySelector('.price').textContent.replace(/[₸\s]/g,'');
                    const price = Number(priceText.replace(/\D/g,''));
                    const img = card.querySelector('img')?.src || '';
                    const id = hashCode(name+img);
                    let cart = readStore('cart', []);
                    const idx = cart.findIndex(i=>i.id===id);
                    if (idx>=0) cart[idx].qty++; else cart.push({id,name,price,qty:1,image:img});
                    localStorage.setItem('cart', JSON.stringify(cart));
                    const cartIcon = document.getElementById('cartIcon');
                    const badge = cartIcon?.querySelector('.badge');
                    if (badge) badge.textContent = String(cart.reduce((s,i)=>s+i.qty,0));
                });
                card.querySelector('.product-info')?.appendChild(btn);
            }
            
            // Wishlist button
            const priceEl = card.querySelector('.price');
            if (priceEl && !card.querySelector('.wishlist-btn')) {
                const wishlistBtn = document.createElement('button');
                wishlistBtn.className = 'wishlist-btn';
                wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
                wishlistBtn.title = 'Добавить в избранное';
                const name = card.querySelector('h3').textContent;
                const img = card.querySelector('img')?.src || '';
                const id = hashCode(name+img);
                wishlistBtn.setAttribute('data-product-id', id);
                
                const wishlist = getWishlist();
                if (wishlist.some(w => w.id === id)) {
                    wishlistBtn.classList.add('active');
                }
                
                const priceContainer = document.createElement('div');
                priceContainer.style.display = 'flex';
                priceContainer.style.alignItems = 'center';
                priceContainer.style.justifyContent = 'space-between';
                priceContainer.style.gap = '10px';
                priceContainer.style.marginTop = '8px';
                priceEl.parentNode.insertBefore(priceContainer, priceEl);
                priceContainer.appendChild(priceEl);
                priceContainer.appendChild(wishlistBtn);
            }
        });
    });
    
    // Делегирование кликов по лайкам
    grid.addEventListener('click', (e)=>{
        const btn = e.target.closest('.wishlist-btn');
        if (!btn) return;
        e.preventDefault();
        e.stopPropagation();
        
        const card = btn.closest('.product-card');
        if (!card) return;
        const name = card.querySelector('h3')?.textContent || '';
        const img = card.querySelector('img')?.src || '';
        let id = btn.getAttribute('data-product-id');
        if (!id) {
            id = String(hashCode(name+img));
            btn.setAttribute('data-product-id', id);
        } else {
            id = isNaN(Number(id)) ? id : Number(id);
        }
        
        toggleWishlist(id, name, img);
        btn.classList.toggle('active');
        updateWishlistBadge();
    });
    observer.observe(grid, { childList: true, subtree: true });
});

function hashCode(str){ let h=0; for(let i=0;i<str.length;i++){ h=((h<<5)-h)+str.charCodeAt(i); h|=0; } return Math.abs(h); }
// Catalog generation and rendering (only real products)
document.addEventListener('DOMContentLoaded', function() {
    const grid = document.getElementById('catalogGrid');
    if (!grid) {
        console.error('Элемент catalogGrid не найден!');
        return;
    }

    const PAGE_SIZE = 24;
    let allItems = [];
    let filtered = [];
    let page = 0;
    let currentCategory = 'all';
    let currentSearch = '';
    let currentSort = 'popular_desc';

    // Real products only - полный каталог с правильными названиями в правильном порядке
    const realProducts = [
        {
            id: 9999,
            name: 'Antonio Banderas – Blue Seduction',
            brand: 'Antonio Banderas',
            category: 'men',
            price: 35000,
            popularity: 100,
            image: 'каталог/Antonio Banderas – Blue Seduction.jpg'
        },
        {
            id: 9997,
            name: 'Zam Zam',
            brand: 'Zam Zam',
            category: 'unisex',
            price: 25000,
            popularity: 99,
            image: 'каталог/Zam Zam.png'
        },
        {
            id: 9996,
            name: 'Chanel – Allure Homme Sport',
            brand: 'Chanel',
            category: 'men',
            price: 75000,
            popularity: 98,
            image: 'каталог/Chanel – Allure Homme Sport.jpg'
        },
        {
            id: 9988,
            name: 'Bleu de Chanel',
            brand: 'Chanel',
            category: 'men',
            price: 80000,
            popularity: 97,
            image: 'каталог/Bleu de Chanel.jpg'
        },
        {
            id: 9993,
            name: 'Creed – Aventus',
            brand: 'Creed',
            category: 'men',
            price: 120000,
            popularity: 96,
            image: 'каталог/Creed – Aventus.jpg'
        },
        {
            id: 9980,
            name: 'Dior – Sauvage',
            brand: 'Dior',
            category: 'men',
            price: 68000,
            popularity: 95,
            image: 'каталог/Dior – Sauvage.jpg'
        },
        {
            id: 9990,
            name: 'Giorgio Armani – Acqua di Giò',
            brand: 'Giorgio Armani',
            category: 'men',
            price: 60000,
            popularity: 94,
            image: 'каталог/Giorgio Armani – Acqua di Giò.jpg'
        },
        {
            id: 9994,
            name: 'Armani – Stronger With You',
            brand: 'Armani',
            category: 'men',
            price: 45000,
            popularity: 93,
            image: 'каталог/Armani – Stronger With You.jpg'
        },
        {
            id: 9987,
            name: 'Louis Vuitton – L\'Immensité',
            brand: 'Louis Vuitton',
            category: 'men',
            price: 180000,
            popularity: 92,
            image: 'каталог/Louis Vuitton – L\'Immensité.png'
        },
        {
            id: 9986,
            name: 'Chanel No. 5',
            brand: 'Chanel',
            category: 'women',
            price: 90000,
            popularity: 91,
            image: 'каталог/Chanel No. 5.jpg'
        },
        {
            id: 9962,
            name: 'HFC – Devil\'s Intrigue',
            brand: 'HFC',
            category: 'women',
            price: 68000,
            popularity: 90,
            image: 'каталог/HFC – Devil\'s Intrigue.jpg'
        },
        {
            id: 9979,
            name: 'Bvlgari – Tygar',
            brand: 'Bvlgari',
            category: 'men',
            price: 88000,
            popularity: 89,
            image: 'каталог/Bvlgari – Tygar.png'
        },
        {
            id: 9961,
            name: 'Kilian – Angel Share',
            brand: 'Kilian',
            category: 'unisex',
            price: 130000,
            popularity: 88,
            image: 'каталог/Kilian – Angel Share.jpg'
        },
        {
            id: 9970,
            name: 'Tom Ford – Ombre Leather',
            brand: 'Tom Ford',
            category: 'men',
            price: 105000,
            popularity: 87,
            image: 'каталог/Tom Ford – Ombre Leather.jpg'
        },
        {
            id: 9968,
            name: 'Zielinski & Rozen – Vanilla Blend',
            brand: 'Zielinski & Rozen',
            category: 'unisex',
            price: 45000,
            popularity: 86,
            image: 'каталог/Zielinski & Rozen – Vanilla Blend.png'
        },
        {
            id: 9969,
            name: 'Bvlgari – Omnia Crystalline',
            brand: 'Bvlgari',
            category: 'women',
            price: 65000,
            popularity: 85,
            image: 'каталог/Bvlgari – Omnia Crystalline.png'
        },
        {
            id: 9984,
            name: 'Byredo – Blanche',
            brand: 'Byredo',
            category: 'women',
            price: 85000,
            popularity: 84,
            image: 'каталог/Byredo – Blanche.jpg'
        },
        {
            id: 9972,
            name: 'Chanel – Chance Eau Fraîche',
            brand: 'Chanel',
            category: 'women',
            price: 75000,
            popularity: 83,
            image: 'каталог/Chanel – Chance Eau Fraîche.jpg'
        },
        {
            id: 9971,
            name: 'Chanel – Coco Mademoiselle',
            brand: 'Chanel',
            category: 'women',
            price: 82000,
            popularity: 82,
            image: 'каталог/Chanel – Coco Mademoiselle.jpg'
        },
        {
            id: 9967,
            name: 'Miss Dior',
            brand: 'Dior',
            category: 'women',
            price: 92000,
            popularity: 81,
            image: 'каталог/Miss Dior.jpg'
        },
        {
            id: 9954,
            name: 'YSL – Black Opium',
            brand: 'Yves Saint Laurent',
            category: 'women',
            price: 88000,
            popularity: 80,
            image: 'каталог/YSL – Black Opium.jpg'
        },
        {
            id: 9953,
            name: 'Paco Rabanne – Fame',
            brand: 'Paco Rabanne',
            category: 'women',
            price: 72000,
            popularity: 79,
            image: 'каталог/Paco Rabanne – Fame.jpg'
        },
        {
            id: 9952,
            name: 'Shiseido – Ginza Tokyo',
            brand: 'Shiseido',
            category: 'women',
            price: 95000,
            popularity: 78,
            image: 'каталог/Shiseido – Ginza Tokyo.jpg'
        },
        {
            id: 9951,
            name: 'Gucci – Flora',
            brand: 'Gucci',
            category: 'women',
            price: 78000,
            popularity: 77,
            image: 'каталог/Gucci – Flora.jpg'
        },
        {
            id: 9964,
            name: 'Lanvin – Éclat d\'Arpège',
            brand: 'Lanvin',
            category: 'women',
            price: 42000,
            popularity: 76,
            image: 'каталог/Lanvin – Éclat d\'Arpège.jpg'
        },
        {
            id: 9974,
            name: 'Versace – Bright Crystal',
            brand: 'Versace',
            category: 'women',
            price: 72000,
            popularity: 75,
            image: 'каталог/Versace – Bright Crystal.jpg'
        },
        {
            id: 9950,
            name: 'Molecule 02',
            brand: 'Escentric Molecules',
            category: 'unisex',
            price: 52000,
            popularity: 74,
            image: 'каталог/Escentric Molecules – Molecule 02.jpg'
        },
        {
            id: 9978,
            name: 'YSL – Libre',
            brand: 'Yves Saint Laurent',
            category: 'women',
            price: 85000,
            popularity: 73,
            image: 'каталог/YSL – Libre.jpg'
        },
        {
            id: 9949,
            name: 'Xerjoff – Erba Pura',
            brand: 'Xerjoff',
            category: 'unisex',
            price: 112000,
            popularity: 72,
            image: 'каталог/Xerjoff – Erba Pura.png'
        },
        {
            id: 9948,
            name: 'Louis Vuitton – Imagination',
            brand: 'Louis Vuitton',
            category: 'men',
            price: 185000,
            popularity: 71,
            image: 'каталог/Louis Vuitton – Imagination.png'
        },
        {
            id: 9977,
            name: 'Tom Ford – Lost Cherry',
            brand: 'Tom Ford',
            category: 'women',
            price: 110000,
            popularity: 70,
            image: 'каталог/Tom Ford – Lost Cherry.jpeg'
        },
        {
            id: 9985,
            name: 'Kayali – Musk 12',
            brand: 'KAYALI',
            category: 'unisex',
            price: 55000,
            popularity: 69,
            image: 'каталог/Kayali – Musk 12.png'
        },
        {
            id: 9989,
            name: 'Maison Francis Kurkdjian – Baccarat Rouge 540',
            brand: 'Maison Francis Kurkdjian',
            category: 'unisex',
            price: 150000,
            popularity: 68,
            image: 'каталог/Maison Francis Kurkdjian – Baccarat Rouge 540.jpeg'
        },
        {
            id: 9966,
            name: 'Jimmy Choo – Blossom',
            brand: 'Jimmy Choo',
            category: 'women',
            price: 48000,
            popularity: 67,
            image: 'каталог/Jimmy Choo – Blossom.png'
        },
        {
            id: 9965,
            name: 'Kilian – Good Girl Gone Bad',
            brand: 'Kilian',
            category: 'women',
            price: 125000,
            popularity: 66,
            image: 'каталог/Kilian – Good Girl Gone Bad.jpg'
        },
        {
            id: 9995,
            name: 'Marc-Antoine Barrois – Ganymede',
            brand: 'Marc-Antoine Barrois',
            category: 'unisex',
            price: 95000,
            popularity: 65,
            image: 'каталог/Marc-Antoine Barrois – Ganymede.png'
        },
        {
            id: 9976,
            name: 'Dolce & Gabbana – L\'Imperatrice',
            brand: 'Dolce & Gabbana',
            category: 'women',
            price: 58000,
            popularity: 64,
            image: 'каталог/Dolce & Gabbana – L\'Imperatrice.png'
        },
        {
            id: 9983,
            name: 'Lattafa – Yara',
            brand: 'Lattafa',
            category: 'women',
            price: 20000,
            popularity: 63,
            image: 'каталог/Lattafa – Yara.png'
        },
        {
            id: 9957,
            name: 'Mexx – Fly High',
            brand: 'Mexx',
            category: 'women',
            price: 28000,
            popularity: 62,
            image: 'каталог/Mexx – Fly High.png'
        },
        {
            id: 9960,
            name: 'Lancôme – La Vie Est Belle',
            brand: 'Lancôme',
            category: 'women',
            price: 75000,
            popularity: 61,
            image: 'каталог/Lancôme – La Vie Est Belle.jpg'
        },
        {
            id: 9947,
            name: 'Lanvin – Jeanne',
            brand: 'Lanvin',
            category: 'women',
            price: 68000,
            popularity: 60,
            image: 'каталог/Lanvin – Jeanne.png'
        },
        {
            id: 9991,
            name: 'Lacoste – Pour Femme',
            brand: 'Lacoste',
            category: 'women',
            price: 40000,
            popularity: 59,
            image: 'каталог/Lacoste – Pour Femme.jpg'
        },
        {
            id: 9992,
            name: 'Attar Collection – Musk Kashmir',
            brand: 'Attar Collection',
            category: 'unisex',
            price: 30000,
            popularity: 58,
            image: 'каталог/Attar Collection – Musk Kashmir.jpg'
        },
        {
            id: 9955,
            name: 'Orto Parisi – Megamare',
            brand: 'Orto Parisi',
            category: 'unisex',
            price: 108000,
            popularity: 57,
            image: 'каталог/Orto Parisi – Megamare.png'
        },
        {
            id: 9982,
            name: 'Givenchy – Ange ou Démon',
            brand: 'Givenchy',
            category: 'women',
            price: 70000,
            popularity: 56,
            image: 'каталог/Givenchy – Ange ou Démon.jpg'
        },
        {
            id: 9958,
            name: 'Moschino – Funny',
            brand: 'Moschino',
            category: 'women',
            price: 55000,
            popularity: 55,
            image: 'каталог/Moschino – Funny.jpg'
        },
        {
            id: 9973,
            name: 'Chanel – Chance',
            brand: 'Chanel',
            category: 'women',
            price: 78000,
            popularity: 54,
            image: 'каталог/Chanel – Chance.png'
        },
        {
            id: 9956,
            name: 'Tom Ford – Bitter Peach',
            brand: 'Tom Ford',
            category: 'women',
            price: 115000,
            popularity: 53,
            image: 'каталог/Tom Ford – Bitter Peach.jpg'
        },
        {
            id: 9959,
            name: 'Tiziana Terenzi – Andromeda',
            brand: 'Tiziana Terenzi',
            category: 'women',
            price: 98000,
            popularity: 52,
            image: 'каталог/Tiziana Terenzi – Andromeda.png'
        },
        {
            id: 9998,
            name: 'Armani – My Way',
            brand: 'Armani',
            category: 'women',
            price: 65000,
            popularity: 51,
            image: 'каталог/Armani – My Way.jpg'
        },
        {
            id: 9981,
            name: 'Paco Rabanne – Invictus',
            brand: 'Paco Rabanne',
            category: 'men',
            price: 50000,
            popularity: 50,
            image: 'каталог/Paco Rabanne-Invictus.jpg'
        }
    ];
    
    // Инициализация массива товаров
    allItems = realProducts;
    console.log('Загружено товаров:', allItems.length);
    
    // Генерация брендов из каталога
    function renderBrands() {
        const brandsGrid = document.getElementById('brandsGrid');
        if (!brandsGrid) return;
        
        // Извлекаем уникальные бренды из каталога
        const uniqueBrands = [...new Set(allItems.map(item => item.brand))].sort();
        
        if (uniqueBrands.length === 0) {
            brandsGrid.innerHTML = '<p style="text-align:center;color:var(--ink-soft)">Бренды загружаются...</p>';
            return;
        }
        
        brandsGrid.innerHTML = uniqueBrands.map(brand => 
            `<div class="brand-item" data-brand="${brand}">${brand}</div>`
        ).join('');
        
        // Добавляем обработчики клика для фильтрации по бренду
        brandsGrid.querySelectorAll('.brand-item').forEach(item => {
            item.addEventListener('click', function() {
                const brand = this.getAttribute('data-brand');
                // Переходим к каталогу и фильтруем по бренду
                window.location.href = '#catalog';
                setTimeout(() => {
                    const searchInput = document.getElementById('catalogSearch');
                    if (searchInput) {
                        searchInput.value = brand;
                        searchInput.dispatchEvent(new Event('input'));
                    }
                }, 100);
            });
        });
    }
    
    // Вызываем после загрузки каталога
    renderBrands();

    const countEl = document.getElementById('catalogCount');
    const tabs = document.getElementById('catalogTabs');
    const searchInput = document.getElementById('catalogSearch');
    const sortSelect = document.getElementById('catalogSort');
    const showMoreBtn = document.getElementById('showMoreBtn');

    function formatPrice(kzt) {
        return `₸${kzt.toLocaleString('ru-RU')}`;
    }

    function applyFilters() {
        if (!allItems || allItems.length === 0) {
            console.error('allItems пуст!');
            if (countEl) countEl.textContent = '0 товаров';
            return;
        }
        
        filtered = allItems.filter(it => {
            const byCat = currentCategory === 'all' ? true : it.category === currentCategory;
            const bySearch = currentSearch ? (it.name.toLowerCase().includes(currentSearch) || it.brand.toLowerCase().includes(currentSearch)) : true;
            return byCat && bySearch;
        });

        switch (currentSort) {
            case 'popular_desc': filtered.sort((a,b)=>b.popularity-a.popularity); break;
            case 'popular_asc': filtered.sort((a,b)=>a.popularity-b.popularity); break;
            case 'name_asc': filtered.sort((a,b)=>a.name.localeCompare(b.name,'ru')); break;
            case 'name_desc': filtered.sort((a,b)=>b.name.localeCompare(a.name,'ru')); break;
            case 'price_desc': filtered.sort((a,b)=>b.price-a.price); break;
            case 'price_asc': filtered.sort((a,b)=>a.price-b.price); break;
        }

        page = 0;
        grid.innerHTML = '';
        updateCounter();
        renderNextPage();
    }

    function updateCounter() {
        if (countEl) countEl.textContent = `${filtered.length} товаров`;
    }

    function createCard(item) {
        const card = document.createElement('div');
        card.className = 'product-card';
        const wishlist = getWishlist();
        const isFavorite = wishlist.some(w => w.id === item.id);
        card.innerHTML = `
            <div class="product-image">
                <img loading="lazy" src="${item.image}" alt="${item.name}">
            </div>
            <div class="product-info">
                <h3>${item.name}</h3>
                <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:8px">
                    <span class="price">${formatPrice(item.price)}</span>
                    <button class="wishlist-btn ${isFavorite ? 'active' : ''}" data-product-id="${item.id}" title="Добавить в избранное">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <button class="btn btn-outline btn-small btn-add" style="width:100%;margin-top:8px" onclick="addToCart(${item.id}, '${item.name.replace(/'/g, "\\'")}', ${item.price}, '${item.image}')">В корзину</button>
            </div>
        `;
        return card;
    }

    function renderNextPage() {
        const start = page * PAGE_SIZE;
        const slice = filtered.slice(start, start + PAGE_SIZE);
        const frag = document.createDocumentFragment();
        slice.forEach(item => frag.appendChild(createCard(item)));
        grid.appendChild(frag);
        page++;
        if (showMoreBtn) showMoreBtn.style.display = (page * PAGE_SIZE < filtered.length) ? 'inline-block' : 'none';
    }

    // Events
    if (tabs) {
        tabs.addEventListener('click', (e)=>{
            const btn = e.target.closest('.tab');
            if (!btn) return;
            tabs.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-category');
            applyFilters();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e)=>{
            currentSearch = e.target.value.trim().toLowerCase();
            applyFilters();
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', (e)=>{
            currentSort = e.target.value;
            applyFilters();
        });
    }

    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', renderNextPage);
    }

    // Initial - инициализация каталога
    console.log('Инициализация каталога...');
    console.log('allItems длина:', allItems ? allItems.length : 'undefined');
    
    if (allItems && allItems.length > 0) {
    filtered = [...allItems];
        console.log('Применение фильтров, отфильтровано:', filtered.length);
    applyFilters();
    } else {
        console.error('Каталог пуст! allItems:', allItems);
        if (countEl) countEl.textContent = '0 товаров';
        if (grid) grid.innerHTML = '<p style="text-align:center;padding:40px;color:#999">Товары загружаются...</p>';
    }
});

// After redirect from standalone registration, open account modal
document.addEventListener('DOMContentLoaded', function(){
    if (localStorage.getItem('postRegisterRedirect')==='1'){
        localStorage.removeItem('postRegisterRedirect');
        const user = getCurrentUser();
        if (user){ openModal(document.getElementById('accountModal')); renderAccount(); }
    }
});

// ============ Reviews Import from 2GIS ============
document.addEventListener('DOMContentLoaded', function(){
    const importBtn = document.getElementById('importReviewsBtn');
    const modal = document.getElementById('reviewsImportModal');
    const submit = document.getElementById('reviewsImportSubmit');
    const input = document.getElementById('reviewsInput');
    const grid = document.getElementById('reviewsGrid');
    
    // Кнопка импорта и модалка опциональны — если есть, подключаем, если нет, просто показываем отзывы
    if (importBtn && modal) {
        importBtn.addEventListener('click', ()=> openModal(modal));
    }
    
    // Базовый набор отзывов из 2ГИС (источник: [Omori Perfume в 2ГИС](https://2gis.kz/reviews/70000001109831594/review/202513845))
    const initialReviews = [
        {
            name: 'Dana Baidak',
            rating: 5,
            text: 'Духи супер, запах стойкий, советую, продавец отличный 🔥👍',
            date: '2025-12-01'
        },
        {
            name: 'Sultan Ibrahim',
            rating: 5,
            text: 'Классный парфюм, продавец грамотно проконсультировал по имеющейся большой линейке ароматов, в итоге купил именно то, что хотел, спасибо!',
            date: '2025-11-27'
        },
        {
            name: 'Islam Tulegenov',
            rating: 5,
            text: 'Парфюм огонь, цена лучше, чем у конкурентов в Асыл Армане.',
            date: '2025-12-01'
        },
        {
            name: 'Ерасыл Пернебай',
            rating: 5,
            text: 'Valentino аромат стойкий, понравился, держится долго. Спасибо!',
            date: '2025-12-01'
        },
        {
            name: 'сумайа 🌟',
            rating: 5,
            text: 'Купила тут парфюм Gucci Flora, мне понравилась стойкость, я довольна покупкой 🫶🏻',
            date: '2025-11-30'
        },
        {
            name: 'Bakytzhan Djolxodzhaev',
            rating: 5,
            text: 'Керемет парфюмдар бар, ұнады жалпы, бауырымыздың берекесін берсін, күшті!',
            date: '2025-11-30'
        },
        {
            name: 'Гулзада Жумадилла',
            rating: 5,
            text: 'Барлығы жақсы, иістері ұнады. Дами беріңіздер 👍',
            date: '2025-11-30'
        },
        {
            name: 'ttt',
            rating: 5,
            text: 'Взяла тут парфюм L’Imperatrice — классный! Продавец красавчик 💕',
            date: '2025-11-30'
        },
        {
            name: '❤',
            rating: 5,
            text: 'Парфюм алдым, бәрі ұнады, сатушы жақсы ароматтар көрсетті, рақмет, келем тағы.',
            date: '2025-11-29'
        },
        {
            name: 'danil bogomazov',
            rating: 5,
            text: 'Всё отлично, ароматы стойкие, насыщенные, с приятным раскрытием. Помогли подобрать нужный парфюм, всё чётко, лучший в своём деле.',
            date: '2025-11-28'
        }
    ];

    function getReviews(){ 
        try{ 
            const stored = JSON.parse(localStorage.getItem('reviews'))||[]; 
            if (stored.length) return stored;
            // Если отзывов ещё нет — записываем базовый набор из 2ГИС
            localStorage.setItem('reviews', JSON.stringify(initialReviews));
            return initialReviews;
        }catch(e){ 
            return initialReviews; 
        } 
    }
    function saveReviews(list){ localStorage.setItem('reviews', JSON.stringify(list)); }
    
    function renderReviews(){
        if (!grid) return;
        const reviews = getReviews();
        if (!reviews.length) {
            grid.innerHTML = '<p style="text-align:center;padding:40px;color:var(--ink-soft)">Пока нет отзывов. Импортируйте отзывы из 2GIS.</p>';
            return;
        }
        
        grid.innerHTML = reviews.map((r) => {
            const rating = Math.min(5, Math.max(1, Number(r.rating) || 5));
            const stars = Array.from({length: 5}, (_, i) => 
                `<i class="fas fa-star ${i < rating ? '' : 'empty'}"></i>`
            ).join('');
            const name = r.name || 'Анонимный пользователь';
            const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'АП';
            const date = r.date ? new Date(r.date).toLocaleDateString('ru-RU', {year: 'numeric', month: 'long', day: 'numeric'}) : 'Недавно';
            const text = r.text || '';
            
            return `
                <div class="review-card">
                    <div class="review-header">
                        <div class="review-avatar">${initials}</div>
                        <div class="review-info">
                            <div class="review-name">${name}</div>
                            <div class="review-date">${date}</div>
                        </div>
                    </div>
                    <div class="review-rating">${stars}</div>
                    <div class="review-text">${text}</div>
                </div>
            `;
        }).join('');
    }
    
    submit?.addEventListener('click', function(){
        const text = input?.value.trim();
        if (!text) { alert('Введите отзывы'); return; }
        
        let reviews = getReviews();
        let parsed = [];
        
        // Try JSON first
        try {
            const json = JSON.parse(text);
            if (Array.isArray(json)) {
                parsed = json.map(r => ({
                    name: r.name || r.author || 'Анонимный пользователь',
                    rating: Number(r.rating) || 5,
                    text: r.text || r.comment || r.review || '',
                    date: r.date || new Date().toISOString().split('T')[0]
                }));
            }
        } catch(e) {
            // Try line-by-line format: Name; Rating; Text; Date
            const lines = text.split('\n').filter(l => l.trim());
            parsed = lines.map(line => {
                const parts = line.split(';').map(p => p.trim());
                return {
                    name: parts[0] || 'Анонимный пользователь',
                    rating: Number(parts[1]) || 5,
                    text: parts[2] || '',
                    date: parts[3] || new Date().toISOString().split('T')[0]
                };
            });
        }
        
        if (!parsed.length) { alert('Не удалось распарсить отзывы'); return; }
        
        reviews = [...reviews, ...parsed];
        saveReviews(reviews);
        renderReviews();
        closeModal(modal);
        input.value = '';
        alert(`Импортировано ${parsed.length} отзывов`);
    });
    
    renderReviews();

    // ===== Автоматическая синхронизация с сервером (обёртка над 2GIS) =====
    // ОЖИДАЕТСЯ, что у вас есть серверный скрипт,
    // который по адресу /api/2gis-reviews возвращает JSON-массив отзывов:
    // [{ name, rating, text, date }, ...]
    async function syncReviewsFromServer() {
        try {
            const resp = await fetch('/api/2gis-reviews', { cache: 'no-store' });
            if (!resp.ok) return; // тихо выходим, чтобы не мешать пользователю
            const serverReviews = await resp.json();
            if (!Array.isArray(serverReviews) || !serverReviews.length) return;

            const current = getReviews();
            const seen = new Set(
                current.map(r => `${(r.name||'').trim()}|${(r.text||'').trim()}|${r.date||''}`)
            );

            const normalized = serverReviews.map(r => ({
                name: r.name || r.author || 'Анонимный пользователь',
                rating: Number(r.rating) || 5,
                text: r.text || r.comment || r.review || '',
                date: r.date || new Date().toISOString().split('T')[0]
            }));

            const fresh = normalized.filter(r => {
                const key = `${(r.name||'').trim()}|${(r.text||'').trim()}|${r.date||''}`;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });

            if (!fresh.length) return;

            const merged = [...current, ...fresh];
            saveReviews(merged);
            renderReviews();
        } catch (e) {
            // в проде можно отправить лог на сервер, здесь просто молча игнорируем
            console.warn('Не удалось синхронизировать отзывы с сервера', e);
        }
    }

    // Делаем функцию доступной глобально (если нужно дергать вручную из консоли)
    window.syncReviewsFromServer = syncReviewsFromServer;

    // Однократная синхронизация при загрузке страницы
    syncReviewsFromServer();

    // Периодическая синхронизация (каждые 10 минут)
    setInterval(syncReviewsFromServer, 10 * 60 * 1000);
});

// ============ Decant Import (custom items) ============
document.addEventListener('DOMContentLoaded', function(){
    const btn = document.getElementById('importDecantsBtn');
    const modal = document.getElementById('decantModal');
    const submit = document.getElementById('decantImportSubmit');
    const input = document.getElementById('decantInput');
    if (!btn || !modal) return;

    btn.addEventListener('click', ()=> openModal(modal));
    // Fallback for inline onclick
    window.openDecantModal = function(){ openModal(modal); };

    function saveDecants(list){ localStorage.setItem('decantItems', JSON.stringify(list)); }
    function readDecants(){ try{ return JSON.parse(localStorage.getItem('decantItems'))||[] }catch(e){ return []; } }

    function injectDecantsToCatalog(){
        const grid = document.getElementById('catalogGrid');
        if (!grid) return;
        const decants = readDecants();
        if (!decants.length) return;
        const frag = document.createDocumentFragment();
        decants.forEach((d)=>{
            const price = Number(d.price)||0;
            const card = document.createElement('div');
            card.className = 'product-card';
            const wishlist = getWishlist();
            const id = hashCode(d.name + 'decant');
            const isFavorite = wishlist.some(w => w.id === id);
            card.innerHTML = `
                <div class="product-image">
                    <img loading="lazy" src="https://picsum.photos/seed/decant-${encodeURIComponent(d.name)}/400/500" alt="${d.name}">
                </div>
                <div class="product-info">
                    <h3>${d.name}</h3>
                    <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:8px">
                        <span class="price">₸${price.toLocaleString('ru-RU')}</span>
                        <button class="wishlist-btn ${isFavorite ? 'active' : ''}" data-product-id="${id}" title="Добавить в избранное">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                    <button class="btn btn-outline btn-add" style="width:100%;margin-top:8px">В корзину</button>
                </div>
            `;
            // Add wishlist handler
            const wishlistBtn = card.querySelector('.wishlist-btn');
            if (wishlistBtn) {
                wishlistBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const img = card.querySelector('img')?.src || '';
                    toggleWishlist(id, d.name, img);
                    wishlistBtn.classList.toggle('active');
                    updateWishlistBadge();
                });
            }
            frag.appendChild(card);
        });
        grid.prepend(frag);
    }

    submit?.addEventListener('click', function(){
        const text = (input?.value||'').trim();
        if (!text) { alert('Вставьте строки с данными.'); return; }
        const rows = text.split(/\n+/).map(r=>r.trim()).filter(Boolean);
        const items = rows.map(r=>{
            const [name, price] = r.split(/;|,|\t/);
            return { name: (name||'').trim(), price: (price||'0').replace(/[^0-9]/g,'') };
        }).filter(it=>it.name);
        if (!items.length){ alert('Не удалось распознать данные'); return; }
        const existing = readDecants();
        const merged = existing.concat(items);
        saveDecants(merged);
        closeModal(modal);
        injectDecantsToCatalog();
        alert('Импортировано: '+items.length);
    });

    // Auto inject on load
    injectDecantsToCatalog();
});

// Open auth modal from hash deep links (#login / #register)
document.addEventListener('DOMContentLoaded', function(){
    const hash = (location.hash||'').toLowerCase();
    if (hash === '#login' || hash === '#register'){
        const authModal = document.getElementById('authModal');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        if (loginForm && registerForm){
            if (hash === '#login'){
                loginForm.hidden = false; registerForm.hidden = true;
                const t = document.getElementById('authTitle'); if (t) t.textContent = 'Войти';
            } else {
                loginForm.hidden = true; registerForm.hidden = false;
                const t = document.getElementById('authTitle'); if (t) t.textContent = 'Регистрация';
            }
            openModal(authModal);
        }
    }
});

// ============ Payment Import System ============
document.addEventListener('DOMContentLoaded', function(){
    const importModal = document.getElementById('paymentImportModal');
    if (!importModal) return;
    
    // Переключение вкладок
    const tabs = importModal.querySelectorAll('.payment-import-tab');
    const tabContents = importModal.querySelectorAll('.import-tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function(){
            const targetTab = this.getAttribute('data-tab');
            
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            tabContents.forEach(content => {
                const contentId = content.id.replace('import-tab-', '');
                if (contentId === targetTab) {
                    content.style.display = 'block';
                } else {
                    content.style.display = 'none';
                }
            });
        });
    });
    
    // Ручной импорт
    const importSubmit = document.getElementById('paymentImportSubmit');
    const importInput = document.getElementById('paymentImportInput');
    const importResults = document.getElementById('paymentImportResults');
    
    if (importSubmit && importInput) {
        importSubmit.addEventListener('click', function(){
            const data = importInput.value.trim();
            if (!data) {
                alert('Введите данные для импорта');
                return;
            }
            
            if (!kaspiPayment) {
                alert('Модуль Kaspi Payment не загружен');
                return;
            }
            
            try {
                const imported = kaspiPayment.importPayments(data);
                
                if (imported.length === 0) {
                    alert('Не удалось импортировать платежи. Проверьте формат данных.');
                    return;
                }
                
                importResults.style.display = 'block';
                importResults.innerHTML = `
                    <h4>Импортировано платежей: ${imported.length}</h4>
                    ${imported.slice(0, 10).map(p => `
                        <div class="payment-import-item">
                            <div class="payment-import-item-info">
                                <div>Заказ #${p.orderId}</div>
                                <div style="font-size:12px;color:var(--ink-soft)">${new Date(p.createdAt).toLocaleDateString('ru-RU')}</div>
                            </div>
                            <div class="payment-import-item-amount">${formatKZT(p.amount)}</div>
                        </div>
                    `).join('')}
                    ${imported.length > 10 ? `<p style="margin-top:12px;font-size:12px;color:var(--ink-soft)">... и еще ${imported.length - 10} платежей</p>` : ''}
                `;
                
                importInput.value = '';
                alert(`Успешно импортировано ${imported.length} платежей`);
            } catch (error) {
                alert('Ошибка импорта: ' + error.message);
            }
        });
    }
    
    // Импорт через API
    const importApiSubmit = document.getElementById('paymentImportApiSubmit');
    const importApiResults = document.getElementById('paymentImportApiResults');
    
    if (importApiSubmit) {
        importApiSubmit.addEventListener('click', async function(){
            if (!kaspiPayment || kaspiPayment.isDemo || !kaspiPayment.apiKey) {
                alert('Для импорта через API необходимо настроить подключение к Kaspi API в разделе "Настройки"');
                return;
            }
            
            const dateFrom = document.getElementById('paymentImportDateFrom').value;
            const dateTo = document.getElementById('paymentImportDateTo').value;
            
            if (!dateFrom || !dateTo) {
                alert('Укажите период для импорта');
                return;
            }
            
            try {
                importApiSubmit.disabled = true;
                importApiSubmit.textContent = 'Загрузка...';
                
                // В реальной интеграции здесь будет запрос к Kaspi API
                // Для демо показываем сообщение
                alert('Импорт через API требует настройки серверной части. Используйте ручной импорт или настройте webhook.');
                
                importApiSubmit.disabled = false;
                importApiSubmit.textContent = 'Загрузить через API';
            } catch (error) {
                alert('Ошибка импорта через API: ' + error.message);
                importApiSubmit.disabled = false;
                importApiSubmit.textContent = 'Загрузить через API';
            }
        });
    }
    
    // Сохранение настроек
    const configSave = document.getElementById('kaspiConfigSave');
    
    if (configSave) {
        configSave.addEventListener('click', function(){
            const apiKey = document.getElementById('kaspiApiKey').value.trim();
            const merchantId = document.getElementById('kaspiMerchantId').value.trim();
            const secretKey = document.getElementById('kaspiSecretKey').value.trim();
            const demoMode = document.getElementById('kaspiDemoMode').checked;
            
            if (!demoMode && (!apiKey || !merchantId || !secretKey)) {
                alert('Для реального режима необходимо указать все параметры');
                return;
            }
            
            if (kaspiPayment) {
                kaspiPayment.setConfig({
                    apiKey: apiKey,
                    merchantId: merchantId,
                    secretKey: secretKey,
                    isDemo: demoMode
                });
                
                alert('Настройки сохранены!');
            } else {
                alert('Модуль Kaspi Payment не загружен');
            }
        });
    }
    
    // Загрузка сохраненных настроек при открытии модалки
    const configTab = importModal.querySelector('[data-tab="config"]');
    if (configTab) {
        configTab.addEventListener('click', function(){
            if (kaspiPayment) {
                document.getElementById('kaspiApiKey').value = kaspiPayment.apiKey || '';
                document.getElementById('kaspiMerchantId').value = kaspiPayment.merchantId || '';
                document.getElementById('kaspiSecretKey').value = kaspiPayment.secretKey || '';
                document.getElementById('kaspiDemoMode').checked = kaspiPayment.isDemo !== false;
            }
        });
    }
    
    // Глобальная функция для открытия модалки импорта (можно вызвать из консоли)
    window.openPaymentImport = function() {
        openModal(importModal);
    };
});

