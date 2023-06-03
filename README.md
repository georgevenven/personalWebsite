# Micro-Static-Site-Generator-

# This is a very simple static site generator. It is written in Node.js and uses the Nunjucks templating engine.
# Posts are written in markdown and are stored in /articles, imgs are stored in static/imgs, they are linked via relative paths. (../static/img/example.jpg))
# Pages are written in njk and are stored in /pages, base, index, and page are the only pages that are required. (pages serve as the template for posts)
# Style is defined in the /static/css/style.css file.
# To compile the site, run the command "node generator.js" in the /source directory of the project.