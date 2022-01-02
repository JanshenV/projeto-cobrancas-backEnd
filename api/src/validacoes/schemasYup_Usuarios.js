const yup = require('./yup');

const schemaYup_Cadastro_Usuario = yup.object().shape({
    nome: yup.string().required(),
    email: yup.string().email().required(),
    senha: yup.string().min(6).required()
});

const schemaYup_Login = yup.object().shape({
    email: yup.string().email().required(),
    senha: yup.string().min(6).required()
});

const schemaYup_Alterar_Usuario = yup.object().shape({
    nome: yup.string().required(),
    email: yup.string().email().required(),
    cpf: yup.string(),
    telefone: yup.string(),
    senha: yup.string()
});


module.exports = {
    schemaYup_Cadastro_Usuario,
    schemaYup_Login,
    schemaYup_Alterar_Usuario
};