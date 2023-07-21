var xml = require('./xml_preparing')
var util = require('./utils')
var path = require('path')



var FileManager = require('./base_interface');
var DiskFileManager = function(options){}
DiskFileManager.prototipe = new FileManager({});




DiskFileManager.prototype.getFolders = function( $resourceType, $currentFolder ){
  // Map the virtual path to the local server path.
  var serverDir = util.serverMapFolder( $resourceType, $currentFolder, 'GetFolders' ) ;
  var foldersAndFiles = util.getFilesAndFolders(serverDir);
  var xmlFoldersObj = xml.prepareFoldersObject(foldersAndFiles.folders);
  return [xmlFoldersObj] 
}

DiskFileManager.prototype.getFoldersAndFiles = function( resourceType, currentFolder ){
  // Map the virtual path to the local server path.
  var serverDir = util.serverMapFolder( resourceType, currentFolder, 'GetFoldersAndFiles' ) ;
  var foldersAndFiles = util.getFilesAndFolders(serverDir);
  var xmlFoldersObj = xml.prepareFoldersObject(foldersAndFiles.folders);
  var xmlFilesObj = xml.prepareFilesObject(foldersAndFiles.files);
  return [xmlFoldersObj, xmlFilesObj] 
}

DiskFileManager.prototype.createFolder = function( resourceType, currentFolder, newFolderName ){
  var errorNumber = '0';
  var errorMsg    = '';

  if ( newFolderName ){
    newFolderName = util.sanitizeFolderName( newFolderName ) ;
    // Map the virtual path to the local server path of the current folder.
    var serverDir = util.serverMapFolder( resourceType, currentFolder, 'CreateFolder' ) ;

    try{
      util.createDirIfNotExists( '', serverDir + newFolderName ) ;
    } catch(err){
      erro
      rNumber = '103' ;
    }
  } else {
    errorNumber = '102' ;
  }

  return {number: errorNumber, text: errorMsg}
}


DiskFileManager.prototype.fileUpload = function(req, resourceType, currentFolder, sCommand, callback ){

  var errorNumber = 0 ;
  var fileName = '' ;
  var serverDir = util.serverMapFolder( resourceType, currentFolder, sCommand ) ;


  var defaultStorageOptions = {
    dirname: serverDir,
    maxBytes: 2000000,
    saveAs: function (__newFileStream,cb) { cb(null, __newFileStream.filename); } 
  }

  var fileFieldName = sCommand == 'QuickUpload' ? 'upload' : 'NewFile';

  req.file(fileFieldName).upload(defaultStorageOptions, function (err, uploadedFiles) {
    if(uploadedFiles.length){
      fileName = uploadedFiles[0].filename;
      var fileUrl = util.combinePaths( util.getResourceTypePath( resourceType, sCommand ) , currentFolder ) ;
      fileUrl = util.combinePaths( fileUrl, fileName ) ;
      return callback(err, {errorNumber: errorNumber, fileUrl: fileUrl, fileName: fileName, customMsg: ''})
    }
  });
}




module.exports = DiskFileManager