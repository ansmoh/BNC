Template.App.helpers({
	hasAlert: function () {
		var res = Settings.findOne();
		if( res ){
			return res.active;
		}
	},
	alerttext: function () {
		var res = Settings.findOne();
		if( res ){
			return res.desc;
		}
	},
});