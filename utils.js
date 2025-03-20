/**
 * Funções utilitárias para o controle financeiro
 */

// Formatar valor para exibição em Reais
function formatarValor(valor) {
    return `R$ ${valor.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

// Formatar data para exibição no formato brasileiro
function formatarData(dataStr) {
    const data = new Date(dataStr);
    return data.toLocaleDateString('pt-BR');
}

// Obter data atual no formato YYYY-MM-DD para campos input date
function obterDataAtual() {
    return new Date().toISOString().split('T')[0];
}

// Validar formulário de transação
function validarFormulario(valor, data) {
    if (!valor || valor <= 0) {
        alert('Por favor, insira um valor válido.');
        return false;
    }

    if (!data) {
        alert('Por favor, insira uma data.');
        return false;
    }

    return true;
}