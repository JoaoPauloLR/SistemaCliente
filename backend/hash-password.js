const bcrypt = require('bcrypt');

const plainPassword = 'osys'; // Coloque sua senha atual aqui
const saltRounds = 10; // Fator de custo do hash, 10 é um bom padrão

bcrypt.hash(plainPassword, saltRounds, function(err, hash) {
    if (err) {
        console.error("Erro ao gerar hash:", err);
        return;
    }
    console.log("Senha em texto plano:", plainPassword);
    console.log("Hash gerado:", hash);
    console.log("\nCopie o hash gerado e cole na coluna 'senha' da sua tabela 'funcionario' no phpMyAdmin.");
});