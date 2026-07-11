// Forma de cada hallazgo de accesibilidad que viaja al frontend.
// message: qué pasa (constante por categoría o con el ratio medido).
// location: pista de DÓNDE está el elemento (tag + texto, src resumido, índice).
export type Finding = {
  message: string;
  location: string;
};
