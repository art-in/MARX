// ---------------------  CUSTOM KO BINDING HANDLERS -------------------------------
ko.bindingHandlers.editableHTML = {
    init: function(element, valueAccessor) {
        $(element).on('keyup', function() {
            var value = valueAccessor();
            value(this.innerHTML);
        });
    },
    update: function(element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (element.innerHTML != value) {
            element.innerHTML = value;
        }
    }
};