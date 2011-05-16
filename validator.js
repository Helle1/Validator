// copyright  helmuth lammer
// INIT GUIS and holding diverse GUI Objects
// called in /js/*.js
/**
 * validator object
 * requires jquery
 */
var validator = function(formId, dontbind){
    var self = this;
    this.formId = formId;

    if(!dontbind) $('#'+formId).bind('submit', function(){
        return self.validate();
    });

    var required = {
        field: undefined,
        msg: "",
        //add grater and less,  id or name holds than a number/float, or a fieldId
        //what todo with checkboxes? and radio jquery syntax: input[name=foo]:radio or similar ... seen that some dasys ago (2011.02.10, hl)
        //as well as street and city - bia google-maps api ;-)
        required: function(){
            if(this.field.val().length == 0){
                this.msg += translate("val_required", new Array(this.field[0].title))+"\n";
                return false;
            } return true;
        },
        email: function(){
            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            if(reg.test(this.field.val()) == false){
                this.msg += translate("val_no_email", new Array(this.field[0].title))+"\n";
                return false;
            } return true;
        },
        intval: function(){
            var reg = /^([0-9])/;
            if(reg.test(this.field.val()) == false){
                this.msg += translate("val_notanumber", new Array(this.field[0].title))+"\n";
                return false;
            } return true;
        },
        floatval: function(){
            var reg = /^([0-9])|^([0-9])+\.([0-9])$|\.([0-9])$/;
            if(reg.test(this.field.val()) == false){
                this.msg += translate("val_notanumber", new Array(this.field[0].title))+"\n";
                return false;
            } return true;
        },
        match: function(){
            var delimitter = "_";
            var ids = this.field[0].id.split(delimitter);
            var match = $('#'+ids[1]+delimitter+ids[0]);
            if( ids[1]!=undefined && this.field.val() != match.val() && this.field.attr('name') != ""){
                this.msg += translate("val_field_missmatch", new Array(this.field[0].title, +match[0].title))+"\n";
                return false;
            } return true;
        },
        password: function(){
            if(this.field.attr('name')=="") return true;
            if(this.field.val().length < 7){
                this.msg += translate("val_password_rules")+"\n";
                return false;
            }
            /*var reg = ''; //TODO find regex for save pwd ;-) found that some days ago
            if(reg.test(this.field.val()) == false){
                this.msg += "Das Passwort muss wenigstens eine Ziffer und einen Buchstaben enthalten.\n";
                return false;
            } */return true;
        },
        notzero: function(){
            if(this.field.val() == 0 || this.field.val() == '0'){
                this.msg += translate("val_required", new Array(this.field[0].title))+"\n";
                return false;
            } return true;
        }
    }

    this.validate = function(only_required){
        required.msg = "";
        $('#'+this.formId+' input').each(function(){
            required.field = $(this);
            for(var item in required) {
                if(only_required && !required.field.hasClass('required')) break;
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


        if(required.msg.length > 0) {
            outMsg(required.msg);
            return false;
        }
        return true;
    }
}

var outMsg = function(message){
    var target = $('.info_box');
    var html = "<p>"+translate("val_form_incorrect")+"</p>"
    html += "<ul>";
    var messages = message.split("\n");

    for(var i=0;i<messages.length-1;i++)
        html += '<li>'+messages[i]+'</li>';

    html += "</ul>";

    //out_message(html);

    if(target.length == 0){
        var msg = '<div id="msg" style="position: fixed; display:none; z-index: 99; width: 600px; height: 200px; overflow: auto; background-color: #fff; border: 2px solid #990000; left: 50%; top: 50%; margin-left: -300px; margin-top: -100px; padding: 40px;"></div>';
        $('body').append(msg);
        target = $('#msg');
        target.html(html);
    } else {
        target.find('.message').html(html);
    }

    var button = target.find('.button_blue');
    button.unbind();
    button.bind('click', function(){
        target.fadeOut(100);
    });

    
    target.fadeIn(200);
    var msg_count = i;
    
    //window.setTimeout(function(){ target.fadeOut(500 + 10*i) }, 1000+1500*i);
}
