$(function() {
  var main_page = $('#main-page');
  var toc = $('#toc ul');

  var counter = 0;
  $('#main-page .reachable').each(function() {
    if (!$(this).attr('id')) {
      $(this).attr('id', 'unnamed-' + counter++);
    }
    $(this).click(function() {
      $.bbq.pushState({ slide: $(this).attr('id') });
      return false;
    });
    toc.append($('<li><a href="#slide=' + $(this).attr('id') + '">' + $(this).attr('id') + '</a>'));
  });

  $('a').click(function() {
    var href = $(this).attr('href');
    var state = $.deparam.fragment(href);
    if (state) {
      $.bbq.pushState(state);
      return false;
    }
  });

  var transformPageTo = function(element, options) {
    var globalMatrix = new WebKitCSSMatrix();

    var align = $(element).attr('bluesun-align');
    if (!align || align == 'center') {
      // Center the element.
      globalMatrix = globalMatrix.translate($(element).outerWidth() / 2, $(element).outerHeight() / 2);
    }

    var scale = $(element).attr('bluesun-scale');
    if (!scale || scale == 'fit') {
      // Scale it to fix the screen estate.
      var scaleMargin = 50;
      var scaleMax = $(element).attr('bluesun-scale-max');
      if (!scaleMax) {
        scaleMax = 1.5;
      }
      scale = Math.min(($(window).width() - scaleMargin) / $(element).outerWidth(), ($(window).height() - scaleMargin) / $(element).outerHeight());
      globalMatrix = globalMatrix.scale(1 / Math.min(scale, scaleMax));
    }
    else {
      globalMatrix = globalMatrix.scale(1 / scale);
    }

    /**
     * Apply several transformations and build the resulting matrix.
     *
     * We apply the transformations in reverse order (last one first).
     */
    var applyTransform = function() {
      var transform = $(this).css('-webkit-transform');
      if (transform) {
        var transformMatrix = new WebKitCSSMatrix(transform);
      }
      else {
        var transformMatrix = new WebKitCSSMatrix();
      }

      // Add the element own offset to the transformation.
      // Note: this doesn't work when using jQuery.position(). Not sure why.
      transformMatrix.e += this.offsetLeft;
      transformMatrix.f += this.offsetTop;

      // Note: Webkit is buggy and multiply() is actually a multiplyRight().
      // Once https://bugs.webkit.org/show_bug.cgi?id=38337 lands,
      // inverse the order of the operation.
      globalMatrix = transformMatrix.multiply(globalMatrix);
    }

    // Build the resulting transformation matrix of the element.
    $(element).each(applyTransform);
    $(element).parentsUntil('#main-page').each(applyTransform);

    // Invert the matrix.
    globalMatrix = globalMatrix.inverse();

    // Apply the transformation.
    $('body').removeClass('ghosts');
    main_page.css('-webkit-transform', globalMatrix);
  }

  $(window).bind('hashchange', function(e) {
    var url = e.getState('slide');

    if (!url) {
      url = 'start';
      e.fragment = 'slide=start';
    }

    // Mark the links as active.
    $('a').each(function() {
      if ($(this).attr('href') === '#' + e.fragment) {
        $(this).addClass('active');
      }
      else {
        $(this).removeClass('active');
      }
    });

    // Transform to the proper slide.
    $('#' + url).first().each(function() { transformPageTo(this, {}); });
  });

  main_page.css('-webkit-transition-duration', '0s');
  $(window).trigger('hashchange');
  setTimeout(function() {
    main_page.css('-webkit-transition-duration', '0.8s');
  }, 1);

  // Find the previous / next element in a hierachical list.
  function findAdjacentElementInList(element, direction) {
    if (direction == 'prev') {
      // Find a sibling if possible.
      var candidate = element.prev();
      if (candidate.size()) {
        // Return the latest element in the sibling tree.
        return candidate.find('li').andSelf().last();
      }

      // If no sibling exists, return the parent.
      return element.parents('li').first();
    }
    else {
      // Find children items in this element.
      var candidate = element.find('li').first();
      if (candidate.size()) {
        return candidate;
      }

      // No children item, go to the next sibling if it exists.
      candidate = element.next('li');
      if (candidate.size()) {
        return candidate;
      }

      // No sibling, traverse the parents until finding a matching element.
      element.parents('li').each(function() {
        candidate = $(this).next('li');
        if (candidate.size()) {
          return false;
        }
      });

      return candidate;
    }
  }

  $(document).bind('keyup', 'h', function() {
    // $('body').toggleClass('rotated');
    $('#toc').toggleClass('hidden');
  });

  $(document).bind('keydown', 'Left', function() {
    var current = $('#toc .active');
    if (current) {
      var previous = findAdjacentElementInList(current.parent('li'), 'prev').find('a');
      var state = $.deparam.fragment(previous.attr('href'));
      if (state) {
        $.bbq.pushState(state);
        return false;
      }
    }
  });

  $(document).bind('keydown', 'Right', function() {
    var current = $('#toc .active');
    if (current) {
      var next = findAdjacentElementInList(current.parent('li'), 'next').find('a');
      var state = $.deparam.fragment(next.attr('href'));
      if (state) {
        $.bbq.pushState(state);
        return false;
      }
    }
  });

});
