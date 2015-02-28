'use strict';

var exec = Npm.require('child_process').exec;
var os = Meteor.npmRequire('os');
var path = Meteor.npmRequire('path');

//var re = /(?:\.([^.]+))?$/;
var _sourceDir = os.tmpDir(), _targetDir = os.tmpDir(), _defaultParams = [];
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
        var source = path.join(_sourceDir, options.source);
        var target = path.join(_targetDir, options.target);
        var params = [];
        params = concatArrays(params, _defaultParams);

        if (UniUtils.get(options, 'arguments.length')) {
            params = concatArrays(params, options.arguments);
        }
        params = _.map(params, function(p){
            if(_.isArray(p)){
                p[0] = '--'+p[0];
                if(p[1] && _.isString(p[1])){
                    p[1] = '"'+p[1].replace('"', '\"')+'"'
                }
                p = p.join(' ');
            }
            return p;
        });
        var _log = '';
        var _errorLog = '';
        params = params.join(' ');
        var convert = exec('ebook-convert ' +source+ ' ' + target + ' ' + params);
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

var concatArrays = function(orgArr, toAddArr){
    _.each(toAddArr, function(p){
        if(!_.isArray(p)){
            throw new Meteor.Error('Any parameter must be in an array! [name, value]');
        }
        orgArr.push(p);
    });
    return orgArr;
};
//Test if we have installed ebook-convert...
var _v = '';
var _s = exec('ebook-convert --version').on('error', function(err){
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