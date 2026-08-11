/**
 * 海外旅行データを読み込んで表示するスクリプト
 */

let allTrips = [];

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('trips-container');
    if (container) showLoading(container);

    try {
        const response = await fetch('/data/travel.json');
        if (!response.ok) {
            throw new Error(`HTTPエラー: ${response.status}`);
        }
        const travelData = await response.json();
        allTrips = travelData.trips || [];

        // 合計日数を設定
        renderTotalDays(travelData.totalDays, allTrips.length);

        // フィルターと検索イベントのセットアップ
        setupFiltersAndSearch();

        // 旅行リストをレンダリング
        renderTrips(allTrips);
    } catch (error) {
        console.error('Error loading travel data:', error);
        if (container) {
            showError(container, '旅行データを読み込めませんでした。');
        }
    }
});

/**
 * 合計日数を表示
 */
function renderTotalDays(totalDays, tripCount) {
    const element = document.getElementById('total-days');
    if (element) {
        element.textContent = `全${tripCount}回の旅 / 通算${totalDays}日間`;
    }
}

/**
 * フィルターと検索イベントの初期化
 */
function setupFiltersAndSearch() {
    const searchInput = document.getElementById('travel-search');
    const filterBtns = document.querySelectorAll('.travel-filter-btn');

    let currentFilter = 'all';

    const filterData = () => {
        const query = (searchInput?.value || '').toLowerCase().trim();

        const filtered = allTrips.filter(trip => {
            // 年代フィルター
            const year = parseInt(trip.startDate.substring(0, 4), 10);
            let matchesEra = true;
            if (currentFilter === '2020s') {
                matchesEra = year >= 2020;
            } else if (currentFilter === '2010s') {
                matchesEra = year >= 2010 && year < 2020;
            }

            if (!matchesEra) return false;

            // テキスト検索
            if (!query) return true;

            const countryMatch = trip.countries.some(c => 
                (c.name && c.name.toLowerCase().includes(query)) ||
                (c.nameEn && c.nameEn.toLowerCase().includes(query)) ||
                (c.cities && c.cities.some(city => {
                    const cName = typeof city === 'string' ? city : (city.name || '');
                    const cNameEn = typeof city === 'object' ? (city.nameEn || '') : '';
                    return cName.toLowerCase().includes(query) || cNameEn.toLowerCase().includes(query);
                }))
            );

            const storyMatch = trip.story && trip.story.toLowerCase().includes(query);

            return countryMatch || storyMatch;
        });

        renderTrips(filtered);
    };

    if (searchInput) {
        searchInput.addEventListener('input', filterData);
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
                b.classList.remove('bg-blue-600', 'text-white', 'font-bold', 'active');
                b.classList.add('bg-white', 'text-gray-600', 'border', 'border-gray-200', 'font-medium', 'hover:bg-gray-50');
            });
            btn.classList.add('bg-blue-600', 'text-white', 'font-bold', 'active');
            btn.classList.remove('bg-white', 'text-gray-600', 'border', 'border-gray-200', 'font-medium', 'hover:bg-gray-50');

            currentFilter = btn.getAttribute('data-filter') || 'all';
            filterData();
        });
    });
}

/**
 * 日付をフォーマット
 */
function formatDate(dateStr) {
    return dateStr.replace(/-/g, '/');
}

/**
 * 旅行リストをレンダリング
 */
function renderTrips(trips) {
    const container = document.getElementById('trips-container');
    if (!container) return;

    if (trips.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                <p class="text-gray-500 font-medium">条件に一致する旅行記録が見つかりませんでした。</p>
            </div>
        `;
        return;
    }

    container.innerHTML = trips.map(trip => {
        const countryNames = trip.countries.map(c => {
            return c.nameEn ? `${c.name} / ${c.nameEn}` : c.name;
        }).join('、');
        const countriesHtml = trip.countries.length === 1
            ? renderSingleCountryCities(trip.countries[0])
            : renderMultipleCountries(trip.countries);

        const storyHtml = trip.story ? `
            <div class="mt-3 ml-2 sm:ml-4 mb-3 border-l-4 border-blue-400 bg-blue-50/50 p-4 rounded-r-lg">
                <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">${escapeHtml(trip.story)}</p>
            </div>
        ` : '';

        return `
            <li class="mb-6 border border-gray-200 rounded-xl p-5 card-hover bg-white shadow-xs transition-all duration-300">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
                    <h3 class="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                        <span>✈️</span> ${escapeHtml(countryNames)}
                    </h3>
                    <span class="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-semibold border border-blue-100 self-start sm:self-auto">
                        📅 ${escapeHtml(formatDate(trip.startDate))} - ${escapeHtml(formatDate(trip.endDate))} (${trip.days} days)
                    </span>
                </div>
                ${storyHtml}
                ${countriesHtml}
            </li>
        `;
    }).join('');
}

/**
 * 単一国の都市リストをレンダリング
 */
function renderSingleCountryCities(country) {
    return `
        <div class="mt-3">
            <ul class="flex flex-wrap gap-2 text-sm text-gray-700">
                ${country.cities.map(city => {
                    const displayName = typeof city === 'string'
                        ? escapeHtml(city)
                        : (city.nameEn ? `${escapeHtml(city.name)} <span class="text-xs text-gray-400">(${escapeHtml(city.nameEn)})</span>` : escapeHtml(city.name));
                    return `<li class="bg-gray-100 px-3 py-1 rounded-md text-xs font-medium text-gray-700 border border-gray-200">📍 ${displayName}</li>`;
                }).join('')}
            </ul>
        </div>
    `;
}

/**
 * 複数国をレンダリング
 */
function renderMultipleCountries(countries) {
    return `
        <div class="mt-3 space-y-3">
            ${countries.map(country => {
                const displayName = country.nameEn
                    ? `${escapeHtml(country.name)} <span class="text-xs text-gray-400">(${escapeHtml(country.nameEn)})</span>`
                    : escapeHtml(country.name);
                return `
                    <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <h4 class="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">📌 ${displayName}</h4>
                        <ul class="flex flex-wrap gap-2 text-sm text-gray-700">
                            ${country.cities.map(city => {
                                const cityDisplayName = typeof city === 'string'
                                    ? escapeHtml(city)
                                    : (city.nameEn ? `${escapeHtml(city.name)} <span class="text-xs text-gray-400">(${escapeHtml(city.nameEn)})</span>` : escapeHtml(city.name));
                                return `<li class="bg-white px-2.5 py-1 rounded text-xs font-medium text-gray-700 border border-gray-200 shadow-2xs">📍 ${cityDisplayName}</li>`;
                            }).join('')}
                        </ul>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

