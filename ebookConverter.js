'use strict';

var spawn = Npm.require('child_process').spawn;

//var re = /(?:\.([^.]+))?$/;
var _sourceDir = '/tmp/', _targetDir = '/tmp/', _defaultParams = [];
/* global UniEBookConverter: true */
UniEBookConverter = {
    setSourceDirectory: function(path){
        _sourceDir = path;
    },
    setTargetDirectory: function(path){
        _targetDir = path;
    },
    setDefaultArguments: function(params){
        _defaultParams = params;
    },
    doConvert: function(options, cb){
        if(!_.isFunction(cb)){
            cb = function(err){
              if(err){
                  console.error(err);
              }
            };
        }
        var callback = _.once(Meteor.bindEnvironment(cb));
        if(!_.isObject(options)){
            throw new Meteor.Error('Options must be an object with keys: "source", "target"');
        }
        var source = _sourceDir + options.source;
        var target = _targetDir + options.target;
        var params = [source, target];
        params = params.concat(_defaultParams);
        if (UniUtils.get(options, 'arguments.length')) {
            params = params.concat(options.arguments)
        }
        //var targetType = re.exec(target);
        var _log = '';
        var _errorLog = '';

        var convert = spawn('ebook-convert', params);
        convert.stdout.setEncoding('utf8');
        convert.stdout.on('data', function(data){
            _log += data.toString();
        });
        convert.stderr.on('data', function(err){
            _errorLog += err.toString();
        });
        convert.on('error', function(err){
            callback(err, {log: _log, errorLog: _errorLog});
        });
        convert.on('exit', function(code){
            callback(code, {log: _log, errorLog: _errorLog});
        });

    }
};

//Test if we have installed ebook-convert...
var _v = '';
var _s = spawn('ebook-convert', ['--version']).on('error', function(err){
    if(err){
        console.error('Do you have calibre ebook-convert installed? Please visit http://calibre-ebook.com/download_linux', err);
    }
});
_s.stdout.on('data', function(data){
    _v += data.toString();
});
_s.on('exit', function(){
    _v = /[0-9]+.[0-9]+.[0-9]+/.exec(_v);
    if(_.isArray(_v)){
        _v = _v.join();
    }
    console.log('=> Calibre found in version: '+ (_v || 'unknown'));
});