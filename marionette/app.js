window.App = new Backbone.Marionette.Application();

App.addRegions({
	mainRegion : "#content"
})

App.addInitializer(function(opts){
	var catsView = new App.CatsView({
		collection : opts.cats
	});
	App.mainRegion.show(catsView);
});

App.Cat = Backbone.Model.extend({
	defaults : {
		votes : 0
	},

	rankUp : function(){
		this.set('rank', this.get('rank') - 1);
	},

	rankDown : function(){
		this.set('rank', this.get('rank') + 1);
	},

	addVote : function(){
		this.set('votes', this.get('votes') + 1);
	}
});

App.Cats = Backbone.Collection.extend({
	model : App.Cat,

	initialize : function(cats){
		var rank = 1;
		_.each(cats, function(cat){
			cat.set('rank', rank++);
		});
		var self = this;

		App.vent.on('rank:up', function(cat){
			if (cat.get('rank') === 1) {
				return true;
			}
			self.rankUp(cat);
			self.sort();
		});

		App.vent.on('rank:down', function(cat){
			if (cat.get('rank') === self.size()) {
				return true;
			}
			self.rankDown(cat);
			self.sort();
		});

		App.vent.on('cat:disqualify', function(cat){
			var disqualifiedRank = cat.get('rank');
			var catsToUpRank = self.filter(function(cat){
				return cat.get('rank') > disqualifiedRank;
			});
			catsToUpRank.forEach(function(cat){
				cat.rankUp();
			});
			self.trigger('reset');
		});
	},

	comparator : function(cat) {
		return cat.get('rank');
	},

	rankUp : function(cat){
		var rankToSwap = cat.get('rank') - 1,
			otherCat = this.at(rankToSwap - 1);
		cat.rankUp();
		otherCat.rankDown();
	},

	rankDown : function(cat){
		var rankToSwap = cat.get('rank') + 1,
			otherCat = this.at(rankToSwap - 1);
		cat.rankDown();
		otherCat.rankUp();
	}	
});

App.CatView = Backbone.Marionette.ItemView.extend({
	template : "#cat-template",
	tagName : "tr",
	className : "cat",
	
	initialize : function (){
		this.model.on("change:votes", this.render, this);
	},

	events : {
		"click .rank_up" : "rankUp",
		"click .rank_down" : "rankDown",
		"click .disqualify" : "disqualify"
	},

	rankUp : function(){
		App.vent.trigger('rank:up', this.model);
		this.model.addVote();
		console.log(JSON.stringify(this.model.toJSON()));
	},
	rankDown : function(){
		App.vent.trigger('rank:down', this.model);
		this.model.addVote();
		console.log(JSON.stringify(this.model.toJSON()));
	},
	disqualify : function(){
		App.vent.trigger('cat:disqualify', this.model);
		this.model.destroy();
	},
	onClose : function () {
		this.model.off("change:votes");
	}
});

App.CatsView = Backbone.Marionette.CompositeView.extend({
	tagName : "table",
	id : "cats",
	template : "#cats-template",
	itemView : App.CatView,
	className: "table-striped table-bordered",

	appendHtml : function(collectionView, itemView) {
		collectionView.$("tbody").append(itemView.el);
	}
});

$(function(){
	var cats = new App.Cats([
		new App.Cat({ name: 'Wet Cat' }),
		new App.Cat({ name: 'Bitey Cat' }),
		new App.Cat({ name: 'Surprised Cat' })
	]);

	App.start({cats: cats});

	cats.add(new App.Cat({name : "Freaky Cat" , rank : cats.size() + 1}));
});