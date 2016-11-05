apn = require('apn'); 
gcm = require('node-gcm-service');

this.send_push_notification = function(device_id, message){
	var apnDevice = new apn.Device(device_id);
	 
	var apnNotification = new apn.Notification();
	apnNotification.alert = message;
	apnNotification.badge = 10;
	apnNotification.contentAvailable = true;
	 
	apnConnection.pushNotification(apnNotification, apnDevice);
}