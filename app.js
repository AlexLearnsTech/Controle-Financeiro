/**
 * Arquivo principal - Inicializa a aplicação
 */

document.addEventListener('DOMContentLoaded', function() {
    // Definir a data de hoje no campo de data
    document.getElementById('data').value = obterDataAtual();

    // Inicializar o gerenciador de transações
    const gerenciadorTransacoes = new GerenciadorTransacoes();
    
    // Inicializar a interface do usuário
    const ui = new InterfaceUsuario(gerenciadorTransacoes);
    
    // Carregar dados e atualizar interface
    ui.atualizarInterface();
});