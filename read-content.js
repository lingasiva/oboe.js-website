"use strict";

var supermarked = require('supermarked'), 
    fs = require('fs'),
    cheerio = require('cheerio'),
    Handlebars = require('handlebars'),
    figureTemplate = Handlebars.compile(
       '<figure id="demo-{{name}}" data-demo="{{name}}"></figure>'
    ),
    MARKDOWN_OPTS = {ignoreMath:true, smartypants:true, gfm:true, tables:true},
    MD_POSTFIX = fs.readFileSync('content/postfix.md');

Handlebars.registerHelper("demo", function(name) {

   return new Handlebars.SafeString( figureTemplate({name:name}) );
});

function postProcessMarkup($) {
   $('pre').each(function(i, ele){
      var code = $(ele);
      
      if( /deprecated/i.exec( code.text()) ) {
         
         var details = $('<details>');
         code.replaceWith(details);
         details
            .append('<summary>Deprecated</summary>')
            .append(code);
      }
   });
   
   return $;
}

function outline($){

   var mainHeadingEle = $('h1').first(),
   
       mainHeading = {
         text: mainHeadingEle.text(),
         id:   mainHeadingEle.attr('id')
       },
       
       sectionHeadings = 
            $('h2').map(function(i, element){
               return {
                  text: $(element).text(),
                  id:   $(element).attr('id')
               }
            });   
   
   mainHeadingEle.remove();
   
   return {
      content: $.html(),
      heading: mainHeading,
      sections: sectionHeadings
   }
}

function readContent(requestedMarkdown, opts, callback) {

   function markdownPath(pageName) {
      return 'content/' + pageName + '.md';
   }

   fs.exists(markdownPath(requestedMarkdown), function(requestedMarkdownExists){
      
      var pageNameToRead = requestedMarkdownExists? requestedMarkdown : '404',
          markdownToRead = markdownPath(pageNameToRead),
          status = requestedMarkdownExists? 200 : 404;
      
      opts.page = pageNameToRead;
                           
      // fileToRead should point to legit page by now (possibly 404)
      fs.readFile(markdownToRead, function(err, markdownBuffer){
       
          var markdownStr = markdownBuffer.toString(),
              markDownWithGithubLink = markdownStr + MD_POSTFIX,
              filledInMarkdown = Handlebars.compile(markDownWithGithubLink)(opts),
              html = supermarked(filledInMarkdown, MARKDOWN_OPTS),
              $ = postProcessMarkup(cheerio.load(html)),
              response = outline($);
              
          response.status = status;    
          
          callback( response );
       });   
   });
}

module.exports = readContent;



