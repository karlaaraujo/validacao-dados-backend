const express = require('express');
const bodyParser = require('body-parser');
const ddds = require('./ddds.json');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

// Validação de DDDs válidos
function isDDDValido(ddd) {
    return ddds.ddds_validos.includes(ddd);
}

// Validação de e-mail
function isEmailValido(email) {
    return /\S+@\S+\.\S+/.test(email);
}

// Validação de data de nascimento
function isDataValida(dateString) {
    const data = new Date(dateString);
    return !isNaN(data.getTime()) && (data < new Date());
}

// Rota para tratar o POST do formulário
app.post('/submit', (req, res) => {
    const { nomeAluno, nascimento, nomeMae, nomePai, ddd, telefone, email, serie, turno, atividades = [] } = req.body;

    let errors = [];

    // Validação de campos obrigatórios
    if (!nomeAluno || !nascimento || !nomeMae || !nomePai || !telefone || !ddd || !email || !serie || !turno) {
        errors.push('Todos os campos são obrigatórios.');
    }

    // Validação de data de nascimento
    if (nascimento && !isDataValida(nascimento)) {
        errors.push('Data de nascimento inválida.');
    }

    // Validação de e-mail
    if (email && !isEmailValido(email)) {
        errors.push('E-mail inválido.');
    }

    // Validação de telefone (DDD)
    if (telefone && !isDDDValido(ddd)) {
        errors.push('DDD inválido.');
    }

    if (atividades) {
        atvs = atividades;
    
        if (!Array.isArray(atividades)) {
            atvs = [atividades];
        }

        // Validação do limite de atividades extracurriculares (máximo 3)
        if (atvs.length > 3) {
            errors.push('Você pode selecionar no máximo 3 atividades extracurriculares.');
        }
    }

   
    if (errors.length > 0) {
        return res.render('error', { errors });
    }


    res.render('success', { nomeAluno });
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
