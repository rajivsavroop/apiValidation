'use strict';
const request = require('request');
let {slackObj} = require('./a.fileUpload.spec.js');

describe(
    'File Delete APIs Specs ====>',
    function(){
        it(
            'Error Scenario - Verifies an error is thrown if a non existing/invalid file id is passed in file.delete request',
            deleteWithInvalidFile
        );

        it(
            'Error Scenario - Verifies that an error is thrown and the user shall not be able to delete a file is an invalid token is passed to the request',
            deleteFileInvalidToken
        );

        it(
            'Error Scenario - Verifies that an error is thrown and the user shall not be able to delete a file when token is not passed to the request',
            deleteFileNoToken
        );

        it(
            'Verifies that the user shall be able to delete file with a valid request',
            deleteUploadedFile
        );

        it(
            'Error Scenario - Verifies an error is thrown if a deleted file id is passed in file.delete request',
            deleteWithDeletedFile
        );

        it(
            'Verifies that file object is returned empty in file.list request after the file is deleted',
            checkDeletedFile
        );

        /**
         * Verifies an error is thrown if a non existing/invalid file id is passed in file.delete request
         * @param  {Function} done exits test
         * @return {[type]}        [description]
         */
        function deleteWithInvalidFile(done){
            request(
                {
                    method: 'POST',
                    url: slackObj.slackUrl+'/files.delete',
                    formData:{
                        token:slackObj.token,
                        file:'invalidFile'
                    }
                },
                /**
                 * Callback function for request
                 * @param  {[type]} err  [error]
                 * @param  {[type]} data [response]
                 * @param  {[type]} body [response body]
                 * @return {[void]}      [description]
                 */
                function testCase(err, data, body) {
                    slackObj.errorHandler(err, done);
                    expect(data.statusCode).toBe(200);
                    let responseBody = JSON.parse(body);
                    expect(responseBody.ok).toBe(false);
                    expect(responseBody.error).toBe('file_not_found');
                    done();
                }
            )
        }

        /**
         * Verifies that an error is thrown and the user shall not be able to delete a file is an invalid token is passed to the request
         * @param  {Function} done exits testCase
         * @return {void}        [description]
         */
        function deleteFileInvalidToken(done){
            request(
                {
                    method: 'POST',
                    url: slackObj.slackUrl+'/files.delete',
                    formData:{
                        token:'thisIsInvalid',
                        file:slackObj.fileList[0].id
                    }
                },
                /**
                 * Callback function for request
                 * @param  {[type]} err  [error]
                 * @param  {[type]} data [response]
                 * @param  {[type]} body [response body]
                 * @return {[void]}      [description]
                 */
                function testCase(err, data, body) {
                    slackObj.errorHandler(err, done);
                    expect(data.statusCode).toBe(200);
                    let responseBody = JSON.parse(body);
                    expect(responseBody.ok).toBe(false);
                    expect(responseBody.error).toBe('invalid_auth');
                    done();
                }
            )
        }

        /**
         * Verifies that an error is thrown and the user shall not be able to delete a file when token is not passed to the request
         * @param  {Function} done [description]
         * @return {[type]}        [description]
         */
        function deleteFileNoToken(done){
            request(
                {
                    method: 'POST',
                    url: slackObj.slackUrl+'/files.delete',
                    formData:{
                        token:'',
                        file:slackObj.fileList[0].id
                    }
                },
                /**
                 * Callback function for request
                 * @param  {[type]} err  [error]
                 * @param  {[type]} data [response]
                 * @param  {[type]} body [response body]
                 * @return {[void]}      [description]
                 */
                function testCase(err, data, body) {
                    slackObj.errorHandler(err, done);
                    expect(data.statusCode).toBe(200);
                    let responseBody = JSON.parse(body);
                    expect(responseBody.ok).toBe(false);
                    expect(responseBody.error).toBe('not_authed');
                    done();
                }
            )
        }

        /**
         * Verifies that the user shall be able to delete file with a valid request
         * @param  {Function} done exits testCase
         * @return {void}        [description]
         */
        function deleteUploadedFile(done){
            slackObj.deletedFileId = slackObj.fileList[0].id;
            request(
                {
                    method: 'POST',
                    url: slackObj.slackUrl+'/files.delete',
                    formData:{
                        token:slackObj.token,
                        file: slackObj.fileList[0].id
                    }
                },
                /**
                 * Callback function for request
                 * @param  {[type]} err  [error]
                 * @param  {[type]} data [response]
                 * @param  {[type]} body [response body]
                 * @return {[void]}      [description]
                 */
                function testCase(err, data, body) {
                    slackObj.errorHandler(err, done);
                    expect(data.statusCode).toBe(200);
                    let responseBody = JSON.parse(body);
                    expect(responseBody.ok).toBe(true);
                    done();
                }
            )
        }

        /**
         * Verifies an error is thrown if a deleted file id is passed in file.delete request
         * @param  {Function} done [description]
         * @return {[type]}        [description]
         */
        function deleteWithDeletedFile(done){
            request(
                {
                    method: 'POST',
                    url: slackObj.slackUrl+'/files.delete',
                    formData:{
                        token:slackObj.token,
                        file:slackObj.deletedFileId
                    }
                },
                /**
                 * Callback function for request
                 * @param  {[type]} err  [error]
                 * @param  {[type]} data [response]
                 * @param  {[type]} body [response body]
                 * @return {[void]}      [description]
                 */
                function testCase(err, data, body) {
                    slackObj.errorHandler(err, done);
                    expect(data.statusCode).toBe(200);
                    let responseBody = JSON.parse(body);
                    expect(responseBody.ok).toBe(false);
                    expect(responseBody.error).toBe('file_deleted');
                    done();
                }
            )
        }

        /**
         * Verifies that file object is returned empty in file.list request after the file is deleted
         * @param  {Function} done [description]
         * @return {[type]}        [description]
         */
        function checkDeletedFile(done){
            request(
                {
                    method: 'POST',
                    url: slackObj.slackUrl+'/files.list',
                    formData:{
                        token:slackObj.token,
                        user:slackObj.fileBody.user,
                        types:"all"
                    }
                },
                /**
                 * Callback function for request
                 * @param  {[type]} err  [error]
                 * @param  {[type]} data [response]
                 * @param  {[type]} body [response body]
                 * @return {[void]}      [description]
                 */
                function testCase(err, data, body) {
                    slackObj.errorHandler(err, done);
                    expect(data.statusCode).toBe(200);
                    let responseBody = JSON.parse(body);
                    expect(responseBody.files.length).toBe(0);
                    expect(responseBody.ok).toBe(true);
                    done();
                }
            )
        }
    }
)
