$(document).ready(function(){
    $("body").on('click', '.icon-dot-3', function(){
        var button = $(this),
            sharePopup = button.next(".share");
        if (sharePopup.not(".visible")) {
            sharePopup.addClass('visible');
            button.addClass('opacity');
        }
        $(document).on('click', function(e){
            if ( $(e.target).closest(button).length === 0 ) {
                if (sharePopup.hasClass("visible")) {
                    sharePopup.removeClass("visible");
                    button.removeClass('opacity');
                }
            }
        });
    });
});
$(document).ready(function(){          
    $("body").on("click", ".photoset img", function(e){
        e.preventDefault();        
        var images = $(this).parents(".photoset").find("img"),
            imagesLength = images.length,
            lightboxWidth = imagesLength * 100,
            itemWidth = 100 / imagesLength;
        //creating lightbox div
        $("body").append("<div id='lightbox' style='width: "+lightboxWidth+"%;'><div class='lightbox-prev'></div><div class='lightbox-next'></div><div class='lightbox-inner'></div></div>");
        var lightboxInner = $(".lightbox-inner");
        
        //inserting images and captions to lightbox div             
        for (i=0; i < imagesLength; i++){   
            var image = $(images[i]),
                imageSrc = image.attr("src"),
                caption = image.parent().find(".photoset-caption-wrap").html();
            if(caption){
                lightboxInner.append("<div class='lightbox-item' style='width: "+itemWidth+"%;'><img src='"+imageSrc+"'><figcaption class='lightbox-caption'>"+caption+"</figcaption></div>");          
            } else{
                lightboxInner.append("<div class='lightbox-item' style='width: "+itemWidth+"%;'><img src='"+imageSrc+"'></div>");
            };                  
        };
        
        //positioning lightbox with clicked image in middle
        var imageIndex = $.inArray(this, images),
            itemPosition = itemWidth * imageIndex;
        lightboxInner.css("transform", "translateX(-"+itemPosition+"%)");
        
        //adding padding to images with caption
        var lightboxCaptions = $(".lightbox-caption"),
            captionLength = lightboxCaptions.length;                        
        for (i=0; i<captionLength; i++){    
            var lightboxCaption = $(lightboxCaptions[i]),
                captionImage = lightboxCaption.parent().find("img"),
                captionHeight = lightboxCaption.outerHeight();
            captionImage.css("padding-bottom", ""+captionHeight+"px");
        }                                   
        
        //variables for next/prev navigation
        var buttonNext = $(".lightbox-next"),
            buttonPrev = $(".lightbox-prev"),
            curentIndex = imageIndex;                       
        
        //hiding next/prev buttons if slide is first or last
        if (curentIndex+1 == imagesLength){             
            buttonNext.css("display", "none");
        };
        if (curentIndex === 0){
            buttonPrev.css("display", "none");
        };  
        
        //clicking next button
        $(buttonNext).on('click', function(){           
            var nextIndex = curentIndex+1,
                nextPosition = nextIndex * itemWidth;
            lightboxInner.css("transform", "translateX(-"+nextPosition+"%)");
            curentIndex++;
            nextIndex++;
            if (curentIndex > 0){
                buttonPrev.css("display", "block");
            };  
            if(nextIndex == imagesLength){  
                buttonNext.css("display", "none");
            };  
        });
        
        //clicking prev button
        $(buttonPrev).on('click', function(){           
            var prevIndex = curentIndex-1,
                prevPosition = prevIndex * itemWidth;
            lightboxInner.css("transform", "translateX(-"+prevPosition+"%)");
            curentIndex--;
            prevIndex--;
            if (curentIndex === 0){
                buttonPrev.css("display", "none");
            };  
            if(prevIndex < imagesLength){   
                buttonNext.css("display", "block");
            };  
        });
    
        //closing lightbox
        var lightbox = $("#lightbox"),
            items = $(".lightbox-item img, .lightbox-caption, .lightbox-prev, .lightbox-next");
        $(document).on('click', "#lightbox", function(e){
            if ( $(e.target).closest(items).length === 0 ) {
                lightbox.remove();
            };
        });
    });    
});
function photoset(){
    $(".photoset:not(.custom-set)").each(function(){
        var photoset = $(this),
            figure = photoset.find(".photoset-photo"),
            parent = photoset.find(".photo-link"),
            images = photoset.find("img"),
            layout = photoset.attr('data-layout').toString().split(''),
            photosLength = images.length,
            rowsLength = layout.length;
        photoset.addClass('custom-set');
        array = [];
        $.each(layout, function(index){
            var count = this[0]; 
            for(i=0; i<count; i++){
                array.push({k:count, v:index});
            }; 
        });
        for(i=0; i<photosLength; i++){
            $(figure[i]).addClass('size-'+array[i].k+' line-'+array[i].v+'');
        };
        for(i=0; i<rowsLength; i++){
           photoset.find(".line-"+[i]+"").wrapAll('<div class="photoset-row row-'+[i]+'"/>');
        };
        $.each(parent, function() {
            var src = $(this).find('img').attr("src");
            $(this).css("background-image", "url("+src+")");
        });
        $.each(images, function(){
            var src = $(this).attr('src');
            $(this).attr('src', '');
            $(this).attr('src', src);
        });
        images.load(function(){
            var photosetRow = photoset.find(".photoset-row");
            $.each(photosetRow, function(){
                var rowImages = $(this).find("img"),
                    minHeight = Math.min.apply(null, rowImages.map(function () {
                        return $(this).height();
                    }).get()),
                    imageWidth = $(this).find(".photoset-photo a")[0].getBoundingClientRect().width,
                    ratio = minHeight / imageWidth * 100;
                rowImages.parent().css("padding-bottom", ""+ratio+"%");
            });
            photoset.removeClass("no_js");
        });
    });
};
/*jshint browser:true */
/*!
* FitVids 1.1
*
* Copyright 2013, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
* Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
*/

;(function( $ ){

  'use strict';

  $.fn.fitVids = function( options ) {
    var settings = {
      customSelector: null,
      ignore: null
    };

    if(!document.getElementById('fit-vids-style')) {
      // appendStyles: https://github.com/toddmotto/fluidvids/blob/master/dist/fluidvids.js
      var head = document.head || document.getElementsByTagName('head')[0];
      var css = '.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}';
      var div = document.createElement("div");
      div.innerHTML = '<p>x</p><style id="fit-vids-style">' + css + '</style>';
      head.appendChild(div.childNodes[1]);
    }

    if ( options ) {
      $.extend( settings, options );
    }

    return this.each(function(){
      var selectors = [
        'iframe[src*="player.vimeo.com"]',
        'iframe[src*="youtube.com"]',
        'iframe[src*="youtube-nocookie.com"]',
        'iframe[src*="kickstarter.com"][src*="video.html"]',
        'object',
        'embed'
      ];

      if (settings.customSelector) {
        selectors.push(settings.customSelector);
      }

      var ignoreList = '.fitvidsignore';

      if(settings.ignore) {
        ignoreList = ignoreList + ', ' + settings.ignore;
      }

      var $allVideos = $(this).find(selectors.join(','));
      $allVideos = $allVideos.not('object object'); // SwfObj conflict patch
      $allVideos = $allVideos.not(ignoreList); // Disable FitVids on this video.

      $allVideos.each(function(count){
        var $this = $(this);
        if($this.parents(ignoreList).length > 0) {
          return; // Disable FitVids on this video.
        }
        if (this.tagName.toLowerCase() === 'embed' && $this.parent('object').length || $this.parent('.fluid-width-video-wrapper').length) { return; }
        if ((!$this.css('height') && !$this.css('width')) && (isNaN($this.attr('height')) || isNaN($this.attr('width'))))
        {
          $this.attr('height', 9);
          $this.attr('width', 16);
        }
        var height = ( this.tagName.toLowerCase() === 'object' || ($this.attr('height') && !isNaN(parseInt($this.attr('height'), 10))) ) ? parseInt($this.attr('height'), 10) : $this.height(),
            width = !isNaN(parseInt($this.attr('width'), 10)) ? parseInt($this.attr('width'), 10) : $this.width(),
            aspectRatio = height / width;
        if(!$this.attr('id')){
          var videoID = 'fitvid' + count;
          $this.attr('id', videoID);
        }
        $this.wrap('<div class="fluid-width-video-wrapper"></div>').parent('.fluid-width-video-wrapper').css('padding-top', (aspectRatio * 100)+'%');
        $this.removeAttr('height').removeAttr('width');
      });
    });
  };
// Works with either jQuery or Zepto
})( window.jQuery || window.Zepto );
$(document).ready(function(){
    var menuButton = $(".menu-icon"),
        nav = $("header nav");
        menuButton.on('click', function(){
            nav.toggleClass("visible");
            menuButton.toggleClass("close");
        });
});
function loadMore(){
    var pagination = $("#pagination"),
        button = $(".next-button"),
        pageCount = 2;
    button.on('click', function(e){
        e.preventDefault();
        if (pageCount > totalPages){
            button.addClass("no-posts");
            return false;
        }else{
            button.addClass("loading");
            $.get("/page/"+pageCount+"", function(data){
                var newPosts = $(data).find("article");
                newPosts.insertBefore(pagination);
                button.removeClass("loading");
                var newPostIDs = newPosts.map(function () {
                    return this.id;
                }).get();
                Tumblr.LikeButton.get_status_by_post_ids(newPostIDs);
                pageCount++;
                button.attr("href", "/page/"+pageCount+"");
                photoset();
                $("article").fitVids({
                    customSelector: "iframe[src*='vine'], iframe[src*='tumblr']"
                });
            });  
        }
    });
};