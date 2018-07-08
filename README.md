# Imageboard

I used Vue.js for this project to create the UI. It´s a single-page application. People can chose files and uplaod them, using multer, the pictures then is stored in my Amazon Webservices S3 bucket. Afterwards, the generated URL, the title and the description are inserted into the SQL postgres database and the picture gets displayed in the UI.
Further on i use Express and the axios library to help making Ajax requests in Vue.js.

It´s also possible for people to comment pictures. Since this application does not require login or register, people can chose a random username, write a comment and submit it. The comments are stored in a different postgres table, wich is connected to the pictures table via id. 
