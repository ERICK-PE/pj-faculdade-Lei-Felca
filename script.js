class QuizLeiFelca {
  constructor(formId, resultadoId, progressoId, reiniciarId) {
    this.form = document.getElementById(formId);
    this.resultado = document.getElementById(resultadoId);
    this.progresso = document.getElementById(progressoId);
    this.botaoReiniciar = document.getElementById(reiniciarId);
    this.respostasCorretas = {
      'pergunta-1': 'a',
      'pergunta-2': 'b',
      'pergunta-3': 'b',
      'pergunta-4': 'c',
      'pergunta-5': 'a',
    };
    this.perguntas = [];
    this.perguntaAtual = 0;
    this.respostasUsuario = {};
  }

  iniciar() {
    if (!this.form || !this.resultado || !this.progresso || !this.botaoReiniciar) {
      return;
    }

    this.perguntas = Array.from(this.form.querySelectorAll('.quiz-pergunta'));
    this.mostrarPerguntaAtual();

    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
    });

    this.form.addEventListener('change', (event) => {
      if (!event.target.matches('input[type="radio"]')) {
        return;
      }

      this.registrarResposta(event.target);
    });

    this.botaoReiniciar.addEventListener('click', () => {
      this.reiniciar();
    });
  }

  calcularPontuacao() {
    let pontuacao = 0;

    Object.entries(this.respostasCorretas).forEach(([pergunta, respostaCorreta]) => {
      if (this.respostasUsuario[pergunta] === respostaCorreta) {
        pontuacao += 1;
      }
    });

    return pontuacao;
  }

  criarMensagem(pontuacao) {
    const total = Object.keys(this.respostasCorretas).length;

    if (pontuacao === total) {
      return `Voce acertou ${pontuacao} de ${total}. Excelente, voce entendeu os pontos principais da Lei Felca.`;
    }

    if (pontuacao >= total / 2) {
      return `Voce acertou ${pontuacao} de ${total}. Bom resultado, mas vale revisar alguns pontos do site.`;
    }

    return `Voce acertou ${pontuacao} de ${total}. Leia o conteudo novamente e tente outra vez.`;
  }

  mostrarResultado() {
    const pontuacao = this.calcularPontuacao();
    this.resultado.textContent = this.criarMensagem(pontuacao);
    this.progresso.textContent = 'Resultado final';
    this.form.classList.add('quiz-revisao');

    this.perguntas.forEach((pergunta) => {
      this.mostrarRevisaoDaPergunta(pergunta);
      pergunta.hidden = false;
    });
  }

  mostrarPerguntaAtual() {
    this.perguntas.forEach((pergunta, indice) => {
      pergunta.hidden = indice !== this.perguntaAtual;
      pergunta.classList.toggle('pergunta-ativa', indice === this.perguntaAtual);
      pergunta.classList.remove('pergunta-correta', 'pergunta-incorreta');
    });

    this.progresso.textContent = `Pergunta ${this.perguntaAtual + 1} de ${this.perguntas.length}`;
  }

  registrarResposta(campo) {
    const perguntaAtual = this.perguntas[this.perguntaAtual];
    const nomePergunta = campo.name;

    this.respostasUsuario[nomePergunta] = campo.value;
    this.travarPergunta(perguntaAtual);

    window.setTimeout(() => {
      if (this.perguntaAtual < this.perguntas.length - 1) {
        this.perguntaAtual += 1;
        this.mostrarPerguntaAtual();
        return;
      }

      this.mostrarResultado();
    }, 260);
  }

  travarPergunta(pergunta) {
    pergunta.querySelectorAll('input[type="radio"]').forEach((input) => {
      input.disabled = true;
    });
  }

  liberarPerguntas() {
    this.perguntas.forEach((pergunta) => {
      pergunta.hidden = false;
      pergunta.classList.remove('pergunta-ativa', 'pergunta-correta', 'pergunta-incorreta');
      pergunta.querySelectorAll('input[type="radio"]').forEach((input) => {
        input.disabled = false;
        input.checked = false;
      });
      pergunta.querySelector('.quiz-feedback')?.remove();
    });
  }

  mostrarRevisaoDaPergunta(pergunta) {
    const nomePergunta = pergunta.dataset.pergunta;
    const respostaUsuario = this.respostasUsuario[nomePergunta];
    const respostaCorreta = this.respostasCorretas[nomePergunta];
    const acertou = respostaUsuario === respostaCorreta;
    const textoCorreto = this.obterTextoDaResposta(nomePergunta, respostaCorreta);

    pergunta.classList.toggle('pergunta-correta', acertou);
    pergunta.classList.toggle('pergunta-incorreta', !acertou);

    const feedback = document.createElement('p');
    feedback.className = 'quiz-feedback';
    feedback.textContent = acertou
      ? 'Correta.'
      : `Incorreta. Resposta certa: ${textoCorreto}`;

    pergunta.appendChild(feedback);
  }

  obterTextoDaResposta(nomePergunta, valor) {
    const inputCorreto = this.form.querySelector(`input[name="${nomePergunta}"][value="${valor}"]`);
    const label = inputCorreto?.closest('label');

    return label ? label.textContent.trim() : valor;
  }

  reiniciar() {
    this.perguntaAtual = 0;
    this.respostasUsuario = {};
    this.resultado.textContent = '';
    this.form.classList.remove('quiz-revisao');
    this.liberarPerguntas();
    this.mostrarPerguntaAtual();
  }
}

class RegulacaoTecnologia {
  constructor(secaoId) {
    this.secao = document.getElementById(secaoId);
    this.botoes = [];
    this.paineis = [];
  }

  iniciar() {
    if (!this.secao) {
      return;
    }

    this.botoes = Array.from(this.secao.querySelectorAll('[data-regulacao-alvo]'));
    this.paineis = Array.from(this.secao.querySelectorAll('.regulacao-painel'));

    this.botoes.forEach((botao) => {
      botao.addEventListener('click', () => {
        this.selecionarPainel(botao.dataset.regulacaoAlvo);
      });
    });

    if (this.botoes.length > 0) {
      this.selecionarPainel(this.botoes[0].dataset.regulacaoAlvo);
    }
  }

  selecionarPainel(painelId) {
    this.paineis.forEach((painel) => {
      painel.hidden = painel.id !== painelId;
    });

    this.botoes.forEach((botao) => {
      const selecionado = botao.dataset.regulacaoAlvo === painelId;
      botao.classList.toggle('regulacao-botao-ativo', selecionado);
      botao.setAttribute('aria-expanded', String(selecionado));
    });
  }
}

const regulacaoTecnologia = new RegulacaoTecnologia('regular-acesso-tecnologia');
regulacaoTecnologia.iniciar();

const quiz = new QuizLeiFelca('quiz-form', 'quiz-resultado', 'quiz-progresso', 'quiz-reiniciar');
quiz.iniciar();
