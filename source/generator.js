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

function generate_pages(){
    // generate all pages from /pages that are not base.njk or page.njk
    
    // for loop through all the files in the pages directory
    const fs=require('fs');
    fs.readdir(pages_dir,(err,files)=>{
        if(err){
            console.log(err);
        }
        else{
            files.forEach(file=>{
                // check if the file is a base or page file
                if(path.extname(file)=='.njk' && file!='base.njk' && file!='page.njk'){
                    // what is the function of the configure line below?
                    nunjucks.configure(pages_dir, { autoescape: true });
                    content = nunjucks.render(file);
                    file = path.parse(file).name;
                    fs.writeFile(generated_dir + '/' + file + '.html', content, (error) => { "something went wrong"});
                }
            })
        }
    }
    )
}

function generate_articles(parsed_YAML, md){
    converter = new showdown.Converter();
    html = converter.makeHtml(md);
    nunjucks.configure(pages_dir, { autoescape: true });
    content = nunjucks.render('page.njk', {content: html});
    console.log(content);
    fs.writeFile(generated_dir + '/' + parsed_YAML.page_title + '.html', content, (error) => { "something went wrong"});
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