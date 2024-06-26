import { useState } from 'react';
import style from './App.module.css';
import { IoCloudUploadOutline } from "react-icons/io5";
import { createWorker } from 'tesseract.js';
import { requestGpt } from './fechData/callGpt';

type Message = {
  role: string;
  content: string;
};

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [lineswords, setLineswords] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      console.log("file nulo");
      return;
    }

    const worker = await createWorker('eng');
    const ret = await worker.recognize(file);
    setLineswords(ret.data.text);
    await worker.terminate();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmitChat = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { elements } = e.currentTarget;
    const askElement = elements.namedItem("ask") as HTMLInputElement;
    const inputaskElement = askElement instanceof HTMLInputElement;
    if (!inputaskElement || !inputaskElement === null) return;
    const ask = askElement.value;
    
  // Update messages with user input
  setMessages(prevMessages => [...prevMessages, { role: 'user', content: ask }])

  // Make API call to OpenAI
  const response = await requestGpt(ask, lineswords);

  // Update messages with assistant response
  setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: response.choices[0].message.content }]);
  askElement.value = "";
  };

  return (
    <main className={style.main}>
      <aside className={style.left}>
        <form onSubmit={handleSubmit}>
          <div className={style.container}>
            <input type="file" id='inputfile' name="file" className={style.inputfile} onChange={handleChange} />
            <label htmlFor='inputfile' className={style.labelFile}>
              <IoCloudUploadOutline size={20} /> Upload file
            </label>
          </div>
          <div className={style.container}>
            <button type="submit" value="send" className={style.submit}>
              Send
            </button>
          </div>
        </form>
      </aside>
      <section className={style.right}>
        <div className={style.contTranscript}>
          { 
            lineswords.length ? <p className={style.trasncriptLines}>{lineswords}</p>
            : <p className={style.trasncriptLinesCenter}>Aún no hay contenido para mostrar</p>
          }
        </div>
        <div className={style.contIa}>
          <div className={style.contResponseIa}>
            {messages.map((msg, index) => (
              <div key={index}>
                <p className={msg.role === 'user' ? style.userMessage : style.assistantMessage}>
                  <strong>{msg.role}:</strong> {msg.content}
                </p>
              </div>
            ))}
          </div>
          <form className={style.form} onSubmit={handleSubmitChat}>
            <input
              type="text" placeholder='Escribe algo para chatear con la IA'
              name="ask" className={style.inputText} />
            <button type='submit' className={style.Send}>
              Enviar
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default App;
