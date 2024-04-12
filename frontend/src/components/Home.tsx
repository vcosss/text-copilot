import React, { useState, ChangeEvent } from 'react';

const DocumentViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setFileContent(result);
      };
      reader.readAsText(file);
    }
  };

  const resetFile = () => {
    setSelectedFile(null);
    setFileContent('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className={selectedFile ? "flex w-full" : "relative py-3 sm:mx-auto"}>
        {selectedFile ? (
          <>
            <div className="w-1/2">
              <div className="relative px-4 py-4 bg-white shadow-lg">
                {selectedFile && (
                  <div className="mt-8">
                    <div className="mt-8 flex items-center">
                      <h2 className="text-xl font-semibold mr-4">Selected File: {selectedFile.name}</h2>
                      <button onClick={resetFile} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Reset</button>
                    </div>
                    <div className="mt-4">
                      {selectedFile.name.endsWith('.pdf') && (
                        <embed src={URL.createObjectURL(selectedFile)} width="100%" height="600px" />
                      )}
                      {(selectedFile.name.endsWith('.txt') || selectedFile.name.endsWith('.doc')) && (
                        <pre className="overflow-auto max-h-80">{fileContent}</pre>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="w-1/2">
              <div className="fixed px-4 py-12 bg-white shadow-lg mt-0 sm:mt-0 h-screen w-screen">
                <h2 className="text-2xl font-semibold mb-4 px-5">Ask a question</h2>
                {/* Chat Interface Content */}
                <div className="flex flex-col h-full px-5 py-10">
                  {/* Messages */}
                  <div className="overflow-y-auto flex-1">
                    {/* Chat messages will go here */}
                  </div>
                  {/* Message Input */}
                  <div className="mt-4">
                    <input type="text" placeholder="Type your message..." className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                    <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md">Send</button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
              <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20 w-full">
                <h1 className="text-4xl font-semibold text-center mb-8">Text-Copilot</h1>
                <input type="file" accept=".pdf,.txt,.doc" onChange={handleFileChange} className="border-2 border-gray-300 bg-white h-auto py-5 px-5 pr-16 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
              </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DocumentViewer;
