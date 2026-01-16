/**
 * 共通コンポーネントを読み込むためのスクリプト
 */
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('header', '/components/header.html', setupNavigation);
    loadComponent('footer', '/components/footer.html');
});

/**
 * 指定したIDの要素に外部HTMLを読み込む
 * @param {string} id 要素のID
 * @param {string} url 読み込むHTMLのURL
 * @param {function} callback 読み込み完了後のコールバック
 */
async function loadComponent(id, url, callback) {
    const element = document.getElementById(id);
    if (!element) return;

    try {
        const response = await fetch(url);
        if (response.ok) {
            const html = await response.text();
            element.innerHTML = html;
            if (callback) callback();
        } else {
            console.error(`Failed to load component: ${url}`);
        }
    } catch (error) {
        console.error(`Error loading component: ${url}`, error);
    }
}

/**
 * ナビゲーションのアクティブ状態を設定する
 */
function setupNavigation() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const navType = link.getAttribute('data-nav');
        let isActive = false;

        if (navType === 'profile' && (currentPath === '/' || currentPath === '/index.html')) {
            isActive = true;
        } else if (navType === 'hobbies' && currentPath.includes('hobbies')) {
            isActive = true;
        } else if (navType === 'blog' && currentPath.includes('blog')) {
            isActive = true;
        }

        if (isActive) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}
