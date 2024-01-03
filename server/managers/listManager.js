const fs = require('fs')


const getData = (request, response) => {
    let path = './data/'
    let objects = []
    let fileObjs = fs.readdirSync(path);
    fileObjs.forEach(file => {
        let filePath = `${path}/${file}`
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        objects.push({ list: file, data: data })
    })
    response.status(200).send(objects)
}

const getDataList = (request, response) => {
    let list = request.params.list
    let path = `./data/${list}`
    const data = JSON.parse(fs.readFileSync(path, 'utf8'));
    response.status(200).send(data)
}


module.exports = {
    getData,
    getDataList,
}