import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";

export interface FirebaseUser extends User {
  // Add any additional properties you need
}

export interface YourDataType {
  id: string;
  title: string;
  createdAt: Timestamp;
  // Add other fields as needed
}