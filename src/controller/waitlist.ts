import { Request, Response } from 'express';
import Usermodel from '../MODEL/users';

const validateEmail = (email: string): boolean => {
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return emailRegex.test(email);
};
export const CollectDetails = async (req: Request, res: Response) => {
   try {
      const { email, type, name, interest, phonenumber, message } = req.body;
      if (!type) {
         res.status(400).json({
            message: "field 'type' is missing on request body",
         });
         return;
      }

      if (!email || !validateEmail(email)) {
         res.status(400).json({
            message: 'Please provide a valid email address',
         });
         return;
      }

      const existingUser = await Usermodel.findOne({ email });
      if (existingUser) {
         if (type == 'waitlist') {
            res.status(409).json({
               message: 'This email is already on our waitlist',
            });
         } else {
            let updateUser;
            updateUser = await Usermodel.updateOne({ email }, { $set: { email, phonenumber, interest, name } });
            if (updateUser.acknowledged) res.status(200).json({ message: 'user info successfully added!' });
            else res.status(400).json({ message: 'Error adding user info' });
         }
         return;
      }

      var count = await Usermodel.countDocuments();
      let newUser;

      if (type == 'waitlist') {
         newUser = new Usermodel({
            waitlistId: count,
            email: email.toLowerCase(),
            joinedAt: new Date(),
            interest: 'null',
            phonenumber: 0,
            message: 'null',
            name: 'null',
         });
      } else {
         newUser = new Usermodel({
            waitlistId: count,
            name: name.trim(),
            email: email.toLowerCase(),
            interest,
            phonenumber,
            message,
            joinedAt: new Date(),
         });
      }

      await newUser?.save();

      res.status(201).json({
         message: 'Successfully added to waitlist',
         user: {
            waitlistId: count + 1,
            name: type == 'waitlist' ? `customer ${count}` : newUser.name,
            email: newUser?.email,
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
      const users = await Usermodel.find().select('email name joinedAt').sort({ joinedAt: -1 });

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
