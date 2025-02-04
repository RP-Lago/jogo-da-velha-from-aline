let jogador = "X";
let vencedor = null;
let jogadores = {};
let player1Wins = 0;
let player2Wins = 0;
let partidasJogadas = 0;
let numPartidas = 1;

document.addEventListener('DOMContentLoaded', function() {
    reiniciarTudo(); // Abre a tela de registro ao carregar a página
});

function iniciarJogo() {
    const player1Name = document.getElementById('player1-name-modal').value.trim();
    const player2Name = document.getElementById('player2-name-modal').value.trim();
    const player1Gender = document.getElementById('player1-gender').value;
    const player2Gender = document.getElementById('player2-gender').value;
    const player1Piece = document.querySelector('input[name="player1-piece"]:checked');
    numPartidas = parseInt(document.getElementById('num-partidas').value);

    if (!player1Name || !player2Name) {
        alert("Por favor, preencha o nome de ambos os jogadores.");
        return;
    }

    if (!player1Piece) {
        alert("Por favor, selecione a peça para o Jogador 1 (X ou O).");
        return;
    }

    let piece1 = player1Piece.value;
    let piece2 = piece1 === 'X' ? 'O' : 'X';

    jogadores = {
        player1: {
            id: generateId(),
            name: player1Name,
            piece: piece1,
            gender: player1Gender,
            wins: 0,
        },
        player2: {
            id: generateId(),
            name: player2Name,
            piece: piece2,
            gender: player2Gender,
            wins: 0
        }
    }

    atualizarDadosJogadores()
    document.getElementById('modal-registro').style.display = 'none';
    partidasJogadas = 0; // Reseta as partidas jogadas
    player1Wins = 0;
    player2Wins = 0;
    atualizarPlacar();

}

function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function atualizarDadosJogadores() {
    document.getElementById('player1-display').textContent = jogadores.player1.name;
    document.getElementById('player2-display').textContent = jogadores.player2.name;
    document.getElementById('player1-piece').textContent = jogadores.player1.piece;
    document.getElementById('player2-piece').textContent = jogadores.player2.piece;
     document.querySelector('.jogador1 .jogador-icon').src = `src/assets/jogador${getJogadorIcon(jogadores.player1.gender)}.png`;
     document.querySelector('.jogador2 .jogador-icon').src = `src/assets/jogador${getJogadorIcon(jogadores.player2.gender)}.png`;

    jogador = jogadores.player1.piece;
    document.getElementById('jogador-selecionado').textContent = jogador;
}

function getJogadorIcon(gender) {
    switch (gender) {
        case 'male':
            return 1;
        case 'female':
            return 2;
        case 'outro(a)':
            return 4;
        default:
            return 3;
    }
}

function escolherQuadrado(id) {
    if (vencedor !== null) {
        return;
    }

    const quadrado = document.getElementById(id);
    if (quadrado.textContent !== "-") {
        return;
    }

    quadrado.textContent = jogador;
    quadrado.style.color = 'white';

    const linhaVencedora = verificarVencedor();
     if (linhaVencedora) {
        vencedor = jogador;
       document.getElementById('vencedor-selecionado').textContent = `O vencedor é ${jogadores.player1.piece === jogador ? jogadores.player1.name : jogadores.player2.name}`;
        destacarVitoria(linhaVencedora);
         updateWins();
        destacarJogadorVencedor();
        partidasJogadas++;
       setTimeout(()=>{
           reiniciarJogoAtual()
       }, 1500) // Reinicia apos 1,5 segundos
        setTimeout(()=> {
            verificarVencedorFinal();
        }, 2000); // Espera 2 segundos antes de exibir o vencedor final

        return;
    }


    if (verificarEmpate()) {
        vencedor = 'empate';
        document.getElementById('vencedor-selecionado').textContent = 'Empate!';
        partidasJogadas++;
         setTimeout(()=>{
           reiniciarJogoAtual()
       }, 1500)
         setTimeout(()=> {
            verificarVencedorFinal();
        }, 2000);
        return;
    }
    jogador = jogador === jogadores.player1.piece ? jogadores.player2.piece : jogadores.player1.piece;
    document.getElementById('jogador-selecionado').textContent = jogador;
}
function destacarVitoria(linha) {
  linha.forEach(id => {
      document.getElementById(id).classList.add('vencedor-quadrado');
    });
}
function removerDestaque(linha) {
     linha.forEach(id => {
      document.getElementById(id).classList.remove('vencedor-quadrado');
    });
}
function verificarVencedor() {
    const v = [
        [1, 2, 3], [4, 5, 6], [7, 8, 9],
        [1, 4, 7], [2, 5, 8], [3, 6, 9],
        [1, 5, 9], [3, 5, 7]
    ];

    for (let i = 0; i < v.length; i++) {
        const [a, b, c] = v[i];
        const quadradoA = document.getElementById(a).textContent;
        const quadradoB = document.getElementById(b).textContent;
        const quadradoC = document.getElementById(c).textContent;

        if (quadradoA === jogador && quadradoB === jogador && quadradoC === jogador) {
            return v[i];
        }
    }
    return false;
}

function verificarEmpate() {
    for (let i = 1; i <= 9; i++) {
        if (document.getElementById(i).textContent === "-") {
            return false;
        }
    }
    return true;
}

function updateWins() {
    if (vencedor === jogadores.player1.piece) {
        player1Wins++;
        document.getElementById('player1-wins').textContent = player1Wins;
         jogadores.player1.wins = player1Wins;
    } else if (vencedor === jogadores.player2.piece) {
        player2Wins++;
         document.getElementById('player2-wins').textContent = player2Wins;
        jogadores.player2.wins = player2Wins;
    }
}
function destacarJogadorVencedor() {
     const jogadorIcon = vencedor === jogadores.player1.piece ? document.getElementById('player1-icon') : document.getElementById('player2-icon');
    jogadorIcon.classList.add('jogador-icon-destaque');
    setTimeout(() => {
        jogadorIcon.classList.remove('jogador-icon-destaque');
    }, 1000);
}
function reiniciarJogoAtual() {
     if(vencedor !== 'empate'){
        const linha = verificarVencedor();
           if(linha){
            removerDestaque(linha);
        }
    }
    vencedor = null;
    for (let i = 1; i <= 9; i++) {
        document.getElementById(i).textContent = "-";
         document.getElementById(i).style.color = 'rgba(9, 53, 115, 0.0)';
    }
    document.getElementById('vencedor-selecionado').textContent = "";
    document.getElementById('jogador-selecionado').textContent = jogador;
}
function reiniciarTudo() {
     document.getElementById('modal-registro').style.display = 'flex';
       reiniciarJogoAtual()
        player1Wins = 0;
        player2Wins = 0;
        partidasJogadas = 0;
        document.getElementById('player1-wins').textContent = player1Wins;
        document.getElementById('player2-wins').textContent = player2Wins;
        document.getElementById('player1-name-modal').value = "";
        document.getElementById('player2-name-modal').value = "";
        document.getElementById('num-partidas').value = 1;
        document.querySelector('input[name="player1-piece"]:checked').checked = false;
        document.getElementById('player1-gender').value = "Selecione";
        document.getElementById('player2-gender').value = "Selecione";

        atualizarPlacar();
}

function verificarVencedorFinal() {
    if (partidasJogadas >= numPartidas) {
          let vencedorFinal = '';
        if(jogadores.player1.wins > jogadores.player2.wins) {
            vencedorFinal = jogadores.player1.name;
        }else if(jogadores.player1.wins < jogadores.player2.wins) {
            vencedorFinal = jogadores.player2.name;
        } else {
             vencedorFinal = 'Empate';
        }

      document.getElementById('vencedor-final-text').textContent = `O grande vencedor das partidas foi: ${vencedorFinal}!`;
        document.getElementById('modal-vencedor-final').style.display = 'flex';

    }
}
function fecharModalFinal() {
    document.getElementById('modal-vencedor-final').style.display = 'none';
}

function atualizarPlacar() {
    document.getElementById('player1-wins').textContent = player1Wins;
    document.getElementById('player2-wins').textContent = player2Wins;
}