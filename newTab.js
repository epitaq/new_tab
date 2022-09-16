// storage: {data:[URL list], time:'number'}

console.log('newTab.js');

// 画像の表示
// chrome.storage.local.get('url', function (value) {
//     let url = value.url;
//     console.log(url);
//     if (url == undefined | url == ""){
//         change()
//     } else {
//         document.querySelector("body").style.backgroundImage = `url(${url})`
//     }
// })

// chrome.storage.local.get('data', async function displayImage (value) {
//     let url = value.data;
//     console.log(url);
//     if (url == undefined){
//         await changeSource() // URLの入力
//         displayImage() // 確認
//     } else {
//         document.querySelector("body").style.backgroundImage = `url(${url[0]})`
//     }
//     // document.querySelector("body").style.backgroundImage = `url(${url[0]})`
// })

displayImage()
function displayImage(){
    chrome.storage.local.get('data', function (value) {
        let url = value.data;
        console.log(url);
        if (url == undefined){
            changeSource() // URLの入力
        } else {
            document.querySelector("body").style.backgroundImage = `url(${url[0]})`
        }
        // document.querySelector("body").style.backgroundImage = `url(${url[0]})`
    })
}


// 画像URLの変更
document.querySelector("#change").addEventListener('click', changeSource)
// function change(){
//     url = prompt('画像のURLを入力')
//     if (url == ''){ // URLがからだったら
//         url = 'subtle-prism.svg'
//     }
//     if (url.indexOf('http')) { // httpが入ってなかったら
//         url = chrome.runtime.getURL('image/'+ url)
//     }
//     console.log(url);
//     chrome.storage.local.set({'url': url})
//     document.querySelector("body").style.backgroundImage = `url(${url})`
// }
async function changeSource(){
    let url = prompt('画像のURLを入力')
    // Google Drive、画像単体、デフォルト、を想定
    if (url.includes('https://drive.google.com/')){
        // Driveの時
        console.log('Drive');
        let folderId = url.split('/')[7]
        await getDataFromGAS(folderId) //GAS + add Data
    } else if (url.includes('http')){
        // 単体の画像の時
        console.log('only');
        chrome.storage.local.set({data: [url]})
    } else if (url.includes('.')){
        url = chrome.runtime.getURL('image/' + url)
        chrome.storage.local.set({data: [url]})
    } else {
        // その他の時
        console.log('else');
        url = chrome.runtime.getURL('image/subtle-prism.svg')
        chrome.storage.local.set({data: [url]})
    }
    displayImage()
}
// GASからGフォルダのURLを取得
// https://script.google.com/macros/s/AKfycbxvHG-rzvNimBoqBy3ZMy7M2op6FTrcr6mWDccOy4m1JdHxqCZ2BfQNiIcTi3GiosTZ/exec
function getDataFromGAS (id){
    const GAS = 'https://script.google.com/macros/s/AKfycbxvHG-rzvNimBoqBy3ZMy7M2op6FTrcr6mWDccOy4m1JdHxqCZ2BfQNiIcTi3GiosTZ/exec'
    fetch (GAS + '?id=' + id, {
        mode:'cors',
        headers:{
            'Content-Type':'text/plain'
        }
    })
    .then (response => {
        return response.text()
    })
    .then (data =>{
        data = data.split(',')
        console.log(data)
        chrome.storage.local.set({data: data}); //add data to storage
    })
}

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




// 階層構造の時は下に新たにブックマークバーを開く、クリックにイベントをつける、フォーカスがはずれたら削除
// {url:'url', urlData:['1','2','3']} 変更タイミングも指定
// GASで管理、フォルダを一括選択、タイミングはボタンを押した時