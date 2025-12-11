import { Card, CardContent } from "@/app/_components/ui/card";
import { Dumbbell } from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/_components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black">
      <Card className="mx-4 max-w-md">
        <CardContent className="py-12 text-center">
          <Dumbbell className="mx-auto mb-4 h-12 w-12 text-zinc-400" />
          <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-white">
            Treino não encontrado
          </h2>
          <p className="mb-6 text-zinc-600 dark:text-zinc-400">
            Verifique o link e tente novamente
          </p>
          <Link href="/admin">
            <Button>Voltar para Admin</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
