var fs   = require("fs");
var path = require("path");
var directorySearch = require('./directory-search.js');
//
var count = 0;
var configFile = __dirname+"/autosync.json";
if (process.argv.length == 3) {
    configFile = process.argv[2];
}
var config = JSON.parse(fs.readFileSync(configFile, "UTF-8"));

config.repatterns = [];
for (var i = 0; i < config.patterns.length; i++) {
    config.repatterns.push(new RegExp(config.patterns[i], "i"));
}


console.log("------------------------------------------");
console.log("Autosync - Revision 0");
console.log("------------------------------------------");
console.log("Source:      " + config.source);
console.log("Destination: " + config.destination);
console.log("Patterns:    " + config.repatterns);
console.log("------------------------------------------");


function dups(a, b) {
    var i = 0;
    var j = 0;
    var r = [];

    a.sort();
    b.sort();

    while (i < a.length && j < b.length) {
        if (a[i] == b[j]) {
            r.push(a[i]);
            i++;
            j++;
        }
        else {
            if (a[i] < b[j])
                i++;
            else
                j++;
        }
    }

    return r;
}

function copy(source, dest, cb) {

    var rs = fs.createReadStream(source);

    fs.writeFileSync(dest, rs);
    rs.close();
    cb();
    console.log('file coppied');

}

function watchFile(source, dest) {
    count++;
    console.log(count);

    try {
        var file = path.basename(source);
        //console.log("watching " + source);
        fs.watchFile(source, function (curr, prev) {

            console.log('fired');
            copy(source, dest, function (err) {
                if (err) {
                    console.log("failed to copy " + file);
                    // TODO retry?
                }
                else {
                    console.log("copied " + file);
                }
            });
        });
    }catch(e){
        console.log('no file watching');
    }
}
//console.log(directorySearch);
var sourceDir = config.source;
var destDir = config.destination;
directorySearch.readFiles(sourceDir, function(filePath, file){
    var dest = filePath.split(sourceDir).join(destDir);
    //console.log('file check: '+ dest);
    if(fs.existsSync(dest)) {
        //console.log('file exists: '+dest);
        watchFile(filePath, dest);
    }else{
        var directory = dest.replace(file, '');
        //console.log(directory);
        try {
            //console.log('check dir: ');
            fs.statSync(directory);
        } catch(e) {
            try {
                //fs.mkdirSync(directory);
                directorySearch.makeDirectories(directory, path.sep);
            } catch(e) {
                //  directory = directory.split(path.sep);
                //  directory.pop();
                //  directory.pop();
                //  directory = directory.join(path.sep);
                //  console.log('path: '+ directory);
                //  console.log('dest: '+ dest);
                //  fs.mkdirSync(directory);
                console.log(e)
            }
        }
        copy(filePath, dest, function (err) {
            if (err) {
                console.log("failed to copy " + file);
                // TODO retry?
            }
            else {
                console.log("copied " + file);
                watchFile(filePath, dest);
            }
        });
    }

});
