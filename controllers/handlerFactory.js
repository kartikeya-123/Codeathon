const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError'); // class//
const User = require('./../models/userModel');
const Post = require('./../models/postModel');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return next(new AppError('No document found with this id', 404));

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) return next(new AppError('No document found with this id', 404));
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newdoc = await Model.create(req.body);

    if (Model === Post) {
      // console.log(req.user.name);
      // const user = req.user;
      // user.posts.push(newdoc._id);
      // await user.save({ runValidators: false });
      newdoc.User = req.user.id;
      newdoc.author = req.user.name;
      await newdoc.save({ runValidators: false });
    }
    // if (newdoc) {
    //   const user = await User.findByIdAndUpdate(
    //     req.user.id,
    //     {
    //       $push: { posts: [newdoc._id] },
    //     },
    //     {
    //       new: true,
    //       runValidators: true
    //     }
    //   );
    res.status(201).json({
      status: 'success',
      data: {
        data: newdoc,
      },
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);

    const doc = await query;
    // Tour.findOne({ _id: req.params.id })

    if (doc === null) {
      return next(new AppError('document is not present with this id', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res) => {
    // samll hack for nested get //
    let filter = {};
    if (Model === Post && req.params.userId) {
      filter = {
        User: req.params.userId,
      };
    }
    req.query = {
      Blacklist: 'false',
    };
    let docs;
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    docs = await features.query; // explain()

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        docs,
      },
    });
  });

exports.checkBlacklist = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id).select('+Blacklist');
    if (doc.Blacklist) {
      return next(
        new AppError(
          'sorry you are searching for a document which is blacklisted',
          400
        )
      );
    }
    next();
  });
