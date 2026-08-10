const slides = document.querySelectorAll(".slide");
const dotsWrap = document.getElementById("dots");
let currentSlide = 0;

slides.forEach((_, i) => {
  const dot = document.createElement("button");
  dot.className = "dot" + (i === 0 ? " active" : "");
  dot.setAttribute("aria-label", `Slide ${i + 1}`);
  dot.addEventListener("click", () => showSlide(i));
  dotsWrap.appendChild(dot);
});

function showSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((s, i) => s.classList.toggle("active", i === currentSlide));
  document.querySelectorAll(".dot").forEach((d, i) => d.classList.toggle("active", i === currentSlide));
}
document.getElementById("nextSlide").addEventListener("click", () => showSlide(currentSlide + 1));
document.getElementById("prevSlide").addEventListener("click", () => showSlide(currentSlide - 1));
setInterval(() => showSlide(currentSlide + 1), 5000);

const navLinks = document.getElementById("navLinks");
document.getElementById("menuToggle").addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));

const searchPanel = document.getElementById("searchPanel");
document.getElementById("searchBtn").addEventListener("click", () => {
  searchPanel.classList.add("show");
  document.getElementById("searchInput").focus();
});
document.getElementById("closeSearch").addEventListener("click", () => searchPanel.classList.remove("show"));

document.getElementById("searchInput").addEventListener("input", e => {
  const q = e.target.value.toLowerCase().trim();
  const cards = document.querySelectorAll(".product-card");
  let visible = 0;
  cards.forEach(card => {
    const match = card.dataset.name.toLowerCase().includes(q);
    card.style.display = match ? "" : "none";
    if (match) visible++;
  });
  document.getElementById("emptyState").style.display = visible ? "none" : "block";
});

const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const cartItemsEl = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const cartTotalEl = document.getElementById("cartTotal");
let cart = [];

function openCart() {
  cartDrawer.classList.add("open");
  overlay.classList.add("show");
}
function closeCart() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("show");
}
document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

document.querySelectorAll(".add-cart").forEach(btn => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.product;
    const price = Number(btn.dataset.price);
    const found = cart.find(item => item.name === name);
    if (found) found.qty++;
    else cart.push({name, price, qty: 1});
    renderCart();
    openCart();
  });
});

function formatIDR(n) {
  return "Rp" + n.toLocaleString("id-ID");
}

function renderCart() {
  cartItemsEl.innerHTML = "";
  let total = 0, count = 0;
  if (!cart.length) {
    cartItemsEl.innerHTML = '<p style="color:#667085;text-align:center;padding:50px 10px">Keranjang masih kosong 🍦</p>';
  }
  cart.forEach((item, index) => {
    total += item.price * item.qty;
    count += item.qty;
    const row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML = `
      <div><h4>${item.name}</h4><small>${formatIDR(item.price)}</small></div>
      <div class="qty">
        <button onclick="changeQty(${index},-1)">−</button>
        <b>${item.qty}</b>
        <button onclick="changeQty(${index},1)">+</button>
      </div>`;
    cartItemsEl.appendChild(row);
  });
  cartCountEl.textContent = count;
  cartTotalEl.textContent = formatIDR(total);
}
window.changeQty = (index, amount) => {
  cart[index].qty += amount;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  renderCart();
};

const waNumber = "6285691428657";
function buildWhatsAppMessage() {
  if (!cart.length) return "Halo kak aku mau pesan ice cream. Bisa info menu yang tersedia?";
  const lines = cart.map(item => `- ${item.name} ${item.qty} pack`);
  return `Halo kak aku mau pesan ice cream:\n${lines.join("\n")}\n\nTotal: ${formatIDR(cart.reduce((sum, i) => sum + i.price * i.qty, 0))}`;
}
document.getElementById("checkoutBtn").addEventListener("click", () => {
  window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(buildWhatsAppMessage())}`, "_blank");
});

document.getElementById("waButton").href =
  `https://wa.me/${waNumber}?text=${encodeURIComponent("Halo kak aku mau pesan roti .... 5 pack ya;")}`;
document.getElementById("waButton").target = "_blank";
document.getElementById("waButton").rel = "noopener";

const translations = {
  id: {
    navHome:"Home", navAbout:"About", navMenu:"Menu", navPromo:"Promo", navContact:"Contact",
    eyebrow:"SWEET • COLD • HAPPY", heroTitle:"Satu scoop,<br><span>sejuta rasa.</span>",
    heroText:"Ice cream creamy dan fresh untuk menemani hari-harimu. Pilih rasa favoritmu dan nikmati sekarang.",
    heroButton:"Lihat Menu", promoButton:"Lihat Promo", aboutEyebrow:"ABOUT NDYSICE",
    aboutTitle:"Dibuat untuk momen<br><span>yang lebih manis.</span>",
    aboutText:"ndysice hadir dengan konsep ice cream yang playful, clean, dan modern. Kami menghadirkan pilihan rasa yang creamy, fresh, dan cocok dinikmati kapan saja.",
    menuEyebrow:"OUR FAVORITES", menuTitle:"Pilih rasa favoritmu", promoTitle:"Buy 2, Get <span>1</span>",
    promoText:"Beli dua cup ice cream pilihanmu dan dapatkan satu cup tambahan. Berlaku selama persediaan masih ada.",
    promoShop:"Pesan Sekarang", feature1Title:"Fresh Every Day", feature1Text:"Dibuat dengan rasa yang creamy dan fresh.",
    feature2Title:"Happy Taste", feature2Text:"Rasa fun untuk bikin hari lebih happy.",
    feature3Title:"Easy Order", feature3Text:"Pesan cepat melalui WhatsApp.", contactTitle:"Punya pertanyaan<br>tentang menu?",
    contactButton:"Chat WhatsApp", cartTitle:"Keranjang", checkout:"Checkout via WhatsApp"
  },
  en: {
    navHome:"Home", navAbout:"About", navMenu:"Menu", navPromo:"Promo", navContact:"Contact",
    eyebrow:"SWEET • COLD • HAPPY", heroTitle:"One scoop,<br><span>a million smiles.</span>",
    heroText:"Creamy, fresh ice cream to brighten your day. Pick your favorite flavor and enjoy it now.",
    heroButton:"View Menu", promoButton:"View Promo", aboutEyebrow:"ABOUT NDYSICE",
    aboutTitle:"Made for moments<br><span>that taste sweeter.</span>",
    aboutText:"ndysice brings a playful, clean, and modern ice cream concept with creamy and fresh flavors made for every moment.",
    menuEyebrow:"OUR FAVORITES", menuTitle:"Pick your favorite flavor", promoTitle:"Buy 2, Get <span>1</span>",
    promoText:"Buy two selected ice creams and get one extra cup. Available while stocks last.",
    promoShop:"Order Now", feature1Title:"Fresh Every Day", feature1Text:"Creamy and fresh flavors made for you.",
    feature2Title:"Happy Taste", feature2Text:"Fun flavors to make your day happier.",
    feature3Title:"Easy Order", feature3Text:"Order quickly through WhatsApp.", contactTitle:"Questions about<br>our menu?",
    contactButton:"Chat on WhatsApp", cartTitle:"Your Cart", checkout:"Checkout via WhatsApp"
  }
};

document.getElementById("languageSelect").addEventListener("change", e => {
  const lang = e.target.value;
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-id]").forEach(el => {
    const key = el.dataset.id;
    if (translations[lang][key]) el.innerHTML = translations[lang][key];
  });
});
renderCart();
