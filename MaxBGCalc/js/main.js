/* -------- MaxBGC -------- */
/*  maxgbc.jamespark.ninja  */
/* --- James Park: 2020 --- */

jQuery(document).ready( function($) {
  
  var max_total = 1048320,
      max_full = 2040,
      min_full = 8,
      max_square = 1023.87499237,
      max_8bit_square = 1016,
      use8bit = true,
      typingTimer,
      doneTypingInterval = 500,
      preview = $('.maxbgcalc-c-preview-image'),
      wrapper = $('.maxbgcalc-c-preview-wrapper');
  
  function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  
  function scaleBasedOnWindow(elm, scale=1, fit=true){
      var wrapperW = document.getElementById('maxbgcalc-c-preview-wrapper').clientWidth,
          wrapperH = document.getElementById('maxbgcalc-c-preview-wrapper').clientHeight;
    
      console.log(wrapperW+ ' ' + wrapperH);
    
      if(!fit){
          elm.style.transform='scale('+scale/Math.min(elm.clientWidth/wrapperW,elm.clientHeight/wrapperH)+')';
      }else{
          elm.style.transform='scale('+scale/Math.max(elm.clientWidth/wrapperW,elm.clientHeight/wrapperH)+')';
      }
  }
  
  function roundToNearest8(x, direction) {
    if (direction == 'higher') {
      return Math.ceil(x/8)*8;
    } else if (direction == 'lower') {
      return Math.floor(x/8)*8;
    } else {
      return Math.round(x/8)*8;
    }
  }
  
  function calculateSide(inputField, outputField, key) {
    var direction = 'round';
    
    if (key.keyCode == 38) {
      direction = 'higher';
    } else if (key.keyCode == 40) {
      direction = 'lower';
    }
    
    var input = parseFloat(inputField.val());
    if (isNumeric(input)) {
      // Determines max side length
      if (input > max_full) { input = max_full; inputField.val(max_full); }
      if (input < min_full) { input = min_full; inputField.val(min_full); }
      
      if (use8bit) {
        input = roundToNearest8(input, direction); inputField.val(input);
      }
      
      var output = max_total / input;
      
      if (use8bit) {
        output = roundToNearest8(output, 'lower');
      }
      
      if (output > max_full) { output = max_full; }
      
      outputField.val(output);
    } else {
      outputField.val('');
    }
  }
  
  scaleBasedOnWindow(document.getElementById('maxbgcalc-c-preview-image'));
  
  // Toggles the 8x8 priority
  $(document).on('change', '[name="maxbgcalc-a-8x8-priority"]', function(e){
    if ($(this).is(':checked')) {
      use8bit = true;
    } else {
      use8bit = false;
    }
  });
  
  $(document).on('keyup', 'input[type="number"]', function(e) {
    var input = $(this), 
        name = $(this).attr('name'), 
        name2 = (name == 'gb_width' ? 'gb_height' : 'gb_width'),
        tempInterval = (e.keyCode == 38 ? 0 : e.keyCode == 40 ? 0 : doneTypingInterval);
    
    clearTimeout(typingTimer);
    
    typingTimer = setTimeout(function() {
      calculateSide(input, $('input[name="'+name2+'"]'), e)
    }, tempInterval);    
  });
  
  $(document).on('keydown', 'input[type="number"]', function(e) {
    clearTimeout(typingTimer);  
  });
  
  $(document).on('click', '.maxbgcalc-a-convert', function(e){
    e.preventDefault();
    var x = $('input[name="gb_width"]').val(),
        y = $('input[name="gb_height"]').val(),
        url = 'https://via.placeholder.com/'+x+'x'+y;
    
    console.log($('img#maxbgcalc-c-image').attr('src'));
    
    $('#maxbgcalc-c-image').attr('src', url);
    $('#maxbgcalc-c-preview-image').css('width', x+'px').css('height', y+'px');
    scaleBasedOnWindow(document.getElementById('maxbgcalc-c-preview-image'));
  })  
  
});