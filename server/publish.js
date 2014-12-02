Meteor.publish('publicLists', function() {
	// console.log(Lists.find({},{ fields: {Privacy: false}}));
  return Lists.find({Privacy: false});
});

Meteor.publish('privateLists', function() {

  if (this.userId) {

	var user = Meteor.users.findOne(this.userId);
  if(user.emails != undefined){
    return Lists.find({access: {$exists: user.emails[0].address}});
    console.log("emails publish");
  }
  else if(user.profile){
    return Lists.find({access: {$exists: user.profile.name}});
    console.log("profile publish");

  }
    // return Lists.find({access: {$exists: user.emails[0].address}});
  } else {
    this.ready();
  }
});

Meteor.publish('todos', function(listId) {
  check(listId, String);
  return Todos.find({listId: listId});
});
