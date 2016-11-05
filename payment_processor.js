var stripe = require("stripe")(
  "sk_test_BQokikJOvBiI2HlWgH4olfQ2"
);

this.pay = function(amount, payment_info){
	stripe.charges.create({
	  amount: amount,
	  currency: "gbp",
	  source: {
	  	cvc: payment_info.cvc,
	  	month_exp: payment_info.month_exp,
	  	year_exp: payment_info.year_exp,
	  	number: payment_info.card_num,
	  	object: "card"
	  },
	  description: "Charge for " + payment_info.name
	}, {
	  idempotency_key: "RZqa6tJYMQmvZ2By"
	}, function(err, charge) {
	  console.log("Payment complete")
	});	
}
