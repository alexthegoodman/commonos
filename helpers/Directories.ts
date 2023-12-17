export default class Directories {
  recursiveSetFolderFiles = (folderId, files, newFolderFile) => {
    if (files) {
      files.forEach((file) => {
        if (file.type === "folder") {
          if (file.id === folderId) {
            file.files.push(newFolderFile);
          }
        }
        console.info("file", folderId, file);
        this.recursiveSetFolderFiles(folderId, file.files, newFolderFile);
      });
    }
  };

  recursiveGetFolderFiles = (folderId, files) => {
    if (files) {
      for (const file of files) {
        if (file.type === "folder") {
          if (file.id === folderId) {
            console.info("match", file);
            return file.files;
          }
          const nestedFiles = this.recursiveGetFolderFiles(
            folderId,
            file.files
          );
          if (nestedFiles) {
            return nestedFiles;
          }
        }
      }
    }
  };
}
