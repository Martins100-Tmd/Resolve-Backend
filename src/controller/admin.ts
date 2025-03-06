import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import Adminmodel from '../MODEL/admin';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
app.use(cookieParser());
app.use(express.json());
export const signUp = async (req: Request, res: Response) => {
   try {
      const { name, email, role, password } = req.body;

      if (!name || !email || !password) {
         res.status(400).json({ message: 'required feild missing' });
         return;
      }

      const existingAdmin = await Adminmodel.findOne({ email });
      if (existingAdmin) {
         res.status(400).json({ message: 'email as been used already' });
         return;
      }

      const admin = new Adminmodel({
         name,
         email,
         role,
         password,
      });

      await admin.save();
      res.status(201).json({ message: 'Admin created succesfully', admin });
      return;
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'unable to create Admin' });
   }
};

const generateCookies = (AdminId: string) => {
   const secretKey = process.env.SECRET_KEY as string;
   const token = jwt.sign({ id: AdminId }, secretKey, {
      expiresIn: '1d',
   });
   return token;
};
export const login = async (req: Request, res: Response) => {
   try {
      const { email, password } = req.body;

      if (!email || !password) {
         res.status(400).json({ message: 'Email and password are required' });
         return;
      }
      const Admin = await Adminmodel.findOne({ email }).select('+password');
      if (!Admin) {
         res.status(400).json({ message: 'Invalid email or password' });
         return;
      }

      if (Admin.lockUntil && Admin.lockUntil > new Date()) {
         const timeRemaining = Math.ceil((Admin.lockUntil.getTime() - Date.now()) / 1000);
         const minutes = Math.floor(timeRemaining / 60);
         const seconds = timeRemaining % 60;
         res.status(423).json({
            message: `Too many attempts, try again later in ${minutes} minutes and ${seconds} seconds.`,
         });
         return;
      }

      const isPasswordValid = await bcrypt.compare(password, Admin.password);
      if (!isPasswordValid) {
         Admin.loginAttempts += 1;

         if (Admin.loginAttempts >= 5) {
            Admin.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
            await Admin.save();
            res.status(423).json({
               message: 'Too many attempts, try again later.',
            });
            return;
         }

         await Admin.save();
         res.status(400).json({
            message: 'Invalid email or password',
            attemptsRemaining: 5 - Admin.loginAttempts,
         });
         return;
      }

      Admin.loginAttempts = 0;
      Admin.lockUntil = null;
      await Admin.save();

      const token = generateCookies(Admin.id);
      res.cookie('token', token, {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         sameSite: 'strict',
         maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
         status: 'success',
         message: 'Login successful',
         Admin: {
            id: Admin._id,
            email: Admin.email,
         },
      });
   } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Failed to login' });
   }
};
