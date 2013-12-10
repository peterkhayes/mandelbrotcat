var DIVERGE_LIMIT = 4;
var ITERATION_LIMIT = 16;
var ZOOM_FACTOR = 1;
var MINX = -2.2;
var MAXX = 0.8;
var MINY = -1;
var MAXY = 1;
var START_MINX = -2.2;
var START_MAXX = 0.8;
var START_MINY = -1;
var START_MAXY = 1;

var calcTime = 0;

var mandelbrot = function(a, b) {
  var time = new Date();

  var zA = 0;
  var zB = 0;

  var zA2 = 0;
  var zB2 = 0;
  for (var i = 0; i < ZOOM_FACTOR*ITERATION_LIMIT; i++) {
    if (zA2 + zB2 > DIVERGE_LIMIT*ZOOM_FACTOR*ZOOM_FACTOR) {
      return Math.floor(i/ZOOM_FACTOR);
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
  vis.html('');
  var xStep = (MAXX - MINX)/40;
  var yStep = (MAXY - MINY)/30;

  for (var i = 0; i < 30; i++) {
    row = $('<div class="row"></div>');
    for (var j = 0; j < 40; j++) {
      var x = MINX + j*xStep;
      var y = MINY + i*yStep;
      var iters = (mandelbrot(x,y));
      row.append(makeSquare(iters, x, y));
    }
    vis.append(row);
  }

};

var zoomIn = function(x, y) {
  var xDist = (MAXX - MINX)/2;
  var yDist = (MAXY - MINY)/2;
  MAXX = x + xDist/2;
  MINX = x - xDist/2;
  MAXY = y + yDist/2;
  MINY = y - yDist/2;
  ZOOM_FACTOR++;
  if (ZOOM_FACTOR > 1) {
    $('.zoomout').show();
  } else {
    $('.zoomout').hide();
  }
  render();
};

var zoomOut = function() {
  var xDist = (MAXX - MINX)/2;
  var yDist = (MAXY - MINY)/2;
  MAXX = MAXX + xDist;
  MINX = MINX - xDist;
  MAXY = MAXY + yDist;
  MINY = MINY - yDist;
  ZOOM_FACTOR--;
  if (ZOOM_FACTOR > 1) {
    $('.zoomout').show();
  } else {
    $('.zoomout').hide();
  }
  render();
};

var move = function(direction) {
  var x = 0;
  var y = 0;
  if (direction === 'up') {
    y = -1;
  } else if (direction === 'down') {
    y = 1;
  } else if (direction === 'right') {
    x = 1;
  } else if (direction === 'left') {
    x = -1;
  }

  console.log(MINX, MAXX, MINY, MAXY);

  var quarter_width = (MAXX - MINX)/4;
  var quarter_height = (MAXY - MINY)/4;
  MINX = MINX + x*quarter_width;
  MAXX = MAXX + x*quarter_width;
  MINY = MINY + y*quarter_height;
  MAXY = MAXY + y*quarter_height;

  console.log(MINX, MAXX, MINY, MAXY);
  console.log("---");


  render();
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
});