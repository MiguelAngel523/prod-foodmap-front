import Groq from 'groq-sdk'
import platsService from '@/services/PlatsService.js'

const plats = await platsService.getPlats()
const client = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
})

export function useIA() {
  async function recomendarPlato(respuestas) {
    const prompt = construirPrompt(respuestas)

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content:
            'Eres un asistente de restaurante. Respondes SOLO con JSON válido, sin texto adicional ni backticks.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 256,
      temperature: 0.3,
    })

    const texto = response.choices[0].message.content
    return parsearRespuesta(texto)
  }

  function construirPrompt(respuestas) {
    return `
Dado este JSON con todos los platos disponibles:
${JSON.stringify(plats.data, null, 2)}

El cliente tiene estas preferencias:
${JSON.stringify(respuestas, null, 2)}

Responde SOLO con un JSON con esta forma:
{
  "id": "id_del_plato",
  "nombre": "nombre del plato",
  "razon": "mensaje breve cautivador del plato para el cliente"
}
    `
  }

  function parsearRespuesta(texto) {
    const match = texto.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('Respuesta inválida de la IA')
    return JSON.parse(match[0])
  }

  return { recomendarPlato }
}
