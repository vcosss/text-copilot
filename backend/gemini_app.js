import express from 'express';
import {createServer} from 'http';
import {Server} from 'socket.io';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express()
const server = createServer(app)

app.use(cors({origin: '*'}))

const io = new Server(server, {cors: {origin: '*'}})
const PORT = process.env.PORT || 3000

const genAI = new GoogleGenerativeAI('AIzaSyCKxeGtIUanxXaeW6caF4DGmornC5O1hB8');
const model = genAI.getGenerativeModel({ model: "gemini-pro"});


// HANDLING WEBSOCKET
io.on('connection', (socket) => {
  console.log('user connected: ', socket.id)
  var pdfText = ""

  socket.on('message', async (msg) => {
    console.log("message received: ", msg)
    const query = JSON.parse(msg)

    if (query.type === "pdfText") {
      const content = query.content
			pdfText = content
      var bot_reply = "PDF text received successfully"

			console.log("bot reply: ", bot_reply)
			socket.emit('response', JSON.stringify({
				type: "pdfText",
				content: bot_reply
			}))

    } else if (query.type === "question") {
      const content = query.content
      
      // const bot_reply = await session.prompt(content)
      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: `I have a pdf file with me. Here is the content of the file: \n'''\n${pdfText}\n'''\nNow answer the questions that I will ask next as per the information/knowledge of the the content.` }],
          },
          {
            role: "model",
            parts: [{ text: "Sure, go ahead and ask me the questions." }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 500,
        },
      });
			const result = await chat.sendMessage(content);
			const response = await result.response;
			const bot_reply = response.text();
			
			console.log("bot reply: ", bot_reply)
      socket.emit('response', JSON.stringify({
        type: "question",
        content: bot_reply
      }))

    } else if (query.type === "summary"){
      // const bot_reply = await session.prompt(`Summarize the given text. The summary should be in precise bullet points.`)
			const result = await model.generateContent(`I have a pdf file with me. Here is the content of the file: \n'''\n${pdfText}\n'''\nSummarize the given text. The summary should be in precise bullet points.`);
			const response = await result.response;
			const bot_reply = response.text();

			console.log("bot reply: ", bot_reply)
      socket.emit('response', JSON.stringify({
        type: "summary",
        content: bot_reply
      }))

    } else if (query.type === "qna"){
      // const bot_reply = await session.prompt(`Generate a set of 5 sample questions as well as their answers based on the give text. These questions should be on the most relevant topics of the text. There should be atlest one MCQ question, one fill in the blank.`)
      const result = await model.generateContent(`I have a pdf file with me. Here is the content of the file: \n'''\n${pdfText}\n'''\nGenerate a set of 5 sample questions as well as their answers based on the give text. These questions should be on the most relevant topics of the text. There should be atlest one MCQ question, one fill in the blank.`);
			const response = await result.response;
			const bot_reply = response.text();
			
			console.log("bot reply: ", bot_reply)
      socket.emit('response', JSON.stringify({
        type: "qna",
        content: bot_reply
      }))

    } else if (query.type === "revision"){
      // const bot_reply = await session.prompt(`Generate short revision cards for the given text. These cards should cover the most important topics of the text.`)
			const result = await model.generateContent(`I have a pdf file with me. Here is the content of the file: \n'''\n${pdfText}\n'''\nGenerate short revision cards for the given text. These cards should cover the most important topics of the text.`);
			const response = await result.response;
			const bot_reply = response.text();

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