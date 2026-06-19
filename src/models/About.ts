import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAbout extends Document {
  title: string;
  caption: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}

const AboutSchema = new Schema<IAbout>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    caption: {
      type: String,
      required: [true, "Caption is required"],
      trim: true,
    },
    body: {
      type: String,
      required: [true, "Body is required"],
    },
  },
  { timestamps: true },
);

const About: Model<IAbout> =
  mongoose.models.About || mongoose.model<IAbout>("About", AboutSchema);

export default About;
