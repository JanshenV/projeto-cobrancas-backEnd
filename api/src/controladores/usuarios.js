const knex = require('../bancodedados/conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const nodemailer = require('../nodemailer');
const {
    schemaYup_Cadastro_Usuario,
    schemaYup_Login,
    schemaYup_Alterar_Usuario
} = require('../validacoes/schemasYup_Usuarios');


async function Cadastro_Usuario(req, res) {
    const {
        nome,
        email,
        senha
    } = req.body;

    try {
        await schemaYup_Cadastro_Usuario.validate(req.body);

        const emailExistente = await knex('usuarios')
            .where({ email })
            .first();

        if (emailExistente) {
            return res.status(400).json({
                message: `Email já cadastrado`
            });
        };

        const encriptandoSenha = await bcrypt.hash(senha, 10);

        await knex('usuarios')
            .insert({
                nome,
                email,
                senha: encriptandoSenha,
            });

        // const text = `Olá ${nome}! Você acaba de se criar uma conta em nosso desafio 5(4) da cubos. Você conseguirá ter acesso ao que temos a oferecer utilizando o email: ${email} para fazer login em nossa aplicação.`;
        // const subject = 'Cadastrado com sucesso no desafio 5(4) da cubos.';

        // const dadosNodemailer = {
        //     from: 'Cadastro <Do-not-reply@desafio_5-cubos.herokuapp.com',
        //     to: email,
        //     subject,
        //     text,
        //     template: 'cadastro',
        //     context: {
        //         nome,
        //         email,
        //         subject,
        //         text
        //     }
        // };

        // nodemailer.sendMail(dadosNodemailer);

        return res.status(201).json();
    } catch ({ message }) {
        return res.status(400).json({
            message: message
        });
    };
};

async function Login(req, res) {
    const { email, senha } = req.body;

    try {
        await schemaYup_Login.validate(req.body);

        const usuario = await knex('usuarios')
            .where({ email })
            .first();

        if (!usuario) {
            return res.status(404).json({
                message: 'Email e senha não conferem.'
            });
        };

        const camparacaoDeSenhas = await bcrypt.compare(String(senha), usuario.senha);

        if (!camparacaoDeSenhas) {
            return res.status(401).json({
                message: 'Email e senha não conferem.'
            });
        };
        const token = jwt.sign({ id: usuario.id },
            process.env.SECRET_JWT, { expiresIn: '8h' }
        );

        return res.status(200).json({
            token: token
        });
    } catch ({ message }) {
        return res.status(400).json({
            message: message
        });
    };
};

async function Perfil(req, res) {
    const usuario = req.user;
    return res.status(200).json(usuario);
};

async function Listar_Todos_Usuarios(req, res) {
    try {
        const usuarios = await knex('usuarios').select('email');
        return res.status(200).json(usuarios);
    } catch ({ message }) {
        return res.status(400).json({
            message: message
        })
    }
};

async function Alterar_Usuario(req, res) {
    const {
        nome,
        email,
        cpf,
        telefone,
        senha
    } = req.body;
    const usuario = req.user;


    try {

        await schemaYup_Alterar_Usuario.validate(req.body);

        let encriptandoSenha;
        if (senha) {

            if (senha.length < 6) {
                return res.status(400).json({
                    message: 'Senha deve ser pelo menos 6 caracteres.'
                });
            };
            encriptandoSenha = await bcrypt.hash(senha, 10);
        };

        if (email !== usuario.email) {
            const emailExistente = await knex('usuarios')
                .where({ email })
                .first();

            if (emailExistente) {
                return res.status(400).json({
                    message: 'Email já cadastrado.'
                });
            };
        };

        if (cpf !== usuario.cpf) {
            const cpfExistente = await knex('usuarios')
                .where({ cpf })
                .first();

            if (cpfExistente && (cpf !== null)) {
                return res.status(400).json({
                    message: 'CPF já cadastrado.'
                });
            };
        };

        const dados_Para_Alterar = {
            nome,
            email,
            cpf: cpf ? cpf : null,
            telefone: telefone ? telefone : null,
            senha: senha ? encriptandoSenha : usuario.senha
        };

        await knex('usuarios')
            .update(dados_Para_Alterar)
            .where({ id: usuario.id });

        return res.status(200).json({
            message: 'Usuário atualizado com sucesso.'
        });

    } catch ({ message }) {
        return res.status(400).json({
            message: message
        });
    };
};

module.exports = {
    Cadastro_Usuario,
    Login,
    Perfil,
    Alterar_Usuario,
    Listar_Todos_Usuarios
};