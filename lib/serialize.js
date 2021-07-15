var xmlbuilder = require('xmlbuilder');
var sanitizeString = require('./sanitize-string');

module.exports = function serialize (testCases) {
  var rootXml = xmlbuilder.create('testExecutions', {
      headless: true
    });
  rootXml.att('version', '1')
  Object.keys(testCases).forEach(function(path) {
    const fileTests = testCases[path];
    var fileElement = rootXml.ele('file');
    var skipped;
    var failureElement;
    fileElement.att('path', path);
    fileTests.forEach(function(unitTest) {
      var testCaseElement = fileElement.ele('testCase')
      testCaseElement.att('name', unitTest.name)
      testCaseElement.att('duration', '10')
      const a = unitTest.test
      if(a.skip) {
          var skippedElement = testCaseElement.ele('skipped');
          skippedElement.att('message', 'Short')
      }
      if(!a.ok && !a.skip) {
          failureElement = testCaseElement.ele('failure');
          failureElement.att('message', 'Error')
          if(a.diag) {
            failureElement.txt(formatFailure(a.diag));
          }
      }
    });
  });

  return rootXml.end({
    pretty: true,
    indent: '  ',
    newline: '\n'
  });
}

function formatFailure(diag) {
  var text = '\n          ---\n';

  for(var key in diag) {
    if(diag.hasOwnProperty(key) && diag[key] !== undefined) {
      var value = diag[key];
      text += '            '+key+': ' + (typeof value === 'object' ? JSON.stringify(value) : value) + '\n';
    }
  }

  text += '          ...\n      ';

  return text;
}
