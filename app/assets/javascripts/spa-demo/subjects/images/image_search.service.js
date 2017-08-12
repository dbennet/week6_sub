(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .factory("spa-demo.subjects.ImageSearch", ImageSearchFactory);

  ImageSearchFactory.$inject = ["$resource","spa-demo.config.APP_CONFIG"];
  function ImageSearchFactory($resource, APP_CONFIG) {
    var service = $resource(APP_CONFIG.server_url + "/api/search");
    return service;
  }
})();