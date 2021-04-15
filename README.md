[Repo is public here](https://github.com/huntercfreeman/dotnetSolutionExplorer)</br>
Email me: huntercfreeman@gmail.com

List of features (unordered)

<ul>
    <li>Add Existing Project</li>
    <li>Add New Project</li>
    <li>Add Project Reference</li>
    <li>Remove Project Reference</li>
    <li>Auto namespace generation when making new file</li>
    <li>Choose a .sln file anywhere in workspace (does not have to be root)</li>
    <li>Templated files (new .cs file will have namespace and class name generated for 	you based on the name of the file)</li>
</ul>

![stepOne](https://raw.githubusercontent.com/huntercfreeman/dotnetSolutionExplorer/main/markdownImages/stepOne.png)

In order to showcase the capabilities of this extension I will make a .net5 application from scratch and show the important details pertaining to this extension in named sections.

<h3>New Solution</h3>

To make a new solution run the following command:

``````
dotnet new sln
``````

![stepTwo](https://raw.githubusercontent.com/huntercfreeman/dotnetSolutionExplorer/main/markdownImages/stepTwo.png)

Now we can open the extension. If you opened the extension already run the vscode command titled 'reload window' by pressing 'ctrl' + 'shift' + 'p' or close and reopen vscode.

![stepFour](https://raw.githubusercontent.com/huntercfreeman/dotnetSolutionExplorer/main/markdownImages/stepFour.png)

![stepFive](https://raw.githubusercontent.com/huntercfreeman/dotnetSolutionExplorer/main/markdownImages/stepFive.png)

Now we see our .sln in the solution explorer.

It is important to acknowledge that the vscode folder explorer is still available to us above the solution explorer. When you click a file in the solution explorer it will scroll to and highlight that respective file in vscode's folder explorer. This allows for the full use of vscode's context menu when right clicking a file if that is so desired.

<h3>Add New Project to .sln</h3>

The next step is for us to add a new project to our .sln.

Right click the 'MyBlazorApp.sln' file in the solution explorer.

![stepSix](https://raw.githubusercontent.com/huntercfreeman/dotnetSolutionExplorer/main/markdownImages/stepSix.png)

Follow the vscode prompts that show at the top middle of vscode.

If you don't know what .net Microsoft template you want type the following command in the terminal to find the one you want to new.

``````
dotnet new --list
``````

I entered the following:

My template was:

![stepEight](https://raw.githubusercontent.com/huntercfreeman/dotnetSolutionExplorer/main/markdownImages/stepEight.png)

My project name was:

![stepNine](https://raw.githubusercontent.com/huntercfreeman/dotnetSolutionExplorer/main/markdownImages/stepNine.png)

The result was:

![stepTen](https://raw.githubusercontent.com/huntercfreeman/dotnetSolutionExplorer/main/markdownImages/stepTen.png)

I purposefully go out of my way to not run any commands for you. I am under the belief that users first don't want me running random things in their terminal. And second if I run the command then you cannot alter it if you want to customize something.

You'll notice that I figured out how to put the command immediately into the console at some point and as such started doing so. I intend to standardize this (so that all commands do not appear as a notification but instead appear in your console ready to be ran with an enter key press). I need time to standardize this however and may prioritize other features.

![stepEleven](https://raw.githubusercontent.com/huntercfreeman/dotnetSolutionExplorer/main/markdownImages/stepEleven.png)

Notice how the solution explorer did not update? In short it works similarly to Microsoft SQL Management Studio. In other words you have to right click the item you want to refresh and click refresh.

Side notes:

<ul>
	<li>I refresh for you when I can but changing files outside vscode (i.e. in the terminal) is something I don't know how to have an event for.</li>    
    <li>If a context menu refresh does not do the trick use the vscode command 'reload window' by pressing: 'ctrl' + 'shift' + 'p' and then typing 'reload window' and hittting 'enter'. (or you can close and reopen vscode)</li>
</ul>

 ![stepTwelve](https://raw.githubusercontent.com/huntercfreeman/dotnetSolutionExplorer/main/markdownImages/stepTwelve.png)

As a last resort only use reload window as described in the side notes, here you see it in an image.

![stepThirteen](https://raw.githubusercontent.com/huntercfreeman/dotnetSolutionExplorer/main/markdownImages/stepThirteen.png)

(I have to reload window when adding a project on a Windows machine but not when on Ubuntu I need to find time to fix this) 

This all results in the following:

![stepFourteen](https://raw.githubusercontent.com/huntercfreeman/dotnetSolutionExplorer/main/markdownImages/stepFourteen.png)

<h3>Add a Project Reference</h3>

![stepFifteen](https://raw.githubusercontent.com/huntercfreeman/dotnetSolutionExplorer/main/markdownImages/stepFifteen.png)

![stepSixteen](https://raw.githubusercontent.com/huntercfreeman/dotnetSolutionExplorer/main/markdownImages/stepSixteen.png)

Upon clicking the context menu option 'Add Project Reference' your operating system's file explorer will open for you to select a .csproj file.

The following will be placed into the terminal for you to run with the enter key.

It is important to note that I thought of those who use external terminals. I will NOT force open a terminal if one is not open. 

If one is using an external terminal you will receive a notification of the command to run instead of me placing it in the integrated terminal.

![stepSeventeen](https://raw.githubusercontent.com/huntercfreeman/dotnetSolutionExplorer/main/markdownImages/stepSeventeen.png)

Now run the command and use the context menu to refresh the Dependencies and you'll see your change.