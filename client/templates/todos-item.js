
var EDITING_KEY = 'editing';
Session.setDefault(EDITING_KEY,null);

Template.modalForm.events({
// Why doesn't this thing work for this._id? Got the edit function to work.
  'click .save':function(evt,tmpl){
    // event.preventDefault(); not sure what this does.
    var thoughts = tmpl.find('.thoughts').value;
    var author = tmpl.find('.author').value;
    var title = tmpl.find('.title').value;
    var url= tmpl.find('.src').value;
    var listId = Router.current().params._id;
    var owner = Meteor.userId();
    var createdAt = new Date();

    if(Session.get(EDITING_KEY)){
      console.log("got to editing");
      console.log(Session.get(EDITING_KEY));
      Todos.update(Session.get(EDITING_KEY), {$set: {title:title,author:author,thoughts:thoughts,src:url}});
      Session.set(EDITING_KEY,null);
      Session.set('adding_interest',false);
     }
     else{
       console.log("this was inserted)");
       Todos.insert({title:title,author:author,thoughts:thoughts,src:url,height:1000,width:'25%',listId: listId, owner:owner, createdAt: createdAt});
       Lists.update(listId, {$inc: {incompleteCount: 1}});
       Session.set('adding_interest',false);
     }
  },

  'click .cancel':function(evt,tmpl){
    Session.set('adding_interest',false);
    Session.set(EDITING_KEY,null);
  },
  'click .close':function(evt,tmp){
    Session.set('adding_interest',false);
    Session.set(EDITING_KEY,null);
  }
});

Template.todo.events({

  'mousedown .js-delete-todo, click .js-delete-todo': function() {
    var discoverList = Lists.findOne(this.listId);
    if (discoverList.name === "Discover") {
      return alert("Sorry! Can't do that with Discover list items!");
    }
    Todos.remove(this._id);
    if (! this.checked)
      Lists.update(this.listId, {$inc: {incompleteCount: -1}});
  },

  'click .js-edit-todo' : function(){
    console.log("edit"); //Why does the this._id work here?
    var discoverList = Lists.findOne(this.listId);
      console.log("Meteor.userId:"+Meteor.userId());
      console.log("this.owner:"+this.owner);
    // if(Meteor.userId === this.owner)
    if (discoverList.name === "Discover") {
      return alert("Sorry! Can't do that with Discover list items!");
    }
    Session.set(EDITING_KEY, this._id);
    Session.set('adding_interest',true);
  }
});

Template.sharelist.events({
  'click .save':function(evt,tmpl){
    // event.preventDefault();
    var shareusername = tmpl.find('.shareusername').value;
    var listId = Router.current().params._id;
    var owner = Meteor.userId();
    var createdAt = new Date();
    var list = Lists.findOne(listId);
    // if(Session.get(spanItem) === "span5"){
    //   Session.set(spanItem,"span4");
    // }
    // else{
    //   Session.set(spanItem,"span5");
    // }
    // var actualUser = Meteor.users.findOne({ "emails.address":shareusername});
    // console.log("merp");
    // console.log(actualUser);
    // if (actualUser === undefined) {
    //   return alert("You must input an actual user!");
    // }
    if (Meteor.user().emails[0].address === list.owner) {
      if (shareusername !== list.owner) {
        var arr = list.access;
        var foundIt = false;
        if (arr !== null) {
          for (var i = 0; i < arr.length; i++) {
              if (arr[i] === shareusername) {
                console.log("trying to delete something");
                Lists.update({_id: listId},{$pull: {access: shareusername}});
                foundIt = true;
                // Router.go('home');
                // console.log("herpderpmerp");
                // var current = Router.current();
                // if (current.route.name === 'listsShow') {
                //   Router.go('listsShow', Lists.findOne({owner: Meteor.user.emails[0].address}));
                // }
              }
          }
          if (!foundIt) {
            Lists.update({_id: listId},{$push: {access: shareusername}});
          }
        }
      } else {
        return alert("You can't unshare the owner from their own list!");
      }
    }

    // console.log(ListAccess.find().fetch());
    // console.log("hi");
    Session.set('sharing_list',false);
  },
  'click .cancel':function(evt,tmpl){
    Session.set('sharing_list',false);
  },
  'click .close':function(evt,tmp){
    Session.set('sharing_list',false);
  }
});


Template.todo.helpers({

  notDiscover: function(){
    console.log(Lists.findOne(this.listId).name);
    if(Lists.findOne(this.listId).name === "Discover") return false;
    else{ return true;}
  },

  isOwnerOfList : function(){
    console.log("Meteor.userId:"+ Meteor.userId());
    console.log("this.owner:"+ this.owner);
    if(Meteor.userId() === this.owner){
      return true;
    }
    else{
      return false;
    }
  },

  editingClass: function(){
  return Session.equals(EDITING_KEY, this._id) && 'editing';
}

});

Template.modalForm.helpers({
  adding_interest : function() {
     console.log("does this happen");
     return Session.get('adding_interest');
 }
});

Template.sharelist.helpers({
  listOfAccessibleEmails: function() {
    var currList = "";
    console.log("Hi, sharing list");
    console.log(this);
    var arr = this.access;
    console.log(arr);
    if (arr !== null) {
      for (var i = 0; i < arr.length; i++) {
        currList += arr[i];
        currList += ", ";
      }
    }
    return currList;
  }
});
