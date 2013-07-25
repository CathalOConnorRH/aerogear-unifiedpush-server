/* JBoss, Home of Professional Open Source
* Copyright Red Hat, Inc., and individual contributors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* http://www.apache.org/licenses/LICENSE-2.0
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

App.LoginController = Ember.ObjectController.extend({
    error: "",
    loginName: "",
    password: "",
    loginIn: true,
    login: function() {
        var that = this;

        //TODO: more advanced validation

        if( !this.get( "password" ).trim().length ||  !this.get( "loginName" ).trim().length ) {
            this.set( "error", "A Username and Password are required" );
        } else {
            // Use AeroGear Authenticator to login
            App.AeroGear.authenticator.login( JSON.stringify( { loginName: this.loginName, password: this.password } ), {
                contentType: "application/json",
                success: function( response, statusText, jqXHR ) {
                    if( jqXHR.status === 205 ) {
                        //change the password
                        that.set( "loginIn", false );
                        console.log( "change that shizzel" );
                    } else {
                        // Successful Login, now go to /mobileApps
                        that.set( "error", "" );
                        that.transitionToRoute( "mobileApps" );
                    }
                },
                error: function( error ) {
                    //TODO: Show errors on screen
                    console.log( "Error Logging in", error );
                    that.set( "error", "Login Error" );
                }
            });
        }
    },
    //Only Temporary until we can get the user create scripts
    other: function() {
        //need to send to the update endpoint
        var that = this,
            password = this.get("password"),
            loginName = this.get( "loginName" ),
            data;

        data = JSON.stringify( { loginName: loginName, password: password } );

        $.ajax({
            url: "/ag-push/rest/auth/update",
            type: "PUT",
            data: data,
            contentType: "application/json",
            success: function() {
                that.set( "loginIn", true );
                that.set( "error", "" );
                that.transitionToRoute( "mobileApps" );
            },
            error: function( error ) {
                that.set( "error", "Save Error" );
                console.log( "error", error );
            }
        });
    }
});
