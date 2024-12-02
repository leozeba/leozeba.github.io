var M_XHR = (function(){
 'use strict';

 var methods = {};

 var timings = {};

 //
 // Methods
 //
 methods.get = async function(path, as, storageKey) {
   var muuid = path;
   var mskey = storageKey;

   M.timer("on", muuid);
   // M.loading("on")
   M.pageloader("on");

   var endpoint = M.endpoint() + path;
   var config = {
       headers: {
         "Authorization": M.userAuthorization()
       }
     };
   if (as !== undefined && as == "app") {
     config = {
       headers: {
         "Authorization": M.appAuthorization()
       }
     };
   }

   return await axios
     .get(endpoint, config)
     .then(response => {
       var json = response.data;

       if (json.Status != 200) {
         localStorage.clear();

         // authentication-error
         if (json.Status == "401") {
           M.redirect("401.html");
           return;
         }
         // api-error
         if (json.Status == "500") {
           M.redirect("500.html");
           return;
         }
       }

       var mresult = JSON.parse(json.Result);
       var mcache = + new Date() + "|M|" + JSON.stringify(mresult);

       if (mskey != undefined) {
         M.storage(mskey, mcache)
       }

       M.log(" ");
       M.log("mxhr.get(" + muuid + ")");
       M.log("from", "api");

       if (mskey != undefined) {
         M.log("key", mskey);
       }

       return mresult;
     })
     .finally(() => {
       var mttl = "60s";
       var mtime = M.timer("off", muuid);
       var melapsed =  (mtime / 1000.0).toFixed(1) + "s";
       if (mtime < 1000) {
         melapsed = mtime + "ms"
       }

       M.log("time", melapsed);
       M.log("ttl", mttl);

       var mlog = M.get("#mlog");
       if (mlog != null) {
         mlog.innerHTML = "xhr (" + melapsed + "). ttl (" + mttl + ").";
       }

       M.pageloader("off");
     });
 };

 methods.post = async function(path, as, data, redirect = true) {
   var muuid = path;

   M.timer("on", muuid);
   M.pageloader("on");

   var endpoint = M.endpoint() + path;
   var config = {
     headers: {
       "Authorization": M.userAuthorization(),
       "Content-Type": "application/json"
     }
   };
   if (as !== undefined && as == "app") {
     config = {
       headers: {
         "Authorization": M.appAuthorization(),
         "Content-Type": "application/json"
       }
     };
   }

   return await axios
     .post(endpoint, data, config)
     .then(response => {
       var json = response.data;

       if (json.Status != 200) {
         // authentication-error
         if (json.Status == "401") {
           if (redirect) {
             M.redirect("401.html");
           }
           return json;
         }
         // api-error
         if (json.Status == "500") {
           if (redirect) {
             M.redirect("500.html");
           }
           return json;
         }
       }

       var mresult = json;

       M.log(" ");
       M.log("mxhr.post(" + muuid + ")");
       M.log("from", "api");

       return mresult;
     })
     .finally(() => {
       // var mttl = "60s";
       var mtime = M.timer("off", muuid);
       var melapsed =  (mtime / 1000.0).toFixed(1) + "s";
       if (mtime < 1000) {
         melapsed = mtime + "ms"
       }

       M.log("time", melapsed);
       // M.log("ttl", mttl);

       var mlog = M.get("#mlog");
       if (mlog != null) {
          mlog.innerHTML = "xhr (" + melapsed + ").";
       }

       M.pageloader("off");
     });
 };

 // Expose the public methods
 return methods;
})();
