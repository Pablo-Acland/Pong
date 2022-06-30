(function(){
    // objeto pisaron
    self.Board = function(width,height){
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
    },

    //prototipo del pisarron
    self.Board.prototype = {
        get elements(){
            //paso bars con map para pasar los elementos uno por uno para hacer una copia y que no sature de basura
            var elements = this.bars;
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

        this.speed_y = 0;
        this.speed_x=3;
        this.speed = 3;
        this.board = board;

        board.ball = this;
        this.kind = "circle";
        

    }
})();

(function(){
    //objeto Barra
    self.Bar = function(x,y,width,height,board){
        this.x = x;
        this.y = y;
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
            this.y += this.speed;
        },
        //Sube la Barra en el eje y
        up: function(){
            this.y -= this.speed;
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
            this.clean();
            this.draw();
        }

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
    var bar= new Bar(40,150,30,100,board);
    var bar_2= new Bar(735,150,30,100,board);
    var ball = new Ball(400,200,10,board);

//control de inputs del teclado
document.addEventListener("keydown",function(ev){
    ev.preventDefault();
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
});

//window.addEventListener("load",main);
window.requestAnimationFrame(main);
function main (){
    
    board_view.play();
    window.requestAnimationFrame(main);
}