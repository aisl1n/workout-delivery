# Planejamento MVP: Plataforma de Entrega de Treino "Mobile-First"

## 1. Visão do Produto

**Conceito**: Substituir PDFs e planilhas enviadas pelo WhatsApp por uma Web App rápida, interativa e focada na experiência mobile.
**Diferencial**: Velocidade para o Personal (montar treino em < 2 min) e clareza para o Aluno (vídeos/GIFs imediatos).

## 2. Fluxos de Usuário

### 🏋️‍♂️ Personal Trainer (Admin)

1.  **Dashboard Simples**: Lista de treinos recentes e botão de "Novo Treino".
2.  **Montagem de Treino**:
    - Busca exercícios em um banco de dados pré-cadastrado (ex: "Supino", "Agachamento").
    - Adiciona à lista do dia.
    - Define observações rápidas (séries/reps).
3.  **Entrega**:
    - Clica em "Gerar Link".
    - Copia e envia no WhatsApp do aluno.

### 🏃 Aluno (End-User)

1.  **Acesso**: Clica no link recebido (Web App/PWA).
2.  **Execução**:
    - Visualiza lista limpa de exercícios.
    - Clica no card para ver o GIF/Vídeo da execução.
    - Marca "Check" ao concluir cada exercício.
3.  **Feedback**: Tela de parabéns ao finalizar o treino.

## 3. Tech Stack & Arquitetura

- **Frontend**: Next.js (App Router) para SSR e performance.
- **UI Library**: **Shadcn/UI** + **Tailwind CSS**.
  - _Foco_: Componentes grandes, touch-friendly, Dark Mode opcional.
- **Database**: PostgreSQL (via **Prisma ORM**).
- **State Management**: React Hook Form (para criação de treinos) + Zustand (se necessário para estado global do player).
- **Deploy**: Vercel.

## 4. Modelagem de Dados (Draft Schema)

```prisma
// Exemplo inicial do Schema Prisma

model Personal {
  id        String    @id @default(cuid())
  email     String    @unique
  name      String
  workouts  Workout[]
  createdAt DateTime  @default(now())
}

model Exercise {
  id          String        @id @default(cuid())
  name        String
  muscleGroup String        // Ex: Peito, Costas, Pernas
  videoUrl    String?       // URL do GIF ou Vídeo (Youtube/S3)
  items       WorkoutItem[]
}

model Workout {
  id         String        @id @default(cuid())
  title      String        // Ex: "Treino A - Hipertrofia"
  personalId String
  personal   Personal      @relation(fields: [personalId], references: [id])
  items      WorkoutItem[]
  slug       String        @unique // Identificador para o link público
  createdAt  DateTime      @default(now())
}

model WorkoutItem {
  id         String   @id @default(cuid())
  workoutId  String
  workout    Workout  @relation(fields: [workoutId], references: [id])
  exerciseId String
  exercise   Exercise @relation(fields: [exerciseId], references: [id])
  sets       String?  // Ex: "3x"
  reps       String?  // Ex: "10-12"
  order      Int      // Ordem do exercício no treino
}
```
