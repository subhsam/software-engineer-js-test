// NOTE: you can use CommonJS here, for instance:
// var foo = require("npm-dependency");
// var bar = require("./path/to/local/file_without_extension");
// module.exports = someVariable;

// grab DOM elements inside index.html

var fileSelector = document.getElementById( "fileSelector" );
var imageContainer = document.getElementById( "imageContainer" );
var debugContainer = document.getElementById( "debugContainer" );
var generateButton = document.getElementById( "generateButton" );
var descriptionContainer = document.getElementById( "descriptionContainer" );
var importButton = document.getElementById( "importButton" );
var savedFinalObject = {};
var imgInContainer = {};
var initScreen = document.getElementById( "initScreen" );
var resultScreen = document.getElementById("resultScreen");
var moveRightButton = document.getElementById("moveRightButton");
var moveLeftButton = document.getElementById("moveLeftButton");
var scale50Button = document.getElementById("scale50Button");
var scale200Button = document.getElementById("scale200Button");

//document.getElementsBy

// some functions to get you started !!

function log( msg ) {
    // show debug/state message on screen
  debugContainer.innerHTML += "<p>" + msg + "</p>";
}


// enable selection of file for the album
fileSelector.onchange = function( e ) {
    // get all selected Files
    var files = e.target.files;
    var file;
    for ( var i = 0; i < files.length; ++i ) {
        file = files[ i ];
        // check if file is valid Image (just a MIME check)
        switch ( file.type ) {
            case "image/jpeg":
            case "image/png":
            case "image/gif":
                // read Image contents from file
                var reader = new FileReader();
                reader.onload = function( e ) {
                    // create HTMLImageElement holding image data
                    var img = new Image();
                    img.src = reader.result;

                    // remove existing images from ImageContainer
                    while ( imageContainer.childNodes.length > 0 )
                        imageContainer.removeChild( imageContainer.childNodes[ 0 ]);

                    // add image to container
                    imageContainer.appendChild( img );

                    // uploaded image saved in a global variable
                    img.onload = function() {
                        imgInContainer = img;
                    }

                    // do your magic here...
                };
                reader.readAsDataURL( file );
                // process just one file.
                return;


            default:
                log( "not a valid Image file :" + file.name );
        }
    }
};

// saving the chosen album settings
generateButton.onclick = function( e ) {

    var description='';
    var image = new Image();

    descriptionContainer.parentElement.classList.remove("hide");
    debugContainer.parentElement.classList.remove("hide");

    description = getImageObject(imgInContainer);
    var finalObject = {"canvas": {"width":imageContainer.offsetWidth,"height":imageContainer.offsetHeight,"photo":description}};

    // showing the selected settings on description container
    debugContainer.innerHTML=JSON.stringify(finalObject,null,4);


    //initializing the saved settings for the album
     savedFinalObject = (function() {

      var saveOuter = finalObject;

      var getsaveOuter = function() {
        return saveOuter;

      }

      return getsaveOuter;


    })();


};


// Import button click loads the saved settings and displays the album
importButton.onclick = function( e ) {

    var fImageContainer = createElementWithId("div","fImageContainer");
    var fImage = createElementWithId("img","fImage");
    fImageContainer.appendChild(fImage);
    initScreen.classList.add("hide");
    resultScreen.appendChild(fImageContainer);
    showSavedImage(fImage,fImageContainer);

};

// Move right button to move the image to right
moveRightButton.onclick = function( e ) {

  changeLeftMargin(imgInContainer,"add",10);

};

// Move left button to move the image to left
moveLeftButton.onclick = function( e ) {

  changeLeftMargin(imgInContainer,"reduce",10);

};

// scale button to 50% of image
scale50Button.onclick = function( e ) {

    scaleImage(50);
};

// scale button to 200% of image
scale200Button.onclick = function( e ) {

    scaleImage(200);
};

// To get the image properties saved as an object
function getImageObject(img){

      var imageData={};

      // grab some data from the image
       imageData = {
          "width": img.offsetWidth,
          "height": img.offsetHeight,
          "src": img.src,
          "x": img.offsetLeft-img.parentElement.offsetLeft,
          "y": img.offsetTop-img.parentElement.offsetTop
      };



  return imageData;
}

// create an HTML element with a specific id
function createElementWithId(elementType, idval){

    var resultElement = document.createElement(elementType);
    resultElement.setAttribute("id",idval);
    return resultElement;

}


// To add or reduce left margin of an element
function changeLeftMargin(element, changeMode, amount){
  var marginleft = element.style.marginLeft;


  switch ( changeMode ) {
      case "add":
          if(isNaN(marginleft)){
            marginleft = parseInt(marginleft.replace("px",""));
            element.style.marginLeft=(marginleft + amount)+"px";
          } else{
            element.style.marginLeft= amount+"px";
          }

      break;

      case "reduce":
          if(isNaN(marginleft)){
            marginleft = parseInt(marginleft.replace("px",""));
            element.style.marginLeft=(marginleft - amount)+"px";
          } else{
            element.style.marginLeft= "-"+amount+"px";
          }

      break;

       default:
       log("Chosen case not supported for changeLeftMargin");
     }

}

// Scale the image as percentage
function scaleImage(scalePercentage){

      imgInContainer.style.width=scalePercentage+"%";
      imgInContainer.style.height= "auto";

}

// Showing of the saved album with previous saved properties
function showSavedImage(fImage,fImageContainer){
    fImage.setAttribute("src",savedFinalObject().canvas.photo.src);
    fImage.setAttribute("height",savedFinalObject().canvas.photo.height);
    fImage.setAttribute("width",savedFinalObject().canvas.photo.width);
    fImageContainer.setAttribute("style","border: 1px solid #000;");
    fImageContainer.style.width=savedFinalObject().canvas.width+'px';
    fImageContainer.style.height=savedFinalObject().canvas.height+'px';
    fImage.style.marginLeft = savedFinalObject().canvas.photo.x+'px';
    fImage.style.marginTop = savedFinalObject().canvas.photo.y+'px';
    fImageContainer.setAttribute("class","column");

}

log( "Test application ready" );
