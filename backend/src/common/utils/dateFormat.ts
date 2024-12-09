/** Formatea una fecha al formato DD-MM-YYYY */
export function formatDate(date: Date): string {
  return [
    date.getDate().toString().padStart(2, '0'), // Día
    (date.getMonth() + 1).toString().padStart(2, '0'), // Mes
    date.getFullYear(), // Año
  ].join('-');
}

/** Formatea las fechas de un arreglo de objetos, los cuales tengan current_at como atributo */
export function arrayFormatDate(arrayObj: any[]): any[] {
  if (!arrayObj[0].created_at) {
    return arrayObj;
  }
  return arrayObj.map((result) => ({
    ...result,
    created_at: result.created_at ? formatDate(new Date(result.created_at)) : null,
  }));
}
/** Formatea las fechas de un objeto, los cuales tengan current_at como atributo */
export function objectFormatDate(obj: any): any {
  if (!obj.created_at) {
    return obj;
  }
  obj.created_at = formatDate(new Date(obj.created_at));
  return obj;
}
