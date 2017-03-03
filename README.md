# axe-sitemap-parser

This app is used for parsing sitemap urls and test the accessibility.

## Getting started

Install Node.js if you haven't already. This project requires Node 6+.
First download the package:

npm install axe-sitemap-parser --save

## How to use it!

The app can be used in two ways.

You can call it directly from the folder where is installed with the following commmand: node app.js --sitemapUrl='your sitemap url'

Using gulp and require attribute to acces the exported function.
	
A report will be generated in the results folder for each url parsed from sitemap.