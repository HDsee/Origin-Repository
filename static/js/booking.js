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
const errorMs = orderForm.querySelector('.error-messeage')

const trip=[]

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
            trip.push(bookingData)
        }else{
            showNoBooking()
        }
    })
}
getBookingInfo()
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

const tappayID = 123987
const tappayKey = 'app_hWOkT0nb7PgG9I85DVq3eBApzsyxYkf8qRNHjETb5CMa5aE0XieE5s4Xh7QS'


//tappay串接//

TPDirect.setupSDK(tappayID, tappayKey, 'sandbox');
let fields = {
    number: {
        element: '#card-number',
        placeholder: '**** **** **** ****'
    },
    expirationDate: {
        element: '#card-expiration-date',
        placeholder: 'MM / YY'
    },
    ccv: {
        element: '#card-ccv',
        placeholder: 'CVV'
    }
}

TPDirect.card.setup({
    fields: fields,
    styles: {
        'input': {
            'color': 'Gray',
            'font-size': '16px'
        },
        ':focus': {
            'border-color': 'red',
            'color': 'Gray'
        }
    }
})

const payButton = orderForm.querySelector('.pay-button')
const cardNum = document.querySelector('.tpfield-num')
const cardExp = document.querySelector('.tpfield-exp')
const cardCCV = document.querySelector('.tpfield-ccv')

TPDirect.card.onUpdate(function (update) {
    // console.log(update)
    // if prime is true, send the payment form
    if (update.canGetPrime) {
        payButton.removeAttribute('disabled')
    } else {
        payButton.setAttribute('disabled', true)
    }

    // 輸入錯誤=2，正確=0
    if (update.status.number === 2) {
        cardNum.classList.add('invalid')
    } else if (update.status.number === 0) {
        cardNum.classList.add('valid')
    }
    // 輸入錯誤=2，正確=0
    if (update.status.expiry === 2) {
        cardExp.classList.add('invalid')
    } else if (update.status.expiry === 0) {
        cardExp.classList.add('valid')
    }
    // 輸入錯誤=2，正確=0
    if (update.status.ccv === 2) {
        cardCCV.classList.add('invalid')
    } else if (update.status.ccv === 0) {
        cardCCV.classList.add('valid')
    }
})


function orderSend (e) {
    e.preventDefault()
    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()
    console.log(tappayStatus)
    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
        console.log('can not get prime');
        return
    }

    // Get prime
    TPDirect.card.getPrime((result) => {
        // console.log(result)
        if (result.status !== 0) {
            console.log('get prime error ' + result.msg)
            return
        }
        // console.log('get prime 成功，prime: ' + result.card.prime)
        
        let orderData = {
            "prime": result.card.prime,
            "order":{
                "price":trip[0].price,
                "trip":{
                    "attraction":{
                        "id":trip[0].attraction.id,
                        "name":trip[0].attraction.name,
                        "address":trip[0].attraction.address,
                        "image":trip[0].attraction.image
                    },
                    "date":trip[0].date,
                    "time":trip[0].time
                },
                "contact":{
                    "name":this.querySelector('input[name="name"]').value,
                    "email":this.querySelector('input[name="email"]').value,
                    "phone":this.querySelector('input[name="phone"]').value
                }   
            }
        }
        fetch('/api/order', {
            method: "POST",
            body: JSON.stringify(orderData),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(data => {
            let orderNumber = data['data']['number']
            window.location = `/thankyou?number=${orderNumber}`
        })
    })
}
orderForm.addEventListener('submit', orderSend);
