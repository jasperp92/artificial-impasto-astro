import { visit } from "unist-util-visit";

export default function rehypeTableLabels() {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.tagName !== "table" || !Array.isArray(node.children)) return;

      const headers = [];

      // Header auslesen
      const thead = node.children.find((c) => c.tagName === "thead");
      if (thead && Array.isArray(thead.children)) {
        const row = thead.children.find((c) => c.tagName === "tr");
        if (row && Array.isArray(row.children)) {
          row.children.forEach((th) => {
            if (th.tagName === "th" && Array.isArray(th.children)) {
              headers.push(th.children[0]?.value || "");
            }
          });
        }
      }

      // data-label in td schreiben
      const tbody = node.children.find((c) => c.tagName === "tbody");
      if (tbody && Array.isArray(tbody.children)) {
        tbody.children.forEach((tr) => {
          if (tr.tagName === "tr" && Array.isArray(tr.children)) {
            tr.children.forEach((td, i) => {
              if (td.tagName === "td") {
                td.properties = td.properties || {};
                td.properties["data-label"] = headers[i] || "";
              }
            });
          }
        });
      }
    });
  };
}
