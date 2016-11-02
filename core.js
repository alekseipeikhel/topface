
/*
data-structure

state : {
  notes: [{
    text: '',
    tag: []
  }]
}
*/




// Initialize variables in DOM
var switcher = document.getElementById('switcher')

var mainContent = document.getElementById('mainContent')
var onLoadContent = document.getElementById('onLoadContent')

var noteUL = document.getElementById('noteUL')
var tagUL = document.getElementById('tagUL')
var filterNoteUL = document.getElementById('filterNote')


var countNotes = document.getElementById('countNotes')

var btnIWH = document.getElementById('btnIWH')
var btnFT = document.getElementById('btnFT')


var noteField = document.getElementById('noteField')
var searchField = document.getElementById('searchField')
var searchBlock = document.getElementById('searchBlock')

var tagsInNote = []

var allTags = []
var notesList= []

var currentNoteId
var state

// Ask about state
var aboutState = function(event){

  if(event.target === btnFT) {

    let state = {notes: [] }

    localStorage.clear()
    localStorage.setItem('state', JSON.stringify(state))

    mainContent.className = 'main-content'
    onLoadContent.className= 'display'


    return;

  } else if (event.target === btnIWH) {

    mainContent.className = 'main-content'
    onLoadContent.className= 'display'
    parseDataFromLocalStorage()
    createNotesList(notesList)
    createTagsList(allTags)
    return;
  }

}

// Default value for switcher
var flagOn = 1

// Switcher
var options = function() {

  if (!flagOn) {
    searchBlock.className = 'display-none'

    flagOn = 1

  } else if (flagOn) {

    searchBlock.className = 'search-block'

    flagOn = 0
  }
}

// Add event listener on switcher
switcher.addEventListener('click', options)


// save data to localStorage
var saveDataToLocalStorage = function(note) {

  state = JSON.parse(localStorage.getItem('state'))
  state.notes.push(note)
  localStorage.setItem('state', JSON.stringify(state))
}

//parse data from localStorage
var parseDataFromLocalStorage = function() {
  state = JSON.parse(localStorage.getItem('state'))
  notesList = state.notes

  notesList.map ( function(item){
    item['tags'].map( function(tag){
      if(allTags.indexOf(tag) < 0){
        allTags.push(tag)
      }
    })
  })
}

//updata data inlocalStorage
var updateDataInLocalStorage = function() {
  state = JSON.parse(localStorage.getItem('state'))

  state.notes = notesList
  localStorage.setItem('state', JSON.stringify(state))

}

//create list of notes
var createNotesList = function(data) {

  if(data.length > 0 ){

    countNotes.innerHTML = 'Your notes: ' + data.length
    noteUL.innerHTML = ''

    data.map( function(note, index){

      var li = document.createElement('li')
      var div = document.createElement('div')
      var p = document.createElement('p')

      p.className = 'note label-note'
      p.innerHTML =  note['text']
      p.setAttribute('onclick', 'editNote(event)')
      p.setAttribute('id', index+1)

      div.className = 'item'
      div.innerHTML = '<span id="' + (index+1) + '" onclick="deleteNote(event)" class="close">x</span>'
      div.appendChild(p)


      li.appendChild(div)
      noteUL.appendChild(li)
    })
  } else {

    countNotes.innerHTML = "You have no notes"
    noteUL.innerHTML = ''
  }
}

//create list of tags
var createTagsList = function(data) {
  if(data.length > 0){
    filterNoteUL.innerHTML = ''
    data.map( function(tag){
      var li = document.createElement('li')
      li.className = 'label-note'
      li.innerHTML = tag
      filterNote.appendChild(li)
    })
  } else {
    filterNoteUL.innerHTML = ''
    allTags = []
  }
}

//
var setTagsUnderNote = function(data) {
tagUL.innerHTML = ''

  data.map( function(tag) {
    var li = document.createElement('li')
    li.className = 'tag'
  //for tags button  li.innerHTML = '<button onclick="tagColor(event)" class="btn">' + tag + '</button>'
  li.innerHTML = tag
    tagUL.appendChild(li)
  })

}

//delete notes
var deleteNote = function(event) {

  noteField.innerHTML = ''
  allTags = []

  var noteId = event.target.getAttribute('id') -1

  if(notesList.length >= 1){

    notesList.splice(noteId, 1)


  } else {

    notesList = []
    allTags = []
    tagsInNote = []

  }

  updateDataInLocalStorage()
  parseDataFromLocalStorage()
  createNotesList(notesList)
  createTagsList(allTags)
  setTagsUnderNote(tagsInNote)
}

//edit note
var editNote = function(event) {

  noteField.innerHTML = event.target.innerText
  currentNoteId = event.target.getAttribute('id')

  tagsInNote = notesList[currentNoteId - 1]['tags']

  setTagsUnderNote(tagsInNote)

  tagsInNote = []
}


// save note when user click on save button
var handlerSave = function() {

  if( noteField.innerText != '') {
    if (!currentNoteId) {

      var text = noteField.innerText
      var tags = tagsInNote

      var note = {'tags': tags, 'text': text}

      saveDataToLocalStorage(note)



    } else if (currentNoteId) {

      var text = noteField.innerText
      var tags = tagsInNote

      var note = {'tags': tags, 'text': text}

      currentNoteId -=1
      notesList[currentNoteId] = note

      updateDataInLocalStorage()

      currentNoteId = 0
    }
  }

    parseDataFromLocalStorage()
    createNotesList(notesList)
    createTagsList(allTags)

    tagsInNote = []
    setTagsUnderNote(tagsInNote)
    noteField.innerText = ''
}


// search note by tag filter
var filterByTag = function() {
  var sortNoteByResult = []
  var currentNotesList = notesList

  filterNoteUL.innerHTML = ''

  if(searchField.value){
    var inputTag = new RegExp(searchField.value, 'i')
    allTags.map( function( tag ) {

      if(tag.search(inputTag) != -1) {

        notesList.map( function (note){

          if(note['tags'].indexOf(tag) != -1){
            console.log(note['tags']);
          sortNoteByResult.push({'tags': note['tags'], 'text': note['text']})
          }
        })
        var li = document.createElement('li')

        li.className = 'label-note'
        li.innerHTML = tag
        filterNote.appendChild(li)

      }
    })
    console.log(sortNoteByResult.length);
    createNotesList(sortNoteByResult)

  } else if (!searchField.value) {
    console.log('khoi');
    createNotesList(currentNotesList)
  }
}


//parse tags from input
var parseTag = function(text) {
  console.log(text);
  var re  = new RegExp(/#\w+\s$/gi)
  var tag = text.match(re)
  if (tag){
    if(tagsInNote.indexOf(tag[0]) < 0){
      tagsInNote.push(tag[0])

    }
  }
  setTagsUnderNote(tagsInNote)
  createTagsList(tagsInNote)

}
/* not work. ahould replace
var tagColor = function(event) {
  var tag = event.target.innerText
  var text = noteField.innerText
  console.log(tag);
  var re = new RegExp(tag, 'g')

  var newtext = text.replace(re, '123')
  console.log(newtext);
}

*/
