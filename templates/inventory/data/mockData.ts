export const mockData = {
    '/categories': {
        'cat-1': { name: 'Electronics',  slug: 'electronics' },
        'cat-2': { name: 'Clothing',     slug: 'clothing' },
        'cat-3': { name: 'Home & Garden',slug: 'home-garden' },
        'cat-4': { name: 'Sports',       slug: 'sports' },
    },
    '/products': {
        'p-1': { name: 'Wireless Headphones', category: 'Electronics',   price: 79.00,  stock: 42,  sku: 'EL-001', active: true },
        'p-2': { name: 'Running Shoes',       category: 'Sports',        price: 120.00, stock: 18,  sku: 'SP-002', active: true },
        'p-3': { name: 'Desk Lamp',           category: 'Home & Garden', price: 35.00,  stock: 0,   sku: 'HG-003', active: false },
        'p-4': { name: 'Cotton T-Shirt',      category: 'Clothing',      price: 15.00,  stock: 130, sku: 'CL-004', active: true },
        'p-5': { name: 'Mechanical Keyboard', category: 'Electronics',   price: 99.00,  stock: 25,  sku: 'EL-005', active: true },
        'p-6': { name: 'Yoga Mat',            category: 'Sports',        price: 45.00,  stock: 60,  sku: 'SP-006', active: true },
    },
};
