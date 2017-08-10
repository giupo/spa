"use-strict";

/*
* spa.js
* Root namespace module
*/

/*jslint browser : true, continue : true,
devel : true, indent : 2, maxerr : 50,
newcap : true, nomen : true, plusplus : true,
regexp : true, sloppy : true, vars : false,
white : true
*/

var $ = require('jquery');
var domready = require('domready');

var shell = require('./spa.shell');
var css = require('../css/spa.css');
var shell_css = require('../css/spa.shell.css');

const log = require('logplease').create('spa');

module.exports = {
  initModule: function ( $container ) {
    log.debug("spa - initModule");
    shell.initModule( $container );
  }
};

domready(function() {
  log.info("DOM is Ready, running App!");
  require('./spa').initModule( $('#spa') );
});
