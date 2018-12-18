$(document ).ready(() => {

    // When the user clicks on the submit button
    $('#form').on("submit", function (e) {

        // This stops the default action of an element from happening, in this case submitting the form
        e.preventDefault();

        // This targets the form and takes the users input and will always make sure its lowercase
        // (pokemon API needs it that way)
        userInput = $('#searchText').val().toLowerCase();

        // Starting the Ajax request to the Pokemon API
        $.ajax ({
            type: "GET",
            url: 'https://pokeapi.co/api/v2/pokemon/' + userInput + '/',

            success: function(response) {

                //Makes sure that the user has actually typed something
                if ( userInput != '') {


                    var cap = 21, //This is the biggest pokemon size that fits on the page in decimeters
                        humanHeight = 17, //This is taken from average human height of 175cm
                        pokemonHeight = response.height; //This is taking the height given from API for the pokemon selected

                    if (pokemonHeight >= cap) {
                        // If the pokemon is bigger than the current cap height of 21 then just make the pokemon height the new cap height
                        cap = pokemonHeight
                    }

                    //Take the height given in decimeteres from the api and turn into centimeters and print that out
                    $("#pokemon-height").html(`${response.height * 10}cm tall!`);

                    changePokemonHeight(cap, pokemonHeight, userInput);

                    changeHumanHeight(cap, humanHeight);

                    setScale(cap, pokemonHeight);

                    //Calling the measurement bar animation based on pokemon height from API
                    animateProgressBar(response.height);


                //If the user doesn't type anything or what they type isn't actually a Pokemon
                } else {
                    $("#pokemon-height").html("you didn't search for anything");
                }
            },

            error: function (request, status, error) {
                $("#pokemon-height").html('That is not a pokemon');

            }
        });


        function animateProgressBar(pokemonHeight) {

            var tallestHeight = 21,

                //Figuring out the height the bar should rise which will be the same height that is taken from api
                pokemonHeightPercent = ((pokemonHeight) / tallestHeight ) * 100,
                heightBar = $('#progBar');

            $(heightBar).animate( {
                'height': pokemonHeightPercent + '%'
            }, 2000 );

        }


        /**
         * Function to get the sprite image from the user input then work out what size the pokemon image should be as a percentage of the cap size
         * @param cap
         * @param height
         * @param userInput
         */

        function changePokemonHeight(cap, height, userInput) {
            var percentageHeight = (height / cap) * 100;
            //Getting the sprite image from api by using input search and adding to end of sprite url
            //Change the size of the image as a percentage of the cap height
            $("#sprite").attr("src", 'http://www.pokestadium.com/sprites/xy/' + userInput + '.gif').height(percentageHeight + '%');

        }

        /**
         * Function to change the height of the person image in relation to the cap
         * @param cap
         * @param height
         */
        function changeHumanHeight(cap, height) {
            var percentageHeight = (height / cap) * 100;
            //Change the size of the person as a percentage of the pokemon height
            $(".person-image").height(percentageHeight + '%')
        }

        /**
         * Function that uses the cap height in order to determin the value of the ruler lines
         * @param cap
         */

        function setScale(cap) {
            var measurementBar = $('.measurement-bar'),
                increase = (cap / 10);

            // Making sure that the measurement bar is reset to zero by default every time form is submitted
            measurementBar.empty();

            // Loop through and get set the li measurement number as 10 percent of the pokemon height
            for (let i = 0; i <= cap ; i = i + increase) {

                var scalePosition = (i / cap) * 100;

                // creating an element object for our li
                var element = {
                    class: "ruler",
                    css: {
                        "bottom": scalePosition + '%'
                    }
                };

                var ruler = $('<li>', element);
                ruler.html(Math.round(i * 10) + 'cm');
                measurementBar.append(ruler);

            }

        }

    });

});


