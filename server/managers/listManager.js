const fs = require('fs')


const getData = (request, response) => {
    let path = './data/'
    let objects = []
    let fileObjs = fs.readdirSync(path);
    fileObjs.forEach(file => {
        let filePath = `${path}/${file}`
        const data = fs.readFile(filePath, (e, d) => {
            if (e) {
                throw e
            }
            return d
        });

        objects.push({ list: file, data: data })
    })
    response.status(200).send(objects)
}

module.exports = {
    getData
}