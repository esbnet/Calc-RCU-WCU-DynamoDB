# Calculadora de RCU e WCU (DynamoDB)

📌 O que são RCU e WCU no DynamoDB?
RCU (Read Capacity Unit): Unidade de capacidade de leitura.

WCU (Write Capacity Unit): Unidade de capacidade de escrita.

Essas unidades são usadas quando o DynamoDB está em modo de capacidade provisionada. Você define quantas leituras e escritas por segundo sua tabela pode suportar.

📖 Como funcionam?
✅ RCU – Read Capacity Unit
1 RCU permite:

1 leitura consistente fortemente por segundo de um item de até 4 KB, ou

2 leituras eventualmente consistentes por segundo de um item de até 4 KB

Leitura consistente fortemente: garante que você sempre leia o dado mais recente.
Leitura eventualmente consistente: pode retornar um dado um pouco desatualizado, mas é mais barata.

✅ WCU – Write Capacity Unit
1 WCU permite:

1 gravação por segundo de um item de até 1 KB

📐 Exemplos de cálculo
🧮 Exemplo 1 – Leitura
Você quer ler 100 itens por segundo, cada um com 2 KB, com consistência forte.

Cada item tem 2 KB, e a unidade de leitura cobre até 4 KB, então 1 RCU por item.

Para 100 itens:
👉 100 RCU

🧮 Exemplo 2 – Escrita
Você quer gravar 50 itens por segundo, cada um com 2.5 KB.

Cada item tem 2.5 KB. Como 1 WCU cobre até 1 KB, você precisa de:

ceil(2.5 / 1) = 3 WCUs por item

Para 50 itens por segundo:

50 × 3 = 150 WCU

🧮 Exemplo 3 – Leitura eventual
Você quer ler 200 itens por segundo, cada um com 4 KB, com consistência eventual.

1 RCU fornece 2 leituras eventual por segundo de 4 KB.

Então:
👉 200 / 2 = 100 RCU

🧠 Dica: Sempre arredonde para cima
Se seu item tem 1.1 KB, já conta como 2 KB, então exige 2 WCUs para escrita.


## O que é a Calculadora de RCU e WCU (DynamoDB)

- Permite informar o tamanho do item (em KB).
- Permite definir quantas operações por segundo você espera.
- Para leitura, escolhe entre consistente ou eventual.
- Retorna a quantidade necessária de RCU e WCU com arredondamentos corretos.

### Estimativa de custo mensal com base na capacidade provisionada! 💸

Preço usado:

RCU: ~US$ 0.00013 por hora

WCU: ~US$ 0.00065 por hora

Calculado para um mês de 30 dias em execução contínua.

### Estimativa por horário de uso (ex: 8h por dia) ou por demanda (on-demand)
* Campo para informar quantas horas por dia a capacidade provisionada será usada

* Cálculo do custo mensal com base nessas horas
