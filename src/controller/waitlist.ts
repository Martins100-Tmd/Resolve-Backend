import { Request, Response } from 'express';
import UserModel from '../MODEL/users';

const validateEmail = (email: string): boolean => {
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return emailRegex.test(email);
};
export const CollectDetails = async (req: Request, res: Response) => {
   try {
      const { name, email, interest, phonenumber } = req.body;
      if (!name || typeof name !== 'string' || name.length < 3) {
         res.status(400).json({
            message: 'Name must be at least 3 characters long',
         });
         return;
      }

      if (!email || !validateEmail(email)) {
         res.status(400).json({
            message: 'Please provide a valid email address',
         });
         return;
      }

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
         res.status(409).json({
            message: 'This email is already on our waitlist',
         });
         return;
      }

      var count = await UserModel.countDocuments();

      const newUser = new UserModel({
         waitlistId: count,
         name: name.trim(),
         email: email.toLowerCase(),
         interest: interest,
         phonenumber: phonenumber,
         joinedAt: new Date(),
      });

      await newUser.save();

      res.status(201).json({
         message: 'Successfully added to waitlist',
         user: {
            waitlistId: count + 1,
            name: newUser.name,
            email: newUser.email,
         },
      });
   } catch (error) {
      console.error('Waitlist registration error:', error);
      res.status(500).json({
         message: 'Unable to join waitlist at this time. Please try again later.',
      });
   }
};

export const GetAllDetails = async (req: Request, res: Response) => {
   try {
      const users = await UserModel.find().select('email name joinedAt').sort({ joinedAt: -1 });

      res.status(200).json({
         message: 'Waitlist retrieved successfully',
         count: users.length,
         users: users,
      });
   } catch (error) {
      console.error('Waitlist retrieval error:', error);
      res.status(500).json({
         message: 'Unable to retrieve waitlist at this time',
      });
   }
};
