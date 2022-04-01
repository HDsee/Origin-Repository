const signBtn = document.querySelector('#sign-btn')/*註冊登入按鈕*/
const signoutBtn = document.querySelector('#signout-btn')/*登出按鈕*/
const closeBtn = document.querySelectorAll('.close-btn')/*註冊登入視窗取消按鈕*/
const signWindow = document.querySelector('.sign-window')/*註冊登入視窗*/
const signContainer = document.querySelectorAll('.sign-container')/*註冊登入內容*/
const changeSignBtn = document.querySelectorAll('.change-sign')/*切換註冊登入視窗按鈕*/

//顯示註冊登入視窗
function showSignWindow(){
    signWindow.classList.add('show')
}

//關閉註冊登入視窗
function CloseSignWindow(){
    signWindow.classList.remove('show')
}

signBtn.addEventListener('click', showSignWindow)

closeBtn.forEach(close => {
    close.addEventListener('click',CloseSignWindow)
})

//切換註冊登入視窗
function changeSignWindow(){
    signContainer.forEach(container=>{
        container.classList.toggle('show')
    })
}

changeSignBtn.forEach(change => {
    change.addEventListener('click',changeSignWindow)
})

//註冊登入
const signinForm = document.querySelector('#signin')
const signupForm = document.querySelector('#signup')
const userApi = '/api/user'

//註冊功能
function signup(e){
    e.preventDefault()
    const data = {
        name : this.querySelector('input[name="name"]').value,
        email : this.querySelector('input[name="email"]').value,
        password : this.querySelector('input[name="password"]').value 
    }
    fetch(userApi, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
    })
    .then(res => res.json())
    .then(data => {
        const message = this.querySelector('.message')
        if(data.ok){
            message.innerText = '註冊成功'
        }else{
            message.innerText = data.message
        }
    })
}


//登入功能
function signin(e){
    e.preventDefault()
    const data = {
        email : this.querySelector('input[name="email"]').value,
        password : this.querySelector('input[name="password"]').value 
    }
    fetch(userApi, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
    })
    .then(res => res.json())
    .then(data => {
        //登入成功顯示登出按鈕
        if(data.ok === true){
            CloseSignWindow()
            userCheck()
            if(signBtn.classList.contains('show')){
                signBtn.classList.remove('show')
                signoutBtn.classList.add('show')
                history.go(0)
            }
        }else{
            const message = this.querySelector('.message')
            message.innerText = data.message
        }
    })
}

signupForm.addEventListener('submit', signup)
signinForm.addEventListener('submit', signin)


//登出
function signout(){
    fetch(userApi, {
        method: 'DELETE'
    })
    .then(() => {
        history.go(0)
    })

}
signoutBtn.addEventListener('click', signout)

//檢查有沒有登入
function userCheck(){
    fetch(userApi)
        .then(res => res.json())
        .then(data => {
            if(data.data){
                signBtn.classList.remove('show')
                signoutBtn.classList.add('show')
            }else{
                signBtn.classList.add('show')
                signoutBtn.classList.remove('show')
            }
        })
}
userCheck()

const bookingPageBtn = document.querySelector('#book')

function bookingPage(e){
    e.preventDefault()

    fetch(userApi)
        .then(res => res.json())
        .then(data => {
            // 有登入
            if(data.data !== null){
                window.location.href='/booking';
            }else{  // 沒登入
                showSignWindow()
            }
        })
}

bookingPageBtn.addEventListener('click', bookingPage)
