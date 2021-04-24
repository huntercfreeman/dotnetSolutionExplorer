# Change Log

All notable changes to the "dotnet-solution-explorer" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

-Version 1.2.4:
<ol>
<li>All commands appear EITHER in the integrated terminal, or as a notification if an integrated terminal is not found as to allow external terminal usage.</li>
</ol>
-Version 1.2.3:
<ol>
<li>Normalized routes to use '/' file delimiter in the dotnet command when removing a project</li>
</ol>
-Version 1.2.2:
<ol>
<li>Added ability to remove a project from a solution using the 'Remove Project' context menu option on the .sln</li>
<li>View all referenced nuget packages and their versions. This is found by expanding a project and then expanding its dependencies then the packages.</li>
</ol>
-Version 1.2.0:
<ol>
<li>Added 'Add New Project' to .sln context menu</li>
<li>Added 'Add Existing Project' to .sln context menu</li>
<li>Added 'Add Project Reference' to .csproj dependencies context menu</li>
<li>Added 'Remove Project Reference' to .csproj dependency item context menu</li>
</ol>
- Initial release
-Version 1.1.0:
<ol>
<li>Added list of project dependencies.</li>
<li>No longer show debug and obj folders in project display.</li>
<li>Fixed an issue where opening a file from the solution explorer on Windows would not have Omnisharp running.</li>
</ol>




    