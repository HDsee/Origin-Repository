const infoContain= document.querySelector('.info-contain')
const imgShow = infoContain.querySelector('.img-show')
const imgCount= infoContain.querySelector('.img-count')
const book = infoContain.querySelector('.booking-info')
const id = infoContain.querySelector('input[name="id"]')
const price = infoContain.querySelector('#price')
const morning = infoContain.querySelector('input[value="morning"]')
const afternoon = infoContain.querySelector('input[value="afternoon"]')

const info = document.querySelector('.info')
const addressText = info.querySelector('.address')
const transportText = info.querySelector('.transport')

const attractionId = document.URL.split('/').slice(-1);
const apiUrl = '/api/attraction/' + attractionId
const getdata = async () => {
    const result = await fetch(apiUrl)
    const resultdata = await result.json()
    const data = resultdata.data
    //載入圖片
    const imgData = data.images
    imgData.forEach(imgUrl => {
        const img = document.createElement('img')
        const index = document.createElement('div')
        img.src = imgUrl
        imgShow.append(img)
        imgCount.append(index)
    })
    const firstImg = imgShow.querySelector('img')
    const firstIndex = imgCount.querySelector('div')
    firstImg.classList.add('show')
    firstIndex.classList.add('show')

    //景點名稱、類別、捷運站
    const name = document.createElement('h3')
    const category = document.createElement('p')
    name.innerText = data.name
    if(data.mrt !== null){
        category.innerText = `${data.category} at ${data.mrt}`
    }else{
        category.innerText = data.category
    }
    book.insertAdjacentElement('afterbegin', category)
    book.insertAdjacentElement('afterbegin', name)

    //景點介紹、地址、交通方式
    const description = document.createElement('p')
    const address = document.createElement('p')
    const transport = document.createElement('p')
    description.innerText = data.description
    address.innerText = data.address
    transport.innerText = data.transport

    info.insertAdjacentElement('afterbegin', description)
    addressText.append(address)
    transportText.append(transport)
    id.value = data.id
}

//早上金額
morning.addEventListener('click', ()=>{
    price.innerText = 2000

})

//下午金額
afternoon.addEventListener('click', ()=>{
    price.innerText = 2500
})
 
getdata()
    .then(() => {
        //輪播功能
        const imgs = document.querySelectorAll('.img-show img')
        const counts = document.querySelectorAll('.img-count div')
        const preButton = document.querySelector('#pre-button')
        const nextButton = document.querySelector('#next-button')
        const moveTime = 5000
        
        const imgCount = imgs.length //圖片數量
        let currentCount = 0
        let preImg = imgCount - 1 
        let nextImg = currentCount + 1
        
        //找到show顯示圖片
        function findCurrentImg(){
            for(let i = 0; i < imgCount; i++){
                if(imgs[i].className.includes('show')){
                    currentCount = i
                    preImg = ( i===0 ? imgCount-1 : i-1)
                    nextImg = ( i===imgCount-1 ? 0 : i+1)
                }
            }
        }
        
        //換圖片
        function changeImg(index){
            imgs[index].classList.toggle('show')
            counts[index].classList.toggle('show')
            imgs[currentCount].classList.toggle('show')
            counts[currentCount].classList.toggle('show')
            findCurrentImg()
        }
        
        //上一張
        function movePreImg(){
            changeImg(preImg)
        }
        //下一張
        function moveNextImg(){
            changeImg(nextImg)
        }
        //自動輪播
        let autoChangeImg = window.setInterval(moveNextImg, moveTime)
        
        //上一頁
        preButton.addEventListener('click',()=>{
            movePreImg()
            clearInterval(autoChangeImg)
            autoChangeImg = window.setInterval(moveNextImg, moveTime)
        })
        //下一頁
        nextButton.addEventListener('click',()=>{
            moveNextImg()
            clearInterval(autoChangeImg)
            autoChangeImg = window.setInterval(moveNextImg, moveTime)
        })
    })


const bookingForm = book.querySelector('.booking-form')
const bookingDate = bookingForm.querySelector('input[name="date"]')

function bookingStart(e){
    e.preventDefault()

    fetch(userApi)
        .then(res => res.json())
        .then(data => {
            // 有登入
            if(data.data !== null){
                const data = {
                    attractionId : parseInt(attractionId), 
                    date : this.querySelector('input[name="date"]').value,
                    time : this.querySelector('input[name="time"]:checked').value,
                    price : parseInt(this.querySelector('#price').innerText)
                }
                const bookingAPI = '/api/booking'
                fetch(bookingAPI, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if(data.ok === true){
                        window.location.href='/booking'
                    }else{
                        alert(data.message)
                    }
                })
            }else{  // 沒登入
                showSignWindow()
            }
        })
}

bookingForm.addEventListener('submit', bookingStart)