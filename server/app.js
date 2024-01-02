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
      sendToAll(clients,'reload')
      let Origins = await processManager.getAllProcessSeeds(dataProcess.list)
      console.log(Origins);
      // let seeds = [...Origins]
      // let actions = seeds[0].action
      //   , subject
      //   , to
      //   , limit
      //   , methods = { fixedLimit: false }
      //   , test = { sendWithAll: false }
      // if (actions.indexOf('subject') == -1 && actions.indexOf('to') == -1 && actions.indexOf('limit') == -1 && actions.indexOf('Fixed') == -1 && actions.indexOf('all') == -1) {
      //   actions = [actions]
      // } else {
      //   actions = actions.split(',')
      //   let length = actions.length
      //   for (let i = 0; i < length; i++) {
      //     switch (actions[length - (i + 1)].split(':')[0]) {
      //       case 'Fixed':
      //         actions.pop()
      //         methods.fixedLimit = true
      //         break;
      //       case 'all':
      //         actions.pop()
      //         test.sendWithAll = true
      //         break;
      //       case 'limit':
      //         limit = actions.pop().split(':')[1]
      //         break;
      //       case 'to':
      //         to = actions.pop().split(':')[1]
      //         break;
      //       case 'subject':
      //         subject = actions.pop().split(':')[1]
      //         break;
      //       default:
      //         break;
      //     }
      //   }
      // }
      // console.log(actions);
      // console.log('seeds.length : ' + seeds.length);
      // let active
      // console.log('MAX_RUNNING : ' + process.env.MAX_RUNNING);
      // let waiting = seeds.length - process.env.MAX_RUNNING

      // if (seeds.length >= process.env.MAX_RUNNING) {
      //   active = process.env.MAX_RUNNING
      // } else {
      //   active = seeds.length
      //   waiting = 0
      // }

      // let success = 0
      // let running = 0
      // let failed = 0
      // let count = 0
      // let length = seeds.length
      // let toProcess = []
      // let bccToProcess = []
      // for (let i = 0; i < active; i++) {
      //   toProcess[i] = []
      //   for (let j = 0; j < active; j++) {
      //     if (seeds[0] == undefined) {
      //       break
      //     }
      //     toProcess[i].push(seeds[0])
      //     seeds.shift()
      //     count++
      //   }
      //   console.log(Origins.length / active < process.env.MAX_RUNNING);
      //   if (Origins.length / active < process.env.MAX_RUNNING) {
      //     break
      //   }
      // }
      // console.log(bccToProcess);
      // console.log(toProcess);

      // // ~ process !1k
      // const processV = async (toProcess, start, option) => {
      //   console.log('Entered Process V :' + toProcess[0].gmail + ` ,at ${new Date().toLocaleString()}`);
      //   console.log(`Id process : ${data.id_process}, data : ${toProcess[0].gmail}`);
      //   await time(3000)
      //   let state = await composeManager.getProcessState(data.id_process)
      //   console.log(state + ' ' + toProcess[0].gmail);
      //   console.log(toProcess.length + ' ' + toProcess[0].gmail);
      //   await time(3000)
      //   while (toProcess.length !== 0 && state !== "STOPPED" && state !== "PAUSED") {
      //     console.log('Entered while loop :' + toProcess[0].gmail + ` ,at ${new Date().toLocaleString()}`);
      //     state = await composeManager.getProcessState(data.id_process);
      //     if (state === "STOPPED") {
      //       break;
      //     }
      //     for (let i = 0; i < toProcess.length; i++) {
      //       console.log('Entered for loop :' + toProcess[0].gmail + ` ,at ${new Date().toLocaleString()}`);
      //       let seed = toProcess[0];
      //       console.log('defined as seed :' + seed.gmail + ` ,at ${new Date().toLocaleString()}`);
      //       if (option.onlyStarted) {
      //         await startSeedProcessing(seed);
      //         console.log('set as running : ' + seed.gmail + ` ,At ${new Date().toLocaleString()}`);
      //         running++
      //       }
      //       console.log('processing :' + seed.gmail + ` ,at ${new Date().toLocaleString()}`);
      //       console.log('running :' + running);
      //       await updateProcessState();
      //       state = await composeManager.getProcessState(data.id_process);

      //       if (state === "STOPPED" || state === "PAUSED") {
      //         break;
      //       }

      //       await processSeedActions(seed, option);
      //     }

      //     await updateProcessState();
      //   }

      //   await handleProcessCompletion();

      //   async function startSeedProcessing(seed) { await resultManager.startNow({ id_seeds: seed.id_seeds, id_process: data.id_process }); await resultManager.updateState([{ id_seeds: seed.id_seeds, id_process: data.id_process }], "running") }

      //   async function processSeedActions(seed, option) {
      //     console.log('Entered processSeedActions : ' + seed.gmail + ` ,at ${new Date().toLocaleString()}`);
      //     let { actions, subject, pages, c, options, mode } = extractActions(seed);

      //     console.log(`Actions: ${actions} , ${seed.gmail}`);
      //     console.log('defined actions : ' + seed.gmail + ` ,at ${new Date().toLocaleString()}`);

      //     let r = '';

      //     for (let i = 0; i < actions.length; i++) {
      //       console.log(`${actions[i]} action start`);
      //       console.log('starting :' + seed.gmail + ` ,action : ${actions[i]} ,at ${new Date().toLocaleString()}`);
      //       r += await composeManager.processing({
      //         data: toProcess[0],
      //         action: actions[i],
      //         subject,
      //         pages,
      //         count: c,
      //         options,
      //         entity: data.entity,
      //         mode,
      //       });

      //       if (i < actions.length - 1) {
      //         r += ', ';
      //       }
      //     }

      //     r = removeTrailingComma(r);

      //     await resultManager.saveFeedback({ feedback: r, id_seeds: toProcess[0].id_seeds, id_process: data.id_process });

      //     if (r.indexOf('invalid') === -1) {
      //       await handleSuccess(seed);
      //     } else {
      //       await handleFailure(seed);
      //     }
      //   }

      //   function extractActions(seed) {
      //     let actions, subject, pages, c, options, mode;

      //     if (
      //       seed.action.indexOf('click') === -1 &&
      //       seed.action.indexOf('count') === -1 &&
      //       seed.action.indexOf('pages') === -1 &&
      //       seed.action.indexOf('subject') === -1 &&
      //       seed.action.indexOf('option') === -1
      //     ) {
      //       actions = [seed.action];
      //     } else {
      //       actions = seed.action.split(',');

      //       for (let i = 0; i < actions.length; i++) {
      //         switch (true) {
      //           case actions[i].indexOf('option') !== -1:
      //             mode = actions.pop().split(':')[1];
      //             break;
      //           case actions[i].indexOf('markAsStarted') !== -1:
      //             actions.pop();
      //             options.markAsStarted = true;
      //             break;
      //           case actions[i].indexOf('click') !== -1:
      //             actions.pop();
      //             options.click = true;
      //             break;
      //           case actions[i].indexOf('markAsImportant') !== -1:
      //             actions.pop();
      //             options.markAsImportant = true;
      //             break;
      //           case actions[i].indexOf('count') !== -1:
      //             c = actions.pop().split(':')[1];
      //             break;
      //           case actions[i].indexOf('pages') !== -1:
      //             pages = parseInt(actions.pop().split(':')[1]);
      //             break;
      //           case actions[i].indexOf('subject') !== -1:
      //             subject = actions.pop().split(':')[1];
      //             break;
      //         }
      //       }
      //     }

      //     return { actions, subject, pages, c, options, mode };
      //   }

      //   function removeTrailingComma(str) { const array = str.split(', '); /*array.pop();*/ return array.join(', '); }

      //   async function handleSuccess(seed) {
      //     console.log('success :' + seed.gmail + ` ,at ${new Date().toLocaleString()}`);
      //     success++;

      //     const end_in = new Date();
      //     const result = {
      //       id_seeds: seed.id_seeds,
      //       end_in,
      //       id_process: data.id_process,
      //     };

      //     await Promise.all([
      //       resultManager.updateState([{ id_seeds: seed.id_seeds, id_process: data.id_process }], "finished"),
      //       resultManager.endNow(result),
      //     ]);
      //     running--
      //     toProcess.shift();
      //     state = await composeManager.getProcessState(data.id_process);

      //     if (state === "STOPPED" || state === "PAUSED") {
      //       return;
      //     }
      //     console.log(seeds.length);
      //     console.log('active : ' + active);
      //     console.log('toProcess.length : ' + toProcess.length);
      //     console.log('seeds.length : ' + seeds.length);
      //     if (toProcess.length < active && state !== "STOPPED" && state !== "PAUSED" && seeds.length !== 0) {
      //       console.log('The indexed seed: ' + seeds[0].id_seeds);
      //       toProcess.push(seeds[0]);
      //       if (!option.onlyStarted) {
      //         await startSeedProcessing(seeds[0]);
      //         running++
      //       }
      //       seeds.splice(seeds.indexOf(seeds[0]), 1);
      //       count++;
      //       await updateProcessState();
      //     }
      //   }

      //   async function handleFailure(seed) {
      //     console.log('failed :' + seed.gmail + ` ,at ${new Date().toLocaleString()}`);
      //     failed++;

      //     const end_in = new Date();
      //     const result = {
      //       id_seeds: seed.id_seeds,
      //       end_in,
      //       id_process: data.id_process,
      //     };

      //     await Promise.all([
      //       resultManager.updateState([{ id_seeds: seed.id_seeds, id_process: data.id_process }], "failed"),
      //       resultManager.endNow(result),
      //     ]);
      //     running--

      //     toProcess.shift();
      //     state = await composeManager.getProcessState(data.id_process);

      //     if (state === "STOPPED" || state === "PAUSED") {
      //       return;
      //     }
      //     console.log('active : ' + active);
      //     console.log('toProcess.length : ' + toProcess.length);
      //     console.log('seeds.length : ' + seeds.length);
      //     if (toProcess.length < active && count < length && state !== "STOPPED" && state !== "PAUSED" && seeds.length !== 0) {
      //       console.log('The indexed seed: ' + seeds[0].id_seeds);
      //       toProcess.push(seeds[0]);
      //       if (!option.onlyStarted) {
      //         await startSeedProcessing(seeds[0]);
      //         running++
      //       }
      //       seeds.splice(seeds.indexOf(seeds[0]), 1);
      //       count++;
      //       await updateProcessState();
      //     }
      //   }

      //   async function updateProcessState() {
      //     let w = waiting - success - failed
      //     if (w <= 0) {
      //       let status = { waiting: 0, active: running, finished: success, failed, id_process: data.id_process };
      //       processStateManager.updateState(status);
      //     } else {
      //       let status = { waiting: w, active: running, finished: success, failed, id_process: data.id_process };
      //       processStateManager.updateState(status);
      //     }
      //   }

      //   async function handleProcessCompletion() {
      //     let w = waiting - success - failed
      //     if (w <= 0) {
      //       let status = { waiting: 0, active: running, finished: success, failed, id_process: data.id_process };
      //       processStateManager.updateState(status);
      //     } else {
      //       let status = { waiting: w, active: running, finished: success, failed, id_process: data.id_process };
      //       processStateManager.updateState(status);
      //     }

      //     state = await composeManager.getProcessState(data.id_process);

      //     if (state === "STOPPED" || state === "PAUSED") {
      //       return;
      //     }
      //     if (toProcess.length === 0 && seeds.length === 0 && running === 0) {
      //       let status = { waiting: 0, active: 0, finished: success, failed: failed, id_process: data.id_process };
      //       await processStateManager.updateState(status);
      //       composeManager.finishedProcess({ id_process: data.id_process, status: `FINISHED` });
      //       console.log(`Process with id: ${data.id_process} finished at ${new Date().toLocaleString()} `);
      //     }
      //   }
      // };

      // async function repeat(array, number, start, check, action) {
      //   console.log("repeat action : " + action);
      //   if (check) {
      //     for (let i = 0; i < array[start].length; i++) {
      //       await resultManager.startNow({ id_seeds: array[start][i].id_seeds, id_process: data.id_process })
      //       await resultManager.updateState([{ id_seeds: array[start][i].id_seeds, id_process: data.id_process }], "running")
      //       console.log('set as running : ' + array[start][i].gmail + ` ,At ${new Date().toLocaleString()}`);
      //       running++
      //       processV([array[start][i]], start, { onlyStarted: false })
      //     }
      //   } else {
      //     console.log('The entered array :')
      //     console.log(array[start]);
      //     processV(array[start], start, { onlyStarted: true })
      //     if (number - 1 > start) await repeat(array, number, start + 1, check, action);
      //   }
      // }
      // console.log('Origins.length : ' + Origins.length);
      // console.log('toProcess.length : ' + toProcess.length);
      // console.log("actions[0] : " + actions[0]);
      // let check = { startingIndexed: Origins.length / active < process.env.MAX_RUNNING ? true : false }
      // await repeat(toProcess, toProcess.length, 0, check.startingIndexed, actions[0])
      // let status = { waiting: waiting, active: active, finished: 0, failed: 0, id_process: data.id_process }
      // console.log(status)














    }





  })
})

app.get("/", processManager.getData);
app.post("/:name", processManager.addProcess);

app.get("/lists", listManager.getData);
app.get("/lists/:list", listManager.getDataList);