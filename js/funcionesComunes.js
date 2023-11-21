export function esCadenaNoVacia(valor) {
  return typeof valor === "string" && valor.trim() !== "";
}
