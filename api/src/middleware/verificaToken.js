const jwt = require('jsonwebtoken');
const knex = require('../bancodedados/conexao');

async function Verifica_Token(req, res, next) {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({
            message: 'Acesso negado'
        });
    };

    try {

        const token = authorization.replace('Bearer ', '').trim();
        const { id } = jwt.verify(token, process.env.SECRET_JWT);

        const usuario = await knex('usuarios')
            .where({ id })
            .first();

        if (!usuario) {
            return res.status(404).json({
                message: 'Usuário não encontrado.'
            });
        };

        const { senha: _, ...dadosUsuario } = usuario;
        req.user = dadosUsuario;

        next();

    } catch ({ message }) {
        return res.status(400).json({
            message: message
        });
    };
};


module.exports = {
    Verifica_Token
}