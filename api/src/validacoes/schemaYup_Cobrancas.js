const yup = require('../validacoes/yup');

const schemaYup_Cadastro_Alterar_Cobranca = yup.object().shape({
    descricao: yup.string().required(),
    status: yup.string().required(),
    valor: yup.number().required(),
    vencimento: yup.string().required()
});


module.exports = {
    schemaYup_Cadastro_Alterar_Cobranca
};