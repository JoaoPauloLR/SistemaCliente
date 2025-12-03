// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

// Importa as bibliotecas necessárias
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');

// Inicializa o aplicativo Express
const app = express();

// Middlewares para processar JSON e habilitar CORS
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'dist')));

// Configuração da conexão com o banco de dados usando as variáveis do .env
const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    decimalNumbers: true,
    ssl: {
        rejectUnauthorized: false
    }
};

// --- ENDPOINTS DA API ---

// Endpoint de Login
app.post('/api/login', async (req, res) => {
    const { login, senha } = req.body;
    if (!login || !senha) {
        return res.status(400).json({ success: false, message: 'Login e senha são obrigatórios.' });
    }
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(
            'SELECT cod_F, nome, senha FROM Funcionario INNER JOIN Pessoa ON Funcionario.cod_F = Pessoa.cod_P WHERE login = ?',
            [login]
        );
        await connection.end();
        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Login ou senha inválidos.' });
        }
        const user = rows[0];
        const storedHash = user.senha;
        const passwordMatch = await bcrypt.compare(senha, storedHash);
        if (passwordMatch) {
            res.json({
                success: true,
                message: 'Login bem-sucedido!',
                userId: user.cod_F,
                userName: user.nome
            });
        } else {
            res.status(401).json({ success: false, message: 'Login ou senha inválidos.' });
        }
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
});

// --- Endpoints de Clientes ---
app.get('/api/clientes', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM vwClientes ORDER BY nome ASC');
        await connection.end();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao buscar clientes.' });
    }
});
app.get('/api/clientes/search', async (req, res) => {
    const searchTerm = req.query.q;
    if (!searchTerm) { return res.json([]); }
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT CodigoCliente, nome FROM vwClientes WHERE nome LIKE ? LIMIT 10', [`%${searchTerm}%`]);
        await connection.end();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao buscar clientes.' });
    }
});
app.get('/api/clientes/:id', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM vwClientes WHERE CodigoCliente = ?', [req.params.id]);
        await connection.end();
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Cliente não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar cliente' });
    }
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
app.post('/api/clientes', async (req, res) => {
    const { nome, telefone, cep, endereco, bairro, cidade } = req.body;
    if (!nome || !cidade) {
        return res.status(400).json({ success: false, message: 'Nome e cidade são obrigatórios.' });
    }
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.beginTransaction();
        let [[cidadeExistente]] = await connection.execute('SELECT cod_Ci FROM Cidade WHERE nome = ?', [cidade]);
        let cidadeId = cidadeExistente ? cidadeExistente.cod_Ci : (await connection.execute('INSERT INTO Cidade (nome) VALUES (?)', [cidade]))[0].insertId;
        const [pessoaResult] = await connection.execute('INSERT INTO Pessoa (nome) VALUES (?)', [nome]);
        const novoClienteId = pessoaResult.insertId;
        await connection.execute('INSERT INTO Cliente (cod_C, cod_Ci, telefone, cep, endereco, bairro) VALUES (?, ?, ?, ?, ?, ?)', [novoClienteId, cidadeId, telefone, cep, endereco, bairro]);
        await connection.commit();
        await connection.end();
        res.status(201).json({ success: true, message: 'Cliente cadastrado com sucesso!', newId: novoClienteId });
    } catch (error) {
        if (connection) await connection.rollback();
        res.status(500).json({ success: false, message: 'Erro interno do servidor ao cadastrar cliente.' });
    }
});
app.put('/api/clientes/:id', async (req, res) => {
    const clienteId = req.params.id;
    const { nome, telefone, cep, endereco, bairro, cidade } = req.body;
    if (!nome || !cidade) {
        return res.status(400).json({ success: false, message: 'Nome e cidade são obrigatórios.' });
    }
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.beginTransaction();
        await connection.execute('UPDATE Pessoa SET nome = ? WHERE cod_P = ?', [nome, clienteId]);
        let [[cidadeExistente]] = await connection.execute('SELECT cod_Ci FROM Cidade WHERE nome = ?', [cidade]);
        let cidadeId = cidadeExistente ? cidadeExistente.cod_Ci : (await connection.execute('INSERT INTO Cidade (nome) VALUES (?)', [cidade]))[0].insertId;
        await connection.execute('UPDATE Cliente SET telefone = ?, cep = ?, endereco = ?, bairro = ?, cod_Ci = ? WHERE cod_C = ?', [telefone, cep, endereco, bairro, cidadeId, clienteId]);
        await connection.commit();
        await connection.end();
        res.json({ success: true, message: 'Cliente atualizado com sucesso!' });
    } catch (error) {
        if (connection) await connection.rollback();
        res.status(500).json({ success: false, message: 'Erro interno do servidor ao atualizar cliente.' });
    }
});
app.delete('/api/clientes/:id', async (req, res) => {
    const clienteId = req.params.id;
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.beginTransaction();
        const [osRows] = await connection.execute('SELECT COUNT(*) as osCount FROM OrdemDeServico WHERE cod_C = ?', [clienteId]);
        if (osRows[0].osCount > 0) {
            await connection.rollback();
            return res.status(409).json({
                success: false,
                message: `Não é possível excluir o cliente pois ele possui ${osRows[0].osCount} ordem(ns) de serviço no histórico.`
            });
        }
        await connection.execute('DELETE FROM Pessoa WHERE cod_P = ?', [clienteId]);
        await connection.commit();
        await connection.end();
        res.json({ success: true, message: 'Cliente excluído com sucesso!' });
    } catch (error) {
        if (connection) await connection.rollback();
        res.status(500).json({ success: false, message: 'Erro interno do servidor ao excluir cliente.' });
    }
});

// --- Endpoints de Ordem de Serviço ---
app.put('/api/os/:id/status', async (req, res) => {
    const osId = req.params.id;
    const { status } = req.body;
    const validStatus = ['Aberto', 'Fechado', 'Aguardando Pagamento', 'Aguardando Aprovação'];
    if (!status || !validStatus.includes(status)) {
        return res.status(400).json({ success: false, message: 'Status inválido fornecido.' });
    }
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const isFinalized = status === 'Fechado' || status === 'Aguardando Pagamento';
        const query = isFinalized ? 'UPDATE OrdemDeServico SET status = ?, dataSaida = IFNULL(dataSaida, NOW()) WHERE cod_Os = ?' : 'UPDATE OrdemDeServico SET status = ?, dataSaida = NULL WHERE cod_Os = ?';
        const [result] = await connection.execute(query, [status, osId]);
        await connection.end();
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Ordem de Serviço não encontrada.' });
        }
        res.json({ success: true, message: `Status da OS #${osId} atualizado para ${status}.` });
    } catch (error) {
        console.error('Erro ao atualizar status da OS:', error);
        res.status(500).json({ success: false, message: 'Erro interno do servidor ao atualizar o status.' });
    }
});
app.get('/api/os', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM vwOS ORDER BY CodigoOS DESC');
        await connection.end();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao buscar Ordens de Serviço.' });
    }
});
app.get('/api/os/cliente/:id', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM vwOS WHERE CodigoCliente = ? ORDER BY CodigoOS DESC', [req.params.id]);
        await connection.end();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar OS do cliente' });
    }
});
app.get('/api/os/:id', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(`SELECT osView.*, cli.cod_Ci FROM vwOS as osView JOIN Cliente as cli ON osView.CodigoCliente = cli.cod_C WHERE osView.CodigoOS = ?`, [req.params.id]);
        await connection.end();
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'OS não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar OS' });
    }
});
app.post('/api/os', async (req, res) => {
    const { cod_C, cod_F, aparelho_nome, marca, modelo, serie, defeito, descServico, descPecas, valorPecas, valorServico, desconto, dataEntrada, dataSaida, observacao, status } = req.body;
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.beginTransaction();
        const aparelho_codigo = Date.now();
        const [[cliente]] = await connection.execute('SELECT cod_Ci FROM Cliente WHERE cod_C = ?', [cod_C]);
        if (!cliente) throw new Error("Cliente não encontrado.");
        const cod_Ci = cliente.cod_Ci;
        const [aparelhoResult] = await connection.execute('INSERT INTO Aparelho (codigo, nome, marca, modelo, serie, defeito) VALUES (?, ?, ?, ?, ?, ?)', [aparelho_codigo, aparelho_nome, marca, modelo, serie, defeito]);
        const novoAparelhoCodigo = aparelhoResult.insertId;
        const [servicoResult] = await connection.execute('INSERT INTO Servico (descPecas, descServico, valorPecas, valorServico, desconto) VALUES (?, ?, ?, ?, ?)', [descPecas, descServico, valorPecas || 0, valorServico || 0, desconto || 0]);
        const novoServicoId = servicoResult.insertId;
        const isFinalized = status === 'Fechado' || status === 'Aguardando Pagamento';
        const finalDataSaida = (isFinalized && !dataSaida) ? new Date() : (dataSaida || null);
        await connection.execute('INSERT INTO OrdemDeServico (cod_C, cod_F, cod_Ci, cod_S, codigo, dataEntrada, dataSaida, observacao, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [cod_C, cod_F, cod_Ci, novoServicoId, novoAparelhoCodigo, dataEntrada, finalDataSaida, observacao, status]);
        await connection.commit();
        await connection.end();
        res.status(201).json({ success: true, message: 'Ordem de Serviço criada com sucesso!' });
    } catch (error) {
        if (connection) await connection.rollback();
        res.status(500).json({ success: false, message: 'Erro interno do servidor ao criar OS.' });
    }
});
app.put('/api/os/:id', async (req, res) => {
    const osId = req.params.id;
    const { cod_C, aparelho_nome, marca, modelo, serie, defeito, aparelho_codigo, descServico, descPecas, valorPecas, valorServico, desconto, dataEntrada, dataSaida, observacao, status } = req.body;
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.beginTransaction();
        await connection.execute('UPDATE Aparelho SET nome = ?, marca = ?, modelo = ?, serie = ?, defeito = ? WHERE codigo = ?', [aparelho_nome, marca, modelo, serie, defeito, aparelho_codigo]);
        const [[osRow]] = await connection.execute('SELECT cod_S FROM OrdemDeServico WHERE cod_Os = ?', [osId]);
        if (!osRow) throw new Error("Ordem de serviço não encontrada para atualização.");
        const servicoId = osRow.cod_S;
        await connection.execute('UPDATE Servico SET descPecas = ?, descServico = ?, valorPecas = ?, valorServico = ?, desconto = ? WHERE cod_S = ?', [descPecas, descServico, valorPecas || 0, valorServico || 0, desconto || 0, servicoId]);
        const isFinalized = status === 'Fechado' || status === 'Aguardando Pagamento';
        const finalDataSaida = (isFinalized && !dataSaida) ? new Date() : (dataSaida || null);
        await connection.execute('UPDATE OrdemDeServico SET cod_C = ?, dataEntrada = ?, dataSaida = ?, observacao = ?, status = ? WHERE cod_Os = ?', [cod_C, dataEntrada, finalDataSaida, observacao, status, osId]);
        await connection.commit();
        await connection.end();
        res.json({ success: true, message: 'Ordem de Serviço atualizada com sucesso!' });
    } catch (error) {
        if (connection) await connection.rollback();
        res.status(500).json({ success: false, message: 'Erro interno do servidor ao atualizar OS.' });
    }
});
app.delete('/api/os/:id', async (req, res) => {
    const osId = req.params.id;
    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute('DELETE FROM OrdemDeServico WHERE cod_Os = ?', [osId]);
        await connection.end();
        res.json({ success: true, message: 'Ordem de Serviço excluída com sucesso!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro interno do servidor ao excluir OS.' });
    }
});

// --- Endpoint do Dashboard ---
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const getClosedMonthsStats = async (months) => {
        // MODIFICADO: Adicionado "AND os.status = 'Fechado'"
        const [rows] = await connection.execute(`
            SELECT COUNT(os.cod_Os) as osCount,
                   COALESCE(SUM(s.valorPecas + s.valorServico - IFNULL(s.desconto, 0)), 0) AS faturamento
            FROM OrdemDeServico os
            LEFT JOIN Servico s ON s.cod_S = os.cod_S
            WHERE os.dataSaida >= DATE_FORMAT(NOW() - INTERVAL ? MONTH, '%Y-%m-01') 
              AND os.dataSaida < DATE_FORMAT(NOW(), '%Y-%m-01')
              AND os.status = 'Fechado'`, [months]);
        return { 
            osCount: Number(rows[0]?.osCount ?? 0), 
            faturamento: Number(rows[0]?.faturamento ?? 0) 
        };
    };
    const [osAbertasRows] = await connection.execute('SELECT COUNT(*) AS count FROM OrdemDeServico WHERE status = "Aberto" OR status = "Aguardando Aprovação"');
    const [osAguardandoPagamentoRows] = await connection.execute('SELECT COUNT(*) as count FROM OrdemDeServico WHERE status = "Aguardando Pagamento"');
    // MODIFICADO: Adicionado "AND os.status = 'Fechado'"
    const [mesAtualRows] = await connection.execute(`
        SELECT COUNT(os.cod_Os) as osCount,
               COALESCE(SUM(s.valorPecas + s.valorServico - IFNULL(s.desconto, 0)), 0) AS faturamento
        FROM OrdemDeServico os LEFT JOIN Servico s ON s.cod_S = os.cod_S
        WHERE YEAR(os.dataSaida) = YEAR(CURDATE()) AND MONTH(os.dataSaida) = MONTH(CURDATE()) AND os.status = 'Fechado'`);
    // MODIFICADO: Adicionado "AND os.status = 'Fechado'"
    const [mesAnteriorRows] = await connection.execute(`
        SELECT COUNT(os.cod_Os) as osCount,
               COALESCE(SUM(s.valorPecas + s.valorServico - IFNULL(s.desconto, 0)), 0) AS faturamento
        FROM OrdemDeServico os LEFT JOIN Servico s ON s.cod_S = os.cod_S
        WHERE YEAR(os.dataSaida) = YEAR(CURDATE() - INTERVAL 1 MONTH) AND MONTH(os.dataSaida) = MONTH(CURDATE() - INTERVAL 1 MONTH) AND os.status = 'Fechado'`);

    const stats3Meses = await getClosedMonthsStats(3);
    const stats6Meses = await getClosedMonthsStats(6);
    const stats12Meses = await getClosedMonthsStats(12);
    await connection.end();
    res.json({
      osAbertas: Number(osAbertasRows[0]?.count ?? 0),
      osAguardandoPagamento: Number(osAguardandoPagamentoRows[0]?.count ?? 0),
      osFinalizadas: {
        mesAtual: Number(mesAtualRows[0]?.osCount ?? 0),
        mesAnterior: Number(mesAnteriorRows[0]?.osCount ?? 0),
        media3Meses: stats3Meses.osCount > 0 ? stats3Meses.osCount / 3 : 0,
        media6Meses: stats6Meses.osCount > 0 ? stats6Meses.osCount / 6 : 0,
        media12Meses: stats12Meses.osCount > 0 ? stats12Meses.osCount / 12 : 0,
      },
      faturamento: {
        mesAtual: Number(mesAtualRows[0]?.faturamento ?? 0),
        mesAnterior: Number(mesAnteriorRows[0]?.faturamento ?? 0),
        media3Meses: stats3Meses.faturamento > 0 ? stats3Meses.faturamento / 3 : 0,
        media6Meses: stats6Meses.faturamento > 0 ? stats6Meses.faturamento / 6 : 0,
        media12Meses: stats12Meses.faturamento > 0 ? stats12Meses.faturamento / 12 : 0,
      }
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar estatísticas.' });
  }
});

// --- Endpoint de Relatórios ---
app.post('/api/relatorio', async (req, res) => {
    const { dataInicio, dataFim } = req.body;
    if (!dataInicio || !dataFim) {
        return res.status(400).json({ success: false, message: 'Datas de início e fim são obrigatórias.' });
    }
    try {
        const connection = await mysql.createConnection(dbConfig);
        // MODIFICADO: Adicionado "AND os.status = 'Fechado'" em todas as queries financeiras
        const [gastosPecasRows] = await connection.execute("SELECT SUM(valorPecas) as total FROM Servico s JOIN OrdemDeServico os ON s.cod_S = os.cod_S WHERE os.dataSaida BETWEEN ? AND ? AND os.status = 'Fechado'", [dataInicio, dataFim]);
        const [ganhosServicosRows] = await connection.execute("SELECT SUM(valorServico) as total FROM Servico s JOIN OrdemDeServico os ON s.cod_S = os.cod_S WHERE os.dataSaida BETWEEN ? AND ? AND os.status = 'Fechado'", [dataInicio, dataFim]);
        const [totalDescontosRows] = await connection.execute("SELECT SUM(desconto) as total FROM Servico s JOIN OrdemDeServico os ON s.cod_S = os.cod_S WHERE os.dataSaida BETWEEN ? AND ? AND os.status = 'Fechado'", [dataInicio, dataFim]);
        const [osFechadasRows] = await connection.execute("SELECT COUNT(DISTINCT os.cod_Os) as count FROM OrdemDeServico as os WHERE os.dataSaida BETWEEN ? AND ? AND os.status = 'Fechado'", [dataInicio, dataFim]);
        
        const [clientesAtendidosRows] = await connection.execute('SELECT COUNT(DISTINCT cod_C) as count FROM OrdemDeServico WHERE dataEntrada BETWEEN ? AND ?', [dataInicio, dataFim]);
        const [osAbertasRows] = await connection.execute('SELECT COUNT(*) as count FROM OrdemDeServico WHERE status = "Aberto" OR status = "Aguardando Aprovação"');
        await connection.end();
        res.json({
            gastosPecas: gastosPecasRows[0].total || 0,
            ganhosServicos: ganhosServicosRows[0].total || 0,
            totalDescontos: totalDescontosRows[0].total || 0,
            clientesAtendidos: clientesAtendidosRows[0].count || 0,
            osAbertas: osAbertasRows[0].count || 0,
            osFechadas: osFechadasRows[0].count || 0
        });
    } catch (error) {
        console.error('Erro ao gerar relatório:', error);
        res.status(500).json({ success: false, message: 'Erro interno do servidor ao gerar relatório.' });
    }
});

app.post('/api/relatorio/detalhado', async (req, res) => {
    const { dataInicio, dataFim } = req.body;
    if (!dataInicio || !dataFim) {
        return res.status(400).json({ success: false, message: 'Datas de início e fim são obrigatórias.' });
    }
    try {
        const connection = await mysql.createConnection(dbConfig);
        // MODIFICADO: Adicionado "AND os.status = 'Fechado'" para o relatório analítico
        const [osRows] = await connection.execute(
            `SELECT 
                os.cod_Os AS CodigoOS,
                s.valorPecas,
                s.valorServico,
                s.desconto,
                (s.valorPecas + s.valorServico - IFNULL(s.desconto, 0)) AS receitaLiquida
             FROM OrdemDeServico os
             JOIN Servico s ON os.cod_S = s.cod_S
             WHERE os.dataSaida BETWEEN ? AND ? AND os.status = 'Fechado'
             ORDER BY os.cod_Os ASC`,
            [dataInicio, dataFim]
        );
        await connection.end();
        res.json(osRows);
    } catch (error) {
        console.error('Erro ao gerar relatório detalhado:', error);
        res.status(500).json({ success: false, message: 'Erro interno do servidor ao gerar relatório detalhado.' });
    }
});

// Inicia o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor backend rodando na porta ${PORT}`);
});