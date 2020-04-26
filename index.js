#! /usr/bin/env node

const fs = require('fs');

const [, , ...userInputArguments] = process.argv;

// Name of the component and file extension passed bt user as an argument
const [componentName, fileExtension = 'ts'] = userInputArguments;

const createComponentDirectory = () => fs.mkdirSync(`./${componentName}`);

const createComponentFile = (fileName, fileContent) =>
  fs.writeFileSync(`./${componentName}/${fileName}`, fileContent);

const replaceTemplateFileData = (fileData) =>
  fileData.replace(/@FILE_NAME@/gim, componentName);

const errorMessage = (error) =>
  console.error('Houston, we have a problem:', error);

const createFileFromTemplate = (templateFile, outputFile) => {
  fs.readFile(`./templates/${templateFile}`, 'utf8', (error, fileData) => {
    error && errorMessage({ createFileFromTemplate: error });

    const newFileData = replaceTemplateFileData(fileData);

    createComponentFile(outputFile, newFileData);
  });
};

const start = () => {
  console.log('Starting...');

  if (!componentName) {
    console.error('You have to pass the [ NAME ] of the component');
    return;
  }

  try {
    createComponentDirectory();
    createFileFromTemplate(
      'Component.tsx',
      `${componentName}.${fileExtension}x`
    );
    createFileFromTemplate(
      'Component.style.ts',
      `${componentName}.${fileExtension}`
    );
    createFileFromTemplate('index.ts', `index.${fileExtension}`);

    console.log(`Finished! The <${componentName} /> was created.`);
  } catch (error) {
    errorMessage({ start: error });
  }
};

start();
