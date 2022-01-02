const yup = require('./yup');

const schemaYup_Cadastrar_Alterar_Cliente = yup.object().shape({
    nome: yup.string().required(),
    email: yup.string().email().required(),
    cpf: yup.string().required(),
    telefone: yup.string().required(),
    cep: yup.string(),
    logradouro: yup.string(),
    complemento: yup.string(),
    bairro: yup.string(),
    cidade: yup.string(),
    estado: yup.string()
});

module.exports = {
    schemaYup_Cadastrar_Alterar_Cliente
};