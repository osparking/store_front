import Quill from "quill";

const BlockEmbed = Quill.import("blots/block/embed");

class CustomVideoBlot extends BlockEmbed {
  static create(value) {
    const node = super.create();

    // value가 string(URL) 또는 object({url, size}) 둘 다 대응
    const url = typeof value === "string" ? value : value?.url ?? "";
    const size = typeof value === "object" ? value?.size ?? 0 : 0;

    node.setAttribute("src", url);
    node.setAttribute("controls", "true");
    node.setAttribute("preload", "metadata");
    node.setAttribute("data-size", String(size));
    node.setAttribute("style", "max-width:100%; height:auto;");
    return node;
  }

  static value(node) {
    return {
      url: node.getAttribute("src"),
      size: parseInt(node.getAttribute("data-size") || "0", 10),
    };
  }
}

CustomVideoBlot.blotName = "customVideo";
CustomVideoBlot.tagName = "video";
CustomVideoBlot.className = "ql-custom-video";

// ✅ 중복 등록 방지 (여러 에디터에서 import해도 안전)
if (!Quill.imports["blots/customVideo"]) {
  Quill.register(CustomVideoBlot, true);
}

export default CustomVideoBlot;