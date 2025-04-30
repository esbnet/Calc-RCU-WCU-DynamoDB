
# 📊 Calculadora de RCU e WCU para DynamoDB

Esta calculadora foi desenvolvida para auxiliar desenvolvedores a estimar a capacidade necessária de leitura e escrita no **Amazon DynamoDB**, tanto no modo **provisionado** quanto no modo **on-demand**, além de fornecer uma estimativa de custo mensal.

## ✨ Funcionalidades

- Cálculo de RCU (Read Capacity Units)
- Cálculo de WCU (Write Capacity Units)
- Suporte a leitura **consistente** e **eventual**
- Modo **provisionado** com número de horas diárias configurável
- Modo **on-demand**
- Estimativa de custo mensal

---

## 📐 Parâmetros da Calculadora

| Parâmetro              | Descrição                                                                 |
|------------------------|---------------------------------------------------------------------------|
| `itemSize`             | Tamanho médio de cada item em KB                                          |
| `opsPerSecond`         | Quantidade de leituras ou escritas por segundo                            |
| `readType`             | Tipo de leitura: `consistente` ou `eventual`                              |
| `rcu`, `wcu`           | Quantidade de unidades provisionadas para leitura e escrita               |
| `hoursPerDay`          | Quantas horas por dia a capacidade provisionada será utilizada            |
| `mode`                 | `provisioned` ou `on-demand`                                              |

---

## 🔢 Fórmulas Utilizadas

### 1. **Cálculo de RCU (Read Capacity Units)**

```text
RCU = ceil(opsPerSecond × ceil(itemSize / 4 KB) × tipoLeitura)
```

- Se leitura for **eventual**, `tipoLeitura = 0.5`
- Se leitura for **consistente**, `tipoLeitura = 1`
- Cada unidade de leitura forte lê até 4 KB por segundo.

---

### 2. **Cálculo de WCU (Write Capacity Units)**

```text
WCU = ceil(opsPerSecond × ceil(itemSize / 1 KB))
```

- Cada unidade de escrita grava até 1 KB por segundo.
- Escritas são sempre fortemente consistentes.

---

### 3. **Cálculo de operações suportadas a partir de RCU/WCU provisionados**

**Leituras suportadas:**

```text
opsPerSecond = floor(RCU / (ceil(itemSize / 4 KB) × tipoLeitura))
```

**Escritas suportadas:**

```text
opsPerSecond = floor(WCU / ceil(itemSize / 1 KB))
```

---

## 💰 Estimativa de Custo Mensal

### Provisionado

```text
custoMensal = (RCU × 0.00013 + WCU × 0.00065) × horasPorDia × 30
```

- Valores com base na região `us-east-1`.

### On-Demand

```text
totalLeiturasMensais = opsPerSecond × 3600 × horasPorDia × 30
totalEscritasMensais = opsPerSecond × 3600 × horasPorDia × 30

custoMensal = (totalLeiturasMensais × 0.00000125) + (totalEscritasMensais × 0.00000125)
```

- Cada leitura e escrita custa $0.00000125.

---

## 📌 Observações Importantes

- Em modo **on-demand**, não é necessário informar RCU/WCU.
- A calculadora assume uso contínuo durante as horas especificadas por dia.
- Os preços podem variar conforme a região da AWS.
- As leituras eventualmente consistentes consomem metade de uma RCU, enquanto as leituras fortemente consistentes consomem uma RCU completa.
- Gravações transacionais consomem o dobro de WCUs em comparação com gravações padrão.​