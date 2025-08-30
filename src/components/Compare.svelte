<script>
    // Props ohne führenden Slash übergeben, z. B. "img/skizze.jpg"
    export let before = "img/skizze.jpg";
    export let after  = "img/oel.jpg";
  
    // Astros Basis-Pfad, z. B. "/artificial-impasto/"
    const BASE = import.meta.env.BASE_URL;
  
    const url = (p) => p.startsWith("http") ? p : BASE + p.replace(/^\/+/, "");
  </script>
  
  <div class="relative max-w-[900px] mx-auto">
    <img src={url(after)} alt="Nachher" class="block w-full" />
    <div class="absolute inset-0 overflow-hidden" style={`clip-path: inset(0 50% 0 0)`}>
      <img src={url(before)} alt="Vorher" class="block w-full" />
    </div>
    <input type="range" min="0" max="100" value="50" aria-label="Vergleich" class="absolute left-0 right-0 bottom-2 w-full" />
  </div>

<script>
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".cmp").forEach(root => {
      const range = root.querySelector(".range");
      const set = v => root.style.setProperty("--split", v + "%");
  
      // initial setzen
      set(range.value);
  
      range.addEventListener("input", e => set(e.target.value));
    });
  });
    </script>