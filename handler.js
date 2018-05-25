'use strict';

const twilio = require('twilio');
const dig = require('node-dig');

function inbound(params) {
  console.log('inbound invoked with: ', params);

  //return new Promise( (resolve, reject) => {
    const response = new twilio.twiml.VoiceResponse();
    var block_call = false;

    // Check whether your account has Twilio add-ons enabled
    var addons = 'AddOns' in params && JSON.parse(params['AddOns']);
    if (addons && addons['status'] === 'successful') {
      const results = addOns['results'];

      // Block call if Nomorobo considers it as spam
      block_call = nomorobo_check( results['nomorobo_spamscore'] );

      const nomorobo_check = function(nomorobo) {
        if (!nomorobo || nomorobo['status'] !== 'successful') {
          return false;
        }
        return dig(nomorobo, ['results', 'score']) == 1;
      }
    }

    if (block_call) {
      // Reject call if it fails call screening
      response.reject();
    } else {
      // Forward the call to the Twilio SIP endpoint
      const dial = response.dial();
      dial.sip(params.twilio.endpoint);
    }
      
    // Return TwiML to the incoming call handler on Twilio
    console.log('inbound response: ', response.toString());
    return ({
      headers: { 'Content-Type': 'application/xml' },
      statusCode: 200,
      body: response.toString()
    });

  //});
} // inbound


function outbound (params) {
  console.log('outbound invoked with: ', params);
  const client = twilio(params.twilio.account, params.twilio.auth);

  const response = new twilio.twiml.VoiceResponse();

  const dial = response.dial({
    callerId: params.twilio.number
  });
  dial.number( params.To );

  // Return TwiML to the outgoing call handler on Twilio
  console.log('outbound response: ', response.toString());
  return({
    headers: { 'Content-Type': 'application/xml' },
    statusCode: 200,
    body: response.toString()
  });

} // outbound

exports.inbound = inbound;
exports.outbound = outbound;