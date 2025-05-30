export default class IframeResizeModule {
  quill: any;
  iframe: HTMLIFrameElement | null = null;
  box: HTMLDivElement | null = null;
  handle: HTMLDivElement | null = null;
  dragging = false;

  constructor(quill: any) {
    this.quill = quill;

    this.quill.root.addEventListener("click", this.checkIframe);
    document.addEventListener("mousedown", this.startResize);
    document.addEventListener("mousemove", this.onResize);
    document.addEventListener("mouseup", this.stopResize);
  }

  checkIframe = (evt: MouseEvent) => {
    const target = evt.target as HTMLElement;
    if (target && target.tagName === "IFRAME") {
      this.removeResizeBox();
      this.createResizeBox(target as HTMLIFrameElement);
    } else {
      this.removeResizeBox();
    }
  };

  createResizeBox(iframe: HTMLIFrameElement) {
    this.iframe = iframe;

    const rect = iframe.getBoundingClientRect();
    const wrapper = document.createElement("div");
    wrapper.className = "iframe-resize-wrapper";
    wrapper.style.position = "relative";
    wrapper.style.display = "inline-block";
    wrapper.style.width = rect.width + "px";
    wrapper.style.height = rect.height + "px";

    iframe.parentNode?.insertBefore(wrapper, iframe);
    wrapper.appendChild(iframe);

    const handle = document.createElement("div");
    handle.className = "iframe-resize-handle";
    handle.style.position = "absolute";
    handle.style.width = "10px";
    handle.style.height = "10px";
    handle.style.right = "0";
    handle.style.bottom = "0";
    handle.style.cursor = "nwse-resize";
    handle.style.background = "rgba(0,0,0,0.5)";
    wrapper.appendChild(handle);

    this.box = wrapper;
    this.handle = handle;
  }

  startResize = (e: MouseEvent) => {
    if (e.target === this.handle) {
      e.preventDefault();
      this.dragging = true;
    }
  };

  onResize = (e: MouseEvent) => {
    if (!this.dragging || !this.box || !this.iframe) return;

    const boxRect = this.box.getBoundingClientRect();
    const width = e.clientX - boxRect.left;
    const height = e.clientY - boxRect.top;

    this.box.style.width = width + "px";
    this.box.style.height = height + "px";
    this.iframe.style.width = "100%";
    this.iframe.style.height = "100%";
  };

  stopResize = () => {
    this.dragging = false;
  };

  removeResizeBox() {
    if (this.box && this.iframe) {
      this.box.parentNode?.insertBefore(this.iframe, this.box);
      this.box.remove();
    }
    this.box = null;
    this.handle = null;
    this.iframe = null;
  }
}
