"use-strict";

/*
 * spa.shell.js
 * Shell module for SPA
 */
/*jslint browser : true, continue : true,
  devel : true, indent : 2, maxerr : 50,
  newcap : true, nomen : true, plusplus : true,
  regexp : true, sloppy : true, vars : false,
  white : true
*/

var $ = require('jquery');
$.uriAnchor = require('urianchor');
var templates = require('./templates');

let conf = {
  filters: {
    debug: 'Gray',
    info: 'Black',
    notice: 'Green',
    warning: 'Blue',
    error: 'Red',
    critical: 'Orange',
    alert: 'Cyan',
    emergency: 'Magenta'
  }
};

let log = require('js-logging').console(conf);

var spa = {
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  configMap : {
    main_html : templates.main,
    chat_extend_time : 250,
    chat_retract_time : 300,
    chat_extend_height : 450,
    chat_retract_height : 15,
    chat_extended_title : 'Click to retract',
    chat_retracted_title : 'Click to extend'
  },

  stateMap: {
    $container : null,
    is_chat_retracted : true
  },

  jqueryMap: {},
  
  //----------------- END MODULE SCOPE VARIABLES ---------------
  //-------------------- BEGIN UTILITY METHODS -----------------
  //--------------------- END UTILITY METHODS ------------------
  //--------------------- BEGIN DOM METHODS --------------------

  // Begin DOM method /setJqueryMap/

  setJqueryMap : function () {
    var $container = spa.stateMap.$container;
    this.jqueryMap = {
      $container : $container,
      $chat : $container.find('.spa-shell-chat')
    };
  },
  
  // End DOM method /setJqueryMap/

  extendChat: function (callback) {
    spa.jqueryMap.$chat.attr(
      'title', spa.configMap.chat_extended_title
    );
    spa.stateMap.is_chat_retracted = false;
    spa.jqueryMap.$chat.animate(
      { height: spa.configMap.chat_extend_height },
      spa.configMap.chat_extend_time,
      function() {
        if ( callback ) {
          callback ( spa.jqueryMap.$chat );
        }
      });
    return true;
  },

  retractChat: function (callback) {
    spa.jqueryMap.$chat.attr(
      'title', spa.configMap.chat_retracted_title
    );
    spa.stateMap.is_chat_retracted = true;
    spa.jqueryMap.$chat.animate(
      { height : spa.configMap.chat_retract_height },
      spa.configMap.chat_retract_time,
      function () {
        if ( callback ){ callback( spa.jqueryMap.$chat ); }
      });
    return true;
  },
  
  toggleChat: function(do_extend, callback) {
    log.info( "called " + String(do_extend) );
    log.info(spa.jqueryMap);
    var px_chat_ht = spa.jqueryMap.$chat.height(),
    is_open = px_chat_ht === spa.configMap.chat_extend_height,
    is_closed = px_chat_ht === spa.configMap.chat_retract_height,
    is_sliding = ! is_open && ! is_closed;

    if ( is_sliding ) {
      return false;
    }

    if (do_extend) {
      return spa.extendChat(callback);
    } else {
      return spa.retractChat(callback);
    }
  },
  //--------------------- END DOM METHODS ----------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  onClickChat: function(event) {
    if ( spa.toggleChat( spa.stateMap.is_chat_retracted ) ) {
      $.uriAnchor.setAnchor({
        chat : ( spa.stateMap.is_chat_retracted ? 'closed' : 'open' )
      });
    }
    
    return false;
  },

  copyAnchorMap: function () {
    return $.extend( true, {}, spa.stateMap.anchor_map );
  },

  //-------------------- END EVENT HANDLERS --------------------


  //------------------- BEGIN PUBLIC METHODS -------------------
  // Begin Public method /initModule/
  initModule : function ( $container ) {
    log.info($container);
    spa.stateMap.$container = $container;
    $container.html(spa.configMap.main_html);
    spa.setJqueryMap();
    spa.stateMap.is_chat_retracted = true;
    spa.jqueryMap.$chat
      .attr( 'title', spa.configMap.chat_retracted_title )
      .click( spa.onClickChat );
  }
};

module.exports = spa;
