//const { init } = require('browser-sync');

//application main object
const app = {

  //create filters array and assign it to local variable
  filters : [],

  
  calculateStyleValues : function(rating) {
    //calculate width percentage
    let percentage = rating * 10;

    //create local variable 'background'
    let background = '';

    //define background color 
    if(rating <= 6){
      background = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
    }
    else if (rating > 6 && rating <= 8) {
      background = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%);';
    }
    else if(rating > 8 && rating <=9) {
      background = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
    }
    else {
      background = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
    }

    //return array of values
    return ([percentage,background]);

  },
  

  //initialize bookshop menu
  initMenu : function() {
    //assign new name for app instance
    const thisApp = this; 
    
    //create empty array for book DOM elements
    thisApp.books = [];

    //obtain .books-list element
    let bookList = document.querySelector('.books-list');
    
    //empty booklist
    bookList.innerHTML = '';

    //search for book template in HTML
    const bookElement = document.querySelector('#template-book').innerHTML;
    
    //compile above template to acquire handlebars function
    const menuBook = Handlebars.compile(bookElement);

    //create empty bookData variable
    let bookData ='';

    //loop through all book data in dataSource.books Object
    for (let book in dataSource.books){

      //get book data
      bookData = dataSource.books[book];
      

      //get rating array based on calculateStyleValues function
      let ratingArr = thisApp.calculateStyleValues(bookData['rating']);

      //update book data with rating values
      bookData.calcWidth = ratingArr[0]
      bookData.calcBackground = ratingArr[1];


      //create DOM bookElement
      let bookElement = utils.createDOMFromHTML(menuBook(bookData));

      //-------additional adult and nonFiction data--------------
      bookElement.details = bookData.details;

      //append current book element to .books-list
      bookList.appendChild(bookElement); 

      //push book into books dom elements array
      thisApp.books.push(bookElement);
      
      //run through filters
      for(let filter in thisApp.filters){

        //assign currently checked filter to currentFilter variable
        let currentFilter = thisApp.filters[filter];
        
        // assign current image (from ext. for loop) to image variable
        let image = bookElement.querySelector('a.book__image');
        
        // remove or add .hidden class accordingly to filter status 
        bookElement.details[currentFilter]? 
          image.classList.add('hidden') :
          image.classList.remove('.hidden');

      }
    }
  },

  
  initBookActions : function() {
    //assign new name for instance variable
    const thisApp = this;

    //create favoritebooks array
    thisApp.favoriteBooks = [];

    //addEventListener to entire container
    document.querySelector('.books-panel').addEventListener('dblclick',function() {

      // deifne current target - to be placed in favorite books
      const target = event.target.parentElement.parentElement.parentElement;

      // define target image - it's classList to be updated
      const targetImage = target.querySelector('a.book__image');

      
      // console.log('targetImage:',targetImage);

      // check if target image is in favorite book array
      // if not: add favorite class, add to favorite array
      if (thisApp.favoriteBooks.indexOf(target) == -1) {
          
        // not in array, adding it then
        targetImage.classList.add('favorite');
        thisApp.favoriteBooks.push(target);
      }

      //if yes: remove favorite class, remove from favorite array
      else {
        
        //in array, removing it then
        targetImage.classList.remove('favorite');  
        thisApp.favoriteBooks.splice(thisApp.favoriteBooks.indexOf(target),1);
      }
    });
  },

  initFilterActions : function() {
    //assign new name for thisApp instance
    const thisApp = this;

    
    const filters = thisApp.filters;
    
    //acquire form wrapper from html
    thisApp.form = document.querySelector('.filters');

    //addEventListener to the form
    thisApp.form.addEventListener('click', function() {
      // console.log(event);
      // console.log(event.target.tagName);//INPUT
      // console.log(event.target.type);//checkbox
      // console.log(event.target.name);//filter
      // console.log(event.target.value); //nonFiction, Adults only
      // console.log(event.target.checked); //true, false

      //assign target.value to 'value' local variable 
      let value = event.target.value;  
      
      //check whether filter value is existent in filters array
      //if not push it ...
      if (filters.indexOf(event.target.value) == -1 ){
        // console.log('nonexistent, adding...')
        filters.push(value);
      }
      //... yes remove it
      else {
        // console.log('existent, removing...');
        filters.splice(filters.indexOf(value));
      }

      thisApp.initMenu();
    })
  },

  //declare main function 'init'
  init : function() {

    //declare new new for instance
    const thisApp = this;

    //log initializing data
    console.log('***App starting***');
    thisApp.initMenu();
    thisApp.initBookActions();
    thisApp.initFilterActions();
    

    console.log(thisApp.calculateStyleValues(5.0));
  }
};

app.init(); //initialize whole application


