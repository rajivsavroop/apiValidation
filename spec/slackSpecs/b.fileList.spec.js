'use strict';
const request = require('request');
let {slackObj} = require('./a.fileUpload.spec.js');
slackObj.fileList = false;


describe(
    'File List APIs Specs ====>',
    function(){
        it(
            'Error Scenario - Verifies that an error is thrown if token is not provided in the request',
            noTokenGetFiles
        );

        it(
            'Error Scenario - Verifies that an error is thrown if an invalid token is provided in the request',
            invalidTokenGetFiles
        );

        it(
            'Error Scenario - Verifies that an error is thrown if a token is provided with an invalid user in the request',
            invalidUser
        );

        it(
            'Verifies that file data is not available if the "types" of the file is set to any valid value except "images"',
            setOtherTypeValues
        );

        it(
            'Verifies that "types = all" returns a default file object and does not filter the list',
            setDefaultValue
        );

        it(
            'Verifies that setting "types" to any invalid value results in default file object',
            invalidTypeValue
        );

        it(
            'Verifies that a valid successful file.list request with type "images" returns a valid file object',
            fileListRequest
        );

        it(
            'Verifies that the returned file object in file.list request matches the id and values of the uploaded file',
            validateFileObject
        );


        /**
         * Verifies that an error is thrown if token is not provided in the request
         * @param  {Function} done exits test
         * @return {void}        [description]
         */
        function noTokenGetFiles(done){
            request(
                {
                    method: 'POST',
                    url: slackObj.slackUrl+'/files.list',
                    formData:{
                        token:''
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
         * Verifies that an error is thrown if an invalid token is provided in the request
         * @param  {Function} done exits test
         * @return {void}        [description]
         */
        function invalidTokenGetFiles(done){
            request(
                {
                    method: 'POST',
                    url: slackObj.slackUrl+'/files.list',
                    formData:{
                        token:'invalid'
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
         * Verifies that an error is thrown if a token is provided with an invalid user in the request
         * @param  {Function} done exits test
         * @return {void}        [description]
         */
        function invalidUser(done){
            request(
                {
                    method: 'POST',
                    url: slackObj.slackUrl+'/files.list',
                    formData:{
                        token:slackObj.token,
                        user:'testUser'
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
                    expect(responseBody.error).toBe('user_not_found');
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 40000;
                    done();
                }
            )
        }

        /**
         * Verifies that file data is not available if the "types" of the file is set to any valid value except "images"
         * @param {Function} done exits test
         */
        function setOtherTypeValues(done){
            let typeValues = [
                "spaces",
                "snippets",
                "gdocs",
                "zips",
                "pdfs"
            ];

            let count = 0;
            console.log(' ==== Waiting for 30 seconds for the file data to be uploaded and ready to be fetched ====');
            //Giving timeout to start the test because the uploaded file takes atleast 6-7 seconds to show up in file.list results
            setTimeout(
                delayFileListRequest,
                30000
            );

            /**
             * Function will loop over each types value and exits one count exceeds type array length
             * @return {void} [description]
             */
            function delayFileListRequest(){
                console.log('Testing', typeValues[count]);
                request(
                    {
                        method: 'POST',
                        url: slackObj.slackUrl+'/files.list',
                        formData:{
                            token:slackObj.token,
                            user:slackObj.fileBody.user,
                            types: typeValues[count]
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
                        expect(responseBody.files.length).toBe(0);
                        count++;
                        if(count>=typeValues.length){
                            console.log('All data tested');
                            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                            done()
                        }else{
                            delayFileListRequest();
                        }
                    }
                )
            }
        }

        /**
         * Verifies that "types = all" returns a default file object and does not filter the list
         * @param {Function} done exits test
         */
        function setDefaultValue(done){
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
                    expect(responseBody.files.length).toBe(1);
                    expect(responseBody.ok).toBe(true);
                    done();
                }
            )
        }


        /**
         * Verifies that setting "types" to any invalid value results in default file object
         * @param  {Function} done exits testCase
         * @return {void}        [description]
         */
        function invalidTypeValue(done){
            request(
                {
                    method: 'POST',
                    url: slackObj.slackUrl+'/files.list',
                    formData:{
                        token:slackObj.token,
                        user:slackObj.fileBody.user,
                        types:"invalidType"
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
                    expect(responseBody.files.length).toBe(1);
                    expect(responseBody.ok).toBe(true);
                    done();
                }
            )
        }

        /**
         * Verifies that a valid successful file.list request with type "images" returns a valid file object
         * @param  {Function} done exits test
         * @return {void}        [description]
         */
        function fileListRequest(done){
            request(
                {
                    method: 'POST',
                    url: slackObj.slackUrl+'/files.list',
                    formData:{
                        token:slackObj.token,
                        user:slackObj.fileBody.user,
                        types:"images"
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
                    slackObj.fileList = responseBody.files;
                    expect(slackObj.fileList.length).toBe(1);
                    expect(responseBody.ok).toBe(true);
                    done();
                }
            )
        }

        /**
         * Verifies that the returned file object in file.list request matches the id and values of the uploaded file
         * @return {void} [description]
         */
        function validateFileObject(){
            let imageType = [
                'jpeg',
                'png',
                'gif'
            ];
            expect(slackObj.fileList[0].id).toBe(slackObj.fileBody.id);
            expect(imageType).toContain((slackObj.fileList[0].filetype).toLowerCase());
            expect(slackObj.fileList[0].name).toBe(slackObj.fileBody.name);
            expect(slackObj.fileList[0].user).toBe(slackObj.fileBody.user);
            expect(slackObj.fileList[0].title).toBe(slackObj.fileBody.title);
            expect(slackObj.fileList[0].mimetype).toContain('image');
        }
    }
)
