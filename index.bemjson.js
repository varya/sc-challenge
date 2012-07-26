({
    block: 'b-page',
    title: 'Awesome playlists of SoundCloud',
    js: true,
    head: [
        { elem: 'css', url: '_index.css?v=2'},
        { elem: 'css', url: 'http://lab.simurai.com/buttons/buttons.css' },
        { elem: 'css', url: '_index.ie.css?v=2', ie: 'lt IE 8' },
        { block: 'i-jquery', elem: 'core' },
        { elem: 'js', url: 'http://connect.soundcloud.com/sdk.js' },
        { elem: 'js', url: 'index.bemhtml.js?v=2' },
        { elem: 'js', url: 'index.js?v=2' }
    ],
    content: ''
})
