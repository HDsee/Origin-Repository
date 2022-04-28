const findkeyword = document.querySelector('.slogan form') //keyword送出submit
const main = document.querySelector('main') //main包整個景點資料
const footer = document.querySelector('footer')//最下面那行

let page = 0
let keyword = ''
let isFetching = false

//撈景點資料
const getdata = async () => {
    isFetching = true

    if(page===null) return
    let url = ''
    if(keyword === ''){
        url = `/api/attractions?page=${page}`
    }else{
        url = `/api/attractions?page=${page}&keyword=${keyword}`
    }
    const result = await fetch(url)
    const data = await result.json()
    // 圖片資料區
    if(data["data"]){
        const attractions = data.data
        for(let data of attractions){
            // 第一層整個資料
            const imgLocation = document.createElement('div')
            imgLocation.classList.add('img-location')
            // 包圖片跟名稱，點圖片可以到景點頁面
            const imgBase = document.createElement('a')
            imgBase.href = `/attraction/${data.id}`
            imgBase.classList.add('img-base')
            // 圖片
            const imgSelf = document.createElement('img')
            imgSelf.src = data.images[0]
            // 圖片名稱
            const imgName = document.createElement('div')
            imgName.classList.add('img-name')
            imgName.title = data.name
            imgName.innerText = data.name
            // 包景點資訊
            const info = document.createElement('div')
            info.classList.add('img-info')
            // 捷運站
            const mrt = document.createElement('p')
            mrt.innerText = data.mrt
            // 景點類別
            const category = document.createElement('p')
            category.innerText = data.category
            
            info.append(mrt, category)
            imgBase.append(imgSelf)
            imgLocation.append(imgBase, imgName, info)
            main.append(imgLocation)
        }
    }
    page = data['nextPage']
    //main是空的就是找不到
    if(main.innerHTML === ''){
        const notFind = document.createElement('h3')
        notFind.innerText = `找不到「${keyword}」唷:)`
        notFind.style.color = '#666666'
        main.append(notFind)
    }
    isFetching = false
}

getdata()

//進行keyword搜尋
function find(e){
    e.preventDefault()
    keyword = this.querySelector('input').value
    page = 0
    //清空main裡面的資料，再撈一次，撈不到的時候回傳errorMessage
    main.innerHTML = ''
    getdata()
        .catch(()=>{
            const errorMessage = document.createElement('h3')
            errorMessage.innerText = data['message']
            errorMessage.style.color = '#666666'
            main.append(errorMessage)
        })
}

//讀取下一頁
function nextPage(){
    if(isFetching){
        return //如果正在載入就跳出
    }
    const windowBottom = this.pageYOffset + this.innerHeight
    if(windowBottom > footer.offsetTop-300){
	    getdata()
    }
}

// 延遲讀取1秒
const debounce = (func, wait=100) => {
    let timeout
    return function executedFunction() {
        const later = () => {
            clearTimeout(timeout)
            func()
        }
        clearTimeout(timeout);
        timeout = setTimeout(later, wait)
    }
}

// 1秒後載入下一頁 
window.addEventListener('scroll', debounce(nextPage))

// 進行keword搜尋
findkeyword.addEventListener('submit', find)

function getWeather(){
    fetch(
        'https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-14226582-4648-4042-A2AC-0DF48923499D'
      )
        .then((response) => response.json())
        .then((data) => console.log('data', data));
}

getWeather()