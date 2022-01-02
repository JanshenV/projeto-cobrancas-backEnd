const knex = require('../bancodedados/conexao');
const {
    schemaYup_Cadastrar_Alterar_Cliente
} = require('../validacoes/schemaYup_Clientes')

async function Cadastrar_Cliente(req, res) {
    const {
        nome,
        email,
        cpf,
        telefone,
        cep,
        logradouro,
        complemento,
        bairro,
        cidade,
        estado
    } = req.body;
    const usuario = req.user;

    try {
        await schemaYup_Cadastrar_Alterar_Cliente.validate(req.body);

        const cpfExsitente = await knex('clientes')
            .where({ cpf })
            .first();

        if (cpfExsitente) {
            return res.status(400).json({
                message: 'CPF já cadastrado.'
            });
        };

        if (cpf === usuario.cpf) {
            return res.status(400).json({
                message: 'CPF do cliente não pode ser o mesmo do CPF do usuário.'
            });
        };

        const emailExistente = await knex('clientes')
            .where({ email })
            .first();

        if (emailExistente) {
            return res.status(400).json({
                message: 'Email já está sendo usado por outro cliente.'
            });
        };

        await knex('clientes')
            .insert({
                nome,
                email,
                cpf,
                telefone,
                cep,
                logradouro,
                complemento,
                bairro,
                cidade,
                estado
            });

        return res.status(201).json({
            message: 'Cadastrado concluído com sucesso.'
        });
    } catch ({ message }) {
        return res.status(400).json({
            message: message
        });
    };
};

async function Listar_Clientes(req, res) {
    try {
        const lista_Clientes = await knex('clientes');

        for (const cliente of lista_Clientes) {
            const cliente_Cobrancas = await knex('cobrancas')
                .where({ cliente_id: cliente.id })
                .select('*');

            cliente.cobrancas = cliente_Cobrancas;
        };

        for (const cliente of lista_Clientes) {
            const status_inadimplente = cliente.cobrancas.find(cobranca => cobranca.status === 'vencida');
            if (status_inadimplente) {
                cliente.status = 'inadimplente';
            } else {
                cliente.status = 'emDia';
            };
        };

        return res.status(200).json({
            lista_Clientes
        });
    } catch ({ message }) {
        return res.status(400).json({
            message: message
        });
    };
};

async function Listar_Cliente_Unitario(req, res) {
    const { id } = req.params;

    try {
        const cliente = await knex('clientes')
            .where({ id })
            .first();

        if (!cliente) {
            return res.status(404).json({
                message: 'Cliente não encontrado.'
            });
        };

        const cliente_cobrancas = await knex('cobrancas')
            .where({ cliente_id: id })

        return res.status(200).json({
            cliente,
            cliente_cobrancas
        });
    } catch ({ message }) {
        return res.status(400).json({
            message: message
        });
    };
};

async function Alterar_Cliente(req, res) {
    let {
        nome,
        email,
        cpf,
        telefone,
        cep,
        logradouro,
        complemento,
        bairro,
        cidade,
        estado
    } = req.body;
    const usuario = req.user;
    const { id } = req.params;

    try {
        await schemaYup_Cadastrar_Alterar_Cliente.validate(req.body);

        const cliente = await knex('clientes')
            .where({ id })
            .first();

        if (!cliente) {
            return res.status(404).json({
                message: 'Cliente não encontrado'
            });
        };

        if (cpf !== cliente.cpf) {
            const cpfExsitente = await knex('clientes')
                .where({ cpf })
                .first();

            if (cpfExsitente) {
                return res.status(400).json({
                    message: 'CPF já cadastrado.'
                });
            };

            if (cpf === usuario.cpf) {
                return res.status(400).json({
                    message: 'CPF do cliente não pode ser o mesmo do CPF do usuário.'
                });
            };
        };

        if (email !== cliente.email) {
            const emailExistente = await knex('clientes')
                .where({ email })
                .first();

            if (emailExistente) {
                return res.status(400).json({
                    message: 'Email já está sendo usado por outro cliente.'
                });
            };
        };

        await knex('clientes')
            .update({
                nome,
                email,
                cpf,
                telefone,
                cep: cep ? cep : cliente.cep,
                logradouro: logradouro ? logradouro : cliente.logradouro,
                complemento: complemento ? complemento : cliente.complemento,
                bairro: bairro ? bairro : cliente.bairro,
                cidade: cidade ? cidade : cliente.cidade,
                estado: estado ? estado : cliente.estado
            })
            .where({ id });

        return res.status(200).json({
            message: 'Edições do cadastro concluídas com sucesso.'
        });
    } catch ({ message }) {
        return res.status(400).json({
            message: message
        });
    };
};

module.exports = {
    Cadastrar_Cliente,
    Listar_Clientes,
    Listar_Cliente_Unitario,
    Alterar_Cliente
};