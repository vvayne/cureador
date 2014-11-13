Meteor.publish('publicLists', function() {
	// console.log(Lists.find({},{ fields: {Privacy: false}}));
  return Lists.find({Privacy: false});
});

Meteor.publish('privateLists', function() {

  if (this.userId) {
	
	var user = Meteor.users.findOne(this.userId);
    return Lists.find({access: {$exists: user.emails[0].address}});
  } else {
    this.ready();
  }
});

Meteor.publish('todos', function(listId) {
  check(listId, String);
  return Todos.find({listId: listId});
});
