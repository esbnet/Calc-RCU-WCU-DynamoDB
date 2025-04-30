import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"; // Supondo que você tenha os componentes de Dialog do ShadCN UI
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button"; // Supondo que você tenha o componente Button
import { HelpCircleIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function MarkdownViewer() {
	const [mdContent, setMdContent] = useState<string>("");
	const [isOpen, setIsOpen] = useState(false);

	// Carregar o conteúdo do arquivo .md
	useEffect(() => {
		const loadMarkdown = async () => {
			const res = await fetch("/README.md"); // Caminho para o arquivo .md
			const text = await res.text();
			setMdContent(text); // Armazenar o conteúdo Markdown
		};

		loadMarkdown();
	}, []);

	return (
		<div>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger asChild>
					<Button variant="outline">
						<HelpCircleIcon className="mr-2 w-4 h-4" />
						Ajuda
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<div className="markdown-content">
						{/* Exibindo o Markdown usando o ReactMarkdown */}
						<ReactMarkdown>{mdContent}</ReactMarkdown>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
