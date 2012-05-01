/*!
 * Validator v0.7
 * http://helmuth-lammer.at/
 *
 * Copyright 2010 - 2012, Helmuth Lammer
 *  This script is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This script is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You can find a copy of the GNU General Public License on my website
    http://www.helmuth-lammer.at/gpl.txt .  If not, see <http://www.gnu.org/licenses/>.

    Dieses Skript ist Freie Software: Sie können es unter den Bedingungen
    der GNU General Public License, wie von der Free Software Foundation,
    Version 3 der Lizenz oder (nach Ihrer Option) jeder späteren
    veröffentlichten Version, weiterverbreiten und/oder modifizieren.

    Dieses Skript wird in der Hoffnung, dass es nützlich sein wird, aber
    OHNE JEDE GEWÄHRLEISTUNG, bereitgestellt; sogar ohne die implizite
    Gewährleistung der MARKTFÄHIGKEIT oder EIGNUNG FÜR EINEN BESTIMMTEN ZWECK.
    Siehe die GNU General Public License für weitere Details.

    Sie sollten eine Kopie der GNU General Public License auf meiner Website finden
    http://www.helmuth-lammer.at/gpl.txt . Wenn nicht, siehe <http://www.gnu.org/licenses/>.
 *
 * Date: Thu May 01 11:04:00 2012 -0200
 */
/**
 *  requires jQuery
 */
var validator = function(formId){
    var self = this;
    this.formId = formId;

    $('#'+formId).bind('submit', function(){return self.validate();});

    var required = {
        field: undefined,
        msg: "",
        required: function(){
            if(this.field.val().length == 0){
                this.msg += this.field[0].title + " muss angegeben werden.\n";
                return false;
            }return true;
        },
        email: function(){
            if(this.field.val() == '') return true;
            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            if(reg.test(this.field.val()) == false){
                this.msg += this.field[0].title+" ist keine korrekte E-Mailadresse.\n";
                return false;
            }return true;
        },
        intval: function(){
            var reg = /^([0-9])/;
            if(reg.test(this.field.val()) == false){
                this.msg += 'In '+this.field[0].title+" ist keine korrekte Zahl eingetragen.\n";
                return false;
            }return true;
        },
        floatval: function(){
            var reg = /^([0-9])|^([0-9])+\.([0-9])$|\.([0-9])$/;
            if(reg.test(this.field.val()) == false){
                this.msg += 'In '+this.field[0].title+" ist keine korrekte Zahl eingetragen.\n";
                return false;
            }return true;
        },
        match: function(){
           var delimitter = "_";
           var ids = this.field[0].id.split(delimitter);
           var match = $('#'+ids[1]+delimitter+ids[0]);
           if( ids[1]!=undefined && this.field.val() != match.val() && this.field.attr('name') != ""){
               this.msg += "Die Felder "+this.field[0].title+" und "+match[0].title+" sind unterschiedlich.\n";
               return false;
           }return true;
        },
        password: function(){
            if(this.field.attr('name')=="") return true;
            if(this.field.val().length < 8){
                this.msg += "Jedes Passwort muss mindestens 8 Zeichen lang sein und wenigstens zwei Ziffern und zwei Buchstaben enthalten.\n";
                return false;
            }

            var pwd = this.field.val();
            
            var strlen = pwd.toString().length;
            
            var digits = 0;
            var letters = 0;

            for(var i=0; i<strlen; i++ ) {
                var curr_char = pwd.charAt(i);
                if( self.strpos('0123456789', curr_char) !== false ) {
                    digits ++;
                } else if( self.strpos('ABCDEFGHIJKLMOPQRSTUVWXYZabcdefghijklmopqrstuvwxyz', curr_char) !== false ) {
                    letters ++;
                } else {
                    // some other character
                }
            }

            if(digits < 2 || letters < 2){
                this.msg += "Jedes Passwort muss mindestens 8 Zeichen lang sein und wenigstens zwei Ziffern und zwei Buchstaben enthalten.\n";
                return false;
            }

            return true;
        }
    }

    this.validate = function(){
        required.msg = "";
        
        $('#'+this.formId+' input').each(function(){

           required.field = $(this);
           for(var item in required) {
                if( $(this).hasClass(item.toString()) )
                    if(! eval('required.'+(item.toString())+'()') ) break;
           }
        });

         $('#'+this.formId+' textarea').each(function(){

           required.field = $(this);
           for(var item in required) {
                if( $(this).hasClass(item.toString()) )
                    if(! eval('required.'+(item.toString())+'()') ) break;
           }
        });
        
        
        var checkbox_radio_names = [];
        //radios
        $('#'+this.formId).find('input[type=radio].required').each(function(){
            var current_name = $(this).attr('name');
            if(jQuery.inArray(current_name, checkbox_radio_names) < 0) checkbox_radio_names.push(current_name)
        });
        //checkboxes
        $('#'+this.formId).find('input[type=checkbox].required').each(function(){
            var current_name = $(this).attr('name');
            if(jQuery.inArray(current_name, checkbox_radio_names) < 0) checkbox_radio_names.push(current_name)
        });
        
        for(var i=0; i<checkbox_radio_names.length; i++){            
            if( $('input[name='+checkbox_radio_names[i]+']:checked').length < 1){
                var title = $('input[name='+checkbox_radio_names[i]+']').parents('.field').first().find('h4').text();
                required.msg += "Sie müssen die Frage beantworten um Fortfahren zu können ("+title+").\n"; //todo: besserer text damit auch agb accept rein fällt   
            }
        }
        
        if(required.msg.length > 0) {
            outMsg(required.msg);
            return false;
        }
        return true;
    }

    this.strpos = function(haystack, needle, offset) {
        // Finds position of first occurrence of a string within another
        //
        // version: 1109.2015
        // discuss at: http://phpjs.org/functions/strpos
        // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   improved by: Onno Marsman
        // +   bugfixed by: Daniel Esteban
        // +   improved by: Brett Zamir (http://brett-zamir.me)
        // *     example 1: strpos('Kevin van Zonneveld', 'e', 5);
        // *     returns 1: 14
        var i = (haystack + '').indexOf(needle, (offset || 0));
        return i === -1 ? false : i;
    }
}

var outMsg = function(message){
    var target = $('#msg');
    var html = "<p>Das Formular wurde nicht ganz korrekt ausgefüllt, wir bitten um Verständnis. Bitte beachten Sie, </p>"
    html += "<ul>";
    var messages = message.split("\n");

    for(var i=0;i<messages.length-1;i++)
        html += '<li>'+messages[i]+'</li>';

    html += "</ul>";


    if(target.length == 0){
//        var msg = '<div id="msg" style="position: fixed; display:none; z-index: 99; width: 600px; height: 200px; overflow: auto; background-color: #fff; border: 2px solid #990000; left: 50%; top: 50%; margin-left: -300px; margin-top: -100px; padding: 40px;"></div>';
        var msg = '<div id="msg" class="ui-widget inline-dialog"></div>'
        $('body').append(msg);
        target = $('#msg');
        
        target.dialog({
            autoOpen: false,
            height: 500,
            width: 550,
            title: 'Formular nicht korrekt Ausgef&uuml;llt.',
            buttons: [
                {text: "ok", click: function(){$(this).dialog("close");}}
            ],
            modal: true});
    }

    target.html(html);
    $('#msg').dialog( "open" );
    target.fadeIn(200);
    var msg_count = i;
   // window.setTimeout(function(){target.fadeOut(500 + 10*i); }, 1000+1000*i);
}
