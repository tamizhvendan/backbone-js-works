var app = {};

(function (shapes) {

	shapes.Rectangle = Backbone.Model.extend({
		initialize : function () {
			this.on('change', function(){
				if (this.get('length') <= 0 || this.get('width') <= 0) 
					throw new Error('Invalid Dimesions!')
			}, this);
		},

		defaults : {
			position : {
				x : 0,
				y : 0
			}
		},
		area : function () {
			return this.get("length") * this.get("width");
		},

		perimeter : function () {
			return 2 * this.get("length") + 2 * this.get("width");
		},

		isSquare : function () {
			return this.get("length") === this.get("width");
		}
	});

	shapes.RectangleView = Backbone.View.extend({

		tagName : 'div',

		className : 'rectangle',

		render : function () {
			this.setDimensions();	
			this.setPosition();
			this.setColor();
			return this;

		},

		events : {
			"click" : "move"
		},

		setDimensions : function () {
			this.$el.css({
				width: this.model.get('width') + 'px',
				height : this.model.get('height') + 'px'	
			});
		},

		setPosition : function () {
			var position = this.model.get('position');
			this.$el.css({
				left : position.x,
				top : position.y
			});
		},

		setColor : function (){
			this.$el.css('background-color', this.model.get('color'));
		},

		move : function (){
			this.$el.css('left', this.$el.position().left + 10);
		}
	});

	var models = [
		new shapes.Rectangle({
			width : 100,
			height : 60,
			position : {
				x : 300,
				y : 150
			},
			color : 'blue'
		}),
		new shapes.Rectangle({
			width : 100,
			height : 100,
			position : {
				x : 500,
				y : 75
			},
			color : 'red'
		}),
		new shapes.Rectangle({
			width : 150,
			height : 60,
			position : {
				x : 100,
				y : 500
			},
			color : 'yellow'
		}),
	];

	_(models).each(function (model){
		$("div#canvas").append(new shapes.RectangleView({ model : model }).render().el);	
	});

})(app);