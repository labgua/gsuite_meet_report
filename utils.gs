
/******
 * Make sure it exists the directory /tmp/reports or create it
 ********/
function moveReport(file){
  var copyFile = DriveApp.getFileById( file.getId() );
  var folderReport = DriveApp.getFoldersByName("tmp").next().getFoldersByName("reports").next();
  folderReport.addFile(copyFile);
  DriveApp.getRootFolder().removeFile(copyFile);
}