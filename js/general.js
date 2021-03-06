$(document).ready(function() {
    // specify preferences
    $.get( './general.json', function( data ) {
        // retrieve preferences
        var preferencesJson = JSON.parse(data);

        // populate preferences, add onChange triggers
        studio.preferences.initPreferences(preferencesJson);

        // populate server location
        $('#serverLocation').html(studio.getPref("serverPath"));
        $('#setServer').click(function() {
            var f = studio.fileSelectDialog();
            if (f) {
                studio.setPref("serverPath", f.path);
                $('#serverLocation').html(f.path);
            }
        });

        $('#resetServer').click(function() {
            studio.setPref("serverPath", '');
            $('#serverLocation').html('');
        });

        $('#resetPreferences').click(function(e){
            e.preventDefault();
            if(confirm('All the user preferences will be set to their original values. Are you sure you want to proceed?')) {
                studio.sendCommand('FactorySettings');
                studio.setPreferences('codeEditor.colorScheme',null);
                studio.extension.storage.setItem('refreshPanels', true);
                studio.sendExtensionWebZoneCommand('wakanda-extension-web-editor', 'IDE.refreshPreferences');
                window.top.location.reload();
            }
        });

        if(studio.os.isWindows) {
            $('#environment_variables').remove();
        } else {
            $('#checkInstall').click(function(e) {
                studio.sendCommand('wakanda-extension-trouble-shooting.checkDependencies');
            });
        }
    });
});
