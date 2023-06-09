// TO DO:
// Link images, media, footnotes / comments 

const YAML = require('yaml');
const nunjucks = require('nunjucks');
const path=require('path');
const showdown = require('showdown');

// set up paths
const pages_dir = path.join(__dirname,'../', 'pages');
const generated_dir = path.join(__dirname, '../', 'generated');
const articles_dir = path.join(__dirname, '../', 'articles');

function generate_pages() {
    // Generate all pages from /pages that are not base.njk or page.njk
  
    // For loop through all the files in the pages directory
    const fs = require('fs');
    const path = require('path');
    const nunjucks = require('nunjucks');
    const YAML = require('yaml');
  
    fs.readdir(pages_dir, (err, files) => {
      if (err) {
        console.log(err);
      } else {
        files.forEach(file => {
          // Check if the file is a base or page file
          if (path.extname(file) === '.njk' && file !== 'base.njk' && file !== 'page.njk') {
            nunjucks.configure(pages_dir, { autoescape: true });
            const content = nunjucks.render(file);
            const fileName = path.parse(file).name;
  
            fs.writeFile(generated_dir + '/' + fileName + '.html', content, (error) => {
              if (error) {
                console.log('Something went wrong: ', error);
              }
            });
  
            // If file is posts, generate the posts page with a list of all the posts inside the div called posts-list
            if (fileName === 'posts') {
              fs.readdir(articles_dir, (err, files) => {
                if (err) {
                  console.log(err);
                } else {
                  const postItems = [];
  
                  files.forEach(file => {
                    // Check if the file is a markdown file
                    if (path.extname(file) === '.md') {
                      const dir = path.join(articles_dir, file);
                      const str = fs.readFileSync(dir, 'utf8');
                      const end_of_yaml = str.indexOf('---', 3);
  
                      // Get the YAML part
                      const yaml = str.substring(0, end_of_yaml);
                      const parsedYAML = YAML.parse(yaml);
  
                      // Create a new div with id "post-item" and append it to the "posts-list" div
                      const postItem = `<div id="post-item">
                      <div id="post-title"> ${parsedYAML.page_title} </div>
                      <div id="post-date"> ${parsedYAML.date} </div>
                      <div id="post-draft_status"> ${parsedYAML.draft_status} </div>
                      <div id="post-description"> ${parsedYAML.blurb} </div>
                      <div id="post-category"> ${parsedYAML.category} </div>
                      </div>`;
                      postItems.push(postItem);
                    }
                  });
  
                  const postsPagePath = generated_dir + '/posts.html';
  
                  fs.readFile(postsPagePath, 'utf8', (err, data) => {
                    if (err) {
                      console.log(err);
                    } else {
                      const postsList = postItems.join('\n');
                      const updatedData = data.replace('<div id="posts-list"></div>', `<div id="posts-list">${postsList}</div>`);
  
                      fs.writeFile(postsPagePath, updatedData, 'utf8', err => {
                        if (err) {
                          console.log(err);
                        } else {
                          console.log('Posts page generated successfully.');
                        }
                      });
                    }
                  });
                }
              });
            }
          }
        });
      }
    });
  }
  

function generate_articles(parsed_YAML, md){
    converter = new showdown.Converter();
    html = converter.makeHtml(md);
    nunjucks.configure(pages_dir, { autoescape: true });
    content = nunjucks.render('page.njk', {content: html});
    fs.writeFile(generated_dir + '/' + 'post_' + parsed_YAML.page_title + '.html', content, (error) => { "something went wrong"});
}

function markdown_to_html(markdown){
    // split the markdown file into yaml and markdown

    for (var i = 2; i < markdown.length; i++) {
        if(markdown[i]=='-' && markdown[i+1]=='-' && markdown[i+2]=='-'){
            end_of_yaml=i;
            break;
        }
    }
    // get the yaml part
    yaml=markdown.substring(0,end_of_yaml);
    // get the markdown part
    md=markdown.substring(end_of_yaml+3,markdown.length);
    // individual yaml variables can be accessed with the . operator
    parsed_YAML = YAML.parse(yaml);
    // now we have the yaml and the markdown, we can convert into html
    generate_articles(parsed_YAML, md)
}

// generate the base pages first
generate_pages()

// for loop through all the files in the articles directory
const fs=require('fs');
fs.readdir(articles_dir,(err,files)=>{
    if(err){
        console.log(err);
    }
    else{
        files.forEach(file=>{
            // check if the file is a markdown file
            if(path.extname(file)=='.md'){
                dir = path.join(articles_dir, file);
                var str = fs.readFileSync(dir, "utf8");
                markdown_to_html(str)
            }
            else{
                console.log(file + ' is not a valid file');
            }
        })
    }
}
)