$(document ).ready(() => {


    $('#form').on("submit", function (e) {
        e.preventDefault();



        userInput = $('#searchText').val().toLowerCase();
        console.log(userInput)

        $('#progBar').val(70);


        $.ajax ({
            type: "GET",
            url: 'https://pokeapi.co/api/v2/pokemon/' + userInput + '/',

            success: function(response) {

                if ( userInput != '') {

                    var cap = 21,
                        humanHeight = 17,
                        pokemonHeight = response.height;

                    if (pokemonHeight >= cap) {
                        cap = pokemonHeight
                    }

                    $("#pokemon-height").html(`${response.height * 10}cm tall!`);

                    changePokemonHeight(cap, pokemonHeight, userInput);
                    changeHumanHeight(cap, humanHeight);


                    setScale(cap, pokemonHeight);

                    // make the animation bar move up the appropriate percentage
                    // animateProgressBar(response.height);



                } else {
                    $("#pokemon-height").html("you didn't search for anything");
                }
            },
            error: function (request, status, error) {
                $("#pokemon-height").html('That is not a pokemon');

            }
        });


        // function animateProgressBar(pokemonHeight) {
        //
        //     var tallestHeight = 21,
        //         pokemonHeightPercent = ((pokemonHeight) / tallestHeight ) * 100,
        //         heightBar = $('#progBar');
        //
        //     console.log(`Pokemon Height %: ${pokemonHeightPercent}`);
        //     $(heightBar).animate( {
        //         'height': pokemonHeightPercent + '%'
        //     }, 3000 );
        //
        // }


        /**
         * Function to get the sprite image from the user input then work out what size the pokemon image should be as a percentage of the cap size
         * @param cap
         * @param height
         * @param userInput
         */

        function changePokemonHeight(cap, height, userInput) {
            var percentageHeight = (height / cap) * 100;
            $("#sprite").attr("src", 'http://www.pokestadium.com/sprites/xy/' + userInput + '.gif').height(percentageHeight + '%');

        }

        /**
         * Function to change the height of the person image in relation to the cap
         * @param cap
         * @param height
         */
        function changeHumanHeight(cap, height) {
            var percentageHeight = (height / cap) * 100;
            $(".person-image").height(percentageHeight + '%')
        }

        function setScale(cap) {
            var measurementBar = $('.measurement-bar'),
                increase = 2;


            if (cap >= 21) {
                increase = 5;
            }

            if (cap >= 50) {
                increase = 10;
            }

            if (cap >= 100) {
                increase = 20;
            }

            measurementBar.empty();
            for (let i = 0; i <= cap ; i = i + increase) {
                console.log('here');
                var scalePosition = ((i / cap) * 100);
                console.log(scalePosition);

                var element = {
                    class: "ruler",
                    css: {
                        "bottom": scalePosition + '%'
                    }
                };

                var ruler = $('<li>', element);
                ruler.html(i + 'cm');
                measurementBar.append(ruler);

            }


            //
            // $('#progBar').animate( {
            //     'height': (pokemonHeight / cap) * 100 + '%'
            // }, 3000 );
        }

    });

});



// .toFixed() - can't figure out where to put this

