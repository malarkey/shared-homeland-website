<script>
    $(document).ready(function () {

        // Simple menu toggle

        $(".js-slide-menu").click(function () {
            $(this).toggleClass("is-active");
            $(".js-close").toggleClass("is-active");
            $(".main-content").toggleClass("main-content-open");
            $(".slide-menu").toggleClass("slide-menu-open");
            $("body").toggleClass("stop-scroll");
        }),

        $(".js-close").click(function () {
            $(".js-slide-menu").toggleClass("is-active");
            $(".js-close").toggleClass("is-active");
            $(".main-content").toggleClass("main-content-open");
            $(".slide-menu").toggleClass("slide-menu-open");
            $("body").toggleClass("stop-scroll");
        })







    });



    var words = ['clients','destinations','families', 'journeys', 'circumstances', 'dreams'];
// run through the array forever
(function recurse(counter) {
    // get the word
    var word = words[counter];
    // animate it
    $('.js-loopText').animate({opacity: "1"}).delay('1200').animate({opacity: "0"}).html(word);
    // delete the value to save memory
    delete words[counter];
    // add the value at the end of the array
    words.push(word);
    // run it again for the next number
    setTimeout(function() {
        recurse(counter + 1);
    }, 2400);
// start it for the first number.
})(0);


</script>