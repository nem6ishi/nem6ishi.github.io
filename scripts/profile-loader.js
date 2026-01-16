/**
 * プロフィールデータを読み込んで表示するスクリプト
 */

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/data/profile.json');
        if (!response.ok) {
            throw new Error(`Failed to load profile data: ${response.status}`);
        }
        const profileData = await response.json();

        // 各セクションをレンダリング
        renderWorkExperience(profileData.workExperience);
        renderEducation(profileData.education);
        renderPublications(profileData.publications);
    } catch (error) {
        console.error('Error loading profile data:', error);
    }
});

/**
 * 職歴セクションをレンダリング
 */
function renderWorkExperience(workExperience) {
    const container = document.getElementById('work-experience-container');
    if (!container) return;

    container.innerHTML = workExperience.map(item => `
        <div class="border border-gray-200 rounded-lg p-4 card-hover bg-white">
            <div class="text-xl font-semibold text-gray-800 mb-2">
                ${item.title}
            </div>
            <span class="inline-block px-3 py-1 ${item.current ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'} text-sm rounded-full">
                ${item.period}
            </span>
        </div>
    `).join('');
}

/**
 * 学歴セクションをレンダリング
 */
function renderEducation(education) {
    const container = document.getElementById('education-container');
    if (!container) return;

    container.innerHTML = education.map(item => `
        <div class="border border-gray-200 rounded-lg p-4 card-hover bg-white">
            <div class="text-xl font-semibold text-gray-800 mb-2">
                ${item.institution}<span class="font-normal text-gray-600 ml-2">, ${item.degree}</span>
            </div>
            <span class="inline-block px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full mb-2">
                ${item.period}
            </span>
            <div class="text-sm text-gray-600">(指導教員: ${item.advisor})</div>
        </div>
    `).join('');
}

/**
 * 論文セクションをレンダリング
 */
function renderPublications(publications) {
    // Refereed論文
    const refereedContainer = document.getElementById('publications-refereed-container');
    if (refereedContainer) {
        refereedContainer.innerHTML = publications.refereed.map(pub => createPublicationCard(pub)).join('');
    }

    // Non-Refereed論文
    const nonRefereedContainer = document.getElementById('publications-non-refereed-container');
    if (nonRefereedContainer) {
        nonRefereedContainer.innerHTML = publications.nonRefereed.map(pub => createPublicationCard(pub)).join('');
    }
}

/**
 * 論文カードのHTMLを生成
 */
function createPublicationCard(publication) {
    const linksHtml = publication.links.length > 0 ? `
        <div class="flex gap-3">
            ${publication.links.map(link => createLinkButton(link)).join('')}
        </div>
    ` : '';

    const acceptanceRateHtml = publication.acceptanceRate ? `
        <p class="text-xs text-gray-400 mb-3">Acceptance rate: ${publication.acceptanceRate}</p>
    ` : '';

    return `
        <div class="card-hover bg-white p-6 rounded-xl border border-gray-200">
            <h4 class="text-lg font-bold text-gray-900 mb-3 leading-tight">
                ${publication.title}
            </h4>
            <p class="text-sm text-gray-600 mb-2">${publication.authors}</p>
            <p class="text-sm text-gray-500 ${linksHtml || acceptanceRateHtml ? 'mb-2' : 'mb-3'}">${publication.venue}</p>
            ${acceptanceRateHtml}
            ${linksHtml}
        </div>
    `;
}

/**
 * リンクボタンのHTMLを生成
 */
function createLinkButton(link) {
    const icons = {
        poster: '<path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/>',
        code: '<path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"/>',
        slide: '<path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/>',
        dataset: '<path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/>',
        document: '<path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"/>'
    };

    const icon = icons[link.type] || icons.document;
    const isExternal = link.url.startsWith('http');
    const colorClass = link.type === 'code' || link.type === 'document'
        ? 'bg-gray-50 text-gray-600 hover:bg-gray-100'
        : 'bg-blue-50 text-blue-600 hover:bg-blue-100';

    // リンクがない場合（まだ公開されていないposterなど）
    if (!link.url) {
        return `
            <span class="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-xs font-medium">
                <svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    ${icon}
                </svg>
                ${link.label}
            </span>
        `;
    }

    return `
        <a href="${link.url}" 
           class="inline-flex items-center px-3 py-1.5 ${colorClass} rounded-lg text-xs font-medium transition-colors"
           ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''}>
            <svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                ${icon}
            </svg>
            ${link.label}
        </a>
    `;
}
