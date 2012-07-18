({
    mustDeps: [
        {
            block: 'i-bem',
            elem: 'dom',
            mods: {'init': 'auto'}
        },
        { block: 'i-storage', mods: { 'type' : 'local' } }
    ],
    shouldDeps: [
        {
            block: 'b-dashboard'
        }
    ]
})
