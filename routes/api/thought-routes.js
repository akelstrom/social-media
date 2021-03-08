const router = require("express").Router();

const {
  getAllThought,
  getThoughtById,
  createThought,
  updateThoughtById,
  deleteThoughtById,
  addReaction,
  removeReaction,
} = require("../../controllers/thought-controller");

// Set up GET all and POST at /api/thoughts
router.route("/").get(getAllThought).post(createThought);

// Set up GET one, PUT, and DELETE at /api/thoughts/:id
router
  .route("/:id")
  .get(getThoughtById)
  .put(updateThoughtById)
  .delete(deleteThoughtById);

//set up POST  /api/thoughtid/reactions
router.route("/:thoughtId/reactions").post(addReaction);

// and delete at /api/thoughtid/reactions/:reactionId
router.route("/:thoughtId/reactions/:reactionId").delete(removeReaction);

module.exports = router;
