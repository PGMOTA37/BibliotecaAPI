import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { criarTypeOrmConfig } from './config/typeorm.config';
import { Livro } from './livro/livro.entity';
import { Leitor } from './leitor/leitor.entity';
import { Emprestimo, StatusEmprestimo } from './emprestimo/emprestimo.entity';

try {
    process.loadEnvFile();
} catch {}

function diasAtras(dias: number): Date {
    const data = new Date();
    data.setDate(data.getDate() - dias);
    return data;
}

async function seed() {
    const dataSource = new DataSource(criarTypeOrmConfig());
    await dataSource.initialize();
    
    try {
        await dataSource.query(
            'TRUNCATE TABLE emprestimos, livros, leitores RESTART IDENTITY CASCADE',
        );

        const livroRepo = dataSource.getRepository(Livro);
        const leitorRepo = dataSource.getRepository(Leitor);
        const emprestimoRepo = dataSource.getRepository(Emprestimo);

        const livros = await livroRepo.save([
            { titulo: 'Dom Casmurro', autor: 'Machado de Assis', isbn: '978-85-0000-001-1', disponivel: true },
            { titulo: 'Memórias Póstumas de Brás Cubas', autor: 'Machado de Assis', isbn: '978-85-0000-002-8', disponivel: true },
            { titulo: 'O Cortiço', autor: 'Aluísio Azevedo', isbn: '978-85-0000-003-5', disponivel: false },
            { titulo: 'Vidas Secas', autor: 'Graciliano Ramos', isbn: '978-85-0000-004-2', disponivel: false },
            { titulo: 'Capitães da Areia', autor: 'Jorge Amado', isbn: '978-85-0000-005-9', disponivel: true },
            { titulo: 'Grande Sertão: Veredas', autor: 'João Guimarães Rosa', isbn: '978-85-0000-006-6', disponivel: true },
        ]);

        const leitores = await leitorRepo.save([
            { nome: 'Ana Souza', email: 'ana.souza@example.com', cpf: '11111111111', ativo: true },
            { nome: 'Bruno Lima', email: 'bruno.lima@example.com', cpf: '22222222222', ativo: true },
            { nome: 'Carla Mendes', email: 'carla.mendes@example.com', cpf: '33333333333', ativo: true },
            { nome: 'Diego Alves', email: 'diego.alves@example.com', cpf: '44444444444', ativo: false },
        ]);

        await emprestimoRepo.save([
            {
          livro: livros[2],
          leitor: leitores[0],
          data_emprestimo: diasAtras(3),
          data_devolucao: null,
          status: StatusEmprestimo.ATIVO,
        },
        {
          livro: livros[3],
          leitor: leitores[1],
          data_emprestimo: diasAtras(7),
          data_devolucao: null,
          status: StatusEmprestimo.ATIVO,
        },
        {
          livro: livros[0],
          leitor: leitores[2],
          data_emprestimo: diasAtras(20),
          data_devolucao: diasAtras(10),
          status: StatusEmprestimo.DEVOLVIDO,
        },
        {
          livro: livros[4],
          leitor: leitores[0],
          data_emprestimo: diasAtras(30),
          data_devolucao: diasAtras(22),
          status: StatusEmprestimo.DEVOLVIDO,
        },
        ]);

        console.log(
            `Seed conluído: ${livros.length} livros, ${leitores.length} leitores e 4 empréstimos.`,
        );
    } finally {
        await dataSource.destroy();
    }
}

seed().catch((erro) => {
    console.error('Seed deu erro:', erro);
    process.exit(1);
})