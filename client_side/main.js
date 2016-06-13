global_hidden_tile_index = null
global_clickables = null
global_dim = null
global_moves = []


function is_a_tile_index(tile_index){
	return tile_index > 0 && tile_index <= global_dim * global_dim;
}

function compute_clickables_around(hidden_tile_index){
	clickables = [];
	if (is_a_tile_index(hidden_tile_index - 1) && hidden_tile_index % global_dim != 1){
		clickables.push(hidden_tile_index - 1);
	}

	if (is_a_tile_index(hidden_tile_index + 1) && hidden_tile_index % global_dim != 0){
		clickables.push(hidden_tile_index + 1);
	}

	if (is_a_tile_index(hidden_tile_index + global_dim) && hidden_tile_index / (global_dim) <=  global_dim - 1){ 
		clickables.push(hidden_tile_index + global_dim);
	}

	if (is_a_tile_index(hidden_tile_index - global_dim) && hidden_tile_index / (global_dim + 1) > 0 ){
		clickables.push(hidden_tile_index - global_dim);
	}

	return clickables;
}

function compute_pressables_around(hidden_tile_index){
	pressables = {};
	if (is_a_tile_index(hidden_tile_index - 1) && hidden_tile_index % global_dim != 1){
		pressables["right"] = hidden_tile_index - 1;
	}

	if (is_a_tile_index(hidden_tile_index + 1) && hidden_tile_index % global_dim != 0){
		pressables["left"] = hidden_tile_index + 1;
	}

	if (is_a_tile_index(hidden_tile_index + global_dim) && hidden_tile_index / (global_dim) <=  global_dim - 1){ 
		pressables["up"] = hidden_tile_index + global_dim;
	}

	if (is_a_tile_index(hidden_tile_index - global_dim) && hidden_tile_index / (global_dim + 1) > 0 ){
		pressables["down"] = hidden_tile_index - global_dim;
	}

	return pressables;
}



function is_win(){
	for(var i = 1 ; i < global_dim * global_dim ; i++){
		if($('#tile'+i).find("span").text() != i){
			$(".win-message").addClass("hidden");
			return false;
		}
	}
	return true;
}

function handle_win(){
	$(".win-message").removeClass("hidden");
}

function clear_all_events(){
	for(var i = 1 ; i <= global_dim * global_dim ; i++){
		$("#tile"+i).prop('onclick',null).off('click');
	}
	$(document).prop("keydown",null).off("keydown");
}

function update_move_counter(){
	$("#move-counter").text("Move Count: " + global_moves.length)
}

function advance_move(tile_index, hidden_tile_index){
	$("#tile"+hidden_tile_index).removeClass("hidden-tile")

	var temp_text = $('#tile'+hidden_tile_index).find("span").text()
	$('#tile'+hidden_tile_index).find("span").text($('#tile'+tile_index).find("span").text())
	$('#tile'+tile_index).find("span").text(temp_text)

	$('#tile'+tile_index).addClass("hidden-tile")
	generate_all_events(tile_index)

	global_hidden_tile_index = tile_index
	global_moves.unshift([tile_index, hidden_tile_index])
	update_move_counter()
}

function undo_move(tile_index, hidden_tile_index){
	$("#tile"+hidden_tile_index).addClass("hidden-tile")

	var temp_text = $('#tile'+hidden_tile_index).find("span").text()
	$('#tile'+hidden_tile_index).find("span").text($('#tile'+tile_index).find("span").text())
	$('#tile'+tile_index).find("span").text(temp_text)

	$('#tile'+tile_index).removeClass("hidden-tile")
	generate_all_events(hidden_tile_index)

	global_hidden_tile_index = hidden_tile_index
	global_moves = global_moves.slice(1, global_moves.length)
	update_move_counter()

}

function undo_last_move(){
	last_move = global_moves[0]
	undo_move(last_move[0],last_move[1])
	
	generate_all_on_key_down3events()
}

function event_generator(tile_index, hidden_tile_index){
	return function(){
		clear_all_events()

		advance_move(tile_index, hidden_tile_index)

		if (is_win()){
			handle_win()
		}
	}
}

function generate_all_events(hidden_tile_index){
	generate_all_on_click_events(hidden_tile_index)
	generate_all_on_key_down_events(hidden_tile_index)
}

function generate_all_on_key_down_events(hidden_tile_index){
	pressable = compute_pressables_around(hidden_tile_index)
	$(document).keydown(function(e) {
	        var code = (e.keyCode ? e.keyCode : e.which);
	        if (code == 37){ // left arrow
	        	if (pressable["left"] != undefined){
	        		event_func = event_generator(pressable["left"], hidden_tile_index)
	        		event_func()
	        	}
	        } else if (code == 38) { //up arrow
	        	if (pressable["up"] != undefined){
	        		event_func = event_generator(pressable["up"], hidden_tile_index)
	        		event_func()
	        	}
	        } else if (code == 39) { //right arrow
	        	if (pressable["right"] != undefined){
	        		event_func = event_generator(pressable["right"], hidden_tile_index)
	        		event_func()
	        	}
	        } else if (code == 40) { //down arrow
	        	if (pressable["down"] != undefined){
	        		event_func = event_generator(pressable["down"], hidden_tile_index)
	        		event_func()
	        	}
	        }
	    });
}


function generate_all_on_click_events(hidden_tile_index){
	global_clickables = compute_clickables_around(hidden_tile_index)
	for(var i = 0 ; i < global_clickables.length ; i++){
		$('#tile'+global_clickables[i]).click(event_generator(global_clickables[i], hidden_tile_index));
	}

}

function random_from(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function scramble_board(){
	moves = 5 * global_dim * global_dim;
	for(var i = 0; i < moves; i++){
		tile_inbex = random_from(global_clickables);
		$("#tile"+tile_inbex).click();
	}
	global_moves = []
	update_move_counter()

}

function generate_board(dim){
	
	var table = document.createElement('table');
	table.setAttribute("align", "center");
	table.setAttribute("border", "5px");
	table.setAttribute("bordercolor", "green");
	table.setAttribute("width", "600px");
	table.setAttribute("height", "600px");

	//
	//  width="600px" height="600px">
	var tbody = document.createElement('tbody');
	for (var i = 1; i <= dim; i++){
	    var tr = document.createElement('tr');   

	    //clip: rect(0px,60px,200px,0px);
	    for (var j = 1; j <= dim; j++){
	    	td = document.createElement('td');
	    	tile_index = dim*i + j - dim
	    	td.setAttribute("id", "tile"+tile_index);
	    	td.setAttribute("class", "tile");
	    	span = document.createElement('span');
	    	span.appendChild(document.createTextNode(tile_index));
	    	td.appendChild(span);
	    	tr.appendChild(td)
	    }
	    tbody.appendChild(tr);
	}
	
	table.appendChild(tbody);
	var table_div = document.getElementById('table-div');
	table_div.appendChild(table);
	//document.body.appendChild(table);

	document.getElementById('tile1').style.clip = "rect(5px, 75px, 75px, 0px)";

}


function main(){
	// input params
	global_dim = parseInt(prompt("board dim:"))
	missing_tile_index = global_dim * global_dim //parseInt(prompt("missing tile index:"))
	global_hidden_tile_index = missing_tile_index
	//build board
	generate_board(global_dim)

	// setup tiles
	$('#tile'+missing_tile_index).addClass("hidden-tile");
	generate_all_events(missing_tile_index);

	// setup win message
	$(".win-message").addClass("hidden");

	//setup scramble button
	$('#scramble-button').click(scramble_board);
	$('#undo-button').click(undo_last_move);
}

window.onload = function() {
    if (window.jQuery) {  
       	main();
    } else {
        alert("Error loading jQuery!");
    }
}
