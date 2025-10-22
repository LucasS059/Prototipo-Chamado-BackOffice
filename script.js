document.addEventListener('DOMContentLoaded', () => {
    const usuarioLogado = "Ana Beatriz";
    let chamados = [
        { id: 1024, usuario: "Carlos Silva", titulo: "Erro ao gerar relatório financeiro", descricao: "O sistema apresenta o erro 500 ao tentar gerar o relatório de vendas consolidado do mês.", empresa: "ACME Corp", data: "2025-10-21", status: "Em Andamento" },
        { id: 1023, usuario: "Juliana Moreira", titulo: "Lentidão excessiva no login", descricao: "Usuários estão relatando que o login está demorando mais de 30 segundos para ser efetuado.", empresa: "Beta Inc", data: "2025-10-20", status: "Resolvido" },
        { id: 1022, usuario: "Carlos Silva", titulo: "Dúvida sobre integração via API", descricao: "Não encontrei na documentação como fazer a autenticação para a API de faturas.", empresa: "ACME Corp", data: "2025-10-18", status: "Fechado" },
        { id: 1021, usuario: "Ana Beatriz", titulo: "Botão de exportar não funciona no Chrome", descricao: "Ao clicar em 'Exportar para PDF' na tela de clientes, nada acontece. Testado no Chrome v105.", empresa: "Omega Solutions", data: "2025-10-17", status: "Aberto" }
    ];

    // --- SELETORES DE ELEMENTOS ---
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
    const campoUsuarioRegistro = document.getElementById('registerUser');
    const btnEditar = document.getElementById('editBtn');
    const btnCancelarEdicao = document.getElementById('cancelEditBtn');

    let idChamadoEmEdicao = null;

    // --- FUNÇÕES ---
    const renderizarTabela = (dados) => {
        corpoTabela.innerHTML = '';
        if (dados.length === 0) {
            corpoTabela.innerHTML = '<tr><td colspan="7" style="text-align:center;">Nenhum chamado encontrado.</td></tr>';
            return;
        }
        dados.forEach(chamado => {
            const classeStatus = `status-${chamado.status.toLowerCase().replace(' ', '-')}`;
            const linha = `<tr><td>#${chamado.id}</td><td>${chamado.titulo}</td><td>${chamado.usuario}</td><td>${chamado.empresa}</td><td><span class="status-badge ${classeStatus}">${chamado.status}</span></td><td>${new Date(chamado.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td><td><button class="action-btn view-details-btn" data-id="${chamado.id}">Ver Detalhes</button></td></tr>`;
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
        campoUsuarioRegistro.value = usuarioLogado;
        abrirModal(modalRegistro);
    });

    btnFecharModalRegistro.addEventListener('click', () => fecharModal(modalRegistro));
    btnCancelarRegistro.addEventListener('click', () => fecharModal(modalRegistro));

    formRegistro.addEventListener('submit', (evento) => {
        evento.preventDefault();
        const novoChamado = {
            id: Date.now(),
            usuario: usuarioLogado,
            titulo: document.getElementById('registerTitle').value,
            descricao: document.getElementById('registerDescription').value,
            empresa: document.getElementById('registerCompany').value || 'Não informado',
            data: new Date().toISOString().split('T')[0],
            status: 'Aberto'
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

                // Popula os campos de VISUALIZAÇÃO
                document.getElementById('detailsModalTitle').innerText = `Detalhes do Chamado #${chamado.id}`;
                document.getElementById('viewUsuario').innerText = chamado.usuario;
                document.getElementById('viewEmpresa').innerText = chamado.empresa;
                document.getElementById('viewStatus').innerText = chamado.status;
                document.getElementById('viewData').innerText = new Date(chamado.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                document.getElementById('viewTitulo').innerText = chamado.titulo;
                document.getElementById('viewDescricao').innerText = chamado.descricao;

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
        const filtroUsuario = document.getElementById('filterUser').value.toLowerCase();
        const dadosFiltrados = chamados.filter(chamado => {
            const idCorresponde = filtroId ? chamado.id.toString().includes(filtroId) : true;
            const tituloCorresponde = chamado.titulo.toLowerCase().includes(filtroTitulo);
            const dataCorresponde = filtroData ? chamado.data === filtroData : true;
            const statusCorresponde = filtroStatus ? chamado.status === filtroStatus : true;
            const empresaCorresponde = chamado.empresa.toLowerCase().includes(filtroEmpresa);
            const usuarioCorresponde = chamado.usuario.toLowerCase().includes(filtroUsuario);
            return idCorresponde && tituloCorresponde && dataCorresponde && statusCorresponde && empresaCorresponde && usuarioCorresponde;
        });
        renderizarTabela(dadosFiltrados);
    });
    formFiltro.addEventListener('reset', () => {
        setTimeout(() => renderizarTabela(chamados), 0);
    });

    renderizarTabela(chamados);
});