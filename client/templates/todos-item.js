
var EDITING_KEY = 'editing';
var editingItem = 'edtItm';

Session.setDefault(EDITING_KEY,null);
Session.setDefault(editingItem,false);

Template.todo.rendered = function(){

  setTimeout(function(){
    masonize(function(){

    })
  },1000);
}

// function insertElement (node, next) {
//   $(node)
//     .hide()
//     .insertBefore(next)
//     .fadeIn();
// }
//
// function removeElement (node) {
//   $(node).fadeOut(function() {
//     this.remove();
//   });
// }

function masonize(callback){
  var container = $('#mainContent');
  container.masonry({
    itemSelector: '.item',
    transitionDuration:'0.6s',
    // gutter:10,
    // "isFitWidth": true,
    // "columnWidth": 500,
  })

  var msnry = container.data('masonry');
  console.log(msnry);
  if(callback){callback()};
}

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

       Todos.insert({title:title,author:author,thoughts:thoughts,src:url,height:1000,width:'25%',listId: listId, owner:owner, createdAt: createdAt});
       Lists.update(listId, {$inc: {incompleteCount: 1}});
       $('.thoughts' ).val("");
       $('.author').val("");
       $('.title').val("");
       $('.src').val("");

    // $('#mainContent').masonry( 'addItems', tmpl )
    $("#mainContent").masonry('reloadItems');
      //  Session.set('adding_interest',false);

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

Template.editForm.events({
// Why doesn't this thing work for this._id? Got the edit function to work.
  'click .save':function(evt,tmpl){
    // event.preventDefault(); not sure what this does.
    var thoughts = tmpl.find('.thoughts').value;
    var author = tmpl.find('.author').value;
    var title = tmpl.find('.title').value;
    var url= tmpl.find('.src').value;
    var listId = Router.current().params._id;

      console.log("got to editing");
      console.log(Session.get(EDITING_KEY));
      Todos.update(Session.get(EDITING_KEY), {$set: {title:title,author:author,thoughts:thoughts,src:url}});
      Session.set(EDITING_KEY,null);
      Session.set(editingItem,false);
      console.log("EXITING editForm");
      $("#mainContent").masonry('reloadItems');


  },

  'click .cancel':function(evt,tmpl){
    Session.set(editingItem,false);
    Session.set(EDITING_KEY,null);
  },
  'click .close':function(evt,tmpl){
    Session.set(editingItem,false);
    Session.set(EDITING_KEY,null);
  }
});

Template.editForm.helpers({

  title : function(){
    var thisId = Session.get(EDITING_KEY);
    //console.log("thisId"+thisId); Why does this keep going even though not editing form? nov 8
    if(thisId) var editTitle = Todos.findOne(thisId).title;
    return editTitle;
  },

  thoughts: function(){
    var thisId = Session.get(EDITING_KEY);
    if(thisId) return Todos.findOne(thisId).thoughts;
  },

  src: function(){
    var thisId = Session.get(EDITING_KEY);
    if(thisId) return Todos.findOne(thisId).src;
  },

  author: function(){
    var thisId = Session.get(EDITING_KEY);
    if(thisId) return Todos.findOne(thisId).author;
  },


})

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
    Session.set(EDITING_KEY, this._id);

    //  author = Todos.findOne(this._id).author;
    //  thoughts = Todos.findOne(this._id).thoughts;
    //  url = Todos.findOne(this._id).src;
    Session.set(editingItem,true);
  },

});


Template.shareModal.events({
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
    if (CurrentUserEmail === list.owner) {
      if (shareusername !== list.owner) {
        var arr = list.access;
        var foundIt = false;
        if (arr !== null) {
          for (var i = 0; i < arr.length; i++) {
              if (arr[i] === shareusername) {
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

  hasUrl :function(){
    if(Todos.findOne(this._id).src === "") return false;
    else{
      return true;
    }
  },

  notDiscover: function(){
    if(Lists.findOne(this.listId).name === "Discover") return false;
    else{ return true;}
  },

  isOwnerOfList : function(){

    if(Meteor.user().profile.email === this.owner){
      return true;
    }
    else{
      return false;
    }
  },

  editingClass: function(){
  return Session.equals(EDITING_KEY, this._id) && 'editing';
},

domain: function() {
  var a = document.createElement('a');
  a.href = this.src;
  return a.hostname;
},

});

Template.modalForm.helpers({
  adding_interest : function() {
     return Session.get('adding_interest');
 }
});

Template.shareModal.helpers({
  listOfAccessibleEmails: function() {
    var currList = "";

    var arr = this.access;

    if (arr !== null) {
      for (var i = 0; i < arr.length; i++) {
        currList += arr[i];
        currList += ", ";
      }
    }
    return currList;
  }
});
