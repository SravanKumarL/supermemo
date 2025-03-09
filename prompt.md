pure ui react component, font awesome, tailwind css, elegant & minimal
cleaner - font roboto

- App.jsx - root component, define the layout and import all the below components
  

  - Search.jsx
        - Have the dummy search results stored in react state
        - Search results should be populated in a drop down similar to google search and the match highlighted in bold 
        - Each Search results should have the content type prefixed like,
                Topic: Physics |  What is hubble telescope
                Flashcard: Telescope | Who invented Hubble Telescope
  - ContentTree.jsx - Card with box shadow, rounded corner, color
        - wrapper component over <react-sortable-tree/> with drag-drop, node addition/deletion functionality
        - Add hardcoded topics with children, but have them in a json object in react state and pass this to <react-sortable-tree/>
  - ContentContainer.jsx - Card with a Tag on the right corner 
        - Type of content tag - topic/flashcard on top right
        - Topic Category tag with color
        - Editable Topic Title
        - Editable Text Content 
        - Reference section containing metadata information like source link, timestamp and author
      - Add hardcoded initial value from react state with json structure as below, 
        { type, topic, title, content}  
            const [contentObj, setContentObj] = setState({ type, topic, title, content}) // Hardcoded

