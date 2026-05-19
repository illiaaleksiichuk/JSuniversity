/* ================================================================
   STOCKFLOW — OOP Inventory Management System
   Архітектура: ES6 Classes, Inheritance, Encapsulation, Polymorphism
   Зберігання: LocalStorage
   ================================================================ */

// ─────────────────────────────────────────────
// БАЗОВИЙ КЛАС: Product (інкапсуляція через #)
// ─────────────────────────────────────────────
class Product {
  // Приватні поля (інкапсуляція)
  #id;
  #name;
  #category;
  #price;
  #quantity;

  constructor(id, name, category, price, quantity) {
    this.#id       = id;
    this.#name     = name;
    this.#category = category;
    this.#price    = parseFloat(price);
    this.#quantity = parseInt(quantity);
  }

  // ── Гетери ──
  get id()       { return this.#id; }
  get name()     { return this.#name; }
  get category() { return this.#category; }
  get price()    { return this.#price; }
  get quantity() { return this.#quantity; }

  // ── Сетери з валідацією ──
  set name(v)     { if (v?.trim()) this.#name = v.trim(); }
  set price(v)    { if (!isNaN(v) && v >= 0) this.#price = parseFloat(v); }
  set quantity(v) { if (!isNaN(v) && v >= 0) this.#quantity = parseInt(v); }
  set category(v) { this.#category = v; }

  // Поліморфний метод — базова реалізація
  getDescription() {
    return `${this.#name} (${this.#category})`;
  }

  // Загальна вартість позиції
  getTotalValue() {
    return this.#price * this.#quantity;
  }

  // Серіалізація для LocalStorage
  toJSON() {
    return {
      type:     'product',
      id:       this.#id,
      name:     this.#name,
      category: this.#category,
      price:    this.#price,
      quantity: this.#quantity,
    };
  }
}

// ─────────────────────────────────────────────
// КЛАС FoodProduct — наслідування від Product
// ─────────────────────────────────────────────
class FoodProduct extends Product {
  #expiryDate;

  constructor(id, name, price, quantity, expiryDate = '') {
    super(id, name, 'food', price, quantity);
    this.#expiryDate = expiryDate;
  }

  get expiryDate() { return this.#expiryDate; }
  set expiryDate(v) { this.#expiryDate = v; }

  // Поліморфізм: переоприлюднення методу
  getDescription() {
    const exp = this.#expiryDate ? ` | до ${this.#expiryDate}` : '';
    return `🍎 ${this.name}${exp}`;
  }

  toJSON() {
    return { ...super.toJSON(), type: 'food', expiryDate: this.#expiryDate };
  }
}

// ─────────────────────────────────────────────
// КЛАС TechProduct — наслідування від Product
// ─────────────────────────────────────────────
class TechProduct extends Product {
  #warrantyMonths;

  constructor(id, name, price, quantity, warrantyMonths = 0) {
    super(id, name, 'tech', price, quantity);
    this.#warrantyMonths = parseInt(warrantyMonths) || 0;
  }

  get warrantyMonths() { return this.#warrantyMonths; }
  set warrantyMonths(v) { if (!isNaN(v) && v >= 0) this.#warrantyMonths = parseInt(v); }

  // Поліморфізм
  getDescription() {
    const w = this.#warrantyMonths ? ` | гарантія ${this.#warrantyMonths} міс.` : '';
    return `💻 ${this.name}${w}`;
  }

  toJSON() {
    return { ...super.toJSON(), type: 'tech', warrantyMonths: this.#warrantyMonths };
  }
}

// ─────────────────────────────────────────────
// КЛАС Inventory — управління товарами
// ─────────────────────────────────────────────
class Inventory {
  #items = [];
  #storageKey = 'stockflow_inventory';

  constructor() {
    this.#load();
  }

  // ── Завантаження з LocalStorage ──
  #load() {
    try {
      const raw = localStorage.getItem(this.#storageKey);
      if (!raw) return;
      const arr = JSON.parse(raw);
      this.#items = arr.map(d => Inventory.#deserialize(d));
    } catch(e) {
      console.error('Помилка завантаження:', e);
      this.#items = [];
    }
  }

  // ── Збереження у LocalStorage ──
  #save() {
    localStorage.setItem(this.#storageKey, JSON.stringify(this.#items.map(p => p.toJSON())));
  }

  // ── Відновлення об'єктів зі збереженого JSON ──
  static #deserialize(d) {
    if (d.type === 'food') return new FoodProduct(d.id, d.name, d.price, d.quantity, d.expiryDate);
    if (d.type === 'tech') return new TechProduct(d.id, d.name, d.price, d.quantity, d.warrantyMonths);
    return new Product(d.id, d.name, d.category, d.price, d.quantity);
  }

  // ── Генерація унікального ID ──
  #genId() {
    return 'P' + Date.now().toString(36).toUpperCase().slice(-5);
  }

  // ── Додати товар ──
  addProduct({ name, category, price, quantity, expiryDate, warrantyMonths }) {
    if (!name?.trim()) throw new Error('Назва обовʼязкова');
    if (isNaN(price) || price < 0) throw new Error('Невірна ціна');
    if (isNaN(quantity) || quantity < 0) throw new Error('Невірна кількість');

    const id = this.#genId();
    let product;

    if (category === 'food') {
      product = new FoodProduct(id, name.trim(), price, quantity, expiryDate || '');
    } else if (category === 'tech') {
      product = new TechProduct(id, name.trim(), price, quantity, warrantyMonths || 0);
    } else {
      product = new Product(id, name.trim(), 'other', price, quantity);
    }

    this.#items.push(product);
    this.#save();
    return product;
  }

  // ── Оновити товар ──
  updateProduct(id, data) {
    const item = this.getById(id);
    if (!item) throw new Error('Товар не знайдено');

    item.name     = data.name;
    item.price    = data.price;
    item.quantity = data.quantity;
    item.category = data.category;

    if (item instanceof FoodProduct && data.expiryDate !== undefined) {
      item.expiryDate = data.expiryDate;
    }
    if (item instanceof TechProduct && data.warrantyMonths !== undefined) {
      item.warrantyMonths = data.warrantyMonths;
    }

    this.#save();
    return item;
  }

  // ── Видалити товар ──
  deleteProduct(id) {
    const idx = this.#items.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Товар не знайдено');
    const [removed] = this.#items.splice(idx, 1);
    this.#save();
    return removed;
  }

  // ── Отримати за ID ──
  getById(id) {
    return this.#items.find(p => p.id === id) || null;
  }

  // ── Пошук ──
  search(query) {
    const q = query.toLowerCase().trim();
    if (!q) return this.#items;
    return this.#items.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  // ── Фільтрація ──
  filter({ category = '', sortPrice = '' } = {}) {
    let list = [...this.#items];
    if (category) list = list.filter(p => p.category === category);
    if (sortPrice === 'asc')  list.sort((a, b) => a.price - b.price);
    if (sortPrice === 'desc') list.sort((a, b) => b.price - a.price);
    return list;
  }

  // ── Загальна вартість складу ──
  getTotalInventoryValue() {
    return this.#items.reduce((sum, p) => sum + p.getTotalValue(), 0);
  }

  // ── Кількість унікальних категорій ──
  getCategoryCount() {
    return new Set(this.#items.map(p => p.category)).size;
  }

  // ── Товари з малою кількістю ──
  getLowStockCount(threshold = 5) {
    return this.#items.filter(p => p.quantity < threshold).length;
  }

  get count() { return this.#items.length; }
}

// ─────────────────────────────────────────────
// ІНІЦІАЛІЗАЦІЯ
// ─────────────────────────────────────────────
const inventory = new Inventory();
let editingId = null; // null = новий товар, інакше — ID для редагування

// ─────────────────────────────────────────────
// РЕНДЕР ТАБЛИЦІ
// ─────────────────────────────────────────────
function renderTable() {
  const query   = document.getElementById('search').value;
  const cat     = document.getElementById('filter-cat').value;
  const sort    = document.getElementById('sort-price').value;

  // Спочатку пошук, потім фільтр+сортування
  let results = inventory.search(query);

  if (cat) results = results.filter(p => p.category === cat);
  if (sort === 'asc')  results.sort((a, b) => a.price - b.price);
  if (sort === 'desc') results.sort((a, b) => b.price - a.price);

  const tbody = document.getElementById('table-body');

  if (results.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7">
          <div class="empty-state">
            <div class="icon">🗃️</div>
            <p>Товарів не знайдено</p>
            <small>Спробуйте змінити фільтр або додайте новий товар</small>
          </div>
        </td>
      </tr>`;
    updateStats();
    return;
  }

  tbody.innerHTML = results.map(p => {
    const catLabel = { food: '🍎 Продукти', tech: '💻 Техніка', other: '📦 Інше' }[p.category] || p.category;
    const catClass = { food: 'cat-food', tech: 'cat-tech', other: 'cat-other' }[p.category] || 'cat-other';
    const qtyClass = p.quantity < 5 ? 'qty-low' : 'qty-cell';
    const total    = p.getTotalValue().toLocaleString('uk-UA', { minimumFractionDigits: 2 });
    const price    = p.price.toLocaleString('uk-UA', { minimumFractionDigits: 2 });

    return `
      <tr>
        <td><span class="id-badge">${p.id}</span></td>
        <td title="${p.getDescription()}">${p.name}</td>
        <td><span class="category-badge ${catClass}">${catLabel}</span></td>
        <td class="price-cell">₴${price}</td>
        <td class="${qtyClass}">${p.quantity}${p.quantity < 5 ? ' ⚠️' : ''}</td>
        <td class="total-cell">₴${total}</td>
        <td>
          <div class="actions-cell">
            <button class="btn btn-edit btn-icon" onclick="openEdit('${p.id}')" title="Редагувати">
              ✏️
            </button>
            <button class="btn btn-danger btn-icon" onclick="deleteProduct('${p.id}')" title="Видалити">
              🗑️
            </button>
          </div>
        </td>
      </tr>`;
  }).join('');

  updateStats();
}

// ─────────────────────────────────────────────
// ОНОВЛЕННЯ СТАТИСТИКИ
// ─────────────────────────────────────────────
function updateStats() {
  const total = inventory.getTotalInventoryValue();
  const fmt   = v => v.toLocaleString('uk-UA', { minimumFractionDigits: 2 });

  document.getElementById('stat-count').textContent  = inventory.count;
  document.getElementById('stat-total').textContent  = '₴' + fmt(total);
  document.getElementById('sum-total').textContent   = inventory.count;
  document.getElementById('sum-cost').textContent    = '₴' + fmt(total);
  document.getElementById('sum-cats').textContent    = inventory.getCategoryCount();
  document.getElementById('sum-low').textContent     = inventory.getLowStockCount();
}

// ─────────────────────────────────────────────
// МОДАЛЬНЕ ВІКНО
// ─────────────────────────────────────────────
function openModal(id = null) {
  editingId = id;
  const overlay = document.getElementById('modal-overlay');
  document.getElementById('modal-title').textContent    = id ? 'Редагувати товар' : 'Новий товар';
  document.getElementById('btn-save-label').textContent = id ? 'Оновити' : 'Зберегти';

  if (id) {
    const p = inventory.getById(id);
    if (!p) return;
    document.getElementById('f-name').value  = p.name;
    document.getElementById('f-cat').value   = p.category;
    document.getElementById('f-price').value = p.price;
    document.getElementById('f-qty').value   = p.quantity;

    if (p instanceof FoodProduct) {
      document.getElementById('f-expiry').value = p.expiryDate || '';
    }
    if (p instanceof TechProduct) {
      document.getElementById('f-warranty').value = p.warrantyMonths || '';
    }
  } else {
    document.getElementById('f-name').value    = '';
    document.getElementById('f-cat').value     = 'food';
    document.getElementById('f-price').value   = '';
    document.getElementById('f-qty').value     = '';
    document.getElementById('f-expiry').value   = '';
    document.getElementById('f-warranty').value = '';
  }

  toggleExtraFields();
  overlay.classList.add('open');
}

function openEdit(id) { openModal(id); }

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  editingId = null;
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
}

// Показ/ховання додаткових полів залежно від категорії
function toggleExtraFields() {
  const cat = document.getElementById('f-cat').value;
  document.getElementById('field-expiry').style.display   = cat === 'food' ? '' : 'none';
  document.getElementById('field-warranty').style.display = cat === 'tech' ? '' : 'none';
}

document.getElementById('f-cat').addEventListener('change', toggleExtraFields);

// ─────────────────────────────────────────────
// ЗБЕРЕЖЕННЯ ТОВАРУ
// ─────────────────────────────────────────────
function saveProduct() {
  const data = {
    name:           document.getElementById('f-name').value,
    category:       document.getElementById('f-cat').value,
    price:          parseFloat(document.getElementById('f-price').value),
    quantity:       parseInt(document.getElementById('f-qty').value),
    expiryDate:     document.getElementById('f-expiry').value,
    warrantyMonths: parseInt(document.getElementById('f-warranty').value) || 0,
  };

  try {
    if (editingId) {
      inventory.updateProduct(editingId, data);
      toast('✅ Товар оновлено');
    } else {
      inventory.addProduct(data);
      toast('✅ Товар додано');
    }
    closeModal();
    renderTable();
  } catch(e) {
    toast('❌ ' + e.message, true);
  }
}

// ─────────────────────────────────────────────
// ВИДАЛЕННЯ
// ─────────────────────────────────────────────
function deleteProduct(id) {
  const p = inventory.getById(id);
  if (!p) return;
  if (!confirm(`Видалити «${p.name}»?`)) return;

  try {
    inventory.deleteProduct(id);
    toast('🗑️ Товар видалено');
    renderTable();
  } catch(e) {
    toast('❌ ' + e.message, true);
  }
}

// ─────────────────────────────────────────────
// TOAST СПОВІЩЕННЯ
// ─────────────────────────────────────────────
function toast(msg, isError = false) {
  const container = document.getElementById('toasts');
  const el = document.createElement('div');
  el.className = 'toast' + (isError ? ' error' : '');
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// ─────────────────────────────────────────────
// ДЕМОНСТРАЦІЙНІ ДАНІ (лише якщо склад порожній)
// ─────────────────────────────────────────────
function seedDemoData() {
  if (localStorage.getItem('stockflow_inventory')) return;
  const demos = [
    { name: 'Молоко 2.5%', category: 'food', price: 38.50, quantity: 120, expiryDate: '2025-08-01' },
    { name: 'Хліб Бородінський', category: 'food', price: 25.00, quantity: 3, expiryDate: '2025-07-05' },
    { name: 'iPhone 15 Pro', category: 'tech', price: 42999, quantity: 8, warrantyMonths: 24 },
    { name: 'Samsung Galaxy A55', category: 'tech', price: 18500, quantity: 15, warrantyMonths: 12 },
    { name: 'Навушники Sony WH-1000XM5', category: 'tech', price: 9200, quantity: 4, warrantyMonths: 12 },
    { name: 'Ноутбук ASUS VivoBook', category: 'tech', price: 28000, quantity: 6, warrantyMonths: 24 },
    { name: 'Сир Гауда', category: 'food', price: 210, quantity: 50, expiryDate: '2025-09-30' },
    { name: 'Картриджі для принтера', category: 'other', price: 450, quantity: 20 },
    { name: 'Кава Lavazza 500г', category: 'food', price: 320, quantity: 2, expiryDate: '2026-01-01' },
  ];
  demos.forEach(d => inventory.addProduct(d));
}

// ─────────────────────────────────────────────
// СТАРТ
// ─────────────────────────────────────────────
seedDemoData();
renderTable();
