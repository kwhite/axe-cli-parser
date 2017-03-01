var parseUrl = (function () {

    var instance;

    function init(sitemapUrl) {
        var AxeBuilder = require('axe-webdriverjs');
        var webdriver = require('selenium-webdriver');
        var chrome = require('selenium-webdriver/chrome');
        var path = require('chromedriver').path;
        var Sitemapper = require('sitemapper');
        var fs = require('fs');

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

        // generate a random id used for creating the json files.
         function makeid() {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 5; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        }

        // executes the axe analyzer for a specific url
        function ExecuteCommand(url, driver) {
            driver
                .get(url)
                .then(function () {
                    AxeBuilder(driver)
                        .analyze(function (results) {
                            console.log(results);
                            var filepath = './results/results-';                                              
                            fs.writeFile(filepath.concat(makeid()).concat('.json'), JSON.stringify(results, null, 2), 'utf-8');
                        });
                });
            console.log('test5');
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

module.exports = {
    axeParser : function(sitemapUrl)
    {
        var parser = parseUrl.getInstance(sitemapUrl);
        parser.parseSitemap();
    } 
};