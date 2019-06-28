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
};
