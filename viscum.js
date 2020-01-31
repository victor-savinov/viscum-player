/*------------------------------------------------------------------------------
>>> «VISCUM»
--------------------------------------------------------------------------------
# API
# Player
# Controls
  ## Progress Bar
# Styles
------------------------------------------------------------------------------*/

function Viscum(query, options) {
    var api = {},
        api_src = {
            youtube: 'https://www.youtube.com/iframe_api',
            vimeo: 'https://player.vimeo.com/api/player.js'
        },
        paused = true,
        player = document.createElement('div'),
        player_video = document.createElement('div'),
        player_controls = document.createElement('div'),
        now = Date.now(),
        playlist = [];


    /*------------------------------------------------------------------------------
    # API
    ------------------------------------------------------------------------------*/

    function addScript(src) {
        var script = document.createElement('script');

        script.src = src;

        document.body.appendChild(script);
    }

    function initPlaylist() {
        playlist = [];

        for (var i = 0, l = options.videos.length; i < l; i++) {
            var video = options.videos[i];

            playlist.push({
                type: video.indexOf('www.youtube.com') !== -1 ? 0 : 1,
                id: new URL(video).searchParams.get('v')
            });
        }

        //console.log(playlist);
    }

    function init() {
        initPlaylist();

        api = new YT.Player('viscum-player__video-' + now, {
            videoId: playlist[0].id,
            playerVars: {
                autoplay: 0,
                controls: 0,
                modestbranding: 1,
                rel: 0,
                showinfo: 0
            }
        });
    }

    if (window.hasOwnProperty('YT') === false) {
        addScript(api_src.youtube);

        if (typeof window.onYouTubeIframeAPIReady !== 'function') {
            window.onYouTubeIframeAPIReady = init;
        } else {
            window.onYouTubeIframeAPIReady = (function(original) {
                return function() {
                    init();

                    original();
                };
            })(window.onYouTubeIframeAPIReady);
        }
    } else {
        init();
    }


    /*------------------------------------------------------------------------------
    # PLAYER
    ------------------------------------------------------------------------------*/

    player.className = 'viscum-player';
    player_video.className = 'viscum-player__video';
    player_controls.className = 'viscum-player__controls';

    player_video.id = 'viscum-player__video-' + now;

    player.appendChild(player_video);
    player.appendChild(player_controls);


    /*------------------------------------------------------------------------------
    # CONTROLS
    ------------------------------------------------------------------------------*/

    /*------------------------------------------------------------------------------
    ## PROGRESS BAR
    ------------------------------------------------------------------------------*/

    var progress_bar = document.createElement('div');

    progress_bar.className = 'viscum-player__progress-bar';

    player_controls.appendChild(progress_bar);


    /*------------------------------------------------------------------------------
    ## PLAY / PAUSE
    ------------------------------------------------------------------------------*/

    var play_pause = document.createElement('div');

    play_pause.className = 'viscum-player__play';
    play_pause.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 000-1.69L9.54 5.98A.998.998 0 008 6.82z"/></svg><svg viewBox="0 0 24 24"><path d="M8 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2v10c0 1.1.9 2 2 2zm6-12v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2z"/></svg>';

    play_pause.addEventListener('click', function() {
        if (paused === true) {
            api.playVideo();

            player.setAttribute('playing', '');

            paused = false;
        } else {
            api.pauseVideo();

            player.removeAttribute('playing');

            paused = true;
        }
    });

    player_controls.appendChild(play_pause);


    /*------------------------------------------------------------------------------
    # STYLES
    ------------------------------------------------------------------------------*/

    var styles = document.createElement('style');

    styles.textContent = [
        '.viscum-player {',
        '	background: #000;',
        '	overflow: hidden;',
        '}',

        '.viscum-player__video {',
        '	display: block;',
        '	pointer-events: none;',
        '}',

        '.viscum-player__controls {',
        '	display: flex;',
        '	height: 48px;',
        '	background: #000;',
        '	justify-content: space-between;',
        '	align-items: center;',
        '}',

        '.viscum-player__progress-bar {',
        '	position: absolute;',
        '}',

        '.viscum-player__controls svg {',
        '	display: block;',
        '	width: 32px;',
        '	height: 32px;',
        '	fill: #FAFAFA;',
        '}',

        '.viscum-player__play {',
        '	width: 32px;',
        '	height: 32px;',
        '	padding: 4px;',
        '	margin: 4px;',
        '	cursor: pointer;',
        '	opacity: .8;',
        '}',

        '.viscum-player__play:hover {',
        '	opacity: 1;',
        '}',

        '.viscum-player__play svg {',
        '	position: absolute;',
        '}',

        '.viscum-player[playing] .viscum-player__play svg:last-child {',
        '	visibility: visible;',
        '}',

        '.viscum-player .viscum-player__play svg:last-child,',
        '.viscum-player[playing] .viscum-player__play svg:first-child {',
        '	visibility: hidden;',
        '}'
    ].join('');

    player.appendChild(styles);

    document.querySelector(query).appendChild(player);
};