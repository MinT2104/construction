"use client";

import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./rich-text-editor.css";
import MediaService from "@/lib/services/media.service";
import QuillResizeImage from "quill-resize-image";

import { toast } from "sonner";
// Define the ref type for the RichTextEditor component
export type RichTextEditorHandle = {
  getContent: () => string;
  setContent: (html: string) => void;
};

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  height?: string;
}

// Mở rộng window interface để thêm quillConfigured
declare global {
  interface Window {
    quillConfigured?: boolean;
  }
}

const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(
  ({ value = "", onChange, readOnly = false, height = "500px" }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);
    // Ref để lưu các handlers và tránh lỗi TypeScript với listeners
    const handlersRef = useRef<{
      textChangeHandler?: () => void;
      selectionChangeHandler?: (range: any) => void;
    }>({});
    const [charCount, setCharCount] = useState(0);
    const [showYoutubeModal, setShowYoutubeModal] = useState(false);
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [imageUploading, setImageUploading] = useState(false);
    const editorContainerRef = useRef<HTMLDivElement>(null);

    const toggleFullscreen = () => {
      setIsFullscreen(!isFullscreen);
    };

    const handleCopyText = () => {
      if (!quillRef.current) return;
      const html = quillRef.current.root.innerHTML;
      const plainText = html.replace(/<[^>]*>/g, "").trim();
      navigator.clipboard.writeText(plainText).then(() => {
        toast.success("Đã sao chép nội dung văn bản!");
      });
    };

    const handleInsertYoutube = () => {
      setShowYoutubeModal(true);
    };

    const handleImageUpload = () => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();

      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;

        // Preview the image
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
        setShowImageModal(true);
      };
    };

    const handleInsertImage = async () => {
      if (!imageFile || !quillRef.current) return;

      try {
        setImageUploading(true);
        const formData = new FormData();
        formData.append("file", imageFile);
        const result = await MediaService.upload(formData);
        setImageUploading(false);

        if (result?.data?.url) {
          const range = quillRef.current.getSelection(true);
          const imageUrl = result.data.url;

          // Insert the image at the current cursor position
          quillRef.current.insertEmbed(range.index, "image", imageUrl);
          // Move cursor to the next position
          quillRef.current.setSelection(range.index + 1, 0);

          // Close the modal and reset state
          setShowImageModal(false);
          setImageFile(null);
          setImagePreviewUrl(null);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        setImageUploading(false);
        alert("Đã xảy ra lỗi khi tải ảnh lên. Vui lòng thử lại.");
      }
    };

    // Custom hook để tránh tạo Quill nhiều lần
    useEffect(() => {
      // Chỉ khởi tạo Quill khi chưa tồn tại
      if (editorRef.current && !quillRef.current) {
        // Define handleChange function outside setTimeout
        const handleChange = () => {
          if (!quillRef.current) return;

          const html = quillRef.current.root.innerHTML;
          updateCounts(html);
          console.log("RichTextEditor change detected:", {
            htmlLength: html.length,
            sampleHtml: html.substring(0, 100) + "...",
          });

          if (onChange) {
            console.log("RichTextEditor calling parent onChange");
            onChange(html);
          } else {
            console.warn("RichTextEditor: Parent onChange is not defined");
          }
        };

        // Add setTimeout to ensure DOM is fully loaded
        setTimeout(() => {
          if (!editorRef.current) return; // Check if ref is still valid

          // Đăng ký các modules và định nghĩa cấu hình cho Quill một lần duy nhất
          // để tránh đăng ký nhiều lần
          if (!window.quillConfigured) {
            const icons = Quill.import("ui/icons");
            const Size = Quill.import("formats/size");
            const fontSizeArr = [
              "",
              "8",
              "9",
              "10",
              "11",
              "12",
              "13",
              "14",
              "15",
              "16",
              "17",
              "18",
              "20",
              "24",
              "32",
              "42",
              "54",
              "68",
              "84",
              "98",
            ];

            const Font = Quill.import("formats/font");
            Font.whitelist = [
              "Roboto",
              "sans-serif",
              "serif",
              "monospace",
              "custom-font",
            ];
            Quill.register(Font, true);

            Size.whitelist = fontSizeArr;
            Quill.register(Size, true);
            // Quill.register("modules/resize", ResizeModule);
            // Quill.register("modules/iframeResize", IframeResizeModule);
            Quill.register("modules/resize", QuillResizeImage);

            // Gán biểu tượng SVG cho các button
            icons["video-upload"] = `<svg viewBox="0 0 18 18">
  <path d="M2 3h14v2H2V3zm0 3h14v9H2V6zm3-2l2 2M9 4l2 2m2-2l2 2"/>
</svg>`;

            icons["youtube-embed"] = `
<svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
  <path fill="currentColor" d="M23.498 6.186a2.998 2.998 0 00-2.112-2.12C19.689 3.5 12 3.5 12 3.5s-7.688 0-9.386.566a2.998 2.998 0 00-2.112 2.12A31.313 31.313 0 000 12a31.313 31.313 0 00.502 5.814 2.998 2.998 0 002.112 2.12C4.312 20.5 12 20.5 12 20.5s7.689 0 9.386-.566a2.998 2.998 0 002.112-2.12A31.313 31.313 0 0024 12a31.313 31.313 0 00-.502-5.814zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
</svg>
`;

            icons["custom-image"] = `
<svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
  <rect class="ql-stroke" height="10" width="12" x="3" y="4"></rect>
  <circle class="ql-fill" cx="6" cy="7" r="1"></circle>
  <polyline class="ql-stroke" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline>
</svg>
`;
            window.quillConfigured = true;
          }

          // Tránh khởi tạo lại Quill nếu đã tồn tại
          if (quillRef.current) return;

          // Khởi tạo Quill với cấu hình tối ưu
          quillRef.current = new Quill(editorRef.current, {
            theme: "snow",
            readOnly,
            modules: {
              resize: {
                locale: {},
              },
              toolbar: readOnly
                ? false
                : {
                    container: [
                      [
                        {
                          font: [],
                        },
                      ],
                      [{ header: [1, 2, 3, 4, 5, 6, false] }],
                      [
                        "bold",
                        "italic",
                        "underline",
                        "strike",
                        "blockquote",
                        "code-block",
                      ],
                      [{ size: [] }], // Sử dụng danh sách size đã định nghĩa
                      [{ color: [] }, { background: [] }],
                      [{ script: "sub" }, { script: "super" }],
                      [{ list: "ordered" }, { list: "bullet" }],
                      [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
                      [
                        "link",
                        // "image",
                        "custom-image",
                        "video-upload",
                        "youtube-embed",
                      ],
                      ["clean"],
                    ],
                    handlers: {
                      "video-upload": () => handleVideoUpload(),
                      "youtube-embed": () => handleInsertYoutube(),
                      "custom-image": () => handleImageUpload(),
                    },
                  },
            },

            placeholder: "Viết gì đó...",
          });

          if (value) {
            quillRef.current.root.innerHTML = value;
            updateCounts(value);
          }

          // After setting content, let's ensure iframe resizing works on existing iframes
          if (quillRef.current) {
            const iframeModule = quillRef.current.getModule("iframeResize");
            if (iframeModule) {
              // The module will handle existing iframes
              setTimeout(() => {
                // Give a small delay to ensure DOM is ready
                if (quillRef.current) {
                  const iframes =
                    quillRef.current.root.querySelectorAll("iframe");
                  if (iframes.length > 0) {
                    // Make sure existing iframes have proper styling
                    iframes.forEach((iframe: HTMLIFrameElement) => {
                      iframe.style.maxWidth = "100%";
                      iframe.style.border = "none";
                    });
                  }
                }
              }, 100);
            }
          }

          // Đảm bảo bắt được tất cả các thay đổi
          if (quillRef.current) {
            // Tạo các hàm xử lý riêng để có thể gỡ bỏ sau này
            const textChangeHandler = function () {
              handleChange();
            };

            const selectionChangeHandler = function (range: any) {
              if (range) {
                handleChange();
              }
            };

            const inputHandler = function () {
              handleChange();
            };

            // Lưu handlers vào ref để sử dụng ở nơi khác
            handlersRef.current = {
              textChangeHandler,
              selectionChangeHandler,
            };

            // Thêm các event listeners mới
            quillRef.current.on("text-change", textChangeHandler);
            quillRef.current.on("selection-change", selectionChangeHandler);
            quillRef.current.root.addEventListener("input", inputHandler);

            // Lưu các handler vào ref để có thể gỡ bỏ trong cleanup
            const currentQuill = quillRef.current;

            // Trả về hàm cleanup khi component unmount hoặc effect chạy lại
            return () => {
              if (currentQuill) {
                currentQuill.off("text-change", textChangeHandler);
                currentQuill.off("selection-change", selectionChangeHandler);
                if (currentQuill.root) {
                  currentQuill.root.removeEventListener("input", inputHandler);
                }
              }
            };
          }

          // Ensure change is detected for initial content
          if (value) {
            setTimeout(() => {
              handleChange();
            }, 0);
          }
        }, 100); // Wait 100ms to ensure DOM is fully loaded

        // Empty return nếu không có quillRef.current
        return () => {};
      }
    }, []); // Chỉ chạy một lần duy nhất khi component mount

    // Xử lý khi value prop thay đổi
    useEffect(() => {
      if (quillRef.current && value !== undefined) {
        const currentContent = quillRef.current.root.innerHTML;

        // Chỉ cập nhật nếu nội dung thực sự thay đổi để tránh re-render không cần thiết
        if (currentContent !== value) {
          // Tránh gây ra onChange event từ việc cập nhật giá trị từ props
          const quill = quillRef.current;

          // Tạm thời disable event listeners
          if (handlersRef.current.textChangeHandler) {
            quill.off("text-change", handlersRef.current.textChangeHandler);
          }

          // Cập nhật nội dung
          quill.root.innerHTML = value;
          updateCounts(value);

          // Khôi phục event listeners
          if (handlersRef.current.textChangeHandler) {
            quill.on("text-change", handlersRef.current.textChangeHandler);
          }
        }
      }
    }, [value]);

    const handleVideoUpload = () => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "video/*");
      input.click();

      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;

        console.log(file);

        const videoUrl = await MediaService.uploadVideo(file);
        console.log(videoUrl);

        const range = quillRef.current?.getSelection(true);
        if (range && videoUrl?.url) {
          const iframeHtml = `
            <iframe 
              src="${videoUrl.url}" 
              width="560" 
              height="315" 
              frameborder="0" 
              allowfullscreen
              style="max-width: 100%; border: none;"
              class="resizable-iframe"
            ></iframe><p><br></p>`;

          // Dán iframe HTML vào tại vị trí con trỏ
          quillRef.current?.clipboard.dangerouslyPasteHTML(
            range.index,
            iframeHtml
          );
          quillRef.current?.setSelection(range.index + 1, 0);
        }
      };
    };

    const updateCounts = (html: string) => {
      try {
        // Tạo một temporary div để parse HTML
        const temp = document.createElement("div");
        temp.innerHTML = html || "";
        // Lấy nội dung văn bản (loại bỏ tất cả thẻ HTML)
        const plainText = temp.textContent || temp.innerText || "";
        setCharCount(plainText.length);
        // Đếm số từ bằng cách tách theo khoảng trắng và lọc những phần tử rỗng
      } catch (error) {
        console.error("Error counting text:", error);
        // Fallback nếu có lỗi, sử dụng regex để loại bỏ HTML tags
        const textWithoutTags = html.replace(/<[^>]*>/g, "").trim();
        setCharCount(textWithoutTags.length);
      }
    };

    // Expose functions to parent via ref
    useImperativeHandle(ref, () => ({
      getContent: () => quillRef.current?.root.innerHTML ?? "",
      setContent: (html: string) => {
        if (quillRef.current) {
          quillRef.current.root.innerHTML = html;
          updateCounts(html);
        }
      },
    }));

    useEffect(() => {
      const handleEscKey = (event: KeyboardEvent) => {
        if (event.key === "Escape" && isFullscreen) {
          setIsFullscreen(false);
        }
      };

      document.addEventListener("keydown", handleEscKey);
      return () => {
        document.removeEventListener("keydown", handleEscKey);
      };
    }, [isFullscreen]);

    return (
      <div
        ref={editorContainerRef}
        className={isFullscreen ? "editor-fullscreen" : "relative"}
      >
        {/* Toolbar with copy text and fullscreen buttons */}
        <div className="editor-toolbar">
          <button
            type="button"
            className="editor-toolbar-button"
            onClick={handleCopyText}
            title="Sao chép văn bản"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>Sao chép</span>
          </button>
          <button
            type="button"
            className="editor-toolbar-button"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
          >
            {isFullscreen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
              </svg>
            )}
            <span>{isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}</span>
          </button>
        </div>

        <div
          className="richTextEditor"
          ref={editorRef}
          style={{ height: isFullscreen ? "auto" : height }}
        />

        {!readOnly && (
          <div className="text-sm text-muted-foreground mt-1">
            {isFullscreen && (
              <span className="text-xs ml-2 opacity-70">
                Nhấn ESC để thoát chế độ toàn màn hình
              </span>
            )}
          </div>
        )}

        {showYoutubeModal && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-xl">
              <h2 className="text-lg font-semibold mb-4">Chèn video YouTube</h2>
              <input
                type="text"
                className="border rounded px-3 py-2 w-full mb-4"
                placeholder="Dán URL YouTube vào đây"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => {
                    setShowYoutubeModal(false);
                    setYoutubeUrl("");
                  }}
                >
                  Hủy
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={() => {
                    if (!youtubeUrl.trim()) return;

                    const match = youtubeUrl.match(
                      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
                    );

                    if (!match) {
                      alert("URL YouTube không hợp lệ.");
                      return;
                    }

                    const videoId = match[1];
                    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
                    const iframeHtml = `
                    <iframe 
                      src="${embedUrl}" 
                      width="560" 
                      height="315" 
                      frameborder="0" 
                      allowfullscreen
                      style="max-width: 100%; border: none;"
                      class="resizable-iframe"
                    ></iframe><p><br></p>`;

                    const range = quillRef.current?.getSelection(true);
                    if (range) {
                      quillRef.current?.clipboard.dangerouslyPasteHTML(
                        range.index,
                        iframeHtml
                      );

                      quillRef.current?.setSelection(range.index + 1, 0);
                    }

                    setShowYoutubeModal(false);
                    setYoutubeUrl("");
                  }}
                >
                  Chèn
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Upload Modal */}
        {showImageModal && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-xl">
              <h2 className="text-lg font-semibold mb-4">Tải ảnh lên</h2>

              {imagePreviewUrl && (
                <div className="mb-4">
                  <img
                    src={imagePreviewUrl}
                    alt="Preview"
                    className="w-full h-auto max-h-64 object-contain border rounded"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => {
                    setShowImageModal(false);
                    setImageFile(null);
                    setImagePreviewUrl(null);
                  }}
                  disabled={imageUploading}
                >
                  Hủy
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2"
                  onClick={handleInsertImage}
                  disabled={!imageFile || imageUploading}
                >
                  {imageUploading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang tải...
                    </>
                  ) : (
                    <>Chèn ảnh</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";
export default RichTextEditor;
