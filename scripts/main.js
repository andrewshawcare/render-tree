requirejs.config({
    paths: {
        backbone: "../lib/backbone/backbone",
        bootstrap: "../lib/bootstrap/dist/js/bootstrap",
        jquery: "../lib/jquery/jquery",
        underscore: "../lib/underscore/underscore"
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
            var view = new ArrayView({
                collection: new Backbone.Collection(value)
            });
        } else if (type === "object") {
            var view = new ObjectView({
                model: new Backbone.Model(value)}
            );
        } else {
            var view = new ValueView({
                model: new Backbone.Model({
                    value: value
                })
            });
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
                .append(this.collection.map(function (value) {
                    return $("<li>").append(generateView($, value.toJSON()).el);
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
                .attr("contenteditable", true)
                .text(this.model.get("value"));
        }
    });

    var renderEndpointJson = function () {
        $.ajax(
            $("#url").val(),
            {
                dataType: "jsonp",
                success: function (data) {
                    $("#collection")
                        .empty()
                        .append(generateView($, data).el);
                }
            }
        );
    };

    $("#form").submit(function (event) {
        event.preventDefault();
        renderEndpointJson();
    });
});
