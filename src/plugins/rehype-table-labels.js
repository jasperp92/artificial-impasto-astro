import { visit } from "unist-util-visit";

export default function rehypeTableLabels() {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.tagName !== "table" || !Array.isArray(node.children)) return;

      let headers = [];

      // Header auslesen (falls vorhanden)
      const thead = node.children.find((c) => c.tagName === "thead");
      if (thead && Array.isArray(thead.children)) {
        const row = thead.children.find((c) => c.tagName === "tr");
        if (row && Array.isArray(row.children)) {
          headers = row.children
            .filter((th) => th.tagName === "th" && Array.isArray(th.children))
            .map((th) => {
              const text = th.children[0]?.value || "";
              return text.endsWith(":") ? text : text + ":";
            });
        }
      }

      // data-label in td schreiben (nur wenn headers existieren)
      if (headers.length > 0) {
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
      }
    });
  };
}
