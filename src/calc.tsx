import { Card, CardContent } from "./components/ui/card";
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group";

import { useState } from "react";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";

export default function DynamoDBCalculator() {
  const [itemSize, setItemSize] = useState(1); // KB
  const [opsPerSecond, setOpsPerSecond] = useState(1);
  const [readType, setReadType] = useState("strong");
  const [rcu, setRCU] = useState(1);
  const [wcu, setWCU] = useState(1);
  const [hoursPerDay, setHoursPerDay] = useState(24);
  const [mode, setMode] = useState("provisioned");

  // Preços por operação (on-demand) ou por hora (provisioned) - região us-east-1
  const rcuHourly = 0.00013;
  const wcuHourly = 0.00065;
  const rcuOnDemand = 0.00000125; // por leitura (eventual ou consistente)
  const wcuOnDemand = 0.00000125; // por escrita

  const calcRCU = () => {
    const sizeUnits = Math.ceil(itemSize / 4);
    const multiplier = readType === "eventual" ? 0.5 : 1;
    return Math.ceil(opsPerSecond * sizeUnits * multiplier);
  };

  const calcWCU = () => {
    const sizeUnits = Math.ceil(itemSize / 1);
    return Math.ceil(opsPerSecond * sizeUnits);
  };

  const calcOpsFromRCU = () => {
    const sizeUnits = Math.ceil(itemSize / 4);
    const multiplier = readType === "eventual" ? 0.5 : 1;
    return Math.floor(rcu / (sizeUnits * multiplier));
  };

  const calcOpsFromWCU = () => {
    const sizeUnits = Math.ceil(itemSize / 1);
    return Math.floor(wcu / sizeUnits);
  };

  const calcMonthlyCost = () => {
    if (mode === "provisioned") {
      const totalHours = hoursPerDay * 30;
      return (rcu * rcuHourly + wcu * wcuHourly) * totalHours;
    } else {
      const totalReads = opsPerSecond * 60 * 60 * hoursPerDay * 30; // por mês
      const totalWrites = opsPerSecond * 60 * 60 * hoursPerDay * 30; // por mês
      const readCost = totalReads * rcuOnDemand;
      const writeCost = totalWrites * wcuOnDemand;
      return readCost + writeCost;
    }
  };

  return (
    <div className="space-y-6 mx-auto p-4 max-w-xl">
      <Card>
        <CardContent className="space-y-4 pt-6">
          <h1 className="font-bold text-xl">Calculadora de RCU e WCU (DynamoDB)</h1>

          <div>
            <Label htmlFor="itemSize">Tamanho do item (KB)</Label>
            <Input
              type="number"
              id="itemSize"
              value={itemSize}
              min={1}
              onChange={(e) => setItemSize(Number(e.target.value))}
            />
          </div>

          <div>
            <Label htmlFor="ops">Operações por segundo</Label>
            <Input
              type="number"
              id="ops"
              value={opsPerSecond}
              min={1}
              onChange={(e) => setOpsPerSecond(Number(e.target.value))}
            />
          </div>

          <div>
            <Label>Tipo de leitura</Label>
            <RadioGroup
              value={readType}
              onValueChange={setReadType}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="strong" id="strong" />
                <Label htmlFor="strong">Consistente</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="eventual" id="eventual" />
                <Label htmlFor="eventual">Eventual</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <p><strong>RCU necessário:</strong> {calcRCU()}</p>
            <p><strong>WCU necessário:</strong> {calcWCU()}</p>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h2 className="font-semibold">Modo de capacidade</h2>

            <RadioGroup value={mode} onValueChange={setMode} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="provisioned" id="prov" />
                <Label htmlFor="prov">Provisionado</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ondemand" id="ond" />
                <Label htmlFor="ond">On-Demand</Label>
              </div>
            </RadioGroup>

            {mode === "provisioned" && (
              <>
                <div>
                  <Label htmlFor="rcu">RCU provisionado</Label>
                  <Input
                    type="number"
                    id="rcu"
                    value={rcu}
                    min={1}
                    onChange={(e) => setRCU(Number(e.target.value))}
                  />
                  <p className="text-muted-foreground text-sm">Suporta até <strong>{calcOpsFromRCU()}</strong> leituras/s</p>
                </div>

                <div>
                  <Label htmlFor="wcu">WCU provisionado</Label>
                  <Input
                    type="number"
                    id="wcu"
                    value={wcu}
                    min={1}
                    onChange={(e) => setWCU(Number(e.target.value))}
                  />
                  <p className="text-muted-foreground text-sm">Suporta até <strong>{calcOpsFromWCU()}</strong> escritas/s</p>
                </div>

                <div>
                  <Label htmlFor="hours">Horas de uso por dia</Label>
                  <Input
                    type="number"
                    id="hours"
                    value={hoursPerDay}
                    min={1}
                    max={24}
                    onChange={(e) => setHoursPerDay(Number(e.target.value))}
                  />
                </div>
              </>
            )}

            {mode === "ondemand" && (
              <div className="text-muted-foreground text-sm">
                <p>O custo é calculado por operação de leitura e escrita.</p>
              </div>
            )}

            <div className="pt-2">
              <p className="text-muted-foreground text-sm">
                <strong>Estimativa de custo mensal:</strong> US$ {calcMonthlyCost().toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
