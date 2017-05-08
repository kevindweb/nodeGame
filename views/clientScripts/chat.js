$(document).ready(function(){
  // chat functions
  $(document).on('click', '.panel-heading span.icon_minim', function (e) {
      var $this = $(this);
      if (!$this.hasClass('panel-collapsed')) {
          $this.parents('.panel').find('.panel-body').slideUp();
          $this.addClass('panel-collapsed');
          $this.removeClass('glyphicon-minus').addClass('glyphicon-plus');
      } else {
          $this.parents('.panel').find('.panel-body').slideDown();
          $this.removeClass('panel-collapsed');
          $this.removeClass('glyphicon-plus').addClass('glyphicon-minus');
      }
  });
  $(document).on('focus', '.panel-footer input.chat_input', function (e) {
      var $this = $(this);
      if ($('#minim_chat_window').hasClass('panel-collapsed')) {
          $this.parents('.panel').find('.panel-body').slideDown();
          $('#minim_chat_window').removeClass('panel-collapsed');
          $('#minim_chat_window').removeClass('glyphicon-plus').addClass('glyphicon-minus');
      }
  });
  $("#btn-input").keyup(function(e){
    if(e.keyCode == 13){
      $("#btn-chat").click();
    }
  });
  $("#btn-chat").click(function(){
    var value = $("#btn-input").val();
    if (!value.replace(/\s/g, '').length){
      $("#btn-input").val("");
      $("#btn-input").attr("placeholder","Empty msg");
    } else{
      sendMessage('Kevin Deems',value);
      $("#btn-input").val("");
      $("#btn-input").attr("placeholder","Sent");
      setTimeout(function(){
        $("#btn-input").attr("placeholder","Enter msg");
      },3000);
    }
  });
});
