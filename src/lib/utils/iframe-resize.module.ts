import Quill from "quill";

// Module for iframe resizing in Quill
export default class IframeResizeModule {
  private quill: any;
  private options: any;
  private iframe: HTMLIFrameElement | null = null;
  private overlay: HTMLElement | null = null;
  private handles: HTMLElement[] = [];
  private dragHandle: HTMLElement | null = null;
  private startX = 0;
  private startY = 0;
  private startWidth = 0;
  private startHeight = 0;
  private ratio = 0;

  constructor(quill: any, options: any) {
    this.quill = quill;
    this.options = options || {};

    // Initialize the module
    this.initialize();
  }

  initialize() {
    // Add event listeners to detect iframe clicks
    this.quill.root.addEventListener("click", this.handleClick);
    document.addEventListener("mousedown", this.handleMouseDown);
    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("mouseup", this.handleMouseUp);

    // Process existing iframes in the editor
    setTimeout(() => {
      const iframes = this.quill.root.querySelectorAll("iframe");
      iframes.forEach((iframe: HTMLIFrameElement) => {
        if (!iframe.classList.contains("resizable-iframe")) {
          iframe.classList.add("resizable-iframe");
        }
        iframe.style.maxWidth = "100%";
        iframe.style.border = "none";
      });
    }, 100);

    // Enhance pasted content to make iframes resizable
    this.quill.clipboard.addMatcher(
      "IFRAME",
      (node: HTMLIFrameElement, delta: any) => {
        // Make sure iframe has appropriate styles for resizing
        node.classList.add("resizable-iframe");
        node.style.maxWidth = "100%";
        node.style.border = "none";
        return delta;
      }
    );
  }

  handleClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    // Check if an iframe was clicked
    if (target.tagName === "IFRAME") {
      // Add the resizable-iframe class if it doesn't have it
      if (!target.classList.contains("resizable-iframe")) {
        target.classList.add("resizable-iframe");
      }

      // Select the iframe
      this.selectIframe(target as HTMLIFrameElement);
    } else if (!this.isHandleElement(target) && this.iframe) {
      // Deselect if clicked outside and not on a handle
      this.deselect();
    }
  };

  isHandleElement(element: HTMLElement): boolean {
    return (
      element.className.includes("ql-iframe-handle") ||
      element.className.includes("ql-iframe-overlay")
    );
  }

  selectIframe(iframe: HTMLIFrameElement) {
    // Deselect any previously selected iframe
    this.deselect();

    this.iframe = iframe;

    // Disable pointer events on the iframe while resizing to allow handle clicks
    iframe.style.pointerEvents = "none";

    // Create overlay and handles
    this.createOverlay();
    this.createHandles();

    // Add the overlay and handles to the DOM
    this.positionElements();
  }

  createOverlay() {
    if (!this.iframe) return;

    const overlay = document.createElement("div");
    overlay.className = "ql-iframe-overlay";
    overlay.style.position = "absolute";
    overlay.style.border = "1px dashed #4f46e5";
    overlay.style.boxSizing = "border-box";
    overlay.style.pointerEvents = "none";

    this.quill.root.parentNode.appendChild(overlay);
    this.overlay = overlay;
  }

  createHandles() {
    if (!this.iframe) return;

    const handlePositions = ["nw", "ne", "se", "sw"];
    this.handles = [];

    handlePositions.forEach((position) => {
      const handle = document.createElement("div");
      handle.className = `ql-iframe-handle ql-iframe-handle-${position}`;
      handle.style.position = "absolute";
      handle.style.width = "10px";
      handle.style.height = "10px";
      handle.style.backgroundColor = "#4f46e5";
      handle.style.border = "1px solid white";
      handle.style.zIndex = "10";
      handle.style.pointerEvents = "auto";

      // Position-specific styles
      switch (position) {
        case "nw":
          handle.style.top = "-5px";
          handle.style.left = "-5px";
          handle.style.cursor = "nwse-resize";
          break;
        case "ne":
          handle.style.top = "-5px";
          handle.style.right = "-5px";
          handle.style.cursor = "nesw-resize";
          break;
        case "se":
          handle.style.bottom = "-5px";
          handle.style.right = "-5px";
          handle.style.cursor = "nwse-resize";
          break;
        case "sw":
          handle.style.bottom = "-5px";
          handle.style.left = "-5px";
          handle.style.cursor = "nesw-resize";
          break;
      }

      this.quill.root.parentNode.appendChild(handle);
      this.handles.push(handle);
    });
  }

  positionElements() {
    if (!this.iframe || !this.overlay) return;

    // Get the position of the iframe relative to the editor
    const iframeRect = this.iframe.getBoundingClientRect();
    const containerRect = this.quill.root.parentNode.getBoundingClientRect();

    // Calculate offsets
    const offsetLeft = iframeRect.left - containerRect.left;
    const offsetTop = iframeRect.top - containerRect.top;

    // Position the overlay
    this.overlay.style.left = `${offsetLeft}px`;
    this.overlay.style.top = `${offsetTop}px`;
    this.overlay.style.width = `${iframeRect.width}px`;
    this.overlay.style.height = `${iframeRect.height}px`;

    // Position the handles
    this.positionHandles(
      offsetLeft,
      offsetTop,
      iframeRect.width,
      iframeRect.height
    );
  }

  positionHandles(left: number, top: number, width: number, height: number) {
    if (this.handles.length !== 4) return;

    // NW handle
    this.handles[0].style.left = `${left - 5}px`;
    this.handles[0].style.top = `${top - 5}px`;

    // NE handle
    this.handles[1].style.left = `${left + width - 5}px`;
    this.handles[1].style.top = `${top - 5}px`;

    // SE handle
    this.handles[2].style.left = `${left + width - 5}px`;
    this.handles[2].style.top = `${top + height - 5}px`;

    // SW handle
    this.handles[3].style.left = `${left - 5}px`;
    this.handles[3].style.top = `${top + height - 5}px`;
  }

  handleMouseDown = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    // Check if a resize handle was clicked
    if (target.className.includes("ql-iframe-handle") && this.iframe) {
      this.dragHandle = target;
      this.startX = event.clientX;
      this.startY = event.clientY;

      // Get initial dimensions
      const rect = this.iframe.getBoundingClientRect();
      this.startWidth = rect.width;
      this.startHeight = rect.height;
      this.ratio = this.startWidth / this.startHeight;

      event.preventDefault();
    }
  };

  handleMouseMove = (event: MouseEvent) => {
    if (!this.dragHandle || !this.iframe) return;

    // Calculate the resize based on which handle is being dragged
    const deltaX = event.clientX - this.startX;
    const deltaY = event.clientY - this.startY;

    let newWidth = this.startWidth;
    let newHeight = this.startHeight;

    if (this.dragHandle.className.includes("nw")) {
      newWidth = this.startWidth - deltaX;
      newHeight = this.startHeight - deltaY;
    } else if (this.dragHandle.className.includes("ne")) {
      newWidth = this.startWidth + deltaX;
      newHeight = this.startHeight - deltaY;
    } else if (this.dragHandle.className.includes("se")) {
      newWidth = this.startWidth + deltaX;
      newHeight = this.startHeight + deltaY;
    } else if (this.dragHandle.className.includes("sw")) {
      newWidth = this.startWidth - deltaX;
      newHeight = this.startHeight + deltaY;
    }

    // Ensure minimum dimensions
    newWidth = Math.max(100, newWidth);
    newHeight = Math.max(100, newHeight);

    // Apply new dimensions to the iframe
    this.iframe.style.width = `${newWidth}px`;
    this.iframe.style.height = `${newHeight}px`;

    // Update overlay and handles positions
    this.positionElements();
  };

  handleMouseUp = () => {
    this.dragHandle = null;
  };

  deselect() {
    // Remove overlay and handles
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }

    this.handles.forEach((handle) => handle.remove());
    this.handles = [];

    // Restore pointer events on the iframe
    if (this.iframe) {
      this.iframe.style.pointerEvents = "auto";
      this.iframe = null;
    }
  }

  destroy() {
    // Clean up event listeners
    this.quill.root.removeEventListener("click", this.handleClick);
    document.removeEventListener("mousedown", this.handleMouseDown);
    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("mouseup", this.handleMouseUp);

    // Remove any elements
    this.deselect();
  }
}
