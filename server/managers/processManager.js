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

const updateProcess = (name, data) => {
    let path = `./process/${name}`
    fs.writeFile(path, `${[JSON.stringify(data)]}`, function (err, data) {
        if (err) {
            throw err
        }
    });
}

const getAllProcessSeeds = (data) => {
    let list = data
    let path = `./data/${list}`
    const result = JSON.parse(fs.readFileSync(path, 'utf8'));
    return result
}

const processing = async (action, data) => {
    switch (action) {
        // case 'send':
        //     await process.verify(seed, entity, mode).then(e => {
        //         result = e
        //     })
        //     return result
        case "authorize":
            await process.getRefreshToken(data).then(e => {
                result = e
            })
            return result
        default:
            console.log('unknown action');
            break;
    }
}

module.exports = {
    getData,
    addProcess,
    updateProcess,
    getAllProcessSeeds
    // startProcess
}