var EDITING_KEY = 'editingList';

Session.setDefault(EDITING_KEY, false);

Session.setDefault('sharing_list',false);

// Session.setDefault('adding_interest',false);

// Template.main.adding_interest = function () {
//   return Session.get('adding_interest');
// }


Template.shareModal.helpers({

  sharing_list: function(){
  return Session.get('sharing_list');
  }

});

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

  adding_interest : function() {
    return Session.get('adding_interest');
   },

  editing: function() {
    return Session.get(EDITING_KEY);
  },

  todosReady: function() {
    return Router.current().todosHandle.ready();
  },

  todos: function() {
    console.log("we are in todos");
    console.log(Todos.find({listId: this._id}, {sort: {createdAt : -1}}));
    return Todos.find({listId: this._id}, {sort: {createdAt : -1}});
  },

  ownerLocalPart: function() {
    var email = this.owner;
    return email.substring(0, email.indexOf('@'));
  },
});

var editList = function(list, template) {
  Session.set(EDITING_KEY, true);

  // force the template to redraw based on the reactive change
  Tracker.flush();
  template.$('.js-edit-form input[type=text]').focus();
};

var saveList = function(list, template) {
  Session.set(EDITING_KEY, false);
  Lists.update(list._id, {$set: {name: template.$('[name=name]').val()}});
};

var deleteList = function(list) {
  // ensure the last public list cannot be deleted.
  if (! Meteor.user()) {
    return alert("Please sign in or create an account to delete lists.");
  }

  if (Meteor.user().emails[0].address != list.owner) {
    return alert("You must be the owner of this list to delete this list.");
  }

  if (! list.userId && Lists.find({userId: {$exists: false}}).count() === 1) {
    return alert("Sorry, you cannot delete the final public list!");
  }

  var message = "Are you sure you want to delete the list " + list.name + "?";
  if (confirm(message)) {
    // we must remove each item individually from the client
    Todos.find({listId: list._id}).forEach(function(todo) {
      Todos.remove(todo._id);
    });
    Lists.remove(list._id);

    Router.go('home');
    return true;
  } else {
    return false;
  }
};

var toggleListPrivacy = function(list) {
  if (! Meteor.user()) {
    return alert("Please sign in or create an account to make private lists.");
  }

  if (Meteor.user().emails[0].address != list.owner) {
    return alert("You must be the owner of this list to make it private.");
  }
  

  if (list.Privacy) {
    Lists.update(list._id, {$set: {Privacy: false}});
  } else {
    // ensure the last public list cannot be made private
    if (Lists.find({Privacy: false}).count() === 1) {
      return alert("Sorry, you can't make the final public list private!");
    }

    Lists.update(list._id, {$set: {Privacy: true}});
  }
};

Template.listsShow.events({

  'click .js-edit-list':function(event,tmpl){
    event.preventDefault();
    editList(this, template);
  },

  'click .js-share-list':function(event,tmpl){
    event.preventDefault();
    Session.set('sharing_list',true);
  },

  'click .addInterest':function(event,tmpl){
    console.log(this);

    if (! Meteor.user()) {
      return alert("Please sign in or create an account to add items to a list.");
    } else if (Meteor.user().emails[0].address != this.owner) {
      return alert("You must be the owner of this list to add items to the list.");
    } else if (Meteor.user().emails[0].address == this.owner) {
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
  'mousedown .js-cancel, click .js-cancel': function(event) {
    event.preventDefault();
    Session.set(EDITING_KEY, false);
  },

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

  'click .js-edit-list': function(event, template) {
    editList(this, template);
  },

  'click .js-toggle-list-privacy': function(event, template) {
    toggleListPrivacy(this, template);
  },

  'click .js-delete-list': function(event, template) {
    deleteList(this, template);
  }

  // 'click .js-todo-add': function(event, template) {
  //   template.$('.js-todo-new input').focus();
  // },
  //
  // 'submit .js-todo-new': function(event) {
  //   event.preventDefault();

    // var $input = $(event.target).find('[type=text]');
    // if (! $input.val())
    //   return;
    //
    // Todos.insert({
    //   listId: this._id,
    //   text: $input.val(),
    //   checked: false,
    //   createdAt: new Date()
    // });
  //   Lists.update(this._id, {$inc: {incompleteCount: 1}});
  //   $input.val('');
  // }
});
