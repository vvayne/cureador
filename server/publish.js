Meteor.publish('publicLists', function() {
	console.log("hi");
	// console.log(Lists.find({},{ fields: {Privacy: false}}));
  return Lists.find({Privacy: false});
});

Meteor.publish('privateLists', function() {
	console.log("Publishing private lists");
  if (this.userId) {
	console.log("We are in private lists");
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