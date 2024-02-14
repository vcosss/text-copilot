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

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-4xl font-semibold text-center mb-8">Text-Copilot</h1>
          <input type="file" accept=".pdf,.txt,.doc" onChange={handleFileChange} className="border-2 border-gray-300 bg-white h-auto py-5 px-5 pr-16 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
          {selectedFile && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold">Selected File: {selectedFile.name}</h2>
              <div className="mt-4">
                {selectedFile.name.endsWith('.pdf') && (
                  <embed src={URL.createObjectURL(selectedFile)} width="800px" height="600px" />
                )}
                {(selectedFile.name.endsWith('.txt') || selectedFile.name.endsWith('.doc')) && (
                  <pre className="overflow-auto max-h-80">{fileContent}</pre>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
