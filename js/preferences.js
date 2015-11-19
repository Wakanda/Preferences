function selectPanel(panelNumber) {
    $('#content .panel').hide();
    $('#selector .list').removeClass('selected');

    $('#selector .list[data-id="'+panelNumber+'"]').addClass('selected');

    var panel = $('#panel-'+panelNumber);
    panel.show();    
}

function refreshPanels() {    
    $('iframe').each(function(i,iframe){
        iframe.contentWindow.location.reload();
    });
}

$(document).ready(function(){
    var panels = studio.getPreferencePanels();

    // html panels first
    panels.forEach(function(panel,i) {
        var extension = panel.url.split('.')[panel.url.split('.').length - 1].toLowerCase();
        if ( extension == 'html' ) {
            $('#selector').append('<a class="list" id="list' + i +'" href="#" data-type="html" data-name="'+ panel.name.toLowerCase() +'" data-id="'+i+'">' + panel.name + '</a>');
            $('#content').append('<div class="panel" id="panel-' + i + '"><iframe src="' + panel.url + '"></iframe></div>');
        } else if ( extension == 'json' ) {
            $('#selector').append('<a class="list" id="list' + i +'" href="#" data-type="json" data-name="'+ panel.name.toLowerCase() +'" data-id="'+i+'">' + panel.name + '</a>');
            $.get( panel.url, function( data ) {
                var prefs = JSON.parse(data);
                var panel = $('<div class="panel wakanda-preferences" id="panel-' + i + '"></div>');
                panel.append('<h1>'+prefs.title+'</h1>');
                panel = studio.preferences.generatePreferencesInput(prefs,panel);
                $('#content').append(panel);
                studio.preferences.initPreferences(prefs,panel);
            });
        }
    });

    $('#selector .list').click(function(e){
        e.preventDefault();
        var panelId = $(this).attr('data-id');
        selectPanel(panelId);
        if (studio.extension.storage.getItem('refreshPanels')) {
            refreshPanels();
            studio.extension.storage.setItem('refreshPanels', null);
        }
    });

    if (panels.length > 0) {
        var panelId = $('#selector .list[data-name="general"]').attr('data-id');
        selectPanel(panelId);
    }
    
});