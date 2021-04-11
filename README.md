Firstly, why download this solution explorer specifically?

<ol>
<li>Namespaces are generated for you when adding new files</li>
<li>You can choose from a .sln that is anywhere in the workspace (doesn't have to be root).</li>
<li>Templated files based on extension. If you add a .cs file the barebones class structure will be generated for you with string interpolation.</li>
</ol>

Now on to the documentation

![stepOne](/home/hunter/Desktop/Repos/dotnetSolutionExplorer/markdownImages/stepOne.png)

In the above image I created a folder called 'MyBlazorCrudApp' to give us a clean slate.

The first step is to create .sln file for our application. Run the following command in your terminal of choosing:

````
dotnet new sln
````

![stepTwo](/home/hunter/Desktop/Repos/dotnetSolutionExplorer/markdownImages/stepTwo.png)

Now that we have a .sln let's expand the 'DOTNET SOLUTION EXPLORER' tab under 'OPEN EDITORS' and vscode's folder explorer on the left sidebar.

![stepThree](/home/hunter/Desktop/Repos/dotnetSolutionExplorer/markdownImages/stepThree.png)

Vscode will show a quickpick for us to choose our .sln. If you do not see this run the run the reload window command (press 'ctrl' + 'shift' + 'p' then type reload window). The result of selecting 'MyBlazorCrudApp.sln' from vscode's quickpick is the following.

![stepFour](/home/hunter/Desktop/Repos/dotnetSolutionExplorer/markdownImages/stepFour.png)

The second thing we need to do is add a project. Run the following command (I am using .net 5 sdk):

```
dotnet new blazorserver -o MyBlazorServerApp
```

![stepFive](/home/hunter/Desktop/Repos/dotnetSolutionExplorer/markdownImages/stepFive.png)

Now we need to add the project to our .sln. Run the following command:

```
dotnet sln MyBlazorCrudApp.sln add MyBlazorServerApp/MyBlazorServerApp.csproj
```

![stepSix](/home/hunter/Desktop/Repos/dotnetSolutionExplorer/markdownImages/stepSix.png)

Now when we expand 'MyBlazorCrudApp.sln' and then expand MyBlazorServerApp.csproj in the dotnet Solution Explorer we will see the following.

![stepSeven](/home/hunter/Desktop/Repos/dotnetSolutionExplorer/markdownImages/stepSeven.png)

IMPORTANT: Everything is lazily loaded and only once unless told to refresh. If you do not see 'MyBlazorServerApp.csproj' bring up the context menu (right click) for 'MyBlazorCrudApp.sln' and then refresh. As an aside you can refresh anything and you will only incur the cost of re-getting the children files of the tree node item you chose to refresh. It does not refresh the entire solution explorer unless you refresh the .sln file.

At this point feel free to run the following command to run the application (make sure the path is relative to the directory you are in):

```
dotnet run --project MyBlazorServerApp/MyBlazorServerApp.csproj
```

In your internet browser go to the localhost port that is described in the terminal. For me it was localhost:5001 for https and you will see your app.

![stepEight](/home/hunter/Desktop/Repos/dotnetSolutionExplorer/markdownImages/stepEight.png)

My goal for this app is to have a list of people that displays their name and unique id.

For this we need to write some code.

I added a folder called 'Code' and then using the context menu on the directory I clicked, 'Add File'. Look at how I have a vscode quick pick at the top of the screen.

![stepTen](/home/hunter/Desktop/Repos/dotnetSolutionExplorer/markdownImages/stepTen.png)

This quick pick uses templates that are based off the extension given. In addition any files requiring a namespace are given one automatically.

Let's see the templates in action. I'll type 'PersonRepository.cs ' and show the resulting file in an image following.

![stepEleven](/home/hunter/Desktop/Repos/dotnetSolutionExplorer/markdownImages/stepEleven.png)

To spare the unrelated details I'm going to move on to making a blazor component that displays a Person object instead of going through how to make a PersonRepository.

I added a directory called, 'Components' and then using the context menu selected the option, "Add Blazor Component". Again templating will come in to play here.

![stepTwelve](/home/hunter/Desktop/Repos/dotnetSolutionExplorer/markdownImages/stepTwelve.png)

I enter the following: 'PersonRenderer' and follow with the results of the operation.

Two files were generated: PersonRenderer.razor and PersonRenderer.razor.cs

The two files appear nested and the .razor file can be collapsed just as a directory.

PersonRenderer.razor:

![stepThirteen](/home/hunter/Desktop/Repos/dotnetSolutionExplorer/markdownImages/stepThirteen.png)

PersonRenderer.razor.cs

![stepFourteen](/home/hunter/Desktop/Repos/dotnetSolutionExplorer/markdownImages/stepFourteen.png)

If you wish to only create the markup (or only create the codebehind) use the context menu option 'Add File' and then type 'PersonRenderer.razor' it will use the same template but not create the codebehind ('PersonRenderer.razor.cs' to only create the codebehind).

Frequently Asked Questions:

How do I add a nuget package reference?

<ul>
    <li>Nuget package management must be done through the command line currently (or a separate extension).</li>
</ul>

How do I reach the author of this extension?

<ul>
    <li>I can be reached at my email: huntercfreeman@gmail.com</li>
    <li>The repository is located publically at: https://github.com/huntercfreeman/dotnetSolutionExplorer</li>
    <li>I'm open to pull requests and if you need help cloning the extension from github feel free to email me I am available on the weekends and will likely help.</li>
</ul>

What are the future plans for this extension?

<ul>
    <li>I plan on working on this extension every weekend when I have free time outside of work.</li>
    <li>I am interested in hearing from anyone that downloads it: what features you want, criticisms, etc. if you reach out to me I will likely add the feature requested.</li>
</ul>

