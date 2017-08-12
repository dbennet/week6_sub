(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .component("sdImageSearch", {
    	templateUrl: imageSearchTemplateUrl,
      controller: ImageSearchController,

    });
	
	imageSearchTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function imageSearchTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.image_search_html;
  }   

	ImageSearchController.$inject = ["$scope",
                                  "$stateParams",
                                  "spa-demo.authz.Authz",
                                  "spa-demo.subjects.Image",
                                  "spa-demo.subjects.ImageSearch",
                                  "spa-demo.geoloc.geocoder"];
	function ImageSearchController($scope,$stateParams,Authz,Image,ImageSearch,geocoder) {
    var vm = this;
    vm.longitude = null;
    vm.latitude = null;
    vm.distanceLimit = 5;
    vm.distance = 5;
    vm.newOrder = "asc";
    vm.order = "asc";
    vm.lookupAddress=lookupAddress;
    vm.getOriginAddress=getOriginAddress;
    vm.clearOrigin=clearOrigin;
    vm.changeDistance=changeDistance;
    vm.searchImages = searchImages;
    vm.changeOrder = changeOrder;
    vm.removeImage = removeImage;
    
    return;
    //////////////
    function searchImages() {
      vm.latitude = vm.location.position.lat ? vm.location.position.lat : null;
      vm.longitude = vm.location.position.lng ? vm.location.position.lng : null;
      if (vm.latitude && vm.longitude) {
        makeQuery();
      }
    }
    function makeQuery() {
      vm.items = ImageSearch.query({
                    lng:vm.longitude,
                    lat:vm.latitude,
                    miles:vm.distance,
                    order:vm.order,
                    excluded:vm.excluded});
    }
    function lookupAddress() {
      console.log("lookupAddress for", vm.address);
      geocoder.getLocationByAddress(vm.address).$promise.then(
        function(location){
          vm.location = location;
          console.log("location", location);
        });
    }

    function getOriginAddress() {
      return vm.location ? vm.location.formatted_address : null;
    }
    function clearOrigin() {
      return vm.location = null;
    }
    function changeDistance() {
      console.log("setDistance", vm.distanceLimit);
      vm.distance = vm.distanceLimit;
      if (vm.location) {
        makeQuery();
      }  
    }
    function changeOrder() {
      vm.order = vm.newOrder
      if (vm.location) {
        makeQuery();
      }
    }
    function removeImage(id) {
      if (vm.excluded) {
        vm.excluded += "," + id;
      } else {
        vm.excluded = id;
      }
      console.log("excluded ",vm.excluded)
      makeQuery();
    }
	}
})();