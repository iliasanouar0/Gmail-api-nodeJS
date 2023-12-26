
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
        root.innerHTML = `
        <div class="container m-5">
        <div class="row">
        <div class="col">
        <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">list</th>
            <th scope="col">count</th>
            <th scope="col">action</th>
          </tr>
        </thead>
        <tbody id="listData">
        </tbody>
      </table>
        </div>
        </div>
        </div>
       `
        let listData = document.getElementById('listData')
        let i = 0
        let row = ''
        data.forEach(e => {
            console.log(e);
            i++
            row += `<tr>
            <th scope="row">${i}</th>
            <td>${e.list}</td>
            <td>${e.data.length}</td>
            <td><button class="btn btn-success see" data-list="${e.list}">See</button></td>
            </tr>`
            listData.innerHTML = row
        });
    })
    $(document).on('click', '.see', e => {
        let list = $(e.target).data('list')
        console.log(list);
        fetch(`http://localhost:8000/lists/${list}`, { method: "GET" }).then(res => {
            return res.json()
        }).then(data => {
            root.innerHTML = `
            <div class="container m-5">
            <div class="row">
            <div class="col">
            <table class="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">list</th>
                <th scope="col">count</th>
                <th scope="col">action</th>
              </tr>
            </thead>
            <tbody id="listData">
            </tbody>
          </table>
            </div>
            </div>
            </div>
           `
            let listData = document.getElementById('listData')
            let i = 0
            let row = ''
            data.forEach(e => {
                console.log(e);
                i++
                row += `<tr>
                <th scope="row">${i}</th>
                <td>${e.list}</td>
                <td>${e.data.length}</td>
                <td><button class="btn btn-success see" data-list="${e.list}">See</button></td>
                </tr>`
                listData.innerHTML = row
            });
        })
    })
})
