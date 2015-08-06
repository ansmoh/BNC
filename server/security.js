

User.allow({
  update: function(userId, doc, fields, modifier) {
    return doc.userId === userId && _.without(fields, 'notifUpdate', 'notifPromotion').length === 0;
  }
});

/*User.deny({
	insert: function (userId, doc) {
		return true;
	},
	update: function (userId, doc, fields, modifier) {
		return true;
	},
	remove: function (userId, doc) {
		return true;
	}
});*/