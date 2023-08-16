# Smarter Thinking - Administrative and Analytical Data Dashboard

Final Year Project

<div align="center">
  <img src="Product Screenshots/02-DashboardHome.png" id="image" style="max-width: 100%; height: auto;">
  <br>
  <button onclick="changeImage(-1)">&#8592; Previous</button>
  <button onclick="changeImage(1)">Next &#8594;</button>
</div>

<script>
  const images = [
    "Product Screenshots/01.0-LoginScreen.png",
    "Product Screenshots/02-DashboardHome.png",
    "Product Screenshots/03-AppUserManagement.png",
    "Product Screenshots/04-UserDetails.png",
    "Product Screenshots/05-SubmissionDetails.png",
    "Product Screenshots/06-UserMetrics-AllUsers.png",
    "Product Screenshots/08-ParameterReport-UserSearch.png",
    "Product Screenshots/09-ParameterReport-UserSearch-65AndOver.png",
    "Product Screenshots/10-ParameterReport-FeelingSearch.png",
    "Product Screenshots/11-ParameterReport_FeelingSearch-Depression.png",
    "Product Screenshots/12-FullDataExport.png",
  ];
  
  let currentImageIndex = 0;
  const imageElement = document.getElementById("image");

  function changeImage(direction) {
    currentImageIndex += direction;
    if (currentImageIndex < 0) {
      currentImageIndex = images.length - 1;
    } else if (currentImageIndex >= images.length) {
      currentImageIndex = 0;
    }
    imageElement.src = images[currentImageIndex];
  }
</script>
