this.partition_journey = function(all_travels){
	var result = []
	var cur = []
	var curIndex = 0
	while(curIndex < all_travels.length){
		if(cur.length == 0){
			var current_item = all_travels[curIndex]
			// disregard any futher mentions of same location
			while(curIndex < all_travels.length 
					&& all_travels[curIndex].location_id == current_item.location_id){
				curIndex++;
			}
			// if the last mention is not an exit, visit location
			if(all_travels[curIndex-1].status == 'enter'){
				cur.push(current_item)
			}
		} else if(cur.length > 0 && all_travels[curIndex].status == 'enter' 
					&& routeExists(all_travels[curIndex], cur[cur.length-1])){
			var current_item = all_travels[curIndex]

			while(curIndex < all_travels.length 
					&& all_travels[curIndex].location_id == current_item.location_id){
				curIndex++;
			}

			// if the last mention is not an exit, visit location
			if(all_travels[curIndex-1].status == 'enter'){
				var date1 = new Date(cur[cur.length-1].timestamp)
				var date2 = new Date(current_item.timestamp)

				var difference = date1.getTime() - date2.getTime()	
				var minutesDifference = Math.floor(difference/1000/60);

				if(minutesDifference > 30){
					result.push([cur[0], cur[cur.length-1]])
					cur = []
				} else{
					cur.push(current_item)
				}
			}
		}
	}
	return result;
}