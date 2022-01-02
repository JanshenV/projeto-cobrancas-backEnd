const knex = require('../bancodedados/conexao');
const {
    schemaYup_Cadastro_Alterar_Cobranca
} = require('../validacoes/schemaYup_Cobrancas');
const {
    validar_Vencimento
} = require('../validacoes/validar_Vencimento');

async function Cadastro_Cobranca(req, res) {
    let {
        cliente_id,
        descricao,
        vencimento,
        status,
        valor
    } = req.body;

    try {
        await schemaYup_Cadastro_Alterar_Cobranca.validate(req.body);

        const clienteCadastrado = await knex('clientes')
            .select('*')
            .where({ id: cliente_id })
            .first();

        if (!clienteCadastrado) {
            return res.status(400).json({
                message: 'Cliente não encontrado'
            });
        };

        const {
            dataVerificada,
            statusVerificado
        } = await validar_Vencimento(vencimento, status);

        valor = valor * 100;

        await knex('cobrancas')
            .insert({
                cliente_id,
                descricao,
                status: statusVerificado,
                valor,
                vencimento: dataVerificada
            });
        return res.status(201).json({
            message: 'Cadastro concluído com sucesso.'
        });
    } catch ({ message }) {
        return res.status(400).json({
            message: message
        });
    };
};

async function Listagem_Cobrancas(req, res) {
    try {
        const lista_Cobrancas = await knex('cobrancas');

        for (const cobranca of lista_Cobrancas) {
            const dados_Clientes = await knex('clientes')
                .where({ id: cobranca.cliente_id })
                .select('*');

            const lista_Cobrancas_Vencidas = lista_Cobrancas.filter(cobrancas =>
                cobrancas.status === 'vencida');
            const lista_Cobrancas_Pendentes = lista_Cobrancas.filter(cobrancas =>
                cobrancas.status === 'pendente');
            const lista_Cobrancas_Pagas = lista_Cobrancas.filter(cobrancas =>
                cobrancas.status === 'paga');

            cobranca.dados_Clientes = dados_Clientes;

            lista_Cobrancas.cobrancas_Vencidas = lista_Cobrancas_Vencidas
            lista_Cobrancas.cobrancas_Pendentes = lista_Cobrancas_Pendentes
            lista_Cobrancas.cobrancas_Pagas = lista_Cobrancas_Pagas
        };

        const {
            cobrancas_Vencidas,
            cobrancas_Pendentes,
            cobrancas_Pagas
        } = lista_Cobrancas;

        let valor_Total_Vencidas = 0;
        let valor_Total_Pendentes = 0;
        let valor_Total_Pagas = 0;

        for (item of cobrancas_Vencidas) {
            valor_Total_Vencidas += item.valor;
        };

        for (item of cobrancas_Pendentes) {
            valor_Total_Pendentes += item.valor;
        };

        for (item of cobrancas_Pagas) {
            valor_Total_Pagas += item.valor;
        };

        return res.status(200).json({
            lista_Cobrancas,
            cobrancas_Vencidas: {
                cobrancas_Vencidas,
                valor_Total_Vencidas
            },
            cobrancas_Pendentes: {
                cobrancas_Pendentes,
                valor_Total_Pendentes
            },
            cobrancas_Pagas: {
                cobrancas_Pagas,
                valor_Total_Pagas
            }
        });
    } catch ({ message }) {
        return res.status(400).json({
            message: message
        });
    };
};

async function Alterar_Cobranca(req, res) {
    let {
        descricao,
        vencimento,
        status,
        valor
    } = req.body;
    const { id } = req.params;

    try {
        await schemaYup_Cadastro_Alterar_Cobranca.validate(req.body);
        const {
            dataVerificada,
            statusVerificado
        } = await validar_Vencimento(vencimento, status);
        valor = valor * 100;

        const cobranca = await knex('cobrancas')
            .where({ id })
            .update({
                descricao,
                vencimento: dataVerificada,
                status: statusVerificado,
                valor
            })
            .returning('*');

        return res.status(200).json({
            message: 'Cobrança editada com sucesso!',
            dados: cobranca
        });

    } catch ({ message }) {
        return res.status(400).json({
            message: message
        });
    };
};

async function Eliminar_Cobranca(req, res) {
    const { id } = req.params;

    try {
        const cobranca = await knex('cobrancas')
            .where({ id })
            .first();

        if (!cobranca) {
            return res.status(400).json({
                message: 'Cobrança não encontrada.'
            });
        };

        const hoje_Agora = new Date();
        const vencimento_Time = new Date(cobranca.vencimento)

        if (cobranca.status === 'paga') {
            return res.status(400).json({
                message: 'Cobrança não pode ser apagada'
            });
        };

        if (cobranca.status !== 'paga' &&
            vencimento_Time.getTime() < hoje_Agora.getTime()) {
            return res.status(400).json({
                message: 'Cobrança não pode ser apagada'
            });
        };

        const cobrancaExcluida = await knex('cobrancas')
            .where({ id })
            .del();

        return res.status(200).json({
            message: 'Cobranca deletada com sucesso.'
        });
    } catch ({ message }) {
        return res.status(400).json({
            message: message
        });
    };
};


module.exports = {
    Cadastro_Cobranca,
    Listagem_Cobrancas,
    Alterar_Cobranca,
    Eliminar_Cobranca
};