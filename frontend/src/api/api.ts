export async function sendMessage(message: string): Promise<string> {
  // per ora simuliamo la risposta, poi sostituiremo con fetch verso il backend
  return new Promise((resolve) => {
    setTimeout(() => resolve(message), 500);
  });

  /*
  // quando backend pronto:
  const res = await fetch("http://localhost:8000/chat/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error("Errore nella richiesta");
  const data = await res.json();
  return data.reply;
  */
}