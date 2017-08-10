"use strict";

/*
* spa.chat.js
* Chat feature module for SPA
*/
/*jslint browser : true, continue : true,
devel : true, indent : 2, maxerr : 50,
newcap : true, nomen : true, plusplus : true,
regexp : true, sloppy : true, vars : false,
white : true
*/
/*global $, spa */


var util = require("./spa.util");
var css = require("../css/spa.chat.css");
var templates = require("./templates");

var chat = {
  configMap: {
    main_html: templates.chat,
    settable_map : {}
  },
  
  stateMap: {
    $container : null
  },

  jqueryMap: {},

  //----------------- END MODULE SCOPE VARIABLES ---------------
  //------------------- BEGIN UTILITY METHODS ------------------
  //-------------------- END UTILITY METHODS -------------------
  //--------------------- BEGIN DOM METHODS --------------------
  // Begin DOM method /setJqueryMap/


  /**
   * Represents a book.
   * @constructor
   * @param {string} title - The title of the book.
   * @param {string} author - The author of the book.
   */
  
  setJqueryMap: function () {
    var $container = chat.stateMap.$container;
    chat.jqueryMap = { $container : $container };
  },

  // End DOM method /setJqueryMap/
  //---------------------- END DOM METHODS ---------------------
  //------------------- BEGIN EVENT HANDLERS -------------------
  //-------------------- END EVENT HANDLERS --------------------
  //------------------- BEGIN PUBLIC METHODS -------------------
  // Begin public method /configModule/
  // Purpose : Adjust configuration of allowed keys
  // Arguments : A map of settable keys and values
  // * color_name - color to use
  // Settings :
  // * configMap.settable_map declares allowed keys
  // Returns : true
  // Throws : none
  //
  configModule: function ( input_map ) {
    util.setConfigMap({
      input_map : input_map,
      settable_map : chat.configMap.settable_map,
      config_map : chat.configMap
    });
    return true;
  },
  // End public method /configModule/

  // Begin public method /initModule/
  // Purpose : Initializes module
  // Arguments :
  // * $container the jquery element used by this feature
  // Returns : true
  // Throws : none


  initModule: function ( $container ) {
    $container.html( chat.configMap.main_html );
    chat.stateMap.$container = $container;
    chat.setJqueryMap();
    return true;
  }
};

module.exports = chat;
