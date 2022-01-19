//Class version

class Library {
    constructor(){
        this.books = [];
        this.boolRepeated = false;
    }

    addBookToLibrary(book) {
        this.books.push(book);  //Add book to array
        InsertTable();         //Show the table 
        upSummary();           //Update summary
      }

    deleteBook(idx){
        this.books.splice(idx,1); //Remove the book # idx
    }
}

class Book {
    constructor(title,author,readPages,Npages, boolRead){
        this.title = title;
        this.author = author;
        this.readPages = readPages;
        this.Npages = Npages;
        this.boolRead = boolRead;
    }

    info(){
        if(this.boolRead===false) return (this.title + ' by ' + this.author + ', ' + this.Npages + ' pages,' + ' not read yet.');
        else return (this.title + ' by ' + this.author + ', ' + this.Npages + ' pages,' + ' already read.');
    }

    switchRead(){
        this.boolRead = !this.boolRead      //Swich the bool read state
        if (this.boolRead) this.readPages = this.Npages;    //If read is true, read pages = total pages
        else this.readPages = 0;                            //IF change from true to false, read pages = 0
    }    
}

let myLibrary = new Library();
const table = document.querySelector('table');        //Select table

//The modal
var modal = document.getElementById("myModal");                 // Get the modal
var addBtn = document.querySelector('#add_button');             // Get the button that opens the modal
var closeBtn = document.getElementsByClassName("close")[0];     // Get the <span> element that closes the modal
var confirmBtn = document.getElementsByClassName("confirm")[0]; // Get the <span> element that closes the modal

// When the user clicks the button, open the modal 
addBtn.onclick = function() {
    modal.style.display = "block";
  }

// When the user clicks on <span> (x), close the modal
closeBtn.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', (event)=>{
    if (event.target == modal) {
        modal.style.display = "none";
        }
});

//When the user press Esc key, close it
window.addEventListener('keydown', (event)=>{
    if (event.key === "Escape") {
        modal.style.display = "none";
        }
});
//End of modal

//Get the information of modal and add a book to array myLibrary:
function AddBook(){
    var title = document.querySelector('#title');
    var author = document.querySelector('#author');
    var read_pages = document.querySelector('#read_pages');
    var total_pages = document.querySelector('#total_pages');
    var yes_button = document.querySelector('#yes_button');
    var no_button = document.querySelector('#no_button');

    if (!Verify()){ //Verify all the form conditions
        return;
    }
    else{
        if(!isNaN(read_pages.value)) read_pages.value = 0;
        let newBook = new Book(title.value,author.value,parseInt(read_pages.value),parseInt(total_pages.value),yes_button.checked);
        myLibrary.addBookToLibrary(newBook);  //Add the book to array
    }
}

//Verify conditions: 
function Verify(){
    let warnings = document.getElementsByClassName("warning");
    if (title.value == "") warnings[0].innerHTML='*Required';  //Empty field
    else warnings[0].innerHTML = '';

    if (author.value == "") warnings[1].innerHTML='*Required'; //Empty field
    else warnings[1].innerHTML='';

    //Read pages>total pages
    if (parseInt(read_pages.value)>parseInt(total_pages.value)) warnings[2].innerHTML = '*Read pages can not be higher than total pages';
    else warnings[2].innerHTML = '';

    if (total_pages.value =="") warnings[3].innerHTML = '*Required'; //Empty field
    else warnings[3].innerHTML = '';

    if(!yes_button.checked && !no_button.checked) warnings[4].innerHTML = '*Required'; //No button checked
    else warnings[4].innerHTML = '';

    //Repeated books verification: 
    let repeatedBook = myLibrary.books.some((element)=>{
        if( (title.value === element.title) && author.value === element.author) return true;
        else return false;
    });

    if(repeatedBook && myLibrary.books.length != 0) warnings[5].innerHTML = '*'+title.value + ' by ' + author.value + ' already in your library!';
    else warnings[5].innerHTML = '';

    // If no elements wrong return true, else return false.
    return Array.from(warnings).every((element) => {
        if(element.innerHTML == '') return true;
        else return false;
    });
}

//Insert table
function InsertTable(){
    while (table.rows.length > 1) {
        table.deleteRow(1);
      }
    for(let i = 0; i< myLibrary.books.length; i++){
        let row = table.insertRow();
        row.className = 'book';
        let cell0 = row.insertCell(0);  //Number of book
        let cell1 = row.insertCell(1);  //Title
        let cell2 = row.insertCell(2);  //Author
        let cell3 = row.insertCell(3);  //Read pages
        let cell4 = row.insertCell(4);  //Total pages
        let cell5 = row.insertCell(5);  //Status
        let cell6 = row.insertCell(6);  //Delete button
        cell0.innerHTML = i+1;
        cell1.innerHTML = myLibrary.books[i].title;
        cell2.innerHTML = myLibrary.books[i].author;
        cell3.innerHTML = "<input id=\"arrBtn"+i+"\" type=\"number\" min=\"0\" max=\""+parseInt(myLibrary.books[i].Npages)+"\" value=\""+parseInt(myLibrary.books[i].readPages)+"\" placeholder=\"0\" class=\"book_btn\">";
        cell4.innerHTML = myLibrary.books[i].Npages;
        if (myLibrary.books[i].boolRead){
            cell5.innerHTML = "<div class='read'>Read</div>";
            myLibrary.books[i].readPages = myLibrary.books[i].Npages;
            cell3.innerHTML = "<input id=\"arrBtn"+i+"\" type=\"number\" min=\"0\" max=\""+myLibrary.books[i].Npages+"\" value=\""+parseInt(myLibrary.books[i].readPages)+"\" placeholder=\"0\" class=\"book_btn\">";
        }
        else{ 
            myLibrary.books[i].readPages = myLibrary.books[i].readPages;
            cell5.innerHTML = "<div class='not_read'>Not read</div>";
        }

        //Add onchange event to read pages buttons
        cell3.addEventListener('change',e=>{
            var arrBtn = document.getElementById('arrBtn'+i);
            myLibrary.books[i].readPages = parseInt(arrBtn.value);
            upSummary();
        });

        //Add event to switch state (read or not):
        cell5.addEventListener('click',e=>{
            myLibrary.books[i].switchRead();   //Change the state 
            InsertTable();
            upSummary();
        });

        cell6.innerHTML = '<div class="remove">&#x2715;</div>'; //Remove button
        //Add event to remove books:
        cell6.addEventListener('click',e=>{
            myLibrary.deleteBook(i);
            InsertTable();      //Display table
            upSummary();        //Update summary
        });
        }
}

confirmBtn.addEventListener('click',AddBook);

var SummaryList = document.querySelectorAll('li'); //Select list to give summary 

function upSummary(){
    //Give total books:
    SummaryList[0].innerHTML = 'Total books: '+myLibrary.books.length;

    //Read books:
    let totalReadBooks = myLibrary.books.filter(item=>{
        return item.boolRead;
    }).length;
    SummaryList[1].innerHTML = 'Completed books: '+totalReadBooks;

    //Total pages:
    let totalPages = myLibrary.books.map(item=>item.Npages).reduce((prev,next)=>prev+next);
    SummaryList[2].innerHTML = 'Total pages: '+totalPages;

    //Total read pages:
    let totalReadPages = myLibrary.books.map(item=>item.readPages).reduce((prev,next)=>prev+next);
    SummaryList[3].innerHTML = 'Read pages: '+totalReadPages;

    //Total authors:
    const uniqueAuthors = [...new Set(myLibrary.books.map(item => item.author))].length;
    SummaryList[4].innerHTML = 'Total authors: '+uniqueAuthors;
}

let exampleBook = new Book('Example book 1','Awesome author', 0, 100, true);
myLibrary.addBookToLibrary(exampleBook);


exampleBook = new Book('Example book 2','Awesome author', 0, 100, true);
myLibrary.addBookToLibrary(exampleBook);

exampleBook = new Book('Example book 3','Awesome author', 0, 100, false);
myLibrary.addBookToLibrary(exampleBook);

console.log(myLibrary.books);

//Info button: 
var InfoBtn = document.querySelector('#info_button');
const left = document.querySelector('.left');

InfoBtn.addEventListener('click', openMenu);
function openMenu(){
    if(left.style.display==="flex"){
        left.style.display = "none";
    }
    else{
        left.style.display = "flex";
    }    
}

//If max-width 550px show the Info by default. Else hide the info:
var mediaInfo = window.matchMedia("(min-width: 550px)");
mediaInfo.addListener(()=>{
    if (mediaInfo.matches) { // If media query matches: width greater than 550px
        left.style.display = "flex";
      } 
    else {                    // width less than 550px
        left.style.display = "none";
    }
})