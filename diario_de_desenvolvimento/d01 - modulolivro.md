# Início do trabalho - 26/11/2026 (23:32)
## Gustavo Vinícius Coinete Silva

O projeto foi adaptado com base no repositório `Biblioteca`. O trabalho foi feito em etapas, rodando `npx tsc --noEmit` ao final de cada uma para conferir se o projeto continuava compilando.

### Situação antes das mudanças

| Item | Situação |
|---|---|
| Módulos | Apenas 2 (Livro e Empréstimo). Faltava o Leitor |
| Livro | 2 rotas (`POST` e `GET /livros`) |
| Empréstimo | 3 rotas. O leitor era apenas uma `string` |
| Seed | Não existia |
| Configuração do banco | Escrita direto no `app.module.ts` |

---

## Etapa 1 – Módulo Leitor

Criado o módulo completo em `src/leitor/`, seguindo o mesmo padrão dos outros (Controller → Service → Repository, com token `Symbol`).

| Arquivo | Função |
|---|---|
| `leitor.entity.ts` | Tabela `leitores`: `id`, `nome`, `email` (único), `cpf` (único), `ativo` (default `true`) |
| `dto/criar-leitor.dto.ts` | Valida nome, e-mail (`@IsEmail`) e CPF (11 dígitos) |
| `dto/atualizar-leitor.dto.ts` | Mesmos campos, todos opcionais |
| `repository/leitor.repository.ts` | Interface + token `LEITOR_REPOSITORY` |
| `repository/leitor.repository.typeorm.ts` | Implementação com TypeORM (só acesso a dados) |
| `leitor.service.ts` | Regras de negócio |
| `leitor.controller.ts` | Rotas HTTP |
| `leitor.module.ts` | Liga o token à implementação e registra a entidade |

Rotas: `GET /leitores`, `GET /leitores/:id`, `POST /leitores`, `PUT /leitores/:id` e `DELETE /leitores/:id`.

**Decisões:**
* O `DELETE` **inativa** o leitor (`ativo = false`) em vez de apagar. Assim o histórico de empréstimos continua válido e não quebra a chave estrangeira.
* A regra 5 (e-mail ou CPF duplicado, retornando 409) fica no service, no método privado `validarDuplicidade`. O parâmetro `idIgnorado` permite que o próprio leitor reenvie seus dados em um `PUT` sem dar conflito consigo mesmo.
* `email` e `cpf` também têm `unique: true` na entidade, como segunda barreira no banco.

---

## Etapa 2 – Completar o módulo Livro

| Arquivo | O que mudou |
|---|---|
| `dto/atualizar-livro.dto.ts` | Novo. Campos opcionais: `titulo`, `autor`, `isbn` |
| `repository/livro.repository.ts` | Interface ganhou `buscarPorId`, `atualizar`, `remover` e `possuiEmprestimos` |
| `repository/livro.repository.typeorm.ts` | Implementa os novos métodos e injeta também o repositório de `Emprestimo` |
| `livro.service.ts` | Novos `buscarPorId`, `atualizar` e `remover` |
| `livro.controller.ts` | Novas rotas `GET /:id`, `PUT /:id` e `DELETE /:id` |
| `livro.module.ts` | `forFeature([Livro, Emprestimo])` |

**Decisões:**
* O campo `disponivel` **não** está no DTO de atualização. Quem controla essa flag são os empréstimos e devoluções, e o cliente não deve alterá-la pelo `PUT`.
* O `DELETE` de livro que já tem empréstimo retorna **409**. Sem essa verificação, o banco recusaria por causa da chave estrangeira e a API devolveria um erro 500.
* O `DELETE` responde `204` (sem conteúdo), com `@HttpCode(204)`.

---

## Etapa 3 – Empréstimo ligado ao Leitor

| Arquivo | O que mudou |
|---|---|
| `emprestimo.entity.ts` | `leitor: string` virou `@ManyToOne(() => Leitor)` com coluna `leitor_id`. As duas relações ficaram `nullable: false` |
| `dto/criar-emprestimo.dto.ts` | Agora recebe `livro_id` e `leitor_id`, ambos inteiros |
| `repository/emprestimo.repository.ts` | Novo método `buscarLeitorPorId` |
| `repository/emprestimo.repository.typeorm.ts` | Injeta o repositório de `Leitor`; `listar` e `buscarPorId` trazem livro e leitor |
| `emprestimo.service.ts` | Valida o leitor, novo `buscarPorId` público |
| `emprestimo.controller.ts` | Nova rota `GET /emprestimos/:id` |
| `emprestimo.module.ts` | `forFeature([Emprestimo, Livro, Leitor])` |

**Decisões:**
* No `criar`, **todas as validações acontecem antes de qualquer alteração**: livro existe (404), leitor existe (404), leitor ativo (409) e livro disponível (409). Só depois o livro é marcado como indisponível. Assim uma validação que falha nunca deixa o livro "preso".
* A regra "leitor inativo não pode pegar livro emprestado" é nova. Não está no README do `Biblioteca_POO`, mas combina com a inativação feita no `DELETE /leitores/:id`.
* O `devolver` passou a reaproveitar o `buscarPorId`, deixando o "empréstimo não encontrado" em um lugar só.
* Foram removidos imports sem uso: `promises` de `dns`, `isNotEmpty` e `isString`, `NotAcceptableException`.
* Como a tabela `emprestimos` mudou de estrutura (coluna `leitor` virou `leitor_id` obrigatória), foi necessário zerar o banco de desenvolvimento com `docker compose down -v`.

---

## Etapa 4 – Configuração do banco e seed

### `src/config/typeorm.config.ts`
A configuração do TypeORM saiu do `app.module.ts` e foi para uma função `criarTypeOrmConfig()`, usada tanto pela aplicação quanto pelo seed (que roda fora do Nest e precisa da própria conexão).

**Por que uma função e não uma constante?** Uma constante exportada leria o `process.env` no instante em que o arquivo fosse importado, antes de o `ConfigModule` carregar o `.env`. A senha chegaria `undefined`. Com a função, a leitura só acontece quando ela é chamada.

Também foi trocado `autoLoadEntities: true` por `entities: [Livro, Leitor, Emprestimo]`, porque o seed precisa conhecer as entidades.

### `src/seed.ts`
Preenche os 3 módulos com dados de exemplo:

| Tabela | Registros |
|---|---|
| `livros` | 6 (2 deles indisponíveis, por causa de empréstimos ativos) |
| `leitores` | 4 (1 inativo, útil para demonstrar a regra do 409) |
| `emprestimos` | 4 (2 `ATIVO` e 2 `DEVOLVIDO`, com datas coerentes) |

* Antes de inserir, o seed roda `TRUNCATE TABLE emprestimos, livros, leitores RESTART IDENTITY CASCADE`. Isso permite rodá-lo várias vezes e sempre cair no mesmo estado, com ids começando em 1. **Ele apaga tudo o que estiver nessas tabelas.**
* O `.env` é carregado com `process.loadEnvFile()`, recurso nativo do Node, sem precisar instalar o `dotenv`.
* ISBNs, CPFs e e-mails são fictícios.

Comando: `npx ts-node src/seed.ts`

Saída esperada: `Seed concluído: 6 livros, 4 leitores e 4 empréstimos.`

---

## Estado final

| Módulo | GET | Outros métodos | Total |
|---|---|---|---|
| Livro | `/livros`, `/livros/:id` | `POST /livros`, `PUT /livros/:id`, `DELETE /livros/:id` | 5 |
| Leitor | `/leitores`, `/leitores/:id` | `POST /leitores`, `PUT /leitores/:id`, `DELETE /leitores/:id` | 5 |
| Empréstimo | `/emprestimos`, `/emprestimos/:id` | `POST /emprestimos`, `PUT /emprestimos/:id/devolucao` | 4 |