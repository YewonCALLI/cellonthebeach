//Background Sound - only once 
function once(fn, context) { 
    var result;
  
    return function() { 
        if(fn) {
            result = fn.apply(context || this, arguments);
            fn = null;
        }
  
        return result;
    };
  }
  
export const Background = once ((path) => { 
    const audio = new Audio("../sounds/background.m4a"); 
    audio.muted = true;
    audio.play();
    audio.muted = false;
})

  