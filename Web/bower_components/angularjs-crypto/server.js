var connect = require('connect');
var serveStatic = require('serve-static');
var url = require('url');
var port = Number(process.env.PORT || 9000);
connect().
    use('/data/get/aes', function getaes(req, res, next) {
        var obj = { items: [ {name_enc: "XJWoMnnOlSF3tFoU4jn4gg==", value_enc: "l0gZvr5oiHds8nQpqe0Kqg==", plain: "Hallo"},
                            {name_enc: "XJWoMnnOlSF3tFoU4jn4gg==", value_enc: "l0gZvr5oiHds8nQpqe0Kqg==", plain: "Hallo"},
                            {name_enc: "XJWoMnnOlSF3tFoU4jn4gg==", value_enc: "l0gZvr5oiHds8nQpqe0Kqg=="} ],
                    count: 3};
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(obj));    
        next();
    }).
    use('/data/query', function getaes(req, res, next) {
        var query = url.parse(req.url, true).query;
        var obj = {query: query};
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(obj));    
        next();
    }).
    use('/data/get/des', function getaes(req, res, next) {
        var obj = { items: [ {name_enc: "AFx0ylylXKZG3Fp1veuO+g==", value_enc: "kDlxDGGIm2w=", plain: "Hallo"},
                            {name_enc: "AFx0ylylXKZG3Fp1veuO+g==", value_enc: "kDlxDGGIm2w=", plain: "Hallo"},
                            {name_enc: "AFx0ylylXKZG3Fp1veuO+g==", value_enc: "kDlxDGGIm2w="} ],
                    count: 3};
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(obj));    
        next();
    }).
    use('/data/decrypt', function echo(req, res, next) {
        res.writeHead(200, {"Content-Type": "application/json_enc"});
        req.pipe(res);
    }).
    use('/data', function echo(req, res, next) {
        res.writeHead(200);
        req.pipe(res);
        next();
    }).
    use(serveStatic(__dirname+'/public')).
    listen(port);
