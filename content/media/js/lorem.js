//idzr.org/404
const POSTERS_PER_ROW = 108;
const RING_RADIUS = 300;

function randomString(){
//	var chars = "Â£@ABCDEFGHJKLMNPQRSTUVWXTZã‚ãˆãŠãã‘ã›ã¾ã‚ã‚„ã‚’ã®ã­ã²ã¯ã‚Œ";
    var chars = "404NOTFOUND404NOTFOUND404NOTFOUND404NOTFOUND404NOTFOUND404NOTFOUND"
	var string_length = 1;
	var randomstring = '';
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	return randomstring;
}		

function setup_posters(row){
	var posterAngle = 360 / POSTERS_PER_ROW;
	for (var i = 0; i < POSTERS_PER_ROW; i ++) {
		var poster = document.createElement('div');
		poster.className = 'code';
		
		var transform = 'rotateX(' + (i*6) + 'deg) rotateY(' + (posterAngle * Math.floor(Math.random()*360)) + 'deg) translateZ(' + (RING_RADIUS+Math.floor(Math.random()*50)) + 'px)';
		poster.style.webkitTransform = transform;
		poster.style.opacity = Math.random();
		poster.style.fontSize = (Math.floor(Math.random()*42)+8)+"px";   
		poster.style.top = Math.floor(Math.random()*100)+"px";
		poster.style.left = Math.floor(Math.random()*300)+"px";
		
		var content = poster.appendChild(document.createElement('p'));
		content.textContent = randomString();
		row.appendChild(poster);
	}
}

function initRandomPoster(){
	setup_posters(document.getElementById('ring-1'));
	setup_posters(document.getElementById('ring-2'));
	setup_posters(document.getElementById('ring-3'));
}
//window.addEventListener('load', init, false);
//http://techblog.tilllate.com/2008/07/20/ten-methods-to-obfuscate-e-mail-addresses-compared/ & comment js code
$(function() {
  $('span.codedirection').each(function(){
    var email = $(this).html();
    $(this).replaceWith('<a href="mailto:'+email+'" rel="nofollow" class = "zocial-email zocial-email email-style"> </a>');
  });
});


/*
# Margin Note Aligner
#
# Vertically aligns margin notes with their place markers in
# the text. The form left by the markdown plugin looks like:
#
# <span class="marginmarker">
#   <div class="marginnote">
#     the text of note
#   </div>
# </span>
#
*/
marginalia = function() {

    var marginnotes = [];
    
    /* Find all of the temporary marginnote inline markers */
    $(".marginmarker").each(function(index) {
      var notediv, vpos;
      $(this).removeClass("hidden");
      /* give out unique IDs */
      $(this).attr('id', 'marker' + index);
      /* wrap contents in new div and get the jquery obj for that
       note: wrap() returns original contents for chaining, not the new div! */
      $(this).contents().wrapAll('<div class="marginnote clearfix">');
      notediv = $(this).children(".marginnote");
      /* give out unique IDs to link back to marker */
      notediv.attr('id', 'note' + index);
      /* pull it out of this marker span and save it for positioning loop
         record the position of the marker */
      notediv.detach();
      /* have to add some content to get it laid out within surrounding element,
       --> use hack to avoid leaving any trace by setting
           visibility to hidden and making font-size 0px */
      $(this).text(".").addClass("placeholder");
      vpos = $(this).offset().top;
      return marginnotes.push([notediv, vpos]);
    });
    
    var sidebar = $(".rightcolumn");
    var currentPosition = sidebar.offset().top;
    var gutterH = 5;
    var _i, _len;
    
    /* go through divs, append to sidebar and add spacer elements to insure that they:
     1 - line up with their markers and
     2 - don't overlap with previous margin notes   */
    for (_i = 0, _len = marginnotes.length; _i < _len; _i++) {
      var _ref = marginnotes[_i];
      var note = _ref[0];
      var markerPosition = _ref[1];
      /* no overlap */
      if (markerPosition > currentPosition + gutterH) {
        sidebar.append($('<div class="marginspacer clearfix"> </div>').height(markerPosition - currentPosition));
        sidebar.append(note);
      } else { 
      /* overlap occured, add a minimal "gutter" spacer */
        sidebar.append($('<div class="marginspacer clearfix"> </div>').height(gutterH));
        sidebar.append(note);
      }
      /* calculate new position */
      currentPosition = note.offset().top + note.height();
    }
};


$(function() {
    marginalia();
});


/* http://stackoverflow.com/questions/12949178/jquery-slide-div-from-left-to-right-on-hover-of-img-text */
/*
$('#social-share').hover(function(){
        $('.social').animate({width: '140px'}, 1000)
    }, function(){
        $('.social').animate({width: '0'}, 1000)
    });
    */
var timeout;
$('#social-share').hover(function(){
    if (timeout)
      clearTimeout(timeout);
    $('.social-sites').stop().animate({
        width: 150 //$('.social-sites').width()
    }, 1000);
}, function() {
                timeout = setTimeout(function () {
                    $('.social-sites').stop().animate({
                        width: 0
                    }, 200);
                }, 500)
                });

