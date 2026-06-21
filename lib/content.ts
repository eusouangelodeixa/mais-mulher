// Conteúdo educativo (estático, em português). 4 artigos do PRD.

export interface Article {
  slug: string;
  title: string;
  summary: string;
  body: string[]; // parágrafos
}

export const articles: Article[] = [
  {
    slug: "o-que-e-ciclo-menstrual",
    title: "O que é ciclo menstrual",
    summary: "Entenda as fases do ciclo e por que ele acontece.",
    body: [
      "O ciclo menstrual é o conjunto de mudanças que acontecem no corpo da mulher a cada mês para prepará-lo para uma possível gravidez. Ele começa no primeiro dia da menstruação e termina no dia anterior à menstruação seguinte.",
      "A duração média é de cerca de 28 dias, mas é normal variar entre 21 e 35 dias. Cada corpo tem o seu ritmo.",
      "O ciclo tem fases principais: a menstruação (quando há sangramento), a fase folicular, a ovulação (liberação do óvulo) e a fase lútea. As hormônios mudam ao longo dessas fases e podem influenciar o humor, a energia e o corpo.",
      "Acompanhar o ciclo ajuda você a conhecer melhor o seu corpo e a prever a próxima menstruação.",
    ],
  },
  {
    slug: "o-que-e-periodo-fertil",
    title: "O que é período fértil",
    summary: "Saiba quando é a janela fértil e como ela é estimada.",
    body: [
      "O período fértil é a fase do ciclo em que a chance de engravidar é maior. Ele acontece em torno da ovulação, quando o óvulo é liberado.",
      "A ovulação costuma ocorrer cerca de 14 dias antes da próxima menstruação. A janela fértil é o intervalo de aproximadamente 6 dias que termina um dia depois da ovulação, porque o espermatozoide pode sobreviver alguns dias no corpo.",
      "Importante: a janela fértil é uma estimativa baseada na média do seu ciclo. Ela não deve ser usada como único método de contracepção.",
      "O +Mulher mostra a sua próxima janela fértil estimada no painel inicial.",
    ],
  },
  {
    slug: "como-identificar-irregularidades",
    title: "Como identificar irregularidades",
    summary: "Sinais de que o ciclo pode estar fora do padrão habitual.",
    body: [
      "Um ciclo é considerado irregular quando o intervalo entre as menstruações muda bastante de um mês para o outro, ou quando foge muito da faixa normal de 21 a 35 dias.",
      "Alguns sinais para observar: atrasos frequentes, menstruações muito próximas, sangramento muito intenso ou muito fraco, ou ausência de menstruação por vários meses (sem gravidez).",
      "Fatores como estresse, mudanças de peso, exercício intenso, amamentação e algumas condições de saúde podem afetar o ciclo.",
      "Registrar seus ciclos no +Mulher ajuda a perceber esses padrões ao longo do tempo. Se notar algo fora do comum por vários ciclos, vale conversar com um profissional de saúde.",
    ],
  },
  {
    slug: "quando-procurar-um-ginecologista",
    title: "Quando procurar um ginecologista",
    summary: "Situações em que é recomendável buscar avaliação médica.",
    body: [
      "Procurar um ginecologista faz parte do cuidado com a saúde da mulher, mesmo sem sintomas. Mas alguns sinais merecem atenção mais rápida.",
      "Considere marcar uma consulta se você tiver: atrasos ou ausência de menstruação por vários ciclos (sem gravidez), sangramento muito intenso, dores fortes que atrapalham o dia a dia, sangramento fora do período ou após a relação sexual.",
      "Também é importante buscar ajuda diante de corrimentos com odor ou cor diferentes, coceira persistente ou qualquer mudança que preocupe você.",
      "Este conteúdo é informativo e não substitui uma consulta. Em caso de dúvida, procure um profissional de saúde.",
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
