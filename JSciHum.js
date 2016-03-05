// Public Library of Scientific Humanities
var Random = require("random-js");
r = new Random();
var request = require('request');
var Twit = require('twit');
 
var T = new Twit({
  consumer_key:         '...',
  consumer_secret:      '...',
  access_token:         '....',
  access_token_secret:  '...',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests. 
})


// note the '!' - this is a self-invoking function.
! function publishJournal() {

	// remove HTML tags from text
	function removeHTMLOpen(x){
		return x.replace(/<+\w+>/g,"")
	};

	function removeHTMLClose(x){
		return x.replace(/<+\/\w+>/g,"")
	};

	// functions to replace text after ? marks at the end of the string, so the sentence makes sense.
	function replaceQ(x){
		return x.replace(/\?$/, "? Questions")
	}

	function replaceQsc(x){
		return x.replace(/\?'$/, "?' Questions")
	}

	function replaceQdc(x){
		return x.replace(/\?"$/, '?" Questions')
	}

	// function to test whether there is a single loose quote mark, a pair, or none.
	// if none or a pair, return true.
	function testQuotes(x){
		var hasQuote = /"|'|‘|’|“|”/g.test(x);
		if (hasQuote) {
			var completeQuote = /"+.+"|'+.+'|‘+.+’|“+.+”/g.test(x);
			return completeQuote;
		} else 
		return true;
	};

	// checks for square brackets and removes anything after an open bracket
	function checkForBrackets(x){
		var testB = /\[[\s\S]+\]/g.test(x)
		if (testB)
			return x;
		else return x.replace(/\[+[\s\S]+/,"")
	};

	// trigger functions to check for question marks
	function cleanHumanities(x){
		var cleanOne = replaceQ(x);
		var cleanTwo = replaceQsc(cleanOne);
		var humanitiesArticle = replaceQdc(cleanTwo);
		getScience(humanitiesArticle);
	}

	function getScience(humanitiesArticle) {

		var subject = ["biology","botany","chemistry","mathematics","microbiology","physics","science"];
		var country = ["gb","us"];
		var url = "https://doaj.org/api/v1/search/articles/subject%3A%22science%22%20language%3A%22english%22%20country%3A%22" + r.pick(country) + "%22?page=" + r.integer(1,370) + "&pageSize=10&sort=date%3Adesc"
		request(url, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		    var articles = JSON.parse(body);
		    	var sciIndex = r.integer(0,9);
				var titleFull = articles.results[sciIndex].bibjson.title.split('.');
				var rootTitleOne = titleFull[0];
				var titleOneBy = rootTitleOne.split(' by ');
				var titleOneTo = rootTitleOne.split(' to ');
				var titleOneOn = rootTitleOne.split(' on ');
				var titleOneOf = rootTitleOne.split(' of ');
				var titleOneFor = rootTitleOne.split(' for ');
				var titleOneIn = rootTitleOne.split(' in ');
				var titleOneThrough = rootTitleOne.split(' through ');
				var titleOneWith = rootTitleOne.split(' with ');

				if (titleOneBy[1]) {
					var scienceTitle = " by " + titleOneBy[1];
					tweet();
				}
				else if (titleOneTo[1]) {
					var scienceTitle = " to " + titleOneTo[1];
					tweet()
				}
				else if (titleOneOn[1]) {
					var scienceTitle = " on " + titleOneOn[1];
					tweet()
				}
				else if (titleOneOf[1]) {
					var scienceTitle = " of " + titleOneOf[1];
					tweet()
				}
				else if (titleOneFor[1]) {
					var scienceTitle = " for " + titleOneFor[1];
					tweet()
				}
				else if (titleOneIn[1]) {
					var scienceTitle = " in " + titleOneIn[1];
					tweet()
				}
				else if (titleOneWith[1]) {
					var scienceTitle = " with " + titleOneWith[1];
					tweet()
				}
				else if (titleOneThrough[1]) {
					var scienceTitle = " through " + titleOneThrough[1];
					tweet()
				} else getHumanities();

				function tweet() {
					var sciHumArticle = humanitiesArticle + " " + scienceTitle + "."
					var noTagsOpen = removeHTMLOpen(sciHumArticle);
					var noTags = removeHTMLClose(noTagsOpen);
					var noBrackets = checkForBrackets(noTags)
					var cleanTitle = noBrackets.replace('  ', ' ');
					var noQuotes = testQuotes(cleanTitle);
					if (noQuotes && cleanTitle.length < 141) {
						T.post('statuses/update', { status: cleanTitle }, function(err, data, response) {
						  console.log(data);
						});
					}
					else getHumanities();
				}
			  }
			});
	};

	function getHumanities(){
		var discipline = ["fine arts","history","literature","political science","sociology"];
		var country = ["gb","us"];
		var url = "https://doaj.org/api/v1/search/articles/subject%3A%22" + r.pick(discipline) + "%22%20language%3A%22english%22%20country%3A%22" + r.pick(country) + "%22?page=" + r.integer(1,10) + "&pageSize=10&sort=date%3Adesc";
		var humIndex = r.integer(0,9);
		request(url, function (error, response, body) {
			  if (!error && response.statusCode == 200) {
			    var articles = JSON.parse(body);
				var rootTitleTwo = 	articles.results[humIndex].bibjson.title;
				var titleTwoColon = rootTitleTwo.split(':');
				var titleTwoDash = rootTitleTwo.split(' - ')			
				var titleTwoTo = rootTitleTwo.split(' to ');
				var titleTwoBy = rootTitleTwo.split(' by ');
				var titleTwoOn = rootTitleTwo.split(' on ');
				var titleTwoFor = rootTitleTwo.split(' for ');
				var titleTwoIn = rootTitleTwo.split(' in ');
				var titleTwoUnder = rootTitleTwo.split(' under ');
				var titleTwoWith = rootTitleTwo.split(' with ');

				if (titleTwoBy[1]) {
					var humanitiesTitle = titleTwoBy[0];
					cleanHumanities(humanitiesTitle);
				}	
				else if (titleTwoColon[1]) {
					var humanitiesTitle = titleTwoColon[0];
					cleanHumanities(humanitiesTitle);
				}
				else if (titleTwoDash[1]) {
					var humanitiesTitle = titleTwoDash[0];
					cleanHumanities(humanitiesTitle);
				}						
				else if (titleTwoTo[1]) {
					var humanitiesTitle = titleTwoTo[0];
					cleanHumanities(humanitiesTitle);
				}
				else if (titleTwoOn[1]) {
					var humanitiesTitle = titleTwoOn[0];
					cleanHumanities(humanitiesTitle);
				}
				else if (titleTwoFor[1]) {
					var humanitiesTitle = titleTwoFor[0];
					cleanHumanities(humanitiesTitle);
				}
				else if (titleTwoIn[1]) {
					var humanitiesTitle = titleTwoIn[0];
					cleanHumanities(humanitiesTitle);
				}
				else if (titleTwoWith[1]) {
					var humanitiesTitle = titleTwoWith[0];
					cleanHumanities(humanitiesTitle);
				}
				else if (titleTwoUnder[1]) {
					var humanitiesTitle = titleTwoUnder[0];
					cleanHumanities(humanitiesTitle);
				} else getHumanities();				    
			}
		});
	};

	// GO!
	getHumanities();

	// Once we've run through the loop (which could take a few seconds depending how many times it has to try again)
	// we set a delay of 1.4 hours before looping again, using setTimeout inside a self-invoking function.
	setTimeout(publishJournal, 5.04e+6);
}()
