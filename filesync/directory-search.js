'use babel';

var fs = require('fs');
var count = 0;


module.exports = {

    readFiles: function(dirname, onFile, onError) {
        var obj = this;
        if(count > 10) {
          return;
        }
        fs.readdir(dirname, function(err, filenames) {
            if (err) {
                onError(err);
                return;
            }
            filenames.forEach(function(filename) {
                if (filename.charAt(0) === '.') return;
                var path = dirname + '/' + filename;
                if (fs.lstatSync(path).isDirectory()) {
                    obj.readFiles(path, onFile, function(err) {
                        console.log(err);
                    })
                } else {
                    onFile(path, filename);
                }
            });
        });
    },

    makeDirectories: function(directory, sep) {
        var directoryArray  = directory.split(sep);
        directoryArray.pop();
        directoryArray.shift();
        console.log(directoryArray);
        var directoryCheckArray = [];
        for(var i = 0; i < directoryArray.length; i++) {
            directoryCheckArray.push(directoryArray[i]);
            checkDir = sep+directoryCheckArray.join(sep);
            //console.log(checkDir);
            try {
                fs.mkdirSync(checkDir);
                //console.log('made Dir: '+checkDir);
            } catch(e) {
                //console.log('is there');
            }

        }
    }
}
