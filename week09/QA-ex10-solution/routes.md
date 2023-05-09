## / (index)
## it will be the main page and it'll containt the main and most generic aspects of our website

- Layout and navbar
- Welcome text
- List of Questions (on click, goes to /answers/:idQuestion)
- Login/Logout/Profile button

## /answers/:idQuestion

- Layout and navbar
- Question details
- List of Answers
    - DELETE -> execute(delete the answer) and stay on this route
    - VOTE   -> execute(change the vote) and stay on this route
    - EDIT   -> go to /editAnswer/:idQuestion/:idAnswer
- GO BACK / EXIT -> go to /
- ADD -> go to /addAnswer/:idQuestion

## /addAnswer/:idQuestion

- Layout and navbar
- [OPTIONAL] List of answers, eventually with buttons...
- FORM for entering a new answer
    - ADD -> execute and go to /answers/:idQuestion
    - CANCEL -> go to /answers/:idQuestion

## /editAnswer/:idQuestion/:idAnswer

- Layout and navbar
- [OPTIONAL] List of answers, eventually with buttons...
- FORM for modifying an answer
    - SAVE -> execute and go to /answers/:idQuestion
    - CANCEL -> go to /answers/:idQuestion

## * (no match)

- Layout and navbar
- 404 message