const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

function filterObj(obj, ...allowedFields) {
  let newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
}

// updadeMe
exports.updateMe = catchAsync(async (req, res, next) => {
  //1 create error if password change//
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password changes', 400));
  }
  //updating the document //
  const filteredBody = filterObj(req.body, 'name', 'email');

  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser,
    },
  });
});

//deleting user//
exports.deletMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// exports.addPosttoUser = catchAsync

exports.getAllUsers = factory.getAll(User);

exports.getUser = factory.getOne(User);
// do not update passwords with this//
exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);

exports.BlacklistUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('+Blacklist');
  if (!user) {
    return next(new AppError('there is no user with this id', 400));
  }

  if (!user.Blacklist) {
    user.Blacklist = true;
    await user.save({ runValidators: false });
    res.status(200).json({
      status: 'success',
      message: 'User has been successfully blacklisted by the admin',
    });
    next();
  }

  return next(new AppError('already blacklisted by the admin', 400));
});

exports.checkBlacklist = factory.checkBlacklist(User);
