// Simulación (aproximada) de un lector de pantalla. Calcula el orden de lectura
// y, para cada parada, el rol + nombre accesible + estado que un SR anunciaría.
// Es una APROXIMACIÓN: no reproduce accname completo, tablas, live regions, ni los
// modos de navegación de NVDA/JAWS. Corre en el frontend sobre el Document del iframe.

export type SrStop = {
  el: Element;
  role: string;
  name: string;
  state: string;
};

const HEADING = /^H([1-6])$/;
const LANDMARKS = ["NAV", "MAIN", "HEADER", "FOOTER", "ASIDE"];

function isHidden(el: Element): boolean {
  const style = window.getComputedStyle(el);
  if (style.display === "none" || style.visibility === "hidden") return true;
  if ((el as HTMLElement).hidden) return true;
  if (el.getAttribute("aria-hidden") === "true") return true;
  return false;
}

function collapse(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function textOf(el: Element): string {
  return collapse(el.textContent || "");
}

// Solo el texto de los nodos de texto hijos DIRECTOS (no descendientes), para no
// duplicar el texto de enlaces/botones que se anuncian por su cuenta.
function directText(el: Element): string {
  let s = "";
  el.childNodes.forEach((n) => {
    if (n.nodeType === 3) s += n.textContent;
  });
  return collapse(s);
}

function labelFromIds(doc: Document, ids: string): string {
  return ids
    .split(/\s+/)
    .map((id) => {
      const ref = doc.getElementById(id);
      return ref ? textOf(ref) : "";
    })
    .filter(Boolean)
    .join(" ")
    .trim();
}

export function getRole(el: Element): string {
  const roleMap: Record<string, string> = {
    banner: "Encabezado de página",
    navigation: "Navegación",
    main: "Contenido principal",
    contentinfo: "Pie de página",
    complementary: "Complementario",
    search: "Búsqueda",
    button: "Botón",
    link: "Enlace",
    img: "Imagen",
    list: "Lista",
    listitem: "Elemento de lista",
    textbox: "Campo de texto",
    checkbox: "Casilla",
    radio: "Opción",
  };
  const explicit = el.getAttribute("role");
  if (explicit && roleMap[explicit]) return roleMap[explicit];

  const tag = el.tagName;
  const h = HEADING.exec(tag);
  if (h) return `Encabezado nivel ${h[1]}`;

  switch (tag) {
    case "A":
      return "Enlace";
    case "BUTTON":
      return "Botón";
    case "NAV":
      return "Navegación";
    case "MAIN":
      return "Contenido principal";
    case "HEADER":
      return "Encabezado de página";
    case "FOOTER":
      return "Pie de página";
    case "ASIDE":
      return "Complementario";
    case "IMG":
      return "Imagen";
    case "UL":
    case "OL":
      return "Lista";
    case "LI":
      return "Elemento de lista";
    case "SELECT":
      return "Lista desplegable";
    case "TEXTAREA":
      return "Campo de texto";
    case "INPUT": {
      const type = (el.getAttribute("type") || "text").toLowerCase();
      if (type === "checkbox") return "Casilla";
      if (type === "radio") return "Opción";
      if (type === "button" || type === "submit" || type === "reset") return "Botón";
      return "Campo de texto";
    }
    default:
      return "Texto";
  }
}

export function getAccessibleName(el: Element): string {
  const doc = el.ownerDocument;
  const ariaLabel = el.getAttribute("aria-label");
  if (ariaLabel && ariaLabel.trim()) return ariaLabel.trim();

  const labelledby = el.getAttribute("aria-labelledby");
  if (labelledby) {
    const n = labelFromIds(doc, labelledby);
    if (n) return n;
  }

  const tag = el.tagName;

  // Landmarks: solo nombre por aria-*, no todo su contenido de texto.
  if (LANDMARKS.includes(tag)) return "";

  if (tag === "IMG") {
    const alt = el.getAttribute("alt");
    if (alt === null) return "imagen sin texto alternativo";
    if (alt.trim() === "") return ""; // decorativa: se filtra en classify
    return alt.trim();
  }

  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
    const id = el.getAttribute("id");
    if (id) {
      const lbl = doc.querySelector(`label[for="${CSS.escape(id)}"]`);
      if (lbl && textOf(lbl)) return textOf(lbl);
    }
    const wrap = el.closest("label");
    if (wrap && textOf(wrap)) return textOf(wrap);
    const ph = el.getAttribute("placeholder");
    if (ph && ph.trim()) return ph.trim();
    const title = el.getAttribute("title");
    if (title && title.trim()) return title.trim();
    return "campo sin etiqueta";
  }

  const t = textOf(el);
  if (t) return t;
  const title = el.getAttribute("title");
  if (title && title.trim()) return title.trim();
  return "";
}

export function getState(el: Element): string {
  const parts: string[] = [];
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
    if (el.hasAttribute("required") || el.getAttribute("aria-required") === "true") {
      parts.push("requerido");
    }
    if ((el as HTMLInputElement).disabled) parts.push("deshabilitado");
    const type = (el.getAttribute("type") || "").toLowerCase();
    if (type === "checkbox" || type === "radio") {
      parts.push((el as HTMLInputElement).checked ? "marcado" : "no marcado");
    }
  }
  return parts.join(", ");
}

function classify(el: Element): SrStop | null {
  const tag = el.tagName;
  const announceable =
    HEADING.test(tag) ||
    (tag === "A" && el.hasAttribute("href")) ||
    tag === "BUTTON" ||
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    tag === "IMG" ||
    LANDMARKS.includes(tag);

  if (announceable) {
    if (tag === "IMG") {
      const alt = el.getAttribute("alt");
      if (alt !== null && alt.trim() === "") return null; // imagen decorativa
    }
    return { el, role: getRole(el), name: getAccessibleName(el), state: getState(el) };
  }

  // Un <label> no se anuncia por su cuenta: su texto se surte a través del control
  // asociado (un SR real lo anuncia como nombre del campo, no como texto suelto).
  if (tag === "LABEL") return null;

  // Bloque de texto: solo si tiene texto directo propio.
  const dt = directText(el);
  if (dt) return { el, role: "Texto", name: dt, state: "" };

  return null;
}

export function buildReadingOrder(doc: Document): SrStop[] {
  const stops: SrStop[] = [];
  const body = doc.body;
  if (!body) return stops;

  const walker = doc.createTreeWalker(body, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      const el = node as Element;
      if (["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE"].includes(el.tagName)) {
        return NodeFilter.FILTER_REJECT;
      }
      if (isHidden(el)) return NodeFilter.FILTER_REJECT; // rechaza el subárbol
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  let node = walker.nextNode();
  while (node) {
    const stop = classify(node as Element);
    if (stop) stops.push(stop);
    node = walker.nextNode();
  }
  return stops;
}

export function describe(stop: SrStop): string {
  let out = stop.role;
  if (stop.name) out += `: ${stop.name}`;
  if (stop.state) out += ` (${stop.state})`;
  return out;
}
