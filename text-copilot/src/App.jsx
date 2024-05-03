import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import pdfToText from "react-pdftotext";
import { Tab, Tabs, Paper } from "@mui/material";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
/* eslint-disable react/prop-types */

const WS_URL = "http://localhost:3000";

const socket = io(WS_URL);
if (socket) {
  console.log("Connected to the server");
}

function ChatMessage({ message, type }) {
  return (
    <div
      className={`flex w-full ${
        type === "send" ? "justify-start" : "justify-end"
      }`}
    >
      {type === "send" ? (
        <div className="bg-violet-500 p-2 rounded-b-lg rounded-tr-lg text-white">
          {message}
        </div>
      ) : (
        <div className="bg-white p-2 rounded-b-lg rounded-tl-lg text-black">
          {message.split("\n").map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div>
      )}
    </div>
  );
}

function ChatRoom({ messages, setMessages }) {
  const [input_message, setInputMessage] = useState("");

  const sendQuestion = () => {
    setMessages((prev) => [
      ...prev,
      {
        type: "send",
        message: input_message,
      },
    ]);
    setInputMessage("");
    var obj = {
      type: "question",
      content: input_message,
    };
    socket.emit("message", JSON.stringify(obj));
    console.log("sent question: ", obj);
  };

  return (
    <div className="p-5 h-screen bg-black">
      <div className="container mx-auto bg-gray-900 h-full flex flex-col">
        <div className="flex-grow p-3 flex flex-col items-end overflow-scroll no-scrollbar">
          <div className="w-full space-y-3">
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  type={message.type}
                  message={message.message}
                />
              ))
            ) : (
              <div className="text-center text-white">No messages yet</div>
            )}
          </div>
        </div>
        <div className="h-[100px] p-3 flex justify-center items-center bg-gray-700">
          <input
            value={input_message}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask a Question..."
            onKeyDown={(e) => e.key === "Enter" && sendQuestion()}
            type="text"
            className="w-full p-2 bg-transparent text-white border-white border-2 rounded-md outline-none"
          />
          <button
            onClick={sendQuestion}
            className="bg-violet-600 px-3 py-2 rounded-md mx-2 text-white cursor-pointer"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
}

const SummaryPanel = ({ buttonName, content, handleClick }) => {
  return (
    <div className="flex flex-col items-center bg-gray-800 text-white p-8 rounded-lg h-screen">
      <button
        type="button"
        className="text-xl font-bold py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded focus:outline-none"
        onClick={handleClick}
      >
        {buttonName}
      </button>
      <div className="mt-4 text-base leading-relaxed overflow-scroll no-scrollbar">
        {/* This is where the summary text will be displayed */}
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </div>
  );
};

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [tabValue, setTabValue] = useState(0);

  const [summary, setSummary] = useState("");
  const [qna, setQna] = useState("");
  const [revision, setRevision] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("response", (msg) => {
      const res = JSON.parse(msg);
      console.log("received response: ", res);
      if (res.type === "question") {
        setMessages((prev) => [
          ...prev,
          {
            type: "receive",
            message: res.content,
          },
        ]);
      } else if (res.type === "summary") {
        setSummary(res.content);
      } else if (res.type === "qna") {
        setQna(res.content);
      } else if (res.type === "revision") {
        setRevision(res.content);
      }
    });
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFileChange = async (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);

      if (file.name.endsWith(".pdf")) {
        pdfToText(file)
          .then((text) => {
            console.log("pdfText extracted:", text);
            setFileContent(text);
            var obj = {
              type: "pdfText",
              content: text,
            };
            socket.emit("message", JSON.stringify(obj));
            console.log("sent content: ", obj);
          })
          .catch((error) =>
            console.error("Failed to extract text from pdf, error:", error)
          );
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result;
          console.log("pdfText extracted:", result);
          setFileContent(result);
          var obj = {
            type: "pdfText",
            content: result,
          };
          socket.emit("message", JSON.stringify(obj));
          console.log("sent content: ", obj);
        };
        reader.readAsText(file);
      }
    }
  };

  const resetFile = () => {
    setSelectedFile(null);
    setFileContent("");
    const socket = io(WS_URL);
    if (socket) {
      console.log("Connected to the server");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div
        className={selectedFile ? "flex w-full" : "relative py-3 sm:mx-auto"}
      >
        {selectedFile ? (
          <>
            <div className="w-1/2">
              <div className="relative px-4 py-4 bg-white shadow-lg overflow-scroll no-scrollbar h-screen">
                {selectedFile && (
                  <div className="mt-8">
                    <div className="mt-8 flex items-center">
                      <h2 className="text-xl font-semibold mr-4">
                        Selected File: {selectedFile.name}
                      </h2>
                      <button
                        onClick={resetFile}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Reset
                      </button>
                    </div>
                    <div className="mt-4">
                      {selectedFile.name.endsWith(".pdf") && (
                        <embed
                          src={URL.createObjectURL(selectedFile)}
                          width="100%"
                          height="600px"
                        />
                      )}
                      {(selectedFile.name.endsWith(".txt") ||
                        selectedFile.name.endsWith(".doc")) && (
                        <pre className="overflow-auto max-h-80">
                          {fileContent}
                        </pre>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="w-1/2">
              {fileContent ? (
                <div>
                  <Paper>
                    <Tabs value={tabValue} onChange={handleTabChange} centered>
                      <Tab label="Chat" />
                      <Tab label="Summarization" />
                      <Tab label="QnA" />
                      <Tab label="Revision" />
                    </Tabs>
                  </Paper>
                  <TabPanel value={tabValue} index={0}>
                    <ChatRoom messages={messages} setMessages={setMessages} />
                  </TabPanel>
                  <TabPanel value={tabValue} index={1}>
                    <SummaryPanel
                      buttonName={"Generate Summarize"}
                      content={summary}
                      handleClick={() => {
                        setSummary("Generating Summary...");
                        var obj = {
                          type: "summary",
                        };
                        socket.emit("message", JSON.stringify(obj));
                        console.log("sent summary request: ", obj);
                      }}
                    />
                  </TabPanel>
                  <TabPanel value={tabValue} index={2}>
                    <SummaryPanel
                      buttonName={"Generate QnA"}
                      content={qna}
                      handleClick={() => {
                        setQna("Generating QnA...");
                        var obj = {
                          type: "qna",
                        };
                        socket.emit("message", JSON.stringify(obj));
                        console.log("sent qna request: ", obj);
                      }}
                    />
                  </TabPanel>
                  <TabPanel value={tabValue} index={3}>
                    <SummaryPanel
                      buttonName={"Generate Revision Cards"}
                      content={revision}
                      handleClick={() => {
                        setRevision("Generating Revision...");
                        var obj = {
                          type: "revision",
                        };
                        socket.emit("message", JSON.stringify(obj));
                        console.log("sent revision request: ", obj);
                      }}
                    />
                  </TabPanel>
                </div>
              ) : (
                <div className="text-center mt-8 text-xl font-semibold">
                  Extracting File Contents...
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
            <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20 w-full">
              <h1 className="text-4xl font-semibold text-center mb-8">
                Text-Copilot
              </h1>
              <input
                type="file"
                accept=".pdf,.txt,.doc"
                onChange={handleFileChange}
                className="border-2 border-gray-300 bg-white h-auto py-5 px-5 pr-16 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
