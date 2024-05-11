# Smart Lecture Summary
Before a lecture, is it useful for students to get a general sense of what content will be convered. Lecture videos tend to be very long and wordy. Hence, it is useful to create summaries for lecture videos to better help students study and revise.

This project utilises gpt-4 and whisper model to provide a report that summarises the content of a lecture video. The user uploads a lecture video through a webpage, which will be sent to the backend. The backend will extract the speech from the video, and generate a summarised report for the user.

This project would not have been possible without the library:<br>
<a href="https://github.com/bgrins/videoconverter.js">videoconverter.js</a> by Brian Grinstead <br>
Which allows for conversion of video to audio on the client side.
