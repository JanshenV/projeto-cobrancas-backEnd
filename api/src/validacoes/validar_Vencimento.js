async function validar_Vencimento(data, status) {
    const dia = data.slice(3, 5);
    const mes = data.slice(0, 2);
    const ano = data.slice(6, 10);

    data = new Date(`${dia}-${mes}-${ano} 03:00`);
    status = status.toLowerCase();

    if (status === 'pendente') {
        const hoje_Agora = new Date();
        const time_hoje_Agora = hoje_Agora.getTime();
        const time_vencimento = data.getTime();

        if (time_vencimento < time_hoje_Agora) {
            status = 'vencida';
        };
    };
    data = data.toISOString();
    return ({
        dataVerificada: data,
        statusVerificado: status
    });
};

module.exports = {
    validar_Vencimento
};