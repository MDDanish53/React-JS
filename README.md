# NetFlix Clone Using React JS

This Netflix clone project enhances my clarity and deep understanding of react hooks usage and components as well as conditional rendering.

## This project includes :

1. User authentication mechanism using firebase : username, email, password are required to signup and email, password are required to login.

2. The login and signup are at the same page and they are rendered based on the signState.

3. As soon as the user submits the login form, a loading screen appears and the authentication process takes place. If the user exists then it redirects to the home page else redirects to the login/signup page.

4. The errors of authentication are presented to the user using react toastify package.

5. Then at the home page there are the following components:

    i. Navigation Bar - provides several options, search features, and logout option.

    ii. Hero Section - shows the hero image with its captions and related buttons.

    iii. Title Cards - shows various movies lists based on their category and presents their name and banner image. These categories, name and images are taken from TMDB movies api.

6. The title cards are clickable and takes the user to the player page where the youtube trailer of the selected movie is presented to the user, and the user can play it on the website. Also, the release date, name of trailer and the type of video is also presented below the trailer video.

7. This trailer infomation is also taken from the TMDB api, the trailer from youtube is shown using the key of movie also the other details.


