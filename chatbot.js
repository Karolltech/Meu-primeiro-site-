const chatBody = document.getElementById('chatBody');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const chatToggle = document.getElementById('chatToggle');
const chatWidget = document.getElementById('chatWidget');
const quickReplies = document.querySelectorAll('.chip');
const serviceLinks = document.querySelectorAll('.service-chat');
const chatOpenLinks = document.querySelectorAll('.chat-open');

if (window.matchMedia('(max-width: 768px)').matches) {
  chatWidget.classList.add('collapsed');
  chatToggle.textContent = '+';
  chatToggle.setAttribute('aria-label', 'Abrir chat');
}

const fallbackResponses = [
  {
    keywords: ['consultoria', 'consultoria digital'],
    answer: 'Na consultoria digital, analisamos sua presença online, identificamos oportunidades e montamos um plano prático para melhorar os resultados do seu negócio. Quer solicitar uma avaliação?'
  },
  {
    keywords: ['manutenção', 'manutencao', 'manter site', 'suporte técnico', 'suporte tecnico'],
    answer: 'O serviço de manutenção mantém seu site seguro, atualizado e funcionando corretamente, com correções, melhorias e suporte técnico. Quer saber como contratar?'
  },
  {
    keywords: ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'hello', 'hi'],
    answer: 'Olá! Sou o assistente virtual da Blue & Soluções. Posso te ajudar com sites, presença digital, orçamento e o melhor caminho para o seu projeto.'
  },
  {
    keywords: ['serviços', 'servicos', 'serviço', 'soluções', 'solucoes', 'oque voces fazem', 'o que vocês fazem', 'trabalho', 'projetos'],
    answer: 'A Blue & Soluções atua com desenvolvimento web, consultoria digital, suporte e soluções para fortalecer a presença da sua empresa no mercado.'
  },
  {
    keywords: ['contato', 'telefone', 'whatsapp', 'falar', 'atendimento', 'conversar'],
    answer: 'Você pode falar com nossa equipe pelo WhatsApp ou entrar em contato pelo site. Estamos prontos para atender com atenção e estratégia.'
  },
  {
    keywords: ['orcamento', 'orçamento', 'preço', 'valor', 'cotacao', 'cotaçao', 'proposta', 'investimento'],
    answer: 'Para receber uma proposta personalizada, me diga um pouco sobre seu projeto e sua necessidade. Assim, a equipe pode indicar a solução ideal para o seu objetivo.'
  },
  {
    keywords: ['site', 'website', 'empresa', 'blue', 'soluções', 'marketing digital', 'presença online'],
    answer: 'A Blue & Soluções ajuda negócios a crescer com uma presença digital forte, moderna e alinhada com os objetivos da empresa.'
  },
  {
    keywords: ['quero um site', 'quero site', 'criar site', 'site novo', 'landing page', 'loja virtual'],
    answer: 'Ótimo! Fale sobre o tipo de projeto, público, objetivos e prazos. Com essas informações, a equipe pode te orientar sobre a melhor solução.'
  },
  {
    keywords: ['obrigado', 'thanks', 'obg', 'valeu'],
    answer: 'De nada! Estamos sempre à disposição para ajudar seu negócio a crescer com estratégia e presença digital.'
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
  if (window.location.protocol === 'file:') {
    return getLocalReply(input);
  }

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

serviceLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const message = link.dataset.chatMessage;
    if (!message) return;

    chatWidget.classList.remove('collapsed');
    chatToggle.textContent = '−';
    chatToggle.setAttribute('aria-label', 'Minimizar chat');
    userInput.value = message;
    sendMessage();
  });
});

chatOpenLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    chatWidget.classList.remove('collapsed');
    chatToggle.textContent = '−';
    chatToggle.setAttribute('aria-label', 'Minimizar chat');
    userInput.focus();
  });
});

chatToggle.addEventListener('click', () => {
  chatWidget.classList.toggle('collapsed');
  const isCollapsed = chatWidget.classList.contains('collapsed');
  chatToggle.textContent = isCollapsed ? '+' : '−';
  chatToggle.setAttribute('aria-label', isCollapsed ? 'Abrir chat' : 'Minimizar chat');
});

document.getElementById('chatWhatsapp')?.addEventListener('click', () => {
  window.open('https://wa.me/5511999999999?text=Ol%C3%A1%2C%20quero%20falar%20sobre%20um%20projeto%20digital.', '_blank');
});

const welcomeMessage = document.body.dataset.chatWelcome || 'Olá! Sou o assistente virtual da Blue & Soluções. Posso ajudar com sites, presença digital, orçamento e atendimento para o seu negócio.';
addMessage(welcomeMessage, 'bot');
