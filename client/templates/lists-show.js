if(Meteor.user()) var CurrentUserEmail = Meteor.user().services.google.email;

var EDITING_KEY = 'editingList';
var editingItem = 'edtItm';

Session.setDefault(EDITING_KEY, false);

Session.setDefault('sharing_list',false);

var HIDE_MENU = 'hideMenu';
Session.setDefault(HIDE_MENU, false);

// Session.setDefault('adding_interest',false);

// Template.main.adding_interest = function () {
//   return Session.get('adding_interest');
// }


// Template.shareModal.helpers({
//
//   sharing_list: function(){
//   return Session.get('sharing_list');
//   }
//
// });

Template.listsShow.rendered = function() {
  this.find('.js-title-nav')._uihooks = {
    insertElement: function(node, next) {
      $(node)
        .hide()
        .insertBefore(next)
        .fadeIn();
    },
    removeElement: function(node) {
      $(node).fadeOut(function() {
        this.remove();
      });
    }
  };
};

Template.listsShow.helpers({

  isOwnerOfListCompareName : function(){

    if(CurrentUserEmail !== undefined && CurrentUserEmail === this.owner){ // is this necessary?
      return true;
    }
    else if (CurrentUserEmail === this.owner){
      return true;
    }
    else{
      return false;
    }
  },

  adding_interest : function() {
    return Session.get('adding_interest');
   },

   editingItem: function(){
     return Session.get(editingItem);
   },

  editing: function() {
    return Session.get(EDITING_KEY);
  },

  todosReady: function() {
    return Router.current().todosHandle.ready();
  },

  todos: function() {
    // console.log("we are in todos");
    // console.log(Todos.find({listId: this._id}, {sort: {createdAt : -1}}));
    return Todos.find({listId: this._id}, {sort: {createdAt : -1}});
  },

  // ownerLocalPart: function() { //May mess something up lols
  //   return this.ownerName;
  //   // if (this.owner !== null) {
  //   //   return email.substring(0, email.indexOf('@'));
  //   // } else {
  //   //   return null;
  //   // }

  // },

  isMenuHidden: function(){
    return Session.get(HIDE_MENU);
  },
});

var editList = function(list, template) {
  Session.set(EDITING_KEY, true);
  console.log("starts editing");
  // force the template to redraw based on the reactive change
  Tracker.flush();
  template.$('.js-edit-form input[type=text]').focus();
};

var saveList = function(list, template) {
  var newName = template.$('[name=name]').val();
  var discoverListId = Lists.findOne({name: "Discover"})._id;
  console.log("discoverListId:"+discoverListId);
  if (newName === "" || newName === "Discover") {
    Lists.update(list._id, {$set: {name: "Untitled"}});
  } else {
    Lists.update(list._id, {$set: {name: newName}});
  }


  // if (!list.Privacy) {
  //     var title = list.name;
  //     var url= "/lists/" + list._id; //does this work lol
  //        //hopefully this works........
  //     var sub = Meteor.subscribe('todos', Lists.findOne({name: "Discover"})._id);
  //     console.log("subscription:"+sub);
  //     console.log("url:" +url);
  //     console.log("title:" +title);
  //     console.log(Todos.find().fetch());
  //     var found = Todos.findOne({src:url})._id;
  //     console.log("found:"+found);
  //     Todos.update(found, {title: list.name});
  // }

  Session.set(EDITING_KEY, false);

};

var deleteList = function(list) {
  // ensure the last public list cannot be deleted.
  // if (! Meteor.user()) {
  //   return alert("Please sign in or create an account to delete lists.");
  // }
  //
  // if (Meteor.user().emails[0].address != list.owner) {
  //   return alert("You must be the owner of this list to delete this list.");
  // }
  //
  // if (! list.userId && Lists.find({userId: {$exists: false}}).count() === 1) {
  //   return alert("Sorry, you cannot delete the final public list!");
  // }
  console.log("Hi, we're deleting a list!!!!!!!!!");
  var message = "Are you sure you want to delete the list " + list.name + "?";
  if (confirm(message)) {
    // we must remove each item individually from the client
    Todos.find({listId: list._id}).forEach(function(todo) {
      Todos.remove(todo._id);
    });
    Lists.remove(list._id);

    var link = "/lists/" + list._id;
    Meteor.subscribe('todos', Lists.findOne({name: "Discover"})._id);
    var found = Todos.findOne({src:link});
    if (found) {
      Todos.remove(found._id);
      var discoverList = Lists.findOne({name: "Discover"})._id;
      Lists.update(discoverList, {$inc: {incompleteCount: -1}});
      Lists.update(list._id, {$set: {Privacy: true}});
    }


    Router.go('home');
    return true;
  } else {
    return false;
  }
};

var toggleListPrivacy = function(list) {
  // if (! Meteor.user()) {
  //   return alert("Please sign in or create an account to make private lists.");
  // }
  //
  // if (Meteor.user().emails[0].address != list.owner) {
  //   return alert("You must be the owner of this list to make it private.");
  // }


  if (list.Privacy) {
    Lists.update(list._id, {$set: {Privacy: false}});
    var author = list.ownerName;

    var thoughts = "";
    var title = list.name;
    var url= "/lists/" + list._id; //does this work lol
    var listId = Lists.findOne({name: "Discover"})._id; //hopefully this works........
    var owner = Meteor.userId();
    var createdAt = list.createdAt;
     Todos.insert({title:title,author:author,thoughts:thoughts,src:url,height:1000,width:'25%',listId: listId, owner:owner, createdAt: createdAt});
     Lists.update(listId, {$inc: {incompleteCount: 1}});
     console.log("testing");
     console.log(url);

  } else {
    // ensure the last public list cannot be made private
    // if (Lists.find({Privacy: false}).count() === 1) {
    //   return alert("Sorry, you can't make the final public list private!");
    // }
    var link = "/lists/" + list._id;
    Meteor.subscribe('todos', Lists.findOne({name: "Discover"})._id);
    var found = Todos.findOne({src:link});
    Todos.remove(found._id);
    var discoverList = Lists.findOne({name: "Discover"})._id;
    Lists.update(discoverList, {$inc: {incompleteCount: -1}});
    Lists.update(list._id, {$set: {Privacy: true}});
  }
};

Template.listsShow.events({

  'click span.icon-edited':function(event,tmpl){
    // if (! Meteor.user()) {
    //   return alert("Please sign in or create an account to change list titles.");
    // } else if (Meteor.user().emails[0].address !== this.owner) {
    //   return alert("You must be the owner of this list to change the title of this list.");
    // } else if (Meteor.user().emails[0].address === this.owner) {
    //   console.log("Hi, you're the owner!");
      event.preventDefault();
      editList(this, tmpl);
      console.log("Done with Editing Title");

  },

  'click .js-share-list':function(event,tmpl){
    var listId = Router.current().params._id;
    var list = Lists.findOne(listId);
    event.preventDefault();
    if (CurrentUserEmail !== list.owner){
      return alert("You have to be the owner to share this list!");
    } else {
      Session.set('sharing_list',true);
    }
  },

  'click .addInterest':function(event,tmpl){
    console.log(this);

    if (! Meteor.user()) {
      return alert("Please sign in or create an account to add items to a list.");
    } else if (CurrentUserEmail !== this.owner) {
      return alert("You must be the owner of this list to add items to the list.");
    } else if (CurrentUserEmail === this.owner) {
      console.log("Adding a list item");
      event.preventDefault();
      Session.set('adding_interest',true);
      console.log(Session.get('adding_interest'));
    }
  },

  'click .js-cancel': function() {
    Session.set(EDITING_KEY, false);
  },

  'keydown input[type=text]': function(event) {
    // ESC
    if (27 === event.which) {
      event.preventDefault();
      $(event.target).blur();
    }
  },

  'blur input[type=text]': function(event, template) {
    // if we are still editing (we haven't just clicked the cancel button)
    if (Session.get(EDITING_KEY))
      saveList(this, template);
  },

  'submit .js-edit-form': function(event, template) {
    event.preventDefault();
    saveList(this, template);
  },

  // handle mousedown otherwise the blur handler above will swallow the click
  // on iOS, we still require the click event so handle both
  // 'mousedown .js-cancel, click .js-cancel': function(event) {
  //   event.preventDefault();
  //   Session.set(EDITING_KEY, false);
  // },

  'change .list-edit': function(event, template) {
    if ($(event.target).val() === 'edit') {
      editList(this, template);
    } else if ($(event.target).val() === 'delete') {
      deleteList(this, template);
    } else {
      toggleListPrivacy(this, template);
    }

    event.target.selectedIndex = 0;
  },

  // 'click .js-edit-list': function(event, template) {
  //   editList(this, template);
  // },

  'click .js-toggle-list-privacy': function(event, template) {
    toggleListPrivacy(this, template);
  },

  'click .js-delete-list': function(event, template) {
    deleteList(this, template);
  },


  'click .hideMenu': function(){
    console.log("Clicked Left Arrow");
    $("#content-container").css("left","0px");
    Session.set(HIDE_MENU,true);
  // if(Session.get(HIDE_MENU)){
  //   $("#content-container").css("left","300px");
  // }
  // else{
  //   $("#content-container").css("left","0px");
  // }
  },

  'click .expandMenu' : function(){
    console.log("Clicked Right Arrow");
    $("#content-container").css("left","300px");
    Session.set(HIDE_MENU,false);
  },

});
