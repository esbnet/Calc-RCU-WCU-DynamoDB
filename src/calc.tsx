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

	return (
		<div className="space-y-6 mx-auto p-4 max-w-xl">
			<Card>
				<CardContent className="space-y-4 pt-6">
					<h1 className="font-bold text-xl">
						Calculadora de RCU e WCU (DynamoDB)
					</h1>

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
								<RadioGroupItem value="strong" id="strong" defaultChecked />
								<Label htmlFor="strong">Consistente</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="eventual" id="eventual"   />
								<Label htmlFor="eventual">Eventual</Label>
							</div>
						</RadioGroup>
					</div>

					<div className="space-y-2 pt-4 border-t">
						<p>
							<strong>RCU necessário:</strong> {calcRCU()}
						</p>
						<p>
							<strong>WCU necessário:</strong> {calcWCU()}
						</p>
					</div>

					<div className="space-y-4 pt-4 border-t">
						<h2 className="font-semibold">
							Simular com capacidade provisionada
						</h2>

						<div>
							<Label htmlFor="rcu">RCU provisionado</Label>
							<Input
								type="number"
								id="rcu"
								value={rcu}
								min={1}
								onChange={(e) => setRCU(Number(e.target.value))}
							/>
							<p className="text-muted-foreground text-sm">
								Suporta até <strong>{calcOpsFromRCU()}</strong> leituras/s
							</p>
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
							<p className="text-muted-foreground text-sm">
								Suporta até <strong>{calcOpsFromWCU()}</strong> escritas/s
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
