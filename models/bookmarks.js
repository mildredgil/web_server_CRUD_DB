const mongoose = require( 'mongoose' );

const bookmarkSchema = mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    url : {
        type : String,
        required : true
    },
    rating : {
        type : Number,
        required : true
    },
    id : {
        type : String,
        required : true,
        unique : true
    }
});

const bookmarkCollection = mongoose.model( 'bookmarks', bookmarkSchema );

const Bookmarks = {
    createBookmark : function( newBookMark ){
        return bookmarkCollection
            .create( newBookMark )
            .then( createdBookMark => {
                return createdBookMark;
            })
            .catch( err => {
                return err;
            });
    },
    getAllBookmarks : function(){
        return bookmarkCollection
            .find()
            .then( allbookmark => {
                return allbookmark;
            })
            .catch( err => {
                return err;
            });
    },
    getBookmarkById : function ( bookmarkId )  {
        return bookmarkCollection
        .find( { id: bookmarkId } )
        .then( bookmark => {
            return bookmark;
        })
        .catch( err => {
            return err;
        });
    },
    getBookmarkByTitle : function ( bookmarkTitle )  {
        return bookmarkCollection
        .find( { title: bookmarkTitle } )
        .then( bookmark => {
            return bookmark;
        })
        .catch( err => {
            return err;
        });
    },
    deleteBookmark : function ( idBookrmark ) {
        return bookmarkCollection
        .deleteOne({ id: idBookrmark })
        .then(  result => {
            return result;
        })
        .catch( err => {
            return err;
        });
    },
    updateBookmark : function ( idBookrmark, update ) {
        return bookmarkCollection
        .findOneAndUpdate( { id: idBookrmark }, update )
        .then( result => {
            return result;
        })
        .catch( err => {
            return err;
        });
    }
}

module.exports = { Bookmarks };