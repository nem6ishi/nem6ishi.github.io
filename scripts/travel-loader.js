/**
 * 海外旅行データを読み込んで表示するスクリプト
 */

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/data/travel.json');
        if (!response.ok) {
            throw new Error(`Failed to load travel data: ${response.status}`);
        }
        const travelData = await response.json();

        // 合計日数を設定
        renderTotalDays(travelData.totalDays);

        // 旅行リストをレンダリング
        renderTrips(travelData.trips);
    } catch (error) {
        console.error('Error loading travel data:', error);
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
        const countryNames = trip.countries.map(c => c.name).join('、');
        const countriesHtml = trip.countries.length === 1
            ? renderSingleCountryCities(trip.countries[0])
            : renderMultipleCountries(trip.countries);

        const storyHtml = trip.story ? `
            <div class="mt-3 ml-4 mb-3 border border-gray-100 rounded-md p-3 bg-gray-50 shadow-sm">
                <p class="text-sm text-gray-600 leading-relaxed whitespace-pre-line">${trip.story}</p>
            </div>
        ` : '';

        return `
            <li class="mb-6 border border-gray-200 rounded-lg p-4 card-hover">
                <div class="mb-2">
                    <span class="text-xs text-gray-500 whitespace-nowrap block mb-1">
                        ${formatDate(trip.startDate)} - ${formatDate(trip.endDate)} (${trip.days} days)
                    </span>
                    <h3 class="text-lg font-medium text-gray-800">${countryNames}</h3>
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
            ${country.cities.map(city => `<li>${city}</li>`).join('')}
        </ul>
    `;
}

/**
 * 複数国をレンダリング
 */
function renderMultipleCountries(countries) {
    return `
        <div>
            ${countries.map(country => `
                <h4 class="text-md font-medium text-gray-700 mt-3 mb-1">${country.name}</h4>
                <ul class="list-disc list-inside pl-1 text-sm text-gray-600 leading-relaxed space-y-1">
                    ${country.cities.map(city => `<li>${city}</li>`).join('')}
                </ul>
            `).join('')}
        </div>
    `;
}
