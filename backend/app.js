import express from 'express';
import {createServer} from 'http';
import {Server} from 'socket.io';
import path from "node:path";
import {fileURLToPath} from "url";
import cors from 'cors';

import {LlamaModel, LlamaContext, LlamaChatSession} from "node-llama-cpp";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const model = new LlamaModel({
    modelPath: path.join(__dirname, "models", "capybarahermes-2.5-mistral-7b.Q4_K_M.gguf"),
});
const context = new LlamaContext({model});
const session = new LlamaChatSession({context});

const app = express()
const server = createServer(app)

app.use(cors({
  origin: '*'
}))

const io = new Server(server, {
  cors: {
    origin: '*',
  }
})
const PORT = process.env.PORT || 3000

// HANDLING WEBSOCKET
io.on('connection', (socket) => {
  console.log('user connected: ', socket.id)

  socket.on('message', async (msg) => {
    console.log("message received: ", msg)
    const query = JSON.parse(msg)

    if (query.type === "pdfText") {
      const content = query.content
      await session.prompt(`I have a pdf file with me. Here is the content of the file: '''\n${content}\n''', now answer these questions as per the information given above.`)
      console.log("content passed to bot: ", content)

    } else if (query.type === "question") {
      const content = query.content
      const bot_reply = await session.prompt(content)
      console.log("bot reply: ", bot_reply)
      socket.emit('response', JSON.stringify({
        type: "question",
        content: bot_reply
      }))

    } else if (query.type === "summary"){
      const bot_reply = await session.prompt(`Summarize the given text. The summary should be in precise bullet points.`)
      console.log("bot reply: ", bot_reply)
      socket.emit('response', JSON.stringify({
        type: "summary",
        content: bot_reply
      }))

    } else if (query.type === "qna"){
      const bot_reply = await session.prompt(`Generate a set of 5 sample questions as well as their answers based on the give text. These questions should be on the most relevant topics of the text. There should be atlest one MCQ question, one fill in the blank.`)
      console.log("bot reply: ", bot_reply)
      socket.emit('response', JSON.stringify({
        type: "qna",
        content: bot_reply
      }))

    } else if (query.type === "revision"){
      const bot_reply = await session.prompt(`Generate short revision cards for the given text. These cards should cover the most important topics of the text.`)
      console.log("bot reply: ", bot_reply)
      socket.emit('response', JSON.stringify({
        type: "revision",
        content: bot_reply
      }))

    }
  })

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id)
  })
})

// TESTING
app.get('/test', (req, res) => {
  res.send('Hello World')
})

// STARTING THE SERVER
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})