/**
 * DreamWisdom 前端 API 與記憶體狀態管理模組
 * 遵循商業規則：
 * 1. 完全移除 localStorage / sessionStorage，前端不持久存業務數據。
 * 2. 記憶體快取：同 GET 請求 5 秒內不重複向後端發起，頁面刷新自動清空。
 * 3. 管理員認證採用 HttpOnly Cookie，前端不設 Authorization Header。
 * 4. 403 錯誤自動彈出「管理員權限不足，請重新登入」。
 * 5. 防抖函數 (Debounce 200ms) 用於分類快速切換。
 */

// 1. 前端 JS 記憶體快取 (Page Refresh 即清空)
const memoryCache = new Map();
const CACHE_TTL_MS = 5000; // 5 秒

export function clearApiCache() {
  memoryCache.clear();
  console.log('⚡ 前端記憶體快取已清空');
}

// 2. 200ms 防抖輔助函數
export function debounce(func, wait = 200) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 3. 通用 API 請求器 (自動快取、認證傳遞與 403 異常攔截)
async function apiRequest(url, options = {}) {
  const method = (options.method || 'GET').toUpperCase();

  // 若為 GET 請求且命中 5 秒快取
  if (method === 'GET') {
    const cached = memoryCache.get(url);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
  }

  try {
    const response = await fetch(url, {
      credentials: 'include', // 傳遞與接收 HttpOnly dw_admin_token Cookie
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    // 403 鑑權失敗攔截
    if (response.status === 403) {
      alert('管理員權限不足，請重新登入');
      throw new Error('403 Forbidden: 管理員權限不足');
    }

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error || `HTTP 錯誤 ${response.status}`);
    }

    const data = await response.json();

    // GET 請求寫入前端記憶體快取
    if (method === 'GET') {
      memoryCache.set(url, { data, timestamp: Date.now() });
    }

    return data;
  } catch (err) {
    console.error(`API 請求失敗 [${method} ${url}]:`, err.message);
    throw err;
  }
}

// 4. 分類 API
export async function loadCategories() {
  return await apiRequest('/api/categories');
}

export async function createCategory(catData) {
  const res = await apiRequest('/api/categories', {
    method: 'POST',
    body: JSON.stringify(catData),
  });
  clearApiCache(); // 異動後自動清空快取
  return res;
}

export async function updateCategory(id, catData) {
  const res = await apiRequest(`/api/categories/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(catData),
  });
  clearApiCache();
  return res;
}

export async function removeCategory(id) {
  const res = await apiRequest(`/api/categories/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  clearApiCache();
  return res;
}

// 5. 商品與選物店 API
export async function loadProducts(categoryId = 'all', page = 1, limit = 12) {
  const query = new URLSearchParams({
    categoryId: categoryId || 'all',
    page: String(page),
    limit: String(limit),
  });
  return await apiRequest(`/api/products?${query.toString()}`);
}

export async function loadShopBootstrap() {
  return await apiRequest('/api/shop-bootstrap');
}

export async function loadRecommendProducts(theme = '', limit = 3) {
  const query = new URLSearchParams({
    theme: theme || '',
    limit: String(limit),
  });
  return await apiRequest(`/api/recommend-products?${query.toString()}`);
}

// 6. 管理員認證 API (依靠 HttpOnly Cookie，無 Token 本地持久化)
export async function adminLogin(password) {
  return await apiRequest('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
}

export async function adminLogout() {
  return await apiRequest('/api/admin/logout', {
    method: 'POST',
  });
}

export async function checkAdminStatus() {
  try {
    const res = await apiRequest('/api/admin/status');
    return res.isAdmin === true;
  } catch {
    return false;
  }
}

// 7. 前端記憶體購物車 (只做 UI 模擬，絕不寫入 localStorage)
const memoryCart = [];
const cartListeners = new Set();

export function getCart() {
  return [...memoryCart];
}

export function getCartCount() {
  return memoryCart.reduce((total, item) => total + item.quantity, 0);
}

export function getCartTotal() {
  return memoryCart.reduce((total, item) => total + item.product.priceHKD * item.quantity, 0);
}

export function addToCart(product, quantity = 1) {
  const existing = memoryCart.find((item) => item.product.id === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    memoryCart.push({ product, quantity });
  }
  notifyCartChanged();
}

export function updateCartQuantity(productId, delta) {
  const index = memoryCart.findIndex((item) => item.product.id === productId);
  if (index !== -1) {
    memoryCart[index].quantity += delta;
    if (memoryCart[index].quantity <= 0) {
      memoryCart.splice(index, 1);
    }
    notifyCartChanged();
  }
}

export function clearCart() {
  memoryCart.length = 0;
  notifyCartChanged();
}

export function onCartChange(callback) {
  cartListeners.add(callback);
  return () => cartListeners.delete(callback);
}

function notifyCartChanged() {
  for (const cb of cartListeners) {
    try {
      cb({
        cart: getCart(),
        count: getCartCount(),
        total: getCartTotal(),
      });
    } catch (e) {
      console.error(e);
    }
  }
}
