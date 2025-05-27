import Stripe from "stripe";
import {Course} from "../models/course.model.js"
import {User} from "../models/user.model.js"
import {Lecture} from "../models/lecture.model.js"
import {CoursePurchase} from "../models/coursePurchase.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import {asyncHandler} from "../utils/asyncHandler.js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = asyncHandler(async (req, res) => {
  const userId = req.id;
  const { courseId } = req.body;

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const newPurchase = new CoursePurchase({
    courseId,
    userId,
    amount: course.coursePrice,
    status: "pending",
  });

  // now create a stripe checkout session
  // when user clicks on Buy course .. react will ask stripe to create a checkout page where all course details and payment related page will get ready and then it will return a session id or url where we can redirect for payment

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: course.courseTitle,
            images: [course.courseThumbnail],
          },
          unit_amount: course.coursePrice * 100, // Amount in paise
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `http://localhost:5173/course-progress/${courseId}`, // once payment successful redirect to course progress page
    cancel_url: `http://localhost:5173/course-detail/${courseId}`,
    metadata: {
      courseId: courseId,
      userId: userId,
    },
    shipping_address_collection: {
      allowed_countries: ["IN"], // Optionally restrict allowed countries
    },
  });

  if (!session.url) {
    throw new ApiError(400, "Error while creating session");
  }
  // Save the purchase record
  newPurchase.paymentId = session.id;
  await newPurchase.save();

  return res
  .status(200)
  .json(
    new ApiResponse(200, {url : session.url}, "payment Session created successfully")
  )
});
export const stripeWebhook = async (req, res) => {
  let event;

  try {
    const payloadString = JSON.stringify(req.body, null, 2);
    const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret,
    });

    event = stripe.webhooks.constructEvent(payloadString, header, secret);
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  // Handle the checkout session completed event
  if (event.type === "checkout.session.completed") {
    console.log("check session complete is called");

    try {
      const session = event.data.object;

      const purchase = await CoursePurchase.findOne({
        paymentId: session.id,
      }).populate({ path: "courseId" });

      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }

      if (session.amount_total) {
        purchase.amount = session.amount_total / 100; // convert in rupees
      }
      purchase.status = "completed";

      // Make all lectures visible by setting `isPreviewFree` to true
      if (purchase.courseId && purchase.courseId.lectures.length > 0) {
        await Lecture.updateMany(
          { _id: { $in: purchase.courseId.lectures } },
          { $set: { isPreviewFree: true } }
        );
      }

      await purchase.save();

      // Update user's enrolledCourses
      await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolledCourses: purchase?.courseId._id } }, // Add course ID to enrolledCourses
        { new: true }
      );

      // Update course to add user ID to enrolledStudents
      await Course.findByIdAndUpdate(
        purchase.courseId._id,
        { $addToSet: { enrolledStudents: purchase.userId } }, // Add user ID to enrolledStudents
        { new: true }
      );
    } catch (error) {
      console.error("Error handling event:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  res.status(200).send();
};
export const getCourseDetailWithPurchaseStatus = asyncHandler (async(req, res) => {
  const {courseId} = req.params;
  const userId = req.id;

  const course = await Course.findById(courseId).populate({path : "creator"}).populate({path : "lectures"});

  if(!course) {
    throw new ApiError(404, "course not found")
  }
  // console.log("course Detail : ", course);
  
  const purchased = await CoursePurchase.findOne({courseId, userId, status : "completed"})

  return res
  .status(200)
  .json(
    new ApiResponse(200, 
      {course : course, purchased : purchased? true : false}, 
      "Course with purchase status fetched successfully")
  )
})

export const getAllPurchasedCourse = asyncHandler(async(_, res) => {
  const courses = await CoursePurchase.find({status : "completed"}).populate("courseId");
  if(!courses) {
    return res.status(200).json(new ApiResponse(200, [], "No purchased Courses"))
  }
  return res.status(200).json(new ApiResponse(200, courses, "purchased Courses fetched!"));
})