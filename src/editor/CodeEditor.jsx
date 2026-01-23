
import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { languageConfig } from "../utils/languageConfig";

const CodeEditor = ({ onSubmit }) => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(
    languageConfig.javascript.boilerplate
  );

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    setCode(languageConfig[lang].boilerplate);
  };

  const handleSubmit = () => {
    onSubmit({ language, code });
  };

  return (
    <div className="w-full h-full flex flex-col">
      
      <div className="flex justify-between items-center px-4 py-2 bg-gray-900 border-b border-gray-800">
        <select
          value={language}
          onChange={handleLanguageChange}
          className="bg-gray-800 text-gray-200 px-3 py-1 rounded text-sm"
        >
          {Object.entries(languageConfig).map(([key, lang]) => (
            <option key={key} value={key}>
              {lang.label}
            </option>
          ))}
        </select>

        <button
          onClick={handleSubmit}
          className="bg-emerald-500 px-4 py-1 rounded text-black font-semibold"
        >
          Submit
        </button>
      </div>
      <Editor
        height="100%"
        theme="vs-dark"
        language={languageConfig[language].monaco}
        value={code}
        onChange={(value) => setCode(value)}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
