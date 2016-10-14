module.exports.getData = function(req, res){
    var datasource = req.params.datasource;
    var type = req.params.type;
    console.log('datasource: ' + datasource + ' type: ' + type);
    res.status(200).json({'error':null, 'data':'test data'});

};