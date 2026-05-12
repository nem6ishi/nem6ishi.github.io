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
        const recipes = data.recipes || [];

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
            li.className = 'h-full';
            
            const linkWrapper = document.createElement('a');
            linkWrapper.className = 'block border border-gray-200 rounded-lg p-4 card-hover bg-white h-full flex flex-col group';
            
            // データソースからtypeを判別 (e.g. "../data/sweets.json" -> "sweets")
            const typeMatch = config.dataSource.match(/data\/([^.]+)\.json/);
            const type = typeMatch ? typeMatch[1] : 'cooking';
            linkWrapper.href = `recipe.html?type=${type}&id=${recipe.id}`;

            // 日付とタイトル
            const headerDiv = document.createElement('div');
            headerDiv.className = 'mb-2';
            
            const dateSpan = document.createElement('span');
            dateSpan.className = 'text-xs text-gray-500 whitespace-nowrap block mb-1';
            dateSpan.textContent = recipe.date;
            
            const titleH3 = document.createElement('h3');
            titleH3.className = 'text-lg font-medium text-gray-800 group-hover:text-blue-600 transition-colors flex justify-between items-center';
            titleH3.innerHTML = `
                ${recipe.title}
                <svg class="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            `;

            headerDiv.appendChild(dateSpan);
            headerDiv.appendChild(titleH3);

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
