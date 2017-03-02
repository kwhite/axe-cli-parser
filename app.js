var argv = require('yargs').argv;
var AxeBuilder = require('axe-webdriverjs');
var webdriver = require('selenium-webdriver');
var chrome = require('selenium-webdriver/chrome');
var path = require('chromedriver').path;
var Sitemapper = require('sitemapper');
var fs = require('fs');
 var folderpath = './results/';
 
var parseUrl = (function () {

    var instance;

    function init(sitemapUrl) {


        sitemapUrl = sitemapUrl || {};

        function UrlList() {
            //builds the chrome driver 
            var service = new chrome.ServiceBuilder(path).build();
            chrome.setDefaultService(service);

            var driver = new webdriver.Builder()
                .withCapabilities(webdriver.Capabilities.chrome())
                .build();


            var sitemap = new Sitemapper({
                url: sitemapUrl,
                timeout: 15000
            });

            sitemap.fetch()
                .then(function (sites) {
                     if(!fs.existsSync(folderpath))
                        {   
                            fs.mkdirSync(folderpath);                           
                        }
                    Array.prototype.forEach.call(sites.sites, site => {                       
                        ExecuteCommand(site, driver);                       
                        driver.manage().timeouts().setScriptTimeout(10000);                       
                    });
                })
                .catch(function (error) {
                    driver.quit();
                    console.log(error);
                });
        }
        
        function buildUrlName(url) {
            var pattern = RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?");

            var matches = url.match(pattern);
            return {
                scheme: matches[2],
                authority: matches[4],
                path: matches[5],
                query: matches[7],
                fragment: matches[9]
            };
        }

        // executes the axe analyzer for a specific url
        function ExecuteCommand(url, driver) {
            driver
                .get(url)
                .then(function () {                    
                    AxeBuilder(driver)
                        .analyze(function (results) {
                            console.log('Checking Url:' , url, '\n');                            
                            var urlpath = buildUrlName(url).path.replace(/\//g, "-");                           
                            fs.writeFile(folderpath.concat(urlpath.substring(1, urlpath.length-1)).concat('.json'), JSON.stringify(results, null, 2), 'utf-8');
                            Array.prototype.forEach.call(results.violations, description => {
                                 console.log('Violation Messages: ',description.description , '\n');   
                             })
                             console.log('The process has been finished. \n');                                                                                   
                        });                  
                })                            
                  .catch(function (error) {
                    driver.quit();
                    console.log(error);                   
                });         
        }


        return {
            parseSitemap: function () {
                return UrlList();
            }
        };
    };

    return {
        getInstance: function (sitemapUrl) {

            if (!instance) {
                instance = init(sitemapUrl);
            }

            return instance;
        }
    };
})();

if (argv.sitemapUrl) {
    var parser = parseUrl.getInstance(argv.sitemapUrl);
    parser.parseSitemap();
}
module.exports = {
    axeParser: function (sitemapUrl) {
        var parser = parseUrl.getInstance(sitemapUrl);
        parser.parseSitemap();
    }
};