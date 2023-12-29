const fs = require('fs')
const process = require('./processManager/index')


const addProcess = (request, response) => {
    let name = request.params.name
    let data = (request.body)
    console.log(data);
    let path = `./process/${name}.json`
    fs.writeFile(path, `${[JSON.stringify(data)]}`, function (err, data) {
        if (!err) {
            response.status(200).send('Process added successfully')
        } else {
            throw err
        }
    });
}

const getData = (request, response) => {
    let path = './process/'
    let objects = []
    let fileObjs = fs.readdirSync(path);
    fileObjs.forEach(file => {
        let filePath = `${path}/${file}`
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        objects.push({ list: file, data: data })
    })
    response.status(200).send(objects)
}

const startProcess = (request, response) => {
    let path = './process'
    let name = (request.params.name)
    console.log(name);
    // response.send(name)
    let filePath = `${path}/${name}`
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.status = 'RUNNING'
    updateProcess(name, data)
    response.status(200).send({ name: name, data: data })
}


const updateProcess = (name, data) => {
    console.log(data);
    let path = `./process/${name}`
    fs.writeFile(path, `${[JSON.stringify(data)]}`, function (err, data) {
        if (err) {
            throw err
        }
    });
}

// const processing = async (action, data) => {
//     switch (action) {
//         case 'send':
//             await process.verify(seed, entity, mode).then(e => {
//                 result = e
//             })
//             return result
//         case 'send':
//             await process.verify(seed, entity, mode).then(e => {
//                 result = e
//             })
//             return result
//         default:
//             break;
//     }
// }

module.exports = {
    getData,
    addProcess,
    startProcess
}