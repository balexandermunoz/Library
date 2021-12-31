const table = document.querySelector('table');        //Select table
let myLibrary = [];

//The modal
var modal = document.getElementById("myModal");         // Get the modal
var addBtn = document.querySelector('#add_button');   // Get the button that opens the modal
var closeBtn = document.getElementsByClassName("close")[0]; // Get the <span> element that closes the modal
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

//Insert a row (book) in the table:
function AddBook(){
    var title = document.querySelector('#title');
    var author = document.querySelector('#author');
    var read_pages = document.querySelector('#read_pages');
    var total_pages = document.querySelector('#total_pages');
    var yes_button = document.querySelector('#yes_button');
    var no_button = document.querySelector('#no_button');

    if (!Verify()){ 
        return;
    }
    else{
        let newBook = new Book(title.value,author.value,read_pages.value,total_pages.value,yes_button.checked);
        addBookToLibrary(newBook);
        //InsertOneRow();
        //InsertTable();
        console.log(myLibrary);
    }
}

//Verify conditions: 
function Verify(){
    let warnings = document.getElementsByClassName("warning");
    if (title.value == "") warnings[0].innerHTML='*Required';
    else warnings[0].innerHTML = '';

    if (author.value == "") warnings[1].innerHTML='*Required';
    else warnings[1].innerHTML='';

    if (read_pages.value>total_pages.value) warnings[2].innerHTML = '*Read pages can not be higher than total pages';
    else warnings[2].innerHTML = '';

    if (total_pages.value =="") warnings[3].innerHTML = '*Required';
    else warnings[3].innerHTML = '';

    if(!yes_button.checked && !no_button.checked) warnings[4].innerHTML = '*Required';
    else warnings[4].innerHTML = '';

    //Repeated books verification: 
    let repeatedBook = myLibrary.some((element)=>{
        if( (title.value === element.title) && author.value === element.author) return true;
        else return false;
    });

    if(repeatedBook && myLibrary.length != 0) warnings[5].innerHTML = '*'+title.value + ' by ' + author.value + ' already in your library!';
    else warnings[5].innerHTML = '';

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
        cell3.innerHTML = "<input type=\"number\" min=\"0\" max=\"10000\" value=\""+myLibrary[i].readPages+"\" placeholder=\"0\" class=\"book_btn\">";
        cell4.innerHTML = myLibrary[i].Npages;
        if (myLibrary[i].boolRead){
            cell5.innerHTML = "<div class='read'>Read</div>";
            cell3.innerHTML = "<input type=\"number\" min=\"0\" max=\"10000\" value=\""+myLibrary[i].Npages+"\" placeholder=\"0\" class=\"book_btn\">";
        }
        else{ 
            cell5.innerHTML = "<div class='not_read'>Not read</div>";
        }

        cell5.addEventListener('click',e=>{
            let Idx = cell6.parentElement.firstChild.textContent-1;
            myLibrary[Idx].boolRead = !myLibrary[Idx].boolRead;
            if (myLibrary[Idx].boolRead) myLibrary[Idx].readPages = myLibrary[Idx].Npages;
            else myLibrary[Idx].readPages = read_pages.value;
            InsertTable();
        });

        cell6.innerHTML = '<div class="remove">&#x2715;</div>';
        cell6.addEventListener('click',e=>{
            let delIdx = cell6.parentElement.firstChild.textContent-1;
            console.log(delIdx);
            myLibrary.splice(delIdx,1);
            InsertTable();
        });
        }
}

confirmBtn.addEventListener('click',AddBook);

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

function addBookToLibrary(book) {
    myLibrary.push(book);
    InsertTable();
  }

let exampleBook = new Book('Example book 1','Awesome author', 0, 100, true);
addBookToLibrary(exampleBook);


exampleBook = new Book('Example book 2','Awesome author', 0, 100, true);
addBookToLibrary(exampleBook);

exampleBook = new Book('Example book 3','Awesome author', 0, 100, false);
addBookToLibrary(exampleBook);