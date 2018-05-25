#  twilio-openwhisk-voice 
##  OpenWhisk functions to handle inbound/outbound Twilio voice calls 
#####  25 May 2018 - warrenf

This Node application provides two webhooks for Twilio incoming and outgoing voice call requests. The functions parse the request, and returns a TwiML response message. 

```
  PTSN network  --->  Twilio number  --->  Twilio SIP endpoint
```

The _inbound_ function accepts an incoming voice call request at a Twilio phone number. If you have the Nomorobo add-in installed, the function checks the spam score of the caller. The function rejects the call if it is spam; otherwise, it forwards the call to an endpoint on a SIP domain.

```
  PTSN network  <--- Twilio number <--- Twilio SIP endpoint
```

The _outbound_ function accepts an outgoing voice call request at a Twilio SIP endpoint. The function sets the caller ID to your purchased Twilio number. It returns a `<dial>` request to the number in the `To` field of the request.

### Pre-requisites
1. A Twilio account with:
   1. A purchased phone number;
   2. A configured SIP domain with an endpoint;
   3. (Optional) The Nomorobo add-in installed with the default name.
2. An SIP client that is connected to the Twilio SIP endpoint

### Installation
To build and run your own copy of the `twilio-openwhisk-voice` application:

1. Log into an OpenWhisk provider, such as IBM Cloud.
1. Run `npm install`.
2. Run `serverless deploy`.
3. Copy down the function endpoint addresses for the _inbound_ and _outbound_ functions.

1. Log into the [Twilio console](https://twilio.com).
2. In your purchased number settings, set the **voice** request handler to the OpenWhisk _inbound_ function.
3. In your SIP domains, set the endpoint request handler to the OpenWhisk _outbound_ function.
