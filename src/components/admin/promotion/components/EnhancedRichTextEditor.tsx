import React, { useRef, useState, useEffect, useCallback } from "react";
import RichTextEditor, { RichTextEditorHandle } from "./RichTextEditor";

interface EnhancedRichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  height?: string;
  label?: string;
  minLength?: number;
  maxLength?: number;
}

const EnhancedRichTextEditor: React.FC<EnhancedRichTextEditorProps> = ({
  value = "",
  onChange,
  readOnly = false,
  height = "500px",
  label,
  minLength,
  maxLength,
}) => {
  const editorRef = useRef<RichTextEditorHandle>(null);
  const [editorValue, setEditorValue] = useState(value || "");
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  // Function to count characters (excluding HTML tags) - đồng bộ với RichTextEditor
  const countCharacters = useCallback((html: string) => {
    try {
      // Create a temporary div to parse HTML
      const temp = document.createElement("div");
      temp.innerHTML = html || "";
      // Get text content (strips all HTML tags)
      const text = temp.textContent || temp.innerText || "";
      setCharCount(text.length);
      setWordCount(text.split(/\s+/).filter(Boolean).length);
      return text.length;
    } catch (error) {
      console.error("Error counting characters:", error);
      const plainText = html.replace(/<[^>]*>/g, "").trim();
      setCharCount(plainText.length);
      setWordCount(plainText.split(/\s+/).filter(Boolean).length);
      return plainText.length;
    }
  }, []);

  // Update character count when value changes from props
  useEffect(() => {
    if (value !== editorValue) {
      console.log("EnhancedRichTextEditor value prop changed:", {
        oldValue: editorValue.substring(0, 50),
        newValue: value.substring(0, 50),
      });
      setEditorValue(value || "");
      countCharacters(value || "");
    }
  }, [value, editorValue, countCharacters]);

  const handleEditorChange = (newValue: string) => {
    console.log("EnhancedRichTextEditor handleEditorChange CALLED", {
      newValueLength: newValue.length,
    });

    const safeValue = newValue || "";
    setEditorValue(safeValue);
    countCharacters(safeValue);

    console.log("EnhancedRichTextEditor onChange:", {
      charCount: charCount,
      wordCount: wordCount,
      textSample: safeValue.replace(/<[^>]*>/g, "").substring(0, 50) + "...",
    });

    // Make sure to call the onChange callback
    if (onChange) {
      console.log("Calling parent onChange");
      onChange(safeValue);
    } else {
      console.warn("Parent onChange is not defined");
    }
  };

  return (
    <div className="w-full">
      {label && <div className="mb-2 font-medium">{label}</div>}
      <RichTextEditor
        ref={editorRef}
        value={editorValue}
        onChange={handleEditorChange}
        readOnly={readOnly}
        height={height}
      />
      <div className="mt-2 text-sm text-muted-foreground flex justify-between">
        <span>
          Số ký tự: {charCount} | Số từ: {wordCount}
        </span>
        {(minLength || maxLength) && (
          <span
            className={
              charCount < (minLength || 0) ? "text-red-500 font-medium" : ""
            }
          >
            {minLength && `Tối thiểu: ${minLength} ký tự`}
            {minLength && maxLength && " | "}
            {maxLength && `Tối đa: ${maxLength} ký tự`}
          </span>
        )}
      </div>
    </div>
  );
};

export default EnhancedRichTextEditor;
