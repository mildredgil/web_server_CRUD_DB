const API_TOKEN = '2abbf7c3-245b-404f-9473-ade729ed4653';

function addBookmarkFetch( title, description, url, rating ){
    let _url = '/bookmarks';

    let data = {title, description, url, rating: Number(rating)};

    let settings = {
        method : 'POST',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`,
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify( data )
    }

    let results = document.querySelector( '.results' );

    fetch( _url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            fetchBookmarks();
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function deleteBookmarkFetch( id ){
    let url = `/bookmark/${id}`;

    let settings = {
        method : 'DELETE',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`
        }
    }

    let results = document.querySelector( '.results' );

    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            fetchBookmarks();
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function updateBookmarkFetch( id, title="", description="", url="", rating="" ){
    let _url = `/bookmark/${id}`;

    let data = {id, title, description, url, rating: Number(rating)};

    let settings = {
        method : 'PATCH',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`,
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify( data )
    }

    let results = document.querySelector( '.results' );

    fetch( _url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            fetchBookmarks();
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function fetchBookmarks(){

    let url = '/bookmarks';
    let settings = {
        method : 'GET',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`
        }
    }
    let results = document.querySelector( '.results' );

    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            results.innerHTML = "";
            for ( let i = 0; i < responseJSON.length; i ++ ){
                results.innerHTML += 
                    `<div>id: ${responseJSON[i].id} </div>
                    <div>title: ${responseJSON[i].title} </div>
                    <div>description: ${responseJSON[i].description} </div>
                    <div>url: ${responseJSON[i].url} </div>
                    <div>rating: ${responseJSON[i].rating} </div>`;
            }
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
    
}

function fetchByTitleBookmarkFetch( title ){

    let url = `/bookmark?title=${title}`;
    let settings = {
        method : 'GET',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`
        }
    }
    let results = document.querySelector( '.results' );

    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            results.innerHTML = "";
            for ( let i = 0; i < responseJSON.length; i ++ ){
                results.innerHTML += 
                    `<div>id: ${responseJSON[i].id} </div>
                    <div>title: ${responseJSON[i].title} </div>
                    <div>description: ${responseJSON[i].description} </div>
                    <div>url: ${responseJSON[i].url} </div>
                    <div>rating: ${responseJSON[i].rating} </div>`;
            }
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
    
}

function watchBookmarksForm(){
    let BookmarksForm = document.querySelector( '.bookmarks-form' );

    BookmarksForm.addEventListener( 'submit', ( event ) => {
        event.preventDefault();

        fetchBookmarks();
    });
}

function watchAddBookmarktForm(){
    let BookmarksForm = document.querySelector( '.add-bookmark-form' );

    BookmarksForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        let title = document.querySelector( '.add-bookmark-form > #bookmarkTitle' ).value;
        let desc = document.querySelector( '.add-bookmark-form > #bookmarkDescription' ).value;
        let url = document.querySelector( '.add-bookmark-form > #bookmarkUrl' ).value;
        let rating = document.querySelector( '.add-bookmark-form > #bookmarkRating' ).value;

        addBookmarkFetch( title, desc, url, rating );
    })
}

function watchDeleteBookmarktForm(){
    let BookmarksForm = document.querySelector( '.delete-bookmark-form' );

    BookmarksForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        let id = document.querySelector( '.delete-bookmark-form > #bookmarkId' ).value;
        
        deleteBookmarkFetch( id );
    })
}

function watchUpdateBookmarktForm(){
    let BookmarksForm = document.querySelector( '.update-bookmark-form' );

    BookmarksForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        let id = document.querySelector( '.update-bookmark-form > #bookmarkId' ).value;
        let title = document.querySelector( '.update-bookmark-form > #bookmarkTitle' ).value;
        let desc = document.querySelector( '.update-bookmark-form > #bookmarkDescription' ).value;
        let url = document.querySelector( '.update-bookmark-form > #bookmarkUrl' ).value;
        let rating = document.querySelector( '.update-bookmark-form > #bookmarkRating' ).value;

        updateBookmarkFetch( id, title, desc, url, rating );
    })
}

function watchGetOneBookmarktForm(){
    let BookmarksForm = document.querySelector( '.get-by-title-bookmark-form' );

    BookmarksForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        let title = document.querySelector( '.get-by-title-bookmark-form > #bookmarkTitle' ).value;
        
        fetchByTitleBookmarkFetch( title );
    })
}

function init(){
    watchBookmarksForm();
    watchAddBookmarktForm();
    watchDeleteBookmarktForm();
    watchUpdateBookmarktForm();
    watchGetOneBookmarktForm();

    fetchBookmarks();
}

init();