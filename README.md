# SWE-432

We've changed our project specifications and decided to try a different project altogether (again!). We found that the requirements were way too broad for app and really just didnt apply to it. So we decided to build a miniature OS that hosts four tabs (personal, social, work, news). Underneath these tabs are collections of web-apps that can run (as a single page app) so that the user doesnt have a cluttered browser bar. They can let something like spotify or twitter be running, but hidden under the social tab while they edit their journal or tasks under the personal tab. All of their data and things that they would normally run as a webapp anyways will be better organized inside of one single page app. 

Our current repository is located at --> https://github.com/PilotSSW/SWE-432

---------------------------------------------------------------------------------------------------

1) Account Registration -- They need to create a UnityOS account which can store their other app logins and anything we create in the app, such as a todo list or a journal. After registering, the users can login using those credentials. They have a personal database and storage repository created on firebase. 
This task is finished --!

---------------------------------------------------------------------------------------------------

2) At least one personal app, one that we will likely create. We are considering adding a journal (one that might work for all three sections but differentiate between them) so they can keep track of what happens on a daily basis. We have already implemented a dynamic todo list so they can add and get rid of tasks as completed. This may be replaced with Wunderlists api in the future if time is available. 

This task is finished --! (we have a dynamic todo list built) Currently located at tasks.html -- this will become a todo list under the personal section when we rewrite as a single page app.

---------------------------------------------------------------------------------------------------

3) At least two social apps -- Twitter and Spotify are the two apps we are integrating now. They have linked api's and just need to be displayed in the single page app. We may implement an api for facebook and/or messenger or another messaging app. We would likely to be able to show the feeds from one of these services inside the view. 

---------------------------------------------------------------------------------------------------

4) At least one work based app -- such as an email client or professional chat service, such as slack. We may also consider the stickynote system so they post quick tasks they need to get done. 

And!!

At least one news app - this will contain our visualization tree later on. This will have news services linked in as a browser feed that will scroll through articles. The topics can form the visual tree. 

---------------------------------------------------------------------------------------------------