/**
 * 海外旅行データを読み込んで表示するスクリプト
 */

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('trips-container');
    if (container) showLoading(container);

    try {
        const response = await fetch('/data/travel.json');
        if (!response.ok) {
            throw new Error(`HTTPエラー: ${response.status}`);
        }
        const travelData = await response.json();

        // 合計日数を設定
        renderTotalDays(travelData.totalDays);

        // 旅行リストをレンダリング
        renderTrips(travelData.trips);
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
function renderTotalDays(totalDays) {
    const element = document.getElementById('total-days');
    if (element) {
        element.textContent = `Total: ${totalDays} days`;
    }
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

    container.innerHTML = trips.map(trip => {
        const countryNames = trip.countries.map(c => {
            return c.nameEn ? `${c.name} / ${c.nameEn}` : c.name;
        }).join('、');
        const countriesHtml = trip.countries.length === 1
            ? renderSingleCountryCities(trip.countries[0])
            : renderMultipleCountries(trip.countries);

        const storyHtml = trip.story ? `
            <div class="mt-3 ml-4 mb-3 border border-gray-100 rounded-md p-3 bg-gray-50 shadow-sm">
                <p class="text-sm text-gray-600 leading-relaxed whitespace-pre-line">${escapeHtml(trip.story)}</p>
            </div>
        ` : '';

        return `
            <li class="mb-6 border border-gray-200 rounded-lg p-4 card-hover">
                <div class="mb-2">
                    <span class="text-xs text-gray-500 whitespace-nowrap block mb-1">
                        ${escapeHtml(formatDate(trip.startDate))} - ${escapeHtml(formatDate(trip.endDate))} (${trip.days} days)
                    </span>
                    <h3 class="text-lg font-medium text-gray-800">${escapeHtml(countryNames)}</h3>
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
        <ul class="list-disc list-inside pl-1 text-sm text-gray-600 leading-relaxed space-y-1">
            ${country.cities.map(city => {
        // 文字列の場合（後方互換性）
        if (typeof city === 'string') {
            return `<li>${escapeHtml(city)}</li>`;
        }
        // オブジェクトの場合
        const displayName = city.nameEn
            ? `${escapeHtml(city.name)} / ${escapeHtml(city.nameEn)}`
            : escapeHtml(city.name);
        return `<li>${displayName}</li>`;
    }).join('')}
        </ul>
    `;
}

/**
 * 複数国をレンダリング
 */
function renderMultipleCountries(countries) {
    return `
        <div>
            ${countries.map(country => {
        const displayName = country.nameEn
            ? `${escapeHtml(country.name)} / ${escapeHtml(country.nameEn)}`
            : escapeHtml(country.name);
        return `
                    <h4 class="text-md font-medium text-gray-700 mt-3 mb-1">${displayName}</h4>
                    <ul class="list-disc list-inside pl-1 text-sm text-gray-600 leading-relaxed space-y-1">
                        ${country.cities.map(city => {
            // 文字列の場合（後方互換性）
            if (typeof city === 'string') {
                return `<li>${escapeHtml(city)}</li>`;
            }
            // オブジェクトの場合
            const cityDisplayName = city.nameEn
                ? `${escapeHtml(city.name)} / ${escapeHtml(city.nameEn)}`
                : escapeHtml(city.name);
            return `<li>${cityDisplayName}</li>`;
        }).join('')}
                    </ul>
                `;
    }).join('')}
        </div>
    `;
}
