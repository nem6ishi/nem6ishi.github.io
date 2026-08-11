let allRecipes = [];
let recipeType = 'cooking';

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
        allRecipes = (data.recipes || []).sort((a, b) => b.date.localeCompare(a.date));

        const typeMatch = config.dataSource.match(/data\/([^.]+)\.json/);
        recipeType = typeMatch ? typeMatch[1] : 'cooking';

        // 検索機能のセットアップ
        setupRecipeSearch();

        // 初期表示
        renderRecipes(allRecipes);

    } catch (error) {
        console.error('Error loading recipe data:', error);
        const container = document.getElementById('recipes-container');
        if (container) {
            container.innerHTML = `<li class="text-red-500 p-4 border border-red-200 rounded-lg bg-red-50">レシピデータの読み込みに失敗しました。</li>`;
        }
    }
});

function setupRecipeSearch() {
    const searchInput = document.getElementById('recipe-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        if (!query) {
            renderRecipes(allRecipes);
            return;
        }

        const filtered = allRecipes.filter(r => {
            const titleMatch = r.title && r.title.toLowerCase().includes(query);
            const descMatch = r.description && r.description.toLowerCase().includes(query);
            const ingMatch = r.ingredients && r.ingredients.some(ing => ing.name && ing.name.toLowerCase().includes(query));
            return titleMatch || descMatch || ingMatch;
        });

        renderRecipes(filtered);
    });
}

function renderRecipes(recipes) {
    const countElement = document.getElementById('recipe-count');
    if (countElement) {
        countElement.textContent = recipes.length > 0 ? `全 ${recipes.length} 件のレシピ` : '0件';
    }

    const container = document.getElementById('recipes-container');
    if (!container) return;

    if (recipes.length === 0) {
        container.innerHTML = '<li class="text-gray-500 text-center py-10 bg-gray-50 rounded-xl border border-gray-200">該当するレシピが見つかりませんでした。</li>';
        return;
    }

    container.innerHTML = recipes.map(recipe => {
        return `
            <li>
                <a href="recipe.html?type=${recipeType}&id=${recipe.id}" class="block border border-gray-200 rounded-xl p-4 card-hover bg-white group transition-all duration-200 shadow-2xs">
                    <div class="flex items-center justify-between gap-3">
                        <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                            <span class="text-xs font-semibold text-gray-400 whitespace-nowrap bg-gray-100 px-2 py-0.5 rounded">📅 ${escapeHtml(recipe.date)}</span>
                            <h3 class="text-base sm:text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">${escapeHtml(recipe.title)}</h3>
                        </div>
                        <span class="text-blue-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0">
                            &rarr;
                        </span>
                    </div>
                </a>
            </li>
        `;
    }).join('');
}

