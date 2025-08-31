document.addEventListener('DOMContentLoaded', () => {
    const classifyButton = document.getElementById('classifyButton');
    const textInput = document.getElementById('textInput');
    const categoryList = document.getElementById('categoryList');
    const postGrid = document.getElementById('postGrid');

    const CATEGORIES = {
        'グルメ': ['#グルメ', '#カフェ', '#レストラン', '#レシピ', '#料理', '#スイーツ'],
        '旅行': ['#旅行', '#観光', '#絶景', '#ホテル', '#温泉', '#海外旅行'],
        'ファッション': ['#ファッション', '#コーデ', '#OOTD', '#今日の服', '#購入品'],
        '趣味': ['#趣味', '#ハンドメイド', '#ゲーム', '#読書', '#映画', '#筋トレ'],
        '節約・暮らし': ['#節約', '#節約術', '#便利グッズ', '#収納術', '#暮らしを整える', '#qol向上', '#ふたり暮らし']
    };

    let allPosts = [];

    classifyButton.addEventListener('click', () => {
        const postText = textInput.value.trim();
        if (!postText) {
            alert('テキストを入力してください。');
            return;
        }

        // 1つの投稿として処理
        const newPost = { id: Date.now(), text: postText, categories: [] };
        
        for (const [category, keywords] of Object.entries(CATEGORIES)) {
            if (keywords.some(keyword => postText.includes(keyword))) {
                newPost.categories.push(category);
            }
        }
        if (newPost.categories.length === 0) {
            newPost.categories.push('その他');
        }

        // 投稿をリストの先頭に追加
        allPosts.unshift(newPost);

        // 表示を更新
        renderCategories();
        renderPosts('すべて');

        // 入力欄をクリア
        textInput.value = '';
    });

    function renderCategories() {
        const categories = ['すべて', ...Object.keys(CATEGORIES), 'その他'];
        categoryList.innerHTML = '';
        let activeCategory = document.querySelector('#categoryList .active')?.textContent || 'すべて';

        categories.forEach(category => {
            const count = category === 'すべて'
                ? allPosts.length
                : allPosts.filter(p => p.categories.includes(category)).length;

            if (count > 0) {
                const categoryItem = document.createElement('a');
                categoryItem.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';
                if (category === activeCategory) {
                    categoryItem.classList.add('active');
                }
                categoryItem.textContent = category;
                categoryItem.href = '#';
                
                const badge = document.createElement('span');
                badge.className = 'badge badge-primary badge-pill';
                badge.textContent = count;
                
                categoryItem.appendChild(badge);
                categoryItem.addEventListener('click', (e) => {
                    e.preventDefault();
                    document.querySelectorAll('#categoryList .list-group-item').forEach(item => item.classList.remove('active'));
                    categoryItem.classList.add('active');
                    renderPosts(category);
                });
                categoryList.appendChild(categoryItem);
            }
        });

        if (!document.querySelector('#categoryList .active') && categoryList.firstChild) {
             categoryList.firstChild.classList.add('active');
        }
    }

    function renderPosts(category) {
        postGrid.innerHTML = '';
        const filteredPosts = category === 'すべて'
            ? allPosts
            : allPosts.filter(p => p.categories.includes(category));

        if (filteredPosts.length === 0) {
            postGrid.innerHTML = '<p class="text-muted">このカテゴリの投稿はありません。</p>';
            return;
        }

        filteredPosts.forEach(post => {
            const card = document.createElement('div');
            card.className = 'post-card';
            
            const firstLine = post.text.split('\n')[0].trim();
            const title = firstLine || `投稿 ${post.id}`;
            const categoriesText = post.categories.join(', ');

            card.innerHTML = `
                <h5>${title}</h5>
                <p>${post.text.substring(0, 150)}...</p>
                <small class="text-muted">カテゴリ: ${categoriesText}</small>
            `;
            postGrid.appendChild(card);
        });
    }
});
