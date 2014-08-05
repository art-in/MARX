var Slide = function(definition) {
    var self = this;

    // Markdown definition as HTML.
    this.DefinitionHTML = ko.observable(definition == undefined ? null : definition);

    // Markdown definition as text.
    this.Definition = ko.computed(function() {
        return getTextFromHtml(self.DefinitionHTML());
    });

    this.OutputHTML = ko.computed(function() {
        if (!self.Definition()) {
            return;
        }

        var converter = new Showdown.converter();
        return converter.makeHtml(self.Definition());
    });
}