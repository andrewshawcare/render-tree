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
        initialize: function () {
            this.$el.addClass("row")
            this.render();
        },
        render: function () {
            this.$el
                .empty()
                .append(this.collection.map(function (value) {
                    return $("<div>")
                        .addClass("col-md-6")
                        .append(generateView($, value.toJSON()).el);
                }));
        }
    });

    var ObjectView = Backbone.View.extend({
        tagName: "div",
        initialize: function () {
            this.$imageEl = $("<img>")
                .addClass("media-object img-rounded");

            this.$alignImageEl = $("<a>")
                .addClass("pull-left")
                .attr("href", "#")
                .append(this.$imageEl);

            this.$mediaBodySubheading = $("<small>");

            this.$mediaBodyHeading = $("<h4>")
                .addClass("media-heading");

            this.$audioEl = $("<audio>")
                .attr("controls", true)
                .attr("preload", "none");

            this.$bodyEl = $("<div>")
                .addClass("media-body")
                .append(this.$mediaBodyHeading)
                .append(this.$audioEl);

            this.$el
                .addClass("media")
                .append(this.$alignImageEl)
                .append(this.$bodyEl);

            this.render();
        },
        render: function () {
            this.$imageEl.attr("src", this.model.attributes.artworkUrl100);
            this.$mediaBodySubheading.text(this.model.attributes.artistName);
            this.$mediaBodyHeading
                .empty()
                .text(this.model.attributes.trackName)
                .append(this.$mediaBodySubheading);
            this.$audioEl.attr("src", this.model.attributes.previewUrl);
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
            "http://itunes.apple.com/search?term=" + $("#term").val(), 
            {
                dataType: "jsonp",
                success: function (data) {
                    $("#collection")
                        .empty()
                        .append(generateView($, data.results).el);
                }
            }
        );
    };

    $("#search").submit(function (event) {
        event.preventDefault();
        renderEndpointJson();
    });
});