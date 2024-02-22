(function(window, document, jQuery) {

//////////////////////////////////////////////////////////////////////////////
// Variables
//////////////////////////////////////////////////////////////////////////////

// Animation
//-----------------------------------------------------------------------------

var del = .08;
var dur = .2;
var ttlDel;


// Elements
//-----------------------------------------------------------------------------

var $cell;
var $refreshBtn;

var oSvg = '<svg class="svg-o" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="64px" height="64px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve"><path class="path-o" stroke-miterlimit="10" d="M15.184000000000001,32a16.816,16.816 0 1,0 33.632,0a16.816,16.816 0 1,0 -33.632,0"></path></svg>';
var xSvg = '<svg class="svg-x" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="64px" height="64px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve"><path class="path-x" stroke-miterlimit="10" d="M14.904,15.029l33.941,33.941"></path><path class="path-x" stroke-miterlimit="10" d="M48.846,15.029L14.904,48.971"></path></svg>';


// Game
//-----------------------------------------------------------------------------

var moves;
var score;
var squares = [];
var turns;

/*
 * To determine a win condition, each square is "tagged" from left
 * to right, top to bottom, with successive powers of 2.  Each cell
 * thus represents an individual bit in a 9-bit string, and a
 * player's squares at any given time can be represented as a
 * unique 9-bit value. A winner can thus be easily determined by
 * checking whether the player's current 9 bits have covered any
 * of the eight "three-in-a-row" combinations.
 * See http://jsfiddle.net/rtoal/5wKfF/
 *
 *     273                 84
 *        \               /
 *          1 |   2 |   4  = 7
 *       -----+-----+-----
 *          8 |  16 |  32  = 56
 *       -----+-----+-----
 *         64 | 128 | 256  = 448
 *       =================
 *         73   146   292
 *
*/

var wins = [7, 56, 448, 73, 146, 292, 273, 84];
var winCells = {
  7: [1, 2, 4],
  56: [8, 16, 32],
  448: [64, 128, 256],
  73: [1, 8, 64],
  146: [2, 16, 128],
  292: [4, 32, 256],
  273: [1, 16, 256],
  84: [4, 16, 64]
};


///////////////////////////////////////////////////////////////////////////////
// Initialize
///////////////////////////////////////////////////////////////////////////////

  var endGame = function(winScore) {
    $cell.off('click');
    $refreshBtn.addClass('enabled');

    var winCellCount = 0;
    $cell.each(function(idx) {
      var $thisCell = $cell.eq(idx);
      var thisScore = parseInt($thisCell.attr('score'));
      if (winCells[winScore].indexOf(thisScore) < 0) {
        $thisCell.addClass('no-win');
      } else {
        $thisCell.addClass('win');
        $thisCell.css({
          'transition-delay': winCellCount * del + 's'
        });
        winCellCount += 1;
      }
    });
  };

  var resetGame = function() {
    var $marks = $cell.find('svg');
    $marks.css({
      opacity: 0,
      transform: 'scale3d(0,0,1)',
      'transition-duration': dur + 's',
    });

    $refreshBtn.css({
      'transition-delay': '0s',
      transform: 'scale3d(1,1,1) rotate3d(0,0,1,360deg)'
    });

    DelayedCall.delay(dur, function() {
      $cell.removeClass('choice-o choice-x no-win win');
      $refreshBtn.removeClass('enabled');
      startGame();
    });

    DelayedCall.delay(2 * dur, function() {
      $cell.attr('style', '');
      $refreshBtn.attr('style', '');
    });
  };

  var startGame = function() {
    var idx;

    moves = 0;
    score = {
      o: 0,
      x: 0
    };
    turn = 1;

    $cell.on('click', function() {
      choose($(this));
    });

    $cell.html('');
  };

  var checkScore = function(player, playerScore) {
    wins.forEach(function(winningScore) {
      if ((winningScore & playerScore) === winningScore) {
        endGame(winningScore);
      }
    });
  };

  var choose = function($choice) {
    if ($choice.hasClass('choice-o') || $choice.hasClass('choice-x')) {
      return;
    }

    // Set player, add element, increment turn
    var className = 'choice-x';
    var svg = xSvg;
    var player = 'x';
    if (turn % 2 === 0) {
      className = 'choice-o';
      player = 'o';
      svg = oSvg;
    }
    $choice.addClass(className);
    $choice.html(svg);
    turn += 1;

    // Add cell score to player score
    score[player] += parseInt($choice.attr('score'));

    // Check score
    checkScore(player, score[player]);
  };

  var init = function() {
    $cell = $('.cell');
    $refreshBtn = $('#board-button > .mi-refresh');

    var cellScore = 1;
    $cell.each(function(idx) {
      $cell.eq(idx).attr('score', cellScore);
      cellScore += cellScore;
    });

    startGame();

    $refreshBtn.on('click', function() {
      resetGame();
    });
  };

  
  init();

}(this, this.document, this.jQuery));