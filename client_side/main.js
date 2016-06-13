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

function swap_content(tile_index_1, tile_index_2){

	var tile_1_html = $('#tile'+tile_index_1).html();
    var tile_2_html = $('#tile'+tile_index_2).html();

    $('#tile'+tile_index_1).html(tile_2_html);
    $('#tile'+tile_index_2).html(tile_1_html);

	//var content_1 = $('#tile'+tile_index_1).find(".content").html()
	//$('#tile'+tile_index_1).find(".content").html($('#tile'+tile_index_2).find(".content").html())
	//$('#tile'+tile_index_2).find(".content").html(content_1)

}

function advance_move(tile_index, hidden_tile_index){
	$("#tile"+hidden_tile_index).removeClass("hidden-tile")

	swap_content(tile_index, hidden_tile_index)

	$('#tile'+tile_index).addClass("hidden-tile")
	generate_all_events(tile_index)

	global_hidden_tile_index = tile_index
	global_moves.unshift([tile_index, hidden_tile_index])
	update_move_counter()
}

function undo_move(tile_index, hidden_tile_index){
	$("#tile"+hidden_tile_index).addClass("hidden-tile")

	swap_content(tile_index, hidden_tile_index)

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
		
		clear_all_events();

		advance_move(tile_index, hidden_tile_index);

		rotate(tile_index);

		if (is_win()){
			handle_win();
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
	
	$('#table-div').append("<table></table>");

	$('#table-div table').attr("align", "center");
	$('#table-div table').attr("border", "5px");
	$('#table-div table').attr("bordercolor", "green");
	$('#table-div table').attr("width", "600px");
	$('#table-div table').attr("height", "600px");
	
	$('#table-div table').append('<tbody></tbody>');
	$('#table-div table tbody').css('position', 'static');

	for (var i = 1; i <= dim; i++){

		var tr = $("<tr></tr>").appendTo('#table-div table tbody');
		tr.css('position', 'static');

	    for (var j = 1; j <= dim; j++){
	    	tile_index = dim * i + j - dim;

	    	var td = $("<td></td>").appendTo(tr);
	    	td.attr('id', 'tile'+tile_index);
	    	td.addClass("tile");
	    	td.css('position', 'static');



	    	var content = $('<div></div>').appendTo(td);
	    	content.addClass("content");
	    	x_ratio = (i - 1) * 100.0 / (dim - 1);
	    	y_ratio = (j - 1) * 100.0 / (dim - 1);
	    	content.css('background-position', y_ratio+'% ' +x_ratio+'%');

	    	var span = $('<span>' +tile_index+ '</span>').appendTo(content);
	    	
	    	
	    }
	}

}


function rotate(tile_index){
	if(global_animation_flag){
		cls_name = "rotateIn"
		$('#tile'+tile_index).addClass("animated");
		//$('#tile'+tile_index).removeClass("infinite");
		$('#tile'+tile_index).addClass(cls_name);

		setTimeout(function(){
			$('#tile'+tile_index).removeClass("animated");
			//$('#tile'+tile_index).removeClass("infinite");
			$('#tile'+tile_index).removeClass(cls_name);
		}, 1000);
	}
}

function solve_board(){
	var goal_matrix = [];
	var current_state_matrix = [];
	var missing_col = null; 
	var missing_row = null;
	for(var i = 1; i <= global_dim; i++){
		goal_matrix.push([]);
		current_state_matrix.push([]);
		for(var j = 1; j <= global_dim; j++){
			var tile_index = global_dim * i + j - global_dim;
			goal_matrix[i - 1].push(tile_index);
			goal_matrix[i - 1][j -1] = goal_matrix[i - 1][j -1] == global_dim * global_dim ? 0 : goal_matrix[i - 1][j -1];

			current_state_matrix[i - 1].push(parseInt($("#tile"+tile_index).find("div").find("span").text()));
			if(current_state_matrix[i - 1][j -1] == global_dim * global_dim){
				current_state_matrix[i - 1][j -1] = 0;
				missing_col = j;
				missing_row = i;
			}
		}
	}

	var init = new Node(0, current_state_matrix, missing_row, missing_col, 0)
	var goal = new Node(0, goal_matrix , global_dim, global_dim, 0)

	var astar = new AStar(init, goal, 0)
	// To measure time taken by the algorithm
	var startTime = new Date()
	// Execute AStar
	var result = astar.execute()
	// To measure time taken by the algorithm
	var endTime = new Date()
	alert('Completed in: ' + (endTime - startTime) + ' milliseconds')


}

function setup(){
	missing_tile_index = global_dim * global_dim //parseInt(prompt("missing tile index:"))
	global_hidden_tile_index = missing_tile_index
	//build board
	generate_board(global_dim)

	// setup tiles
	$('#tile'+missing_tile_index).addClass("hidden-tile");
	generate_all_events(missing_tile_index);
}

function main(){
	// input params
	global_dim = parseInt(prompt("board dim:"))
	if(!(global_dim > 0 && global_dim <= 100)){
		alert("Not a valid dim choice!");
		return;
	}
	setup();

	// setup win message
	$(".win-message").addClass("hidden");

	//setup buttons
	$('#scramble-button').click(scramble_board);
	$('#undo-button').click(undo_last_move);
	$('#solve-button').click(solve_board);
}

window.onload = function() {
    if (window.jQuery) {  
       	main();
    } else {
        alert("Error loading jQuery!");
    }
}
