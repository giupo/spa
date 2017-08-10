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

var chat = require("./spa.chat");

var $ = require('jquery');
$.uriAnchor = require('urianchor');
var templates = require('./templates');

const log = require('logplease').create('shell');

var spa = {
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  configMap : {
    main_html : templates.main,
    anchor_schema_map : {
      chat : { open : true, closed : true }
    },
    chat_extend_time : 250,
    chat_retract_time : 300,
    chat_extend_height : 450,
    chat_retract_height : 15,
    chat_extended_title : 'Click to retract',
    chat_retracted_title : 'Click to extend'
  },

  stateMap: {
    $container : null,
    is_chat_retracted : true,
    anchor_map: {}
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
    log.debug( "called " + String(do_extend) );
    log.debug(spa.jqueryMap);
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


  // Begin DOM method /changeAnchorPart/
  // Purpose : Changes part of the URI anchor component
  // Arguments:
  // * arg_map - The map describing what part of the URI anchor
  // we want changed.
  // Returns : boolean
  // * true - the Anchor portion of the URI was update
  // * false - the Anchor portion of the URI could not be updated
  // Action :
  // The current anchor rep stored in stateMap.anchor_map.
  // See uriAnchor for a discussion of encoding.
  // This method
  // * Creates a copy of this map using copyAnchorMap().
  // * Modifies the key-values using arg_map.
  // * Manages the distinction between independent
  // and dependent values in the encoding.
  // * Attempts to change the URI using uriAnchor.
  // * Returns true on success, and false on failure.
  //

  changeAnchorPart: function ( arg_map ) {
    var anchor_map_revise = spa.copyAnchorMap(),
        bool_return = true,
        key_name, key_name_dep;
    // Begin merge changes into anchor map
    KEYVAL:
    for ( key_name in arg_map ) {
      log.debug("key_name: %s", key_name);
      if ( arg_map.hasOwnProperty( key_name ) ) {
        // skip dependent keys during iteration
        if ( key_name.indexOf( '_' ) === 0 ) { continue KEYVAL; }
        // update independent key value
        anchor_map_revise[key_name] = arg_map[key_name];
        // update matching dependent key
        key_name_dep = '_' + key_name;
        if ( arg_map[key_name_dep] ) {
          anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
        }
        else {
          delete anchor_map_revise[key_name_dep];
          delete anchor_map_revise['_s' + key_name_dep];
        }
      }
    }
    // End merge changes into anchor map
    // Begin attempt to update URI; revert if not successful
    try {
      $.uriAnchor.setAnchor( anchor_map_revise );
    }
    catch ( error ) {
      // replace URI with existing state
      log.error("Can't replace URI, recovering state, Cause: ", error);
      $.uriAnchor.setAnchor( spa.stateMap.anchor_map,null,true );
      bool_return = false;
    }
    // End attempt to update URI...
    return bool_return;
  },
  
  //--------------------- END DOM METHODS ----------------------

  //------------------- BEGIN EVENT HANDLERS -------------------

  // Begin Event handler /onHashchange/
  // Purpose : Handles the hashchange event
  // Arguments:
  // * event - jQuery event object.
  // Settings : none
  // Returns : false
  // Action :
  // * Parses the URI anchor component
  // * Compares proposed application state with current
  // * Adjust the application only where proposed state
  // differs from existing
  //
  onHashchange: function ( event ) {
    log.debug("called")
    var anchor_map_previous = spa.copyAnchorMap(),
        anchor_map_proposed,
        _s_chat_previous, _s_chat_proposed,
        s_chat_proposed;
    // attempt to parse anchor
    try {
      anchor_map_proposed = $.uriAnchor.makeAnchorMap();
    } catch ( error ) {
      log.error(error);
      $.uriAnchor.setAnchor( anchor_map_previous, null, true );
      return false;
    }

    spa.stateMap.anchor_map = anchor_map_proposed;
    // convenience vars
    _s_chat_previous = anchor_map_previous._s_chat;
    _s_chat_proposed = anchor_map_proposed._s_chat;
    // Begin adjust chat component if changed

    if ( ! anchor_map_previous || _s_chat_previous !== _s_chat_proposed) {
      s_chat_proposed = anchor_map_proposed.chat;
      switch ( s_chat_proposed ) {
      case 'open' :
        log.debug('opening chat...');
        spa.toggleChat( true );
        break;
      case 'closed' :
        log.debug('closing chat...');
        spa.toggleChat( false );
        break;
      default :
        log.debug('Dunno what to do, return to default state');
        spa.toggleChat( false );
        delete anchor_map_proposed.chat;
        $.uriAnchor.setAnchor( anchor_map_proposed, null, true );
      }
    }
    // End adjust chat component if changed
    return false;
  },
  
  onClickChat: function(event) {
    log.debug(this);
    spa.changeAnchorPart({
      chat: ( spa.stateMap.is_chat_retracted ? 'open' : 'closed' )
    });
    return false;
  },
  copyAnchorMap: function () {
    return $.extend( true, {}, spa.stateMap.anchor_map );
  },

  //-------------------- END EVENT HANDLERS --------------------


  //------------------- BEGIN PUBLIC METHODS -------------------
  // Begin Public method /initModule/
  initModule : function ( $container ) {
    log.debug($container);
    spa.stateMap.$container = $container;
    $container.html(spa.configMap.main_html);
    spa.setJqueryMap();
    spa.stateMap.is_chat_retracted = true;

    spa.jqueryMap.$chat
      .attr( 'title', spa.configMap.chat_retracted_title )
      .click( spa.onClickChat );

    $.uriAnchor.configModule({
      schema_map : spa.configMap.anchor_schema_map
    });

    // configure and initialize feature modules
    chat.configModule( {} );
    chat.initModule( spa.jqueryMap.$chat );
    
    $(window)
      .bind( 'hashchange', spa.onHashchange )
      .trigger( 'hashchange' );
  }
};

module.exports = spa;
