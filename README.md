# Sistema de Biblioteca (API)

API REST em NestJS para gerenciar o acervo, os leitores e os empréstimos de uma biblioteca.

## Módulos do sistema

| Módulo | Responsabilidade |
|---|---|
| `LivroModule` | Acervo de livros |
| `LeitorModule` | Cadastro de leitores |
| `EmprestimoModule` | Empréstimos e devoluções |

## Entidades do sistema

### Livro
* id
* titulo (string)
* autor (string)
* isbn (string)
* disponivel (boolean, default true)

### Leitor
* id
* nome (string)
* email (string)

### Emprestimo
* id
* livro_id
* leitor_id
* data_emprestimo
* data_devolucao
* status (ATIVO ou DEVOLVIDO)

## Rotas

### Módulo Livro
| Método | Rota | Função |
|---|---|---|
| POST | /livros | Cadastra livro |
| GET | /livros | Lista os livros |
| GET | /livros/:id | Busca um livro |
| DELETE | /livros/:id | Remove um livro |

### Módulo Leitor
| Método | Rota | Função |
|---|---|---|
| POST | /leitores | Cadastra leitor |
| GET | /leitores | Lista os leitores |
| GET | /leitores/:id | Busca um leitor |
| DELETE | /leitores/:id | Remove um leitor |

### Módulo Empréstimo
| Método | Rota | Função |
|---|---|---|
| POST | /emprestimos | Cria empréstimo (valida se o livro está disponível) |
| GET | /emprestimos | Lista os empréstimos |
| GET | /emprestimos/:id | Busca um empréstimo |
| PUT | /emprestimos/:id/devolucao | Registra quando o livro é devolvido |

Cada módulo tem 4 rotas, com pelo menos uma GET e uma de outro método (POST, PUT ou DELETE).

## Regras de negócio

1. Não emprestar um livro indisponível - retornar HTTP 409
2. Ao criar um empréstimo: livro.disponivel = false
3. Ao devolver um livro: livro.disponivel = true, data_devolucao = now(), status = DEVOLVIDO
4. Não devolver empréstimo já devolvido - retornar HTTP 409
5. Ao criar um empréstimo, o livro e o leitor devem existir - caso contrário, retornar HTTP 404
6. Não remover livro ou leitor que tenha empréstimo ATIVO - retornar HTTP 409
7. Buscar livro, leitor ou empréstimo inexistente - retornar HTTP 404

## Stack

- NestJS
- TypeORM + PostgreSQL
- Docker Compose (container próprio para o PostgreSQL)

## Seed

O projeto possui o script `src/seed.ts`, que preenche o banco com dados de exemplo dos 3 módulos (livros, leitores e empréstimos).

```

## Esqueleto do Sistema

```text
src/
├── main.ts
├── app.module.ts
├── seed.ts
├── config/
│   └── typeorm.config.ts
├── livro/
│   ├── livro.module.ts
│   ├── livro.controller.ts
│   ├── livro.service.ts
│   ├── livro.entity.ts
│   ├── dto/
│   │   └── criar-livro.dto.ts
│   └── repository/
│       ├── livro.repository.ts
│       └── livro.repository.typeorm.ts
├── leitor/
│   ├── leitor.module.ts
│   ├── leitor.controller.ts
│   ├── leitor.service.ts
│   ├── leitor.entity.ts
│   ├── dto/
│   │   └── criar-leitor.dto.ts
│   └── repository/
│       ├── leitor.repository.ts
│       └── leitor.repository.typeorm.ts
└── emprestimo/
    ├── emprestimo.module.ts
    ├── emprestimo.controller.ts
    ├── emprestimo.service.ts
    ├── emprestimo.entity.ts
    ├── dto/
    │   └── criar-emprestimo.dto.ts
    └── repository/
        ├── emprestimo.repository.ts
        └── emprestimo.repository.typeorm.ts
```
