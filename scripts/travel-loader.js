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

        // タイトルと説明を設定
        renderHeader(travelData);

        // 訪問国リストをレンダリング
        renderCountries(travelData.countries);
    } catch (error) {
        console.error('Error loading travel data:', error);
    }
});

/**
 * ヘッダー部分をレンダリング
 */
function renderHeader(data) {
    const titleElement = document.getElementById('travel-title');
    const descriptionElement = document.getElementById('travel-description');

    if (titleElement) {
        titleElement.textContent = data.title;
    }

    if (descriptionElement) {
        descriptionElement.textContent = data.description;
    }
}

/**
 * 訪問国リストをレンダリング
 */
function renderCountries(countries) {
    const container = document.getElementById('countries-container');
    if (!container) return;

    container.innerHTML = countries.map(country => `
        <div class="card-hover bg-white p-6 rounded-xl border border-gray-200">
            <h3 class="text-xl font-bold text-gray-900 mb-3">${country.name}</h3>
            <div class="space-y-2 text-gray-600">
                <div class="flex items-start">
                    <svg class="w-5 h-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <span><strong>訪問都市:</strong> ${country.cities.join(', ')}</span>
                </div>
                <div class="flex items-start">
                    <svg class="w-5 h-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <span><strong>訪問時期:</strong> ${country.visits.join(', ')}</span>
                </div>
                <p class="mt-3">${country.description}</p>
            </div>
        </div>
    `).join('');
}
