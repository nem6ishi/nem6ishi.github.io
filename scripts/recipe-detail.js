document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeType = urlParams.get('type');
    const recipeId = urlParams.get('id');

    const spinner = document.getElementById('loading-spinner');
    const content = document.getElementById('recipe-content');
    const errorMsg = document.getElementById('error-message');

    // Breadcrumb mapping
    const categoryMap = {
        'cooking': { name: '料理', url: 'cooking.html' },
        'sweets': { name: 'お菓子', url: 'sweets.html' }
    };

    if (!recipeType || !recipeId || !['cooking', 'sweets'].includes(recipeType)) {
        showError();
        return;
    }

    try {
        const response = await fetch(`../data/${recipeType}.json`);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        const recipe = data.recipes.find(r => r.id === recipeId);

        if (!recipe) {
            showError();
            return;
        }

        renderRecipe(recipe, recipeType, categoryMap);
    } catch (error) {
        console.error('Error fetching recipe:', error);
        showError();
    }

    function renderRecipe(recipe, type, map) {
        // Update breadcrumbs
        const navCategory = document.getElementById('nav-category');
        if (navCategory && map[type]) {
            navCategory.textContent = map[type].name;
            navCategory.href = map[type].url;
        }

        document.getElementById('nav-current-title').textContent = recipe.title;

        // Meta tags
        document.title = `${recipe.title} - 根石 将人`;
        const metaTitle = document.getElementById('og-title');
        const metaTwitter = document.getElementById('twitter-title');
        if (metaTitle) metaTitle.content = `${recipe.title} - 根石 将人`;
        if (metaTwitter) metaTwitter.content = `${recipe.title} - 根石 将人`;

        // Content
        document.getElementById('recipe-title').textContent = recipe.title;
        document.getElementById('recipe-date').textContent = recipe.date;
        document.getElementById('recipe-description').textContent = recipe.description;

        // Tags
        const tagsContainer = document.getElementById('recipe-tags');
        if (recipe.tags && recipe.tags.length > 0) {
            recipe.tags.forEach(tag => {
                const tagSpan = document.createElement('span');
                tagSpan.className = 'px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full';
                tagSpan.textContent = `#${tag}`;
                tagsContainer.appendChild(tagSpan);
            });
        }

        // Ingredients
        const ingContainer = document.getElementById('recipe-ingredients');
        if (recipe.ingredients && recipe.ingredients.length > 0) {
            recipe.ingredients.forEach(item => {
                const li = document.createElement('li');
                li.className = 'flex items-start pb-2 border-b border-orange-100 last:border-0 last:pb-0';
                li.innerHTML = `<span class="mr-2 text-orange-400 mt-0.5">•</span> <span>${item}</span>`;
                ingContainer.appendChild(li);
            });
        } else {
            ingContainer.innerHTML = '<li class="text-gray-500 italic">材料データがありません</li>';
        }

        // Instructions
        const instContainer = document.getElementById('recipe-instructions');
        if (recipe.instructions && recipe.instructions.length > 0) {
            recipe.instructions.forEach((item, index) => {
                const div = document.createElement('div');
                div.className = 'flex';
                div.innerHTML = `
                    <div class="flex-shrink-0 mr-4">
                        <div class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                            ${index + 1}
                        </div>
                    </div>
                    <div class="pt-1 pb-4 border-b border-gray-100 flex-grow text-gray-700 leading-relaxed">
                        ${item}
                    </div>
                `;
                instContainer.appendChild(div);
            });
            // 最後のボーダーを消す処理はCSSでやると複雑なのでJSで少し調整
            if (instContainer.lastElementChild) {
                instContainer.lastElementChild.querySelector('.border-b').classList.remove('border-b', 'border-gray-100', 'pb-4');
            }
        } else {
            instContainer.innerHTML = '<p class="text-gray-500 italic">作り方データがありません</p>';
        }

        spinner.classList.add('hidden');
        content.classList.remove('hidden');
    }

    function showError() {
        spinner.classList.add('hidden');
        errorMsg.classList.remove('hidden');
    }
});
