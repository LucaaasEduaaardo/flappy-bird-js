console.log("Bem vindo! -_-Flappy Bird-_- ");

let frames = 0;
const som_HIT = new Audio("./efeitos/hit.wav");
const som_CAIU = new Audio("./efeitos/caiu.wav");
const som_PONTO = new Audio("./efeitos/ponto.wav");
const som_PULO = new Audio("./efeitos/pulo.wav");

som_HIT.volume = 0.2;
som_CAIU.volume = 0.2;
som_PONTO.volume = 0.2;
som_PULO.volume = 0.2;

const sprites = new Image();
sprites.src = "./sprites.png";

const canvas = document.querySelector("canvas");
const contexto = canvas.getContext("2d");

const score = [];
const fonte_placar = "VT323";
let pontuacaoAtual = 0;
let bestScore = 0;
let indexPlacar = 0;
// [Plano de Fundo]
const planoDeFundo = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,
    desenha() {
        contexto.fillStyle = "#70c5ce";
        contexto.fillRect(0, 0, canvas.width, canvas.height);

        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX,
            planoDeFundo.spriteY,
            planoDeFundo.largura,
            planoDeFundo.altura,
            planoDeFundo.x,
            planoDeFundo.y,
            planoDeFundo.largura,
            planoDeFundo.altura
        );

        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX,
            planoDeFundo.spriteY,
            planoDeFundo.largura,
            planoDeFundo.altura,
            planoDeFundo.x + planoDeFundo.largura,
            planoDeFundo.y,
            planoDeFundo.largura,
            planoDeFundo.altura
        );
    },
};

// [Chao]
function criaChao() {
    const chao = {
        spriteX: 0,
        spriteY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112,
        atualiza() {
            const movimentoDoChao = 1;
            const repeteEm = chao.largura / 2;
            const movimentacao = chao.x - movimentoDoChao;

            // console.log('[chao.x]', chao.x);
            // console.log('[repeteEm]',repeteEm);
            // console.log('[movimentacao]', movimentacao % repeteEm);

            chao.x = movimentacao % repeteEm;
        },
        desenha() {
            contexto.drawImage(
                sprites,
                chao.spriteX,
                chao.spriteY,
                chao.largura,
                chao.altura,
                chao.x,
                chao.y,
                chao.largura,
                chao.altura
            );

            contexto.drawImage(
                sprites,
                chao.spriteX,
                chao.spriteY,
                chao.largura,
                chao.altura,
                chao.x + chao.largura,
                chao.y,
                chao.largura,
                chao.altura
            );
        },
    };
    return chao;
}

function fazColisao(flappyBird, chao) {
    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;

    if (flappyBirdY >= chaoY) {
        return true;
    }

    return false;
}

function criaFlappyBird() {
    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        largura: 33,
        altura: 24,
        x: 10,
        y: 50,
        pulo: 1.6,
        pula() {
            som_PULO.play();
            flappyBird.velocidade = -flappyBird.pulo;
        },
        gravidade: 0.025,
        velocidade: 0,
        atualiza() {
            //
            if (fazColisao(flappyBird, globais.chao)) {
                // console.log("Fez colisao");
                som_HIT.play();
                salvaPlacar();
                mudaParaTela(Telas.GAME_OVER);
                return;
            }

            flappyBird.velocidade =
                flappyBird.velocidade + flappyBird.gravidade;
            if (flappyBird.y <= flappyBird.y + flappyBird.velocidade) {
                // console.log(flappyBird.y);
                // som_CAIU.play();
            }
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
        },
        movimentos: [
            { spriteX: 0, spriteY: 0 }, // asa pra cima
            { spriteX: 0, spriteY: 26 }, // asa no meio
            { spriteX: 0, spriteY: 52 }, // asa pra baixo
            { spriteX: 0, spriteY: 26 }, // asa no meio
        ],
        frameAtual: 0,
        atualizaOFrameAtual() {
            const intervaloDeFrames = 10;
            const passouOIntervalo = frames % intervaloDeFrames === 0;
            // console.log('passouOIntervalo', passouOIntervalo)

            if (passouOIntervalo) {
                const baseDoIncremento = 1;
                const incremento = baseDoIncremento + flappyBird.frameAtual;
                const baseRepeticao = flappyBird.movimentos.length;
                flappyBird.frameAtual = incremento % baseRepeticao;
            }
        },
        desenha() {
            flappyBird.atualizaOFrameAtual();
            const { spriteX, spriteY } =
                flappyBird.movimentos[flappyBird.frameAtual];

            contexto.drawImage(
                sprites,
                spriteX,
                spriteY, // Sprite X, Sprite Y
                flappyBird.largura,
                flappyBird.altura, // Tamanho do recorte na sprite
                flappyBird.x,
                flappyBird.y,
                flappyBird.largura,
                flappyBird.altura
            );
        },
    };
    return flappyBird;
}

/// [mensagemGetReady]
const mensagemGetReady = {
    sX: 134,
    sY: 0,
    w: 174,
    h: 152,
    x: canvas.width / 2 - 174 / 2,
    y: 50,
    desenha() {
        contexto.drawImage(
            sprites,
            mensagemGetReady.sX,
            mensagemGetReady.sY,
            mensagemGetReady.w,
            mensagemGetReady.h,
            mensagemGetReady.x,
            mensagemGetReady.y,
            mensagemGetReady.w,
            mensagemGetReady.h
        );
    },
};

// [mensagemGameOver]
const mensagemGameOver = {
    sX: 134,
    sY: 153,
    w: 226,
    h: 200,
    x: canvas.width / 2 - 226 / 2,
    y: 50,
    desenha() {
        contexto.drawImage(
            sprites,
            mensagemGameOver.sX,
            mensagemGameOver.sY,
            mensagemGameOver.w,
            mensagemGameOver.h,
            mensagemGameOver.x,
            mensagemGameOver.y,
            mensagemGameOver.w,
            mensagemGameOver.h
        );
        let moedas = [
            [0, 78, 45, 45, 73, 136, 45, 45],
            [48, 78, 45, 45, 73, 136, 45, 45],
            [48, 124, 45, 45, 73, 136, 45, 45],
            [0, 124, 45, 45, 73, 136, 45, 45],
        ];
        // moeda 1
        // contexto.drawImage(sprites, 0, 78, 45, 45, 73, 136, 45, 45);
        // let score = salvaPlacar();
        contexto.drawImage(sprites, ...moedas.at(indexPlacar));
        // atual
        // sombra
        contexto.font = `bold 35px ${fonte_placar}`;
        contexto.textAlign = "right";
        contexto.fillStyle = "black";
        contexto.fillText(pontuacaoAtual, canvas.width - 64, 149);
        // texto
        contexto.font = `35px ${fonte_placar}`;
        contexto.textAlign = "right";
        contexto.fillStyle = "white";
        contexto.fillText(pontuacaoAtual, canvas.width - 65, 148);

        // melhor
        // sombra
        contexto.font = `bold 35px ${fonte_placar}`;
        contexto.textAlign = "right";
        contexto.fillStyle = "black";
        contexto.fillText(bestScore, canvas.width - 64, 189);
        // texto
        contexto.font = `35px ${fonte_placar}`;
        contexto.textAlign = "right";
        contexto.fillStyle = "white";
        contexto.fillText(bestScore, canvas.width - 65, 188);
    },
};

function salvaPlacar() {
    let placar = JSON.parse(localStorage.getItem("score"));
    placar.push(pontuacaoAtual);
    placar = placar.sort((a, b) => {
        if (a < b) {
            return 1;
        } else if (a > b) {
            return -1;
        } else {
            return 0;
        }
    });
    placar = [...new Set(placar)];
    placar = placar.slice(0, 4);
    console.log("index placar", indexPlacar);
    localStorage.setItem("score", JSON.stringify(placar));
    bestScore = placar[0];
    placar = placar.reverse();
    indexPlacar = placar.findIndex((v) => v >= pontuacaoAtual);
}

//
// [Canos]
//
function criaCanos() {
    const canos = {
        largura: 52,
        altura: 400,
        chao: {
            spriteX: 0,
            spriteY: 169,
        },
        ceu: {
            spriteX: 52,
            spriteY: 169,
        },
        espaco: 80,
        desenha() {
            canos.pares.forEach(function (par) {
                const yRandom = par.y;
                const espacamentoEntreCanos = 90;

                const canoCeuX = par.x;
                const canoCeuY = yRandom;

                // [Cano do Céu]
                contexto.drawImage(
                    sprites,
                    canos.ceu.spriteX,
                    canos.ceu.spriteY,
                    canos.largura,
                    canos.altura,
                    canoCeuX,
                    canoCeuY,
                    canos.largura,
                    canos.altura
                );

                // [Cano do Chão]
                const canoChaoX = par.x;
                const canoChaoY =
                    canos.altura + espacamentoEntreCanos + yRandom;
                contexto.drawImage(
                    sprites,
                    canos.chao.spriteX,
                    canos.chao.spriteY,
                    canos.largura,
                    canos.altura,
                    canoChaoX,
                    canoChaoY,
                    canos.largura,
                    canos.altura
                );

                par.canoCeu = {
                    x: canoCeuX,
                    y: canos.altura + canoCeuY,
                };
                par.canoChao = {
                    x: canoChaoX,
                    y: canoChaoY,
                };
            });
        },
        temColisaoComOFlappyBird(par) {
            const cabecaDoFlappy = globais.flappyBird.y;
            const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;

            if (globais.flappyBird.x + globais.flappyBird.largura >= par.x) {
                if (cabecaDoFlappy <= par.canoCeu.y) {
                    return true;
                }

                if (peDoFlappy >= par.canoChao.y) {
                    return true;
                }
            }
            return false;
        },
        pares: [],
        atualiza() {
            // atualizar valor para que seja escolhido na dificuldade
            const passouQtdFrames = frames % 200 === 0;
            if (passouQtdFrames) {
                canos.pares.push({
                    x: canvas.width,
                    y: -150 * (Math.random() + 1),
                });
            }

            canos.pares.forEach(function (par) {
                par.x = par.x - 2;

                if (canos.temColisaoComOFlappyBird(par)) {
                    // console.log("Você perdeu!");
                    som_HIT.play();
                    salvaPlacar();
                    mudaParaTela(Telas.GAME_OVER);
                }

                if (par.x + canos.largura <= 0) {
                    canos.pares.shift();
                }
            });
        },
    };

    return canos;
}

function criaPlacar() {
    const placar = {
        pontuacao: 0,
        desenha() {
            contexto.font = `35px ${fonte_placar}`;
            contexto.textAlign = "right";
            contexto.fillStyle = "white";
            contexto.fillText(`${placar.pontuacao}`, canvas.width - 10, 35);
        },
        atualiza() {
            const intervaloDeFrames = 20;
            const passouOIntervalo = frames % intervaloDeFrames === 0;

            if (passouOIntervalo) {
                placar.pontuacao = placar.pontuacao + 1;
            }
            if (!(placar.pontuacao % 10) && placar.pontuacao > 1) {
                som_PONTO.play();
            }
            pontuacaoAtual = placar.pontuacao;
        },
    };
    return placar;
}

//
// [Telas]
//
const globais = {};
let telaAtiva = {};
function mudaParaTela(novaTela) {
    telaAtiva = novaTela;

    if (telaAtiva.inicializa) {
        telaAtiva.inicializa();
    }
}

const Telas = {
    INICIO: {
        inicializa() {
            globais.flappyBird = criaFlappyBird();
            globais.chao = criaChao();
            globais.canos = criaCanos();
        },
        desenha() {
            planoDeFundo.desenha();
            globais.flappyBird.desenha();

            globais.chao.desenha();
            mensagemGetReady.desenha();
        },
        click() {
            mudaParaTela(Telas.JOGO);
        },
        atualiza() {
            globais.chao.atualiza();
        },
    },
    JOGO: {
        inicializa() {
            globais.placar = criaPlacar();
        },
        desenha() {
            planoDeFundo.desenha();
            globais.canos.desenha();
            globais.chao.desenha();
            globais.flappyBird.desenha();
            globais.placar.desenha();
        },
        click() {
            globais.flappyBird.pula();
        },
        atualiza() {
            globais.canos.atualiza();
            globais.chao.atualiza();
            globais.flappyBird.atualiza();
            globais.placar.atualiza();
        },
    },
    GAME_OVER: {
        desenha() {
            mensagemGameOver.desenha();
        },
        atualiza() {},
        click() {
            mudaParaTela(Telas.INICIO);
        },
    },
};

function startGame() {
    telaAtiva.desenha();
    telaAtiva.atualiza();

    frames++;
    requestAnimationFrame(startGame);
}

window.addEventListener("click", function () {
    if (telaAtiva.click) {
        telaAtiva.click();
    }
});

window.addEventListener("keyup", (event) => {
    telaAtiva.click();
});

if (!localStorage.hasOwnProperty("score")) {
    localStorage.setItem("score", JSON.stringify([]));
}
mudaParaTela(Telas.INICIO);
startGame();
