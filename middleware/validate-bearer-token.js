const {TOKEN} = require("../config");

function validateAPIKEY(req, res, next) {
	if(!req.query.apiKey && !req.headers.authorization && !req.headers['book-api-key']) {
		res.statusMessage = "Unauthorizated request. Send the API KEY"
		return res.status(401).end();
	}
	console.log(TOKEN)
	if(req.query.apiKey !== TOKEN && req.headers.authorization !== `Bearer ${TOKEN}` && req.headers['book-api-key'] !== TOKEN) {
		res.statusMessage = "Unauthorizated request. Invalid API KEY"
		return res.status(401).end();
	}	
	
	next();
}

module.exports = validateAPIKEY;