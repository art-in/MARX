// ---------------------  HELPERS ---------------------------------

/* Converts html string to text.
 Note: not using textContent because it looses line breaks.
 not using innerText because it is not cross-browser,
 and it looses line breaks when being display:none in Chrome.
 http://jsfiddle.net/TcLn8/14/ */
function getTextFromHtml(htmlString) {
    var el = $("<div />").html(htmlString);
    el.find("div").replaceWith(function() { return "\n" + this.innerHTML; });
    el.find("p").replaceWith(function() { return this.innerHTML + "\n"; });
    el.find("br").replaceWith("\n");
    return el[0].textContent;
}