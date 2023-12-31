const wssUri = `ws://localhost:7071/wss`;
const websocket_s = new WebSocket(wssUri);

websocket_s.onmessage = (event) => {
    let data = event.data
    console.log(data);
    switch (data) {
        case 'reload':
            location.reload()
            break
        default:
            console.log(data);
            break;
    }
}








const root = document.getElementById('root')
const list = document.querySelector('.list')
let REDIRECT_URI = location.href.split('/')[location.href.split('/').length - 1]


const addProcess = (data) => {
    var settings = {
        "url": `http://localhost:8000/${data[0].name}`,
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
        "data": JSON.stringify(data[0]),
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
        alert(response)
    });
}


if (REDIRECT_URI == '') {
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
        <div class="col mb-5">
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
            <th scope="col">action</th>
          </tr>
        </thead>
        <tbody id="processData">
        </tbody>
      </table>
        </div>
        </div>
        </div>

        <div class="container m-5">
        <div class="row" id="result">
         
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
                console.log(e.data);
                i++
                row += `<tr>
                <th scope="row">${i}</th>
                <td>${e.list}</td>
                <td>${e.data.list}</td>
                <td>${e.data.count}</td>
                <td>${e.data.action}</td>
                <td>${e.data.status}</td>
                <td>${e.data.details}</td>`
                console.log(e.data.status);
                if (e.data.status == 'RUNNING') {
                    row += `<td><button class="btn btn-secondary start" id="${e.list}" data-p="${e.list}" disabled>---</button>`
                } else if (e.data.action.includes('send')) {
                    row += `<td><button class="btn btn-secondary send" id="${e.list}" data-p="${e.list}">Send</button>`
                } else {
                    row += `<td><button class="btn btn-secondary start" id="${e.list}" data-p="${e.list}">Start</button>`
                }
                row += `<button class="btn btn-primary show" id="${e.list}" data-p="${e.list}">Show</button></td></tr>`
            });
            $('#processData').html(row)
        }
    })

    $(document).on('click', '#add_process', e => {
        console.log('add process');
        let form = `<div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input type="email" class="form-control" id="name">
      </div>
      
      <div class="mb-3">
      <label for="add_lists" class="form-label">Select  list</label>
      <select class="form-select" id="add_lists"></select>
    </div>

    <div class="mb-3 actions">
    <input type="radio" class="btn-check" name="options" id="Authorize" autocomplete="off" value="authorize">
    <label class="btn btn-outline-success" for="Authorize">Authorize</label>

    <input type="radio" class="btn-check" name="options" id="Send" autocomplete="off" value="send">
    <label class="btn btn-outline-danger" for="Send">Send</label>

    <input type="radio" class="btn-check" name="options" id="Verify" autocomplete="off" value="Verify">
    <label class="btn btn-outline-secondary" for="Verify">Verify</label>
    </div>

    <div class="row d-none sendmail">
    <div class="col">

    <div class="mb-3">
    <div class="row">
    
    <div class="col">
    <label for="to" class="form-label">Send to</label>
    <input type="text" class="form-control" id="to" placeholder="@email">
    </div>

    <div class="col">
    <label for="bcc" class="form-label">Bcc</label>
    <input type="text" class="form-control" id="bcc" placeholder="email1,email2...">
    </div>
    
    </div>
  </div>

  <div class="mb-3">
  <label for="subject" class="form-label">Subject</label>
  <input type="text" class="form-control" id="subject">
</div>

    <div class="mb-3">
    <label for="text" class="form-label">Text (message)</label>
    <textarea class="form-control" id="text" rows="3"></textarea>
    </div>
    </div>
    </div>`



        fetch("http://localhost:8000/lists", { method: "GET" }).then(res => {
            return res.json()
        }).then(data => {
            let options = '<option selected>Select list</option>'
            data.forEach(e => {
                options += `<option value="${e.list}" data-count="${e.data.length}">${e.list}</option>`
            });
            $("#add_lists").html(options)
        })
        $(document).on('change', '#Send', event => {
            let status = $(event.target).is(":checked") ? true : false;
            if (status) {
                $('.sendmail').removeClass('d-none');
            } else {
                $('.sendmail').addClass('d-none');
            }
        })
        $(document).on('change', '#Authorize', event => {
            let status = $(event.target).is(":checked") ? true : false;
            if (status) {
                $('.send').addClass('d-none');
            } else {
                $('.send').removeClass('d-none');
            }
        })
        $('#title').html('Add process')
        $(".save").removeClass('d-none')
        $('.modal-body').html(form)
        $('#Modal').modal('show')
    })

    $(document).on('click', '.save', () => {
        console.log('save process');
        let to
        let bcc
        let subject
        let text
        let name = $('#name').val()
        let list = $('#add_lists').val()
        let count = $('#add_lists option:selected').data('count')
        console.log(count);
        let selected = $('.actions input:checked')

        if (list == 'Select list' || selected.length == 0 || name == '') {
            alert('all fields requirer')
            return
        }

        let action = selected[0].value
        console.log(action);
        switch (action) {
            case 'send':
                to = $('#to').val()
                bcc = $('#bcc').val()
                subject = $('#subject').val()
                text = $('#text').val()

                if (to == '' || subject == '' || text == '') {
                    alert('all fields requirer')
                    return
                }
                action += `;to:${to};bcc:${bcc};subject:${subject}`
                let send =
                    [
                        {
                            "name": `${name}`,
                            "list": `${list}`,
                            "count": `${count}`,
                            "action": `${action}`,
                            "text": `${text}`,
                            "status": `idle`,
                            "details": `none`
                        }
                    ]
                addProcess(send)
                break;
            case 'authorize':
                let authorize =
                    [
                        {
                            "name": `${name}`,
                            "list": `${list}`,
                            "count": `${count}`,
                            "action": `${action}`,
                            "status": `idle`,
                            "details": `none`
                        }
                    ]
                addProcess(authorize)
                break;
            case 'Verify':
                let Verify =
                    [
                        {
                            "name": `${name}`,
                            "list": `${list}`,
                            "count": `${count}`,
                            "action": `${action}`,
                            "status": `idle`,
                            "details": `none`
                        }
                    ]
                addProcess(Verify)
                break;

            default:
                break;
        }
    })

    $(document).on('click', '.start', e => {
        let p = $(e.target).data('p')


        let socketState = websocket_s.readyState
        if (socketState !== websocket_s.CLOSED) {
            websocket_s.send(JSON.stringify({ request: "start", name: p }))
        }

        // console.log(p);
        // var settings = {
        //     "url": `http://localhost:8000/p/${p}`,
        //     "method": "POST",
        //     "timeout": 0,
        //     "headers": {
        //         "Content-Type": "application/json"
        //     },
        //     "data": JSON.stringify({ process: p }),
        // };

        // $.ajax(settings).done(function (response) {
        //     console.log(response);
        //     if (response == 'reload') {
        //         location.reload()
        //     }
        // });
    })

    $(document).on('click', '.send', e => {
        let p = $(e.target).data('p')
        $(e.target).html('<div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Loading...</span></div>')
        console.log(p);
        var settings = {
            url: `http://localhost:8000/api/mail/send/${p}`,
            method: "GET",
            timeout: 0,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers":
                    "Origin, X-Requested-With, Content-Type, Accept, Z-Key",
                "Access-Control-Allow-Methods": "GET, HEAD, POST, PUT, DELETE, OPTIONS",
            },
        };

        $.ajax(settings).done(function (response) {
            $(e.target).html('Send')
            console.log(response);
            console.log($("#result"));
            let r = ''
            for (let i = 0; i < response; i++) {
                r += `<p>${response[i]}</p>`
                console.log(r);
                $("#result").html(r)
            }
        });

    })
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
                <th scope="col">Proxy</th>
                <th scope="col">Verification</th>
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
                <td>${e.proxy}</td>
                <td>${e.verification}</td>
                </tr>`
                seedData.innerHTML = row
            });
            $(".save").addClass('d-none')
            $('#Modal').modal('show')
        })
    })
})
