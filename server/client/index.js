const root = document.getElementById('root')
let REDIRECT_URI = location.href.split('/')[location.href.split('/').length - 1]
console.log(REDIRECT_URI);
switch (REDIRECT_URI) {
    case '':
        fetch("http://localhost:8000/")
        break;
    default:
        console.log("none");
        break;
}