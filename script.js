const table = document.querySelector('table');        //Select table
let myLibrary = [];     //Array for save books

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
        let newBook = new Book(title.value,author.value,parseInt(read_pages.value),parseInt(total_pages.value),yes_button.checked);
        addBookToLibrary(newBook);  //Add the book to array
        console.log(myLibrary);
    }
}

function addBookToLibrary(book) {
    myLibrary.push(book);  //Add book to array
    InsertTable();         //Show the table 
    upSummary();           //Update summary
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
    let repeatedBook = myLibrary.some((element)=>{
        if( (title.value === element.title) && author.value === element.author) return true;
        else return false;
    });

    if(repeatedBook && myLibrary.length != 0) warnings[5].innerHTML = '*'+title.value + ' by ' + author.value + ' already in your library!';
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
    for(let i = 0; i< myLibrary.length; i++){
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
        cell1.innerHTML = myLibrary[i].title;
        cell2.innerHTML = myLibrary[i].author;
        cell3.innerHTML = "<input id=\"arrBtn"+i+"\" type=\"number\" min=\"0\" max=\""+parseInt(myLibrary[i].Npages)+"\" value=\""+parseInt(myLibrary[i].readPages)+"\" placeholder=\"0\" class=\"book_btn\">";
        cell4.innerHTML = parseInt(myLibrary[i].Npages);
        if (myLibrary[i].boolRead){
            cell5.innerHTML = "<div class='read'>Read</div>";
            myLibrary[i].readPages = parseInt(myLibrary[i].Npages);
            cell3.innerHTML = "<input id=\"arrBtn"+i+"\" type=\"number\" min=\"0\" max=\""+myLibrary[i].Npages+"\" value=\""+parseInt(myLibrary[i].readPages)+"\" placeholder=\"0\" class=\"book_btn\">";
        }
        else{ 
            myLibrary[i].readPages = parseInt(myLibrary[i].readPages);
            cell5.innerHTML = "<div class='not_read'>Not read</div>";
        }

        //Add onchange event to read pages buttons
        cell3.addEventListener('change',e=>{
            let Idx = cell6.parentElement.firstChild.textContent-1;
            var arrBtn = document.getElementById('arrBtn'+Idx);
            myLibrary[Idx].readPages = parseInt(arrBtn.value);
            upSummary();
        });

        //Add event to switch state (read or not):
        cell5.addEventListener('click',e=>{
            let Idx = cell6.parentElement.firstChild.textContent-1;
            myLibrary[Idx].boolRead = !myLibrary[Idx].boolRead;
            if (myLibrary[Idx].boolRead) myLibrary[Idx].readPages = myLibrary[Idx].Npages;
            else myLibrary[Idx].readPages = 0;
            InsertTable();
            upSummary();
        });

        cell6.innerHTML = '<div class="remove">&#x2715;</div>'; //Remove button
        //Add event to remove books:
        cell6.addEventListener('click',e=>{
            let delIdx = cell6.parentElement.firstChild.textContent-1;
            console.log(delIdx);
            myLibrary.splice(delIdx,1);
            InsertTable();      //Display table
            upSummary();        //Update summary
        });
        }
}

confirmBtn.addEventListener('click',AddBook);

var SummaryList = document.querySelectorAll('li'); //Select list to give summary 

function upSummary(){
    //Give total books:
    SummaryList[0].innerHTML = 'Total books: '+myLibrary.length;

    //Read books:
    let totalReadBooks = myLibrary.filter(item=>{
        return item.boolRead;
    }).length;
    SummaryList[1].innerHTML = 'Completed books: '+totalReadBooks;

    //Total pages:
    let totalPages = myLibrary.map(item=>item.Npages).reduce((prev,next)=>prev+next);
    SummaryList[2].innerHTML = 'Total pages: '+totalPages;

    //Total read pages:
    let totalReadPages = myLibrary.map(item=>item.readPages).reduce((prev,next)=>prev+next);
    SummaryList[3].innerHTML = 'Read pages: '+totalReadPages;

    //Total authors:
    const uniqueAuthors = [...new Set(myLibrary.map(item => item.author))].length;
    SummaryList[4].innerHTML = 'Total authors: '+uniqueAuthors;
}

function Book(title,author,readPages,Npages, boolRead){
    this.title = title;
    this.author = author;
    this.readPages = readPages;
    this.Npages = Npages;
    this.boolRead = boolRead;
}
//Info in the prototype function: 
Book.prototype.info = function(){
    if(this.boolRead===false) return (this.title + ' by ' + this.author + ', ' + this.Npages + ' pages,' + ' not read yet.');
    else return (this.title + ' by ' + this.author + ', ' + this.Npages + ' pages,' + ' already read.');
}

let exampleBook = new Book('Example book 1','Awesome author', 0, 100, true);
addBookToLibrary(exampleBook);


exampleBook = new Book('Example book 2','Awesome author', 0, 100, true);
addBookToLibrary(exampleBook);

exampleBook = new Book('Example book 3','Awesome author', 0, 100, false);
addBookToLibrary(exampleBook);

console.log(myLibrary);