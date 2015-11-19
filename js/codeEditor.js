$(document).ready(function() {
    $.get( './codeEditor.json', function( data ) {
        // different font rendering in mac and windows
        var fontUnit = 'pt';
        if (navigator.userAgent.indexOf('Mac OS X') > -1) {
            fontUnit = 'px';
        }

        // retrieve preferences
        var preferencesJson = JSON.parse(data);

        // populate preferences, add onChange triggers
        studio.preferences.initPreferences(preferencesJson);

        // OS customized fontList
        studio.getPref("fontList").forEach(function(fontName){
            $(':input[name="fontName"]').append('<option value="'+fontName+'">'+fontName.replace('-Regular','')+'</option>');
        });

        // Font color scheme
        var themesFolder = 'css/themes/';

        // populate available schemes list based on css in themesFolder
        var themes = [
            'ambiance.css',
            'chaos.css',
            'chrome.css',
            'clouds_midnight.css',
            'clouds.css',
            'cobalt.css',
            'crimson_editor.css',
            'dawn.css',
            'dreamweaver.css',
            'eclipse.css',
            'github.css',
            'idle_fingers.css',
            'iplastic.css',
            'katzenmilch.css',
            'kr_theme.css',
            'kuroir.css',
            'merbivore_soft.css',
            'merbivore.css',
            'mono_industrial.css',
            'monokai.css',
            'pastel_on_dark.css',
            'solarized_dark.css',
            'solarized_light.css',
            'sqlserver.css',
            'terminal.css',
            'textmate.css',
            'tomorrow_night_blue.css',
            'tomorrow_night_bright.css',
            'tomorrow_night_eighties.css',
            'tomorrow_night.css',
            'tomorrow.css',
            'twilight.css',
            'vibrant_ink.css',
            'xcode.css'
        ];

        var input = $(':input[name="colorScheme"]');
        themes.forEach(function(fileName,i) {
            if (fileName.length > 4) {
                var extension = fileName.slice(-4);
                if (extension == ".css") {
                    var fileNameWithoutExtension = fileName.slice(0, -4);
                    var fileListHtml = '<option data-n="'+i+'" value="'+fileNameWithoutExtension+'">' + fileNameWithoutExtension.substr( 0, 1 ).toUpperCase() + fileNameWithoutExtension.substr( 1 ).replace(/_/g," ") + '</option>';
                    $('head').append('<link rel="stylesheet" href="'+themesFolder+'/'+fileNameWithoutExtension+'.css" id="schemeStylesheet">')
                    input.append(fileListHtml);
                }
            }
        });

        // utilities
        // change scheme
        function changeScheme(schemeName) {
            //{ "columnNames", "tableNames", "comparisons", "functionKeywords", "debugs", "selectors", "widgets", "values", "separators", "properties", "identifiers", "keywords", "normal", "comments", "numbers", "strings", "names", "regexps", "tags" };
            var jsEditorRules = {
                "normal": "#codeSample",
                "names": ".ace_identifier",
                "comparisons": ".ace_keyword.ace_operator",
                "functionKeywords": ".ace_name.ace_function",
                "keywords": ".ace_keyword",
                "regexps": ".ace_regexp",
                "numbers": ".ace_constant.ace_numeric",
                "strings": ".ace_string",
                "comments": ".ace_comment",
                "identifiers": ".ace_identifier",
                "properties": ".ace_support"
            };

            
            // background color
            var elem = $(jsEditorRules.normal).first()[0];
            var color = window.getComputedStyle(elem, null).getPropertyValue("background-color");

            var trimmed = color.slice(4, -1);
            var colors = trimmed.split(",");

            studio.setColor("backColor", colors[0].replace(/\D+/g,''), colors[1].replace(/\D+/g,''), colors[2].replace(/\D+/g,''));
            //console.log('studio.setColor("backColor", "'+colors[0].replace(/\D+/g,'')+'", "'+colors[1].replace(/\D+/g,'')+'", "'+colors[2].replace(/\D+/g,'')+'";');

            for (var i = 0; i < Object.keys(jsEditorRules).length; i++) {
                var jsEditorRuleName = Object.keys(jsEditorRules)[i],
                    jsEditorClass = jsEditorRules[jsEditorRuleName];

                var elem = $(jsEditorClass).first()[0];
                var style = window.getComputedStyle(elem, null);
                var color = style.getPropertyValue("color");

                var trimmed = color.slice(4, -1);
                var colors = trimmed.split(",");

                var bold = style.getPropertyValue("font-weight") == "bold";
                var italic = style.getPropertyValue("font-style") == "italic";
                var underline = style.getPropertyValue("text-decoration") == "underline";

                studio.setStyle(jsEditorRuleName, colors[0].replace(/\D+/g,''), colors[1].replace(/\D+/g,''), colors[2].replace(/\D+/g,''), bold, italic, underline);
                //console.log('studio.setStyle("'+jsEditorRuleName+'", "'+colors[0].replace(/\D+/g,'')+'", "'+colors[1].replace(/\D+/g,'')+'", "'+colors[2].replace(/\D+/g,'')+'", "'+bold+'", "'+italic+'", "'+underline+'");');
            }       
        }

        function changeTheme(themeName) {
            $('#codeSample')[0].className = '';
            $('#codeSample').addClass('ace-'+themeName.replace(/_/g,'-'));
            $('#codeSample').addClass('ace-'+themeName.replace(/_/g,'-')+'-theme');
            studio.setPreferences('codeEditor.colorScheme',themeName);
            // refresh options
            studio.preferences.refreshPreferencesValues(preferencesJson);
        }

        // preview block
        // theme preview
        var schemeName = studio.getPreferences('codeEditor.colorScheme') || 'chrome';
        $(':input[name="colorScheme"]').val(schemeName);
        $(':input[name="colorScheme"]').change(function() {
            var schemeName = this.value;
            // save pref
            changeTheme(schemeName);
            changeScheme(schemeName);
        });
        changeTheme(schemeName);

        // fontFamily preview
        $(':input[name="fontName"]').change(function(){
            $('#codeSample').css('font-family',this.value);
        });
        var $fontList = $(':input[name="fontName"]');
        var fontListValue = studio.getPref('fontName');
        $fontList.val(fontListValue);
        if ($fontList.val() != fontListValue) {
            $fontList.find('option').each(function(i,e){
                var optionValue = $(e).attr('value');
                if (fontListValue.match(optionValue)) {
                    fontListValue = optionValue;
                }
            });
            $fontList.val(fontListValue);
            studio.setPref('fontName',fontListValue);
        }
        $('#codeSample').css('font-family',$(':input[name="fontName"]').val());
        // fontSize preview
        $(':input[name="fontSize"]').change(function(){
            $('#codeSample').css('font-size',this.value+fontUnit);
        });
        $('#codeSample').css('font-size',$(':input[name="fontSize"]').val()+fontUnit);

        // navigation arrows
        $('.select-nav').click(function(e){
            e.preventDefault();
            var $select = $(this).parent().find('select');
            var value = $select.val();
            var $options = $select.children();
            var $option = $select.children('option[value="'+value+'"]');            

            if ($(this).hasClass('prev')) {
                if (parseInt($option.prev().attr('data-n')) >= 0) {
                    $select.val($option.prev().attr('value'));
                    $select.trigger('change');
                } else {
                    $select.val($options[$options.length-1].value);
                    $select.trigger('change');                    
                }
            } else {
                if (parseInt($option.next().attr('data-n')) < $options.length) {
                    $select.val($option.next().attr('value'));
                    $select.trigger('change');
                } else {
                    $select.val($options[0].value);
                    $select.trigger('change');                    
                }
            }
        });
        
        // HTML/CSS code editor trigger change
        $(':input').change(function(){
            studio.sendExtensionWebZoneCommand('wakanda-extension-web-editor', 'IDE.refreshPreferences');
        });

        $('.tab-header a').click(function(e){
            e.preventDefault();
            $('.active').removeClass('active');
            $('.tab-header a').removeClass('active');
            $(this).addClass('active');
            $($(this).attr('href')).addClass('active');
            $('#tab-line').css('left',$(this).offset().left-24);
            $('#tab-line').width($(this).width());
        });
        $('#tab-line').width($('.tab-header a.active').width());
    });
});