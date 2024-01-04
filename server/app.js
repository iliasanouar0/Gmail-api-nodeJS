const express = require("express");
const fs = require('fs')
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const wsi = new WebSocket.Server({ port: 7071 })
const cors = require("cors");


require("dotenv").config();

const app = express();

app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

const routes = require("./routes");
app.use('/api', routes);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
const listManager = require('./managers/listManager')
const processManager = require('./managers/processManager')





const sendToAll = (c, m) => {
  c.forEach(client => {
    client.send(m)
  });
}
let clients = []
wsi.on('connection', (wss, req) => {

  clients.push(wss)
  console.log(clients.length);
  console.log('connected!')

  let request = ""
  wss.on('close', () => {
    console.log('disconnected!');
  })

  wss.on('message', async (message) => {

    let data = JSON.parse(message.toString())
    request = data.request

    if (request == 'start') {
      let path = './process'
      let name = (data.name)
      let filePath = `${path}/${name}`
      const dataProcess = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      dataProcess.status = 'RUNNING'
      processManager.updateProcess(name, dataProcess)
      console.log(dataProcess);
      console.log('test');
      console.log(data);
      // sendToAll(clients,'reload')
      let Origins = await processManager.getAllProcessSeeds(dataProcess.list)
      console.log(Origins);
      let seeds = [...Origins]
      let results = []
      let actions = dataProcess.action
        , subject
        , to
        , limit
        , methods = { fixedLimit: false }
        , test = { sendWithAll: false }

      console.log(methods);
      console.log(test);

      if (actions.indexOf('subject') == -1 && actions.indexOf('to') == -1 && actions.indexOf('limit') == -1 && actions.indexOf('Fixed') == -1 && actions.indexOf('all') == -1) {
        actions = [actions]
      } else {
        actions = actions.split(',')
        let length = actions.length
        for (let i = 0; i < length; i++) {
          switch (actions[length - (i + 1)].split(':')[0]) {
            case 'Fixed':
              actions.pop()
              methods.fixedLimit = true
              break;
            case 'all':
              actions.pop()
              test.sendWithAll = true
              break;
            case 'limit':
              limit = actions.pop().split(':')[1]
              break;
            case 'to':
              to = actions.pop().split(':')[1]
              break;
            case 'subject':
              subject = actions.pop().split(':')[1]
              break;
            default:
              break;
          }
        }
      }
      console.log(actions);
      console.log('seeds.length : ' + seeds.length);
      let active
      console.log('MAX_RUNNING : ' + process.env.MAX_RUNNING);
      let waiting = seeds.length - process.env.MAX_RUNNING

      if (seeds.length >= process.env.MAX_RUNNING) {
        active = process.env.MAX_RUNNING
      } else {
        active = seeds.length
        waiting = 0
      }

      let success = 0
      let running = 0
      let failed = 0
      let count = 0
      let length = seeds.length
      let toProcess = []
      for (let i = 0; i < active; i++) {
        toProcess[i] = []
        for (let j = 0; j < active; j++) {
          if (seeds[0] == undefined) {
            break
          }
          toProcess[i].push(seeds[0])
          seeds.shift()
          count++
        }
        console.log(Origins.length / active < process.env.MAX_RUNNING);
        if (Origins.length / active < process.env.MAX_RUNNING) {
          break
        }
      }
      console.log(toProcess);

      // ~ process !1k
      const processV = async (toProcess, start, option) => {
        console.log('Entered Process V :' + toProcess[0].gmail + ` ,at ${new Date().toLocaleString()}`);
        console.log(`Id process : ${data.name}, data : ${toProcess[0].gmail}`);
        console.log(toProcess.length + ' ' + toProcess[0].gmail);
        while (toProcess.length !== 0) {
          console.log('Entered while loop :' + toProcess[0].gmail + ` ,at ${new Date().toLocaleString()}`);
          for (let i = 0; i < toProcess.length; i++) {
            console.log('Entered for loop :' + toProcess[0].gmail + ` ,at ${new Date().toLocaleString()}`);
            let seed = toProcess[0];
            console.log('defined as seed :' + seed.gmail + ` ,at ${new Date().toLocaleString()}`);
            if (option.onlyStarted) {
              await startSeedProcessing(seed);
              console.log('set as running : ' + seed.gmail + ` ,At ${new Date().toLocaleString()}`);
              running++
            }
            console.log('processing :' + seed.gmail + ` ,at ${new Date().toLocaleString()}`);
            console.log('running :' + running);
            await processSeedActions(seed, option);
          }
        }

        await handleProcessCompletion();

        async function processSeedActions(seed, option) {
          console.log('Entered processSeedActions : ' + seed.gmail + ` ,at ${new Date().toLocaleString()}`);

          console.log(`Actions: ${actions} , ${seed.gmail}`);
          console.log('defined action : ' + seed.gmail + ` ,at ${new Date().toLocaleString()}`);

          let r = '';

          for (let i = 0; i < actions.length; i++) {
            console.log(`${actions[i]} action start`);
            console.log('starting :' + seed.gmail + ` ,action : ${actions[i]} ,at ${new Date().toLocaleString()}`);
            r += await processManager.processing(actions[i], seed);

            if (i < actions.length - 1) {
              r += ', ';
            }

          }
          r = JSON.parse(r)
          if (r.REFRESH_TOKEN != 'invalid') {
            await handleSuccess(seed, r);
          } else {
            await handleFailure(seed);
          }
        }

        function removeTrailingComma(str) { const array = str.split(', '); /*array.pop();*/ return array.join(', '); }

        async function handleSuccess(seed, r) {
          console.log('handling as success');
          console.log(r);
          results.push(r)
          console.log('success :' + seed.gmail + ` ,at ${new Date().toLocaleString()}`);
          success++;
          toProcess.shift();
          console.log(seeds.length);
          console.log('active : ' + active);
          console.log('toProcess.length : ' + toProcess.length);
          console.log('seeds.length : ' + seeds.length);
          if (toProcess.length < active && seeds.length !== 0) {
            console.log('The indexed seed: ' + seeds[0].id_seeds);
            toProcess.push(seeds[0]);
            seeds.splice(seeds.indexOf(seeds[0]), 1);
            count++;
          }
        }

        async function handleFailure(seed) {
          console.log('failed :' + seed.gmail + ` ,at ${new Date().toLocaleString()}`);
          failed++;
          results.push(r)
          running--

          toProcess.shift();
          console.log('active : ' + active);
          console.log('toProcess.length : ' + toProcess.length);
          console.log('seeds.length : ' + seeds.length);
          if (toProcess.length < active && count < length && seeds.length !== 0) {
            console.log('The indexed seed: ' + seeds[0].id_seeds);
            toProcess.push(seeds[0]);
            seeds.splice(seeds.indexOf(seeds[0]), 1);
            count++;
          }
        }

        async function handleProcessCompletion() {
          if (toProcess.length === 0 && seeds.length === 0) {
            let status = { waiting: 0, active: 0, finished: success, failed: failed, name: data.name };
            dataProcess.status = 'FINISHED'
            processManager.updateProcess(name, dataProcess)
            processManager.saveList(results, dataProcess.list)
            console.log(`Process with id: ${data.name} finished at ${new Date().toLocaleString()} `);
          }
        }
      };

      async function repeat(array, number, start, check, action) {
        console.log("repeat action : " + action);
        if (check) {
          for (let i = 0; i < array[start].length; i++) {
            processV([array[start][i]], start, { onlyStarted: false })
          }
        } else {
          console.log('The entered array :')
          console.log(array[start]);
          processV(array[start], start, { onlyStarted: true })
          if (number - 1 > start) await repeat(array, number, start + 1, check, action);
        }
      }

      console.log('Origins.length : ' + Origins.length);
      console.log('toProcess.length : ' + toProcess.length);
      console.log("actions[0] : " + actions[0]);
      let check = { startingIndexed: Origins.length / active < process.env.MAX_RUNNING ? true : false }
      await repeat(toProcess, toProcess.length, 0, check.startingIndexed, actions[0])
      let status = { waiting: waiting, active: active, finished: 0, failed: 0, name: data.name }
      console.log(status)














    }





  })
})

app.get("/", processManager.getData);
app.post("/:name", processManager.addProcess);

app.get("/lists", listManager.getData);
app.get("/lists/:list", listManager.getDataList);

app.get('/proxy/', (req, res) => {
  res.status(200).send({ ip: req.ip, remoteAddress: req.socket.remoteAddress })
})


app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log("listening on port " + process.env.PORT);
});