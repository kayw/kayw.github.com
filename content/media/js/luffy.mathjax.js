/* Load mathjax if needed */

var luffy = luffy || {};
luffy.mathjax = function() {
    var delim = "$"; 
    var mathjax = "http://cdn.mathjax.org/mathjax/latest/MathJax.js";

    /* Don't load if we don't find the delimiter. */
    if ($("#lf-main").text().indexOf(delim) === -1) return;

    /* Otherwise, load. Input: TeX/AMS. Output: HTML+CSS.*/
    $script(mathjax + "?config=TeX-AMS_HTML-full&delayStartupUntil=configured",
	    function() {
		  /* Add more configuration stuff */
		  MathJax.Hub.Config({
		      elements: ["lf-main"], // Only process part of the page.
              messageStyle: "none", // turn off status message
		      tex2jax: {
			  inlineMath: [ [delim,delim] ],
			  displayMath: [ [delim + delim, delim + delim] ],
			  processEnvironments: false
		      },
		      "HTML-CSS": {
			  scale: 97,
			  showMathMenu: false
		      }
		  });
		  MathJax.Hub.Configured();
		  MathJax.Hub.Startup.onload();
	    });
};
