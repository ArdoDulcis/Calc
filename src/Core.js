let patt_num = /[0-9]/g;
let com = /\B(?=(\d{3})+(?!\d))/g;
let delcom = /[,]/g;
let delzero = /\.?0+$/;
var num = "";
var savenum = "";
var mathsave = "";
var math_expression = "";
let flag = false;
$(function() {
    $('.scientific_calc').hide();
    $('.overlay').hide();
});
$(function() {
    $('.help').on('click', function() {
        $('.overlay').show();
        $('.tuto_1').show();
        help_anim("fadeInUp" ,1);
        $('.tuto_2').hide();
    });
    $('.exit').on('click', function() {
        $('.overlay').hide();
        $('.tuto_2').hide();
    });
    $('.tuto1_next').on('click', function() {
        help_anim("fadeOutDown", 1);
        setTimeout(function() {
            $('.tuto_1').hide();
            $('.tuto_2').show();
            help_anim("fadeInUp", 2);
        }, 900);
    });
    $('.tuto2_prev').on('click', function() {
        help_anim("fadeOutDown", 2);
        setTimeout(function() {
            $('.tuto_2').hide();
            $('.tuto_1').show();
            help_anim("fadeInUp", 1);
        }, 900);
    });
    $('.tuto2_next').on('click', function() {
        $('.overlay').hide();
        $('.tuto_2').hide();
    });
    $('.change').on('click', function() {
        let mode = $('.change').attr('mode');
        if (mode == 1) {
            $('.change').attr('mode', '0');
            load_anim("fadeOutLeft");
            setTimeout(function() {
                $(".scientific_calc").hide()
            } ,1000);
        }
        else {
            $('.change').attr('mode', '1');
            $(".scientific_calc").show();
            load_anim("fadeInLeft");
        }
    });
    $('.his_clear').on('click', function() {
        $('li').remove();
    });
    $(document).keydown(function(e) {
        let keycode = e.keyCode;
        let id = change_keycode(keycode);
        if (keycode >= 46 && keycode <= 57 || keycode >= 96 && keycode <= 111 || keycode == 8 || keycode == 13) {
            event(id);
        }
    });
    $('.calcbtn').on('click', function(e) {
        let id = e.target.getAttribute('id');
        event(id);
    });
});
function event(calc_id) {
    let id = calc_id;
    $('.numbtn').attr('disabled', false);
    $('.math').attr('disabled', false);
    if (num.match(/[.]/g) == null) {
        $('.dot').attr('disabled', false);
    }
    if ($('#number').text() == "E") {
        $('#number').text('');
    }
    if (id.match(patt_num)) {
        if (num.substring(num.indexOf(".")).length >= 6 && num.indexOf(".") != -1) {
            $('.numbtn').attr('disabled', true);
        }
        else if (num.replace(/-/g , '').substring(0).length > 11 && num.indexOf(".") == -1) {
            $('.numbtn').attr('disabled', true);
        }
        else if (num == "0") {
            $('#0').attr('disabled', false);
        }
        else if (num.indexOf("0.") != -1) {
            num += id
            $('#number').text($('#number').text() + id);
        }
        else if (num.match(/[.]/g)) {
            num += id;
            $('#number').text(($('#number').text() + id));
        }
        else {
            $('#number').text((num += id).replace(com, ","));
        }
    }
    else if (check_scientific_calc(id) == true) {
        if ($('#number').text() != "") {
            scientific_calc_core($('#number').text().replace(delcom, ''), id);
        }
        else if ($('#save').text() != "") {
            scientific_calc_core($('#save').text().replace(delcom, ''), id);
        }
    }
    else if (id == "clear") {
        $('#number').text('');
        $('#calc').text('');
        $('#save').text('');
        $('.math_expression').text('');
        $('.numbtn').attr('disabled', false);
        $('.math').attr('disabled', false);
        $('.dot').attr('disabled', false);
        num = "";
        mathsave = "";
        math_expression = "";
        savenum = "";
        flag = false;
    }
    else if (id == "bs") {
        $('.dot').attr('disabled', false);
        if (num.length == 2 && num.match(/-/g)) {
            num = "";
            $('#number').text(num);
        }
        else {
            if (num != "") {
                num = num.slice(0,-1);
                $('#number').text(add_comma(num));
            }
            else {
                $('#number').text(num);
            }
        }
    }
    else if (id == "%") {
        if ($('#number').text() != "") {
            math_expression += num + "×" + "100";
            $('.math_expression').text(math_expression);
            if (mathsave != "") {
                calc_core($('#save').text(), num, mathsave);
                savenum = $('#save').text();
                mod(savenum);
                math_expression = "";
            }
            else {
                mod($('#number').text().replace(delcom, ''));
                math_expression = "";
            }
        }
        else if ($('#save').text() != "") {
            $('.math_expression').text($('.math_expression').text() + "×" + "100");
            mod($('#save').text().replace(delcom, ''));
        }
    }
    else if (id == "±") {
        if ($('#number').text() != "") {
            if (num.match(/-/g)) {
                num = num.slice(1);
                $('#number').text(add_comma(num));
            }
            else if (num.match(/-/g) == null) {
                $('#number').text(add_comma('-' + num));
                num = $('#number').text().replace(/[,]/g, '');
            }
            if (num.substring(num.indexOf(".")).length == 1) {
                num = num.replace(/[.]/g, '');
            }
            if (num == "0" || num == "-0") {
                $('#number').text(parseFloat(num));
            }
        }
        else if ($('#save').text() != "") {
            savenum = $('#save').text().replace(delcom, '');
            if ($('#save').text().match(/-/g)) {
                $('#save').text(add_comma(savenum.slice(1)));
            }
            else if ($('#save').text().match(/-/g) == null) {
                $('#save').text(add_comma('-' + savenum));
            }
            if ($('#save').text() == "0" || $('#save').text() == "-0") {
                $('#save').text(parseFloat($('#save').text()));
            }
        }
    }
    else if (id == ".") {
        if ($('#number').text() == "") {
            num = "0" + id;
            $('#number').text(num);
        }
        if (num.match(/[.]/g) != null) {
            $('.dot').attr('disabled', true);
        }
        else if (num.match(/[.]/g) == null) {
            num += id;
            $('#number').text($('#number').text() + id);
        }
    }
    else {
        math_expression += num + id;
        $('.math_expression').text(math_expression);
        if (flag) {
            if (id == "=" && num != "") {
                calc_core (savenum, num, mathsave);
                $('#calc').text('');
                var str = $('.math_expression').text() + $('#save').text();
                add_elements(str);
                math_expression = "";
                savenum = "";
                flag = false;
            }
            else if (id == "=" && num == "") {
                $('#calc').text('');
                var str = $('.math_expression').text() + $('#save').text();
                add_elements(str);
                math_expression = "";
                savenum = "";
                flag = false;
            }
            else if (id != "=" && num != "") {
                calc_core (savenum, num, mathsave);
                $('#calc').text(id);
                mathsave = id;
                savenum = $('#save').text();
            }
            else {
                $('#calc').text(id);
                mathsave = id;
            }
        }
        else if (flag == false && id == "=") {
            $('#number').text('');
            if ($('#save').text() != "" && num == "") {
                num = $('#save').text();
            }
            else if (num == "") {
                num = "0";
            }
            $('#save').text(add_comma(num));
            add_elements($('#save').text() + id + $('#save').text());
            num = "";
            math_expression = "";
        }
        else {
            if (num == "") {
                $('#number').text("0");
            }
            mathsave = id;
            savenum = $('#number').text().replace(delcom, '');
            num = "";
            $('#calc').text(id);
            $('#save').text(add_comma(savenum));
            $('#number').text('');
            flag = true;
        }
    }
    
    check_err();
    
    return false;
}
function check_err() {
    var checknum = $('#save').text().replace(delcom, '').replace(/-/g, '')
    if (checknum.indexOf(".") == -1) {
        var numlength = checknum.substring(0)
    }
    else if (checknum.indexOf(".") != -1) {
        var numlength = checknum.substring(0, checknum.indexOf("."))
    }
    if ($('#save').text() == "Infinity" || $('#save').text() == "∞" || $('#save').text() == "NaN" || numlength.length >= 13 || $('#number').text() == "E") {
        $('#number').text("E");
        $('#save').text('');
        $('#calc').text('');
        num="";
        mathsave = "";
        savenum = "";
        math_expression = "";
        flag = false;
        $('.math').attr('disabled', true);
    }
};
function mod(mod_x) {
    mod_x = parseFloat(mod_x);
    $('#save').text(add_comma((100 * mod_x).toFixed(5).replace(delzero, '')));
    $('#number').text('');
    $('#calc').text('');
    num = "";
};
function calc_core (x, y, operator) {
    x = parseFloat(x.replace(delcom, ''));
    y = parseFloat(y);
    switch (operator) {
        case '+' :
            $('#save').text(add_comma((x + y).toFixed(5).replace(delzero, '')));
            break;
        case '-' :
            $('#save').text(add_comma((x - y).toFixed(5).replace(delzero, '')));
            break;
        case '×' :
            $('#save').text(add_comma((x * y).toFixed(5).replace(delzero, '')));
            break;
        case '÷' :
            $('#save').text(add_comma((x / y).toFixed(5).replace(delzero, '')));
            break;
        default :
            $('#calc').text('');
            $('#save').text(add_comma(x.toFixed(5).replace(delzero, '')));
            break;
    }
    $('#number').text('');
    num = ""
};
function scientific_calc_core (num1, scientific_calc) {
    num1 = parseFloat(num1);
    switch (scientific_calc) {
        case 'cos' :
            $('#save').text(add_comma(Math.cos((num1 * 3.141592) / 180).toFixed(5).replace(delzero, '')));
            break;
        case 'sin' :
            $('#save').text(add_comma(Math.sin((num1 * 3.141592) / 180).toFixed(5).replace(delzero, '')));
            break;
        case 'tan' :
            $('#save').text(add_comma(Math.tan((num1 * 3.141592) / 180).toFixed(5).replace(delzero, '')));
            break;
        case 'fact' :
            $('#save').text(add_comma(factorial(num1).toFixed(5).replace(delzero, '')));
            break;
        case 'sqrt' :
            $('#save').text(add_comma(Math.pow(num1, 2).toFixed(5).replace(delzero, '')));
            break;
        case 'log' :
            $('#save').text(add_comma((Math.log(num1) / Math.log(10)).toFixed(5).replace(delzero, '')));
            break;
        default :
            $('#save').text('');
            break;
    }
    num = "";
    $('#number').text('');
    $('#calc').text('');
};
function factorial(fact_num) {
    if (fact_num < 0) {
        return -1;
    }
    else if (fact_num == 0) {
        return 1;
    }
    else {
        return (fact_num * factorial(fact_num - 1));
    }
};
function add_comma(comma) {
    if (comma.toString().match(/[.]/g) != null) {
        comma = comma.split(".");
        comma[0] = comma[0].replace(com, ",");
        comma = comma.join('.');
    }
    else {
        comma = comma.toString().replace(com, ",");
    }
    return comma;
};
function load_anim(a_name) {
    $('#transform').removeClass().addClass(a_name + ' animated').one('animationend', function(){
        $(this).removeClass();
    });
};
function help_anim(helpani_name, phase) {
    if (phase == 1) {
        $('.ani1').removeClass().addClass(helpani_name + ' animated').one('animationend', function(){
            $(this).removeClass().addClass('ani1');
        });
    }
    else if (phase == 2) {
        $('.ani2').removeClass().addClass(helpani_name + ' animated').one('animationend', function(){
            $(this).removeClass().addClass('ani2');
        });
    }
};
function check_scientific_calc(id2) {
    if (id2 == "sin" || id2 == "cos" || id2 == "tan" || id2 == "fact" || id2 == "sqrt" || id2 == "log") {
        return true;
    }
    else {
        return false;
    }
};
function add_elements(str) {
    if (str.indexOf("NaN") > -1 || str.indexOf("Infinity") > -1) {
        $('ul').append("<li>計算結果が正しくありません。</li>");
    }
    else {
        $('ul').append("<li>" + str + "</li>");
        $('.math_expression').text('');
    }
}
function change_keycode(code) {
    switch (code) {
        case 8 :
            code = "bs"
            break;
        case 13 :
            code = "="
            break;
        case 46 :
            code = "clear"
            break;
        case 48 :
            code = "0"
            break;
        case 49 :
            code = "1"
            break;
        case 50 :
            code = "2"
            break;
        case 51 :
            code = "3"
            break;
        case 52 :
            code = "4"
            break;
        case 53 :
            code = "5"
            break;
        case 54 :
            code = "6"
            break;
        case 55 :
            code = "7"
            break;
        case 56 :
            code = "8"
            break;
        case 57 :
            code = "9"
            break;
        case 96 :
            code = "0"
            break;
        case 97 :
            code = "1"
            break;
        case 98 :
            code = "2"
            break;
        case 99 :
            code = "3"
            break;
        case 100 :
            code = "4"
            break;
        case 101 :
            code = "5"
            break;
        case 102 :
            code = "6"
            break;
        case 103 :
            code = "7"
            break;
        case 104 :
            code = "8"
            break;
        case 105 :
            code = "9"
            break;
        case 106 :
            code = "×"
            break;
        case 107 :
            code = "+"
            break;
        case 109 :
            code = "-"
            break;
        case 110 :
            code = "."
            break;
        case 111 :
            code = "÷"
            break;
    }
    return code;
};
function timer() {
    var d = new Date();
    var t = d.toLocaleTimeString();
    $('.clock').text(t);
}
setInterval(timer, 1000);
