import React, { useRef, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";

const TinyMCEEditor = ({ content, onContentChange, height = "100%" }) => {
  const editorRef = useRef(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Only set content on initial mount if provided
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, []);

  const handleEditorChange = (newContent, editor) => {
    // Call the parent's onChange handler
    onContentChange(newContent);
  };

  return (
    <div className="h-full">
      <Editor
        apiKey={import.meta.env.VITE_TinyMCE_API_KEY}
        onInit={(evt, editor) => {
          editorRef.current = editor;
        }}
        initialValue=""
        onEditorChange={handleEditorChange}
        init={{
          height: height,
          menubar: true,
          statusbar: true,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "wordcount",
            "emoticons",
          ],
          toolbar:
            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | " +
            "forecolor backcolor | alignleft aligncenter alignright alignjustify | " +
            "bullist numlist | outdent indent | " +
            "link image media table | code preview fullscreen | help",

          content_style: `
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              font-size: 16px; 
              line-height: 1.7;
              color: #1f2937;
              max-width: 8.5in;
              margin: 0 auto;
              padding: 1in;
              background: white;
            }
            h1 { 
              font-size: 2.5em; 
              margin: 0 0 0.5em 0; 
              font-weight: 800;
              color: #111827;
              line-height: 1.2;
            }
            h2 { 
              font-size: 1.75em; 
              margin: 1.5em 0 0.5em 0; 
              font-weight: 600;
              color: #111827;
            }
            p { 
              margin-bottom: 1.2em; 
              line-height: 1.8;
            }
          `,

          automatic_uploads: true,
          images_upload_url: "/api/upload-image",
          browser_spellcheck: true,
          resize: false,
          branding: false,

          // Prevent cursor jumping
          setup: (editor) => {
            editor.on("init", () => {
              // Ensure editor doesn't reset cursor position
              editor.on("SetContent", (e) => {
                if (!e.initial) {
                  e.preventDefault();
                }
              });
            });
          },
        }}
      />
    </div>
  );
};

export default TinyMCEEditor;
