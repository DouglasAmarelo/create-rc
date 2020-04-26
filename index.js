#! /usr/bin/env node

const fs = require('fs');
const path = require('path');

const [, , ...userInputArguments] = process.argv;

// Component name and file extension passed as argument by the user
const [componentName, fileExtension = 'ts'] = userInputArguments;

// Settings of the files that will be created
const filesToCreate = [
  {
    templateFile: 'Component.tsx',
    outputFileName: `${componentName}.${fileExtension}x`,
  },
  {
    templateFile: 'Component.style.ts',
    outputFileName: `${componentName}.${fileExtension}`,
  },
  {
    templateFile: 'index.ts',
    outputFileName: `index.${fileExtension}`,
  },
];

// Function for creating component directory
const createComponentDirectory = () => fs.mkdirSync(`./${componentName}`);

// Function for creating component files
const createComponentFile = (fileName, fileContent) =>
  fs.writeFileSync(`./${componentName}/${fileName}`, fileContent);

// Change the variable @FILE_NAME@ to the component name passed by the user
const replaceTemplateFileData = (fileData) =>
  fileData.replace(/@FILE_NAME@/gim, componentName);

// Create files based on templates
const createFileFromTemplate = (templateFile, outputFileName) => {
  fs.readFile(
    path.resolve(__dirname, 'templates', templateFile),
    'utf8',
    (error, fileData) => {
      if (error) {
        console.error('Houston, we have a problem:', error);
        return;
      }

      const outputFileContent = replaceTemplateFileData(fileData);

      createComponentFile(outputFileName, outputFileContent);
    }
  );
};

// Function to create component folder and files
const createComponent = () => {
  try {
    createComponentDirectory();

    filesToCreate.map(({ templateFile, outputFileName }) => {
      createFileFromTemplate(templateFile, outputFileName);
    });

    console.log(`Finished! The <${componentName} /> was created.`);
  } catch (error) {
    console.error('Houston, we have a problem:', error);
  }
};

// Start application
const start = () => {
  console.log('Starting...');

  if (!componentName) {
    console.error('You have to pass the [ NAME ] of the component');
    return;
  }

  fs.exists(componentName, (exists) => {
    if (exists) {
      console.error('This component already exists.');
      return;
    }

    createComponent();
  });
};

start();
