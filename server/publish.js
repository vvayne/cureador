Meteor.publish('publicLists', function() {
	// console.log(Lists.find({},{ fields: {Privacy: false}}));
  return Lists.find({Privacy: false});
});

Meteor.publish('privateLists', function() {
  console.log("hiya we're looking for private things");
  // console.log(this);
  console.log("aayyyy" + this.userId);
   if (this.userId) {
    var user = Meteor.users.findOne(this.userId);
    Lists.find({access: {$exists: user.profile.email}}); //PERHAPS BUGGY..........
    console.log("profile publish");

  // }
    // return Lists.find({access: {$exists: user.emails[0].address}});
  } else {
    this.ready();
  }
});

Meteor.publish('todos', function(listId) {
  check(listId, String);
  return Todos.find({listId: listId});
});
