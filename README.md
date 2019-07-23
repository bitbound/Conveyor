# Conveyor
A self-hosted file sharing service built with ASP.NET Core and Angular.

Demo Site: https://conveyor.lucency.co

[![Build Status](https://dev.azure.com/translucency/Conveyor/_apis/build/status/Conveyor?branchName=master)](https://dev.azure.com/translucency/Conveyor/_build/latest?definitionId=16&branchName=master)


## Build Requirements
* .NET Core 3 Preview 6 SDK
* Node.js (latest)

## Hosting Requirements
* .NET Core 3 Preview 6 Hosting Bundle
* SQL Server Express
    * You can use either a normal instance or LocalDb.  For LocalDb, the application pool must have "Load user profile" set to true in IIS.
* You must specify in appsettings.json a certificate to use for signing authentication tokens.  It can be generated through the New-SelfSignedCertifcate cmdlet in PowerShell.
    * See here for more info: https://docs.microsoft.com/en-us/aspnet/core/security/authentication/identity-api-authorization?view=aspnetcore-3.0#deploy-to-production


## Getting Started
On first load, you will can upload and download files anonymously.  The links are public (though not searchable), and the file descriptions are saved in localStorage (but not the file itself).  Once you create an account, files that are in your browser's localStorage will be transferred to your account.

Create your own account via the Register link on the site's nav bar.  Afterward, if you want to disable self-registration (so random people can't create accounts), set the AllowSelfRegistration option in appsettings.json to false.

Set the DataRetentionInDays option in appsettings.json to a number that suits you.  Set to 0 to retain files indefinitely.

Upload files via the button or drag-and-drop.

Download and View links will only work while signed in to your account.  To share files, create an authentication token on the Auth Tokens page.  On the main page, choose the authentication token you created, and Share links will appear.  Clicking them will copy the link to your clipboard, and the link will use the selected auth token.

You can also create authentication tokens for use by other apps (e.g. to add file sharing into an existing chat app).