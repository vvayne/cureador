Meteor.publish('publicLists', function() {
	// console.log(Lists.find({Privacy: false}).fetch());
  return Lists.find({Privacy: false});
});

Meteor.publish('privateLists', function() {
  console.log("hiya we're looking for private things");
  // console.log(this);
  console.log("aayyyy" + this.userId);
  if (this.userId) {
    var user = Meteor.users.findOne(this.userId);
    console.log(user.services);
    console.log(user.services.google);

    Lists.find({access: {$exists: user.services.google.email}}); //PERHAPS BUGGY..........

  // }
    // return Lists.find({access: {$exists: user.emails[0].address}});
  } else {

    this.ready();
    console.log("hi we're ready");
  }
});



Meteor.publish('todos', function(listId) {
  check(listId, String);
  return Todos.find({listId: listId});
});

Meteor.publish("userData", function () {
  if(this.userId){
  return Meteor.users.find({_id: this.userId}, {fields: {'services': 1}})
}
  else {
    this.ready();
  }
});
