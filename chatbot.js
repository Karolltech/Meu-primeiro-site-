const chatBody = document.getElementById('chatBody');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const chatToggle = document.getElementById('chatToggle');
const chatWidget = document.getElementById('chatWidget');
const quickReplies = document.querySelectorAll('.chip');

const fallbackResponses = [
  {
    keywords: ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'hello', 'hi'],
    answer: 'Olá! Sou o assistente virtual da Blue & Soluções. Como posso ajudar você a fortalecer a presença digital do seu negócio?'
  },
  {
    keywords: ['serviços', 'servicos', 'serviço', 'soluções', 'solucoes', 'oque voces fazem', 'o que vocês fazem'],
    answer: 'A Blue & Soluções atua com atendimento, consultoria e soluções digitais para fortalecer negócios e criar experiências mais eficientes e competitivas.'
  },
  {
    keywords: ['contato', 'telefone', 'whatsapp', 'falar', 'atendimento'],
    answer: 'Você pode entrar em contato com nossa equipe pelo WhatsApp ou pelo formulário do site. Estamos prontos para atender com atenção e estratégia.'
  },
  {
    keywords: ['orcamento', 'orçamento', 'preço', 'valor', 'cotacao', 'cotaçao'],
    answer: 'Para receber uma proposta personalizada, fale com nossa equipe e descreva sua necessidade. Vamos indicar a melhor solução para o seu caso com foco em resultado.'
  },
  {
    keywords: ['site', 'website', 'empresa', 'blue', 'soluções'],
    answer: 'A Blue & Soluções é uma empresa focada em presença digital estratégica, suporte e comunicação eficiente para negócios em crescimento.'
  },
  {
    keywords: ['obrigado', 'thanks', 'obg'],
    answer: 'De nada! Estamos sempre à disposição para ajudar seu negócio a crescer com mais inteligência e presença.'
  },
  {
    keywords: ['tchau', 'sair', 'adeus', 'bye'],
    answer: 'Até logo! Foi um prazer conversar com você. A Blue & Soluções está pronta para acompanhar sua próxima etapa.'
  }
];

function addMessage(text, sender = 'bot') {
  const message = document.createElement('div');
  message.className = `message ${sender}`;
  message.textContent = text;
  chatBody.appendChild(message);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function getLocalReply(input) {
  const text = input.toLowerCase().trim();

  if (!text) {
    return 'Você pode me enviar uma mensagem.';
  }

  for (const item of fallbackResponses) {
    if (item.keywords.some(keyword => text.includes(keyword))) {
      return item.answer;
    }
  }

  return 'Entendi. Para uma resposta mais detalhada, nossa equipe pode te ajudar diretamente. A Blue & Soluções está pronta para atender sua demanda.';
}

async function getBotReply(input) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: input })
    });

    if (!response.ok) {
      throw new Error('Resposta do backend indisponível');
    }

    const data = await response.json();
    return data.reply || getLocalReply(input);
  } catch (error) {
    return getLocalReply(input);
  }
}

async function sendMessage() {
  const value = userInput.value.trim();

  if (!value) {
    return;
  }

  addMessage(value, 'user');
  userInput.value = '';

  const reply = await getBotReply(value);
  addMessage(reply, 'bot');
}

sendBtn.addEventListener('click', () => {
  sendMessage();
});

userInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

quickReplies.forEach((button) => {
  button.addEventListener('click', () => {
    userInput.value = button.textContent.trim();
    sendMessage();
  });
});

chatToggle.addEventListener('click', () => {
  chatWidget.classList.toggle('collapsed');
  const isCollapsed = chatWidget.classList.contains('collapsed');
  chatToggle.textContent = isCollapsed ? '+' : '−';
});

addMessage('Olá! Sou o assistente virtual da Blue & Soluções. Como posso ajudar você a fortalecer a presença digital do seu negócio?', 'bot');
