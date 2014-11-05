var EDITING_KEY = 'EDITING_ID';


Template.form.events({
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
    if(Session.get(EDITING_KEY) !== null){
      console.log("got to editing");
      console.log(Session.get(EDITING_KEY));
      Todos.update(Session.get(EDITING_KEY), {$set: {title:title,author:author,thoughts:thoughts,src:url}});
      Session.set(EDITING_KEY,null);
      Session.set('adding_interest',false);
     }
     else{
       Todos.insert({title:title,author:author,thoughts:thoughts,src:url,height:1000,width:'25%',listId: listId, owner:owner, createdAt: createdAt,});
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
    Todos.remove(this._id);
    if (! this.checked)
      Lists.update(this.listId, {$inc: {incompleteCount: -1}});
  },

  'click .js-edit-todo' : function(){
    console.log("edit"); //Why does the this._id work here?
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
    Lists.update(listId,{$push: {access: shareusername}});
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

  editingClass: function(){
  return Session.equals(EDITING_KEY, this._id) && 'editing';
}

});

Template.form.helpers({
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







