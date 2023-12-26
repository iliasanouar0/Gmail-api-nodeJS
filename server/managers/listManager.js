const fs = require('fs')


const getData = (request, response) => {
    let path = './data/'
    let objects = []
    let fileObjs = fs.readdirSync(path);
    fileObjs.forEach(file => {
        let filePath = `${path}/${file}`
        const data = fs.readFileSync(filePath,'utf-8');
        objects.push({ list: file, data: data })
    })
    response.status(200).send(objects)
}

module.exports = {
    getData
}