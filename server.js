const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require( 'mongoose' );
const validateAPIKEY = require('./middleware/validate-bearer-token');
const { Bookmarks } = require( './models/bookmarks');

const app = express();
const { v4: uuidv4 } = require('uuid');
const jsonParser = bodyParser.json();

app.use( validateAPIKEY ); 
app.use(morgan('dev'));

let createElement = (title, description, url, rating) => {
	return {
		id: uuidv4(),
		title,
		description,
		url,
		rating
	}
}

let errorResponse = ( res, status, msg) => {
	res.statusMessage = msg;
	return res.status( status ).end();
}

//return array with all bookmarks
app.get('/bookmarks', (req, res) => {
	Bookmarks
	.getAllBookmarks()
	.then( result => {
		return res.status(200).json( result );
	})
	.catch( err => {
		return errorResponse(res, 500, "Something is wrong with the Database. Try again later.");
	})
});

//return bookmark by title
app.get('/bookmark', (req, res) => {
	let title = req.query.title;
	
	if(!title) {
		return errorResponse(res, 406, "Please send the title as a parameter.");
	} else {
		Bookmarks
		.getBookmarkByTitle( title )
		.then( result => {
			if( result.length == 0) {
				return errorResponse(res, 404, `There is no result with title=${title}`);
			}
			
			return res.status(200).json( result );
		})
		.catch( err => {
			return errorResponse(res, 500, "Something is wrong with the Database. Try again later.");
		})
	}
});

//create new bookmark
app.post('/bookmarks', [jsonParser], (req, res) => {
	let title = req.body.title;
	let description = req.body.description;
	let url = req.body.url;
	let rating = req.body.rating;

	if(!title || !description || !url || !rating) {
		return errorResponse(res, 406, `One of these parameters is missing in the body request: description, title, url, rating`);
	}

	let newBkmark = createElement(title, description, url, rating);

	Bookmarks
	.createBookmark( newBkmark )
	.then( result => {
		return res.status(201).json( result );
	})
	.catch( err => {
		return errorResponse(res, 500, "Something is wrong with the Database. Try again later.");
	})
})

//delete bookmark by id
app.delete('/bookmark/:id', (req, res) => {
	let id = req.params.id;

	Bookmarks
	.deleteBookmark( id )
	.then( result => {
		if( result.deletedCount == 0) {
			return errorResponse(res, 404, `The bookmark with id = ${id} does not exist`);
		}

		return res.status(200).json( {} );
	})
	.catch( err => {
		return errorResponse(res, 500, "Something is wrong with the Database. Try again later.");
	})
});

//udpate bookmark
app.patch('/bookmark/:id', [jsonParser], (req, res) => {
	let body_id = req.body.id;

	if( !body_id ) {
		return errorResponse(res, 406, `Missing id field in request body`);
	}

	let id = req.params.id;
	
	if(body_id != id) {
		return errorResponse(res, 409, `Request body and param id don't match. Body id: ${body_id}. Param id: ${id}`);
	}

	let updatedBookmark = {};
	let title = req.body.title;
	let description = req.body.description;
	let url = req.body.url;
	let rating = req.body.rating;

	if(title) {
		updatedBookmark.title = title;	
	}

	if(description) {
		updatedBookmark.description = description;	
	}

	if(url) {
		updatedBookmark.url = url;	
	}

	if(rating) {
		updatedBookmark.rating = rating;	
	}
	
	Bookmarks
	.updateBookmark(id, updatedBookmark ) 
	.then( result => {
		if( !result ) {
			return errorResponse(res, 404, `The bookmark with id = ${id} does not exist`);
		} else {
			Bookmarks
			.getBookmarkById( result.id )
			.then( resp => {
				return res.status(202).json( resp );
			})
			.catch( _ => {
				return errorResponse(res, 500, "Something is wrong with the Database. Try again later.");
			})
		}
	})
	.catch( _ => {
		return errorResponse(res, 500, "Something is wrong with the Database. Try again later.");
	})
})

app.listen( 8080, () => {
	console.log("Server - CRUD app on port 8080");

	new Promise( ( resolve, reject) => {
		const settings = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true
		}

		mongoose.connect('mongodb://localhost/bookmarks', settings, ( err ) => {
			if( err ) {
				return reject( err );
			} else {
				console.log( "Database connected successfully" );
				return resolve();
			}
		})
		.catch( err => {
			console.log( err );
		})
	})
});

//http://localhost:8080