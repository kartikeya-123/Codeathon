const User = require('./../models/userModel.js');
const crypto = require('crypto');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError'); // class//
const { promisify } = require('util');
const mongoose = require('mongoose');
const Email = require('../utils/email');
const bcrypt = require('bcryptjs');
const Token = require('./../models/tokenModel.js');
// preparing a token
const createToken = (id) => {
  const jwtToken = jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return jwtToken;
};

// const checkPassword = catchAsync(async (givenPassword, candidatePassword) => {
//   return await bcrypt.compare(givenPassword, candidatePassword);
// });
//sending a token

const createSendToken = (user, statusCode, res) => {
  const token = createToken(user._id);
  // not showing the password while signup//
  user.password = undefined;

  // sending a cookie to the browser which stores the jwt token//
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_TOKEN_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  res.cookie('jwt', token, cookieOptions);
  res.status(statusCode).json({
    status: 'success',
    verification: true,
    token,
  });
};

// signup
exports.signupVerification = catchAsync(async (req, res, next) => {
  // checking if the two tokens are sent
  if (!req.params.token) {
    return next(new AppError('sorry cannot create an account', 400));
  }

  // verifying the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    signupToken: hashedToken,
    signupTokenExpiresAt: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError('There is a problem , please signup again', 404));
  }

  // sending a jwt

  user.signupToken = undefined;
  user.signupTokenExpiresAt = undefined;
  user.verifiedEmail = true;
  await user.save({ validateBeforeSave: false });

  createSendToken(user, 201, res);

  // next();
});

exports.signup = catchAsync(async (req, res, next) => {
  //1 check if the email is present
  if (!req.body.email || !req.body.password || !req.body.passwordConfirm) {
    return next(new AppError('please mention your email id and password', 400));
  }

  // we can now create a account and send a jwt//

  // creating a random token using the email id //
  const token = crypto.randomBytes(32).toString('hex');

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    signupToken: hashedToken,
    signupTokenExpiresAt: Date.now() + 10 * 60 * 1000,
  });
  // const t = await Token.create({
  //   hashedToken: hashedToken,
  //   tokenExpiresAt: Date.now() + 10 * 60 * 1000,
  //   user: newUser,
  // });

  try {
    //sending email to the given email
    await new Email(newUser, token).sendWelcome();

    res.status(200).json({
      status: 'success',
      message: 'verification email sent successfully',
    });
  } catch (err) {
    return next(new AppError('problem in sending the email', 500));
  }
});

exports.login = catchAsync(async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return next(new AppError('please mention your email id and password', 400));
  }
  // console.log(req.body);
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  // checking the two password//
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('incorrect email or password', 401));
  }
  if (user.Blacklist) {
    return next(
      new AppError('sorry you have been blacklisted by the admin', 400)
    );
  }
  if (!user.verifiedEmail) {
    res.status(200).json({
      verification: false,
    });
  } else createSendToken(user, 200, res);

  //step 4 generate token
});

//getting access to resources//
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // console.log(req.cookies.jwt);
  // if (
  //   req.headers.authorization &&
  //   req.headers.authorization.startsWith('Bearer')
  // ) {
  //   token = req.headers.authorization.split(' ')[1];
  // } else
  if (req.cookies.jwt) {
    // console.log(req.cookies.jwt);
    token = req.cookies.jwt;
  }
  // console.log(req.cookies.jwt);
  // console.log(token);
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  //3) check if the user still exists//
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError('the user belonging to the token no longer exist', 401)
    );
  }

  //4 check if the user has changed password//
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('Your password is changed ,please login again', 401)
    );
  }

  req.user = currentUser;
  next();
});

//giving acess to only some users//
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You cannot have the access to this resource', 403)
      ); //403:forbidden
    }
    next();
  };
};
//forgot passwordConfirm

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) get user based on the resetToken
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new AppError('sorry there is no user or token has expired', 400)
    );
  }
  //2 if the token is not expired and user is also present then set the password//
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //3 update changedPasswordAt property for the user//
  const token = createToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
  next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? No problem ! . Your Reset token is ${resetToken} `;

  try {
    await new Email(user, resetToken).sendResetToken();
    res.status(200).json({
      status: 'success',
      message: message,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
  next();
});
// updating password//
exports.updatePassword = catchAsync(async (req, res, next) => {
  //1 get user from collection

  const user = await User.findById(req.user.id).select('+password');
  //check if posted password is coorecet

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('the old password is not correct ', 401));
  }
  //update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //send jwt
  createSendToken(user, 200, res);
  next();
});

// this tells whether the user is logged in or not//
exports.isLoggedIn = (req, res, next) => {
  // if the route has reached this function means it is either logged in //

  res.status(200).json({
    status: 'success',
    message: 'logged in',
    user: req.user,
  });
};

exports.logout = (req, res, next) => {
  // // console.log(req.cookies.jwt);
  // console.log(document.cookie);
  // // console.log(req.cookies.jwt);

  res.clearCookie('jwt', {
    path: '/',
  });
  res.status(200).json({
    status: 'success',
    message: 'logged out',
  });
};
