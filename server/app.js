const express = require("express");
const fs = require('fs')
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const wsi = new WebSocket.Server({ port: 7071 })

require("dotenv").config();

const app = express();
const routes = require("./routes");
app.use('/api', routes);
app.use(bodyParser.json())
const listManager = require('./managers/listManager')
const processManager = require('./managers/processManager')
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // disabled for security on local
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.listen(process.env.PORT, () => {
  console.log("listening on port " + process.env.PORT);
});

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

        async function startSeedProcessing(seed) { await resultManager.startNow({ id_seeds: seed.id_seeds, name: data.name }); await resultManager.updateState([{ id_seeds: seed.id_seeds, name: data.name }], "running") }

        async function processSeedActions(seed, option) {
          console.log('Entered processSeedActions : ' + seed.gmail + ` ,at ${new Date().toLocaleString()}`);
          let { action, subject, pages, mode } = extractActions(actions);

          console.log(`Actions: ${action} , ${seed.gmail}`);
          console.log('defined action : ' + seed.gmail + ` ,at ${new Date().toLocaleString()}`);

          let r = '';

          for (let i = 0; i < action.length; i++) {
            console.log(`${action[i]} action start`);
            console.log('starting :' + seed.gmail + ` ,action : ${action[i]} ,at ${new Date().toLocaleString()}`);
            r += await processManager.processing(action[i], seed);

            if (i < action.length - 1) {
              r += ', ';
            }

          }

          r = removeTrailingComma(r);

          // if (r.indexOf('invalid') === -1) {
          //   await handleSuccess(seed);
          // } else {
          //   await handleFailure(seed);
          // }
        }

        function extractActions(seed) {
          let action, subject, pages, c, options, mode;

          if (
            seed.action.indexOf('click') === -1 &&
            seed.action.indexOf('count') === -1 &&
            seed.action.indexOf('pages') === -1 &&
            seed.action.indexOf('subject') === -1 &&
            seed.action.indexOf('option') === -1
          ) {
            action = [seed.action];
          } else {
            action = seed.action.split(',');

            for (let i = 0; i < action.length; i++) {
              switch (true) {
                case action[i].indexOf('option') !== -1:
                  mode = action.pop().split(':')[1];
                  break;
                case action[i].indexOf('markAsStarted') !== -1:
                  action.pop();
                  options.markAsStarted = true;
                  break;
                case action[i].indexOf('click') !== -1:
                  action.pop();
                  options.click = true;
                  break;
                case action[i].indexOf('markAsImportant') !== -1:
                  action.pop();
                  options.markAsImportant = true;
                  break;
                case action[i].indexOf('count') !== -1:
                  c = action.pop().split(':')[1];
                  break;
                case action[i].indexOf('pages') !== -1:
                  pages = parseInt(action.pop().split(':')[1]);
                  break;
                case action[i].indexOf('subject') !== -1:
                  subject = action.pop().split(':')[1];
                  break;
              }
            }
          }

          return { action, subject, pages, c, options, mode };
        }

        function removeTrailingComma(str) { const array = str.split(', '); /*array.pop();*/ return array.join(', '); }

        // async function handleSuccess(seed) {
        //   console.log('success :' + seed.gmail + ` ,at ${new Date().toLocaleString()}`);
        //   success++;

        //   const end_in = new Date();
        //   const result = {
        //     id_seeds: seed.id_seeds,
        //     end_in,
        //     name: data.name,
        //   };

        //   await Promise.all([
        //     resultManager.updateState([{ id_seeds: seed.id_seeds, name: data.name }], "finished"),
        //     resultManager.endNow(result),
        //   ]);
        //   running--
        //   toProcess.shift();
        //   state = await composeManager.getProcessState(data.name);

        //   if (state === "STOPPED" || state === "PAUSED") {
        //     return;
        //   }
        //   console.log(seeds.length);
        //   console.log('active : ' + active);
        //   console.log('toProcess.length : ' + toProcess.length);
        //   console.log('seeds.length : ' + seeds.length);
        //   if (toProcess.length < active && state !== "STOPPED" && state !== "PAUSED" && seeds.length !== 0) {
        //     console.log('The indexed seed: ' + seeds[0].id_seeds);
        //     toProcess.push(seeds[0]);
        //     if (!option.onlyStarted) {
        //       await startSeedProcessing(seeds[0]);
        //       running++
        //     }
        //     seeds.splice(seeds.indexOf(seeds[0]), 1);
        //     count++;
        //     await updateProcessState();
        //   }
        // }

        // async function handleFailure(seed) {
        //   console.log('failed :' + seed.gmail + ` ,at ${new Date().toLocaleString()}`);
        //   failed++;

        //   const end_in = new Date();
        //   const result = {
        //     id_seeds: seed.id_seeds,
        //     end_in,
        //     name: data.name,
        //   };

        //   await Promise.all([
        //     resultManager.updateState([{ id_seeds: seed.id_seeds, name: data.name }], "failed"),
        //     resultManager.endNow(result),
        //   ]);
        //   running--

        //   toProcess.shift();
        //   state = await composeManager.getProcessState(data.name);

        //   if (state === "STOPPED" || state === "PAUSED") {
        //     return;
        //   }
        //   console.log('active : ' + active);
        //   console.log('toProcess.length : ' + toProcess.length);
        //   console.log('seeds.length : ' + seeds.length);
        //   if (toProcess.length < active && count < length && state !== "STOPPED" && state !== "PAUSED" && seeds.length !== 0) {
        //     console.log('The indexed seed: ' + seeds[0].id_seeds);
        //     toProcess.push(seeds[0]);
        //     if (!option.onlyStarted) {
        //       await startSeedProcessing(seeds[0]);
        //       running++
        //     }
        //     seeds.splice(seeds.indexOf(seeds[0]), 1);
        //     count++;
        //     await updateProcessState();
        //   }
        // }

        // async function updateProcessState() {
        //   let w = waiting - success - failed
        //   if (w <= 0) {
        //     let status = { waiting: 0, active: running, finished: success, failed, name: data.name };
        //     processStateManager.updateState(status);
        //   } else {
        //     let status = { waiting: w, active: running, finished: success, failed, name: data.name };
        //     processStateManager.updateState(status);
        //   }
        // }

        // async function handleProcessCompletion() {
        //   let w = waiting - success - failed
        //   if (w <= 0) {
        //     let status = { waiting: 0, active: running, finished: success, failed, name: data.name };
        //     processStateManager.updateState(status);
        //   } else {
        //     let status = { waiting: w, active: running, finished: success, failed, name: data.name };
        //     processStateManager.updateState(status);
        //   }

        //   state = await composeManager.getProcessState(data.name);

        //   if (state === "STOPPED" || state === "PAUSED") {
        //     return;
        //   }
        //   if (toProcess.length === 0 && seeds.length === 0 && running === 0) {
        //     let status = { waiting: 0, active: 0, finished: success, failed: failed, name: data.name };
        //     await processStateManager.updateState(status);
        //     composeManager.finishedProcess({ name: data.name, status: `FINISHED` });
        //     console.log(`Process with id: ${data.name} finished at ${new Date().toLocaleString()} `);
        //   }
        // }
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