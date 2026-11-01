(() => {
  'use strict';

  const CONFIG = {
    checkoutUrl: 'https://pay.cakto.com.br/yyscuaw',
    preco: {
      valor: 'R$ 27,90',
      promo: 'R$ 27,90',
      parcelamento: 'ou 3x de R$ 10,21',
    },
    utmKey: 'ins_utm_params',
  };

  const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'src', 'sck', 'fbclid', 'gclid'];

  const params = new URLSearchParams(window.location.search);
  const utms = {};
  for (const k of UTM_KEYS) {
    const v = params.get(k);
    if (v) utms[k] = v;
  }
  if (Object.keys(utms).length) {
    try { localStorage.setItem(CONFIG.utmKey, JSON.stringify(utms)); } catch (e) {}
  }

  function getStoredUtms() {
    try {
      const s = localStorage.getItem(CONFIG.utmKey);
      return s ? JSON.parse(s) : {};
    } catch (e) {
      return {};
    }
  }

  function buildCheckoutUrl() {
    const base = CONFIG.checkoutUrl;
    try {
      const u = new URL(base);
      const combined = { ...getStoredUtms(), ...utms };
      for (const k of UTM_KEYS) {
        if (combined[k]) u.searchParams.set(k, combined[k]);
      }
      return u.toString();
    } catch (e) {
      return base;
    }
  }

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));

  const hl = (t) => `<span class="hl">${t}</span>`;

  // Estado do quiz
  const state = {
    idx: 0,
    name: '',
    answers: {},
    weight: 75,
    height: 165,
    desiredWeight: 65,
  };

  const nome = () => esc(state.name || 'Você');

  // Dados das opções
  const IDADES = [
    { value: '18-27', emoji: '🌸', label: '18 – 27 anos', faixa: 'entre 18 e 27 anos' },
    { value: '28-39', emoji: '💐', label: '28 – 39 anos', faixa: 'entre 28 e 39 anos' },
    { value: '40-54', emoji: '🌺', label: '40 – 54 anos', faixa: 'entre 40 e 54 anos' },
    { value: '54+', emoji: '🌷', label: '54+ anos', faixa: 'acima de 54 anos' },
  ];

  const AREAS = [
    { value: 'papada', emoji: '😊', label: 'Papada', artigo: 'na' },
    { value: 'bracos', emoji: '💪', label: 'Braços', artigo: 'nos' },
    { value: 'barriga', emoji: '🤰', label: 'Barriga', artigo: 'na' },
    { value: 'cintura', emoji: '💝', label: 'Cintura', artigo: 'na' },
    { value: 'gluteos', emoji: '🍑', label: 'Glúteos', artigo: 'nos' },
    { value: 'coxas', emoji: '🦵', label: 'Coxas', artigo: 'nas' },
    { value: 'corpo-todo', emoji: '✨', label: 'Corpo Todo', artigo: 'no' },
  ];

  const RESULTADOS = [
    { value: 'saude', emoji: '❤️', label: 'Melhorar minha saúde', frase: 'melhorar sua saúde' },
    { value: 'peso', emoji: '⚖️', label: 'Perder peso de verdade', frase: 'perder peso de verdade' },
    { value: 'desinchar', emoji: '💧', label: 'Desinchar logo na primeira semana', frase: 'desinchar logo na primeira semana' },
    { value: 'energia', emoji: '⚡', label: 'Ter mais energia no dia a dia', frase: 'ter mais energia no dia a dia' },
    { value: 'autoestima', emoji: '🌸', label: 'Me sentir bem comigo mesma', frase: 'se sentir bem com você mesma' },
  ];

  const SINTOMAS = [
    { value: 'fome', emoji: '😣', label: 'Pouco tempo depois já sinto fome de novo', frase: 'sente fome de novo pouco tempo depois de comer' },
    { value: 'sono', emoji: '😴', label: 'Fico com sono ou sem energia', frase: 'fica com sono ou sem energia depois de comer' },
    { value: 'doce', emoji: '🍫', label: 'Sinto vontade de doce ou de beliscar', frase: 'sente vontade de doce ou de beliscar depois de comer' },
    { value: 'estufada', emoji: '🎈', label: 'Minha barriga fica estufada ou pesada', frase: 'sua barriga fica estufada ou pesada depois de comer' },
    { value: 'tudo', emoji: '🥴', label: 'Sinto um pouco de tudo isso', frase: 'sente fome rápida, cansaço e barriga estufada depois de comer' },
  ];

  const SONO = [
    { value: 'menos-5', emoji: '😴', label: 'Menos de 5 horas' },
    { value: '5-6', emoji: '🌙', label: '5 a 6 horas' },
    { value: '7-8', emoji: '😊', label: '7 a 8 horas' },
    { value: '9-mais', emoji: '💤', label: '9 horas ou mais' },
  ];

  const HORARIOS = [
    { value: 'manha', emoji: '🌅', label: 'Logo pela manhã', frase: 'logo pela manhã' },
    { value: 'antes-almoco', emoji: '🍽️', label: 'Antes do almoço', frase: 'antes do almoço' },
    { value: 'meio-tarde', emoji: '☕', label: 'No meio da tarde', frase: 'no meio da tarde' },
    { value: 'antes-jantar', emoji: '🌙', label: 'Antes do jantar', frase: 'antes do jantar' },
    { value: 'variavel', emoji: '🔄', label: 'Meus horários mudam bastante', frase: 'em horários flexíveis' },
  ];

  const DEPOIMENTOS = [
    { kg: '-8kg', frase: 'Perdi 8kg em 21 dias. Tive que jogar algumas calças e shorts fora.', nome: 'Maria', local: '47 Anos, Belo Horizonte', img: '/assets/antes-depois-maria-Bjz-z-hL.jpg' },
    { kg: '-9kg', frase: 'Minha pressão normalizou e o médico reduziu meu remédio.', nome: 'Rosana', local: '52 Anos, São Paulo', img: '/assets/antes-depois-rosana-BQrEG7CG.jpg' },
    { kg: '-7kg', frase: 'Me olhei no espelho e me reconheci de novo.', nome: 'Fernanda', local: '43 Anos, Recife', img: '/assets/antes-depois-fernanda-DB-hMpea.jpg' },
    { kg: '-11kg', frase: 'Voltei a ter energia pra cuidar dos meus filhos.', nome: 'Claudia', local: '35 Anos, Santa Catarina', img: '/assets/antes-depois-4-CXXOM7GR.jpg' },
  ];

  const acha = (lista, val) => lista.find((o) => o.value === val);

  function areasTexto() {
    const sel = (state.answers.ondeMudou || []).filter((v) => v !== 'corpo-todo');
    const partes = (sel.length ? sel : ['barriga']).map((v) => {
      const a = acha(AREAS, v);
      return a ? `${a.artigo} ${a.label}` : 'no corpo';
    });
    if (partes.length === 1) return partes[0];
    return `${partes.slice(0, -1).join(', ')} e ${partes[partes.length - 1]}`;
  }

  function imc() {
    const h = state.height / 100;
    const valor = state.weight / (h * h);
    const classe = valor >= 30 ? 'Obesidade' : valor >= 25 ? 'Sobrepeso' : valor >= 18.5 ? 'Normal' : 'Abaixo do peso';
    return { valor: valor.toFixed(1), classe };
  }

  function vagasAgora() {
    const h = new Date().getHours();
    return h < 7 ? 8 : h >= 23 ? 1 : Math.max(1, Math.round(8 - (h - 7) * (7 / 16)));
  }

  function logo() {
    return `<div class="logo"><img src="/assets/logo-formula-insulina.png" alt="A Fórmula da Insulina"></div>`;
  }

  function btn(label, { id = 'cta', verde = false, disabled = false } = {}) {
    return `<button type="button" id="${id}" class="${verde ? 'btn-quiz-green' : 'btn-quiz'}"${disabled ? ' disabled' : ''}>${label}</button>`;
  }

  function opcoes(lista, { sm = false, multi = false, selecionados = [] } = {}) {
    return `<div class="opts">${lista.map((o) => `
      <button type="button" class="quiz-option${selecionados.includes(o.value) ? ' selected' : ''}" data-value="${esc(o.value)}"${multi ? ' data-multi="1"' : ''}>
        ${o.emoji ? `<span class="opt-emoji">${o.emoji}</span>` : ''}
        <span class="opt-label${sm ? ' sm' : ''}">${esc(o.label)}</span>
      </button>`).join('')}</div>`;
  }

  function unica(root, campo, callback) {
    root.querySelectorAll('.quiz-option').forEach((b) => b.addEventListener('click', () => {
      root.querySelectorAll('.quiz-option').forEach((x) => x.classList.remove('selected'));
      b.classList.add('selected');
      state.answers[campo] = b.dataset.value;
      if (callback) callback(b.dataset.value);
      setTimeout(next, 280);
    }));
  }

  function multipla(root, campo) {
    const cta = root.querySelector('#cta');
    const sel = new Set(state.answers[campo] || []);
    cta.disabled = sel.size === 0;
    root.querySelectorAll('.quiz-option').forEach((b) => b.addEventListener('click', () => {
      const v = b.dataset.value;
      if (sel.has(v)) sel.delete(v); else sel.add(v);
      b.classList.toggle('selected', sel.has(v));
      state.answers[campo] = Array.from(sel);
      cta.disabled = sel.size === 0;
    }));
    cta.addEventListener('click', next);
  }

  const continuar = (root) => root.querySelector('#cta').addEventListener('click', next);

  function stepper(campo, unidade, min, max) {
    return {
      render: () => `
        <div class="stepper-value">${state[campo]}<span>${unidade}</span></div>
        <div class="stepper-btns">${[['-5', -5], ['−', -1], ['+', 1], ['+5', 5]]
          .map(([l, d]) => `<button type="button" class="stepper-btn" data-d="${d}">${l}</button>`).join('')}</div>`,
      wire(root, depois) {
        root.querySelectorAll('.stepper-btn').forEach((b) => b.addEventListener('click', () => {
          state[campo] = Math.max(min(), Math.min(max(), state[campo] + Number(b.dataset.d)));
          root.querySelector('.stepper-value').firstChild.textContent = state[campo];
          if (depois) depois();
        }));
      },
    };
  }

  function timer(fn, ms, tipo = 'timeout') {
    const idx = state.idx;
    const guard = () => { if (state.idx === idx) fn(); else clear(); };
    const id = tipo === 'interval' ? setInterval(guard, ms) : setTimeout(guard, ms);
    const clear = () => (tipo === 'interval' ? clearInterval(id) : clearTimeout(id));
    return clear;
  }

  // ---------------------------------------------------------------------
  // Telas do Funil
  // ---------------------------------------------------------------------

  const SCREENS = [
    // Tela 1 — Hero
    {
      key: 'hero', header: false,
      render() {
        return `
          <div class="hero">
            <div class="hero-logo">${logo()}</div>
            <h1 class="hero-h1">As Mulheres Acima de 40 Estão Trocando O ${hl('Ozempic')} Por Essa Mistura de ${hl('R$5')}</h1>
            <p class="hero-sub">Mistura “estranha” viraliza na internet por trazer resultado logo nos primeiros dias</p>
            <div class="hero-img">
              <div class="hero-glow"></div>
              <img class="hero-foto" src="/assets/doutora-hero.jpg" alt="Especialista">
              <div class="hero-callout">a mistura de R$5</div>
            </div>
            <p class="hero-prova"><strong>+12.847 mulheres</strong> já descobriram a versão certa para o seu corpo</p>
            ${btn('QUERO A RECEITA DA MISTURA', { verde: true })}
            <div class="hero-rodape">
              <span><b>✓</b> 100% gratuito</span>
              <i>·</i>
              <span><b>✓</b> Resultado na hora</span>
              <i>·</i>
              <span><b>✓</b> Menos de 2 minutos</span>
            </div>
          </div>`;
      },
      after: continuar,
    },

    // Tela 2 — Idade
    {
      key: 'idade',
      render: () => `<h2 class="title">Qual a sua idade?</h2>${opcoes(IDADES, { selecionados: [state.answers.idade] })}`,
      after: (root) => unica(root, 'idade'),
    },

    // Tela 3 — Corpo Atual
    {
      key: 'corpo',
      render: () => `
        <h2 class="title">Como está seu ${hl('corpo hoje?')}</h2>
        <div class="grid-2">
          ${[
            ['medio', 'Médio', '/assets/img-corpo-medio.webp'],
            ['acima-do-peso', 'Acima do peso', '/assets/img-corpo-acima.webp'],
            ['sobrepeso', 'Sobrepeso', '/assets/img-corpo-sobrepeso.webp'],
            ['plus-size', 'Plus Size', '/assets/img-corpo-plus.webp'],
          ].map(([v, l, img]) => `
            <button type="button" class="quiz-option col${state.answers.corpo === v ? ' selected' : ''}" data-value="${v}">
              <img class="corpo-img" src="${img}" alt="${l}">
              <span class="opt-label sm">${l}</span>
            </button>`).join('')}
        </div>`,
      after: (root) => unica(root, 'corpo'),
    },

    // Tela 4 — Onde mudou
    {
      key: 'onde-mudou',
      render: () => `
        <h2 class="title sm">Onde você mais sente que o seu ${hl('corpo mudou?')}</h2>
        <div class="areas">
          <img class="areas-img" src="/assets/areas-corpo.webp" alt="Áreas do corpo">
          <div class="areas-opts">${opcoes(AREAS, { sm: true, multi: true, selecionados: state.answers.ondeMudou || [] })}</div>
        </div>
        ${btn('Continuar')}`,
      after: (root) => multipla(root, 'ondeMudou'),
    },

    // Tela 5 — Prova Social
    {
      key: 'social-proof',
      render: () => `
        <div class="center-screen">
          <div class="circle-emoji">🤝</div>
          <h2 class="title">Você não está ${hl('sozinha.')}</h2>
          <div class="stat-card">
            <div class="stat-num">87,4%</div>
            <p class="muted">das mulheres ${(IDADES.find((o) => o.value === state.answers.idade) || { faixa: 'acima de 40 anos' }).faixa}</p>
            <p class="stat-txt">relatam acúmulo de gordura ${hl(areasTexto())} mesmo sem comer muito.</p>
          </div>
          ${btn('Entendi, quero continuar')}
        </div>`,
      after: continuar,
    },

    // Tela 6 — Notícia
    {
      key: 'news',
      render: () => `
        <h2 class="title">O efeito do Ozempic por R$5 ⭐</h2>
        <div class="news">
          <img class="news-img" src="/assets/entrevista-globo-Cr7zZD5Q.webp?v=4" alt="Notícia sobre a Mistura Natural">
        </div>
        ${btn('Continuar')}`,
      after: continuar,
    },

    // Tela 7 — Nome
    {
      key: 'nome',
      render: () => `
        <div class="stack-center">
          <h2 class="title">Como posso te chamar?</h2>
          <input id="inp-nome" type="text" class="input" placeholder="Seu primeiro nome" maxlength="30" autocomplete="given-name" value="${esc(state.name)}">
          ${btn('Continuar', { disabled: !state.name })}
        </div>`,
      after(root) {
        const inp = root.querySelector('#inp-nome');
        const cta = root.querySelector('#cta');
        const ok = () => {
          const v = inp.value.trim();
          if (!v) return;
          state.name = v.slice(0, 30);
          state.answers.nome = state.name;
          next();
        };
        inp.addEventListener('input', () => { cta.disabled = !inp.value.trim(); });
        inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') ok(); });
        cta.addEventListener('click', ok);
      },
    },

    // Tela 8 — Incômodo
    {
      key: 'incomodo',
      render: () => `
        <h2 class="title">${hl(nome())}, o que mais te incomoda no seu peso hoje?</h2>
        <div class="opts">${[
          ['autoestima', '💔', 'Minha autoestima', 'Me olho no espelho e não me reconheço mais'],
          ['saude', '🩺', 'Minha saúde', 'Sinto que minha saúde está em risco'],
          ['relacionamentos', '👥', 'Meus relacionamentos', 'Evito sair, tirar foto ou me encontrar com pessoas'],
          ['rotina', '📅', 'Minha rotina', 'Não tenho energia pra cuidar da família e de mim mesma'],
        ].map(([v, e, t, d]) => `
          <button type="button" class="quiz-option top${state.answers.incomodo === v ? ' selected' : ''}" data-value="${v}">
            <span class="opt-emoji">${e}</span>
            <span><span class="opt-label">${t}</span><span class="opt-desc">${d}</span></span>
          </button>`).join('')}</div>`,
      after: (root) => unica(root, 'incomodo'),
    },

    // Tela 9 — Já tentou emagrecer antes?
    {
      key: 'tentativas',
      render: () => `
        <h2 class="title">Você já tentou ${hl('emagrecer antes?')}</h2>
        ${opcoes([
          { value: 'varias-vezes', emoji: '😞', label: 'Sim, várias vezes. Perco e logo ganho de volta' },
          { value: 'nao-mantem', emoji: '😶', label: 'Sim, mas nunca consigo manter' },
          { value: 'sem-resultado', emoji: '😔', label: 'Já tentei, mas nada deu resultado de verdade' },
          { value: 'tudo', emoji: '😩', label: 'Já tentei de tudo e nada funcionou' },
        ], { sm: true, selecionados: [state.answers.tentativas] })}`,
      after: (root) => unica(root, 'tentativas'),
    },

    // Tela 10 — O que já tentou para emagrecer?
    {
      key: 'metodos-tentados',
      render: () => `
        <h2 class="title">O que você ${hl('já tentou')} para emagrecer?</h2>
        <p class="hint">Selecione todas que se aplicam</p>
        ${opcoes([
          { value: 'comer-menos', emoji: '🍽️', label: 'Comer menos / fechar a boca' },
          { value: 'exercicio', emoji: '🏃‍♀️', label: 'Academia ou caminhada' },
          { value: 'dieta', emoji: '🥗', label: 'Dieta da moda ou contar calorias' },
          { value: 'remedio', emoji: '💊', label: 'Remédio ou fórmula para emagrecer' },
          { value: 'cortar', emoji: '🍞', label: 'Cortar pão, doce ou massa' },
        ], { sm: true, multi: true, selecionados: state.answers.metodosTentados || [] })}
        ${btn('Continuar')}`,
      after: (root) => multipla(root, 'metodosTentados'),
    },

    // Tela 11 — E depois que você tentou, o que aconteceu?
    {
      key: 'o-que-aconteceu',
      render: () => `
        <h2 class="title">E ${hl('depois')} que você tentou, o que aconteceu?</h2>
        ${opcoes([
          { value: 'voltou', emoji: '🪗', label: 'Perdia um pouco e depois voltava tudo' },
          { value: 'travou', emoji: '📉', label: 'Funcionava no começo e depois travava' },
          { value: 'fome', emoji: '😩', label: 'Passava fome e acabava desistindo' },
          { value: 'nada', emoji: '😞', label: 'Mesmo me esforçando, quase não perdi nada' },
        ], { sm: true, selecionados: [state.answers.oQueAconteceu] })}`,
      after: (root) => unica(root, 'oQueAconteceu'),
    },

    // Tela 12 — Mecanismo / Campainha (com NIH / Instituto Nacional de Saúde dos EUA)
    {
      key: 'mecanismo-campainha',
      render: () => `
        <div class="copy-screen mecanismo">
          <div class="emoji-xl">🔔</div>
          <p class="lead"><strong>${hl(nome())}, se você já tentou dieta, exercício ou comer menos e o peso voltou, não foi falta de esforço.</strong></p>
          <p>De acordo com o Instituto Nacional de Saúde dos Estados Unidos, depois que você come, seu pâncreas libera insulina.</p>
          <p>Pensa nela como uma <strong>campainha de armazenamento</strong> de energia e gordura. Toda vez que ela toca, seu corpo ouve:</p>
          <p class="quote"><strong>“Tem energia chegando. Use o que precisa e guarde o restante.”</strong></p>
          <p>O problema é que, para algumas mulheres, ela toca <strong>forte demais depois das refeições</strong>. Por isso só comer menos não resolve.</p>
          <div class="reveal">
            <h3 class="big-concept">Freio Metabólico</h3>
            <p>Um freio que você coloca <strong>antes desse sinal</strong>, para a campainha tocar mais baixo. E a forma mais simples de aplicar é uma:</p>
            <h3 class="vehicle">Mistura Metabólica</h3>
            <p>preparada na combinação e no momento certos para o seu perfil.</p>
          </div>
        </div>
        ${btn('Continuar meu diagnóstico')}`,
      after: continuar,
    },

    // Tela 13 — Obstáculo
    {
      key: 'obstaculo',
      render: () => `
        <h2 class="title">O que mais te impede de emagrecer hoje?</h2>
        <p class="hint">Selecione todas que se aplicam</p>
        ${opcoes([
          { value: 'dinheiro', emoji: '💸', label: 'Já gastei dinheiro e não tive resultado' },
          { value: 'financeiro', emoji: '💰', label: 'Não tenho condições de pagar o Ozempic' },
          { value: 'constancia', emoji: '📉', label: 'Começo e não consigo manter' },
          { value: 'fome', emoji: '🍫', label: 'Sinto fome e acabo cedendo' },
          { value: 'tempo', emoji: '⏰', label: 'Não tenho tempo para dietas' },
        ], { sm: true, multi: true, selecionados: state.answers.obstaculo || [] })}
        ${btn('Continuar')}`,
      after: (root) => multipla(root, 'obstaculo'),
    },

    // Tela 14 — Comparação Ozempic
    {
      key: 'comparacao-ozempic',
      render: () => {
        const ozempic = (state.answers.obstaculo || []).includes('financeiro')
          ? `<p class="contou">${state.name ? `${nome()}, você disse` : 'Você disse'} que não tem condições de pagar o Ozempic. Então olha só:</p>`
          : '';
        return `
          <div class="stack-center text-center">
            ${ozempic}
            <div class="emoji-xl">💉</div>
            <h2 class="title sm">A caneta Ozempic custa R$1000 por mês e para de funcionar quando a gente para de usar</h2>
            <div class="green-box">
              <p class="strong">A ${hl('Mistura Metabólica')} faz o mesmo por menos de ${hl('R$5 no mercado')}</p>
              <p class="muted small">Sem ingrediente caro. Sem farmácia. Só liquidificador.</p>
            </div>
            ${btn('Continuar')}
          </div>`;
      },
      after: continuar,
    },

    // Tela 15 — Objetivos
    {
      key: 'objetivos',
      render: () => `
        <h2 class="title">O que você quer ${hl('conquistar?')}</h2>
        <p class="hint">Selecione todas que se aplicam</p>
        ${opcoes(RESULTADOS, { sm: true, multi: true, selecionados: state.answers.objetivos || [] })}
        ${btn('Continuar')}`,
      after: (root) => multipla(root, 'objetivos'),
    },

    // Tela 16 — Sintomas após refeições
    {
      key: 'sintomas',
      render: () => `
        <h2 class="title">Depois que você come, qual dessas coisas acontece com mais frequência?</h2>
        ${opcoes(SINTOMAS, { sm: true, selecionados: [state.answers.sintomas] })}`,
      after: (root) => unica(root, 'sintomas'),
    },

    // Tela 17 — Explicação dos 4 passos com gancho da campainha (SEM Univ da Virginia e vinagre)
    {
      key: 'explicacao-4passos',
      render: () => {
        const sint = acha(SINTOMAS, state.answers.sintomas)?.frase;
        return `
          ${sint ? `<p class="contou">👉 Você acabou de contar que <strong>${esc(sint)}</strong>. Isso pode ser a sua campainha tocando <strong>forte demais depois das refeições</strong>.</p>` : ''}
          <h2 class="title sm">Por que a Mistura Metabólica pode ajudar seu corpo a voltar a responder?</h2>
          <div class="passos">
            <div class="passo">
              <div class="passo-num">1</div>
              <div class="passo-t"><span class="passo-ic">⚡</span>Depois que você come</div>
              <div class="passo-d">O açúcar sobe e a insulina avisa seu corpo para usar e estocar energia como gordura.</div>
            </div>
            <div class="passo">
              <div class="passo-num">2</div>
              <div class="passo-t"><span class="passo-ic">🥤</span>Mistura Metabólica</div>
              <div class="passo-d">Cria uma barreira natural de saciedade gradual, evitando que a insulina dispare sem controle.</div>
            </div>
            <div class="passo">
              <div class="passo-num">3</div>
              <div class="passo-t"><span class="passo-ic">🔥</span>Gordura vira combustível</div>
              <div class="passo-d">Com a campainha controlada, o corpo é forçado a queimar a gordura já acumulada.</div>
            </div>
            <div class="passo">
              <div class="passo-num">4</div>
              <div class="passo-t"><span class="passo-ic">✨</span>Corpo responde</div>
              <div class="passo-d">Menos fome, barriga mais leve e a balança finalmente destravada logo na 1ª semana.</div>
            </div>
          </div>
          <h3 class="fecho">Organizamos o Freio Metabólico em uma mistura simples e acessível.</h3>
          <div class="callout">
            <strong>Não é qualquer mistura.</strong><br>
            O segredo está em usar <strong>a combinação certa, na quantidade certa e na hora certa</strong> para o seu perfil.
          </div>
          ${btn('Continuar meu diagnóstico')}`;
      },
      after: continuar,
    },

    // Tela 18 — Peso Atual
    (() => {
      const s = stepper('weight', 'kg', () => 45, () => 160);
      return {
        key: 'peso-atual',
        render: () => `<div class="stack-center"><h2 class="title">Qual é seu ${hl('peso atual?')}</h2>${s.render()}${btn('Continuar')}</div>`,
        after(root) {
          s.wire(root);
          root.querySelector('#cta').addEventListener('click', () => {
            state.desiredWeight = Math.min(state.desiredWeight, state.weight - 1);
            state.answers.peso = state.weight;
            next();
          });
        },
      };
    })(),

    // Tela 19 — Altura
    (() => {
      const s = stepper('height', 'cm', () => 140, () => 205);
      return {
        key: 'altura',
        render: () => `<div class="stack-center"><h2 class="title">Qual é sua ${hl('altura?')}</h2>${s.render()}${btn('Continuar')}</div>`,
        after(root) {
          s.wire(root);
          root.querySelector('#cta').addEventListener('click', () => {
            state.answers.altura = state.height;
            next();
          });
        },
      };
    })(),

    // Tela 20 — Peso Desejado com Meta
    (() => {
      const s = stepper('desiredWeight', 'kg', () => 40, () => state.weight - 1);
      const meta = () => {
        const p = state.weight - state.desiredWeight;
        return p > 0 ? `<div class="meta-pill">Meta: perder ${p} kg 🎯</div>` : '';
      };
      return {
        key: 'peso-desejado',
        render: () => `<div class="stack-center"><h2 class="title">Qual é seu ${hl('peso desejado?')}</h2>${s.render()}<div id="meta">${meta()}</div>${btn('Continuar')}</div>`,
        after(root) {
          s.wire(root, () => { root.querySelector('#meta').innerHTML = meta(); });
          root.querySelector('#cta').addEventListener('click', () => {
            state.answers.metaPeso = state.desiredWeight;
            next();
          });
        },
      };
    })(),

    // Tela 21 — Horário / Personalização
    {
      key: 'horario',
      render: () => `
        <h2 class="title">Em qual momento do dia seria mais fácil encaixar uma preparação de 2 minutos na sua rotina?</h2>
        ${opcoes(HORARIOS, { sm: true, selecionados: [state.answers.horario] })}`,
      after: (root) => unica(root, 'horario'),
    },

    // Tela 22 — Sono
    {
      key: 'sono',
      render: () => `<h2 class="title">Em média, quantas horas ${hl('você dorme por noite?')}</h2>${opcoes(SONO, { selecionados: [state.answers.sono] })}`,
      after: (root) => unica(root, 'sono'),
    },

    // Tela 23 — Projeção com Gráfico
    {
      key: 'projecao',
      render() {
        const perda = state.weight - state.desiredWeight;
        const extra = Math.round(perda * 1.2);
        const final = state.weight - extra;
        const pts = [[5, 10], [20, 15], [40, 30], [55, 45], [70, 55], [85, 63], [95, 85]];
        const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ');
        return `
          <div class="stack-center text-center">
            <h2 class="title sm">${hl(nome())}, esse objetivo é totalmente alcançável!</h2>
            <div class="green-box">
              <div class="meta-row">
                <div><div class="meta-kg">${state.weight}kg</div><div class="muted xs">hoje</div></div>
                <div class="meta-arrow">→</div>
                <div><div class="meta-kg primary">${state.desiredWeight}kg</div><div class="muted xs">sua meta</div></div>
              </div>
              <div class="meta-bar">Meta: perder ${perda}kg</div>
            </div>
            <div class="chart-card">
              <p class="chart-title">PREVISÃO DE RESULTADO</p>
              <div class="chart">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="hsl(var(--primary))" stop-opacity=".3"/>
                      <stop offset="100%" stop-color="hsl(var(--primary))" stop-opacity=".02"/>
                    </linearGradient>
                  </defs>
                  <path class="chart-area" d="${d} L95,100 L5,100 Z" fill="url(#cg)"/>
                  <path class="chart-line" d="${d}" fill="none" stroke="hsl(var(--primary))" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <line x1="0" y1="55" x2="100" y2="55" stroke="hsl(var(--primary))" stroke-width=".5" stroke-dasharray="2,2" opacity=".5"/>
                </svg>
                <div class="chart-lbl l1"><span class="dot dark"></span><b>${state.weight}kg</b><small>hoje</small></div>
                <div class="chart-lbl l2"><small>meta</small><span class="dot"></span><b class="primary">${state.desiredWeight}kg</b></div>
                <div class="chart-lbl l3"><span class="dot green"></span><b class="green">${final}kg</b> 🔥</div>
              </div>
              <p class="small muted" style="margin-top: .5rem">Com o método certo, você pode chegar até <b class="primary">${final}kg</b> — <b>${extra}kg a menos!</b></p>
            </div>
            ${btn('VAMOS LÁ')}
          </div>`;
      },
      after: continuar,
    },

    // Tela 24 — Compromisso
    {
      key: 'compromisso',
      render: () => `
        <div class="stack-center">
          <div class="commit-img">
            <img src="/assets/commitment-before-after-DYP9iNat.png" alt="Antes e depois">
            <div class="commit-arrow">›</div>
          </div>
          <div class="pill">🎁 PARA LIBERAR SEU PLANO, PRECISO SABER:</div>
          <h2 class="title sm">Se seu plano ficar pronto hoje, você se compromete a seguir por ${hl('pelo menos 7 dias')} para poder ver os resultados?</h2>
          ${opcoes([
            { value: 'sim', emoji: '😍', label: 'Sim, me comprometo!' },
            { value: 'hoje', emoji: '🤩', label: 'Sim, quero começar hoje mesmo' },
            { value: 'duvidas', emoji: '🤔', label: 'Ainda tenho algumas dúvidas' },
          ], { selecionados: [state.answers.compromisso] })}
        </div>`,
      after: (root) => unica(root, 'compromisso'),
    },

    // Tela 25 — Loading de Análise
    {
      key: 'loading-analise', loading: true,
      render: () => `
        <div class="loading">
          <div class="load-head">
            <div class="emoji-lg pulse">🧠</div>
            <h2 class="title sm">Preparando sua análise, <span class="primary">${nome()}</span>...</h2>
            <p class="muted small">Nosso sistema está processando seus dados</p>
          </div>
          <div class="load-items">
            <div class="load-item current" data-i="0">
              <div class="load-row"><span class="load-ic">⚖️</span>
                <div class="load-body"><p>Analisando sua meta: <b>chegar a ${state.desiredWeight} kg</b></p><div class="load-mini"><div></div></div></div>
              </div>
            </div>
            <div class="load-item future" data-i="1">
              <div class="load-row"><span class="load-ic">🕒</span>
                <div class="load-body"><p>Ajustando à sua rotina...</p><div class="load-mini"><div></div></div></div>
              </div>
            </div>
            <div class="load-item future" data-i="2">
              <div class="load-row"><span class="load-ic">🌙</span>
                <div class="load-body"><p>Levando em conta seu sono...</p><div class="load-mini"><div></div></div></div>
              </div>
            </div>
            <div class="load-item future" data-i="3">
              <div class="load-row"><span class="load-ic">✨</span>
                <div class="load-body"><p>Finalizando seu plano...</p><div class="load-mini"><div></div></div></div>
              </div>
            </div>
          </div>
          <div class="load-total">
            <div class="bar"><div id="bar"></div></div>
            <p class="xs muted text-center"><span id="pct">0</span>% concluído</p>
          </div>
        </div>`,
      after(root) {
        const dur = [520, 480, 450, 400];
        const items = root.querySelectorAll('.load-item');
        let i = 0;
        let t = 0;
        const pinta = () => {
          items.forEach((el, k) => {
            el.className = `load-item ${k < i ? 'done' : k === i ? 'current' : 'future'}`;
            const ic = el.querySelector('.load-ic');
            if (k < i) ic.textContent = '✅';
          });
        };
        pinta();
        const stop = timer(() => {
          if (i >= dur.length) return;
          t += 30;
          const f = Math.min((t / dur[i]) * 100, 100);
          items[i].querySelector('.load-mini div').style.width = `${f}%`;
          const total = Math.min(((i + f / 100) / dur.length) * 100, 100);
          root.querySelector('#bar').style.width = `${total}%`;
          root.querySelector('#pct').textContent = Math.round(total);
          if (t >= dur[i]) {
            i += 1; t = 0; pinta();
            if (i >= dur.length) { stop(); timer(next, 300); }
          }
        }, 30, 'interval');
      },
    },

    // Tela 27 — Resultado / Prescrição com 1 Depoimento (Rose)
    {
      key: 'resultado-perfil',
      render() {
        const r = imc();
        const hor = acha(HORARIOS, state.answers.horario)?.frase || 'no seu melhor horário';
        const sint = acha(SINTOMAS, state.answers.sintomas)?.frase;
        const sono = acha(SONO, state.answers.sono)?.label;
        return `
          <h2 class="title sm">${hl(nome())}, sua análise está pronta</h2>
          <div class="imc-card">
            <div class="imc-top"></div>
            <div class="imc-body">
              <div class="imc-num">${r.valor}</div>
              <div class="muted small">Seu IMC: <b class="primary">${r.classe}</b></div>
            </div>
          </div>

          <div class="alert-card">
            <div class="alert-title">⚠️ Sinais de Alerta Identificados:</div>
            <div class="alert-row"><span>❌</span> Picos de fome e vontade de comer novamente</div>
            <div class="alert-row"><span>❌</span> Insulina acionando o modo de armazenamento com força</div>
            <div class="alert-row"><span>❌</span> Metabolismo lento</div>
            <div class="alert-row"><span>❌</span> Resistência do emagrecimento abdominal</div>
          </div>

          <div class="reco">
            ${sint ? `<p>👉 Você contou que <strong>${esc(sint)}</strong>.</p>` : ''}
            <p><strong>🌿 Por isso, com base nas suas respostas, recomendo começar pelo Freio Metabólico.</strong></p>
            <p>Suas respostas indicam que a sua “campainha de armazenamento” pode estar tocando <strong>forte demais depois das refeições</strong>.</p>
          </div>

          <div class="versao-card">
            <div class="versao-title">Sua versão da Mistura Metabólica</div>
            <div class="versao-row"><span>🕒</span><span><strong>Hora certa:</strong> você disse que o momento mais fácil para preparar é <strong>${esc(hor)}</strong>. É nesse horário que a sua mistura entra na rotina.</span></div>
            <div class="versao-row"><span>⚖️</span><span><strong>Sua meta:</strong> sair de <strong>${state.weight} kg</strong> e chegar a <strong>${state.desiredWeight} kg</strong>.</span></div>
            ${sono ? `<div class="versao-row"><span>🌙</span><span><strong>Seu sono:</strong> <strong>${esc(sono.toLowerCase())}</strong> por noite, também levado em conta.</span></div>` : ''}
            <p class="versao-fecho"><strong>Lembra que não é qualquer mistura?</strong> A combinação exata e a quantidade certa para você estão no seu plano de 21 dias.</p>
          </div>

          <h3 class="subtitle">Benefícios da Mistura Metabólica 👇</h3>
          <div class="beneficios">
            <div class="beneficio"><span>✅</span> Freio Metabólico antes das refeições</div>
            <div class="beneficio"><span>✅</span> Barriga desinchada nos primeiros dias</div>
            <div class="beneficio"><span>✅</span> Fome e vontade de doce controladas sem remédio</div>
            <div class="beneficio"><span>✅</span> Mais energia e saúde durante o dia</div>
            <div class="beneficio"><span>✅</span> Estratégia simples sem remédio caro</div>
            <div class="beneficio"><span>✅</span> Sem efeito sanfona</div>
            <div class="beneficio"><span>✅</span> Mais liberdade para comer sem viver de dieta</div>
          </div>

          <div class="depo-card">
            <div class="depo-info">
              <p class="depo-quote">“Perdi 11kg em 5 semanas, finalmente consegui!”</p>
              <p class="small muted">Aluna do Método - 52 anos</p>
            </div>
            <img class="depo-img" src="/assets/depoimento-antes-depois-CsLdWDkt.jpg" alt="Antes e depois">
          </div>

          ${btn('Continuar')}`;
      },
      after: continuar,
    },

    // Tela 28 — Mais 4 Avaliações / Depoimentos
    {
      key: 'prova-social-4',
      render: () => `
        <h2 class="title sm">Veja quem já transformou o corpo com a ${hl('Mistura Metabólica')}</h2>
        <div class="depos">
          ${DEPOIMENTOS.map((d) => `
            <div class="depo-card">
              <img class="depo-img" src="${d.img}" alt="Antes e depois de ${esc(d.nome)}">
              <div class="depo-info">
                <div class="depo-kg">${d.kg}</div>
                <p class="depo-quote">“${esc(d.frase)}”</p>
                <p class="small muted">${esc(d.nome)}, ${esc(d.local)}</p>
                <div class="small">⭐⭐⭐⭐⭐</div>
              </div>
            </div>`).join('')}
        </div>
        ${btn('Quero essa transformação', { verde: true })}`,
      after: continuar,
    },

    // Tela 29 — Loading de Montagem da Rotina
    {
      key: 'loading-rotina', loading: true,
      render: () => {
        const hor = acha(HORARIOS, state.answers.horario)?.frase || 'no melhor horário';
        const itens = [
          'Montando sua rotina de 21 dias',
          'Personalizando sua Mistura Metabólica',
          `Ajustando para o horário que você escolheu: ${esc(hor)}`,
          'Preparando seus bônus exclusivos',
          '<strong>Rotina Pronta</strong>',
        ];
        return `
          <div class="stack-center text-center rotina">
            <div class="rotina-card">
              <div class="emoji-lg">✨</div>
              <h2>Sua rotina de 21 dias com a Mistura Metabólica está pronta!</h2>
            </div>
            <div class="bounce-v green">⬇️</div>
            <div class="rotina-list">
              ${itens.map((t, i) => `<div class="rotina-item" data-i="${i}"><span class="mk">◻️</span> ${t}</div>`).join('')}
            </div>
            <div class="progress-track"><div class="progress-fill" id="bar"></div></div>
          </div>`;
      },
      after(root) {
        const itens = root.querySelectorAll('.rotina-item');
        let atual = 0;
        let pct = 0;
        const pinta = () => itens.forEach((el, i) => {
          el.style.opacity = i <= atual ? 1 : 0.3;
          el.querySelector('.mk').textContent = i < atual ? '✅' : i === atual ? '⏳' : '◻️';
        });
        pinta();
        const s1 = timer(() => { atual = Math.min(atual + 1, itens.length - 1); pinta(); }, 450, 'interval');
        const s2 = timer(() => { pct = Math.min(pct + 2.5, 100); root.querySelector('#bar').style.width = `${pct}%`; }, 50, 'interval');
        timer(() => { s1(); s2(); next(); }, 2400);
      },
    },

    // Tela 30 — Oferta Final com Selo Proporcional e Checkout
    {
      key: 'oferta', header: false,
      render() {
        const vagas = vagasAgora();
        const faixa = (IDADES.find((o) => o.value === state.answers.idade) || { faixa: '40–54 anos' }).faixa;
        const perda21 = Math.round(Math.max(1, state.weight - state.desiredWeight) * 1.2);
        const dataHoje = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
        const primeiroObj = (state.answers.objetivos || [])[0];
        const resultado = acha(RESULTADOS, primeiroObj)?.frase || 'perder peso e se sentir bem';

        return `
          <div class="scarcity">🔥 ${vagas === 1 ? 'Resta' : 'Restam'} <b>${vagas}</b> ${vagas === 1 ? 'vaga' : 'vagas'} do plano para mulheres ${esc(faixa)} hoje</div>
          <div class="offer">
            <div class="text-center">
              <h1 class="title sm">${hl(nome())}, sua rotina de 21 dias com a Mistura Metabólica foi gerada com sucesso</h1>
              <p class="muted small">Ela é exclusiva e gerada só uma vez. Não saia desta página para não perder.</p>
            </div>

            <div class="card-box">
              <div class="card-head">
                <div class="eyebrow">SEU PLANO EXCLUSIVO</div>
                <div class="card-head-t">21 Dias com a Mistura Metabólica</div>
              </div>
              <div class="card-inner">
                <div class="milestone">
                  <span class="ms-ic">✨</span>
                  <div class="ms-body"><div class="ms-day">EM 7 DIAS</div><div class="ms-desc">Desincha e vê os primeiros resultados</div></div>
                </div>
                <div class="milestone">
                  <span class="ms-ic">🔥</span>
                  <div class="ms-body"><div class="ms-day">EM 14 DIAS</div><div class="ms-desc">Perda de até ${Math.round(perda21 / 2)}kg</div></div>
                </div>
                <div class="milestone">
                  <span class="ms-ic">🏆</span>
                  <div class="ms-body"><div class="ms-day">EM 21 DIAS</div><div class="ms-desc">Perda de até ${perda21}kg</div></div>
                  <span class="meta-tag">META</span>
                </div>
                <div class="result-green">🎯 Resultado esperado: até -${perda21}kg em 21 dias</div>
              </div>
            </div>

            <h2 class="subtitle text-center">Você ainda leva ${hl('3 bônus')} para acelerar seus resultados</h2>
            <div class="bonus-list">
              <div class="bonus">
                <span class="bonus-ic">🎁</span>
                <div><div class="bonus-t">Bônus 1: Dicas para acelerar seu resultado</div><div class="small muted">Dicas simples para aumentar seus resultados em até 30% com a Mistura Metabólica</div></div>
              </div>
              <div class="bonus">
                <span class="bonus-ic">🎁</span>
                <div><div class="bonus-t">Bônus 2: 40 sobremesas que aceleram o metabolismo</div><div class="small muted">Você vai poder comer doces sem travar o seu emagrecimento</div></div>
              </div>
              <div class="bonus">
                <span class="bonus-ic">🎁</span>
                <div><div class="bonus-t">Bônus 3: 20 shakes emagrecedores</div><div class="small muted">Vitaminas, shakes e bebidas deliciosas para variar sua rotina</div></div>
              </div>
            </div>

            <div class="card-box">
              <div class="card-head">
                <div class="eyebrow">VEJA</div>
                <div class="card-head-t">Tudo que você recebe entrando até</div>
                <div class="xs op">${esc(dataHoje)}</div>
              </div>
              <div class="card-inner">
                <img class="mockup" src="/assets/mockup-formula-insulina.webp?v=2" alt="O que você recebe: rotina no celular e 3 bônus">
                <div class="stack-row"><span class="green">✅</span><span>Receita completa da sua <strong>Mistura Metabólica</strong> personalizada</span></div>
                <div class="stack-row"><span class="green">✅</span><span>Quantidade exata para o seu corpo</span></div>
                <div class="stack-row"><span class="green">✅</span><span>Modo de preparo rápido (menos de 2 min)</span></div>
                <div class="stack-row"><span class="green">✅</span><span>Melhor horário de uso ajustado à sua rotina</span></div>
                <div class="stack-row"><span class="green">✅</span><span>Rotina de 21 dias passo a passo</span></div>
                <div class="stack-row"><span class="green">✅</span><span>Lista completa dos ingredientes acessíveis</span></div>
                <div class="stack-row"><span class="green">✅</span><span>Acesso vitalício ao aplicativo</span></div>
                <div class="stack-row"><span>🎁</span><span>BÔNUS 1: Dicas para acelerar resultados</span></div>
                <div class="stack-row"><span>🎁</span><span>BÔNUS 2: 40 sobremesas que aceleram o metabolismo</span></div>
                <div class="stack-row"><span>🎁</span><span>BÔNUS 3: 20 shakes para emagrecer</span></div>

                <div class="price">
                  <div class="price-was">TUDO ISSO DE R$ 293,80</div>
                  <div class="xs muted">POR APENAS</div>
                  <div class="price-now">${esc(CONFIG.preco.valor)}</div>
                  <div class="small muted">${esc(CONFIG.preco.parcelamento)}</div>
                </div>
              </div>
            </div>

            <a href="${buildCheckoutUrl()}" id="cta-principal" class="btn-quiz-green">QUERO COMEÇAR 🥰</a>
            <p class="urgency">Estamos liberando apenas ${vagas === 1 ? '1 plano personalizado' : `${vagas} planos personalizados`} nesta etapa. ${vagas === 1 ? 'Quando essa vaga for preenchida' : 'Quando essas vagas forem preenchidas'}, o valor promocional de ${esc(CONFIG.preco.promo)} deixa de ficar disponível.</p>

            <!-- Card de Garantia com Selo Elegante e Proporcional -->
            <div class="guarantee">
              <img class="seal" src="/assets/garantia-30-dias.webp" alt="Garantia de 30 dias">
              <div class="bold" style="font-size: 1.15rem; color: #1f2937">Garantia de Reembolso</div>
              <p class="small muted">Todo produto é obrigado a dar no mínimo 7 dias de garantia, porém confiamos tanto na fórmula que oferecemos 30 dias corridos.</p>
              <p class="small muted">Ou seja, se você não gostar ou não funcionar pra você, nós reembolsaremos cada centavo que você pagou, sem questionar.</p>
            </div>

            <div class="choices">
              <h3 class="subtitle text-center">Agora você tem duas escolhas</h3>
              <p>Você pode fechar esta página e continuar tentando descobrir sozinha o que funciona para o seu corpo…</p>
              <p>ou pode começar hoje com a rotina de 21 dias que acabou de ser montada com base nas suas respostas.</p>
              <p><strong>Você disse que o primeiro resultado que quer ver é ${esc(resultado)}. Daqui a 21 dias, você pode continuar desejando isso… ou pode olhar para trás feliz por ter começado hoje.</strong></p>
            </div>

            <div>
              <h3 class="subtitle text-center">❓ Perguntas Frequentes</h3>
              <details class="faq">
                <summary>O que é a Mistura Metabólica?</summary>
                <p>É uma preparação natural simples que combina ingredientes acessíveis em uma rotina pensada para ajudar a deixar a resposta do corpo depois das refeições mais gradual. O diferencial não é apenas misturar ingredientes, mas saber quanto usar, como preparar e em que horário usar para o seu corpo.</p>
              </details>
              <details class="faq">
                <summary>A Mistura Metabólica realmente funciona?</summary>
                <p>Sim! Os principais ingredientes já foram estudados por seus efeitos sobre a fome e saciedade. A Mistura Metabólica junta essas ideias em uma rotina prática. Se estiver insatisfeita, você tem 30 dias de garantia e devolvemos todo o seu dinheiro sem perguntas.</p>
              </details>
              <details class="faq">
                <summary>Quanto tempo leva para ver resultados?</summary>
                <p>Muitas alunas percebem as primeiras mudanças como menos fome, mais leveza e barriga desinchada já nos primeiros 7 dias. A perda consistente de peso ocorre ao longo das 3 semanas (21 dias).</p>
              </details>
              <details class="faq">
                <summary>É seguro? Tem efeitos colaterais?</summary>
                <p>Sim, 100% seguro. São alimentos naturais e fibras comuns, logo não têm químicas prejudiciais nem remédios controlados.</p>
              </details>
              <details class="faq">
                <summary>Como vou receber minha rotina?</summary>
                <p>O acesso é liberado imediatamente após a confirmação do pagamento. Você recebe o link digital para acessar pelo celular ou computador instantaneamente.</p>
              </details>
              <details class="faq">
                <summary>É pagamento único ou assinatura?</summary>
                <p>É pagamento único de apenas R$ 27,90 (ou 3x de R$ 10,21). Não há mensalidades nem cobranças ocultas.</p>
              </details>
            </div>

            <a href="${buildCheckoutUrl()}" id="cta-final" class="btn-quiz-green">QUERO COMEÇAR AGORA! 🔥</a>
            <p class="security">🔒 Pagamento 100% seguro • Seus dados estão protegidos</p>

            <footer class="legal">
              <p>© 2026 A Fórmula da Insulina · Todos os direitos reservados</p>
            </footer>
          </div>`;
      },
      after(root) {
        root.querySelectorAll('details.faq').forEach((d) => d.addEventListener('toggle', () => {
          if (d.open) root.querySelectorAll('details.faq').forEach((o) => { if (o !== d) o.open = false; });
        }));

        const vai = () => {
          if (typeof window.fbq === 'function') {
            window.fbq('track', 'InitiateCheckout', {
              content_name: 'A Fórmula da Insulina',
              value: 27.90,
              currency: 'BRL',
            });
          }
          try {
            history.pushState(null, '', '/desconto/');
          } catch (e) {}
        };

        const c1 = root.querySelector('#cta-principal');
        const c2 = root.querySelector('#cta-final');
        if (c1) c1.addEventListener('click', vai);
        if (c2) c2.addEventListener('click', vai);
      },
    },
  ];

  // ---------------------------------------------------------------------
  // Motor de renderização e navegação
  // ---------------------------------------------------------------------

  const root = () => document.getElementById('app');

  function header(idx) {
    const pct = (idx / (SCREENS.length - 1)) * 100;
    return `
      <div class="qheader">
        <div class="qheader-row">
          <button type="button" class="back" id="back" aria-label="Voltar">‹</button>
          ${logo()}
          <span class="back-spacer" aria-hidden="true"></span>
        </div>
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
      </div>`;
  }

  function paint() {
    const scr = SCREENS[state.idx];
    const comHeader = scr.header !== false;
    root().innerHTML = `
      <div class="scroll" id="scroll">
        ${comHeader ? header(state.idx) : ''}
        <div class="screen${scr.key === 'hero' ? ' full' : ''}${scr.key === 'oferta' ? ' flush' : ''}">
          ${scr.render()}
        </div>
      </div>`;

    root().querySelector('#scroll').scrollTop = 0;
    if (comHeader) {
      root().querySelector('#back').addEventListener('click', () => history.back());
    }

    // Disparo de rastreio de visualização de etapa
    if (typeof window.fbq === 'function') {
      window.fbq('trackCustom', 'QuizStep', { step: scr.key, index: state.idx + 1 });
    }

    scr.after(root());
  }

  function next() {
    if (state.idx >= SCREENS.length - 1) return;
    state.idx += 1;
    history.pushState({ idx: state.idx }, '', location.pathname + location.search);
    paint();
  }

  window.addEventListener('popstate', (e) => {
    const idx = e.state && Number.isInteger(e.state.idx) ? e.state.idx : 0;
    state.idx = Math.max(0, Math.min(idx, SCREENS.length - 1));
    if (SCREENS[state.idx]?.loading) {
      history.back();
      return;
    }
    paint();
  });

  document.addEventListener('DOMContentLoaded', () => {
    const p = Number.parseInt(params.get('tela') || params.get('page'), 10);
    state.idx = Number.isFinite(p) && p >= 1 && p <= SCREENS.length ? p - 1 : 0;
    history.replaceState({ idx: state.idx }, '', location.pathname + location.search);
    paint();
  });
})();
