(function(){
    // objeto pisaron
    self.Board = function(width,height){
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
        this.score1=0;
        this.score2=0;
    },

    //prototipo del pisarron
    self.Board.prototype = {
        get elements(){
            //paso bars con map para pasar los elementos uno por uno para hacer una copia y que no sature de basura
            var elements = this.bars.map(function(bar){return bar;});
            elements.push(this.ball);
            return elements;
        }
    }

})();

(function(){
    //objeto pelota
    self.Ball = function(x,y,radius,board){
        this.x = x;
        this.y = y;
        this.radius = radius;

        this.speed_y = 1;
        this.speed_x=3;
        this.speed = 3;
        this.board = board;

        board.ball = this;
        this.kind = "circle";
        this.direccion_x = 1;
        this.direccion_y = 1;
        this.bounce_angle = 0;
        this.max_bounce_angle= Math.PI / 12;
    }

    //prototipo de la pelota
    self.Ball.prototype ={

        // muve la pelota de lugar
        muve: function(){
            this.x += (this.speed_x * this.direccion_x);
            this.y += (this.speed_y * this.direccion_y);

        },
        collision: function(bar){

                //colisiona con una barra que resive como parametro
             var relative_intesect_y = (bar.y + (bar.height / 2)) - this.y;
             var normalized_intersect_y= relative_intesect_y / (bar.height / 2);

             this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;


                var num1 = 735;
                var num2 = 49;
                

             if (this.x >= num1) {
                    
                    this.speed_x= this.speed * Math.cos(this.bounce_angle);
                    this.direccion_x = -1;
             }else if(this.x <= num2){
                    console.log(this.y);
                    this.speed_x= this.speed * Math.cos(this.bounce_angle);
                    this.direccion_x = 1;
             }
        },
        //se obtiene el ancho de la pelota
        get width(){
            return this.radius * 2;
        },
        //se obtiene el largo de la pelota
        get height(){
            return this.radius * 2;
        }
    }
})();

(function(){
    //objeto Barra
    self.Bar = function(x,y,width,height,board,num){
        this.x = x;
        this.y = y;
        this.point= 0;
        this.num = num;
        this.width = width;
        this.height = height;
        this.board = board;
        this.board.bars.push(this);
        this.kind = "rectangle";
        this.speed = 25;
    },

    //prototipo de Barra
    self.Bar.prototype ={
        //Baja la Barra en el eje y
        down: function(){
            //Con 400 esteticamento queda fuera del margen pero funcionalmente es la unica forma de que agarre todo el espacio
            if(this.y != 400){
                this.y += this.speed;
            }
            
            console.log(this.y);
        },
        //Sube la Barra en el eje y
        up: function(){
            if(this.y!= 0){
                this.y -= this.speed;
            }
            
        },
        //sirve para mostrar las cordenadas transformando su valor a String
        toString: function(){
            return "x: "+ this.x+" y: "+this.y;
        }
    }

})();


(function(){
    //objeto para ver el pisarron
    self.boardView = function(canvas,board){
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        this.ctx = canvas.getContext("2d");
    }

    

    self.boardView.prototype= {

        //limpia el pisarron
        clean: function(){
            this.ctx.clearRect(0,0,this.board.width,this.board.height);
        },

            //dibija el pisarron
        draw: function(){
            for (var index = this.board.elements.length - 1; index >=0 ; index--) {
                var el = this.board.elements[index];
                
                draw(this.ctx, el);
            }; 

        },

        //ejecuta los metodos relacionados con el juego
        play: function(){
            if(this.board.playing){
                this.clean();
                this.draw();
                this.Win();
                this.check_colisions();
                this.board.ball.muve();
            }
            
        },

        //detecta las colisiones utilizando las funciones hit y colisions
        check_colisions: function(){
            for (let index = this.board.bars.length -1; index >=0 ; index--) {
                var bar = this.board.bars[index];
                var dir = this.board.ball.y;
                console.log(bar.point);
                if(this.board.ball.x >= 800 && bar.num==1){
                    this.board.score1 += 1;
                    this.board.ball.y = 200;
                    this.board.ball.x = 400;
                    this.board.ball.direccion_x = -1;
                }
                if(0 >=this.board.ball.x  && bar.num==2){
                    this.board.score2 += 1;
                    this.board.ball.y = 200;
                    this.board.ball.x = 400;
                    this.board.ball.direccion_x = 1;
                }
                    
                if(dir >= 400){
                    this.board.ball.direccion_y = -1;
                }
                if(0>=dir){
                    this.board.ball.direccion_y = 1;
                }
                if (hit(bar,this.board.ball)) {
                    console.log("hola")
                    this.board.ball.collision(bar)
                }
            }
        },
        Win: function(){
            score_html_1.innerHTML= this.board.score1;
            score_html_2.innerHTML= this.board.score2;
            if(this.board.score1==5){ 
                setTimeout(this.Reset(),6000);
                ganador.innerHTML="Ganador jugador 1";
                
            }else if(this.board.score2==5){
                setTimeout(this.Reset(),6000);
                ganador.innerHTML="Ganador jugador 2";
                
            }
        },
        Reset: function(){
            this.board.score1=0;
            this.board.score2=0;
            ganador.innerHTML="¿Quien ganara?";
            board.playing = false;
        }

    }

    function hit(a,b){
        //revisa si a coliciona con b
        var hit = false;
        //colisiones horizontales
        if (b.x+b.width >= a.y && b.y < a.y + a.width) {
            //colisiones verticales
            if (b.y+b.height >= a.y && b.y < a.y + a.height) {
                hit= true;
            }
        }
        //colision de a con b
        if (b.x <= a.x && b.x + b.width >= a.x+a.width ) {
            if (b.y <= a.y && b.y + b.height >= a.y + a.height) {
                hit= true;
            }
        }
        //colision b con a
        if (a.x <= b.x && a.x + a.width >= b.x+b.width ) {
            if (a.y <= b.y && a.y + a.height >= b.y + b.height) {
                hit= true;
            }
        }
        return hit;
    }

    //el meto de dibujado con sus opciones
    function draw(ctx,element){
        
        
                switch(element.kind){
            case "rectangle":
                ctx.fillRect(element.x,element.y,element.width,element.height);
                break;
                
            case "circle":
                    ctx.beginPath();
                    ctx.arc(element.x,element.y,element.radius,0,7);
                    ctx.fill();
                    ctx.closePath();
                    break;
        }
        
        
    
    
}

})();

var board = new Board(800,400);
    var canvas = document.getElementById('canvas');
    var board_view = new boardView(canvas,board);
    var bar= new Bar(40,150,30,100,board,1);
    var bar_2= new Bar(736,150,30,100,board,2);
    var ball = new Ball(400,200,10,board);
    var ganador = document.getElementById('ganador');
    var score_html_1 = document.getElementById('score1');
    var score_html_2 = document.getElementById('score2');
    //score1.innerHTML= 3;
    //score2.innerHTML= 3;

//control de inputs del teclado
document.addEventListener("keydown",function(ev){
    //capta la flecha arriba
    if (ev.keyCode==38) {
        bar.up();
    }
    //capta la flecha abajo
    else if (ev.keyCode==40) {
        bar.down();
    }
    //capta la w
    if (ev.keyCode==87) {
        bar_2.up();
    }
    //capta la s
    else if (ev.keyCode==83) {
        bar_2.down();
    }
    //capta el espacio y pausa el juego
    else if (ev.keyCode== 32) {
        ev.preventDefault();
        board.playing = !board.playing;
    }
});

//window.addEventListener("load",main);
board_view.draw();
window.requestAnimationFrame(main);
function main (){
    
    board_view.play();
    window.requestAnimationFrame(main);
}