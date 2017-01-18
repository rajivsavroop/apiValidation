'use strict';
const request = require('request');
const fs = require('fs');
const path = require('path');



const slackObj = {
    slackUrl:'https://slack.com/api/',
    fileBody:false,
    token:'REGISTER FOR YOUR TOKEN"
    deletedFileId: false
}

describe(
    'File Upload APIs Specs ====> ',
    function(){

        it(
            'Verifies that the file to be uploaded meets user requirement',
            checkImage
        )

        it(
            'Verifies that the provided token is valid',
            checkToken
        );

        it(
            'Verifies that at the beginning the user shall not have any existing file associated with it',
            checkFileObject
        );

        it(
            'Error Scenario - Verifies that an error is thrown when the file is missing in the request',
            missingFile
        );

        it(
            'Error Scenario - Verifies that an error is thrown and user shall not be upload file with an invalid token',
            uploadWithInvalidToken
        );

        it(
            'Error Scenario - Verifies that an error is thrown and user shall not be upload file without a token',
            uploadWithoutToken
        );

        it(
            'Verifies that the user shall be able to upload a PNG file',
            uploadImage
        );

        it(
            'Verifies that the file object has all the expected thumb URLs',
            checkUrl
        );

        /**
         * Global Error handler
         * @param  {[type]}   err  [description]
         * @param  {Function} done [exits test]
         * @return {void}        [description]
         */
        slackObj.errorHandler = function (err, done){
            if(err){
                expect(err).toBe(false);
                done()
            }
        };

        /**
         * Verifies that the file to be uploaded meets user requirement
         * @param  {Function} done [exits test]
         * @return {void}        [description]
         */
        function checkImage(done){
            let fileStats = fs.statSync('./SIMPSON.png');
            console.log(fileStats);
            let fileSize = fileStats['size']/1000000.0;
            let extension = path.extname('./SIMPSON.png');
            expect(extension).toBe('.png');
            expect(fileSize).toBeLessThan(1);
            done();
        }


        /**
         * Verifies that the provided token is valid
         * @param  {Function} done [exits test]
         * @return {[type]}        [description]
         */
        function checkToken(done){
            request(
                {
                    method: 'POST',
                    url: slackObj.slackUrl+'/auth.test',
                    formData:{
                        token:slackObj.token
                    }
                },
                /**
                 * Callback function for request
                 * @param  {[type]} err  [error]
                 * @param  {[type]} data [response]
                 * @param  {[type]} body [response body]
                 * @return {[void]}      [description]
                 */
                function testCase(err,data, body) {
                    slackObj.errorHandler(err, done);
                    expect(data.statusCode).toBe(200);
                    let responseBody = JSON.parse(body);
                    expect(responseBody.ok).toBe(true);
                    expect(responseBody.url).toBeDefined();
                    expect(responseBody.team).toBeDefined();
                    expect(responseBody.user).toBeDefined();
                    expect(responseBody.team_id).toBeDefined();
                    expect(responseBody.user_id).toBeDefined();
                    done();
                }
            )
        }

        /**
         * Verifies that at the beginning the user shall not have any existing file associated with it
         * @param  {Function} done [exits test]
         * @return {void}        [description]
         */
        function checkFileObject(done){
            console.log('==== Waiting for 10 seconds to ensure test can read file object ====');
            let fileResponse = false;
            setTimeout(
                fileListRequest,
                10000
            );

            /**
             * checks for fileList
             */
            function fileListRequest(){
                request(
                    {
                        method: 'POST',
                        url: slackObj.slackUrl+'/files.list',
                        formData:{
                            token:slackObj.token,
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
                        fileResponse = responseBody.files;
                        if(fileResponse.length == 0){
                            console.log('No existing files found, exiting test case now');
                            done()
                        }else{
                            deleteFiles();
                        }
                    }
                )
            }

            /**
             * Deletes the files in fileobject to start the test
             */
            function deleteFiles(){
                let fileCount = 0;
                makeRequest();
                function makeRequest(){
                    request(
                        {
                            method: 'POST',
                            url: slackObj.slackUrl+'/files.delete',
                            formData:{
                                token:slackObj.token,
                                file:fileResponse[fileCount].id
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
                            fileCount++;
                            if(fileCount >= fileResponse.length){
                                console.log('Done Deleting - EXITING TESTS');
                                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                                done()
                            }else{
                                makeRequest();
                            }
                        }
                    )
                }
            }
        }

        /**
         * Verifies that an error is thrown when the file is missing in the request
         * @param  {Function} done exit test
         * @return {void}        [description]
         */
        function missingFile(done){
            let reqData = {
                token:slackObj.token
            };
            request(
                {
                    method:'POST',
                    url: slackObj.slackUrl+'/files.upload',
                    'Content-Type': 'multipart/form-data',
                    formData:reqData
                },
                /**
                 * Callback function for request
                 * @param  {[type]} err  [error]
                 * @param  {[type]} data [response]
                 * @param  {[type]} body [response body]
                 * @return {[void]}      [description]
                 */
                function testCase(err, data, body){
                    slackObj.errorHandler(err, done);
                    let response = JSON.parse(body);
                    expect(response.ok).toBe(false);
                    expect(response.error).toBe('no_file_data');
                    done();
                }
            )
        }

        /**
         * Verifies that an error is thrown and user shall not be upload file with an invalid token
         * @param  {Function} done exits test
         * @return {void}        [description]
         */
        function uploadWithInvalidToken(done){
            let reqData = {
                token:'jijfiejfier',
                file: fs.createReadStream('./SIMPSON.png'),
                filename:'SIMPSON.png'
            };

            request(
                {
                    method:'POST',
                    url: slackObj.slackUrl+'/files.upload',
                    'Content-Type': 'multipart/form-data',
                    formData:reqData
                },
                /**
                 * Callback function for request
                 * @param  {[type]} err  [error]
                 * @param  {[type]} data [response]
                 * @param  {[type]} body [response body]
                 * @return {[void]}      [description]
                 */
                function testCase(err, data, body){
                    slackObj.errorHandler(err, done);
                    let response = JSON.parse(body);
                    expect(response.ok).toBe(false);
                    expect(response.error).toBe('invalid_auth');
                    done();
                }
            )
        }

        /**
         * Verifies that an error is thrown and user shall not be upload file without a token
         * @param  {Function} done exit test
         * @return {void}        [description]
         */
        function uploadWithoutToken(done){
            let reqData = {
                file: fs.createReadStream('./SIMPSON.png'),
                filename:'SIMPSON.png'
            };

            request(
                {
                    method:'POST',
                    url: slackObj.slackUrl+'/files.upload',
                    'Content-Type': 'multipart/form-data',
                    formData:reqData
                },
                /**
                 * Callback function for request
                 * @param  {[type]} err  [error]
                 * @param  {[type]} data [response]
                 * @param  {[type]} body [response body]
                 * @return {[void]}      [description]
                 */
                function testCase(err, data, body){
                    slackObj.errorHandler(err, done);
                    let response = JSON.parse(body);
                    expect(response.ok).toBe(false);
                    expect(response.error).toBe('not_authed');
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 40000;
                    done();
                }
            )
        }

        /**
         * Verifies that the user shall be able to upload a PNG file
         * @param  {Function} done exit test
         * @return {void}        [description]
         */
        function uploadImage(done){
            let reqData = {
                token:slackObj.token,
                file: fs.createReadStream('./SIMPSON.png'),
                filename:'SIMPSON.png'
            };

            request(
                {
                    method:'POST',
                    url: slackObj.slackUrl+'/files.upload',
                    'Content-Type': 'multipart/form-data',
                    formData:reqData
                },
                /**
                 * Callback function for request
                 * @param  {[type]} err  [error]
                 * @param  {[type]} data [response]
                 * @param  {[type]} body [response body]
                 * @return {[void]}      [description]
                 */
                function testCase(err, data, body){
                    slackObj.errorHandler(err, done);
                    let response = JSON.parse(body);
                    slackObj.fileBody = response.file;
                    expect(response.ok).toBe(true);
                    expect(slackObj.fileBody.id).not.toBe(null);
                    expect(slackObj.fileBody.user).not.toBe(null);
                    expect(slackObj.fileBody.name).toBe('SIMPSON.png');
                    expect(slackObj.fileBody.filetype).toBe('png');
                    expect(slackObj.fileBody.url_private).toBeDefined();
                    expect(slackObj.fileBody.url_private_download).toBeDefined();
                    done();
                }
            )
        }

        /**
         * Verifies that the file object has all the expected thumb URLs
         * @return {void} [description]
         */
        function checkUrl(){
            let expectedUrls = [
                'thumb_64', 'thumb_80', 'thumb_160',
                'thumb_360','thumb_480','thumb_720',
                'thumb_960','thumb_1024'
            ];
            let fileName = (slackObj.fileBody.name.toLowerCase()).split('.');
            console.log(slackObj.fileBody);
            for (var i in slackObj.fileBody){
                if(i.includes('thumb') && typeof slackObj.fileBody[i] == 'string'){
                    expect(expectedUrls.indexOf(i)).toBeGreaterThan(-1);
                    expect(slackObj.fileBody[i].includes(fileName[0])).toBe(true);
                    expect(slackObj.fileBody[i].substr(slackObj.fileBody[i].length - 3)).toBe('png');
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

                }
            }
        }
    }
)

module.exports.slackObj = slackObj;
