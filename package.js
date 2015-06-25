Package.describe({
    name: 'vazco:universe-ebook-converter',
    summary: 'Convert an ebook from one format to another. Supported eg. files kindle, pdf, azw3, epub, mobi, docx',
    version: '1.0.3',
    git: 'https://github.com/cristo-rabani/universe-ebook-converter.git'
});

Package.onUse(function (api) {
    api.versionsFrom(['METEOR@1.0']);
    api.use([
        'underscore',
        'vazco:universe-utilities@1.1.6'
    ], ['server']);
    api.add_files('ebookConverter.js', 'server');
    api.export(['UniEBookConverter']);
});
