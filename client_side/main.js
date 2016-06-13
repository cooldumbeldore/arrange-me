
hidden_to_clickable = {1:[2,4],
2:[1,3,5], 3: [2,6], 4: [1,5,7], 5: [2,4,6,8], 6: [3,5,9],
7:[4,8], 8:[5,7,9], 9: [6,8]} // TODO: automatic mapping

function check_win(){
	for(var i = 1 ; i < 9 ; i++){
		if($('#tile'+i).text() != i){
			$(".win-message").addClass("hidden");
			return;
		}
	}
	$(".win-message").removeClass("hidden");
}

function clear_all_on_clicks(){
	for(var i = 1 ; i <= 9 ; i++){
		$("#tile"+i).prop('onclick',null).off('click');
	}
}

function on_click_generator(tile, hidden_tile){
	return function(){
		clear_all_on_clicks()
		$("#tile"+hidden_tile).removeClass("hidden-tile")
		var temp_text = $('#tile'+hidden_tile).text()
		$('#tile'+hidden_tile).text($('#tile'+tile).text())


		$('#tile'+tile).addClass("hidden-tile")
		$('#tile'+tile).text(temp_text)

		generate_on_click(tile)
		check_win()
	}
}

function generate_on_click(hidden_tile){
	indexes = hidden_to_clickable[hidden_tile]
	for(var i = 0 ; i < indexes.length ; i++){
		$('#tile'+indexes[i]).click(on_click_generator(indexes[i], hidden_tile));
	}

}

function main(){
	$(".win-message").addClass("hidden");
	$('#tile'+9).addClass("hidden-tile")
	generate_on_click(9)
}

window.onload = function() {
    if (window.jQuery) {  
       	main()
    } else {
        alert("Error loading jQuery!");
    }
}
