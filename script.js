class QuizLeiFelca {
  constructor(formId, resultadoId) {
    this.form = document.getElementById(formId);
    this.resultado = document.getElementById(resultadoId);
    this.respostasCorretas = {
      'pergunta-1': 'a',
      'pergunta-2': 'b',
      'pergunta-3': 'b',
      'pergunta-4': 'c',
    };
  }

  iniciar() {
    if (!this.form || !this.resultado) {
      return;
    }

    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.mostrarResultado();
    });
  }

  calcularPontuacao() {
    let pontuacao = 0;

    Object.entries(this.respostasCorretas).forEach(([pergunta, respostaCorreta]) => {
      const respostaSelecionada = this.form.querySelector(`input[name="${pergunta}"]:checked`);

      if (respostaSelecionada && respostaSelecionada.value === respostaCorreta) {
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
  }
}

const quiz = new QuizLeiFelca('quiz-form', 'quiz-resultado');
quiz.iniciar();
