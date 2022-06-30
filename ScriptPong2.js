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
    //objeto para ver el pisarron
    self.boardView = function(canvas,board){
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        this.ctx = canvas.getContext("2d");
    }
})();

window.addEventListener("load",main);

function main (){
    var board = new Board(800,400);
    var canvas = document.getElementById('canvas');
    var board_view = new boardView(canvas,board);
}