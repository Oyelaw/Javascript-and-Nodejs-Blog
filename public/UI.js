class UI {

  // Create element
  createNode(element){
    return document.createElement(element);
  };

  // append element
  append(parent, el){
    return parent.appendChild(el)
  };

  // Append new class to element
  addToClasslist(nodeElement, className){
    return nodeElement.classList.add(className);
  };

  // Show alert message
  showAlert(message, className) {
    // Clear any remaining alerts
    this.clearAlert();
    // Create div
    const div  =  document.createElement('div');
    // Add classes
    div.className = className;
    // Add text
    div.appendChild(document.createTextNode(message));
    // Get parent
    const container =  document.querySelector('main');
    // Get search box
    const formWrapper = document.querySelector('.formWrapper');
    // Insert alert
    container.insertBefore(div, formWrapper);

    // Timeout after 3 sec
    setTimeout(() => {
      this.clearAlert();
    }, 3000);
};

  // Clear alert message
  clearAlert() {
    const currentAlert = document.querySelector('.alert');

    if(currentAlert){
      currentAlert.remove();
    }
  };

  // Clear Post create form fields
  clearPostCreateForm() {
    // Create templacholder for Images
    var picturesFormat = [
        {"name": "Main image", "src": "public/img/background.jpg"},
        {"name": "Extra image", "src": "public/img/background.jpg"},
        {"name": "Extra image", "src": "public/img/background.jpg"},
        {"name": "Extra image", "src": "public/img/background.jpg"},
        {"name": "Extra image", "src": "public/img/background.jpg"}
      ];
    //Get the title, body and pictures
    var postTitle = document.getElementById('postTitle').value = '';
    var postBody = document.getElementById('postBody').value = '';
    var postPictures = document.getElementById('postPictures').value = JSON.stringify(picturesFormat);
  }
};
