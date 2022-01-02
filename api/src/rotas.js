const express = require('express');
const rotas = express();
const {
    Cadastro_Usuario,
    Login,
    Perfil,
    Alterar_Usuario,
    Listar_Todos_Usuarios
} = require('./controladores/usuarios');

const { Verifica_Token } = require('./middleware/verificaToken');

const {
    Cadastrar_Cliente,
    Listar_Clientes,
    Listar_Cliente_Unitario,
    Alterar_Cliente
} = require('./controladores/clientes');

const {
    Cadastro_Cobranca,
    Listagem_Cobrancas,
    Alterar_Cobranca,
    Eliminar_Cobranca
} = require('./controladores/cobrancas');

rotas.post('/usuarios', Cadastro_Usuario);
rotas.post('/login', Login);
rotas.get('/usuarios', Listar_Todos_Usuarios);
rotas.use(Verifica_Token);
rotas.get('/perfil', Perfil);
rotas.put('/usuarios', Alterar_Usuario);

rotas.post('/clientes', Cadastrar_Cliente);
rotas.get('/clientes', Listar_Clientes);
rotas.get('/clientes/:id', Listar_Cliente_Unitario);
rotas.put('/clientes/:id', Alterar_Cliente);

rotas.post('/cobrancas', Cadastro_Cobranca);
rotas.get('/cobrancas', Listagem_Cobrancas);
rotas.put('/cobrancas/:id', Alterar_Cobranca);
rotas.delete('/cobrancas/:id', Eliminar_Cobranca);

module.exports = rotas;