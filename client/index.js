const root = document.getElementById('root')
const list = document.querySelector('.list')
let REDIRECT_URI = location.href.split('/')[location.href.split('/').length - 1]
console.log(REDIRECT_URI);
switch (REDIRECT_URI) {
    case '':
        fetch("http://localhost:8000/", { method: "GET" }).then(res => {
            return res.text()
        }).then(data => {
            root.innerHTML = data
        })
        break;
}

list.addEventListener('click', () => {
    fetch("http://localhost:8000/lists", { method: "GET" }).then(res => {
        return res.json()
    }).then(data => {
        console.log(data);
        root.innerHTML = data
    })
})