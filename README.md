# Universe eBook Converter is wrapper around command-line tool of Calibre
Convert an ebook from one format to another
This plugin is dedicated to universe environment but it can work as regular meteor plugin.

## Installation:

To install or upgrade, simply copy paste the following command into a terminal and press Enter:

```
sudo -v && wget -nv -O- https://raw.githubusercontent.com/kovidgoyal/calibre/master/setup/linux-installer.py | sudo python -c "import sys; main=lambda:sys.stderr.write('Download failed\n'); exec(sys.stdin.read()); main()"
```

Tips: if you have problems with installation of calibre try install:

```
sudo apt-get install xdg-utils qt4-default imagemagick python-imaging python-mechanize python-lxml python-dateutil python-cssutils python-beautifulsoup python-dnspython python-poppler libpodofo-utils libwmf-bin python-chm
```

#### Add package to meteor 

```
$ meteor add vazco:universe-ebook-converter
```

## How To Use:

```
UniEBookConverter.doConvert({
    'source': 'testov.html',
    'target': 'testo.pdf',
    //optionals
    arguments: [
        ['base-font-size', '12'],
        ['extra-css', 'test.css']
      ]
}, function(err, res){ //callback called on the end of process, where res = {log, errorLog} || null
    console.log(err, res);
});
```


The default directory for source and target is '/tmp/'
but you can change it using those methods:

```
UniEBookConverter.setSourceDirectory('/home/cristo/tmp/');
UniEBookConverter.setTargetDirectory('/home/cristo/tmp/');
```
If you want specify default options, you can do it using:

```
UniEBookConverter.setDefaultArguments([['base-font-size', '12'], ['extra-css', 'test.css']]);
```

## Options
Options depend on calibre version, details are here: http://manual.calibre-ebook.com/cli/ebook-convert.html
Each option we pass as 2 elements array [name, value], where name of option is without prefix '--'

## License:
MIT

