import unirest from "unirest";

//var req = unirest("GET", "https://www.fast2sms.com/dev/bulkV2");

// req.query({
//   "authorization": "10IAGVJHRKpN8eEo6uyg7lQrxZ4vkLdBTfamzDnW9sYFcwMU2CETMFjwnL0cCQyhJagklbRVAvzWIUNG",
//   "variables_values": "5599",
//   "route": "otp",
//   "numbers": "9920197525"
// });

// req.headers({
//   "cache-control": "no-cache"
// });


// req.end(function (res) {
//   if (res.error) throw new Error(res.error);

//   console.log(res.body);
// });

// var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

// req.headers({
//   "authorization": "10IAGVJHRKpN8eEo6uyg7lQrxZ4vkLdBTfamzDnW9sYFcwMU2CETMFjwnL0cCQyhJagklbRVAvzWIUNG"
// });

// req.form({
//   "variables_values": "1975",
//   "route": "otp",
//   "numbers": "9920197525, 7058197525",
// });

// req.end(function (res) {
//   if (res.error) throw new Error(res.error);

//   console.log(res.body);
// });

// req.query({
//   "authorization": "10IAGVJHRKpN8eEo6uyg7lQrxZ4vkLdBTfamzDnW9sYFcwMU2CETMFjwnL0cCQyhJagklbRVAvzWIUNG",
//   "sender_id": "IDMS",
//   "message": "A Sales Order has been booked.\nBelow are the details:",
//   "route": "v3",
//   "numbers": "9920197525"
// });

// req.headers({
//   "cache-control": "no-cache"
// });


// req.end(function (res) {
//   if (res.error) throw new Error(res.error);

//   console.log(res.body);
// });

var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

req.headers({
  "authorization": "10IAGVJHRKpN8eEo6uyg7lQrxZ4vkLdBTfamzDnW9sYFcwMU2CETMFjwnL0cCQyhJagklbRVAvzWIUNG"
});

req.form({
  "sender_id": "IDMS",
  "message": "Congratulations!! A Sales Order has been booked.\nBelow are the details:",
  "route": "v3",
  "numbers": "9920197525",
});

req.end(function (res) {
  if (res.error) throw new Error(res.error);

  console.log(res.body);
});
