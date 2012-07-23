({
    mustDeps: [
        { block: 'i-soundcloud' }
    ],
    shouldDeps:[
        {
            block: 'b-form-input',
            mods: { theme: 'blue', size: 'm', type: 'textarea'},
            elems: ['input', 'hint']
        },
        {
            block: 'b-cloud'
        }
    ]
})
