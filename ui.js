/**
 * Gerenciamento da interface do usuário
 */

class InterfaceUsuario {
    constructor(gerenciadorTransacoes) {
        this.gerenciadorTransacoes = gerenciadorTransacoes;
        this.inicializarEventos();
    }

    // Inicializar eventos da interface
    inicializarEventos() {
        // Botão adicionar transação
        document.getElementById('adicionar-transacao').addEventListener('click', () => this.adicionarTransacao());
        
        // Eventos das abas
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => this.trocarAba(tab));
        });
        
        // Pesquisa
        document.getElementById('btn-pesquisar').addEventListener('click', () => this.pesquisar());
        document.getElementById('pesquisa').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.pesquisar();
            }
        });
        
        // Botão voltar ao topo
        const backToTop = document.querySelector('.back-to-top');
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Adicionar nova transação a partir do formulário
    adicionarTransacao() {
        const tipo = document.getElementById('tipo').value;
        const categoria = document.getElementById('categoria').value;
        const valor = parseFloat(document.getElementById('valor').value);
        const data = document.getElementById('data').value;
        const descricao = document.getElementById('descricao').value;

        // Validar formulário
        if (!validarFormulario(valor, data)) {
            return;
        }

        // Adicionar transação usando o gerenciador
        this.gerenciadorTransacoes.adicionarTransacao(tipo, categoria, valor, data, descricao);

        // Limpar formulário
        document.getElementById('valor').value = '';
        document.getElementById('descricao').value = '';

        // Atualizar a interface
        this.atualizarInterface();
    }

    // Trocar aba ativa
    trocarAba(tabElement) {
        const tabName = tabElement.getAttribute('data-tab');
        
        // Atualizar classes ativas nas abas
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tabElement.classList.add('active');
        
        // Mostrar conteúdo da aba selecionada
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');
    }

    // Pesquisar transações
    pesquisar() {
        const termo = document.getElementById('pesquisa').value.toLowerCase();
        const resultados = this.gerenciadorTransacoes.pesquisarTransacoes(termo);
        this.atualizarTabela('todas', resultados);
    }

    // Atualizar toda a interface
    atualizarInterface() {
        // Ordenar transações por data (mais recentes primeiro)
        const transacoes = this.gerenciadorTransacoes.obterTransacoes().sort(
            (a, b) => new Date(b.data) - new Date(a.data)
        );
        
        // Calcular totais
        const totais = this.gerenciadorTransacoes.calcularTotais();

        // Atualizar cards de totais
        document.getElementById('total-entradas').textContent = formatarValor(totais.entradas);
        document.getElementById('total-saidas').textContent = formatarValor(totais.saidas);
        document.getElementById('saldo-atual').textContent = formatarValor(totais.saldo);

        // Atualizar tabelas
        this.atualizarTabela('todas', transacoes);
        this.atualizarTabela('entradas', this.gerenciadorTransacoes.obterEntradas().sort(
            (a, b) => new Date(b.data) - new Date(a.data)
        ));
        this.atualizarTabela('saidas', this.gerenciadorTransacoes.obterSaidas().sort(
            (a, b) => new Date(b.data) - new Date(a.data)
        ));
    }

    // Atualizar tabela específica
    atualizarTabela(tipo, dados) {
        const tbody = document.getElementById(`transacoes-${tipo}`);
        const emptyMessage = document.getElementById(`empty-${tipo}`);
        
        // Limpar tabela
        tbody.innerHTML = '';
        
        if (dados.length === 0) {
            emptyMessage.style.display = 'block';
        } else {
            emptyMessage.style.display = 'none';
            
            dados.forEach(transacao => {
                const tr = document.createElement('tr');
                tr.className = transacao.tipo === 'entrada' ? 'entrada-row' : 'saida-row';
                
                // Formatar data para exibição
                const dataFormatada = formatarData(transacao.data);
                
                const valorFormatado = formatarValor(transacao.valor);
                const classeValor = transacao.tipo === 'entrada' ? 'valor-positivo' : 'valor-negativo';
                
                // Conteúdo da linha da tabela
                let rowContent = `
                    <td class="data-cell">${dataFormatada}</td>
                `;
                
                // Adicionar coluna 'Tipo' apenas na tabela 'todas'
                if (tipo === 'todas') {
                    rowContent += `
                        <td>${transacao.tipo === 'entrada' ? 'Entrada' : 'Saída'}</td>
                    `;
                }
                
                rowContent += `
                    <td>${transacao.categoria}</td>
                    <td>${transacao.descricao || '-'}</td>
                    <td class="${classeValor}">${valorFormatado}</td>
                    <td>
                        <button class="btn-danger action-btn" data-id="${transacao.id}">Excluir</button>
                    </td>
                `;
                
                tr.innerHTML = rowContent;
                tbody.appendChild(tr);
                
                // Adicionar evento ao botão de excluir
                tr.querySelector('button').addEventListener('click', () => {
                    this.excluirTransacao(transacao.id);
                });
            });
        }
    }

    // Excluir transação
    excluirTransacao(id) {
        if (confirm('Tem certeza que deseja excluir esta transação?')) {
            this.gerenciadorTransacoes.excluirTransacao(id);
            this.atualizarInterface();
        }
    }
}