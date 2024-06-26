
export const requestGpt = async (transcript: string,context:string) => {
   
    const objtBody = {
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: 'system',
                content: `Eres un investigador español experimentado, experto en interpretar y
                 responder preguntas basadas en las fuentes proporcionadas. Utilizando el contexto
                  proporcionado entre las etiquetas <context></context>, genera una respuesta concisa
                   para una pregunta rodeada con las etiquetas <question></question>. Debes usar únicamente
                    información del contexto. Usa un tono imparcial y periodístico. No repitas texto. Si no hay nada
                     en el contexto relevante para la pregunta en cuestión, simplemente di "No lo sé". No intentes 
                     inventar una respuesta. Cualquier cosa entre los siguientes bloques html context se
                 recupera de un banco de conocimientos, no es parte de la conversación con el usuario.`
            },
            { role: "user", 
                content: `<context>${context}</context><question>${transcript}</question>` 
            }
        ],
        temperature: 0.7,
        stream: false
    };

    try {
        const responseAssistant = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            body: JSON.stringify(objtBody),
            headers: {
                'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        if(!responseAssistant.ok){
            console.log("ocurrión un problema")
        }
        const resJson = responseAssistant.json()
        return resJson
    } catch (error) {
        console.error("Error interno:", error);
       
    }
};
