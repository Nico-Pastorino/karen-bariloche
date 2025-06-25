// Función para obtener la cotización del dólar blue desde una API externa
export async function getDollarRates() {
  try {
    // Utilizamos la API de Bluelytics que proporciona cotizaciones del dólar en Argentina
    const response = await fetch("https://api.bluelytics.com.ar/v2/latest")
    const data = await response.json()

    return {
      blue: data.blue.value_sell, // Valor de venta del dólar blue
      official: data.oficial.value_sell, // Valor de venta del dólar oficial
    }
  } catch (error) {
    console.error("Error al obtener la cotización del dólar:", error)
    // Devolvemos valores por defecto en caso de error
    return {
      blue: 1300,
      official: 1200,
    }
  }
}