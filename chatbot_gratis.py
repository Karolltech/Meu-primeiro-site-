import json
import mimetypes
import os
import re
import urllib.parse
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


PORT = 5000
SERVER_ROOT = os.path.dirname(os.path.abspath(__file__))


def load_env_file():
    env_path = os.path.join(SERVER_ROOT, ".env")
    if not os.path.exists(env_path):
        return

    with open(env_path, "r", encoding="utf-8") as file:
        for line in file:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


load_env_file()


def gerar_resposta_ia(mensagem: str):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return None

    base_url = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1").rstrip("/")
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    payload = {
        "model": model,
        "messages": [
            {
                "role": "system",
                "content": "Você é o assistente virtual premium da Blue & Soluções, uma empresa de soluções digitais e presença online para negócios. Responda de forma curta, elegante, amigável e profissional. Use tom sofisticado, porém acessível. Fale sobre serviços, contato, orçamento, estratégia digital, desenvolvimento web, suporte e atendimento. Sempre reforçe que a Blue & Soluções ajuda negócios a crescer com presença digital forte e inteligente."
            },
            {
                "role": "user",
                "content": mensagem
            }
        ],
        "temperature": 0.7,
        "max_tokens": 220
    }

    request = urllib.request.Request(
        f"{base_url}/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        },
        method="POST"
    )

    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            data = json.loads(response.read().decode("utf-8"))
        content = data["choices"][0]["message"]["content"].strip()
        return content if content else None
    except Exception:
        return None


def responder(mensagem: str) -> str:
    texto = mensagem.strip().lower()

    if not texto:
        return "Olá! Como posso ajudar você hoje?"

    if texto in {"sair", "exit", "bye", "tchau", "adeus"}:
        return "Até logo! Estamos à disposição para ajudar você."

    if texto in {"oi", "olá", "ola", "bom dia", "boa tarde", "boa noite", "hello", "hi"}:
        return "Olá! Sou o assistente virtual da Blue & Soluções. Como posso ajudar você a elevar a presença digital do seu negócio?"

    if "blue" in texto or "soluções" in texto or "empresa" in texto:
        return "A Blue & Soluções é especializada em soluções digitais, estratégia online e atendimento que fortalece negócios com presença digital sólida e inteligente."

    if "serviço" in texto or "servicos" in texto or "solução" in texto:
        return "Nós entregamos soluções personalizadas para negócios, com foco em suporte, comunicação digital e crescimento estratégico."

    if "contato" in texto or "telefone" in texto or "whatsapp" in texto:
        return "Você pode entrar em contato pela nossa equipe via WhatsApp ou pelo formulário do site. Estamos prontos para atender com atenção e estratégia."

    if "preço" in texto or "valor" in texto or "orcamento" in texto or "orçamento" in texto:
        return "Para definir o valor ideal, nossa equipe precisa entender sua demanda e objetivos. Assim, entregamos uma proposta alinhada ao seu projeto."

    if "horario" in texto or "horário" in texto or "atendimento" in texto:
        return "Atendemos com foco em qualidade e agilidade durante o horário comercial, com disponibilidade para conversar sobre seu projeto."

    if "site" in texto or "website" in texto:
        return "Você pode conhecer mais sobre a Blue & Soluções pelo site e descobrir como transformar sua presença digital em vantagem competitiva."

    if "suporte" in texto or "ajuda" in texto:
        return "Claro! Posso orientar sobre nossos serviços, contato e como a Blue & Soluções pode apoiar seu negócio."

    if "instagram" in texto or "redes" in texto or "social" in texto:
        return "A Blue & Soluções também está presente nas redes sociais. Consulte o site para encontrar os canais oficiais e acompanhar novidades."

    if "quero" in texto and "contratar" in texto:
        return "Ótimo! Fale com nossa equipe pelo WhatsApp ou formulário do site para receber uma proposta personalizada para o seu negócio."

    if "obrigado" in texto or "thanks" in texto or "obg" in texto:
        return "De nada! Estamos aqui para ajudar seu negócio a crescer com estratégia e presença digital."

    if "nome" in texto:
        return "Sou o assistente virtual da Blue & Soluções, pronto para ajudar você com soluções digitais e atendimento de alto nível."

    resposta = re.sub(r"\s+", " ", mensagem).strip()
    return f"Entendi. Sobre '{resposta}', a melhor forma de avançar é conversar com nossa equipe para receber uma solução pensada para o seu contexto. A Blue & Soluções está pronta para ajudar você a crescer."


class ChatHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/api/chat":
            self.send_response(405)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Use POST para enviar a mensagem."}).encode("utf-8"))
            return

        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        if path in ("", "/"):
            path = "/index.html"

        path = path.lstrip("/")
        if not path or path.startswith("api/"):
            path = "index.html"

        abs_path = os.path.join(SERVER_ROOT, path)
        if os.path.isdir(abs_path):
            abs_path = os.path.join(abs_path, "index.html")

        if not os.path.exists(abs_path):
            self.send_error(404, "Arquivo não encontrado")
            return

        self.send_response(200)
        mime_type, _ = mimetypes.guess_type(abs_path)
        if mime_type:
            self.send_header("Content-Type", mime_type)
        self.end_headers()
        with open(abs_path, "rb") as file:
            self.wfile.write(file.read())

    def do_POST(self):
        if self.path != "/api/chat":
            self.send_response(404)
            self.end_headers()
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            raw = self.rfile.read(length)
            data = json.loads(raw.decode("utf-8")) if raw else {}
        except Exception:
            data = {}

        message = str(data.get("message", "")).strip()
        reply = gerar_resposta_ia(message) or responder(message)
        payload = json.dumps({"reply": reply}).encode("utf-8")

        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def log_message(self, format, *args):
        return


def run_server():
    handler = lambda *args, **kwargs: ChatHandler(*args, directory=SERVER_ROOT, **kwargs)
    server = ThreadingHTTPServer(("0.0.0.0", PORT), handler)
    print(f"Servidor ativo em http://localhost:{PORT}")
    print("Abra o navegador e acesse http://localhost:5000")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor encerrado.")
        server.server_close()


if __name__ == "__main__":
    run_server()
