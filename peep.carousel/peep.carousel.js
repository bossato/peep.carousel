/*
 * peep carousel v0.1
 * Copyright 2013 Kazuya Sato
 */

if (typeof Object.create !== 'function') {
  Object.create = function(obj) {
    function F() {};
      F.prototype = obj;
      return new F();
  };
}

(function($, window, document) {
  var Carousel = {
    init: function(options, el) {
      var base = this;
      var $elem = $(el);

      base.options = $.extend({}, $.fn.peepCarousel.options, options);
      base.$elem = $elem;

      base.set();
    },

    set: function() {
      var base = this;
      base.carouselId = base.$elem.attr('id');
      base.carouselUl = base.$elem.find('ul');
      base.carouselLi = base.carouselUl.find('li');
      base.carouselLiFirst = base.carouselLi.first();
      base.carouselLiLast = base.carouselLi.last();
      base.imageSize = base.carouselLi.find('img').size();
      base.count = base.minCount = 1;
      base.maxCount = Math.ceil(parseFloat(base.imageSize / base.options.displayImageNum));
      base.startPosX = base.endPosX = 0;
      base.translateVal = 10;

      base.setEventType();

      base.buildCarousel();
      if (base.options.displayPagination) base.buildPagination();

      base.eventListener();
    },

    setEventType: function() {
      var base = this;

      var events = {
        tap: {
          touch: 'tap',
          mouse: 'click'
        },
        start: {
          touch: 'touchstart',
          mouse: 'mousedown'
        },
        move: {
          touch: 'touchmove',
          mouse: 'mousemove'
        },
        end: {
          touch: 'touchend',
          mouse: 'mouseup'
        }
      };

      var agent = navigator.userAgent;
      if (agent.search(/iPhone/) != -1 || agent.search(/iPad/) != -1 || agent.search(/Android/) != -1) {
        base.eventTypes = 'touch';
      } else {
        base.eventTypes = 'mouse';
      }

      base.eventTap = events.tap[base.eventTypes];
      base.eventStart = events.start[base.eventTypes];
      base.eventMove = events.move[base.eventTypes];
      base.eventEnd = events.end[base.eventTypes];
    },

    buildCarousel: function() {
      var base = this;
      var windowWidth = $(window).width();
      var paddingPx = (base.options.displaySide) ? windowWidth * windowWidth * base.options.sidePercent * 0.00015 : 0;
      var carouselDisplayWidth = windowWidth - paddingPx * 2;
      var carouselLiWidth = carouselDisplayWidth / base.options.displayImageNum;
      var carouselUlWidth = carouselLiWidth * (base.imageSize + base.options.displayImageNum - 1) + paddingPx * 2;

      base.translateXWidth = carouselLiWidth * base.options.displayImageNum;
      base.$elem.css('width', 'auto');
      base.carouselUl.width(carouselUlWidth);
      base.carouselUl.height(base.carouselLi.height());
      base.carouselLi.width(carouselLiWidth);
      base.carouselLiFirst.css('padding-left', paddingPx);
      base.carouselLiLast.css('padding-right', paddingPx);

      var translateWidth = - base.translateXWidth * (base.count - 1);
      base.translatePagination(translateWidth);
    },

    buildPagination: function() {
      var base = this;
      var prevTemplate = '<div class="peep-button peep-prev"><span></span></div>';
      var nextTemplate = '<div class="peep-button peep-next"><span></span></div>';

      var pageTemplate = '';
      for (var i = 1; i <= base.maxCount; i++) {
        if (i == 1) {
          pageTemplate = pageTemplate + '<div class="peep-page"><span class="active"></span></div>';
        } else {
          pageTemplate = pageTemplate + '<div class="peep-page"><span></span></div>';
        }
      }

      var paginationTemplate = '<div class="peep-pagination">' + prevTemplate + pageTemplate + nextTemplate + '</div>';
      base.$elem.append(paginationTemplate);
      base.paginationDiv = base.$elem.find('div.peep-pagination').children('div.peep-page');
    },

    eventListener: function() {
      var base = this;

      $(window).resize(function() {
        base.buildCarousel();
      });

      $(document).on(base.eventTap, '#' + base.carouselId + ' div.peep-prev', function() {
        base.prev();
      });

      $(document).on(base.eventTap, '#' + base.carouselId + ' div.peep-next', function() {
        base.next();
      });

      $(document).on(base.eventStart, '#' + base.carouselId + ' ul', function(e) {
        base.startPosX = e.pageX;
      });

      $(document).on(base.eventEnd, '#' + base.carouselId + ' ul', function(e) {
        base.endPosX = e.pageX;
        var translateX = base.startPosX - base.endPosX;

        if (translateX < -base.translateVal) {
          base.prev();
        } else if (base.translateVal < translateX) {
          base.next();
        }

        base.startPosX = base.endPosX = 0;
      });
    },

    prev: function() {
      var base = this;

      if (base.count > base.minCount) {
        base.count--;
        var count = base.count - 1;
        var translateWidth = - base.translateXWidth * count;
        base.translatePagination(translateWidth);
        base.initPagination(count);
      }

      return false;
    },

    next: function() {
      var base = this;

      if (base.count < base.maxCount) {
        var translateWidth = - base.translateXWidth * base.count;

        base.initPagination();
        base.translatePagination(translateWidth);
        base.count++;
      }

      return false;
    },

    initPagination: function(count) {
      var base = this;
      if (!base.options.displayPagination) return;
      if (typeof count === "undefined") count = base.count;

      base.paginationDiv.children().removeClass('active');
      base.paginationDiv.eq(count).find('span').addClass('active');
    },

    translatePagination: function(translateWidth) {
      var base = this;
      base.carouselUl.css({
        '-webkit-transform' : 'translate3d(' + translateWidth + 'px, 0, 0)',
        '-moz-transform'    : 'translate3d(' + translateWidth + 'px, 0, 0)',
        '-webkit-transition': '-webkit-transform 400ms cubic-bezier(0, 0, 0.25, 1)',
        '-moz-transition'   : '-moz-transform 400ms cubic-bezier(0, 0, 0.25, 1)'
      });
    }
  };

  $.fn.peepCarousel = function(options) {
    return this.each(function() {
      var carousel = Object.create(Carousel);
      carousel.init(options, this);
    });
  };

  $.fn.peepCarousel.options = {
    displayImageNum   : 3,
    displayPagination : true,
    displaySide       : true,
    sidePercent       : 1
  };
})(jQuery, window, document);
