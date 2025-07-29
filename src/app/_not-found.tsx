// app/not-found.tsx
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
            <div className="max-w-md">
                <h1 className="text-5xl font-bold tracking-tight mb-4">404</h1>
                <p className="text-lg text-muted-foreground mb-6">
                    Página não encontrada. A URL que você tentou acessar não existe.
                </p>
                <Link href="/">
                    <Button>Voltar para o início</Button>
                </Link>
            </div>
        </div>
    )
}
