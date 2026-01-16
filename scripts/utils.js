/**
 * ユーティリティ関数
 */

/**
 * HTMLエスケープ（XSS対策）
 * @param {string} text エスケープするテキスト
 * @returns {string} エスケープされたHTML
 */
function escapeHtml(text) {
    if (text == null) return '';
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}

/**
 * エラーメッセージを表示
 * @param {HTMLElement} container 表示先のコンテナ
 * @param {string} message エラーメッセージ
 */
function showError(container, message) {
    if (!container) return;
    container.innerHTML = `
        <div class="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 my-4">
            <div class="flex items-start">
                <svg class="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div>
                    <p class="font-semibold text-red-800 mb-1">データの読み込みに失敗しました</p>
                    <p class="text-sm text-red-700">${escapeHtml(message)}</p>
                    <p class="text-sm text-red-600 mt-2">ページを再読み込みしてみてください。</p>
                </div>
            </div>
        </div>
    `;
}

/**
 * ローディング表示
 * @param {HTMLElement} container 表示先のコンテナ
 */
function showLoading(container) {
    if (!container) return;
    container.innerHTML = `
        <div class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    `;
}
