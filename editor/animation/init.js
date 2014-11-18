//Dont change it
requirejs(['ext_editor_1', 'jquery_190', 'raphael_210', 'snap.svg_030'],
    function (ext, $, Raphael, Snap) {

        var cur_slide = {};

        ext.set_start_game(function (this_e) {
        });

        ext.set_process_in(function (this_e, data) {
            cur_slide = {};
            cur_slide["in"] = data[0];
            this_e.addAnimationSlide(cur_slide);
        });

        ext.set_process_out(function (this_e, data) {
            cur_slide["out"] = data[0];
        });

        ext.set_process_ext(function (this_e, data) {
            cur_slide.ext = data;
        });

        ext.set_process_err(function (this_e, data) {
            cur_slide['error'] = data[0];
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_animate_success_slide(function (this_e, options) {
            var ends = ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"]

            options = options || {};
            var is_new_record = options.is_new_record || false;
            var place_rating = String(options.place_rating || 0);
            var best_points = options.best_points || 0;
            var current_points = options.current_points || 0;
            var $div = $("<div></div>");
            var $h = $(this_e.setHtmlSlide('<div class="animation-success"><div class="result"></div></div>'));
            var $resultDiv = $h.find(".result");
            var $table = $("<table></table>").addClass("numbers");
            if (is_new_record) {
                $resultDiv.addClass("win-sign");
                $resultDiv.append($("<div></div>").text("You beat your best results!"));
                var $tr = $("<tr></tr>");
                $tr.append($("<th></th>").text(best_points));
                $tr.append($("<th></th>").text(place_rating).append($("<span></span>").addClass(".ends").text(ends[Number(place_rating[place_rating.length - 1])])));

                $table.append($tr);
                $tr = $("<tr></tr>");
                $tr.append($("<td></td>").text("Personal best"));
                $tr.append($("<td></td>").text("Place"));
                $table.append($tr);
            }
            else {
                $resultDiv.addClass("norm-sign");
                $resultDiv.append($("<div></div>").text("Your results"));
                $tr = $("<tr></tr>");
                $tr.append($("<th></th>").text(current_points));
                $tr.append($("<th></th>").text(best_points));
                $tr.append($("<th></th>").text(place_rating).append($("<span></span>").addClass(".ends").text(ends[Number(place_rating[place_rating.length - 1])])));

                $table.append($tr);
                $tr = $("<tr></tr>");
                $tr.append($("<td></td>").text("Points"));
                $tr.append($("<td></td>").text("Personal best"));
                $tr.append($("<td></td>").text("Place"));
                $table.append($tr);
            }
            $resultDiv.append($table);
            this_e.setAnimationHeight(255);
        });

        ext.set_animate_slide(function (this_e, data, options) {
            var $content = $(this_e.setHtmlSlide(ext.get_template('animation'))).find('.animation-content');
            if (!data) {
                console.log("data is undefined");
                return false;
            }

            //YOUR FUNCTION NAME
            var fname = 'poker_dice';

            var checkioInput = data.in || [
                [1, 1],
                [1, 1],
                [1, 1],
                [1, 1],
                [1, 1],
                [1, 1],
                [1, 1],
                [1, 1],
                [1, 1],
                [1, 1]
            ];
            var checkioInputStr = fname + '(' + JSON.stringify(checkioInput) + ')';

            var failError = function (dError) {
                $content.find('.call').html(checkioInputStr);
                $content.find('.output').html(dError.replace(/\n/g, ","));

                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
                $content.find('.answer').remove();
                $content.find('.explanation').remove();
                this_e.setAnimationHeight($content.height() + 60);
            };

            if (data.error) {
                failError(data.error);
                return false;
            }

            if (data.ext && data.ext.inspector_fail) {
                failError(data.ext.inspector_result_addon);
                return false;
            }

            $content.find('.call').html(checkioInputStr);
            $content.find('.output').html('Working...');


            if (data.ext) {
                var rightResult = data.ext["real_point"];
                var userResult = data.out;
                var result = data.ext["result"];
                var result_text = data.ext["result_text"];
                var result_score = data.ext["total_score"];
                var updatedInput = data.ext["input"];

                var svg = new SVG($content.find(".explanation")[0]);
                svg.draw(checkioInput[0], updatedInput[1]);

                //if you need additional info from tests (if exists)
                var explanation = data.ext["explanation"];
                $content.find('.output').html('&nbsp;Your result:&nbsp;' + JSON.stringify(userResult) +
                    "<br>Total Score: " + result_score);
                if (!result) {
                    $content.find('.answer').html(result_text);
                    $content.find('.answer').addClass('error');
                    $content.find('.output').addClass('error');
                    $content.find('.call').addClass('error');
                }
                else {
                    $content.find('.answer').remove();
                }
            }
            else {
                $content.find('.answer').remove();
            }


            //Your code here about test explanation animation
            //$content.find(".explanation").html("Something text for example");
            //
            //
            //
            //
            //


            this_e.setAnimationHeight($content.height() + 60);

        });

        //This is for Tryit (but not necessary)
//        var $tryit;
//        ext.set_console_process_ret(function (this_e, ret) {
//            $tryit.find(".checkio-result").html("Result<br>" + ret);
//        });
//
//        ext.set_generate_animation_panel(function (this_e) {
//            $tryit = $(this_e.setHtmlTryIt(ext.get_template('tryit'))).find('.tryit-content');
//            $tryit.find('.bn-check').click(function (e) {
//                e.preventDefault();
//                this_e.sendToConsoleCheckiO("something");
//            });
//        });

        function SVG(dom) {


            var colorOrange4 = "#F0801A";
            var colorOrange3 = "#FA8F00";
            var colorOrange2 = "#FAA600";
            var colorOrange1 = "#FABA00";

            var colorBlue4 = "#294270";
            var colorBlue3 = "#006CA9";
            var colorBlue2 = "#65A1CF";
            var colorBlue1 = "#8FC7ED";

            var colorGrey4 = "#737370";
            var colorGrey3 = "#9D9E9E";
            var colorGrey2 = "#C5C6C6";
            var colorGrey1 = "#EBEDED";

            var colorWhite = "#FFFFFF";

            var pad = 10;

            var diceSize = 40;


            var sizeX = diceSize * 5 + pad * 6;
            var sizeY;

            var paper;

            var aDice = {"stroke-width": 3, "stroke": colorBlue4};
            var aDiceTextHeart = {"stroke": colorOrange4, "fill": colorOrange4, "font-size": diceSize * 0.6,
                "font-family": "Roboto, Arial. serif", "font-weight": "bold"};
            var aDiceTextSpade = {"stroke": colorBlue4, "fill": colorBlue4, "font-size": diceSize * 0.6,
                "font-family": "Roboto, Arial. serif", "font-weight": "bold"};
            var aText = {"stroke": colorBlue4, "fill": colorBlue4, "font-size": diceSize * 0.4,
                "font-family": "Roboto, Arial. serif"};
            var aLine = {"stroke": colorBlue3, "stroke-width": 2};


            var HANDS = [
                "one pair",
                "two pair",
                "three of a kind",
                "flush",
                "full house",
                "straight",
                "four of a kind",
                "five of a kind"
            ];

            this.draw = function (dices, table) {
                sizeY = dices.length * (pad + diceSize) + pad * 2 + 4 * diceSize;
                paper = Raphael(dom, sizeX, sizeY);

                for (var i = dices.length - 1; i >= 0; i--) {
                    var cDice = dices[i];
                    var temp = paper.set();
                    for (var j = 0; j < cDice.length; j++) {

                        temp.push(
                            paper.rect(pad + j * (diceSize + pad),
                                    (dices.length - i - 1) * (diceSize + pad) + pad,
                                diceSize, diceSize, diceSize / 8
                            ).attr(aDice)
                        );
                        var chDice = cDice[j].replace("S", "♠").replace("H", "♥");
                        temp.push(
                            paper.text(pad + j * (diceSize + pad) + diceSize / 2,
                                    (dices.length - i - 1) * (diceSize + pad) + pad + diceSize / 2,
                                chDice).attr(chDice[1] === "♥" ? aDiceTextHeart : aDiceTextSpade)
                        );
                    }
                    if (i !== dices.length - 1) {
                        temp.attr("opacity", 0.5);
                    }
                }

                for (i = 0; i < HANDS.length; i++) {
                    var shift = (sizeX - pad) / 8;
                    paper.text(pad + (pad + diceSize) * 1.5,
                            pad + dices.length * (pad + diceSize) + diceSize / 4 + i * diceSize / 2,
                        HANDS[i]).attr(aText);
                    paper.text(pad + (pad + diceSize) * 4,
                            pad + dices.length * (pad + diceSize) + diceSize / 4 + i * diceSize / 2,
                        table[HANDS[i]] || "0").attr(aText);

                    if (i != HANDS.length) {
                        paper.path([
                            ["M", pad, pad + dices.length * (pad + diceSize) + (i + 1) * diceSize / 2],
                            ["H", sizeX - pad]
                        ]).attr(aLine);
                    }
                }
                paper.path([
                    ["M", pad + (pad + diceSize) * 3, pad + dices.length * (pad + diceSize)],
                    ["V", sizeY - pad]
                ]).attr(aLine);

            }


        }

        //Your Additional functions or objects inside scope
        //
        //
        //


    }
);
