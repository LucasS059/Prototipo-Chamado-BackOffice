document.addEventListener('DOMContentLoaded', () => {
    let chamados = [
        { id: 1024, titulo: "Erro ao gerar relatório financeiro", descricao: "O sistema apresenta o erro 500 ao tentar gerar o relatório de vendas consolidado do mês.", empresa: "ACME Corp", data: "2025-10-21", status: "in progress", files: ["log_erro.txt", "print_tela.png"] },
        { id: 1023, titulo: "Lentidão excessiva no login", descricao: "Usuários estão relatando que o login está demorando mais de 30 segundos para ser efetuado.", empresa: "Beta Inc", data: "2025-10-20", status: "done", files: [] },
        { id: 1022, titulo: "Dúvida sobre integração via API", descricao: "Não encontrei na documentação como fazer a autenticação para a API de faturas.", empresa: "ACME Corp", data: "2025-10-18", status: "done", files: ["doc_api_v1.pdf"] },
        { id: 1021, titulo: "Botão de exportar não funciona no Chrome", descricao: "Ao clicar em 'Exportar para PDF' na tela de clientes, nada acontece. Testado no Chrome v105.", empresa: "Omega Solutions", data: "2025-10-17", status: "backlog", files: [] }
    ];

    const corpoTabela = document.getElementById('chamadosTableBody');
    const modalRegistro = document.getElementById('registerModal');
    const modalDetalhes = document.getElementById('detailsModal');
    const btnAbrirModalRegistro = document.getElementById('openRegisterModalBtn');
    const btnFecharModalRegistro = document.getElementById('closeRegisterModal');
    const btnFecharModalDetalhes = document.getElementById('closeDetailsModal');
    const btnCancelarRegistro = document.getElementById('cancelRegisterBtn');
    const btnFecharDetalhes = document.getElementById('closeDetailsBtn');
    const formRegistro = document.getElementById('registerForm');
    const formFiltro = document.getElementById('filterForm');
    const formDetalhes = document.getElementById('formDetalhes');
    const btnEditar = document.getElementById('editBtn');
    const btnCancelarEdicao = document.getElementById('cancelEditBtn');

    let idChamadoEmEdicao = null;

    const getStatusText = (statusValue) => {
        switch (statusValue) {
            case 'backlog': return 'Aberto';
            case 'in progress': return 'Em Andamento';
            case 'qa': return 'Aguardando validação Cliente';
            case 'done': return 'Resolvido';
            default: return statusValue;
        }
    };

    const renderizarTabela = (dados) => {
        corpoTabela.innerHTML = '';
        if (dados.length === 0) {
            corpoTabela.innerHTML = '<tr><td colspan="6" style="text-align:center;">Nenhum chamado encontrado.</td></tr>';
            return;
        }
        dados.forEach(chamado => {
            const classeStatus = `status-${chamado.status.toLowerCase().replace(' ', '-')}`;
            const linha = `<tr><td>#${chamado.id}</td><td>${chamado.titulo}</td><td>${chamado.empresa}</td><td><span class="status-badge ${classeStatus}">${getStatusText(chamado.status)}</span></td><td>${new Date(chamado.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td><td><button class="action-btn view-details-btn" data-id="${chamado.id}">Ver Detalhes</button></td></tr>`;
            corpoTabela.innerHTML += linha;
        });
    };

    const abrirModal = (modal) => modal.style.display = 'block';
    const fecharModal = (modal) => modal.style.display = 'none';

    const definirModoModalDetalhes = (modoEdicao) => {
        if (modoEdicao) {
            modalDetalhes.classList.add('modo-edicao');
        } else {
            modalDetalhes.classList.remove('modo-edicao');
        }
    };

    btnAbrirModalRegistro.addEventListener('click', () => {
        abrirModal(modalRegistro);
    });

    btnFecharModalRegistro.addEventListener('click', () => fecharModal(modalRegistro));
    btnCancelarRegistro.addEventListener('click', () => fecharModal(modalRegistro));

    formRegistro.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const filesInput = document.getElementById('registerFiles');
        const fileNames = Array.from(filesInput.files).map(file => file.name);

        const novoChamado = {
            id: Date.now(),
            titulo: document.getElementById('registerTitle').value,
            descricao: document.getElementById('registerDescription').value,
            empresa: document.getElementById('registerCompany').value || 'Não informado',
            data: new Date().toISOString().split('T')[0],
            status: 'backlog',
            files: fileNames
        };
        chamados.unshift(novoChamado);
        renderizarTabela(chamados);
        formRegistro.reset();
        fecharModal(modalRegistro);
    });

    btnFecharModalDetalhes.addEventListener('click', () => fecharModal(modalDetalhes));
    btnFecharDetalhes.addEventListener('click', () => fecharModal(modalDetalhes));

    window.addEventListener('click', (evento) => {
        if (evento.target === modalRegistro) fecharModal(modalRegistro);
        if (evento.target === modalDetalhes) fecharModal(modalDetalhes);
    });

    corpoTabela.addEventListener('click', (evento) => {
        if (evento.target.classList.contains('view-details-btn')) {
            const idChamado = parseInt(evento.target.getAttribute('data-id'));
            const chamado = chamados.find(c => c.id === idChamado);

            if (chamado) {
                idChamadoEmEdicao = chamado.id;

                document.getElementById('detailsModalTitle').innerText = `Detalhes do Chamado #${chamado.id}`;
                document.getElementById('viewEmpresa').innerText = chamado.empresa;
                document.getElementById('viewStatus').innerText = getStatusText(chamado.status);
                document.getElementById('viewData').innerText = new Date(chamado.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                document.getElementById('viewTitulo').innerText = chamado.titulo;
                document.getElementById('viewDescricao').innerText = chamado.descricao;

                const listaAnexos = document.getElementById('viewAnexos');
                listaAnexos.innerHTML = '';

                if (chamado.files && chamado.files.length > 0) {
                    chamado.files.forEach(nomeArquivo => {
                        const itemLista = document.createElement('li');
                        itemLista.textContent = nomeArquivo;
                        listaAnexos.appendChild(itemLista);
                    });
                } else {
                    const itemLista = document.createElement('li');
                    itemLista.textContent = 'Nenhum anexo.';
                    listaAnexos.appendChild(itemLista);
                }

                document.getElementById('detalhesTitulo').value = chamado.titulo;
                document.getElementById('detalhesDescricao').value = chamado.descricao;
                document.getElementById('detalhesEmpresa').value = chamado.empresa;
                document.getElementById('detalhesStatus').value = chamado.status;

                definirModoModalDetalhes(false);
                abrirModal(modalDetalhes);
            }
        }
    });

    btnEditar.addEventListener('click', () => {
        definirModoModalDetalhes(true);
    });

    btnCancelarEdicao.addEventListener('click', () => {
        definirModoModalDetalhes(false);
    });

    formDetalhes.addEventListener('submit', (evento) => {
        evento.preventDefault();
        const indiceChamado = chamados.findIndex(c => c.id === idChamadoEmEdicao);

        if (indiceChamado !== -1) {
            chamados[indiceChamado].titulo = document.getElementById('detalhesTitulo').value;
            chamados[indiceChamado].descricao = document.getElementById('detalhesDescricao').value;
            chamados[indiceChamado].empresa = document.getElementById('detalhesEmpresa').value;
            chamados[indiceChamado].status = document.getElementById('detalhesStatus').value;

            renderizarTabela(chamados);
            fecharModal(modalDetalhes);
            idChamadoEmEdicao = null;
        }
    });

    formFiltro.addEventListener('submit', (evento) => {
        evento.preventDefault();
        const filtroId = document.getElementById('filterId').value;
        const filtroTitulo = document.getElementById('filterTitle').value.toLowerCase();
        const filtroData = document.getElementById('filterDate').value;
        const filtroStatus = document.getElementById('filterStatus').value;
        const filtroEmpresa = document.getElementById('filterCompany').value.toLowerCase();
        const dadosFiltrados = chamados.filter(chamado => {
            const idCorresponde = filtroId ? chamado.id.toString().includes(filtroId) : true;
            const tituloCorresponde = chamado.titulo.toLowerCase().includes(filtroTitulo);
            const dataCorresponde = filtroData ? chamado.data === filtroData : true;
            const statusCorresponde = filtroStatus ? chamado.status === filtroStatus : true;
            const empresaCorresponde = chamado.empresa.toLowerCase().includes(filtroEmpresa);
            return idCorresponde && tituloCorresponde && dataCorresponde && statusCorresponde && empresaCorresponde;
        });
        renderizarTabela(dadosFiltrados);
    });
    formFiltro.addEventListener('reset', () => {
        setTimeout(() => renderizarTabela(chamados), 0);
    });

    renderizarTabela(chamados);
});