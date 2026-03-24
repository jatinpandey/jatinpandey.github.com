$(document).ready(function() {

	$("#myCarousel").carousel({
		interval: false
	});

   $("#contactLink").click(function() {
        $("#navContact").trigger('click');
    });

	$(".nav li").click(function() {
		$(".nav li").removeClass("active");
		$(this).addClass("active");
	});

	$("#navHome").click(function() {
		$("#myCarousel").carousel(0);
	});

	$("#navBlog").click(function() {
		$("#myCarousel").carousel(1);
	});

	$("#navContact").click(function() {
		$("#myCarousel").carousel(2);
	});

	$("#blog img").mouseenter(function() {
		$(this).css("opacity", "1");
	}).mouseleave(function() {
		$(this).css("opacity", "0.85");
	});

	$("#homeSubtext").mouseenter(function() {
		$(this).css("opacity", "1");
	}).mouseleave(function() {
		$(this).css("opacity", "0.8");
	});

});

var endDimming = setInterval(dimThenBright, 2000);

function dimThenBright() {
	$(".dimMe").fadeOut(2500);
	$(".dimMe").fadeIn(1500);

}	
