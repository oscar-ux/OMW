/*
* @requires jQuery v1.11.1 or later
* @author Oscar Flores <oscar.uix@gmail.com>
*/

$(function() {
	$.each(datajs.user_info, function(i,data){
    	$('#user_name').append(data.name);
    	$('#curr_time').append(data.curr_time);
    	$('#last_time').append(data.last_time);  
    });

	$('#m_m a').click(function(e){
		e.preventDefault();
		var _target = $(this).parent().attr('id');
		var _prev = 'header';
		menu(_target,_prev,'audience');
        console.log(e.target);
	});

	$('#s_m a').click(function(e){
		e.preventDefault();
		var _target = $(this).parent().attr('id');
		var _prev = '#s_m';
		menu(_target,_prev,'omad');
	});

    $('#s_s_m a').click(function(e){
        e.preventDefault();
        var _target = $(this).parent().attr('id');
        var _prev = '#s_w';
        menu(_target,_prev,'iab_cat');
                console.log(_target);
    });

    $(document).on( 'click', 'input[id^="cb"]', function() {
    	var _cb = $(this).attr('id');
    	var _col1 = $(this).parent().attr('data');
    	var _blocks = $('[type="checkbox"]:checked').length;
    	selected(_cb);
    	/*create blocks*/
    	$('#b').fadeIn();
    	if($('#block_'+_cb).length == 0){//create block if doesn't exist
    		if(_blocks > 1){//insert dropdown menu if it's not the first one
    			$('#b').append('<label class="csb"><select><option>And</option><option>Or</option></select></label>');
    		}
    		if(_blocks == 0){//hide div if we have zero blocks
    			$('#b').fadeOut();
    		}
    		$('#b').append('<div id="block_'+_cb+'">'+_col1+' <span class="close"></span></div>');
    	}else{//remove blocks
    		removeBlocks(_cb);
    	};
    });

    $('#reset').click(function(){
    	unCheckAll();
    });

   $(document).on( 'click', 'span.close', function() {
   		var _curr_block = $(this).parent().attr('id');
   		var _cb = _curr_block.substr(6);
   		$('#'+_cb).prop('checked', false);
   		removeBlocks(_cb);
   		selected(_cb);
	});

    function menu(target,prev,elem){
        $('#'+target).parent().find('a.selected').removeClass('selected');
        $('#'+target+' > a').addClass('selected');
        var disp = (target == elem) ? $(prev).next().fadeIn() : $(prev).next().fadeOut();
    }

    function unCheckAll(){
	    $('[type="checkbox"]:checked').prop('checked', false);
	    $('[id^="block"]').remove();
	    $('.csb').remove();
	    $('tbody td').removeClass('cb-cl');
	    $('#b').fadeOut();
	    $('#calc_mu span, #calc_omw span').html(0);
    }

    function removeBlocks(_cb){
        console.log($('[id^="block_"]').length);
    	if($('[id^="block_"]').length == 1){
            $('#b').fadeOut();
        }
        if($('#block_'+_cb).prev('.csb')){//remove dropdown menu
    		$('#block_'+_cb).prev('.csb').remove();
    	}
    	if($('#block_'+_cb).is(':nth-child(2)')){//remove dropdown menu if it's the first block
    		$('#block_'+_cb).next().remove();
    	}
    	$('#block_'+_cb).remove();
    }
    
    function selected(_cb){
    	$('#'+_cb).parent().parent().find('td').toggleClass('cb-cl');
    }
	var _mu,_omw;
    $('#calc').click(function(){
    	_omw=0;
    	_mu=0;
    	calc_mu();
    	calc_omw();
    });

    /* Sum OMV values */
    function calc_mu(target){
    	var obj = $('[type="checkbox"]:checked').parent().next().attr('data');
    	$('[type="checkbox"]:checked').each(function(i) {
			_mu += Number(obj);
		});
		$('#calc_mu span').html(_mu.toLocaleString());
    }

    /* Sum OMV values */
    function calc_omw(target){
    	var obj = $('[type="checkbox"]:checked').parent().next().next().attr('data');
    	$('[type="checkbox"]:checked').each(function(i) {
			_omw += Number(obj);
		});
		$('#calc_omw span').html(_omw.toLocaleString());
    }
    $('a').click(function(e){
        e.preventDefault();
    });


    //Object to creat Tables
    function createTable (_id, _scroll, _height, _width) {
        this.id = '#'+_id; // ID element where it will be created.
        this.data; //path from json file
        this.cols = []; //if empty, no header for columns will be displayed.
        this.width = _width || '100%'; //table width. 100% is set to default.
        this.scroll = _scroll || false; //activate|deactivate scroll. False is the default one.
        this.height = _height || '300px'; //table height when scroll is activated. 300px is default
        this.style = 'table_default'; //Sets the CSS class of the table in case there is more than one.
    }


    createTable.prototype = {
        constructor: createTable,
        initTable:function ()  {
            var th_count = this.cols.length;
            if(this.scroll) $(this.id).height(this.height);
            if(this.width) $(this.id).width(this.width);
            $(this.id).append('<table id="iab_cts"></table>');
            if (th_count > 0) this.creatTheads(this.id);
            this.createTbody(this.id);
        },
        creatTheads:function(table_wrap){
            var theads = this.cols; 
            $(table_wrap).before('<div class="thead"></div>')
            if(this.width) $(this.id).prev().width(this.width);
            for(var i in theads){
                $(table_wrap).prev().append('<div style="display:inline-table;">'+theads[i]+'</div>');
            }
        },
        createTbody:function(table_wrap){
            $(table_wrap + ' > table').append('<tbody></tbody>')
            $.each(this.data, function(i,data){
                $(table_wrap + ' tbody').append('<tr id="tr_'+i+'"></tr>');
                console.log('**'+i);
                var newData = data;
                for(j in newData){
                    if(j == 'category'){
                        //if property == 'category', a checkbox is added.
                        $(table_wrap + ' #tr_'+i).append('<td data="'+ newData[j] +'"><input type="checkbox" id="cb'+Number(i+1)+'" /><label for="cb'+Number(i+1)+'">'+newData[j]+'</label></td>');
                    }else{
                        $(table_wrap + ' #tr_'+i).append('<td data="'+ newData[j] +'">'+ newData[j] +'</td>');
                        console.log(j+"--");
                    }
                }
            });

        }
    }

    //Create IAB TABLE
    var iab_table = new createTable('wrap_tb', true,'252px'); //252px, in order to display teh first 10.5 rows
    iab_table.cols = ['IAB Categories','My Uniques', 'Opera Mediaworks Uniques']; //This will set the Title of the columns
    iab_table.data = datajs.iab_categories; //Data from JSON file
    iab_table.initTable();

    //MouseWheel 
    var mouseWheelEvent=(/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";
    var wrapHeight = $('#wrap_tb').height();
    var tableHeight = $('#wrap_tb table').height();
    var trHeight = $('#wrap_tb tr').height();
    var translateTo = wrapHeight - tableHeight;
    var dragTo = (wrapHeight / 2) - (trHeight/2);

    $(document).on( mouseWheelEvent, '#wrap_tb', function(e) {
        if(e.originalEvent.wheelDelta/120 > 0 && last_move < 0) {
            last_move += trHeight / 5;
            $('#iab_cts').animate({ 'marginTop': last_move+'px'}, 10);
            console.log(last_move);
        }
        else{
            if(last_move > translateTo){
                last_move -= trHeight / 5;
                $('#iab_cts').animate({ 'marginTop': last_move+'px'}, 10)
                console.log(last_move);
            }
        }
    });
    //End MouseWheel

    //Click and Drag
    $(document).on( 'mousedown', '#wrap_tb', touchStart);
    $(document).on( 'mousemove', '#wrap_tb', touchMove);
    $(document).on( 'mouseup', '#wrap_tb', touchEnd);
            
    function touchStart(e) {
        startX = endX = e.pageX;
        startY = endY = e.pageY;
    }
    function touchMove(e) {
        endX = e.pageX;
        endY = e.pageY;
    }
            
    var last_move = 0;
    function touchEnd(e) {  
        var move = startY - endY;
        if(move > 0 && !(last_move < translateTo)){
            last_move -= dragTo;
            $('#iab_cts').animate({ 'marginTop': last_move+'px'}, 500);
        }else if(move < 0 && last_move < 0){
            last_move += dragTo;
            $('#iab_cts').animate({ 'marginTop': last_move+'px'}, 500);
        }
        if (last_move > 0){
            last_move = 0;
            $('#iab_cts').animate({ 'marginTop':'0px'}, 500);
        }
        if (last_move < translateTo){
            last_move = translateTo;
            $('#iab_cts').animate({ 'marginTop':translateTo+'px'}, 500);
        }
    }
    //End Click and Drag
});



