var express = require('express'),
	fs = require("fs"),
    app = express();

// carregar "banco de dados" (data/jogadores.json e data/jogosPorJogador.json)
var db = {
	players: JSON.parse(fs.readFileSync('server/data/jogadores.json')).players,
	jogosPorJogador: JSON.parse(fs.readFileSync('server/data/jogosPorJogador.json'))
};

// EXERCÍCIO 1
// configurar para servir os arquivos estáticos da pasta "client"
app.use(express.static('client'));

// abrir servidor na porta 3000
app.listen(3000, function () {
  console.log('Listening on port 3000');
});

// EXERCÍCIO 2
// configurar qual templating engine usar.
app.set('view engine', 'hbs');
app.set('views', 'server/views');

// definir rota para página inicial --> renderizar a view index, usando os
// dados do banco de dados "data/jogadores.json" com a lista de jogadores
app.get('/', function (req, res) {
  res.render('index', { players: db.players })
})


// EXERCÍCIO 3
// definir rota para página de detalhes de um jogador --> renderizar a view
// jogador, usando os dados do banco de dados "data/jogadores.json" e
// "data/jogosPorJogador.json", assim como alguns campos calculados
// dica: o handler desta função pode chegar a ter umas 15 linhas de código
function isEquals(jogador, id){
	console.log(jogador.steamid, id)
	return jogador.steamid === id;
}

app.get('/jogador/:numero_identificador/', function(req, res) {
	var id = req.params.numero_identificador;
	var players = db.players;
	var gamesByPlayer = db.jogosPorJogador[id].games;
	var numberOfGames = gamesByPlayer.length;
	var notPlayed = 0, favorite, mostPlayed;
	
	
	for(i=0; i<players.length; i++){
		if(players[i].steamid == id){
			var player = players[i];
		}
	}
	
	for(i=0; i < numberOfGames; i++){		
		if(gamesByPlayer[i].playtime_forever == 0){
			notPlayed++;
		}
	}

	gamesByPlayer.sort(function(a, b) {
		return b.playtime_forever - a.playtime_forever;
	});

	gamesByPlayer = gamesByPlayer.slice(0, 5);
	gamesByPlayer = gamesByPlayer.map(x => {
		x.playtime_forever = parseInt(x.playtime_forever / 60);
		return x;
	})

	res.render('jogador', {
		player: player,
		gamesByPlayer: gamesByPlayer,
		favorite: gamesByPlayer[0],
		numberOfGames: numberOfGames,
		notPlayed: notPlayed
	});
});

