'use strict';

const reporter = require('jasmine-reporters');
const failFast = require('jasmine-fail-fast');

jasmine.getEnv().addReporter(failFast.init());

jasmine.getEnv().addReporter(
     new reporter.JUnitXmlReporter(
         {
             savePath: './results',
             consolidateAll: true
         }
     )
 );

jasmine.getEnv().addReporter(
  new reporter.TerminalReporter(
    {
       verbosity: 3,
       color: true,
       showStack: true
     }
   )
 );

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
