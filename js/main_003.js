//Checando a versão do IE 
if (document.all && !document.querySelector) { // IE7 or lower
    alert('Versão antiga do IE.');
}

$(function() {
    var showSection = function(e) {
        e.preventDefault();
        
        // Expande o menu selecionado para cobrir toda tela.
        var height = $(document).height(),
            width = $(document).width(),        
            scale = Math.round(((width > height) ? width : height)/220) + 1;
        $(this).parent().addClass('selected').attr('style', '-webkit-transform:scale(' + scale + ');');
        
        // Mostra a seção correspondente ao menu selecionado.
        var $section = $('section.main').eq($('#summary').find('li').index($(this).parent())).addClass('selected');


	   //Adicionando logo da numera à página quando alguma seção for selecionada
	   var div = $('<div id= "upperLogo"/>');		
	   div.appendTo('body');
	   div.css({"position":"absolute","top": "10px", "left": "5%", "height":"55px", "width":"250px", "background":"url('./img/menu.png') no-repeat 50% -195px", "background-size":"370px 505px"}); 
        
        // Se houver subseções, prepara paginação delas e deixa visĩvel a primeira
        var $wrapper = $section.find('.wrapper'),
            $subsection = $wrapper.find('.subsection'),
            numberOfSubsections = $subsection.length;
        if (numberOfSubsections > 0) {
            var indicator = '';
            for (var i = 0; i < numberOfSubsections; i++) {
                if (i == 0) indicator = '<div class="selected"></div>';
                else indicator += '<div></div>';
            }
            
            var $indicator = $(indicator),
                index = 0,                
                subsectionWidth = $subsection.eq(0).width(),
                subsectionPadding = 150;
            var changePage = function(step) {
                var module = ($wrapper.scrollLeft() - subsectionPadding) % subsectionWidth,
                    duration = 500;
                if (module) {
                    if (step > 0) duration = (subsectionWidth - module) * (500/subsectionWidth);
                    else duration = module * (500/subsectionWidth);
                }
              //  $('footer span').html(duration + ' | ' + module + ' | ' + $wrapper.scrollLeft());
                if (index + step > -1 && index + step < numberOfSubsections) index += step;
                $wrapper.animate({scrollLeft: (subsectionWidth * index) + subsectionPadding}, duration);

                $indicator.removeClass().eq(index).addClass("selected");
            };
            
            var changeSection = function() {
                if (this.id == 'subsection_back') changePage(-1);
                else changePage(1);
            };
            
            $wrapper.find('.content').width((subsectionWidth * numberOfSubsections) + (2 * subsectionPadding)).end().scrollLeft(subsectionPadding);
            $('#subsection_indicator').html($indicator);
            $('#subsection_navigation').addClass('selected');
            $('#subsection_back').click(changeSection);
            $('#subsection_next').click(changeSection);
            
            var scrolling = false,
                scrollStartX = 0;
            $wrapper.on('touchstart', function(e) {
               e.preventDefault();
                var scrollLeft = $wrapper.scrollLeft(),
                    prevPageX = scrollStartX = e.originalEvent.touches[0].pageX;
                scrolling = true;
                $wrapper.on('touchmove', function(e) {
                    var pageX = e.originalEvent.touches[0].pageX;
                    scrollLeft -= pageX - prevPageX;
                    prevPageX = pageX;
                    $wrapper.scrollLeft(scrollLeft);
                });
            });
            $(window).on('touchend', function(e) {
                e.preventDefault();
                if (scrolling) {
                    var offset = e.originalEvent.changedTouches[0].pageX - scrollStartX,
                        step = 0;
                    if (offset > subsectionPadding || offset < -subsectionPadding) {
                        step = -1 * parseInt(offset/subsectionWidth);
                        step = (offset > 0) ? step - 1 : step + 1;
                    }
                    changePage(step);
                    scrolling = false;
                    $wrapper.off('touchmove');
                }
            });
        }
    };
    
    var hideSection = function(e) {
        e.preventDefault();
        $('#summary').find('li.selected').removeClass('selected').removeAttr('style');
        $('section.main').filter('.selected').removeClass('selected').find('.wrapper').scrollLeft(0).off();
        $('#subsection_navigation').removeClass('selected');
        $('#subsection_indicator').html('');
        $('#subsection_back').off();
        $('#subsection_next').off();
        $(window).off('touchend');
	  
	   //remove img
	   $('#upperLogo').remove();
    };
    
    $('nav').find('a').click(showSection);
    $('.back').click(hideSection);
});

