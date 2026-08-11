let okinawaData = { categories: [] };
let activeCategory = 'all';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/data/okinawa.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch okinawa data: ${response.status}`);
        }
        okinawaData = await response.json();

        // カテゴリフィルターのセットアップ
        setupCategoryFilters();

        // レンダリング
        renderRestaurants();
    } catch (error) {
        console.error('Error loading Okinawa restaurants data:', error);
        const container = document.getElementById('restaurants-container');
        if (container) {
            container.innerHTML = `<div class="text-red-500 p-4 border border-red-200 rounded-lg bg-red-50">店舗データの読み込みに失敗しました。</div>`;
        }
    }
});

function setupCategoryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
                b.classList.remove('bg-blue-600', 'text-white', 'font-bold', 'shadow-xs', 'active');
                b.classList.add('bg-white', 'text-gray-600', 'border', 'border-gray-200', 'font-medium', 'hover:bg-gray-50');
            });
            btn.classList.add('bg-blue-600', 'text-white', 'font-bold', 'shadow-xs', 'active');
            btn.classList.remove('bg-white', 'text-gray-600', 'border', 'border-gray-200', 'font-medium', 'hover:bg-gray-50');

            activeCategory = btn.getAttribute('data-filter') || 'all';
            renderRestaurants();
        });
    });
}

function renderRestaurants() {
    const container = document.getElementById('restaurants-container');
    if (!container) return;

    let totalVisibleItems = 0;

    const sectionsHtml = okinawaData.categories.map(cat => {
        if (activeCategory !== 'all' && cat.id !== activeCategory) {
            return '';
        }

        const items = cat.items || [];
        if (items.length === 0) return '';

        totalVisibleItems += items.length;

        const itemsHtml = items.map(item => `
            <li class="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 relative group p-4">
                <h3 class="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    ${escapeHtml(item.name)}
                </h3>
                <div class="flex flex-wrap gap-2 mb-2">
                    ${item.area ? `<span class="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium tracking-wide">📍 ${escapeHtml(item.area)}</span>` : ''}
                    ${item.genre ? `<span class="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-bold">${escapeHtml(item.genre)}</span>` : ''}
                    ${item.mapUrl ? `<a href="${escapeHtml(item.mapUrl)}" target="_blank" rel="noopener noreferrer" class="inline-block px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 text-xs rounded-full font-bold tracking-wide transition-colors">🗺️ Google Maps</a>` : ''}
                </div>
            </li>
        `).join('');

        return `
            <div class="category-section mb-10" data-category="${escapeHtml(cat.id)}">
                <h2 class="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                    ${escapeHtml(cat.title)}
                </h2>
                <ul class="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    ${itemsHtml}
                </ul>
            </div>
        `;
    }).join('');

    if (totalVisibleItems === 0) {
        container.innerHTML = `
            <div class="text-center py-8">
                <p class="text-gray-500 font-medium">店舗データがありません。</p>
            </div>
        `;
    } else {
        container.innerHTML = sectionsHtml;
    }
}

