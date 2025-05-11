// Função para listar todos os cadastros
function listarCadastros() {
    // Faz uma requisição ao endpoint '/listar' para obter os cadastros
    fetch('/listar')
        .then(response => response.json()) // Converte a resposta para JSON
        .then(data => {
            const lista = document.getElementById('lista_cadastros'); // Obtém o elemento da lista
            lista.innerHTML = ''; // Limpa a lista antes de exibir os cadastros
            data.forEach(item => {
                // Adiciona cada cadastro à lista
                lista.innerHTML += `
                    <li>
                        <strong>Nome:</strong> ${item[0]}<br>
                        <strong>Telefone:</strong> ${item[1]}<br>
                        <strong>Email:</strong> ${item[2]}<br>
                        <strong>Tipo:</strong> ${item[3]}<br>
                        <strong>Apartamento:</strong> ${item[4] || 'N/A'}<br>
                        <strong>Bloco:</strong> ${item[5] || 'N/A'}
                    </li>
                    <hr>
                `;
            });
        })
        .catch(error => console.error('Erro ao listar cadastros:', error)); // Exibe erros no console
}

// Função para alternar a exibição dos campos de Apartamento e Bloco
function toggleMoradorFields() {
    const type = document.getElementById('type').value; // Obtém o valor do campo "Tipo"
    const moradorFields = document.getElementById('morador_fields'); // Obtém o elemento dos campos adicionais

    // Exibe os campos de apartamento e bloco se o tipo for "Morador" ou "Visitante"
    if (type === 'Morador' || type === 'Visitante') {
        moradorFields.style.display = 'block';
    } else {
        moradorFields.style.display = 'none'; // Oculta os campos caso contrário
    }
}

// Função para consultar um cadastro
function consultarCadastro() {
    const nome = document.getElementById('nome_consulta').value.trim(); // Obtém o nome
    const email = document.getElementById('email_consulta').value.trim(); // Obtém o email
    const mensagemConsulta = document.getElementById('mensagem_consulta'); // Elemento para exibir mensagens
    const resultadoConsulta = document.getElementById('resultado_consulta'); // Elemento para exibir o resultado

    // Limpa mensagens e resultados anteriores
    mensagemConsulta.innerText = '';
    resultadoConsulta.innerHTML = '';

    // Verifica se pelo menos um dos campos foi preenchido
    if (!nome && !email) {
        mensagemConsulta.innerText = 'Por favor, insira um nome ou email para consultar.';
        return;
    }

    // Faz a consulta do cadastro pelo nome ou email
    fetch(`/consultar?nome=${nome}&email=${email}`)
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                // Exibe mensagem se o cadastro não for encontrado
                mensagemConsulta.innerText = data.message;
            } else {
                // Exibe os dados encontrados
                mensagemConsulta.innerText = ''; // Limpa mensagens
                resultadoConsulta.innerHTML = `
                    <li>
                        <strong>Nome:</strong> ${data.NOME}<br>
                        <strong>Telefone:</strong> ${data.TELEFONE}<br>
                        <strong>Email:</strong> ${data.EMAIL}<br>
                        <strong>Tipo:</strong> ${data.TIPO}<br>
                        <strong>Apartamento:</strong> ${data.APARTAMENTO || 'N/A'}<br>
                        <strong>Bloco:</strong> ${data.BLOCO || 'N/A'}
                    </li>
                `;
            }
        })
        .catch(error => {
            mensagemConsulta.style.color = 'red';
            mensagemConsulta.innerText = 'Erro ao consultar cadastro.';
            console.error('Erro ao consultar cadastro:', error);
        });
}

// Função para deletar um cadastro
function deletarCadastro() {
    const nome = document.getElementById('nome_delete').value.trim(); // Obtém o nome do cadastro a ser deletado
    const email = document.getElementById('email_delete').value.trim(); // Obtém o email do cadastro a ser deletado
    const resultadoDeletar = document.getElementById('resultado_deletar'); // Elemento para exibir o resultado
    const mensagemDeletar = document.getElementById('mensagem_deletar'); // Elemento para exibir mensagens de erro ou sucesso

    // Limpa mensagens anteriores
    mensagemDeletar.innerText = '';
    resultadoDeletar.innerHTML = '';

    // Verifica se os campos foram preenchidos
    if (!nome || !email) {
        mensagemDeletar.innerText = 'Por favor, insira o nome e o email para deletar.';
        return;
    }

    // Faz a consulta do cadastro pelo nome e email
    fetch(`/consultar?nome=${nome}&email=${email}`)
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                // Exibe mensagem se o cadastro não for encontrado
                mensagemDeletar.innerText = data.message;
            } else {
                // Exibe os dados encontrados e um botão para confirmar a exclusão
                resultadoDeletar.innerHTML = `
                    <li>
                        <strong>Nome:</strong> ${data.NOME}<br>
                        <strong>Telefone:</strong> ${data.TELEFONE}<br>
                        <strong>Email:</strong> ${data.EMAIL}<br>
                        <strong>Tipo:</strong> ${data.TIPO}<br>
                        <strong>Apartamento:</strong> ${data.APARTAMENTO || 'N/A'}<br>
                        <strong>Bloco:</strong> ${data.BLOCO || 'N/A'}
                    </li>
                    <button onclick="confirmarDelecao('${nome}', '${email}')">Confirmar Exclusão</button>
                `;
                mensagemDeletar.style.color = 'green';
                mensagemDeletar.innerText = 'Cadastro encontrado. Confirme a exclusão abaixo.';
            }
        })
        .catch(error => {
            mensagemDeletar.style.color = 'red';
            mensagemDeletar.innerText = 'Erro ao consultar cadastro para deletar.';
            console.error('Erro ao consultar cadastro para deletar:', error);
        });
}

// Função para confirmar a exclusão de um cadastro
function confirmarDelecao(nome, email) {
    const mensagemDeletar = document.getElementById('mensagem_deletar'); // Elemento para exibir mensagens de erro ou sucesso
    const resultadoDeletar = document.getElementById('resultado_deletar'); // Elemento para exibir o resultado

    // Faz a requisição ao endpoint '/deletar' para excluir o cadastro
    fetch('/deletar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: nome, email: email }) // Envia o nome e email do cadastro a ser deletado
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                mensagemDeletar.innerText = data.error; // Exibe mensagem de erro
            } else {
                mensagemDeletar.innerText = data.message; // Exibe mensagem de sucesso
                resultadoDeletar.innerHTML = ''; // Limpa o resultado após exclusão
                listarCadastros(); // Atualiza a lista de cadastros
            }
        })
        .catch(error => {
            mensagemDeletar.style.color = 'red'; // Define a cor da mensagem como vermelha
            mensagemDeletar.innerText = 'Erro ao deletar cadastro.'; // Exibe mensagem de erro
            console.error('Erro ao deletar cadastro:', error);
        });
}

// Função para criar um cadastro
function criarCadastro(event) {
    event.preventDefault(); // Impede o comportamento padrão do formulário

    const name = document.getElementById('name').value.trim(); // Obtém o nome
    const phone = document.getElementById('phone').value.trim(); // Obtém o telefone
    const email = document.getElementById('email').value.trim(); // Obtém o email
    const type = document.getElementById('type').value.trim(); // Obtém o tipo
    const apartamento = document.getElementById('apartamento').value.trim(); // Obtém o apartamento
    const bloco = document.getElementById('bloco').value.trim(); // Obtém o bloco
    const mensagemErro = document.getElementById('mensagem_erro'); // Elemento para exibir mensagens de erro
    const mensagemSucesso = document.getElementById('mensagem_sucesso'); // Elemento para exibir mensagens de sucesso

    // Validação de campos obrigatórios
    if (!name || !phone || !email || !type) {
        mensagemErro.innerText = 'Por favor, preencha todos os campos obrigatórios.';
        mensagemSucesso.innerText = '';
        return;
    }
    // Validação de formato de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex para validar e-mail
    if (!emailRegex.test(email)) {
        mensagemErro.innerText = 'Por favor, insira um e-mail válido.';
        mensagemSucesso.innerText = '';
        return;
    }

    // Validação de Apartamento e Bloco
    if (type === 'Morador' || type === 'Visitante') {
        if (!apartamento || !bloco) {
            mensagemErro.innerText = 'Por favor, preencha os campos Apartamento e Bloco.';
            mensagemSucesso.innerText = '';
            return;
        }
    }

    const form = document.getElementById('form_cadastro'); // Obtém o formulário
    const formData = new FormData(form); // Cria um objeto FormData com os dados do formulário

    // Faz a requisição ao endpoint '/cadastrar' para criar o cadastro
    fetch('/cadastrar', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                mensagemErro.innerText = data.error; // Exibe mensagem de erro
                mensagemSucesso.innerText = '';
            } else {
                mensagemSucesso.innerText = data.message; // Exibe mensagem de sucesso
                mensagemErro.innerText = '';
                listarCadastros(); // Atualiza a lista de cadastros
            }
        })
        .catch(error => {
            mensagemErro.innerText = 'Erro ao criar cadastro.';
            mensagemSucesso.innerText = '';
            console.error('Erro ao criar cadastro:', error); // Exibe erros no console
        });
}

// Função para atualizar um cadastro
function atualizarCadastro(event) {
    event.preventDefault(); // Impede o comportamento padrão do formulário

    const name = document.getElementById('name').value.trim(); // Obtém o nome
    const phone = document.getElementById('phone').value.trim(); // Obtém o telefone
    const email = document.getElementById('email').value.trim(); // Obtém o email
    const type = document.getElementById('type').value.trim(); // Obtém o tipo
    const apartamento = document.getElementById('apartamento').value.trim(); // Obtém o apartamento
    const bloco = document.getElementById('bloco').value.trim(); // Obtém o bloco
    const mensagemErro = document.getElementById('mensagem_erro'); // Elemento para exibir mensagens de erro
    const mensagemSucesso = document.getElementById('mensagem_sucesso'); // Elemento para exibir mensagens de sucesso

    // Validação de campos obrigatórios
    if (!name || !phone || !email || !type) {
        mensagemErro.innerText = 'Por favor, preencha todos os campos obrigatórios.';
        mensagemSucesso.innerText = '';
        return;
    }

    // Validação de Apartamento e Bloco
    if (type === 'Morador' || type === 'Visitante') {
        if (!apartamento || !bloco) {
            mensagemErro.innerText = 'Por favor, preencha os campos Apartamento e Bloco.';
            mensagemSucesso.innerText = '';
            return;
        }
    }

    const form = document.getElementById('form_cadastro'); // Obtém o formulário
    const formData = new FormData(form); // Cria um objeto FormData com os dados do formulário

    // Faz a requisição ao endpoint '/atualizar' para atualizar o cadastro
    fetch('/atualizar', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                mensagemErro.innerText = data.error; // Exibe mensagem de erro
                mensagemSucesso.innerText = '';
            } else {
                mensagemSucesso.innerText = data.message; // Exibe mensagem de sucesso
                mensagemErro.innerText = '';
                listarCadastros(); // Atualiza a lista de cadastros
            }
        })
        .catch(error => {
            mensagemErro.innerText = 'Erro ao atualizar cadastro.';
            mensagemSucesso.innerText = '';
            console.error('Erro ao atualizar cadastro:', error); // Exibe erros no console
        });
}

// Função para formatar o telefone no formato (XX) XXXXX-XXXX
function formatarTelefone(input) {
    let valor = input.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (valor.length > 10) {
        // Formato com DDD e 9 dígitos
        valor = valor.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (valor.length > 6) {
        // Formato com DDD e 8 dígitos
        valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (valor.length > 2) {
        // Formato com DDD
        valor = valor.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    } else {
        // Apenas DDD
        valor = valor.replace(/^(\d*)/, '($1');
    }
    input.value = valor; // Atualiza o valor do input
}
function recarregarPagina() {
    location.reload(); // Recarrega a página atual
}