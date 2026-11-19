/**
 * 海外旅行データを読み込んで表示するスクリプト
 */

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('trips-container');
    const upcomingSection = document.getElementById('upcoming-section');
    const upcomingContainer = document.getElementById('upcoming-trips-container');

    try {
        const response = await fetch('/data/travel.json');
        if (!response.ok) {
            throw new Error(`HTTPエラー: ${response.status}`);
        }
        const travelData = await response.json();
        const upcomingTrips = travelData.upcomingTrips || [];
        const trips = travelData.trips || [];

        // 合計日数を設定
        renderTotalDays(travelData.totalDays);

        // 今後の予定をレンダリング
        if (upcomingSection && upcomingContainer && upcomingTrips.length > 0) {
            upcomingSection.classList.remove('hidden');
            renderTrips(upcomingTrips, upcomingContainer, { isUpcoming: true });
        }

        // 過去の旅行リストをレンダリング
        renderTrips(trips, container, { isUpcoming: false });
    } catch (error) {
        console.error('Error loading travel data:', error);
        if (container) {
            container.innerHTML = `<li class="text-red-500 p-4 border border-red-200 rounded-lg bg-red-50">旅行データを読み込めませんでした。</li>`;
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
function renderTrips(trips, container = document.getElementById('trips-container'), { isUpcoming = false } = {}) {
    if (!container) return;

    if (trips.length === 0) {
        container.innerHTML = `<li class="text-gray-500 text-center py-8">旅行記録がありません。</li>`;
        return;
    }

    const cardClass = isUpcoming
        ? 'mb-6 border border-blue-200 rounded-lg p-4 card-hover bg-blue-50/20'
        : 'mb-6 border border-gray-200 rounded-lg p-4 card-hover bg-white';

    const badgeHtml = isUpcoming
        ? `<span class="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 mr-2">予定 / Upcoming</span>`
        : '';

    container.innerHTML = trips.map(trip => {
        const countryNames = trip.countries.map(c => {
            return c.nameEn ? `${c.name} / ${c.nameEn}` : c.name;
        }).join('、');
        const countriesHtml = trip.countries.length === 1
            ? renderSingleCountryCities(trip.countries[0])
            : renderMultipleCountries(trip.countries);

        const storyHtml = trip.story ? `
            <div class="mt-3 ml-4 mb-3 border border-gray-100 rounded-md p-3 bg-gray-50 shadow-xs">
                <p class="text-sm text-gray-600 leading-relaxed whitespace-pre-line">${escapeHtml(trip.story)}</p>
            </div>
        ` : '';

        return `
            <li class="${cardClass}">
                <div class="mb-2">
                    <div class="flex items-center flex-wrap gap-y-1 mb-1">
                        ${badgeHtml}
                        <span class="text-xs text-gray-500 whitespace-nowrap">
                            ${escapeHtml(formatDate(trip.startDate))} - ${escapeHtml(formatDate(trip.endDate))} (${trip.days} days)
                        </span>
                    </div>
                    <h3 class="text-lg font-medium text-gray-800">${escapeHtml(countryNames)}</h3>
                </div>
                ${storyHtml}
                ${countriesHtml}
            </li>
        `;
    }).join('');
}

/**
 * 都市の表示名を生成
 */
function formatCityName(city) {
    if (typeof city === 'string') {
        return escapeHtml(city);
    }
    const baseName = city.nameEn
        ? `${escapeHtml(city.name)} / ${escapeHtml(city.nameEn)}`
        : escapeHtml(city.name);
    return city.dates
        ? `${baseName} <span class="text-xs text-gray-400 ml-1">(${escapeHtml(city.dates)})</span>`
        : baseName;
}

/**
 * 単一国の都市リストをレンダリング
 */
function renderSingleCountryCities(country) {
    return `
        <ul class="list-disc list-inside pl-1 text-sm text-gray-600 leading-relaxed space-y-1">
            ${country.cities.map(city => `<li>${formatCityName(city)}</li>`).join('')}
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
                        ${country.cities.map(city => `<li>${formatCityName(city)}</li>`).join('')}
                    </ul>
                `;
            }).join('')}
        </div>
    `;
}


