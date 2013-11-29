requirejs.config({
    paths: {
        backbone: "../bower_components/backbone/backbone",
        bootstrap: "../bower_components/bootstrap/dist/js/bootstrap",
        jquery: "../bower_components/jquery/jquery",
        underscore: "../bower_components/underscore/underscore"
    },
    shim: {
        backbone: {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        },
        bootstrap: ["jquery"],
        jquery: {
            exports: "jQuery"
        },
        underscore: {
            exports: "_"
        }
    }
});

require(["backbone", "bootstrap"], function (Backbone) {
    var generateView = function ($, value) {
        var type = $.type(value);

        if (type === "array") {
            var model = new Backbone.Model({collection: value});
            var view = new ArrayView({model: model});
        } else if (type === "object") {
            var model = new Backbone.Model(value);
            var view = new ObjectView({model: model});
        } else {
            var model = new Backbone.Model({value: value});
            var view = new ValueView({model: model});
        }

        return view;
    };

    var ArrayView = Backbone.View.extend({
        tagName: "ul",
        initialize: function () {
            this.render();
        },
        render: function () {
            this.$el
                .empty()
                .append(this.model.get("collection").map(function (value) {
                    return $("<li>").append(generateView($, value).el);
                }));
        }
    });

    var ObjectView = Backbone.View.extend({
        tagName: "dl",
        initialize: function () {
            this.render();
        },
        render: function () {
            this.$el
                .empty()
                .append($.map(this.model.attributes, function (value, key) {
                    return [
                        $("<dt>").text(key),
                        $("<dd>").append(generateView($, value).el)
                    ];
                }));
        }
    });

    var ValueView = Backbone.View.extend({
        tagName: "span",
        initialize: function () {
            this.render();
        },
        render: function () {
            this.$el
                .empty()
                .text(this.model.get("value"));
        }
    });

    var renderEndpointJson = function () {
        $.getJSON($("#url").val(), function (data) {
            $("#collection")
                .empty()
                .append(generateView($, data).el);
        });
    };

    $("#form").submit(function (event) {
        event.preventDefault();
        renderEndpointJson();
    });
});