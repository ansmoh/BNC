// Uitilities

var trimInput = function(val) {
  return val.replace(/^\s*|\s*$/g, "");
}

var isValidPassword = function(val) {
  if (val.length >= 6) {
    return true;
  } else {
    toastr.error("Too short password.", 'Password error');
    return false; 
  }
}
