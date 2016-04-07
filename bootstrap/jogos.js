var json;
var linkedListProcess;

$(document).ready(function() {
	$.getJSON('../json/' + $.url('?jogo') + '.json', function(context) {
		json = context;

		comeca(json);
	});
});

function comeca(json) {
	var templateScript = $('#template').html();
	var template = Handlebars.compile(templateScript);
	var html = template(json);
	$('.content-placeholder').html(html);
	$('title').html('Jogo - ' + json.nome);

	$('#cookie').html(
			'Último: ' + getCookie(json.nome + '_data') + '<br />'
					+ 'Acertos: ' + getCookie(json.nome + '_acertos')
					+ '<br />' + 'Erros: ' + getCookie(json.nome + '_erros'));

	init(json.processos);

	$('#limpar').on('click', function() {
		var $btn = $(this).button('loading');

		comeca(json);

		$btn.button('reset');
	})
}

/**
 * 
 * @param processos
 */
function init(processos) {
	linkedListProcess = new LinkedList();
	var gruposDiv = $('#grupos');

	shuffle(processos);

	var divProcess = $('.process');

	for (var i = 0; i < processos.length; i++) {
		var p = processos[i];

		linkedListProcess.append(new LinkedList.Node(p));
	}

	atualizaProcessos();

	appendProcess(linkedListProcess.first.data);
}

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

function appendProcess(processo) {
	$('.process').append(
			'<div class="process-card" id="' + processo.id + '" pid="'
					+ processo.pid + '">' + processo.nome + '</div>');
}

function acertoMizeravi(processCard, processBody) {
	var element = linkedListProcess.first;
	linkedListProcess.remove(element);

	$idProcessCard = processCard.attr("id");
	$pid = processCard.attr("pid");
	$idProcessBody = processBody.attr("id");
	$text = processCard.text();
	var processList = $('[id=' + $idProcessBody + ']>ul');

	processCard.remove();

	if ($idProcessCard == $idProcessBody) {
		atualizaProcessos();

		incrementa('.hit');
		incrementa('#badge-' + $idProcessCard);

		var text = $text;
		if ($pid != 'undefined') {
			text = $pid + " " + $text;
		}
		$('<li class="sucess"></li>').text(text).appendTo(processList)
				.addClass('sucess').effect("pulsate", {
					times : 3
				}, 1000);
		setTimeout(function() {
			$('.sucess').removeClass('sucess');
		}, 3000);

	} else {

		incrementa('.error');

		$('<li id="fail"></li>').text($text).appendTo(processList).addClass(
				"fail").effect("pulsate", {
			times : 3
		}, 1000);
		setTimeout(function() {
			$('#fail').remove();
		}, 3000);

		linkedListProcess.append(element);
	}

	if (linkedListProcess.length == 0) {
		$('.process').append('Acertô, mizeravi! :D');
		setCookie(json.nome + '_data', new Date(), 365);
		setCookie(json.nome + '_acertos', $('.hit').text(), 365);
		setCookie(json.nome + '_erros', $('.error').text(), 365);
	} else {
		appendProcess(linkedListProcess.first.data);
	}
}

function atualizaProcessos() {
	$('#badge').text(linkedListProcess.length);
}

function incrementa(elemento) {
	var e = $(elemento);
	e.text(parseInt(e.text()) + 1);
}

function Grupo(id, nome) {
	this.id = id;
	this.nome = nome;
	this.processos = [];

	this.addProcessos = function(processos) {
		for (var i = 0; i < processos.length; i++) {
			var processo = processos[i];

			this.processos.push(processo);
		}

		return this;
	};
}

function Processo(id, nome) {
	this.id = id;
	this.nome = nome;
}

function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ')
			c = c.substring(1);
		if (c.indexOf(name) == 0)
			return c.substring(name.length, c.length);
	}
	return "";
}

function checkCookie() {
	var username = getCookie("username");
	if (username != "") {
		alert("Welcome again " + username);
	} else {
		username = prompt("Please enter your name:", "");
		if (username != "" && username != null) {
			setCookie("username", username, 365);
		}
	}
}