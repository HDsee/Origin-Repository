const bookingApi = '/api/booking'
const orderApi = '/api/order'
const headLine = document.querySelector('.headline')
const orderForm = document.querySelector('.order')
const main = document.querySelector('main')
const bookingAlldata = document.querySelector('.booking-alldata')
const noBooking = document.querySelector('.nobooking')
const footer = document.querySelector('footer')


function getUser(){
    fetch('/api/user')
    .then(res => res.json())
    .then(data => {
        if(data.data != null){
            headLine.innerText = `您好，${data.data.user}，待預定的行程如下：`
            getBookingInfo()
        }else{
            window.location.href='/'
        }
    })
}

getUser()

const bookingContainer = document.querySelector('.booking-container')
const dataShow = document.querySelector('.data')
const imgBase = bookingContainer.querySelector('.img-base')
const bookingAttraction = bookingContainer.querySelector('.booking-attraction')
const bookingDate = bookingContainer.querySelector('.booking-date')
const bookingTime = bookingContainer.querySelector('.booking-time')
const bookingPrice = bookingContainer.querySelector('.booking-price')
const bookingAddress = bookingContainer.querySelector('.booking-address')
const totalPrice = orderForm.querySelector('.total-price')


function getBookingInfo(){
    fetch(bookingApi)
    .then(res => res.json())
    .then(data => {
        if(data.data != null){
            const bookingData = data.data
            const imageData = bookingData.attraction.image
            const img = document.createElement('img')
            img.src = imageData
            imgBase.append(img)
            bookingAttraction.innerText = `台北一日遊：${bookingData.attraction.name}`
            bookingDate.innerText = `${bookingData.date}`
            bookingTime.innerText = (bookingData.time == 'morning')? '早上 9 點到下午 4 點': '下午 2 點到晚上 9 點'
            bookingPrice.innerText = (bookingData.price == '2000')? '新台幣 2000 元': '新台幣 2500 元'
            bookingAddress.innerText = `${bookingData.attraction.address}`
            totalPrice.innerText = `${bookingData.price}`
        }else{
            showNoBooking()
        }
    })
}

const deleteBtn =document.querySelector('#delete-button')

function deleteBooking(){
    fetch(bookingApi, {
        method: 'DELETE'
    })
    .then(() => {
        showNoBooking()
    })

}

deleteBtn.addEventListener('click', deleteBooking)


function showNoBooking(){
    bookingAlldata.classList.remove('booking-show')
    noBooking.classList.add('booking-show')
    main.style.minHeight = "150px"
    footer.style.height = "100%"
    footer.style.paddingBottom = "calc(100% -150px );"
}

