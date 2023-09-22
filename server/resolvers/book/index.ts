import { Book_book } from './book'
import { Book_books } from './books'
import { Book_addBook } from './add-book'
import { Book_ping } from './ping'

export const BookQueries = {
  Book_book,
  Book_books,
}

export const BookMutations = {
  Book_addBook,
}

export const BookSubscriptions = {
  Book_ping,
}
