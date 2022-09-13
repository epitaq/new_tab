console.log('newTab.js');

// 画像の変更
chrome.storage.local.get('url', function (value) {
    let url = value.url;
    console.log(url);
    if (url == undefined | url == ""){
        url = prompt('画像のURLを入力')
        chrome.storage.local.set({'url': url});
    }
    document.querySelector("body").style.backgroundImage = `url(${url})`
});

// ブックマークバーの作成
chrome.bookmarks.getTree(function(roots){
    console.log(roots[0].children[0].children)
    const bookmark = roots[0].children[0].children // ブックマークを取得

    // add list
    const list = document.querySelector("#bookmark")
    for (const data of bookmark){
        // console.log(data)
        let child = document.createElement('li')
        child.innerHTML = `
            <a href="${data.url}" style="max-width: 150px; height: 1rem; display: flex; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">
                <img src="http://www.google.com/s2/favicons?domain=${data.url}" alt="${data.url}" style="width: 1rem; height: 1rem;">
                <div>${data.title}</div>
            </a>
        `
        list.appendChild(child)
}
})

// 画像の変更
document.querySelector("#change").addEventListener('click', change)
function change(){
    url = prompt('画像のURLを入力')
    chrome.storage.local.set({'url': url});
    document.querySelector("body").style.backgroundImage = `url(${url})`
}



// 階層構造の時は下に新たにブックマークバーを開く、クリックにイベントをつける、フォーカスがはずれたら削除
// {url:'url', urlData:['1','2','3']} popで作成管理