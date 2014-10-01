var express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    errorHandler = require('errorhandler'),
    methodOverride = require('method-override'),
    port = parseInt(process.env.PORT, 10) || 9876;

app.get("/", function (req, res) {
  res.redirect("/index.html");
});

app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + '/public'));
app.use(errorHandler({
  dumpExceptions: true,
  showStack: true
}));



var Post = {
	findPosts: function(cb) {
		var posts = {
			"0": {
				"title": "My first post",
				"description": "Nothing here",
				"date": new Date(),
				"url": "http://www.blisty.cz"
			}
		}
		cb(posts)
	}
}

var Feed = require('./feed');

app.get('/rss', function(req, res) {

    // Initializing feed object
    var feed = new Feed({
        title:          'My Feed Title',
        description:    'This is my personnal feed!',
        link:           'http://example.com/',
        image:          'http://example.com/logo.png',
        copyright:      'Copyright © 2013 John Doe. All rights reserved',

        author: {
            name:       'John Doe',
            email:      'john.doe@example.com',
            link:       'https://example.com/john-doe'
        }
    });

    // Function requesting the last 5 posts to a database. This is just an
    // example, use the way you prefer to get your posts.
    Post.findPosts(function(posts, err) {
        if(err)
            res.send('404 Not found', 404);
        else {
            for(var key in posts) {
                feed.addItem({
                    title:          posts[key].title,
                    link:           posts[key].url,
                    description:    posts[key].description,
                    date:           posts[key].date
                    //content: 		"hello"
                });
            }
            // Setting the appropriate Content-Type
            res.set('Content-Type', 'text/xml');

            // Sending the feed as a response
            res.send(feed.render('rss-2.0'));
        }
    });
});

console.log("Simple static server listening at http://localhost:" + port);
app.listen(port);
