const bookingApi = '/api/booking'
const orderApi = '/api/order'
const headLine = document.querySelector('.headline')
const orderNumber = document.querySelector('.order-number')



function getThankYou(){
    fetch('/api/user')
    .then(res => res.json())
    .then(data => {
        queryString = window.location.search
        number  = queryString.split('=')
        if(data.data != null){
            headLine.innerText = `您好，${data.data.user}，您已成功完成預定：`
            orderNumber.innerText = `請記住訂單編號「${number[1]}」，以便查詢相關資訊，謝謝！`
        }else{
            window.location.href='/'
        }
    })
}

getThankYou()

