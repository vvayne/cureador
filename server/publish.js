Meteor.publish('publicLists', function() {
	console.log("hi");
	console.log(Lists.find({},{ fields: {Privacy: false}}));
  return Lists.find({Privacy: false});
});

Meteor.publish('privateLists', function() {
  if (this.userId) {
	console.log("We are in private lists");
	console.log(Lists.find({access: {$exists: Meteor.user().emails[0].address}}));
    return Lists.find({access: {$exists: Meteor.user().emails[0].address}});
  } else {
    this.ready();
  }
});

Meteor.publish('todos', function(listId) {
  check(listId, String);
  
  return Todos.find({listId: listId});
});