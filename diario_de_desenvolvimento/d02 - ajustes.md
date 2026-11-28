# Ajustes após a verificação do projeto - 27/11/2026 (23:35)
## [Pedro Guilherme Mota Santos]

Depois de uma revisão do projeto, foram feitos ajustes para corrigir bugs, alinhar o código ao README e deixar o projeto fácil de rodar em outra máquina. O trabalho foi feito em etapas, rodando `npx tsc --noEmit` ao final de cada uma para conferir se o projeto continuava compilando.

### Situação antes das mudanças

| Item | Situação |
|---|---|
| Empréstimo com leitor inexistente | Retornava 409 ("leitor inativo") em vez de 404 |
| CPF duplicado | A mensagem do erro dizia "E-mail já cadastrado" |
| `GET /emprestimos` e `GET /emprestimos/:id` | Traziam só o livro, sem o leitor |
| `DELETE /leitores/:id` | Inativava o leitor mesmo com empréstimo ATIVO |
| README | Desatualizado (sem `cpf`, `ativo`, rotas `PUT` e regras novas) e com um bloco de código quebrado |
| `.env` | Sem arquivo de exemplo; quem clonasse não sabia quais variáveis criar |
| Seed | Sem script no `package.json`, com typo na mensagem e total de empréstimos fixo |

---

## Etapa 1 – Leitor inexistente retorna 404

| Arquivo | O que mudou |
|---|---|
| `emprestimo/emprestimo.service.ts` | No método `criar`, o teste depois de buscar o leitor passou de `!livro` para `!leitor` |

**Decisões:**
* O erro estava em um `if (!livro)` repetido no lugar de `if (!leitor)`. Por isso o 404 do leitor nunca era lançado e o código caía no teste de leitor inativo.
* A ordem das validações continua a mesma: livro existe (404), leitor existe (404), leitor ativo (409) e livro disponível (409). Todas acontecem antes de qualquer alteração.
* Como o leitor já é checado antes, o teste de inativo passou a usar `leitor.ativo` sem o `?.`.
* As mensagens de erro foram padronizadas (por exemplo, "Livro não encontrado!").

---

## Etapa 2 – Mensagem do CPF duplicado

| Arquivo | O que mudou |
|---|---|
| `leitor/leitor.service.ts` | No `validarDuplicidade`, a mensagem do bloco do CPF passou de `'E-mail já cadastrado'` para `'CPF já cadastrado'` |

**Decisões:**
* Só o texto mudou. A lógica (409 e o `idIgnorado` para o `PUT`) continua igual.

---

## Etapa 3 – Leitor nas consultas de empréstimo

| Arquivo | O que mudou |
|---|---|
| `emprestimo/repository/emprestimo.repository.typeorm.ts` | `buscarPorId` e `listar` passaram a carregar `livro` e `leitor` (`relations: { livro: true, leitor: true }`) |

**Decisões:**
* Antes, só o livro era carregado, então o leitor não aparecia no JSON de `GET /emprestimos` nem de `GET /emprestimos/:id`.

---

## Etapa 4 – Não inativar leitor com empréstimo ativo

| Arquivo | O que mudou |
|---|---|
| `leitor/repository/leitor.repository.ts` | Interface ganhou `possuiEmprestimoAtivo(id)` |
| `leitor/repository/leitor.repository.typeorm.ts` | Injeta também o repositório de `Emprestimo` e implementa `possuiEmprestimoAtivo`, que procura empréstimos do leitor com status `ATIVO` |
| `leitor/leitor.module.ts` | `forFeature([Leitor, Emprestimo])` |
| `leitor/leitor.service.ts` | `inativar` retorna 409 se o leitor tiver empréstimo ativo |

**Decisões:**
* O `LeitorModule` precisou registrar a entidade `Emprestimo`. Sem isso, o Nest não consegue injetar o repositório novo.
* No `LivroService` nada mudou: o `DELETE` continua bloqueando livros com **qualquer** empréstimo. Mesmo com empréstimo DEVOLVIDO, a chave estrangeira impediria a remoção, e sem essa verificação a API devolveria erro 500. Por isso foi o README que passou a descrever essa regra.

---

## Etapa 5 – Ambiente e seed

| Arquivo | O que mudou |
|---|---|
| `package.json` | Novo script `"seed": "ts-node src/seed.ts"` |
| `src/seed.ts` | Guarda o resultado do `save` dos empréstimos e usa `emprestimos.length` na mensagem final; typo "conluído" corrigido |

**Decisões:**
* O `.env` continua no `.gitignore`, porque guarda a senha do banco. Ele é criado à mão, copiando o `.env.example`, **antes** do primeiro `docker compose up`.
* O banco é publicado na porta `5433` da máquina. Dentro do Docker, o `docker-compose.yaml` já força `DATABASE_HOST=db` e `DATABASE_PORT=5432` para a API.
* O seed deve ser rodado dentro do container: `docker compose exec api npm run seed`. Ele apaga todos os dados das tabelas antes de inserir.

---

## Etapa 6 – README

| Seção | O que mudou |
|---|---|
| Entidades | Leitor ganhou `cpf` (único) e `ativo` |
| Rotas | Incluídos `PUT /livros/:id` e `PUT /leitores/:id`; o `DELETE /leitores/:id` agora é descrito como inativação |
| Regras de negócio | A regra 6 foi separada em duas (livro com empréstimo, leitor com empréstimo ativo); incluídas duplicidade de e-mail/CPF (409) e leitor inativo (409) |
| Esqueleto | Incluídos os `atualizar-*.dto.ts`; removido o bloco de código solto que quebrava a renderização |

**Decisões:**
* A frase "Cada módulo tem 4 rotas" foi removida, porque Livro e Leitor passaram a ter 5.

---

## Não alterado nesta etapa

* Os campos de `AtualizarLeitorDto` continuam sem `?` e o `atualizar-livro.dto.ts` ainda importa `isString` sem usar.
* `criar` e `devolver` continuam sem transação: o livro é atualizado antes de o empréstimo ser salvo.

---

## Estado final

| Módulo | GET | Outros métodos | Total |
|---|---|---|---|
| Livro | `/livros`, `/livros/:id` | `POST /livros`, `PUT /livros/:id`, `DELETE /livros/:id` | 5 |
| Leitor | `/leitores`, `/leitores/:id` | `POST /leitores`, `PUT /leitores/:id`, `DELETE /leitores/:id` | 5 |
| Empréstimo | `/emprestimos`, `/emprestimos/:id` | `POST /emprestimos`, `PUT /emprestimos/:id/devolucao` | 4 |