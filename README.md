# 🔵 Blue & Soluções

> Site em construção da **Blue & Soluções** — empresa de desenvolvimento web e soluções digitais. Construído com HTML, CSS e JavaScript puro, sem frameworks ou dependências externas.

---

## 📁 Estrutura do Projeto

```
blue-e-soluçoes/
├── index.html          # Página principal (landing page)
├── minha-historia.html # Página "Minha História" com timeline
├── styles.css          # Estilos globais (index)
├── script.js           # Lógica JS (navegação, dropdowns, animações)
└── BS.png              # Logo da empresa
```

---

## 🚀 Como Rodar

Nenhuma instalação necessária. Por ser HTML/CSS/JS puro, basta abrir no navegador:

```bash
# Opção 1 — abrir diretamente
Abra o arquivo index.html no seu navegador

---

## ✨ Funcionalidades

### Navegação
- **Header fixo** com `backdrop-filter: blur` e efeito de sombra ao rolar
- **Menu dropdown** com animação de entrada/saída e suporte completo a teclado (`Escape` fecha o menu)
- **Menu hambúrguer** responsivo para mobile, com animação de ícone (☰ → ✕)
- Fecha dropdown ao clicar fora ou ao navegar para outro item

### Visual & Animações
- **Logo animada** com entrada suave (`fadeInUp` + `scale`) e efeito `glow` pulsante
- **Gradiente de fundo** dark com radial-gradients em azul e roxo
- **Botões CTA** com efeito ripple, hover elevado e animação no ícone
- **Timeline** na página de história com cards glassmorphism e hover com deslocamento lateral

### Acessibilidade
- `aria-haspopup`, `aria-expanded`, `aria-controls` nos dropdowns
- Link "Pular para conteúdo principal" (`skip-link`) na página de história
- Roles ARIA (`role="menubar"`, `role="menuitem"`, etc.)
- `aria-live` region para leitores de tela
- Navegação completa por teclado

### Responsividade
- Layout adaptado para mobile (`max-width: 768px`)
- Logo e botões reajustam tamanho e espaçamento
- Menu colapsável com slide lateral

---

## 🎨 Design Do Sistema

| Token | Valor |
|---|---|
| `--primary-color` | `#389fff` |
| `--secondary-color` | `#0c75ff` |
| `--bg-dark` | `#0a0a0a` |
| `--text-color` | `#e4d9d9` |
| `--gradient` | `linear-gradient(→ #389fff, #0c75ff, #1303f8)` |

**Fontes:** [Chonburi](https://fonts.google.com/specimen/Chonburi) (títulos) + [Poppins](https://fonts.google.com/specimen/Poppins) (corpo)

---

## 📄 Páginas

### `index.html` — Principal
Landing page com hero section, logo animada e dois botões de call-to-action: *Começar projeto* e *Conhecer a Blue*.

### `minha-historia.html` — Minha História
Página com layout de **timeline vertical**, apresentando a origem e missão da Blue & Soluções, e uma seção CTA convidando o visitante a iniciar um projeto.

---

## 🛠️ Tecnologias

- **HTML5** semântico
- **CSS3** — variáveis, `@keyframes`, `backdrop-filter`, `clamp()`, Grid & Flexbox
- **JavaScript** — vanilla ES6+, sem dependências
- **Google Fonts** — Chonburi + Poppins

---

## 👤 Sobre

Projeto criado por **Blue & Soluções** em 2026, desenvolvido como laboratório prático durante o curso de Análise e Desenvolvimento de Sistemas. O objetivo é transformar aprendizado em tecnologia real, entregando presença digital de qualidade.

---

> *"Seu negócio não pode ser invisível. A Blue cria seu palco digital."*
