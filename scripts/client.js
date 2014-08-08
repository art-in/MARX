// ---------------------  CONSTANTS  -------------------------------------------
var SLIDES_PANEL_CLASS = "slides";
var SLIDE_PANEL_CLASS = "slide";
var SLIDE_DEFINITION_CLASS = "slide-definition";
// ---------------------  INIT  ------------------------------------------------
window.onload = function () {
    var presentation = new Presentation();
    var presentationElement = $("."+SLIDES_PANEL_CLASS);

    // Check if presentation already has slides.
    var hasSlides = presentationElement.find("."+SLIDE_PANEL_CLASS).length > 0;

    if (hasSlides) {
        // Create slide view-models to sync with the view.
        var slideNodes = presentationElement.find("."+SLIDE_PANEL_CLASS);
        var slides = [];
        $.each(slideNodes, function(index, node) {
            var definitionNode = $(node).find("."+SLIDE_DEFINITION_CLASS)[0];
            var slide = new Slide(definitionNode.innerHTML);
            slides.push(slide)
        });
        presentation.Slides(slides);
        presentation.CurrentSlide(slides[0]);
    }
    else {
        // Create initial slide.
        var slide = new Slide(FIRST_SLIDE_DEFINITION_HELP);
        presentation.Slides.push(slide);
        presentation.CurrentSlide(slide);
    }

    // Start presentation immediately if presentation
    // already contains added/changed slides.
    presentation.InEditMode(!presentation.WasChanged());

    ko.applyBindings(presentation);
    presentation.WasRendered = true;
};