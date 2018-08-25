"use strict";
const axios = require( "axios" );

// Defaults if init() never called
let throwErrors = true;
let apiAddress = "";
let baseData = {};

function init( isThrow = true, apiAddressToSet = "", data = {} ) {
  throwErrors = isThrow;
  apiAddress = apiAddressToSet;
  baseData = data;
}

function createData( error, base, data ) {
  const errorData = {
    msg: error.message,
    stack: error.stack,
  }
  return Object.assign( base, errorData, data );
}

function sendRequest( address, data ) {
  return axios.post( address, data );
}

function throwError( error ) {
  process.stderr.write( error );
}

async function error( msg, data, isExit ) {
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
  error,
  init,
}

