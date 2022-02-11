var DIVERGE_LIMIT = 4;
var ITERATION_LIMIT = 16;
var ZOOM_FACTOR = 1;
var X = -0.5;
var Y = 0;
var STEP = 0.1;

var mandelbrot = function(a, b) {
  var time = new Date();

  var zA = 0;
  var zB = 0;

  var zA2 = 0;
  var zB2 = 0;
  for (var i = 0; i < ZOOM_FACTOR*ITERATION_LIMIT; i++) {
    if (zA2 + zB2 > DIVERGE_LIMIT*ZOOM_FACTOR*ZOOM_FACTOR) {
      return ~~(i/ZOOM_FACTOR) || ITERATION_LIMIT;
    } else {
      var tempZA = zA2 - zB2 + a;
      zA += zA;
      zB = zA * zB + b;
      zA = tempZA;

      zA2 = zA * zA;
      zB2 = zB * zB;
    }
  }
  calcTime += new Date() - time;
  return ITERATION_LIMIT;
};

var makeSquare = function(type, x, y) {
  var square = $('<div class="square' + (type === ITERATION_LIMIT ? ' black' : '')  + '"></div>');
  if (type < ITERATION_LIMIT) {
    var img = $("<img src='img/"+type+".gif'>");
    $(square).append(img);
    $(img).attr('x', x).attr('y', y);
  }
  $(square).attr('x', x).attr('y', y);
  return square;
};

var render = function() {
  calcTime = 0;
  var vis = $('.visualizer');
  $('.row').remove();

  var halfXCount = ~~($(window).width()/64);
  var halfYCount = ~~($(window).height()/64);

  // var rotate = halfYCount > halfXCount;

  for (var i = -1*halfYCount - 1; i < halfYCount + 1; i++) {
    row = $('<div class="row"></div>');
    for (var j = -1*halfXCount - 1; j < halfXCount + 1; j++) {
      var square_x = X + j*STEP;
      var square_y = Y + i*STEP;
      var iters = (mandelbrot(square_x,square_y));
      row.append(makeSquare(iters, square_x, square_y));
    }
    vis.append(row);
  }
};

var zoomIn = function(click_x, click_y) {
  X = click_x;
  Y = click_y;
  STEP /= 2;
  ZOOM_FACTOR++;
  if (ZOOM_FACTOR > 1) {
    $('.zoomout').show();
  } else {
    $('.zoomout').hide();
  }
  render();
};

var zoomOut = function() {
  STEP *= 2;
  ZOOM_FACTOR--;
  if (ZOOM_FACTOR > 1) {
    $('.zoomout').show();
  } else {
    $('.zoomout').hide();
  }
  render();
};

var move = function(direction) {
  if (direction === 'up') {
    Y -= 5*STEP;
  } else if (direction === 'down') {
    Y += 5*STEP;
  } else if (direction === 'right') {
    X += 5*STEP;
  } else if (direction === 'left') {
    X -= 5*STEP;
  }

  render();
};

var flashEyes = function() {
  var eyes = $('.eyes');
  eyes.animate({
    'opacity': 0.15
  }, 500, 'swing', function() {
      eyes.animate({
      'opacity': 0
    }, 500, 'swing', function() {
      setTimeout(flashEyes, Math.random()*15000);
    });
  });
};

$(document).on('ready', function() {
  render();

  $(document).on('click', '.square', function(e) {
    var x = parseFloat($(e.target).attr("x"));
    var y = parseFloat($(e.target).attr("y"));
    zoomIn(x, y);
  });

  $(document).on('click', '.zoomout', function(e) {
    zoomOut();
  });

  $(document).on('click', '.nav', function(e) {
    move($(e.target).attr('direction'));
  });

  $(document).on('click', '.explanation', function() {
    $('.explanation').hide();
    $('.nav').show();
    $('.zoomout').hide();
  });

  $(document).on('click', 'a', function(e) {
    $(e).stopPropagation();
  });

  $(window).resize(function() {
    render();
  });

  setTimeout(flashEyes, Math.random()*15000);
});