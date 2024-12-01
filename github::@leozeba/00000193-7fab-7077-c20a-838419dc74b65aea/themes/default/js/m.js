 var M = (function(){
 	'use strict';

 	var methods = {};

  var timings = {};

 	//
 	// Methods
 	//
  methods.appAuthorization = function(){
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVVUlEIjoiYXBwOjptZW1vcmkuYXMiLCJleHAiOjE2NzIzOTIwOTEsImlhdCI6MTY2OTgwMDA5MSwiaXNzIjoibWVtb3JpLmFzIn0.sUe1KNSa1xadLRAKofk6JS5mHMpagLcfGcWIBf0xsX0";
  };
  methods.userAuthorization = function(){
    return this.storage("memori.as-m-api-key");
  };

 	methods.get = function(selector){
    if (selector.indexOf("#") == 0) {
      return document.querySelector(selector);
    }
    return document.querySelectorAll(selector)[0];
 	};
  methods.all = function(selector){
    return document.querySelectorAll(selector);
  };
  methods.data = function(selector, data){
    return this.get(selector).dataset[data];
  };
 	methods.params = function(name){
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
 	};
  methods.value = function(selector, newValue = undefined){
    const element = document.querySelector(selector);
    // If newValue is undefined, return the currentValue
    if (newValue == undefined) {
      return element.value;
    }
    element.value = newValue;
  };
  methods.redirect = function(href){
    window.location.href = href;
 	};
  methods.label = function(days) {
    const now = new Date();
    if (days < 0) {
      now.setDate(now.getDate() + days);
    }

    var yyyy = now.getFullYear();
    var mm = now.getMonth() + 1;
    var dd = now.getDate();
    var yyyymmdd = yyyy;
    if (mm < 10) {
      yyyymmdd = yyyymmdd + "0" + mm;
    } else {
      yyyymmdd = yyyymmdd + mm;
    }
    if (dd < 10) {
      yyyymmdd = yyyymmdd + "0" + dd;
    } else {
      yyyymmdd = yyyymmdd + dd;
    }
    return parseInt(yyyymmdd);
  };
  methods.signout = function() {
    M.get("#logout").classList.add("is-loading");
    gapi.load("auth2", function(){
      gapi.auth2.init().then(function(){
        gapi.auth2.getAuthInstance().signOut();
        M.redirect("index.html");
      });
    });
  }
  methods.endpoint = function() {
    return "https://9s7ggg2teb.execute-api.us-east-1.amazonaws.com/development";
  },
  methods.url = function() {
    return "https://memori.as";
  },
  methods.hasClass = function (el, selector) {
    var className = " " + selector + " ";
    if ((" " + el.className + " ").replace(/[\n\t\r]/g, " ").indexOf(className) > -1) {
      return true;
    }
    return false;
  },
  methods.showMessage = function(selector, _class, text) {
    var message = M.get(selector + " .message");

    if (message == null) {
      return;
    }
    message.classList.remove("is-danger", "is-success");
    message.classList.add(_class);
    message.style.display = "block";
    M.get(selector + " .message .message-body p").innerHTML = text;
  },
  methods.remove = function(selector) {
    var el = document.querySelector(selector);
    el.parentNode.removeChild(el);
  },

  methods.addClass = function(selector, _class, all = undefined){
   var el = this.get(selector);
   if (el === null) {
     return;
   }

   if (all !== undefined && all === true) {
     el = this.all(selector);
     if (el === null || el.length === 0) {
       return;
     }
     el.forEach((block) => {
       block.classList.add(_class);
     });
   } else {
     el.classList.add(_class);
   }
 },
  methods.removeClass = function(selector, _class, all = undefined){
   var el = this.get(selector);
   if (el === null || el === undefined) {
     return;
   }
   if (all !== undefined && all === true) {
     el = this.all(selector);
     if (el === null || el.length === 0) {
       return;
     }
     el.forEach((block) => {
       block.classList.remove(_class);
     });
   } else {
     el.classList.remove(_class);
   }
  },

  methods.pageloader = function(active){
    if (active == "on") {
      this.addClass(".pageloader", "is-active");
    } else {
      this.removeClass(".pageloader", "is-active");
    }
  },

  methods.storage = function(key, value) {
    if (value != undefined) {
      localStorage.setItem(key, value);
    }
    return localStorage.getItem(key);
  },
  methods.timer = function(status, label) {
    var t = new Date();

    if (label === undefined) {
      label = "";
    }

    // off
    if (status == "off") {
      t = new Date() - timings[label];
    }

    timings[label] = t;

    return t;
  },

  methods.log = function(key, message) {
    var padded = key.padEnd(16);
    if (message !== undefined) {
      console.log(" + " + padded + ": " + message);
    } else {
      console.log(padded);
    }
  },

  methods.themes = function() {
    var themes = [
      ["black", "darkgray", "lightgray", "whitesmoke", "white"],
      ["#eff3ff", "#bdd7e7", "#6baed6", "#3182bd", "#08519c"].reverse(),
      ["#feebe2", "#fbb4b9", "#f768a1", "#c51b8a", "#7a0177"].reverse(),
      ["#FEE440", "#ffee93", "#F8961E", "#540804", "#F94144"].reverse(),
      ["#edf8fb", "#b3cde3", "#8c96c6", "#8856a7", "#ff6000"].reverse()
    ];

    return themes;
  },

  methods.theme = function() {
    var index = M.storage("memori.as-m-theme");
    if (index == null) {
      index = 0;
    }
    var theme = this.themes()[index];
    for (var i = 0; i < theme.length; i++) {
      var color = theme[i];
      document.documentElement.style.setProperty("--color-" + i, color);
    }
  },

  methods.back = function() {
    this.theme();
    window.history.back();
  },
  methods.mouseOver = function(selector) {
    const element = M.get(selector);
    element.classList.add('animate__animated', 'animate__heartBeat');
  },
  methods.mouseLeave = function(selector) {
    const element = M.get(selector);
    element.classList.remove('animate__animated', 'animate__heartBeat');
  },
  methods.title = function(aio) {
    var title = "";
    if (aio.Title) {
      title = aio.Title.split(" #")[0];
    } else if (aio.title) {
      title = aio.title.split(" #")[0];
    }
    return title;
  },
  methods.tags = function(aio) {
    var tags = [];
    if (aio.Title) {
      tags = aio.Title.split(" #");
    }
    if (aio.title) {
      tags = aio.title.split(" #");
    }
    tags.shift();
    return tags;
  },
  methods.first = function(aio) {
    var param = aio.Elements[0].param;
    var parts = param.split("\n");

    aio.Elements[0].param = parts.join('<br>');
    return aio.Elements[0];
  },
  methods.second = function(aio) {
    if (aio.Elements.length > 1) {
      return aio.Elements[1];
    }
    return null;
  },

  methods.randomHex = function(size) {
    return [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
  },

  methods.display = function(selector, display) {
   var el = this.get(selector);
   if (el === null) {
     return;
   }

   el.style.display = display;
  }

 	// Expose the public methods
 	return methods;
 })();
