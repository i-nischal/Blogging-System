import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import TinyMCEEditor from "../../../components/writer/TinyMCEEditor";
import WriteHeader from "./WriteHeader";

const Write = () => {
  const [content, setContent] = useState("");
  const [wordCount, setWordCount] = useState(0);

  const handleContentChange = (newContent) => {
    setContent(newContent);
    const textContent = newContent.replace(/<[^>]*>/g, "");
    setWordCount(
      textContent.split(/\s+/).filter((word) => word.length > 0).length
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Only ONE header here */}
      <WriteHeader content={content} />

      <div className="flex-1 bg-white">
        {/* Stats Bar */}
        <div className="border-b border-gray-200 px-6 py-2 bg-white flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Sparkles className="h-4 w-4" />
            <span>{wordCount} words</span>
          </div>
          <div className="text-xs text-gray-400">
            Start writing your content
          </div>
        </div>

        {/* Full-screen Editor */}
        <div className="h-[calc(100vh-96px)]">
          <TinyMCEEditor
            content={content}
            onContentChange={handleContentChange}
            height="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default Write;
