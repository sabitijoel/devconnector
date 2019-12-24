const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//post model
const Post = require("../../models/Post");

//validation
const validatePostInput = require("../../validation/post");

//profile model
const Profile = require("../../models/Profile");

//@route  get API/posts/test
//@desc   tests post route
//@access   public

router.get("/test", (req, res) => res.json({ msg: "Posts works" }));

//@route  get API/post
//@desc   get post
//@access   public

router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(post => res.json(post))
    .catch(err => res.status(404).json({ nopostfound: "no posts found" }));
});
//@route  delete API/post/:id
//@desc   delete post
//@access   private

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ id: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //check for post owner
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "User not authorised" });
          }
          //delete
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ postnotfound: "post not found" }));
    });
  }
);

//@route  get API/post/:id
//@desc   get post by id
//@access   public

router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({ nopostfound: "no post found" }));
});

//@route  POST API/post
//@desc   create post
//@access   private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    //check validation

    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });
    newPost.save().then(post => res.json(post));
  }
);

//@route  LIKE API/post/:id
//@desc   LIKE post
//@access   private

router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ id: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "user already liked this post" });
          }

          //add the user id to the likes array

          post.likes.unshift({ user: req.user.id });

          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: "post not found" }));
    });
  }
);

//@route  unlike API/post/:id
//@desc   unlike post
//@access   private

router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ id: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "you have not liked  this post before" });
          }

          //get remove index
          const removeIndex= post.likes
          .map(item => item.user.toString())
          .indexOf(req.user.id);

          //splice out of array

          post.likes.splice(removeIndex, 1);

          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: "post not found" }));
    });
  }
);



//@route  post API/post/comment/:id
//@desc   add comment to post
//@access   private

router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
     const{errors, isValid}= validatePostInput(req.body);
         //check validation

         if(!isValid){

          return res.status(400).json(errors);
         }

         Post.findById(req.params.id)
        .then(post => {

         
            const newComment = {
              text: req.body.text,
              name: req.body.name,
              avatar: req.body.avatar,
              user:req.user.id
            }
// add new comment to the array

post.comments.unshift(newComment);

//save
            post.save().then(post => res.json(post))
          }).catch(err => res.status(404).json({postnotfound:'no post found'}));
        });





        //@route  delete API/post/comment/:id/:comment_id
//@desc   delete comment from post
//@access   private


/*to delete a comment from a post, we need to first
identify the post then search for the comment we want to remove. but we should be able to verify that the person
deleting is the owner of that post. so we need to map the comment id to the owner of the comment*/

router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
     
         Post.findById(req.params.id)
        .then(post => {
 
         //check to see if the comment exists

         if(post.comments.filter(comment =>comment._id.toString()===req.params.comment_id).length ===0){
           return res.status(404).json({commentdoesntexist:'comment does not exist'});
         }
         //if comment exists, remove it by first seperating it into its own array using the map method....
         
         //create an array called removeIndex from which this comment is going to be deleted

         const removeIndex = post.comments
         .map(item => item._id.toString())
         .indexOf(req.params.comment_id);

         //after that comment has been identified and put in a seperate array, it is then removed independently

         post.comments.splice(removeIndex,1);

         post.save().then(post =>res.json(post));

          })
          .catch(err => res.status(404).json({postnotfound:'no post found'}));
        });

     
        


module.exports = router;
