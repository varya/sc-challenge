({
    block: 'b-page',
    title: 'Awesome playlists of SoundCloud',
    js: true,
    head: [
        { elem: 'css', url: '_index.css'},
        { elem: 'css', url: 'http://lab.simurai.com/buttons/buttons.css' },
        { elem: 'css', url: '_index.ie.css', ie: 'lt IE 8' },
        { block: 'i-jquery', elem: 'core' },
        { elem: 'js', url: 'http://connect.soundcloud.com/sdk.js' },
        { elem: 'js', url: 'index.bemhtml.js' },
        { elem: 'js', url: 'index.js' }
    ],
    content: ''
})
