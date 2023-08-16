<template>
    <div class="some-page-wrapper">
      <div class="row">
        <div class="column">
          <div class="white-column">
              <div class="paragraph">
                  <img src="../../assets/Smarter Thinking Logo on Light.png">
              </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="column">
          <div class="blue-column">
              <div class="paragraph">
                <p> 
                    The Smarter Thinking mobile application is a tool to help people recognise and record their irrational beliefs, and assists them towards embracing a positive belief.<br>
                    <a href="https://thesmarterthinkingproject.com/the-smarter-thinking-app/">Click here for more information on the mobile application</a><br><br>
                    This administrative and analytical Dashboard has been created to present the Smarter Thinking team a better understanding of the data collected from the mobile application users, using visualisations to showcase different statistics.<br><br>
                </p>
              </div>
          </div>
        </div>
      </div>

    </div>
  </template>
    
  <script>

  </script>
  
  <style scoped>
  
    .some-page-wrapper {
        width: 100%;
    }
    .row {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
    .column {
        display: flex;
        flex-direction: column;
        flex-basis: 100%;
        flex: 1;
    }
    .white-column {
        height: 20vh;
        text-align: center;
        display: flex;
        justify-content: center;
    }
    .blue-column {
        height: 73vh;
        text-align: center;
        display: flex;
        justify-content: center;
    }
    .paragraph {
      display: flex;
      justify-content: center;
      align-items: flex-start;    
      width: 80%;
    }

    img {
      max-width: 30vh;
      height: auto;
    }
  </style>
    
    
    