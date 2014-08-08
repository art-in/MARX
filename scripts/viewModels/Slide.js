var Slide = function (definitionHTML) {
    var self = this;

    // Indicates that slide was rendered.
    // I.e. passed initial stage of adding to the DOM and KO binding.
    // Necessary because we do not need to do some actions
    // when slide was just added (e.g. slide out edit elements).
    this.WasRendered = false;

    // Markdown definition as HTML.
    this.DefinitionHTML = ko.observable(definitionHTML == undefined ? null : definitionHTML);

    // Markdown definition as text.
    this.Definition = ko.computed(function () {
        return getTextFromHtml(self.DefinitionHTML());
    });

    // The HTML rendered from Markdown definition.
    this.OutputHTML = ko.computed(function () {
        if (!self.Definition()) {
            return;
        }

        var converter = new Showdown.converter();
        return converter.makeHtml(self.Definition());
    });

    // Indicates that slide definition was changed.
    this.WasChanged = ko.computed(function () {
        return self.DefinitionHTML() &&
            self.DefinitionHTML() != FIRST_SLIDE_DEFINITION_HELP;
    });
}

FIRST_SLIDE_DEFINITION_HELP =
"<div>Welcome to __MARX__ (or Marks)</div> \
<div>----</div> \
<div>___</div> \
<div>Start typing [Markdown](http://daringfireball.net/projects/markdown/syntax/) in the textbox below...</div> \
<div>>>... save your presentation with __Ctrl+S__ when you are ready</div>";