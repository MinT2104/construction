"use client";

import ReactQuill from "react-quill";
import { useEffect } from "react";
import ImageUploader from "quill-image-uploader";
import "react-quill/dist/quill.snow.css";
import "quill-better-table/dist/quill-better-table.css";

// Register Quill modules on client side only
if (typeof window !== "undefined") {
  const Quill = require("quill");

  // Register ImageUploader module
  Quill.register("modules/imageUploader", ImageUploader);

  try {
    // Register better table module
    const { default: QuillBetterTable } = require("quill-better-table");
    Quill.register(
      {
        "modules/better-table": QuillBetterTable,
      },
      true
    );

    // Register image resize module
    const { default: ImageResize } = require("@botom/quill-resize-module");
    Quill.register("modules/imageResize", ImageResize);
  } catch (error) {
    console.error("Error loading Quill modules:", error);
  }
}

export default ReactQuill;
