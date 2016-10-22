$(document).ready(function(){
    $("#frmAdd").submit(function(e) {
        e.preventDefault(); // Prevents the page from refreshing
        var $this = $(this); // `this` refers to the current form element
        $.post(
            $this.attr("action"), // Gets the URL to sent the post to
            $this.serialize(), // Serializes form data in standard format
            function(data) { /** code to handle response **/ },
            "json" // The format the response should be in
        ).done(
            $("body").load(location.href)

        );
    });
    $(".delIcon").click(function(e) {
        e.preventDefault(); // Prevents the page from refreshing
        var $this = $(this).prev(); // `this` refers to the current form element
        var id = $($this).attr('id');
        var task = {idDel : id};
        
        $.post(
           "/deleteTask", // Gets the URL to sent the post to
            task, // Serializes form data in standard format
            function(data) { /** code to handle response **/ },
            "json" // The format the response should be in
        ).done(
            $("body").load(location.href)
        );
    });
});