'use strict';
const KEY = 'books';
const PAGE_SIZE = 5;
var gBooks;
var gSortBy = 'name';
var gPageIdx = 0;
var gTrans = {
    title: {
        en: 'Welcome to my book shop',
        he: 'ֿברוכים הבאים לחנות הספרים שלי'
    },
    'create-new': {
        en: 'Create a new book',
        he: 'הוסיפו ספר חדש לרשימה'
    },
    'placeholder-title': {
        en: 'Title...',
        he: 'כותרת...'
    },
    'placeholder-price': {
        en: 'Price...',
        he: 'מחיר...'
    },
    'placeholder-author': {
        en: 'Author...',
        he: 'סופר...'
    },
    'placeholder-year':{
        en: 'Year...',
        he: 'שנה...'
    },
    'create-save': {
        en: 'Save',
        he: 'שמור'
    },
    'table-title': {
        en: 'Title',
        he: 'סופר'
    },
    'table-price': {
        en: 'Price',
        he: 'מחיר'
    },
    'table-rating': {
        en: 'Rating',
        he: 'דרוג'
    },
    'table-image': {
        en: 'Image',
        he: 'שער'
    },
    'table-actions': {
        en: 'Actions',
        he: 'פעולות'
    },
    'page-prev': {
        en: 'Prev Page',
        he: 'דף הקודם'
    },
    'page-next': {
        en: 'Next Page',
        he: 'דף הבא'
    },
    'modal-details': {
        en: 'Book Details',
        he: 'פרטי הספר'
    },
    'modal-close': {
        en: 'Close',
        he: 'סגור'
    },
    'table-Good Omens': {
        en: 'Good Omens',
        he: 'בשורות טובות'
    },
    'table-Harry Potter': {
        en: 'Harry Potter',
        he: 'הארי פוטר'
    },
    'table-Lord of the Rings': {
        en: 'Lord of the Rings',
        he: 'שר הטבעות'
    },
    'button-read': {
        en: 'Read',
        he: 'קרא'
    },
    'button-update': {
        en: 'Update',
        he: 'עדכן'
    },
    'button-delete': {
        en: 'Delete',
        he: 'מחק'
    },
    'sure':{
        en: 'Sure?',
        he: 'בטוח?'
    }

}
var gCurrLang = 'en';



//LIST
function getBooksForDisplay() {
    console.log('went into getBooksForDisplay');
    gBooks.sort(function (book1, book2) {
        if (typeof book1[gSortBy] === 'number') {
            return book1[gSortBy] - book2[gSortBy];
        } else {
            console.log('book1', book1);
            console.log('gSortBy', gSortBy);
            if (book1[gSortBy].toLowerCase() > book2[gSortBy].toLowerCase()) return 1
            if (book1[gSortBy].toLowerCase() < book2[gSortBy].toLowerCase()) return -1
            return 0
        }
    })
    var idxStart = gPageIdx * PAGE_SIZE;
    var books = gBooks.slice(idxStart, idxStart + PAGE_SIZE);
    return books
}

function setSortBy(sortBy) {
    console.log('went into set sortby');
    gSortBy = sortBy
}

function paginating(diff) {
    gPageIdx += diff;
    if (gPageIdx * PAGE_SIZE >= gBooks.length) gPageIdx = 0;
    if (gPageIdx * PAGE_SIZE < 0) gPageIdx = Math.floor((gBooks.length - 1) / PAGE_SIZE);
}

//TRANSLATE

function getTrans(transKey) {
    var keyTrans = gTrans[transKey]
    if (!keyTrans) return 'UNKNOWN'

    var txt = keyTrans[gCurrLang]
    if (!txt) txt = keyTrans.en

    return txt
}

function doTrans() {
    var els = document.querySelectorAll('[data-trans]')
    els.forEach(function (el) {
        var transKey = el.dataset.trans
        var txt = getTrans(transKey)
        if (el.nodeName === 'INPUT') {
            // el.setAttribute('placeholder', txt)
            // THE SAME!
            el.placeholder = txt
        } else {
            el.innerText = txt
        }
    })
}

function setLang(lang) {
    gCurrLang = lang;
}

function formatNum(num) {
    return new Intl.NumberFormat(gCurrLang).format(num);
}

function formatCurrency(num) {
    var currency = 'USD';
    if (gCurrLang === 'he'){
      currency = 'ILS';
      num *= 3.3;
    }
    return new Intl.NumberFormat(gCurrLang, { style: 'currency', currency}).format(num);
}

//READ
function getBookById(bookId) {
    var book = gBooks.find(function (book) {
        return bookId === book.id
    })
    return book
}

function getBooksToSave() {
    _saveBooksToStorage()
}

//UPDATE
function updateBook(bookId, bookPrice) {
    var book = gBooks.find(function (book) {
        return book.id === bookId
    })
    book.price = bookPrice
    _saveBooksToStorage()
}

//CREATE
function addBook(name, price, author, year) {
    var book = {
        id: makeId(3),
        name: name,
        price: price,
        imgUrl: 'https://loremflickr.com/320/240',
        author: author,
        year: year,
        desc: makeLorem(),
        rating: 5
    }
    console.log('new book', book);
    gBooks.push(book)
    _saveBooksToStorage()
}

//DELETE
function removeBook(bookId) {
    var bookIdx = gBooks.findIndex(function (book) {
        return bookId === book.id
    })
    gBooks.splice(bookIdx, 1)
    _saveBooksToStorage()
}

function _createBooks() {
    var books = loadFromStorage(KEY)
    if (!books || !books.length) {
        books =
            [
                {
                    id: makeId(3),
                    name: 'Harry Potter',
                    price: 9.99,
                    imgUrl: '../img/POA.jpg',
                    author: 'JK Rowling',
                    year: 1999,
                    desc: makeLorem(),
                    rating: 7
                },
                {
                    id: makeId(3),
                    name: 'Lord of the Rings',
                    price: 12.99,
                    imgUrl: '../img/LOTR.jpg',
                    author: 'JRR Tolkien',
                    year: 1954,
                    desc: makeLorem(),
                    rating: 8
                },
                {
                    id: makeId(3),
                    name: 'Good Omens',
                    price: 7.99,
                    imgUrl: '../img/good-omens.jpg',
                    author: 'Terry Pratchett and Neil Gaiman',
                    year: 1990,
                    desc: makeLorem(),
                    rating: 6
                }
            ]
    }
    gBooks = books
    _saveBooksToStorage()
}

function _saveBooksToStorage() {
    saveToStorage(KEY, gBooks)
}
