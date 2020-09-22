var canvas = document.getElementById("cobrinha");
var contexto = canvas.getContext("2d");
var caixa = 32;
var cobrinha = [];
var fruta = {eixoX: 0, eixoY: 0}
var frutaOld = Object.assign({}, fruta);;
var direcoes = ["direita", "esquerda", "descer", "subir"]
var direcao = "direita";
var timerControleJogo = null;
var frutas = 0;
var bordaInfinita = true;
var ranking = [];
var velocidades = ["500", "450", "400", "350", "300", "250", "200", "150", "100", "50"];
var velocidadeJogo = 0;

//Função para definir a posição inicial da cobrinha
function posicaoInicialCobrinha(){
    //Limpa os dados da cobrinha
    cobrinha = [];

    //Determina a posição inicial da cobrinha
    cobrinha.push({
        eixoX: 8 * 32,
        eixoY: 8 * 32
    });
}

//Função para definir a posição da frutinha
function determinarPosicaoFrutinha(){
    //Aguarda a definição da posição da frutinha sem coincidir com a cobrinha e a última posição da frutinha
    while(true){
        //Define uma nova posição para a frutinha
        fruta.eixoX = Math.floor(Math.random() * 15 + 1) * caixa;
        fruta.eixoY = Math.floor(Math.random() * 15 + 1) * caixa;
        
        //Verifica a posição da frutinha
        if(verificarPosicaoFrutinhaAnterior() === true && verificarPosicaoFrutinhaTela() === 0){
            break;
        }
    }
}

//Função para verificar a posição anterior da frutinha
function verificarPosicaoFrutinhaAnterior(){
    if(fruta.eixoX !== frutaOld.eixoX && fruta.eixoY !== frutaOld.eixoY){
        frutaOld = Object.assign({}, fruta);
        return true;
    }
    else{
        return false;
    }
}

//Função para verificar a posição da frutinha na tela
function verificarPosicaoFrutinhaTela(eixoX, eixoY){
    var status = cobrinha.reduce((contador, posicao) => {
        //Verifica se a posição da frutinha
        if(eixoX === posicao.eixoX && eixoY === posicao.eixoY){
            contador++;
        }
        return contador;
    }, 0);

    return status;
}

//Função para determinar a direção aleatória do jogo
function determinarDirecaoJogo(){
    var indiceDirecao = Math.floor(Math.random() * 4);
    direcao = direcoes[indiceDirecao];
}

//Função para criar a área do jogo
function criarAreaJogo(){
    contexto.fillStyle = "lightgreen";
    contexto.fillRect(0, 0, (16 * caixa), (16 * caixa));
}

//Função para criar a cobrinha
function criarCobrinha(){
    for(cob of cobrinha){
        contexto.fillStyle = "green";
        contexto.fillRect(cob.eixoX, cob.eixoY, caixa, caixa);
    }
}

//Função para criar a frutinha
function criarFrutinha(){
    //Cria frutinha na tela
    contexto.fillStyle = "red";
    contexto.fillRect(fruta.eixoX, fruta.eixoY, caixa, caixa);
}

//Cria evento para verificar o teclado
document.addEventListener("keydown", (event) => {
    //Seta para esquerda
    if(event.keyCode === 37 && direcao !== "direita") direcao = "esquerda";

    //Seta para cima
    if(event.keyCode === 38 && direcao !== "descer") direcao = "subir";

    //Seta para direita
    if(event.keyCode === 39 && direcao !== "esquerda") direcao = "direita";

    //seta para baixo
    if(event.keyCode === 40 && direcao !== "subir") direcao = "descer";
});

//Função para movimentar a cobrinha
function movimentarCobrinha(){
    if(bordaInfinita){
        //Verifica a posição da cabeça para definir a posição com a borda infinita
        if(cobrinha[0].eixoX > (15 * caixa)) cobrinha[0].eixoX = 0;
        if(cobrinha[0].eixoX < 0) cobrinha[0].eixoX = 15 * caixa;
        if(cobrinha[0].eixoY > (15 * caixa)) cobrinha[0].eixoY = 0;
        if(cobrinha[0].eixoY < 0) cobrinha[0].eixoY = 15 * caixa;
    }
    else{
        //Verifica a posição da cabeça sem borda infinita
        if(cobrinha[0].eixoX > (15 * caixa) || 
           cobrinha[0].eixoX < 0 || 
           cobrinha[0].eixoY > (15 * caixa) ||
           cobrinha[0].eixoY < 0){
                //Fim de jogo
                fimDeJogo();
        }
    }

    //Verifica se a cabeça se choca com o corpo
    for (let i = 1; i < cobrinha.length; i++) {
        if(cobrinha[0].eixoX === cobrinha[i].eixoX && cobrinha[0].eixoY === cobrinha[i].eixoY){
            //Fim de jogo
            fimDeJogo();
        }
    }

    //Cria área do jogo
    criarAreaJogo();

    //Cria cobrinha na área do jogo
    criarCobrinha();

    //Cria frutinha na área do jogo
    criarFrutinha();

    //Armazena a posição da cabeça da cobrinha
    let posicaoEixoX = cobrinha[0].eixoX;
    let posicaoEixoY = cobrinha[0].eixoY;

    //Verifica a direção da cobrinha
    if(direcao == "direita") posicaoEixoX += caixa;
    if(direcao == "esquerda") posicaoEixoX -= caixa;
    if(direcao == "subir") posicaoEixoY -= caixa;
    if(direcao == "descer") posicaoEixoY += caixa;

    //Verifica se a cobrinha pegou a frutinha
    if(posicaoEixoX !== fruta.eixoX || posicaoEixoY !== fruta.eixoY){
        //Retira última posicao do array da cobrinha
        cobrinha.pop();
    }
    else{
        //Atualiza as frutas coletadas
        frutas++;
        atualizarPlacar(frutas);

        //Determina a nova posição da frutinha
        determinarPosicaoFrutinha();
        
        //Verifica o placar para determinar a nova velocidade
        alterarVelocidade();
    }

    //Incluí nova posição no inicio do array da cobrinha
    cobrinha.unshift({
        eixoX: posicaoEixoX,
        eixoY: posicaoEixoY
    });
}

//Função para alterar a velocidade durante o jogo
function alterarVelocidade(){
    var levelVelocidade = 5;
    
    //Verifica o placar para alterar a velocidade
    if(frutas % levelVelocidade === 0){
        //Verifica se o índice está dentro do tamanho do array de velocidades
        if(velocidadeJogo < velocidades.length - 1){
            //Seta a nova velocidade do jogo
            velocidadeJogo++;
            
            //Reconfigura a velocidade do jogo
            clearInterval(timerControleJogo);
            setarVelocidade(velocidades[velocidadeJogo]);
            timerControleJogo = setInterval(movimentarCobrinha, velocidades[velocidadeJogo]);
        }
    }
}

//Função para resetar o ranking
function resetarRanking(){
    //Reseta o ranking
    ranking = [];

    //Limpa o ranking
    limparRanking();
}

//Função para limpar o ranking
function limparRanking(){
    //Referência a tabela do ranking
    let tab = document.getElementById("tabela-ranking");
    
    //Exclui as linhas enquanto houver linhas além do cabeçalho
    while(tab.rows.length>2){
        tab.deleteRow(tab.rows.length-1);
    }
}

//Função para atualizar a tabela do ranking
function atualizarRanking(){
    //Referência a tabela do ranking
    let tab = document.getElementById("tabela-ranking");

    //Limpa o ranking
    limparRanking();

    //Itera no array com o ranking
    for(const rank of ranking){
        //Referência a tabela de ranking
        var novaLinha = tab.insertRow(tab.rows.length);
        
        //Dados da primeira coluna do ranking
        var celulaPosicao = novaLinha.insertCell(0);
        celulaPosicao.innerHTML = (tab.rows.length - 2) + "°";

        //Dados da segunda coluna do ranking
        var celulaPontos = novaLinha.insertCell(1);
        celulaPontos.innerHTML = rank.pontos;

        //Dados da terceira coluna do ranking
        var celulaVelocidade = novaLinha.insertCell(2);
        celulaVelocidade.innerHTML = (velocidades.indexOf(String(rank.velocidade)) + 1) + "x";

        //Dados da quarta coluna do ranking
        var celulaBorda = novaLinha.insertCell(3);
        celulaBorda.innerHTML = (rank.borda) ? "Ativada" : "Desativada";
    }
}

//Função para iniciar o jogo
function iniciarJogo(){
    //Determina a configuração da velocidade
    var velocidade = retornarConfiguracaoVelocidade();
    velocidadeJogo = velocidades.indexOf(String(velocidade));

    //Determina a configuração da borda infinita
    bordaInfinita = retornarConfiguracaoBordaInfinita();
    
    //Cria a área do jogo
    criarAreaJogo();

    //Determina a posição da frutinha
    determinarPosicaoFrutinha();

    //Desabilita as configurações do jogo
    configuracoesJogo(true);

    //Reseta o placar
    frutas = 0;
    atualizarPlacar(0);

    //Determina a direção do jogo
    determinarDirecaoJogo();

    //Função para fazer os movimentos da cobrinha
    timerControleJogo = setInterval(movimentarCobrinha, velocidade);
}

//Função para resetar as configurações do jogo
function resetarJogo(){
    //Reseta o placar
    frutas = 0;
    atualizarPlacar(0);

    //Configura a velocidade como 1x
    velocidadeJogo = 0;
    document.getElementById('lista-velocidades').value = velocidades[velocidadeJogo];

    //Habilita a borda infinita
    document.getElementById("borda-infinita").checked = true;
}

//Função para parar o jogo
function pararJogo(){
    //Habilita as configurações do jogo
    configuracoesJogo(false);

    //Verifica se o objeto de controle do jogo não é nulo
    if(timerControleJogo !== null){
        clearInterval(timerControleJogo);
    }
}

//Função para retornar a configuração da velocidade
function retornarConfiguracaoVelocidade(){
    var velocidade = document.getElementById("lista-velocidades");
    return parseInt(velocidade.value);
}

//Função para retornar a configuração da borda infinita
function retornarConfiguracaoBordaInfinita(){
    var borda = document.getElementById("borda-infinita");
    return Boolean(borda.checked);
}

//Função para retornar o placar das frutas coletadas
function retornarPlacarFrutas(){
    var frutas = document.getElementById("frutas-placar");
    return parseInt(frutas.innerHTML);
}

//Função para atualizar o placar
function atualizarPlacar(frutas){
    document.getElementById("frutas-placar").innerHTML = frutas;
}

//Função para setar a velocidade na tela
function setarVelocidade(velocidade){
    //Seta a velocidade
    document.getElementById('lista-velocidades').value = velocidade;
}

//Função para gerar os dados do ranking
function gerarDadosRanking(){
    if(frutas > 0){
        //cria um ranking local temporário
        var rank = ranking.slice();

        //Inclui o novo placar no ranking local
        rank.push({
            pontos: retornarPlacarFrutas(), 
            velocidade: retornarConfiguracaoVelocidade(), 
            borda: retornarConfiguracaoBordaInfinita()
        });
        
        
        //ordena o ranking local
        rank.sort((a, b) => {
            if(a.pontos < b.pontos){
                return 1;
            }
            else{
                if(a.pontos === b.pontos){
                    if(a.velocidade > b.velocidade){
                        return 1;
                    }
                    else{
                        if(a.pontos === b.pontos && a.velocidade === b.velocidade && a.borda){
                            return 1;
                        }
                        else{
                            return -1;
                        }
                    }
                }
                else{
                    return -1;
                }
            }
        });

        //Gera o novo ranking
        ranking = [];
        ranking = rank.slice(0,5);
    }
}

//
function fimDeJogo(){
    //Para o controle de intervalo do jogo
    clearInterval(timerControleJogo);

    //Atualiza o ranking
    gerarDadosRanking();
    atualizarRanking();
    
    //Habilita as configurações do jogo
    configuracoesJogo(false);
    
    //Exibi mensagem de fim de jogo
    alert("Game Over!");
}

//Função para habilitar/desabilitar as configurações do jogo
function configuracoesJogo(estado){
    //Posição inicial da cobrinha
    posicaoInicialCobrinha();

    //Habilita ou desabilita as configurações do jogo
    document.getElementById("lista-velocidades").disabled = estado;
    document.getElementById("borda-infinita").disabled = estado;

    //Habilita ou desabilita os botões do jogo
    document.getElementById("botao-iniciar-jogo").disabled = estado;
    document.getElementById("botao-resetar-jogo").disabled = estado;
    document.getElementById("botao-parar-jogo").disabled = !estado;
    document.getElementById("botao-resetar-ranking").disabled = estado;
}

//Função para configurar o jogo ao abrir a tela
function configurarJogoPrimeiraVez(){
    //Posição inicial da cobrinha
    posicaoInicialCobrinha();

    //Cria a área do jogo
    criarAreaJogo();

    //Habilita ou desabilita as configurações do jogo
    document.getElementById("lista-velocidades").disabled = false;
    document.getElementById("borda-infinita").disabled = false;

    //Habilita ou desabilita os botões do jogo
    document.getElementById("botao-iniciar-jogo").disabled = false;
    document.getElementById("botao-resetar-jogo").disabled = false;
    document.getElementById("botao-parar-jogo").disabled = true;
    document.getElementById("botao-resetar-ranking").disabled = false;

    //Zera o placar
    frutas = 0;
    atualizarPlacar(frutas);

    //Reseta o ranking
    limparRanking();
}
configurarJogoPrimeiraVez();
