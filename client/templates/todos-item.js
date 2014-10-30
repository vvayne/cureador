var EDITING_KEY = 'EDITING_ID';

Template.todo.events({
// Why doesn't this thing work for this._id? Got the edit function to work.
  'click .save':function(evt,tmpl){
    // event.preventDefault(); not sure what this does.
    var thoughts = tmpl.find('.thoughts').value;
    var name = tmpl.find('.name').value;
    var url= tmpl.find('.src').value;
    var listId = Router.current().params._id;
     if(Session.get(EDITING_KEY) != null){
      console.log("got to editing");
      console.log(Session.get(EDITING_KEY));
      Todos.update(Session.get(EDITING_KEY), {$set: {name:name,thoughts:thoughts,src:url}});
      Session.set(EDITING_KEY,null);
      Session.set('adding_interest',false);
     }
     else{
       Todos.insert({name:name,thoughts:thoughts,src:url,height:1000,width:'25%',listId: listId,});
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
  },

  'mousedown .js-delete-todo, click .js-delete-todo': function() {
    Todos.remove(this._id);
    if (! this.checked)
      Lists.update(this.listId, {$inc: {incompleteCount: -1}});
  },

  'click .js-edit-todo' : function(){ //Why does the this._id work here?
    Session.set(EDITING_KEY, this._id);
    Session.set('adding_interest',true);
  }
});
  // 'change [type=checkbox]': function(event) {
  //   var checked = $(event.target).is(':checked');
  //   Todos.update(this._id, {$set: {checked: checked}});
  //   Lists.update(this.listId, {$inc: {incompleteCount: checked ? -1 : 1}});
  // },

  // 'focus input[type=text]': function(event) {
  //   Session.set(EDITING_KEY, this._id);
  // },
  //
  // 'blur input[type=text]': function(event) {
  //   if (Session.equals(EDITING_KEY, this._id))
  //     Session.set(EDITING_KEY, null);
  // },
  //
  // 'keydown input[type=text]': function(event) {
  //   // ESC or ENTER
  //   if (event.which === 27 || event.which === 13) {
  //     event.preventDefault();
  //     event.target.blur();
  //   }
  // },
  //
  // // update the text of the todo on keypress but throttle the event to ensure
  // // we don't flood the server with updates (handles the event at most once
  // // every 300ms)
  // 'keyup input[type=text]': _.throttle(function(event) {
  //   Todos.update(this._id, {$set: {text: event.target.value}});
  // }, 300),

  // handle mousedown otherwise the blur handler above will swallow the click
  // on iOS, we still require the click event so handle both
// Template.todo.events({
//   'mousedown .js-delete-todo, click .js-delete-todo': function() {
//     Todos.remove(this._id);
//     if (! this.checked)
//       Lists.update(this.listId, {$inc: {incompleteCount: -1}});
//   },
//
//   'click .js-edit-todo' : function(){
//     Session.set(EDITING_KEY, this._id);
//     Session.set('adding_interest',true);
//   }
// });

Template.todo.helpers({
  adding_interest : function() {
  return Session.get('adding_interest');
},
  editingClass: function(){
  return Session.equals(EDITING_KEY, this._id) && 'editing';
}
});
