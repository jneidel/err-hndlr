"use strict";
const axios = require( "axios" );
const chalk = require("chalk");

// Defaults if init() never called
let throwErrors = true;
let apiAddress = "";
let baseData = {};

function init( isThrow = true, apiAddressToSet = "", data = {}, options = {} ) {
  throwErrors = isThrow;
  apiAddress = apiAddressToSet;
  baseData = data;
  handleOptions( options );
}

function handleOptions( options ) {
  function handleApp( pkg ) {
    const data = {};

    if ( pkg.name )
      data.name = pkg.name
    if ( pkg.version )
      data.version = pkg.version

    if ( Object.keys( data ).length > 0 )
      baseData = Object.assign( baseData, { app: data } );
  }

  function handleOs() {
    const os = require("os");

    baseData = Object.assign( baseData, { os: {
      type: os.type(),
      platform: os.platform(),
    } } );
  }

  if ( options.app )
    handleApp( options.app );
  if ( options.os )
    handleOs();
}

function createData( error, base, data ) {
  const errorData = {
    msg: error.message,
    stack: error.stack,
  }
  return Object.assign( base, { error: errorData }, data );
}

function sendRequest( address, data ) {
  return axios.post( address, data );
}

function throwError( error ) {
  process.stderr.write( `${chalk.red(error.stack)}\n` );
}

async function throwFunc( msg = "", data = {}, isExit = false ) {
  const error = new Error( msg );

  if ( throwErrors ) {
    throwError( error );
  } else {
    const reqData = createData( error, baseData, data );
    await sendRequest( apiAddress, reqData );
  }

  if ( isExit ) process.exit(); 
}

module.exports = {
  throw: throwFunc,
  init,
}

