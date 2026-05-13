document.addEventListener('DOMContentLoaded', async () => {
    try {
        const config = window.RECIPE_CONFIG;
        if (!config || !config.dataSource) {
            throw new Error("RECIPE_CONFIG is not defined.");
        }

        const response = await fetch(config.dataSource);
        if (!response.ok) {
            throw new Error(`Failed to fetch recipe data: ${response.status}`);
        }
        
        const data = await response.json();
        const recipes = (data.recipes || []).sort((a, b) => b.date.localeCompare(a.date));

        // レシピ件数の表示
        const countElement = document.getElementById('recipe-count');
        if (countElement) {
            countElement.textContent = recipes.length > 0 ? `全 ${recipes.length} 件のレシピ` : '';
        }

        const container = document.getElementById('recipes-container');
        if (!container) return;

        if (recipes.length === 0) {
            container.innerHTML = '<li class="text-gray-500 text-center py-8">まだレシピが登録されていません。</li>';
            return;
        }

        recipes.forEach(recipe => {
            const li = document.createElement('li');
            
            const linkWrapper = document.createElement('a');
            linkWrapper.className = 'block border border-gray-200 rounded-lg px-4 py-3 card-hover bg-white group';
            
            // データソースからtypeを判別 (e.g. "../data/sweets.json" -> "sweets")
            const typeMatch = config.dataSource.match(/data\/([^.]+)\.json/);
            const type = typeMatch ? typeMatch[1] : 'cooking';
            linkWrapper.href = `recipe.html?type=${type}&id=${recipe.id}`;

            // 日付とタイトルを横並びに
            const headerDiv = document.createElement('div');
            headerDiv.className = 'flex items-center justify-between';
            
            const leftDiv = document.createElement('div');
            leftDiv.className = 'flex items-center gap-3';

            const dateSpan = document.createElement('span');
            dateSpan.className = 'text-xs text-gray-400 whitespace-nowrap';
            dateSpan.textContent = recipe.date;
            
            const titleH3 = document.createElement('h3');
            titleH3.className = 'text-base font-medium text-gray-800 group-hover:text-blue-600 transition-colors';
            titleH3.textContent = recipe.title;

            leftDiv.appendChild(dateSpan);
            leftDiv.appendChild(titleH3);

            const arrow = document.createElement('span');
            arrow.innerHTML = `<svg class="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>`;

            headerDiv.appendChild(leftDiv);
            headerDiv.appendChild(arrow);

            linkWrapper.appendChild(headerDiv);
            li.appendChild(linkWrapper);
            container.appendChild(li);
        });

    } catch (error) {
        console.error('Error loading recipe data:', error);
        const container = document.getElementById('recipes-container');
        if (container) {
            container.innerHTML = `<li class="text-red-500 p-4 border border-red-200 rounded-lg bg-red-50">レシピデータの読み込みに失敗しました。</li>`;
        }
    }
});
