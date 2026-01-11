export const validateAtUpdate = function(next) {
    this.options.runValidators = true; 
    next();
}

  // Better approach:
  // await File.findByIdAndUpdate(
  //   user._id,
  //   { runValidators: true }
  // );