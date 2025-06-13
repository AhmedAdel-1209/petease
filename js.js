async function fetchProducts() {
    try {

        const response = await fetch('https://fakestoreapi.com/products?limit=4');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        return products;
    } catch (error) {
        console.error("Could not fetch products:", error);
        return [];
    }
}


async function loadProducts() {
    const container = document.querySelector(".product-gallery");
    if (!container) return;

    container.innerHTML = "<h2>Loading Products...</h2>";

    const products = await fetchProducts();

    container.innerHTML = "";
    if (products.length === 0) {
        container.innerHTML = "<h2>Could not load products. Please try again later.</h2>";
        return;
    }

    products.forEach(p => {
        const card = document.createElement("div");
        card.className = "product-item";
        card.innerHTML = `
            <a href="product-details.html?id=${p.id}">
                <img src="${p.image}" alt="${p.title}">
            </a>
            <h3>${p.title}</h3>
            <p>$${p.price.toFixed(2)}</p>
            <button class="btn-add-to-cart" data-product-id="${p.id}">Add to Cart</button>
        `;
        container.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    const performSearch = () => {
        const query = searchInput.value.toLowerCase().trim();
        const productItems = document.querySelectorAll('.product-gallery .product-item');

        productItems.forEach(item => {
            const productName = item.querySelector('h3').textContent.toLowerCase();
            if (productName.includes(query)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    };


    searchButton.addEventListener('click', performSearch);

    searchInput.addEventListener('keyup', performSearch);
});



let cartItemCount = 0;
const cartCounter = document.getElementById('cart-counter');


function addToCart(event) {

    if (event.target.classList.contains('btn-add-to-cart')) {
        cartItemCount++;
        cartCounter.textContent = cartItemCount;


        const button = event.target;
        button.textContent = 'Added!';
        button.style.backgroundColor = '#62c462';
        setTimeout(() => {
            button.textContent = 'Add to Cart';
            button.style.backgroundColor = '';
        }, 1500);
    }
}


document.querySelector('body').addEventListener('click', addToCart);


document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();


            const firstName = contactForm.querySelector('input[placeholder="First Name"]').value;
            console.log(`Form submitted by ${firstName}`);

            const formContainer = document.querySelector('.contact-form');
            formContainer.innerHTML = '<h3>Thank you!</h3><p>Your message has been received. We will get back to you soon.</p>';
        });
    }
});


document.addEventListener('DOMContentLoaded', () => {

    // --- التنقل السلس بين أقسام الصفحة ---
    const navLinks = document.querySelectorAll('.nav-menu a[href^="index.html#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(this.getAttribute('href').indexOf('#'));
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 70, // إزاحة لتناسب الهيدر الثابت
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- وظيفة البحث (تعمل في صفحة الأطباء والصفحة الرئيسية) ---
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');

    if (searchButton && searchInput) {
        searchButton.addEventListener('click', () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            if (!searchTerm) return;

            // منطق البحث في صفحة الأطباء
            const doctorCards = document.querySelectorAll('.doctor-card');
            if (doctorCards.length > 0) {
                doctorCards.forEach(card => {
                    const doctorName = card.querySelector('h2').textContent.toLowerCase();
                    const doctorSpecialty = card.querySelector('p').textContent.toLowerCase();
                    if (doctorName.includes(searchTerm) || doctorSpecialty.includes(searchTerm)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            } else {
                // إذا لم نكن في صفحة الأطباء، يمكننا إعادة التوجيه إلى صفحة المنتجات مع مصطلح البحث
                window.location.href = `products.html?search=${encodeURIComponent(searchTerm)}`;
            }
        });
    }

    // --- إدارة عربة التسوق ---

    // إضافة منتجات إلى عربة التسوق من صفحة المنتجات
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productItem = e.target.closest('.product-item');
            const productName = productItem.querySelector('h3').textContent;
            const productPrice = productItem.querySelector('.price').textContent;

            // هنا يمكنك إضافة منطق أكثر تفصيلاً لتخزين المنتجات (مثل استخدام localStorage)
            alert(`${productName} أضيف إلى عربة التسوق!`);

            // مثال على كيفية إضافة المنتج إلى جدول عربة التسوق ديناميكيًا
            // ملاحظة: هذا يتطلب أن تكون في صفحة عربة التسوق أو استخدام التخزين المحلي
        });
    });

    // إزالة منتجات من عربة التسوق في صفحة العربة
    const removeCartItemButtons = document.querySelectorAll('.btn-remove');
    removeCartItemButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.target.closest('tr').remove();
            // يجب تحديث الإجمالي الفرعي والإجمالي الكلي بعد الحذف
            updateCartTotal();
        });
    });

    // تحديث إجمالي عربة التسوق عند تغيير الكمية
    const quantityInputs = document.querySelectorAll('.cart-table input[type="number"]');
    quantityInputs.forEach(input => {
        input.addEventListener('change', () => {
            updateCartTotal();
        });
    });

    function updateCartTotal() {
        const cartTable = document.querySelector('.cart-table');
        if (!cartTable) return;

        let subtotal = 0;
        const rows = cartTable.querySelectorAll('tbody tr');

        rows.forEach(row => {
            const price = parseFloat(row.cells[1].textContent.replace('$', ''));
            const quantity = parseInt(row.querySelector('input').value);
            const total = price * quantity;
            row.cells[3].textContent = `$${total.toFixed(2)}`;
            subtotal += total;
        });

        const shipping = 5.00; // قيمة الشحن ثابتة كمثال
        const total = subtotal + shipping;

        // تحديث خلايا التذييل
        const tfoot = cartTable.querySelector('tfoot');
        if (tfoot) {
            tfoot.rows[0].cells[1].textContent = `$${subtotal.toFixed(2)}`;
            tfoot.rows[2].cells[1].textContent = `$${total.toFixed(2)}`;
        }
    }


    // --- التحقق من صحة النماذج ---

    // نموذج تسجيل الدخول
    const loginForm = document.querySelector('form-card.auth-card form');
    if (loginForm && document.querySelector('.auth-tabs a.active').textContent === 'Login') {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // أضف منطق التحقق هنا
            alert('تم تسجيل الدخول بنجاح!');
        });
    }

    // نموذج إنشاء حساب
    const signupForm = document.querySelector('.form-card.auth-card form');
    if (signupForm && document.querySelector('.auth-tabs a.active').textContent === 'Sign up') {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                alert('كلمة المرور غير متطابقة!');
                return;
            }
            alert('تم إنشاء الحساب بنجاح!');
        });
    }

    // نموذج الدفع
    const paymentForm = document.querySelector('.payment-card form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // أضف منطق التحقق من صحة البطاقة هنا
            alert('تم الدفع بنجاح!');
        });
    }

    // نموذج الاتصال
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // أضف منطق التحقق هنا
            alert('شكراً لتواصلك معنا!');
            contactForm.reset();
        });
    }

});