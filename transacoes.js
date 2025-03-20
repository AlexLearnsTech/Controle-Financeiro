/**
 * Gerenciamento de transações
 */

// Classe para gerenciar transações
class GerenciadorTransacoes {
    constructor() {
        this.transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];
    }

    // Obter todas as transações
    obterTransacoes() {
        return this.transacoes;
    }

    // Adicionar nova transação
    adicionarTransacao(tipo, categoria, valor, data, descricao) {
        const novaTransacao = {
            id: Date.now(), // ID único baseado em timestamp
            tipo: tipo,
            categoria: categoria,
            valor: valor,
            data: data,
            descricao: descricao
        };

        this.transacoes.push(novaTransacao);
        this.salvarTransacoes();
        return novaTransacao;
    }

    // Excluir transação por ID
    excluirTransacao(id) {
        this.transacoes = this.transacoes.filter(transacao => transacao.id !== id);
        this.salvarTransacoes();
    }

    // Salvar transações no localStorage
    salvarTransacoes() {
        localStorage.setItem('transacoes', JSON.stringify(this.transacoes));
    }

    // Obter apenas entradas
    obterEntradas() {
        return this.transacoes.filter(t => t.tipo === 'entrada');
    }

    // Obter apenas saídas
    obterSaidas() {
        return this.transacoes.filter(t => t.tipo === 'saida');
    }

    // Pesquisar transações
    pesquisarTransacoes(termo) {
        if (!termo) return this.transacoes;
        
        termo = termo.toLowerCase();
        return this.transacoes.filter(t => 
            (t.descricao && t.descricao.toLowerCase().includes(termo)) || 
            (t.categoria && t.categoria.toLowerCase().includes(termo))
        );
    }

    // Calcular totais (entradas, saídas e saldo)
    calcularTotais() {
        const totais = this.transacoes.reduce((acc, transacao) => {
            if (transacao.tipo === 'entrada') {
                acc.entradas += transacao.valor;
            } else {
                acc.saidas += transacao.valor;
            }
            return acc;
        }, { entradas: 0, saidas: 0 });

        totais.saldo = totais.entradas - totais.saidas;
        return totais;
    }
}