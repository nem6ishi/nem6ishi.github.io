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
            countElement.textContent = `全 ${recipes.length} 件のレシピ`;
        }

        const container = document.getElementById('recipes-container');
        if (!container) return;

        recipes.forEach(recipe => {
            const li = document.createElement('li');
            li.className = 'border border-gray-200 rounded-lg p-4 card-hover bg-white flex flex-col h-full';

            // 日付とタイトル
            const headerDiv = document.createElement('div');
            headerDiv.className = 'mb-2';
            
            const dateSpan = document.createElement('span');
            dateSpan.className = 'text-xs text-gray-500 whitespace-nowrap block mb-1';
            dateSpan.textContent = recipe.date;
            
            const titleH3 = document.createElement('h3');
            titleH3.className = 'text-lg font-medium text-gray-800';
            titleH3.textContent = recipe.title;

            headerDiv.appendChild(dateSpan);
            headerDiv.appendChild(titleH3);

            // 説明文
            const descP = document.createElement('p');
            descP.className = 'text-sm text-gray-600 leading-relaxed flex-grow mb-4';
            descP.textContent = recipe.description;

            // タグ
            const tagsDiv = document.createElement('div');
            tagsDiv.className = 'flex flex-wrap gap-2 mt-auto';
            if (recipe.tags && recipe.tags.length > 0) {
                recipe.tags.forEach(tag => {
                    const tagSpan = document.createElement('span');
                    tagSpan.className = 'px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full';
                    tagSpan.textContent = `#${tag}`;
                    tagsDiv.appendChild(tagSpan);
                });
            }

            // 詳細（材料・作り方）
            const detailsElement = document.createElement('details');
            detailsElement.className = 'mt-2 mb-4 group';
            
            const summaryElement = document.createElement('summary');
            summaryElement.className = 'text-sm text-blue-600 cursor-pointer hover:underline font-medium list-none flex items-center';
            summaryElement.innerHTML = `レシピを見る <svg class="w-4 h-4 ml-1 transform transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>`;
            detailsElement.appendChild(summaryElement);

            const detailsContent = document.createElement('div');
            detailsContent.className = 'mt-3 text-sm text-gray-700 bg-gray-50 p-4 rounded-md border border-gray-100';

            let hasDetails = false;

            if (recipe.ingredients && recipe.ingredients.length > 0) {
                hasDetails = true;
                const ingTitle = document.createElement('h4');
                ingTitle.className = 'font-bold text-gray-800 mb-2';
                ingTitle.textContent = '材料';
                detailsContent.appendChild(ingTitle);

                const ingList = document.createElement('ul');
                ingList.className = 'list-disc list-inside mb-4 space-y-1';
                recipe.ingredients.forEach(item => {
                    const liItem = document.createElement('li');
                    // HTMLタグを許可するかどうか。基本はテキスト
                    liItem.innerHTML = item;
                    ingList.appendChild(liItem);
                });
                detailsContent.appendChild(ingList);
            }

            if (recipe.instructions && recipe.instructions.length > 0) {
                hasDetails = true;
                const instTitle = document.createElement('h4');
                instTitle.className = 'font-bold text-gray-800 mb-2';
                instTitle.textContent = '作り方';
                detailsContent.appendChild(instTitle);

                const instList = document.createElement('ol');
                instList.className = 'list-decimal list-inside space-y-2';
                recipe.instructions.forEach(item => {
                    const liItem = document.createElement('li');
                    liItem.className = 'pl-1';
                    liItem.innerHTML = item;
                    instList.appendChild(liItem);
                });
                detailsContent.appendChild(instList);
            }
            
            detailsElement.appendChild(detailsContent);

            li.appendChild(headerDiv);
            li.appendChild(descP);
            
            if (hasDetails) {
                li.appendChild(detailsElement);
            }
            
            li.appendChild(tagsDiv);
            
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
