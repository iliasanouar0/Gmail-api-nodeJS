
const root = document.getElementById('root')
const list = document.querySelector('.list')
let REDIRECT_URI = location.href.split('/')[location.href.split('/').length - 1]
switch (REDIRECT_URI) {
    case '':
        fetch("http://localhost:8000/", { method: "GET" }).then(res => {
            return res.json()
        }).then(data => {
            root.innerHTML = `
            <div class="container m-5">
            <div class="row">
            <div class="row mb-3">
            <div class="col">
            <button class="btn btn-success" id="add_process">Add process</button>
            </div>
            </div>
            <div class="col">
            <table class="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">process</th>
                <th scope="col">list</th>
                <th scope="col">count</th>
                <th scope="col">action</th>
                <th scope="col">status</th>
                <th scope="col">details</th>
              </tr>
            </thead>
            <tbody id="processData">
            </tbody>
          </table>
            </div>
            </div>
            </div>
           `
            if (data.length == 0) {
                $('#processData').html(`<tr class="odd"><td colspan="15" class="text-center">No data available in table</td></tr>`)
            } else {
                let i = 0
                let row = ''
                data.forEach(e => {
                    console.log(e);
                    i++
                    row += `<tr>
                    <th scope="row">${i}</th>
                    <td>${e.list}</td>
                    <td>${e.data[0].list}</td>
                    <td>${e.data[0].count}</td>
                    <td>${e.data[0].action}</td>
                    <td>${e.data[0].status}</td>
                    <td>${e.data[0].details}</td>
                    </tr>`
                });
                $('#processData').html(row)
            }
        })
        $(document).on('click', '#add_process', e => {
            console.log('add process');
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
        fetch(`http://localhost:8000/lists/${list}`, { method: "GET" }).then(res => {
            return res.json()
        }).then(data => {
            d = {
                "gmail": "hasithjayanath1994@gmail.com",
                "password": "761578412",
                "proxy": "none",
                "isp": "gmail",
                "verification": "pelinolovenak@outlook.com",
                "REFRESH_TOKEN": null
            }
            let table = `
            <table class="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Gmail</th>
                <th scope="col">Isp</th>
                <th scope="col">verification</th>
              </tr>
            </thead>
            <tbody id="seedData">
            </tbody>
          </table>
           `
            $('#title').html(list)
            $('.modal-body').html(table)
            let seedData = document.getElementById('seedData')
            let i = 0
            let row = ''
            data.forEach(e => {
                i++
                row += `<tr>
                <th scope="row">${i}</th>
                <td>${e.gmail}</td>
                <td>${e.isp}</td>
                <td>${e.verification}</td>
                </tr>`
                seedData.innerHTML = row
            });
            $('#Modal').modal('show')
        })
    })
})
