window.addEventListener('load', init, false);

var canvas=null,
	ctx=null,
	PAUSE= false,
	score=0,
	GAMEOVER= false,
	animal = [],
	json, copyJson,
	tamano=0,
	busquedaanimal;
	key = {38: false,
				39: false,
				40: false,
				37: false};

var player = new Rectangle(275, 225, 50, 50,"player","http://www.i2clipart.com/cliparts/d/f/b/a/clipart-red-round-button-64x64-dfba.png");
// Enunciado header 
var scoreP, scoreN, titleH, totalS;

function init(){

	// inicializar Canvas y eventos
  	canvas=document.getElementById('canvas');
  	ctx=canvas.getContext('2d');
 	document.addEventListener('keydown',KeyDown,false);
  	document.addEventListener('keyup',KeyUp,false);

	// Inicializar contenedores para los enunciados en el encabezado
	scoreP = document.getElementById("positivo");
	scoreN = document.getElementById("negativo");
	titleH = document.getElementById("nombreAnimal");
	totalS = document.getElementById("total");

  	// Cargar archivo JSON
  	cargaJson("http://reto.anglus.co/data.json"); 
}

function cargaJson(url) {

	// Cargar archivo JSON
	$.getJSON(url, {format: "json"}, function(data) {

		// Almacenar archivo JSON
		json = data.words.slice();
		copyJson = json.slice();

		// Longitud archivo JSON
		tamano=json.length;

		cargaranimles();
		run();

	});
}

function cargaranimles(){

	var Res= ramdon2();
	var name = copyJson[Res].name;
	var url = copyJson[Res].image;
	animal.push(new Rectangle(255,10,90,90,name,url));
	copyJson.splice(Res, 1);

	Res= ramdon2();
	var name = copyJson[Res].name;
	var url = copyJson[Res].image;
	animal.push(new Rectangle(10,155,90,90,name,url));
	copyJson.splice(Res, 1);


	Res= ramdon2();
	name = copyJson[Res].name;
	url = copyJson[Res].image;
	animal.push(new Rectangle(500,155,90,90,name,url));
	copyJson.splice(Res, 1);


	Res= ramdon2();
	name = copyJson[Res].name;
	url = copyJson[Res].image;
	animal.push(new Rectangle(60,390,90,90,name,url));
	copyJson.splice(Res, 1);

	Res= ramdon2();
	name = copyJson[Res].name;
	url = copyJson[Res].image;
	animal.push(new Rectangle(440,390,90,90,name,url));
	copyJson.splice(Res, 1);

	busquedaanimal = json[random(tamano)].name;
	
	// Muestrar en pantalla el nombre del animal
	titleH.innerHTML = busquedaanimal;
}

function scorePositivo(){
	score += 10;
	scoreP.style.opacity = 1;
	totalS.innerHTML = "Puntaje total: "+score;

	// Desaparezco el marcador del display
	setTimeout(function(){ scoreP.style.opacity = 0; }, 1500);
}

function scoreNegativo(){
	score -= 10;
	scoreN.style.opacity = 1;
	totalS.innerHTML = "Puntaje total: "+score;

	// Desaparezco el marcador del display
	setTimeout(function(){ scoreN.style.opacity = 0; }, 1500);
}

function run(){

	if(GAMEOVER){ restart(); }
	if(!PAUSE){ move(); }

	paint(ctx);
	setTimeout(run,50);
}

function restart() {
	player.x=275;
	player.y=225;
	PAUSE=false;
	GAMEOVER=false;

	copyJson = json.slice();
	animal = [];
	cargaranimles();
}

function KeyDown(event) {

	if (event.keyCode == 38) {
		key[38] = true;
	}else if(event.keyCode ==39) {
		key[39] = true;
	}else if(event.keyCode ==40) {
		key[40] = true;
	}else if(event.keyCode ==37) {
		key[37] = true;
	}else if(event.keyCode ==13){
 		PAUSE =!PAUSE;
 	}
}

function KeyUp(event) {

	if (event.keyCode == 38) {
		key[38] = false;
	}else if(event.keyCode ==39) {
		key[39] = false;
	}else if(event.keyCode ==40) {
		key[40] = false;
	}else if(event.keyCode ==37) {
		key[37] = false;
	}
}

function move(){

	if (key[38] == true){
		player.y-=10;
	}
	if (key[39] == true){
		player.x+=10;
	}
	if (key[40] == true){
		player.y+=10;
	}
	if (key[37] == true){
		player.x-=10;
	}

	if(player.x> canvas.width){
		player.x=-50;
	}else if(player.x<-50){
		player.x=canvas.width;
	}else if(player.y> canvas.height){
		player.y=-20;
	}else if(player.y<-20){
		player.y=canvas.height;
	}

	// animal Intersects
	for(var i=0,l=animal.length;i<l;i++){

 		if(player.intersects(animal[i])){
 			if(busquedaanimal==animal[i].name){
 				scorePositivo();
 			}
 			else{
 				scoreNegativo();
			}
			PAUSE=false;
			GAMEOVER=true;
		}
	}
}

function paint(ctx){
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle='#0f0';
	ctx.drawImage(player.image, player.x, player.y);

	for(var i=0,l=animal.length;i<l;i++){
		ctx.drawImage(animal[i].image, animal[i].x, animal[i].y);
	}

    if (PAUSE) {
    	ctx.textAlign='center';
		if(GAMEOVER){
			ctx.fillText('GAME OVER',150,75);
		}
	}
}

function Rectangle(x,y,width,height,name,url){
	this.name=name;

		// Cargar recurso url como imagen
    this.image = new Image();
    this.image.src= url;

	this.x=(x==null)?0:x;
	this.y=(y==null)?0:y;
	this.width=(width==null)?0:width;
	this.height=(height==null)?this.width:height;
	this.intersects=function(rect){
		if(rect!=null){

			return(this.x<rect.x+rect.width&&
				this.x+this.width>rect.x&&
				this.y<rect.y+rect.height&&
				this.y+this.height>rect.y);
		}
	}
}

function random(max){
	return Math.floor(Math.random()*max);
}

function ramdon2(){
	res=Math.floor(Math.random()*copyJson.length);
	return res;
}