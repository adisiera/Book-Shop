'use strict';
var gCurrBook;

function onInit() {
    console.log('welcome')
    _createBooks()
    renderBooks()
}

function renderBooks() {
    var books = getBooksForDisplay();
    console.log('books', books);
    var strHTMLs = books.map(function (book) {
        return renderBookRow(book);
    })
    var elBooksTable = document.querySelector('.books-table')
    elBooksTable.innerHTML = strHTMLs.join('');
}

function renderBookRow(book) {
    var strHTML = `<tr>
                    <td scope="row">${book.id}</td>
                    <td data-trans="table-${book.name}">${book.name}</td>
                    <td class="currency-side">${formatCurrency(book.price.toFixed(2))}</td>
                    <td>${book.rating}</td>
                    <td><img src="${book.imgUrl}"/></td>
                    <td><button data-trans="button-read" onclick="onReadBook('${book.id}')">Read</button> <button data-trans="button-update" onclick="onUpdateBook('${book.id}')">Update</button> <button data-trans="button-delete" onclick="onRemoveBook('${book.id}')">Delete</button></td>
                    </tr>`
    return strHTML;
}



function onSortTable(sortBy) {
    setSortBy(sortBy)
    renderBooks()
}

function onChangeRating(elBtn) {
    console.log('entered onChangeRating');
    var elBookRating = document.querySelector('.book-rating')
    if (elBtn.innerText === '+') {
        elBookRating.innerText = ++gCurrBook.rating
    }
    else if (elBtn.innerText === '-') {
        elBookRating.innerText = --gCurrBook.rating
    }
    console.log('gCurrBook.rating', gCurrBook.rating);
    getBooksToSave()
    renderBooks()
}

function onPaginating(diff) {
    paginating(diff);
    renderBooks();
}

function onCloseModal() {
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'none';
}

function onReadBook(bookId) {
    var book = getBookById(bookId)
    gCurrBook = book
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'block';
    elModal.querySelector('h5').innerText = book.author
    elModal.querySelector('h6').innerText = book.year
    elModal.querySelector('p').innerText = book.desc
    var elSpan = document.querySelector('.book-rating')
    elSpan.innerText = book.rating
}

function onUpdateBook(bookId) {
    var newBookPrice = +prompt('enter a new book price');
    updateBook(bookId, newBookPrice)
    renderBooks()
}

function onRemoveBook(bookId) {
    if (confirm(getTrans('sure'))) {
        removeBook(bookId)
        renderBooks()
    }
}

function onAddBook() {
    var elBookName = document.querySelector('input[name=bookName]');
    var elPrice = document.querySelector('input[name=price]');
    var elAuthor = document.querySelector('input[name=author]');
    var elYear = document.querySelector('input[name=year]');
    var elInputsModal = document.querySelector('.inputs-modal');

    var bookName = elBookName.value;
    var bookPrice = +elPrice.value;
    var bookAuthor = elAuthor.value;
    var bookYear = +elYear.value;

    if (!bookName || !bookPrice || !bookAuthor || !bookYear) return

    addBook(bookName, bookPrice, bookAuthor, bookYear);
    renderBooks();

    elBookName.value = '';
    elPrice.value = '';
    elAuthor.value = '';
    elYear.value = '';
    elInputsModal.style.display = 'none';

}

function onOpenAddBook() {
    var elInputsModal = document.querySelector('.inputs-modal');
    elInputsModal.style.display = (elInputsModal.style.display === 'block') ? 'none' : 'block';
}

function onSetLang(lang) {
    setLang(lang);
    if (lang === 'he') {
        document.body.classList.add('rtl');
        document.body.style.textAlign = 'right'
    }
    else {
        document.body.classList.remove('rtl');
        document.body.style.textAlign = 'left'
    }
    renderBooks();
    doTrans();
}