// [{'entry', time: '100', location: 1}, {'exit', time: '101', location: 1}, {'enter', time: '102', location: 2}]
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
			cur.push(current_item)
		} else if(cur.length > 0 && all_travels[curIndex].status == 'enter'){
			var current_item = all_travels[curIndex]

			while(curIndex < all_travels.length 
					&& all_travels[curIndex].location_id == current_item.location_id){
				curIndex++;
			}

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
	return result;
}