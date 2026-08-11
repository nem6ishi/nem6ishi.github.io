let okinawaData = { categories: [] };
let activeCategory = 'all';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/data/okinawa.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch okinawa data: ${response.status}`);
        }
        okinawaData = await response.json();

        // エリアドロップダウンの構築
        setupAreaFilter();

        // 検索とフィルターのセットアップ
        setupFiltersAndSearch();

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

function setupAreaFilter() {
    const areaSelect = document.getElementById('area-filter');
    if (!areaSelect) return;

    const areas = new Set();
    okinawaData.categories.forEach(cat => {
        cat.items.forEach(item => {
            if (item.area) areas.add(item.area);
        });
    });

    Array.from(areas).sort().forEach(area => {
        const opt = document.createElement('option');
        opt.value = area;
        opt.textContent = `📍 ${area}`;
        areaSelect.appendChild(opt);
    });
}

function setupFiltersAndSearch() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('okinawa-search');
    const areaSelect = document.getElementById('area-filter');

    const updateView = () => {
        renderRestaurants();
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
                b.classList.remove('bg-blue-600', 'text-white', 'font-bold', 'shadow-xs', 'active');
                b.classList.add('bg-white', 'text-gray-600', 'border', 'border-gray-200', 'font-medium', 'hover:bg-gray-50');
            });
            btn.classList.add('bg-blue-600', 'text-white', 'font-bold', 'shadow-xs', 'active');
            btn.classList.remove('bg-white', 'text-gray-600', 'border', 'border-gray-200', 'font-medium', 'hover:bg-gray-50');

            activeCategory = btn.getAttribute('data-filter') || 'all';
            updateView();
        });
    });

    if (searchInput) searchInput.addEventListener('input', updateView);
    if (areaSelect) areaSelect.addEventListener('change', updateView);
}

function renderRestaurants() {
    const container = document.getElementById('restaurants-container');
    const searchInput = document.getElementById('okinawa-search');
    const areaSelect = document.getElementById('area-filter');
    const countElement = document.getElementById('restaurant-count');

    if (!container) return;

    const query = (searchInput?.value || '').toLowerCase().trim();
    const selectedArea = areaSelect?.value || 'all';

    let totalVisibleItems = 0;

    const sectionsHtml = okinawaData.categories.map(cat => {
        if (activeCategory !== 'all' && cat.id !== activeCategory) {
            return '';
        }

        const filteredItems = cat.items.filter(item => {
            // エリアフィルター
            if (selectedArea !== 'all' && item.area !== selectedArea) {
                return false;
            }

            // テキスト検索
            if (!query) return true;

            const nameMatch = item.name && item.name.toLowerCase().includes(query);
            const areaMatch = item.area && item.area.toLowerCase().includes(query);
            const genreMatch = item.genre && item.genre.toLowerCase().includes(query);

            return nameMatch || areaMatch || genreMatch;
        });

        if (filteredItems.length === 0) return '';

        totalVisibleItems += filteredItems.length;

        const itemsHtml = filteredItems.map(item => `
            <li class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 relative group p-4 flex flex-col justify-between">
                <div>
                    <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        ${escapeHtml(item.name)}
                    </h3>
                    <div class="flex flex-wrap gap-1.5 mb-3">
                        ${item.area ? `<span class="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">📍 ${escapeHtml(item.area)}</span>` : ''}
                        ${item.genre ? `<span class="inline-block px-2.5 py-0.5 bg-orange-50 text-orange-700 border border-orange-100 text-xs rounded-full font-semibold">${escapeHtml(item.genre)}</span>` : ''}
                    </div>
                </div>
                ${item.mapUrl ? `
                    <div class="mt-2 pt-2 border-t border-gray-100">
                        <a href="${escapeHtml(item.mapUrl)}" target="_blank" rel="noopener noreferrer" 
                           class="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                            🗺️ Google Mapsで見る <span class="ml-1">&rarr;</span>
                        </a>
                    </div>
                ` : ''}
            </li>
        `).join('');

        return `
            <div class="category-section mb-10">
                <h2 class="text-xl font-extrabold text-gray-900 mb-4 pb-2 border-b border-gray-200 flex items-center justify-between">
                    <span>${escapeHtml(cat.title)}</span>
                    <span class="text-xs font-normal text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">${filteredItems.length}件</span>
                </h2>
                <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${itemsHtml}
                </ul>
            </div>
        `;
    }).join('');

    if (countElement) {
        countElement.textContent = `表示中: ${totalVisibleItems}店舗`;
    }

    if (totalVisibleItems === 0) {
        container.innerHTML = `
            <div class="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                <p class="text-gray-500 font-medium">条件に一致する飲食店が見つかりませんでした。</p>
            </div>
        `;
    } else {
        container.innerHTML = sectionsHtml;
    }
}
